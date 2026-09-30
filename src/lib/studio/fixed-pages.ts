import 'server-only'
import { notFound } from 'next/navigation'
import { copyCollection, fixedTemplate } from './fixed-page-registry'
import { publishedAt, publishedMetadata } from './public-content'
import type { FixedPagePayload } from './content-model'

export function fixedPageCopy(slug: string, preview?: FixedPagePayload) {
  const template = fixedTemplate(slug)
  if (!template) notFound()
  const payload = preview ?? publishedAt(template.path)
  if (!payload || payload.kind !== 'page' || payload.data.slug !== slug)
    notFound()
  return {
    ...payload.data,
    text(key: string) {
      if (!Object.prototype.hasOwnProperty.call(payload.data.fields, key))
        throw new Error(`Missing copy in ${slug}: ${key}`)
      return payload.data.fields[key]
    },
    collection<T>(defaults: T, prefix: string): T {
      return copyCollection(defaults, payload.data.fields, prefix)
    },
  }
}
export function fixedPageMetadata(slug: string) {
  const template = fixedTemplate(slug)
  if (!template) notFound()
  const payload = publishedAt(template.path)
  if (!payload || payload.kind !== 'page') notFound()
  return publishedMetadata(payload, template.path)
}
