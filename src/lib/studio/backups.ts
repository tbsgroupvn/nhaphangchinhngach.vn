import Database from 'better-sqlite3'
import { createHash, randomUUID } from 'node:crypto'
import {
  createReadStream,
  existsSync,
  lstatSync,
  mkdirSync,
  readdirSync,
  rmdirSync,
  statfsSync,
  statSync,
  unlinkSync,
} from 'node:fs'
import { open } from 'node:fs/promises'
import { join, resolve, sep } from 'node:path'
import { z } from 'zod'
import { StudioAuth, requireCapability } from './auth'
import { audit, openStudioDatabase, type StudioDatabase } from './database'
import { StudioError } from './errors'
import {
  backupApplicationId,
  backupConfirmation,
  backupJobSchema,
  backupLimit,
  backupManifestKey,
  backupRetention,
  backupSettingKeys,
  type BackupJob,
} from './backup-model'
import {
  backupColumns,
  backupSummary,
  businessFingerprint,
  exportBusinessData,
  insertBackupRow,
  type BackupRow,
  type BackupTable,
} from './backup-data'
import { validateBackup } from './backup-validation'
import { rememberVersion, versionFloor } from './version-floor'

const jobPrefix = 'ops.backup.job.'
const lockKey = 'ops.backup.lock'
const conflict = () =>
  new StudioError(
    409,
    'Website đã thay đổi từ lúc kiểm tra. Kiểm tra lại bản sao trước khi khôi phục.',
    'VERSION_CONFLICT',
  )
const unavailable = () =>
  new StudioError(404, 'Bản sao không tồn tại hoặc đã hết hạn.', 'NOT_FOUND')

async function digestFile(path: string) {
  const hash = createHash('sha256')
  for await (const chunk of createReadStream(path)) hash.update(chunk)
  return hash.digest('hex')
}

export class StudioBackups {
  private root: string
  constructor(
    private db: StudioDatabase,
    private auth: StudioAuth,
    directory: string,
  ) {
    this.root = resolve(directory, 'backups')
  }

