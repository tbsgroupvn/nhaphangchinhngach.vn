import { randomUUID } from 'node:crypto'
import sharp, { type OutputInfo } from 'sharp'
import { z } from 'zod'
import { StudioAuth, requireCapability } from './auth'
import { audit, type StudioDatabase } from './database'
import { StudioError } from './errors'
import { rememberVersion } from './version-floor'
import { contentImages } from './media-references'
import type { ContentPayload } from './content-model'
import { readSiteSettings } from './site-settings'
import { siteSettingImages } from './site-settings-model'
import { templateImages } from './template-model'
import { readTemplates } from './templates'
import {
  mediaMetadataSchema,
  uploadLimit,
  type MediaItem,
  type MediaUsage,
} from './media-model'

const columns =
  'id,title,alt,source,filename,width,height,bytes,version,created_at AS createdAt,updated_at AS updatedAt'
const filenameSchema = z
  .string()
  .trim()
  .min(1)
  .max(180)
  .regex(/^[^/\\\u0000-\u001f\u007f]+$/)
let processing = 0
const notFound = () => new StudioError(404, 'Không tìm thấy ảnh.', 'NOT_FOUND')
const itemOf = (row: Omit<MediaItem, 'url' | 'mime'>): MediaItem => ({
  ...row,
  mime: 'image/webp',
  url: `/api/studio/media/${row.id}/`,
})

