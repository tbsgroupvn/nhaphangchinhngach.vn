import { SitemapPage, pageMetadata } from '@/components/marketing/InteriorPages'
import { publicTemplates } from '@/lib/studio/public-content'

export function generateMetadata() {
  const copy = publicTemplates().sitemap
  return pageMetadata(copy.seoTitle, copy.seoDescription, '/sitemap')
}

export default SitemapPage
