import { beforeEach, afterEach, test } from 'node:test'
import assert from 'node:assert/strict'
import Database from 'better-sqlite3'
import { mkdtempSync, readFileSync, rmSync, copyFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { basename, join, resolve, sep } from 'node:path'
import sharp from 'sharp'
import { openStudioDatabase } from '../../src/lib/studio/database'
import { StudioAuth } from '../../src/lib/studio/auth'
import { StudioAiProvider } from '../../src/lib/studio/ai-provider'
import { StudioContent } from '../../src/lib/studio/content'
import { StudioMedia } from '../../src/lib/studio/media'
import { StudioTemplates } from '../../src/lib/studio/templates'
import { StudioBackups } from '../../src/lib/studio/backups'
import { businessFingerprint } from '../../src/lib/studio/backup-data'
import { StudioSiteSettings } from '../../src/lib/studio/site-settings'
import { StudioTechnicalSeo } from '../../src/lib/studio/technical-seo'
import { StudioSeo } from '../../src/lib/studio/seo'
import { validateBackup } from '../../src/lib/studio/backup-validation'
import { randomUUID } from 'node:crypto'
import { StudioIndustryTaxonomy } from '../../src/lib/studio/industry-taxonomy'

let directory: string,
  db: ReturnType<typeof openStudioDatabase>,
  auth: StudioAuth,
  content: StudioContent,
  backups: StudioBackups,
  token: string
const stream = (bytes: Buffer) =>
  new ReadableStream<Uint8Array>({
    start(controller) {
      controller.enqueue(bytes)
      controller.close()
    },
  })

async function prepareReviewedIndustryWithProof() {
  const industry = content.list().find((item) => item.kind === 'industry')!
  const document = content.get(industry.id)
  assert.equal(document.draft.kind, 'industry')
  const mediaLibrary = new StudioMedia(db, auth)
  const uploaded = await mediaLibrary.upload(
    token,
    await sharp({
      create: { width: 48, height: 48, channels: 3, background: '#0083ca' },
    })
      .png()
      .toBuffer(),
    'image/png',
    'industry-proof.png',
  )
  const media = mediaLibrary.update(token, uploaded.id, uploaded.version, {
    title: 'Bằng chứng kho TBS',
    alt: 'Kiện hàng được đối chiếu tại kho TBS',
    source: 'TBS Group',
  })
  const saved = content.save(token, document.id, document.version, {
    ...document.draft,
    data: {
      ...document.draft.data,
      slug: `${document.draft.data.slug}-da-duyet`,
      proofItems: [
        {
          id: 'bang-chung-kho-tbs',
          mediaId: media.id,
          title: 'Hình ảnh đối chiếu tại kho TBS',
          caption: 'Hình ảnh nghiệp vụ được lưu cùng hồ sơ ngành hàng.',
          sourceRef: 'TBS Studio / industry backup test',
          sourceDate: '2026-09-28',
          scopeNote: 'Chỉ minh họa phạm vi kiểm đếm và bàn giao tại kho.',
          rightsStatus: 'approved',
          reviewer: 'Bộ phận Truyền thông TBS',
          reviewedAt: '2026-09-28T08:00:00.000Z',
        },
      ],
      review: {
        status: 'approved',
        reviewer: 'Bộ phận Xuất nhập khẩu TBS',
        reviewedAt: '2026-09-28T08:00:00.000Z',
        nextReviewAt: '2027-03-28T08:00:00.000Z',
      },
    },
  })
  return content.publish(token, saved.id, saved.version)
}
beforeEach(async () => {
  directory = mkdtempSync(join(tmpdir(), 'tbs-backups-'))
  db = openStudioDatabase(join(directory, 'studio.sqlite'))
  auth = new StudioAuth(db)
  content = new StudioContent(db, auth)
  content.seedMarketing()
  const secret = 'backup-test-bootstrap-token-at-least-32-characters'
  await auth.setupOwner(
    {
      name: 'Owner',
      email: 'backup@example.test',
      password: 'Backup-password-729!',
    },
    secret,
    secret,
  )
  token = (
    await auth.login('backup@example.test', 'Backup-password-729!', null)
  ).token
  backups = new StudioBackups(db, auth, directory)
})
afterEach(() => {
  db.close()
  if (
    !resolve(directory).startsWith(resolve(tmpdir()) + sep) ||
    !basename(directory).startsWith('tbs-backups-')
  )
    throw new Error('Unsafe fixture cleanup')
  rmSync(directory, { recursive: true, force: true })
})

test('legacy missing built-in history survives portable restore but cannot become a draft', async () => {
  const doc = content.get(
    content.list().find((row) => row.path === '/gioi-thieu')!.id,
  )
  const saved = content.save(token, doc.id, doc.version, doc.draft)
  const oldSnapshot = structuredClone(saved.draft)
  oldSnapshot.data.image =
    '/images/marketing/nonexistent-review-regression.webp'
  // Reproduce a historical revision recorded by the old permissive writer.
  db.prepare(
    'UPDATE studio_revisions SET snapshot=? WHERE document_id=? AND version=?',
  ).run(JSON.stringify(oldSnapshot), doc.id, saved.version)
  const job = await backups.export(token)
  const review = await backups.stage(
    token,
    stream(readFileSync(backups.file(token, job.id).path)),
  )
  await backups.restore(
    token,
    review.id,
    review.fingerprint,
    'KHOI PHUC WEBSITE',
  )
  const recovered = content.get(doc.id)
  assert.deepEqual(recovered.draft, saved.draft)
  assert.deepEqual(recovered.published, doc.published)
  assert.equal(
    (
      db
        .prepare(
          'SELECT snapshot FROM studio_revisions WHERE document_id=? AND version=?',
        )
        .get(doc.id, saved.version) as { snapshot: string }
    ).snapshot,
    JSON.stringify(oldSnapshot),
  )
  assert.throws(
    () => content.restore(token, doc.id, recovered.version, saved.version),
    { code: 'MEDIA_NOT_FOUND' },
  )
  assert.deepEqual(content.get(doc.id), recovered)
  for (const [field, image] of [
    ['draft', oldSnapshot.data.image],
    ['published', oldSnapshot.data.image],
    ['snapshot', '/images/marketing/../../outside.webp'],
    ['snapshot', `/api/studio/media/${randomUUID()}/`],
  ] as const) {
    const invalid = join(directory, `invalid-${randomUUID()}.sqlite`)
    copyFileSync(backups.file(token, job.id).path, invalid)
    const archive = new Database(invalid)
    try {
      const bad = structuredClone(saved.draft)
      bad.data.image = image
      if (field === 'snapshot')
        archive
          .prepare(
            'UPDATE studio_revisions SET snapshot=? WHERE document_id=? AND version=?',
          )
          .run(JSON.stringify(bad), doc.id, saved.version)
      else
        archive
          .prepare(`UPDATE studio_documents SET ${field}=? WHERE id=?`)
          .run(JSON.stringify(bad), doc.id)
    } finally {
      archive.close()
    }
    await assert.rejects(validateBackup(invalid), { code: 'INVALID_BACKUP' })
  }
})

test('online exports include real business snapshots and media, never credentials or arbitrary settings', async () => {
  const provider = new StudioAiProvider(db, auth, {
    encryptionKey: () => Buffer.alloc(32, 9).toString('base64'),
  })
  provider.save(token, 0, {
    provider: 'openai',
    model: 'backup-fixture-model',
    apiKey: 'sk-backup-fixture-never-export',
    maxOutputTokens: 2048,
    dailyTokenBudget: 100000,
    dailyRequestLimit: 50,
  })
  db.prepare('INSERT INTO studio_settings VALUES (?,?,?)').run(
    'ai.provider.secret',
    'NEVER-EXPORT-THIS-PROVIDER-SECRET',
    new Date().toISOString(),
  )
  const image = await new StudioMedia(db, auth).upload(
    token,
    await sharp({
      create: { width: 80, height: 60, channels: 3, background: '#0083ca' },
    })
      .png()
      .toBuffer(),
    'image/png',
    'backup.png',
  )
  const templates = new StudioTemplates(db, auth)
  templates.apply(token, 0, {
    ...templates.get().values,
    'journey.image': image.url,
  })
  const job = await backups.export(token)
  const file = backups.file(token, job.id)
  const archive = new Database(file.path, { readonly: true })
  try {
    assert.equal(
      (
        archive.prepare('SELECT count(*) n FROM studio_documents').get() as {
          n: number
        }
      ).n,
      26,
    )
    assert.equal(
      (
        archive.prepare('SELECT count(*) n FROM studio_users').get() as {
          n: number
        }
      ).n,
      0,
    )
    assert.equal(
      (
        archive.prepare('SELECT count(*) n FROM studio_sessions').get() as {
          n: number
        }
      ).n,
      0,
    )
    assert.equal(
      (
        archive.prepare('SELECT count(*) n FROM studio_rate_limits').get() as {
          n: number
        }
      ).n,
      0,
    )
    assert.equal(
      archive
        .prepare('SELECT value FROM studio_settings WHERE key=?')
        .get('ai.provider.secret'),
      undefined,
    )
    assert.ok(
      (
        archive
          .prepare('SELECT data FROM studio_media WHERE id=?')
          .get(image.id) as { data: Buffer }
      ).data.length,
    )
    const bytes = readFileSync(file.path)
    assert.equal(
      archive
        .prepare("SELECT value FROM studio_settings WHERE key='ai.provider.v1'")
        .get(),
      undefined,
    )
    const encrypted = (
      db
        .prepare("SELECT value FROM studio_settings WHERE key='ai.provider.v1'")
        .get() as { value: string }
    ).value
    assert.equal(
      bytes.includes(Buffer.from(JSON.parse(encrypted).encryptedKey.value)),
      false,
    )
    assert.equal(
      bytes.includes(Buffer.from('sk-backup-fixture-never-export')),
      false,
    )
    assert.equal(
      bytes.includes(Buffer.from('NEVER-EXPORT-THIS-PROVIDER-SECRET')),
      false,
    )
    const credential = (
      db.prepare('SELECT password_hash FROM studio_users').get() as {
        password_hash: string
      }
    ).password_hash
    assert.equal(bytes.includes(Buffer.from(credential)), false)
  } finally {
    archive.close()
  }
})

test('portable v4 round trip retains Atlas taxonomy, review proof, archive state and redirects', async () => {
  const taxonomy = new StudioIndustryTaxonomy(db, auth)
  const initialTaxonomy = taxonomy.read()
  const inactiveSlug = initialTaxonomy.traits[0].slug
  const savedTaxonomy = taxonomy.save(token, initialTaxonomy.version, {
    traits: initialTaxonomy.traits.map((trait) =>
      trait.slug === inactiveSlug ? { ...trait, active: false, order: 777 } : trait,
    ),
  })
  const published = await prepareReviewedIndustryWithProof()
  const archivedCandidate = content
    .list()
    .find((item) => item.kind === 'industry' && item.id !== published.id)!
  const archived = content.archive(
    token,
    archivedCandidate.id,
    archivedCandidate.version,
  )
  const oldPath = db
    .prepare('SELECT source FROM studio_redirects WHERE target_id=?')
    .get(published.id) as { source: string }

  const exported = await backups.export(token)
  const archive = new Database(backups.file(token, exported.id).path, {
    readonly: true,
  })
  try {
    const manifest = JSON.parse(
      (
        archive
          .prepare('SELECT value FROM studio_settings WHERE key=?')
          .get('backup.manifest.v1') as { value: string }
      ).value,
    )
    assert.equal(manifest.version, 4)
    assert.equal(manifest.schemaVersion, 7)
    assert.equal(archive.pragma('user_version', { simple: true }), 7)
    assert.ok(
      archive
        .prepare('SELECT archived_at FROM studio_documents WHERE id=?')
        .get(archived.id),
    )
    assert.ok(
      archive
        .prepare("SELECT value FROM studio_settings WHERE key='industries.taxonomy.v1'")
        .get(),
    )
  } finally {
    archive.close()
  }

  content.reactivate(token, archived.id, archived.version)
  taxonomy.save(token, savedTaxonomy.version, {
    traits: savedTaxonomy.traits.map((trait) => ({ ...trait, active: true })),
  })
  const review = await backups.stage(
    token,
    stream(readFileSync(backups.file(token, exported.id).path)),
  )
  await backups.restore(
    token,
    review.id,
    review.fingerprint,
    'KHOI PHUC WEBSITE',
  )

  const restored = content.get(published.id)
  assert.equal(restored.publishedPath, published.publishedPath)
  assert.ok(restored.version > published.version)
  assert.equal(restored.published?.kind, 'industry')
  if (restored.published?.kind === 'industry') {
    assert.equal(restored.published.data.review.status, 'approved')
    assert.equal(restored.published.data.proofItems[0].rightsStatus, 'approved')
  }
  assert.ok(content.get(archived.id).archivedAt)
  assert.equal(content.get(archived.id).published, null)
  assert.deepEqual(
    new StudioIndustryTaxonomy(db, auth).read().traits.map((trait) => ({
      slug: trait.slug,
      order: trait.order,
      active: trait.active,
    })),
    savedTaxonomy.traits.map((trait) => ({
      slug: trait.slug,
      order: trait.order,
      active: trait.active,
    })),
  )
  assert.deepEqual(
    db
      .prepare('SELECT source,target_id,status FROM studio_redirects WHERE source=?')
      .get(oldPath.source),
    { source: oldPath.source, target_id: published.id, status: 308 },
  )
})

test('portable v4 rejects broken Atlas relations, taxonomy, rights, archive state and two-level paths', async () => {
  const published = await prepareReviewedIndustryWithProof()
  const exported = await backups.export(token)
  const source = backups.file(token, exported.id).path
  const mutatePayload = (
    file: Database.Database,
    field: 'draft' | 'published',
    change: (payload: Record<string, any>) => void,
  ) => {
    const row = file
      .prepare(`SELECT ${field} value FROM studio_documents WHERE id=?`)
      .get(published.id) as { value: string }
    const payload = JSON.parse(row.value)
    change(payload)
    file
      .prepare(`UPDATE studio_documents SET ${field}=? WHERE id=?`)
      .run(JSON.stringify(payload), published.id)
  }
  const cases: Array<(file: Database.Database) => void> = [
    (file) => {
      mutatePayload(file, 'draft', (payload) => {
        payload.data.categorySlug = 'nhom-khong-ton-tai'
      })
      file
        .prepare('UPDATE studio_documents SET path=? WHERE id=?')
        .run(
          `/nganh-hang/nhom-khong-ton-tai/${published.draft.data.slug}`,
          published.id,
        )
    },
    (file) =>
      mutatePayload(file, 'draft', (payload) => {
        payload.data.traits = ['dac-tinh-khong-ton-tai']
      }),
    (file) =>
      mutatePayload(file, 'published', (payload) => {
        payload.data.review.status = 'pending'
      }),
    (file) =>
      mutatePayload(file, 'published', (payload) => {
        payload.data.proofItems[0].rightsStatus = 'pending'
      }),
    (file) =>
      file
        .prepare('UPDATE studio_documents SET archived_at=? WHERE id=?')
        .run('2026-09-28T10:00:00.000Z', published.id),
    (file) =>
      file
        .prepare('UPDATE studio_documents SET path=? WHERE id=?')
        .run(`/nganh-hang/${published.draft.data.slug}`, published.id),
  ]

  for (const mutate of cases) {
    const tampered = join(directory, `atlas-tampered-${randomUUID()}.sqlite`)
    copyFileSync(source, tampered)
    const file = new Database(tampered)
    mutate(file)
    file.close()
    await assert.rejects(validateBackup(tampered), { code: 'INVALID_BACKUP' })
  }
})

test('reviewed restore is atomic, retains users/secrets, restores draft/live separately and raises versions', async () => {
  db.prepare('INSERT INTO studio_settings VALUES (?,?,?)').run(
    'ai.provider.secret',
    'destination-secret-fixture',
    new Date().toISOString(),
  )
  const page = content.get(
    content.list().find((item) => item.path === '/gioi-thieu')!.id,
  )
  const draft = structuredClone(page.draft)
  draft.data.title = 'Bản nháp trước sao lưu'
  const saved = content.save(token, page.id, page.version, draft)
  const original = await backups.export(token)
  const originalBytes = readFileSync(backups.file(token, original.id).path)
  const changed = structuredClone(draft)
  changed.data.title = 'Nội dung thay đổi sau sao lưu'
  content.save(token, page.id, saved.version, changed)
  const review = await backups.stage(token, stream(originalBytes))
  await assert.rejects(
    () => backups.restore(token, review.id, review.fingerprint, 'wrong'),
    { status: 400 },
  )
  const result = await backups.restore(
    token,
    review.id,
    review.fingerprint,
    'KHOI PHUC WEBSITE',
  )
  assert.ok(backups.file(token, result.rollbackId).path)
  assert.equal(content.get(page.id).draft.data.title, draft.data.title)
  assert.equal(
    content.publishedAt('/gioi-thieu')!.data.title,
    page.published!.data.title,
  )
  assert.ok(content.get(page.id).version > saved.version + 1)
  assert.ok(auth.session(token))
  assert.equal(
    (
      db
        .prepare('SELECT value FROM studio_settings WHERE key=?')
        .get('ai.provider.secret') as { value: string }
    ).value,
    'destination-secret-fixture',
  )
  assert.throws(
    () => content.save(token, page.id, saved.version + 1, changed),
    { status: 409 },
  )
  assert.ok(
    db
      .prepare("SELECT id FROM studio_audit WHERE action='backup.restored'")
      .get(),
  )
})

test('restore refuses stale review and revoked authority without replacing website data', async () => {
  const original = await backups.export(token)
  const review = await backups.stage(
    token,
    stream(readFileSync(backups.file(token, original.id).path)),
  )
  const page = content.get(content.list()[0].id)
  const changed = structuredClone(page.draft)
  changed.data.title = 'Thay đổi sau kiểm tra'
  content.save(token, page.id, page.version, changed)
  await assert.rejects(
    () =>
      backups.restore(
        token,
        review.id,
        review.fingerprint,
        'KHOI PHUC WEBSITE',
      ),
    { code: 'VERSION_CONFLICT' },
  )
  assert.equal(content.get(page.id).draft.data.title, changed.data.title)
  auth.logout(token)
  await assert.rejects(() => backups.export(token), { status: 401 })
  await assert.rejects(() => backups.stage(token, stream(Buffer.from('bad'))), {
    status: 401,
  })
})

test('untrusted archives reject triggers, credentials, malformed payloads, missing media and corrupt files', async () => {
  const original = await backups.export(token)
  const path = backups.file(token, original.id).path
  for (const modify of [
    (file: Database.Database) =>
      file.exec(
        'CREATE TRIGGER malicious AFTER INSERT ON studio_settings BEGIN DELETE FROM studio_documents; END',
      ),
    (file: Database.Database) =>
      file
        .prepare('INSERT INTO studio_settings VALUES (?,?,?)')
        .run('ai.provider.secret', 'unsafe', new Date().toISOString()),
    (file: Database.Database) =>
      file
        .prepare('UPDATE studio_documents SET draft=? WHERE rowid=1')
        .run('{bad'),
    (file: Database.Database) =>
      file
        .prepare(
          "UPDATE studio_documents SET draft=json_set(draft, '$.data.image', '/api/studio/media/00000000-0000-0000-0000-000000000000/') WHERE rowid=1",
        )
        .run(),
  ]) {
    const tampered = join(directory, 'tampered.sqlite')
    copyFileSync(path, tampered)
    const file = new Database(tampered)
    modify(file)
    file.close()
    await assert.rejects(
      () => backups.stage(token, stream(readFileSync(tampered))),
      { code: 'INVALID_BACKUP' },
    )
  }
  await assert.rejects(
    () => backups.stage(token, stream(Buffer.from('not sqlite'))),
    { code: 'INVALID_BACKUP' },
  )
  assert.equal(content.list().length, 26)
})

test('media bytes, shared settings, publication removal and SEO survive backup and database reopen', async () => {
  const media = new StudioMedia(db, auth),
    templates = new StudioTemplates(db, auth)
  const settings = new StudioSiteSettings(db, auth),
    technical = new StudioTechnicalSeo(db, auth)
  const seo = new StudioSeo(db, auth, content)
  const image = await media.upload(
    token,
    await sharp({
      create: { width: 80, height: 60, channels: 3, background: '#0083ca' },
    })
      .png()
      .toBuffer(),
    'image/png',
    'test.png',
  )
  const binary = (
    db.prepare('SELECT data FROM studio_media WHERE id=?').get(image.id) as {
      data: Buffer
    }
  ).data
  templates.apply(token, 0, {
    ...templates.get().values,
    'journey.image': image.url,
  })
  const setting = settings.get()
  settings.apply(token, setting.version, {
    ...setting.payload,
    identity: {
      ...setting.payload.identity,
      name: 'Tên tại thời điểm sao lưu',
    },
  })
  technical.saveSettings(token, 0, {
    googleVerification: ['verification_token_123'],
    blockIndexing: true,
  })
  const about = content.list().find((item) => item.path === '/gioi-thieu')!
  technical.saveRedirect(token, null, 0, {
    source: '/url-sao-luu',
    targetId: about.id,
    status: 308,
  })
  seo.saveTask(token, null, 0, {
    keyword: 'nhập khẩu',
    title: 'Viết bài',
    documentId: about.id,
    assigneeId: null,
    dueDate: '',
    status: 'planned',
    notes: '',
  })
  const faq = content.list().find((item) => item.path === '/hoi-dap')!
  content.unpublish(token, faq.id, faq.version)
  const exported = await backups.export(token),
    bytes = readFileSync(backups.file(token, exported.id).path)
  media.update(token, image.id, image.version, {
    title: image.title,
    alt: 'Sau sao lưu',
    source: image.source,
  })
  const review = await backups.stage(token, stream(bytes))
  db.close()
  db = openStudioDatabase(join(directory, 'studio.sqlite'))
  auth = new StudioAuth(db)
  backups = new StudioBackups(db, auth, directory)
  content = new StudioContent(db, auth)
  assert.ok(backups.file(token, exported.id).path)
  await backups.restore(
    token,
    review.id,
    review.fingerprint,
    'KHOI PHUC WEBSITE',
  )
  assert.equal(
    new StudioSiteSettings(db, auth).get().payload.identity.name,
    'Tên tại thời điểm sao lưu',
  )
  assert.equal(
    new StudioTemplates(db, auth).get().values['journey.image'],
    image.url,
  )
  assert.equal(
    new StudioTechnicalSeo(db, auth).resolve('/url-sao-luu')!.path,
    '/gioi-thieu',
  )
  assert.equal(new StudioTechnicalSeo(db, auth).settings().blockIndexing, true)
  assert.equal(new StudioSeo(db, auth, content).tasks().length, 1)
  assert.equal(content.publishedAt('/hoi-dap'), null)
  assert.equal(new StudioMedia(db, auth).get(image.id).alt, image.alt)
  assert.deepEqual(
    (
      db.prepare('SELECT data FROM studio_media WHERE id=?').get(image.id) as {
        data: Buffer
      }
    ).data,
    binary,
  )
  const roundTrip = await backups.export(token)
  assert.ok(
    await backups.stage(
      token,
      stream(readFileSync(backups.file(token, roundTrip.id).path)),
    ),
  )
})

test('an audit failure rolls back the entire restore while preserving the rollback export and review', async () => {
  const exported = await backups.export(token)
  const page = content.get(content.list()[0].id)
  const changed = structuredClone(page.draft)
  changed.data.title = 'Không được mất khi khôi phục lỗi'
  content.save(token, page.id, page.version, changed)
  const review = await backups.stage(
    token,
    stream(readFileSync(backups.file(token, exported.id).path)),
  )
  const before = businessFingerprint(db)
  db.exec(
    "CREATE TRIGGER fail_restore BEFORE INSERT ON studio_audit WHEN NEW.action='backup.restored' BEGIN SELECT RAISE(ABORT, 'test audit failure'); END",
  )
  await assert.rejects(() =>
    backups.restore(token, review.id, review.fingerprint, 'KHOI PHUC WEBSITE'),
  )
  assert.equal(businessFingerprint(db), before)
  assert.ok(backups.list(token).find((job) => job.id === review.id))
  assert.equal(
    backups.list(token).filter((job) => job.kind === 'export').length,
    2,
  )
  db.exec('DROP TRIGGER fail_restore')
  await backups.restore(
    token,
    review.id,
    review.fingerprint,
    'KHOI PHUC WEBSITE',
  )
})

test('permissions, job ownership, expiry and in-flight session revocation are enforced', async () => {
  const owner = auth.session(token)!
  const exported = await backups.export(token)
  for (const role of ['editor', 'seo', 'viewer', 'admin'] as const) {
    await auth.createUser(
      owner,
      {
        name: role + ' user',
        email: role + '@example.test',
        password: 'Other-password-729!',
        role,
      },
      token,
    )
    const other = (
      await auth.login(role + '@example.test', 'Other-password-729!', null)
    ).token
    if (role === 'admin')
      assert.throws(() => backups.file(other, exported.id), { status: 404 })
    else {
      assert.throws(() => backups.list(other), { status: 403 })
      await assert.rejects(() => backups.export(other), { status: 403 })
      await assert.rejects(
        () => backups.stage(other, stream(Buffer.from('bad'))),
        { status: 403 },
      )
    }
  }
  const bytes = readFileSync(backups.file(token, exported.id).path)
  db.prepare(
    "UPDATE studio_settings SET value=json_set(value,'$.expiresAt','2000-01-01T00:00:00.000Z') WHERE key=?",
  ).run('ops.backup.job.' + exported.id)
  assert.throws(() => backups.file(token, exported.id), { status: 404 })
  const body = new ReadableStream<Uint8Array>({
    pull(controller) {
      auth.logout(token)
      controller.enqueue(bytes)
      controller.close()
    },
  })
  await assert.rejects(() => backups.stage(token, body), { status: 401 })
  assert.equal(
    (
      db
        .prepare(
          "SELECT count(*) n FROM studio_settings WHERE key LIKE 'ops.backup.job.%'",
        )
        .get() as { n: number }
    ).n,
    0,
  )
})

test('seed invariants, manifest counts, image payloads and modified staged files are rejected', async () => {
  const image = await new StudioMedia(db, auth).upload(
    token,
    await sharp({
      create: { width: 32, height: 32, channels: 3, background: '#0083ca' },
    })
      .png()
      .toBuffer(),
    'image/png',
    'test.png',
  )
  const exported = await backups.export(token),
    path = backups.file(token, exported.id).path
  for (const modify of [
    (file: Database.Database) =>
      file
        .prepare("UPDATE studio_revisions SET action='created' WHERE id=1")
        .run(),
    (file: Database.Database) =>
      file
        .prepare(
          "UPDATE studio_settings SET value=json_set(value,'$.summary.documents',27) WHERE key='backup.manifest.v1'",
        )
        .run(),
    (file: Database.Database) =>
      file
        .prepare('UPDATE studio_media SET data=?,bytes=? WHERE id=?')
        .run(Buffer.from('not an image'), 12, image.id),
    (file: Database.Database) =>
      file.prepare('UPDATE studio_documents SET version=0 WHERE rowid=1').run(),
  ]) {
    const tampered = join(directory, 'tampered.sqlite')
    copyFileSync(path, tampered)
    const file = new Database(tampered)
    modify(file)
    file.close()
    await assert.rejects(
      () => backups.stage(token, stream(readFileSync(tampered))),
      { code: 'INVALID_BACKUP' },
    )
  }
  const review = await backups.stage(token, stream(readFileSync(path)))
  const staged = new Database(
    join(directory, 'backups', review.id, 'archive.sqlite'),
  )
  staged
    .prepare(
      "UPDATE studio_documents SET draft=json_set(draft,'$.data.title','Tampered') WHERE rowid=1",
    )
    .run()
  staged.close()
  await assert.rejects(
    () =>
      backups.restore(
        token,
        review.id,
        review.fingerprint,
        'KHOI PHUC WEBSITE',
      ),
    { code: 'INVALID_BACKUP' },
  )
})

test('restoring absent entities never reuses a version held by an old editor', async () => {
  const a = await backups.export(token),
    bytesA = readFileSync(backups.file(token, a.id).path)
  const payload = structuredClone(
    content.get(content.list().find((item) => item.kind === 'article')!.id)
      .draft,
  )
  payload.data.slug = 'restore-version-regression'
  const created = content.create(token, payload)
  const b = await backups.export(token),
    bytesB = readFileSync(backups.file(token, b.id).path)
  const stale = content.save(token, created.id, created.version, payload)
  const reviewA = await backups.stage(token, stream(bytesA))
  await backups.restore(
    token,
    reviewA.id,
    reviewA.fingerprint,
    'KHOI PHUC WEBSITE',
  )
  assert.throws(() => content.get(created.id), { status: 404 })
  const reviewB = await backups.stage(token, stream(bytesB))
  await backups.restore(
    token,
    reviewB.id,
    reviewB.fingerprint,
    'KHOI PHUC WEBSITE',
  )
  assert.throws(() => content.save(token, created.id, stale.version, payload), {
    code: 'VERSION_CONFLICT',
  })
})

test('backup round trips retain the actual published service and article ordering', async () => {
  const before = content.publishedList().map((item) => item.payload.data.slug)
  const exported = await backups.export(token)
  const review = await backups.stage(
    token,
    stream(readFileSync(backups.file(token, exported.id).path)),
  )
  await backups.restore(
    token,
    review.id,
    review.fingerprint,
    'KHOI PHUC WEBSITE',
  )
  const after = content.publishedList().map((item) => item.payload.data.slug)
  assert.deepEqual(after, before)
})

test('completed restore requests are retryable without applying twice', async () => {
  const exported = await backups.export(token)
  const review = await backups.stage(
    token,
    stream(readFileSync(backups.file(token, exported.id).path)),
  )
  const first = await backups.restore(
    token,
    review.id,
    review.fingerprint,
    'KHOI PHUC WEBSITE',
  )
  const fingerprint = businessFingerprint(db)
  const second = await backups.restore(
    token,
    review.id,
    review.fingerprint,
    'KHOI PHUC WEBSITE',
  )
  assert.deepEqual(first, second)
  assert.equal(businessFingerprint(db), fingerprint)
  assert.equal(
    (
      db
        .prepare(
          "SELECT count(*) n FROM studio_audit WHERE action='backup.restored'",
        )
        .get() as { n: number }
    ).n,
    1,
  )
  assert.ok(backups.list(token).some((job) => job.id === review.id))
})

test('failed deletion audit preserves the downloadable file and its job', async () => {
  const job = await backups.export(token)
  db.exec(
    "CREATE TRIGGER fail_delete BEFORE INSERT ON studio_audit WHEN NEW.action='backup.deleted' BEGIN SELECT RAISE(ABORT, 'test deletion failure'); END",
  )
  await assert.rejects(() => backups.discard(token, job.id))
  assert.ok(readFileSync(backups.file(token, job.id).path).length)
})

test('a service publication cannot bypass reserved legacy route aliases through a backup', async () => {
  const exported = await backups.export(token)
  const tampered = join(directory, 'tampered.sqlite')
  copyFileSync(backups.file(token, exported.id).path, tampered)
  const file = new Database(tampered)
  const payload = structuredClone(
    content.get(content.list().find((item) => item.kind === 'service')!.id)
      .draft,
  )
  payload.data.slug = 'van-chuyen-quoc-te'
  const id = randomUUID(),
    now = new Date().toISOString(),
    json = JSON.stringify(payload)
  file
    .prepare(`INSERT INTO studio_documents
      (id,kind,path,draft,published,published_path,version,updated_by,updated_at,published_at,archived_at)
      VALUES (?,?,?,?,?,?,?,?,?,?,NULL)`)
    .run(
      id,
      'service',
      '/dich-vu/van-chuyen-quoc-te',
      json,
      json,
      '/dich-vu/van-chuyen-quoc-te',
      1,
      null,
      now,
      now,
    )
  file
    .prepare(
      "UPDATE studio_settings SET value=json_set(value,'$.summary.documents',27,'$.summary.publications',27) WHERE key='backup.manifest.v1'",
    )
    .run()
  file.close()
  await assert.rejects(() => validateBackup(tampered), {
    code: 'INVALID_BACKUP',
  })
})

test('validation reserves history capacity for revisions added by restore', async () => {
  const exported = await backups.export(token)
  const tampered = join(directory, 'tampered.sqlite')
  copyFileSync(backups.file(token, exported.id).path, tampered)
  const file = new Database(tampered)
  const article = content.get(
    content.list().find((item) => item.kind === 'article')!.id,
  )
  const payload = {
    kind: 'article',
    data: {
      slug: 'capacity',
      title: 'Title',
      summary: 'Summary',
      image: article.draft.data.image,
      category: 'Category',
      categorySlug: 'category',
      sections: [{ heading: 'Heading', body: ['Body'] }],
    },
    seo: {
      title: 'Title',
      description: '',
      canonical: '',
      noindex: false,
      image: '',
    },
  }
  const insert = file.prepare(
    "INSERT INTO studio_revisions (document_id,version,snapshot,action,actor_id,created_at) VALUES (?,?,?,'saved',NULL,?)",
  )
  file.transaction(() => {
    for (let index = 2; index <= 99977; index++)
      insert.run(
        article.id,
        index,
        JSON.stringify(payload),
        new Date().toISOString(),
      )
    file
      .prepare('UPDATE studio_documents SET version=100000 WHERE id=?')
      .run(article.id)
    file
      .prepare(
        "UPDATE studio_settings SET value=json_set(value,'$.summary.revisions',100000) WHERE key='backup.manifest.v1'",
      )
      .run()
  })()
  file.close()
  await assert.rejects(() => validateBackup(tampered), {
    code: 'INVALID_BACKUP',
  })
})
