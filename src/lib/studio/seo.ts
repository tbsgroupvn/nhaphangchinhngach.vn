import { createHash, randomUUID } from 'node:crypto'
import { audit, type StudioDatabase } from './database'
import { StudioAuth, can } from './auth'
import { StudioContent } from './content'
import { StudioError } from './errors'
import { rememberVersion } from './version-floor'
import { StudioTechnicalSeo } from './technical-seo'
import { readSiteSettings } from './site-settings'
import { readTemplates } from './templates'
import { auditDrafts, suggestLinks } from './seo-audit'
import {
  seoTaskSchema,
  type HtmlAudit,
  type SeoRow,
  type SeoTask,
} from './seo-model'

export class StudioSeo {
  constructor(
    private db: StudioDatabase,
    private auth: StudioAuth,
    private content: StudioContent,
  ) {}

  authorize(token: string) {
    const user = this.auth.session(token)
    if (!user)
      throw new StudioError(
        401,
        'Phiên đăng nhập không còn hợp lệ.',
        'UNAUTHENTICATED',
      )
    if (!can(user, 'seo.write') && !can(user, 'content.write'))
      throw new StudioError(403, 'Tài khoản chỉ có quyền xem.', 'FORBIDDEN')
    return user
  }

  documents() {
    return this.content.list().map((item) => this.content.get(item.id))
  }

  publicationKey() {
    const technical = new StudioTechnicalSeo(this.db, this.auth)
    return createHash('sha256')
      .update(
        JSON.stringify({
          publications: this.content.publishedList(),
          site: readSiteSettings(this.db),
          templates: readTemplates(this.db),
          redirects: technical.redirects(),
          settings: technical.settings(),
        }),
      )
      .digest('hex')
  }

  overview(): SeoRow[] {
    const publicationKey = this.publicationKey()
    const reports = this.db
      .prepare('SELECT * FROM studio_seo_audits')
      .all() as {
      document_id: string
      document_version: number
      report: string
    }[]
    const redirectPaths = new StudioTechnicalSeo(this.db, this.auth)
      .redirects()
      .map((item) => item.source)
    return auditDrafts(
      this.documents(),
      redirectPaths,
      readSiteSettings(this.db).payload.identity.name,
    ).map((row) => {
      const stored = reports.find((report) => report.document_id === row.id)
      const report = stored
        ? (JSON.parse(stored.report) as HtmlAudit & { publicationKey?: string })
        : null
      return {
        ...row,
        live: stored
          ? {
              ...(report as HtmlAudit),
              version: stored.document_version,
              stale:
                stored.document_version !== row.version ||
                !row.published ||
                report?.publicationKey !== publicationKey,
            }
          : null,
      }
    })
  }

  saveAudit(
    token: string,
    id: string,
    version: number,
    report: HtmlAudit,
    publicationKey = this.publicationKey(),
  ) {
    return this.db
      .transaction(() => {
        const actor = this.authorize(token),
          document = this.content.get(id)
        if (
          document.version !== version ||
          publicationKey !== this.publicationKey()
        )
          throw new StudioError(
            409,
            'Nội dung đã thay đổi trong lúc quét. Vui lòng quét lại.',
            'VERSION_CONFLICT',
          )
        if (!document.published)
          throw new StudioError(
            409,
            'Trang chưa được xuất bản.',
            'NOT_PUBLISHED',
          )
        this.db
          .prepare(
            'INSERT INTO studio_seo_audits (document_id,document_version,report) VALUES (?,?,?) ON CONFLICT(document_id) DO UPDATE SET document_version=excluded.document_version,report=excluded.report',
          )
          .run(id, version, JSON.stringify({ ...report, publicationKey }))
        audit(this.db, actor.id, 'seo.audited', id, {
          version,
          status: report.status,
          issues: report.issues.length,
        })
        return report
      })
      .immediate()
  }

  tasks(): SeoTask[] {
    return (
      this.db
        .prepare('SELECT * FROM studio_seo_tasks ORDER BY updated_at DESC,id')
        .all() as {
        id: string
        payload: string
        version: number
        updated_at: string
      }[]
    ).map((row) => ({
      ...seoTaskSchema.parse(JSON.parse(row.payload)),
      id: row.id,
      version: row.version,
      updatedAt: row.updated_at,
    }))
  }

  assignees() {
    return this.db
      .prepare(
        "SELECT id,name FROM studio_users WHERE status='active' ORDER BY name,id",
      )
      .all() as { id: string; name: string }[]
  }

  saveTask(
    token: string,
    id: string | null,
    version: number,
    input: unknown,
  ): SeoTask {
    const payload = seoTaskSchema.parse(input)
    return this.db
      .transaction(() => {
        const actor = this.authorize(token)
        const existing = id ? this.tasks().find((task) => task.id === id) : null
        if (id && !existing)
          throw new StudioError(404, 'Không tìm thấy công việc.', 'NOT_FOUND')
        if ((existing?.version || 0) !== version)
          throw new StudioError(
            409,
            'Công việc đã thay đổi. Tải lại trước khi lưu.',
            'VERSION_CONFLICT',
          )
        if (payload.documentId) this.content.get(payload.documentId)
        if (
          payload.assigneeId &&
          !this.assignees().some((user) => user.id === payload.assigneeId)
        )
          throw new StudioError(
            400,
            'Người phụ trách không còn hoạt động.',
            'INVALID_ASSIGNEE',
          )
        const key = id || randomUUID(),
          updatedAt = new Date().toISOString()
        this.db
          .prepare(
            'INSERT INTO studio_seo_tasks (id,payload,version,updated_at) VALUES (?,?,?,?) ON CONFLICT(id) DO UPDATE SET payload=excluded.payload,version=excluded.version,updated_at=excluded.updated_at',
          )
          .run(key, JSON.stringify(payload), version + 1, updatedAt)
        audit(this.db, actor.id, 'seo.task-saved', key, {
          version: version + 1,
          status: payload.status,
        })
        return { ...payload, id: key, version: version + 1, updatedAt }
      })
      .immediate()
  }

  deleteTask(token: string, id: string, version: number) {
    this.db
      .transaction(() => {
        const actor = this.authorize(token),
          existing = this.tasks().find((task) => task.id === id)
        if (!existing)
          throw new StudioError(404, 'Không tìm thấy công việc.', 'NOT_FOUND')
        if (existing.version !== version)
          throw new StudioError(
            409,
            'Công việc đã thay đổi. Tải lại trước khi xóa.',
            'VERSION_CONFLICT',
          )
        rememberVersion(this.db, existing.version)
        this.db.prepare('DELETE FROM studio_seo_tasks WHERE id=?').run(id)
        audit(this.db, actor.id, 'seo.task-deleted', id)
      })
      .immediate()
  }

  suggestions(id: string) {
    return suggestLinks(this.content.get(id), this.documents())
  }
}
