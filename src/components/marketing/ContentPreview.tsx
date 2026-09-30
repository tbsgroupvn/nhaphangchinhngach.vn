import HomePage from './HomePage'
import {
  AboutPage,
  OperationsPage,
  ServiceHubPage,
  ProcessPage,
  CostsPage,
  KnowledgePage,
  FAQPage,
  ContactPage,
  PolicyPage,
  ServicePage,
  ArticlePage,
  type PolicySlug,
} from './InteriorPages'
import {
  IndustryCategoryPage,
  IndustryDetailPage,
  IndustryHubPage,
} from './IndustryPages'
import { publicIndustryAtlas } from '@/lib/studio/public-content'
import type { ContentPayload } from '@/lib/studio/content-model'

export default function ContentPreview({
  payload,
}: {
  payload: ContentPayload
}) {
  if (payload.kind === 'article') return <ArticlePage article={payload.data} />
  if (payload.kind === 'service') return <ServicePage service={payload.data} />
  if (payload.kind === 'industry')
    return (
      <IndustryDetailPage industry={payload.data} atlas={publicIndustryAtlas()} />
    )
  if (payload.kind === 'industryCategory')
    return (
      <IndustryCategoryPage
        category={payload.data}
        atlas={publicIndustryAtlas()}
      />
    )
  const pages = {
    home: HomePage,
    about: AboutPage,
    operations: OperationsPage,
    services: ServiceHubPage,
    industries: IndustryHubPage,
    process: ProcessPage,
    costs: CostsPage,
    knowledge: KnowledgePage,
    faq: FAQPage,
    contact: ContactPage,
  }
  if (payload.data.slug.startsWith('policy-'))
    return (
      <PolicyPage
        slug={payload.data.slug.slice(7) as PolicySlug}
        preview={payload}
      />
    )
  const Component = pages[payload.data.slug as keyof typeof pages]
  return <Component preview={payload} />
}