  private authorize(token: string) {
    const actor = this.auth.session(token)
    if (!actor)
      throw new StudioError(
        401,
        'Phiên đăng nhập không còn hợp lệ.',
        'UNAUTHENTICATED',
      )
    requireCapability(actor, 'settings.write')
    return actor
  }
  private folder(id: string) {
    z.string().uuid().parse(id)
    const target = resolve(this.root, id)
    if (!target.startsWith(this.root + sep)) throw unavailable()
    if (existsSync(this.root) && lstatSync(this.root).isSymbolicLink())
      throw unavailable()
    if (existsSync(target) && lstatSync(target).isSymbolicLink())
      throw unavailable()
    return target
  }
  private path(id: string) {
    return join(this.folder(id), 'archive.sqlite')
  }
  private cleanupFiles(id: string) {
    const folder = this.folder(id)
    if (!existsSync(folder)) return
    for (const name of ['archive.sqlite', 'snapshot.sqlite'])
      for (const suffix of ['', '-wal', '-shm', '-journal']) {
        const path = join(folder, name + suffix)
        if (existsSync(path)) unlinkSync(path)
      }
    rmdirSync(folder)
  }
  private jobs() {
    return (
      this.db
        .prepare('SELECT value FROM studio_settings WHERE key LIKE ?')
        .all(jobPrefix + '%') as { value: string }[]
    ).map((row) => backupJobSchema.parse(JSON.parse(row.value)))
  }
  private cleanupExpired() {
    for (const job of this.jobs()) {
      if (Date.parse(job.expiresAt) > Date.now()) continue
      this.cleanupFiles(job.id)
      this.db
        .prepare('DELETE FROM studio_settings WHERE key=?')
        .run(jobPrefix + job.id)
    }
    if (!existsSync(this.root)) return
    const retained = new Set(this.jobs().map((job) => job.id))
    for (const entry of readdirSync(this.root, { withFileTypes: true })) {
      if (
        !entry.isDirectory() ||
        !z.string().uuid().safeParse(entry.name).success ||
        retained.has(entry.name)
      )
        continue
      if (
        Date.now() - statSync(this.folder(entry.name)).mtimeMs >
        backupRetention
      )
        this.cleanupFiles(entry.name)
    }
  }
  list(token: string) {
    const actor = this.authorize(token)
    return this.jobs()
      .filter(
        (job) =>
          job.actorId === actor.id && Date.parse(job.expiresAt) > Date.now(),
      )
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  }
  private job(token: string, id: string) {
    const actor = this.authorize(token)
    z.string().uuid().parse(id)
    const row = this.db
      .prepare('SELECT value FROM studio_settings WHERE key=?')
      .get(jobPrefix + id) as { value: string } | undefined
    if (!row) throw unavailable()
    const job = backupJobSchema.parse(JSON.parse(row.value))
    if (job.actorId !== actor.id || Date.parse(job.expiresAt) <= Date.now())
      throw unavailable()
    return job
  }
  file(token: string, id: string) {
    const job = this.job(token, id)
    if (job.kind !== 'export' || !existsSync(this.path(id))) throw unavailable()
    return {
      path: this.path(id),
      filename: `tbs-studio-${job.createdAt.slice(0, 10)}-${id.slice(0, 8)}.sqlite`,
      bytes: job.bytes,
    }
  }
  private saveJob(job: BackupJob) {
    backupJobSchema.parse(job)
    this.db
      .prepare('INSERT INTO studio_settings VALUES (?,?,?)')
      .run(jobPrefix + job.id, JSON.stringify(job), job.createdAt)
  }
  private async operation<T>(token: string, run: () => Promise<T>): Promise<T> {
    this.authorize(token)
    const lockId = randomUUID()
    this.db
      .transaction(() => {
        const row = this.db
          .prepare('SELECT value FROM studio_settings WHERE key=?')
          .get(lockKey) as { value: string } | undefined
        if (row && JSON.parse(row.value).expiresAt > Date.now())
          throw new StudioError(
            409,
            'Một tác vụ sao lưu hoặc khôi phục đang chạy. Thử lại sau.',
            'BACKUP_BUSY',
          )
        this.db
          .prepare(
            'INSERT INTO studio_settings VALUES (?,?,?) ON CONFLICT(key) DO UPDATE SET value=excluded.value,updated_at=excluded.updated_at',
          )
          .run(
            lockKey,
            JSON.stringify({
              id: lockId,
              expiresAt: Date.now() + 10 * 60 * 1000,
            }),
            new Date().toISOString(),
          )
      })
      .immediate()
    try {
      this.cleanupExpired()
      return await run()
    } finally {
      this.db
        .prepare(
          "DELETE FROM studio_settings WHERE key=? AND json_extract(value,'$.id')=?",
        )
        .run(lockKey, lockId)
    }
  }
  private reserve(id: string, required: number) {
    if (this.jobs().length >= 8)
      throw new StudioError(
        409,
        'Đã có 8 bản sao hoặc bản kiểm tra. Xóa một bản đã tải về trước khi tạo thêm.',
        'BACKUP_QUOTA',
      )
    mkdirSync(this.root, { recursive: true, mode: 0o700 })
    this.folder(id)
    const disk = statfsSync(this.root)
    const retained = this.jobs().reduce((bytes, job) => bytes + job.bytes, 0)
    if (
      retained + required > 4 * backupLimit ||
      disk.bavail * disk.bsize < required + 64 * 1024 * 1024
    )
      throw new StudioError(
        507,
        'Không đủ dung lượng để sao lưu an toàn.',
        'BACKUP_STORAGE',
      )
    mkdirSync(this.folder(id), { mode: 0o700 })
  }
  export(token: string) {
    return this.operation(token, () => this.makeExport(token))
  }

  private async makeExport(token: string): Promise<BackupJob> {
    const actor = this.authorize(token)
    const size =
      Number(this.db.pragma('page_count', { simple: true })) *
      Number(this.db.pragma('page_size', { simple: true }))
    if (size > backupLimit)
      throw new StudioError(
        413,
        'Cơ sở dữ liệu vượt giới hạn sao lưu 1 GiB.',
        'BACKUP_SIZE',
      )
    const id = randomUUID(),
      started = Date.now()
    this.reserve(id, size * 2)
    const snapshotPath = join(this.folder(id), 'snapshot.sqlite')
    let snapshot: StudioDatabase | undefined,
      archive: StudioDatabase | undefined
    try {
      await this.db.backup(snapshotPath, {
        progress: (info) => {
          if (
            Date.now() - started > 120_000 ||
            info.totalPages *
              Number(this.db.pragma('page_size', { simple: true })) >
              backupLimit
          )
            throw new StudioError(
              413,
              'Bản sao vượt giới hạn dung lượng hoặc thời gian.',
              'BACKUP_SIZE',
            )
          return 256
        },
      })
      snapshot = new Database(snapshotPath, { readonly: true })
      archive = openStudioDatabase(this.path(id))
      const createdAt = new Date().toISOString()
      exportBusinessData(snapshot, archive, createdAt)
      const summary = backupSummary(archive)
      const fingerprint = businessFingerprint(snapshot)
      archive.prepare('INSERT INTO studio_settings VALUES (?,?,?)').run(
        backupManifestKey,
        JSON.stringify({
          format: 'tbs-studio',
          version: 4,
          schemaVersion: 7,
          createdAt,
          summary,
        }),
        createdAt,
      )
      archive.pragma(`application_id = ${backupApplicationId}`)
      archive.pragma('wal_checkpoint(TRUNCATE)')
      archive.pragma('journal_mode = DELETE')
      archive.close()
      archive = undefined
      snapshot.close()
      snapshot = undefined
      for (const suffix of ['', '-wal', '-shm', '-journal'])
        if (existsSync(snapshotPath + suffix)) unlinkSync(snapshotPath + suffix)
      // A fresh allowlisted database, never the raw live snapshot, is downloadable.
      const job = backupJobSchema.parse({
        id,
        kind: 'export',
        actorId: actor.id,
        createdAt,
        expiresAt: new Date(Date.now() + backupRetention).toISOString(),
        sourceCreatedAt: createdAt,
        summary,
        fingerprint,
        bytes: statSync(this.path(id)).size,
        digest: await digestFile(this.path(id)),
      })
      this.db
        .transaction(() => {
          this.authorize(token)
          this.saveJob(job)
          audit(this.db, actor.id, 'backup.created', id, { summary })
        })
        .immediate()
      return job
    } catch (error) {
      archive?.close()
      snapshot?.close()
      this.cleanupFiles(id)
      throw error
    }
  }

