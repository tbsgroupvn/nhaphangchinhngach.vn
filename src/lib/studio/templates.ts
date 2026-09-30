import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { StudioAuth, requireCapability } from './auth'
import { audit, type StudioDatabase } from './database'
import { StudioError } from './errors'
import { uploadedMediaPath } from './media-model'
import {
  defaultTemplateValues,
  templateSettingsKey,
  templateValuesSchema,
  templateFields,
  templateImages,
  type TemplateDocument,
} from './template-model'

export function readTemplates(db: StudioDatabase): TemplateDocument {
  const row = db
    .prepare('SELECT value,updated_at FROM studio_settings WHERE key = ?')
    .get(templateSettingsKey) as
    | { value: string; updated_at: string }
    | undefined
  if (!row)
    return { version: 0, updatedAt: null, values: { ...defaultTemplateValues } }
  const stored = JSON.parse(row.value)
  return {
    version: stored.version,
    updatedAt: row.updated_at,
    values: templateValuesSchema.parse(stored.values),
  }
}
export class StudioTemplates {
  constructor(
    private db: StudioDatabase,
    private auth: StudioAuth,
  ) {}
  get() {
    return readTemplates(this.db)
  }
  private destinationExists(href: string) {
    const path = href.split('#')[0].replace(/\/$/, '') || '/'
    return (
      path === '/sitemap' ||
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
    const { values } = this.get()
    for (const field of templateFields.filter((field) => field.kind === 'link'))
      if (!this.destinationExists(values[field.key])) values[field.key] = ''
    return values
  }
  apply(token: string, expected: number, input: unknown) {
    const values = templateValuesSchema.parse(input)
    return this.db
      .transaction(() => {
        const user = this.auth.session(token)
        if (!user)
          throw new StudioError(
            401,
            'Phiên đăng nhập không còn hợp lệ.',
            'UNAUTHENTICATED',
          )
        requireCapability(user, 'settings.write')
        if (!Number.isSafeInteger(expected) || expected !== this.get().version)
          throw new StudioError(
            409,
            'Nội dung mẫu đã thay đổi. Đối chiếu bản mới trước khi áp dụng.',
            'VERSION_CONFLICT',
          )
        for (const field of templateFields.filter(
          (field) => field.kind === 'link',
        )) {
          if (!this.destinationExists(values[field.key]))
            throw new StudioError(
              409,
              `${field.label}: trang đích chưa công khai.`,
              'TEMPLATE_LINK_UNPUBLISHED',
            )
        }
        for (const path of templateImages(values)) {
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
              'Ảnh mẫu không tồn tại trong thư viện.',
              'MEDIA_NOT_FOUND',
            )
        }
        const version = expected + 1,
          now = new Date().toISOString()
        this.db
          .prepare(
            'INSERT INTO studio_settings (key,value,updated_at) VALUES (?,?,?) ON CONFLICT(key) DO UPDATE SET value=excluded.value,updated_at=excluded.updated_at',
          )
          .run(templateSettingsKey, JSON.stringify({ version, values }), now)
        audit(this.db, user.id, 'templates.applied', templateSettingsKey, {
          version,
        })
        return this.get()
      })
      .immediate()
  }
}
