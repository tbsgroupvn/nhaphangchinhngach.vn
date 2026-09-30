import 'server-only'
import type { Metadata } from 'next'
import { unstable_noStore as noStore } from 'next/cache'
import { permanentRedirect, redirect } from 'next/navigation'
import { indexingAllowed } from './technical-seo-model'
import { searchTitle } from './seo-model'
import { templateCopy } from './template-model'
import { getStudio } from './runtime'
import {
  readIndustrySearchProjection,
  readPublicIndustryAtlas,
  type PublicIndustryAtlas,
} from '../industries/public'
import type { ContentKind, ContentPayload } from './content-model'
import {
  site,
  type Article,
  type Industry,
  type Service,
} from '../../data/marketing'

export function publishedAt(path: string) {
  noStore()
  const payload = getStudio().content.publishedAt(path)
  if (!payload) publishedRedirect(path)
  return payload
}
export function publishedRedirect(path: string) {
  noStore()
  const destination = getStudio().technical.resolve(path)
  if (destination) {
    const url = destination.path === '/' ? '/' : `${destination.path}/`
    if (destination.status === 308) permanentRedirect(url)
    redirect(url)
  }
}
export function publicSeoSettings() {
  noStore()
  const settings = getStudio().technical.settings()
  return {
    ...settings,
    indexable: indexingAllowed(
      process.env.NEXT_PUBLIC_SITE_INDEXABLE === 'true',
      settings.blockIndexing,
    ),
  }
}
export function publicSiteSettings() {
  noStore()
  return getStudio().siteSettings.public()
}
export function publicTemplates() {
  noStore()
  return templateCopy(getStudio().templates.public())
}
export function publishedItems(kind: 'article'): Article[]
export function publishedItems(kind: 'industry'): Industry[]
export function publishedItems(kind: 'service'): Service[]
export function publishedItems(kind: ContentKind): ContentPayload['data'][] {
  noStore()
  return getStudio()
    .content.publishedList()
    .flatMap(({ payload }) => (payload.kind === kind ? [payload.data] : []))
}
export function publishedPages() {
  noStore()
  return [
    ...getStudio()
      .content.publishedList()
      .map((item) => ({
        path: item.path,
        title: item.payload.data.title,
        noindex: item.payload.seo.noindex,
        updatedAt: item.updatedAt,
      })),
  ]
}
export function publishedMetadata(
  payload: ContentPayload,
  path: string,
): Metadata {
  const { seo } = payload
  const { identity } = publicSiteSettings()
  const canonical = seo.canonical || path
  const url = `${site.url}${canonical === '/' ? '/' : `${canonical.replace(/\/$/, '')}/`}`
  const index = publicSeoSettings().indexable && !seo.noindex
  return {
    title: { absolute: searchTitle(payload, identity.name) },
    description: seo.description,
    alternates: { canonical: url },
    robots: { index, follow: index },
    openGraph: {
      title: searchTitle(payload, identity.name),
      description: seo.description,
      url,
      siteName: identity.name,
      locale: 'vi_VN',
      type: 'website',
      images: seo.image
        ? [
            {
              url: seo.image,
              alt: payload.data.imageAlts?.[seo.image] ?? payload.data.title,
            },
          ]
        : [{ url: identity.shareImage, alt: identity.shareImageAlt }],
    },
  }
}
export function publicIndustryAtlas() {
  noStore()
  return readPublicIndustryAtlas(getStudio().db)
}
export function publicIndustrySearch(atlas: PublicIndustryAtlas) {
  noStore()
  try {
    return readIndustrySearchProjection(atlas, {
      db: getStudio().db,
      // Chỉ dùng trên server kiểm thử cách ly để giả lập lỗi dựng chỉ mục.
      buildIndex:
        process.env.STUDIO_FAULT_INDUSTRY_INDEX === 'fail'
          ? () => {
              throw new Error('Injected industry index failure')
            }
          : undefined,
    })
  } catch {
    return {
      index: [],
      sourceVersion: atlas.version,
      generatedAt: '',
      stale: false,
      unavailable: true,
      diagnostic: 'Search index is temporarily unavailable.',
    }
  }
}
export function publicMediaAlt(mediaId: string) {
  noStore()
  const row = getStudio()
    .db.prepare('SELECT alt FROM studio_media WHERE id=?')
    .get(mediaId) as { alt: string } | undefined
  return row?.alt.trim() || ''
}