  stage(token: string, body: ReadableStream<Uint8Array>) {
    return this.operation(token, async () => {
      const actor = this.authorize(token),
        id = randomUUID()
      this.reserve(id, backupLimit)
      try {
        await this.receive(this.path(id), body)
        const manifest = await validateBackup(this.path(id))
        const digest = await digestFile(this.path(id))
        return this.db
          .transaction(() => {
            this.authorize(token)
            const job: BackupJob = {
              id,
              kind: 'review',
              actorId: actor.id,
              createdAt: new Date().toISOString(),
              expiresAt: new Date(Date.now() + backupRetention).toISOString(),
              sourceCreatedAt: manifest.createdAt,
              summary: manifest.summary,
              bytes: statSync(this.path(id)).size,
              fingerprint: businessFingerprint(this.db),
              digest,
            }
            this.saveJob(job)
            audit(this.db, actor.id, 'backup.checked', id, {
              summary: job.summary,
            })
            return job
          })
          .immediate()
      } catch (error) {
        this.cleanupFiles(id)
        throw error
      }
    })
  }
  private async receive(path: string, body: ReadableStream<Uint8Array>) {
    const file = await open(path, 'wx', 0o600)
    const reader = body.getReader()
    let bytes = 0,
      timer: ReturnType<typeof setTimeout> | undefined
    const deadline = new Promise<never>((_, reject) => {
      timer = setTimeout(
        () =>
          reject(
            new StudioError(
              408,
              'Tải bản sao quá 120 giây. Vui lòng thử lại.',
              'BACKUP_TIMEOUT',
            ),
          ),
        120_000,
      )
    })
    try {
      while (true) {
        const result = await Promise.race([reader.read(), deadline])
        if (result.done) break
        bytes += result.value.byteLength
        if (bytes > backupLimit)
          throw new StudioError(413, 'Tệp sao lưu vượt 1 GiB.', 'BACKUP_SIZE')
        await file.writeFile(result.value)
      }
    } finally {
      clearTimeout(timer)
      void reader.cancel().catch(() => undefined)
      reader.releaseLock()
      await file.close()
    }
  }

