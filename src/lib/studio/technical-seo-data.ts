import 'server-only'
import { getStudio } from './runtime'
import {
  indexingAllowed,
  sitemapEntries,
  type TechnicalSeoData,
} from './technical-seo-model'

export function technicalSeoData(): TechnicalSeoData {
  const { technical, content } = getStudio()
  const settings = technical.settings()
  const releaseApproved = process.env.NEXT_PUBLIC_SITE_INDEXABLE === 'true'
  return {
    redirects: technical.redirects(),
    settings,
    releaseApproved,
    indexable: indexingAllowed(releaseApproved, settings.blockIndexing),
    targets: content
      .list()
      .filter((item) => item.publishedPath)
      .map((item) => ({
        id: item.id,
        path: item.publishedPath!,
        title: content.get(item.id).published!.data.title,
      })),
    sitemapPaths: sitemapEntries(content.publishedList(), true).map(
      (item) => item.path,
    ),
  }
}