export class StudioMedia {
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
    requireCapability(user, 'media.write')
    return user
  }
  private version(item: MediaItem, expected: number) {
    if (!Number.isSafeInteger(expected) || item.version !== expected)
      throw new StudioError(
        409,
        'Ảnh đã được cập nhật. Tải bản mới trước khi lưu.',
        'VERSION_CONFLICT',
      )
  }
  list(): MediaItem[] {
    return (
      this.db
        .prepare(
          `SELECT ${columns} FROM studio_media ORDER BY created_at DESC,id`,
        )
        .all() as Omit<MediaItem, 'url' | 'mime'>[]
    ).map(itemOf)
  }
  get(id: string): MediaItem {
    const row = this.db
      .prepare(`SELECT ${columns} FROM studio_media WHERE id = ?`)
      .get(id) as Omit<MediaItem, 'url' | 'mime'> | undefined
    if (!row) throw notFound()
    return itemOf(row)
  }
  async upload(
    token: string,
    input: Buffer,
    mime: string,
    filename: string,
  ): Promise<MediaItem> {
    this.authorize(token)
    filenameSchema.parse(filename)
    if (!input.length || input.length > uploadLimit)
      throw new StudioError(
        413,
        'Ảnh vượt giới hạn 8 MB hoặc không có dữ liệu.',
        'UPLOAD_SIZE',
      )
    const png = input
      .subarray(0, 8)
      .equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))
    const jpeg = input[0] === 255 && input[1] === 216 && input[2] === 255
    const webp =
      input.toString('ascii', 0, 4) === 'RIFF' &&
      input.toString('ascii', 8, 12) === 'WEBP'
    const avif =
      input.toString('ascii', 4, 8) === 'ftyp' &&
      ['avif', 'avis'].includes(input.toString('ascii', 8, 12))
    const expected = png
      ? 'image/png'
      : jpeg
        ? 'image/jpeg'
        : webp
          ? 'image/webp'
          : avif
            ? 'image/avif'
            : ''
    if (!expected || mime !== expected)
      throw new StudioError(
        415,
        'Chỉ nhận ảnh JPEG, PNG, WebP hoặc AVIF đúng định dạng.',
        'UPLOAD_TYPE',
      )
    if (processing >= 2)
      throw new StudioError(
        429,
        'Đang xử lý ảnh khác. Vui lòng thử lại.',
        'UPLOAD_BUSY',
      )
    processing += 1
    try {
      let result: { data: Buffer; info: OutputInfo }
      try {
        const decoder = sharp(input, {
          failOn: 'warning',
          limitInputPixels: 20_000_000,
        })
        const metadata = await decoder.metadata()
        if (
          !['png', 'jpeg', 'webp', 'heif'].includes(metadata.format || '') ||
          (metadata.pages || 1) !== 1
        )
          throw new Error('unsupported image')
        result = await decoder
          .rotate()
          .resize({
            width: 2400,
            height: 2400,
            fit: 'inside',
            withoutEnlargement: true,
          })
          .webp({ quality: 84 })
          .timeout({ seconds: 5 })
          .toBuffer({ resolveWithObject: true })
      } catch {
        throw new StudioError(
          400,
          'Không đọc được ảnh tĩnh hợp lệ, hoặc ảnh vượt 20 triệu điểm ảnh.',
          'INVALID_IMAGE',
        )
      }
      return this.db
        .transaction(() => {
          const actor = this.authorize(token)
          const usage = this.db
            .prepare(
              'SELECT COUNT(*) AS count,COALESCE(SUM(bytes),0) AS bytes FROM studio_media',
            )
            .get() as { count: number; bytes: number }
          if (
            usage.count >= 2000 ||
            usage.bytes + result.data.length > 512 * 1024 * 1024
          )
            throw new StudioError(
              413,
              'Thư viện đã đạt giới hạn 2.000 ảnh hoặc 512 MB.',
              'MEDIA_QUOTA',
            )
          const id = randomUUID(),
            now = new Date().toISOString()
          this.db
            .prepare(
              'INSERT INTO studio_media (id,title,alt,source,filename,width,height,bytes,data,version,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?,?,1,?,?)',
            )
            .run(
              id,
              filename.slice(0, 160),
              '',
              '',
              filename,
              result.info.width,
              result.info.height,
              result.data.length,
              result.data,
              now,
              now,
            )
          audit(this.db, actor.id, 'media.uploaded', id, {
            filename,
            bytes: result.data.length,
          })
          return this.get(id)
        })
        .immediate()
    } finally {
      processing -= 1
    }
  }
  usage(id: string): MediaUsage[] {
    const item = this.get(id)
    const documents = this.db
      .prepare('SELECT id,path,draft,published FROM studio_documents')
      .all() as {
      id: string
      path: string
      draft: string
      published: string | null
    }[]
    const history = this.db
      .prepare('SELECT document_id,snapshot FROM studio_revisions')
      .all() as { document_id: string; snapshot: string }[]
    const matches = (json: string) =>
      contentImages(JSON.parse(json) as ContentPayload).includes(item.url)
    const usedByDocuments = documents.flatMap((document) => {
      const locations: MediaUsage['locations'] = []
      if (matches(document.draft)) locations.push('draft')
      if (document.published && matches(document.published))
        locations.push('published')
      if (
        history.some(
          (revision) =>
            revision.document_id === document.id && matches(revision.snapshot),
        )
      )
        locations.push('history')
      return locations.length
        ? [
            {
              documentId: document.id,
              title: (JSON.parse(document.draft) as ContentPayload).data.title,
              path: document.path,
              locations,
            },
          ]
        : []
    })
    const shared: MediaUsage[] = siteSettingImages(
      readSiteSettings(this.db).payload,
    ).includes(item.url)
      ? [
          {
            documentId: 'site-settings',
            title: 'Cấu hình website',
            path: '/',
            editorPath: '/admin/settings/',
            locations: ['published'],
          },
        ]
      : []
    const templates: MediaUsage[] = templateImages(
      readTemplates(this.db).values,
    ).includes(item.url)
      ? [
          {
            documentId: 'site-templates',
            title: 'Nội dung mẫu dùng chung',
            path: '/',
            editorPath: '/admin/templates/',
            locations: ['published'],
          },
        ]
      : []
    return [...templates, ...shared, ...usedByDocuments]
  }
  read(id: string, token?: string) {
    const item = this.get(id)
    const user = this.auth.session(token)
    if (!user && !this.isPublished(id)) throw notFound()
    const row = this.db
      .prepare('SELECT data FROM studio_media WHERE id = ?')
      .get(id) as { data: Buffer }
    return { item, data: row.data }
  }
  isPublished(id: string) {
    const url = `/api/studio/media/${id}/`
    if (!this.db.prepare('SELECT id FROM studio_media WHERE id = ?').get(id))
      return false
    if (siteSettingImages(readSiteSettings(this.db).payload).includes(url))
      return true
    if (templateImages(readTemplates(this.db).values).includes(url)) return true
    return (
      this.db
        .prepare(
          'SELECT published FROM studio_documents WHERE published IS NOT NULL',
        )
        .all() as { published: string }[]
    ).some((row) => contentImages(JSON.parse(row.published)).includes(url))
  }
  update(token: string, id: string, expected: number, input: unknown) {
    const payload = mediaMetadataSchema.parse(input)
    return this.db
      .transaction(() => {
        const actor = this.authorize(token),
          item = this.get(id)
        this.version(item, expected)
        this.db
          .prepare(
            'UPDATE studio_media SET title=?,alt=?,source=?,version=version+1,updated_at=? WHERE id=?',
          )
          .run(
            payload.title,
            payload.alt,
            payload.source,
            new Date().toISOString(),
            id,
          )
        audit(this.db, actor.id, 'media.updated', id, { version: expected + 1 })
        return this.get(id)
      })
      .immediate()
  }
  remove(token: string, id: string, expected: number) {
    this.db
      .transaction(() => {
        const actor = this.authorize(token),
          item = this.get(id)
        this.version(item, expected)
        if (this.usage(id).length)
          throw new StudioError(
            409,
            'Ảnh đang có trong nội dung hoặc lịch sử khôi phục. Không thể xóa.',
            'MEDIA_IN_USE',
          )
        rememberVersion(this.db, item.version)
        this.db.prepare('DELETE FROM studio_media WHERE id = ?').run(id)
        audit(this.db, actor.id, 'media.deleted', id)
      })
      .immediate()
  }
}
