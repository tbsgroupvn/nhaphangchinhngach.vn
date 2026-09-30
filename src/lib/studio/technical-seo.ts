import { randomUUID } from 'node:crypto'
import { StudioAuth, requireCapability } from './auth'
import { audit, type StudioDatabase } from './database'
import { StudioError } from './errors'
import { rememberVersion } from './version-floor'
import { legacyServiceAliases } from '../../data/marketing'
import {
  normalizePublicPath,
  redirectSchema,
  technicalSettingsSchema,
  type RedirectRule,
  type TechnicalSettings,
} from './technical-seo-model'

const settingsKey = 'seo.technical.v1'
export const reservedRedirectPath =
  /^(?:\/(?:admin|api|studio-preview|images|_next|private|temp|tin-tuc|cau-chuyen-khach-hang)(?:\/|$)|\/(?:sitemap|test-newsletter|tuyen-dung|tu-dien-thuat-ngu|nhap-khau-chinh-ngach)(?:\/|$)|\/chinh-sach(?:$|\/(?:cookie|doi-tra|van-chuyen)$))/

export class StudioTechnicalSeo {
  constructor(
    private db: StudioDatabase,
    private auth: StudioAuth,
  ) {}

  private authorize(token: string) {
    const user = this.auth.session(token)
    if (!user)
      throw new StudioError(
        401,
        'Phiên đăng nhập không còn hợp lệ.',
        'UNAUTHENTICATED',
      )
    // These changes take effect publicly, unlike SEO draft metadata.
    requireCapability(user, 'settings.write')
    return user
  }
  private version(actual: number, expected: number) {
    if (!Number.isSafeInteger(expected) || actual !== expected)
      throw new StudioError(
        409,
        'Dữ liệu đã thay đổi. Đối chiếu bản mới trước khi lưu.',
        'VERSION_CONFLICT',
      )
  }

  redirects(): RedirectRule[] {
    return this.db
      .prepare(
        `SELECT r.id, r.source, r.target_id AS targetId,
      r.status, r.version, r.updated_at AS updatedAt,
      d.published_path AS targetPath, json_extract(d.published, '$.data.title') AS targetTitle
      FROM studio_redirects r JOIN studio_documents d ON d.id = r.target_id
      ORDER BY r.updated_at DESC, r.source`,
      )
      .all() as RedirectRule[]
  }

  resolve(source: string): { path: string; status: 307 | 308 } | null {
    return (
      (this.db
        .prepare(
          `SELECT d.published_path AS path, r.status
      FROM studio_redirects r JOIN studio_documents d ON d.id = r.target_id
      WHERE r.source = ? AND d.published IS NOT NULL AND d.published_path != r.source`,
        )
        .get(normalizePublicPath(source)) as
        | { path: string; status: 307 | 308 }
        | undefined) || null
    )
  }

  saveRedirect(
    token: string,
    id: string | null,
    expected: number,
    input: unknown,
  ) {
    const payload = redirectSchema.parse(input)
    return this.db
      .transaction(() => {
        const actor = this.authorize(token)
        const existing = id
          ? this.redirects().find((item) => item.id === id)
          : null
        if (id && !existing)
          throw new StudioError(404, 'Chuyển hướng đã được xóa.', 'NOT_FOUND')
        this.version(existing?.version || 0, expected)
        if (
          reservedRedirectPath.test(payload.source) ||
          Object.keys(legacyServiceAliases).some(
            (slug) => payload.source === `/dich-vu/${slug}`,
          ) ||
          this.db
            .prepare(
              'SELECT id FROM studio_documents WHERE path = ? OR published_path = ?',
            )
            .get(payload.source, payload.source) ||
          this.db
            .prepare(
              'SELECT id FROM studio_redirects WHERE source = ? AND id != ?',
            )
            .get(payload.source, id || '')
        )
          throw new StudioError(
            409,
            'URL nguồn đang được nội dung hoặc tuyến hệ thống sử dụng.',
            'PATH_CONFLICT',
          )
        if (
          !this.db
            .prepare(
              'SELECT id FROM studio_documents WHERE id = ? AND published IS NOT NULL',
            )
            .get(payload.targetId)
        )
          throw new StudioError(
            409,
            'Trang đích phải là nội dung đã xuất bản, không phải một chuyển hướng khác.',
            'TARGET_UNPUBLISHED',
          )
        const ruleId = id || randomUUID()
        this.db
          .prepare(
            `INSERT INTO studio_redirects (id,source,target_id,status,version,updated_at)
        VALUES (?,?,?,?,?,?) ON CONFLICT(id) DO UPDATE SET source=excluded.source,
        target_id=excluded.target_id,status=excluded.status,version=excluded.version,updated_at=excluded.updated_at`,
          )
          .run(
            ruleId,
            payload.source,
            payload.targetId,
            payload.status,
            expected + 1,
            new Date().toISOString(),
          )
        audit(
          this.db,
          actor.id,
          id ? 'redirect.updated' : 'redirect.created',
          ruleId,
          payload,
        )
        return this.redirects().find((item) => item.id === ruleId)!
      })
      .immediate()
  }

  deleteRedirect(token: string, id: string, expected: number) {
    this.db
      .transaction(() => {
        const actor = this.authorize(token)
        const rule = this.redirects().find((item) => item.id === id)
        if (!rule)
          throw new StudioError(404, 'Chuyển hướng đã được xóa.', 'NOT_FOUND')
        this.version(rule.version, expected)
        rememberVersion(this.db, rule.version)
        this.db.prepare('DELETE FROM studio_redirects WHERE id = ?').run(id)
        audit(this.db, actor.id, 'redirect.deleted', id, {
          source: rule.source,
        })
      })
      .immediate()
  }

  settings(): TechnicalSettings {
    const row = this.db
      .prepare('SELECT value FROM studio_settings WHERE key = ?')
      .get(settingsKey) as { value: string } | undefined
    return row
      ? JSON.parse(row.value)
      : { version: 0, googleVerification: [], blockIndexing: false }
  }

  saveSettings(
    token: string,
    expected: number,
    input: unknown,
  ): TechnicalSettings {
    const payload = technicalSettingsSchema.parse(input)
    return this.db
      .transaction(() => {
        const actor = this.authorize(token)
        this.version(this.settings().version, expected)
        const result = { ...payload, version: expected + 1 }
        this.db
          .prepare(
            `INSERT INTO studio_settings (key,value,updated_at) VALUES (?,?,?)
        ON CONFLICT(key) DO UPDATE SET value=excluded.value,updated_at=excluded.updated_at`,
          )
          .run(settingsKey, JSON.stringify(result), new Date().toISOString())
        audit(this.db, actor.id, 'seo.settings-saved', settingsKey, {
          version: result.version,
          blockIndexing: result.blockIndexing,
          verificationCount: payload.googleVerification.length,
        })
        return result
      })
      .immediate()
  }
}
