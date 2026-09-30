import { z } from 'zod'

export const uploadLimit = 8 * 1024 * 1024
export const mediaMetadataSchema = z
  .object({
    title: z.string().trim().min(1).max(160),
    alt: z.string().trim().max(500),
    source: z.string().trim().max(500),
  })
  .strict()
export type MediaMetadata = z.infer<typeof mediaMetadataSchema>
export type MediaItem = MediaMetadata & {
  id: string
  url: string
  filename: string
  width: number
  height: number
  bytes: number
  mime: 'image/webp'
  version: number
  createdAt: string
  updatedAt: string
}
export type MediaUsage = {
  editorPath?: string
  documentId: string
  title: string
  path: string
  locations: ('draft' | 'published' | 'history')[]
}
export const uploadedMediaPath =
  /^\/api\/studio\/media\/([a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12})\/$/
