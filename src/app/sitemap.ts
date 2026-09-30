import type { MetadataRoute } from 'next'
import { site } from '@/data/marketing'
import { publicSeoSettings } from '@/lib/studio/public-content'
import { getStudio } from '@/lib/studio/runtime'
import { sitemapEntries } from '@/lib/studio/technical-seo-model'

export const dynamic = 'force-dynamic'

export default function sitemap(): MetadataRoute.Sitemap {
  return sitemapEntries(
    getStudio().content.publishedList(),
    publicSeoSettings().indexable,
  ).map((page) => ({
    url: `${site.url}${page.path === '/' ? '/' : `${page.path}/`}`,
    lastModified: page.updatedAt,
    changeFrequency: 'monthly',
    priority:
      page.path === '/' ? 1 : page.path.startsWith('/chinh-sach/') ? 0.3 : 0.7,
  }))
}