  restore(
    token: string,
    id: string,
    fingerprint: string,
    confirmation: string,
  ) {
    return this.operation(token, async () => {
      if (confirmation !== backupConfirmation)
        throw new StudioError(
          400,
          'Nhập chính xác câu xác nhận khôi phục.',
          'CONFIRMATION_REQUIRED',
        )
      const job = this.job(token, id)
      if (fingerprint !== job.fingerprint) throw conflict()
      if (job.kind === 'restored' && job.rollbackId)
        return { rollbackId: job.rollbackId, summary: job.summary }
      if (job.kind !== 'review') throw unavailable()
      const check = () => {
        this.job(token, id)
        if (
          fingerprint !== job.fingerprint ||
          businessFingerprint(this.db) !== fingerprint
        )
          throw conflict()
      }
      check()
      if ((await digestFile(this.path(id))) !== job.digest)
        throw new StudioError(
          400,
          'Tệp đã thay đổi. Hãy kiểm tra lại.',
          'INVALID_BACKUP',
        )
      await validateBackup(this.path(id))
      check()
      const rollback = await this.makeExport(token)
      const source = new Database(this.path(id), { readonly: true })
      try {
        this.db
          .transaction(() => {
            check()
            const actor = this.authorize(token),
              now = new Date().toISOString()
            let maximum = versionFloor(this.db)
            for (const database of [this.db, source]) {
              for (const table of Object.keys(backupColumns)) {
                const row = database
                  .prepare(`SELECT coalesce(max(version),0) v FROM ${table}`)
                  .get() as { v: number }
                maximum = Math.max(maximum, row.v)
              }
              for (const key of backupSettingKeys) {
                const row = database
                  .prepare('SELECT value FROM studio_settings WHERE key=?')
                  .get(key) as { value: string } | undefined
                if (row)
                  maximum = Math.max(
                    maximum,
                    JSON.parse(row.value).version || 0,
                  )
              }
            }
            const restoredVersion = maximum + 1
            if (
              !Number.isSafeInteger(restoredVersion) ||
              restoredVersion > 1_000_000_000
            )
              throw new StudioError(
                409,
                'Giới hạn phiên bản dữ liệu đã đạt. Chưa khôi phục website.',
                'VERSION_CAPACITY',
              )
            rememberVersion(this.db, restoredVersion)
            for (const table of [
              'studio_ai_generations',
              'studio_redirects',
              'studio_seo_audits',
              'studio_revisions',
              'studio_documents',
              'studio_media',
              'studio_seo_tasks',
              'studio_knowledge',
            ])
              this.db.prepare(`DELETE FROM ${table}`).run()
            for (const [table, columns] of Object.entries(backupColumns)) {
              for (const raw of source
                .prepare(`SELECT ${columns} FROM ${table} ORDER BY rowid`)
                .iterate()) {
                const row = { ...(raw as BackupRow) }
                if (table === 'studio_revisions') row.actor_id = null
                else {
                  row.version = restoredVersion
                  row.updated_at = now
                }
                if (table === 'studio_documents') row.updated_by = actor.id
                if (table === 'studio_knowledge') {
                  row.approved_by = null
                  if (row.approved !== null)
                    row.approved_version = restoredVersion
                }
                if (table === 'studio_ai_generations') {
                  const job = JSON.parse(String(row.payload))
                  job.actorId = null
                  job.restored = true
                  if (job.status === 'running') {
                    job.status = 'failed'
                    job.errorCode = 'AI_INTERRUPTED'
                    job.finishedAt = now
                  }
                  row.payload = JSON.stringify(job)
                }
                if (table === 'studio_seo_tasks') {
                  const task = JSON.parse(String(row.payload))
                  if (
                    task.assigneeId &&
                    !this.db
                      .prepare(
                        "SELECT id FROM studio_users WHERE id=? AND status='active'",
                      )
                      .get(task.assigneeId)
                  )
                    task.assigneeId = null
                  row.payload = JSON.stringify(task)
                }
                insertBackupRow(this.db, table as BackupTable, row)
              }
            }
            for (const key of backupSettingKeys) {
              const row = source
                .prepare('SELECT value FROM studio_settings WHERE key=?')
                .get(key) as { value: string }
              const value = JSON.parse(row.value)
              if (typeof value === 'object') value.version = restoredVersion
              this.db
                .prepare(
                  'INSERT INTO studio_settings VALUES (?,?,?) ON CONFLICT(key) DO UPDATE SET value=excluded.value,updated_at=excluded.updated_at',
                )
                .run(key, JSON.stringify(value), now)
            }
            this.db
              .prepare(
                `INSERT INTO studio_revisions (document_id,version,snapshot,action,actor_id,created_at)
            SELECT id,version,draft,'backup-restored',?,? FROM studio_documents`,
              )
              .run(actor.id, now)
            audit(this.db, actor.id, 'backup.restored', id, {
              summary: job.summary,
              rollbackId: rollback.id,
            })
            this.db
              .prepare(
                'UPDATE studio_settings SET value=?,updated_at=? WHERE key=?',
              )
              .run(
                JSON.stringify({
                  ...job,
                  kind: 'restored',
                  rollbackId: rollback.id,
                  completedAt: now,
                }),
                now,
                jobPrefix + id,
              )
          })
          .immediate()
      } finally {
        source.close()
      }
      // A cleanup failure after COMMIT must not misreport a successful restore as failed.
      try {
        this.cleanupFiles(id)
      } catch {
        /* Expired orphan cleanup retries on the next operation. */
      }
      return { rollbackId: rollback.id, summary: job.summary }
    })
  }
  discard(token: string, id: string) {
    return this.operation(token, async () => {
      const job = this.job(token, id)
      this.db
        .transaction(() => {
          const actor = this.authorize(token)
          this.db
            .prepare('DELETE FROM studio_settings WHERE key=?')
            .run(jobPrefix + id)
          audit(this.db, actor.id, 'backup.deleted', id)
        })
        .immediate()
      try {
        this.cleanupFiles(job.id)
      } catch {
        /* Access is revoked; orphan cleanup retries later. */
      }
    })
  }
}
