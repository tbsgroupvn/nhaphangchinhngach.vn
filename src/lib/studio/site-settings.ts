import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { StudioAuth, requireCapability } from './auth'
import { audit, type StudioDatabase } from './database'
import { StudioError } from './errors'
import { uploadedMediaPath } from './media-model'
import {
  defaultSiteSettings,
  siteSettingsKey,
  siteSettingsSchema,
  siteSettingImages,
  type SiteSettingsDocument,
} from './site-settings-model'

export function readSiteSettings(db: StudioDatabase): SiteSettingsDocument {
  const row = db
    .prepare('SELECT value,updated_at FROM studio_settings WHERE key = ?')
    .get(siteSettingsKey) as { value: string; updated_at: string } | undefined
  if (!row)
    return {
      version: 0,
      updatedAt: null,
      payload: structuredClone(defaultSiteSettings),
    }
  const stored = JSON.parse(row.value)
  return {
    version: stored.version,
    updatedAt: row.updated_at,
    payload: siteSettingsSchema.parse(stored.payload),
  }
}
export class StudioSiteSettings {
  constructor(
    private db: StudioDatabase,
    private auth: StudioAuth,
  ) {}
  get() {
    return readSiteSettings(this.db)
  }
  private destinationExists(href: string) {
    const path = href.split('#')[0].replace(/\/$/, '') || '/'
    if (path === '/sitemap') return true
    return (
      !!this.db
        .prepare(
          'SELECT id FROM studio_documents WHERE published_path = ? AND published IS NOT NULL',
        )
        .get(path) ||
      !!this.db
        .prepare(
          'SELECT r.id FROM studio_redirects r JOIN studio_documents d ON r.target_id = d.id WHERE r.source = ? AND d.published IS NOT NULL',
        )
        .get(path)
    )
  }
  public() {
    const payload = this.get().payload
    const visible = (link: { href: string }) =>
      this.destinationExists(link.href)
    return {
      ...payload,
      navigation: payload.navigation.filter(visible),
      footer: {
        ...payload.footer,
        columns: payload.footer.columns.map((column) => ({
          ...column,
          links: column.links.filter(visible),
        })),
        legalLinks: payload.footer.legalLinks.filter(visible),
      },
    }
  }
  apply(token: string, expected: number, input: unknown) {
    const payload = siteSettingsSchema.parse(input)
    return this.db
      .transaction(() => {
        const actor = this.auth.session(token)
        if (!actor)
          throw new StudioError(
            401,
            'Phiên đăng nhập không còn hợp lệ.',
            'UNAUTHENTICATED',
          )
        requireCapability(actor, 'settings.write')
        const current = this.get()
        if (!Number.isSafeInteger(expected) || expected !== current.version)
          throw new StudioError(
            409,
            'Cấu hình đã thay đổi. Đối chiếu bản mới trước khi áp dụng.',
            'VERSION_CONFLICT',
          )
        const links = [
          ...payload.navigation,
          ...payload.footer.columns.flatMap((column) => column.links),
          ...payload.footer.legalLinks,
        ]
        for (const link of links)
          if (!this.destinationExists(link.href))
            throw new StudioError(
              409,
              `Liên kết chưa có trang công khai: ${link.href}`,
              'SITE_LINK_UNPUBLISHED',
            )
        for (const path of siteSettingImages(payload)) {
          const id = uploadedMediaPath.exec(path)?.[1]
          if (
            path.startsWith('/api/studio/media/')
              ? !id ||
                !this.db
                  .prepare('SELECT id FROM studio_media WHERE id = ?')
                  .get(id)
              : !existsSync(join(process.cwd(), 'public', path))
          )
            throw new StudioError(
              409,
              'Ảnh cấu hình không tồn tại trong thư viện.',
              'MEDIA_NOT_FOUND',
            )
        }
        const version = current.version + 1,
          now = new Date().toISOString()
        this.db
          .prepare(
            'INSERT INTO studio_settings (key,value,updated_at) VALUES (?,?,?) ON CONFLICT(key) DO UPDATE SET value=excluded.value,updated_at=excluded.updated_at',
          )
          .run(siteSettingsKey, JSON.stringify({ version, payload }), now)
        audit(this.db, actor.id, 'site.applied', siteSettingsKey, { version })
        return this.get()
      })
      .immediate()
  }
}
