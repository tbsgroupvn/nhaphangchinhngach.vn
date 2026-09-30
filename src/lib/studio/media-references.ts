import type { ContentPayload } from './content-model'
import type { StudioDatabase } from './database'
import { fixedTemplate } from './fixed-page-registry'
import { uploadedMediaPath } from './media-model'
import { StudioError } from './errors'
import { existsSync } from 'node:fs'
import { join } from 'node:path'

export function contentImages(payload: ContentPayload) {
  const images = [payload.data.image, payload.seo.image]
  if (payload.kind === 'page') {
    for (const field of fixedTemplate(payload.data.slug)?.fields || [])
      if (field.kind === 'image') images.push(payload.data.fields[field.key])
  }
  return Array.from(new Set(images.filter(Boolean)))
}
export function assertMediaReferences(
  db: StudioDatabase,
  payload: ContentPayload,
) {
  for (const path of contentImages(payload)) {
    const id = uploadedMediaPath.exec(path)?.[1]
    const exists = id
      ? !!db.prepare('SELECT id FROM studio_media WHERE id = ?').get(id)
      : /^\/images\/marketing\/[a-zA-Z0-9_-]+\.(webp|png|jpe?g|avif)$/.test(
          path,
        ) && existsSync(join(process.cwd(), 'public', path))
    if (!exists)
      throw new StudioError(
        409,
        'Ảnh đã bị xóa hoặc không tồn tại trong thư viện.',
        'MEDIA_NOT_FOUND',
      )
  }
}

export function snapshotMediaAlts(
  db: StudioDatabase,
  payload: ContentPayload,
): ContentPayload {
  const imageAlts: Record<string, string> = {}
  for (const path of contentImages(payload)) {
    const id = uploadedMediaPath.exec(path)?.[1]
    if (!id) continue
    const row = db
      .prepare('SELECT alt FROM studio_media WHERE id = ?')
      .get(id) as { alt: string } | undefined
    if (row) imageAlts[path] = row.alt
  }
  return { ...payload, data: { ...payload.data, imageAlts } } as ContentPayload
}
