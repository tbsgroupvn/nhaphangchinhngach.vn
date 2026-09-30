import { notFound } from 'next/navigation'
import {
  IndustryDetailPage,
  JsonLd,
  industryBreadcrumbJsonLd,
  industryFaqJsonLd,
} from '@/components/marketing/IndustryPages'
import {
  publicIndustryAtlas,
  publishedAt,
  publishedMetadata,
} from '@/lib/studio/public-content'

export const dynamic = 'force-dynamic'

type Props = { params: { category: string; industry: string } }

function resolveIndustry(categorySlug: string, industrySlug: string) {
  const item = publishedAt(`/nganh-hang/${categorySlug}/${industrySlug}`)
  if (!item || item.kind !== 'industry' || item.data.categorySlug !== categorySlug)
    notFound()
  const atlas = publicIndustryAtlas()
  const industry = atlas.industries.find((entry) => entry.slug === item.data.slug)
  const category = atlas.categories.find((entry) => entry.slug === categorySlug)
  if (!industry || !category) notFound()
  return { item, atlas, industry, category }
}

export function generateMetadata({ params }: Props) {
  const { item, industry } = resolveIndustry(params.category, params.industry)
  return publishedMetadata(item, industry.path)
}

export default function Page({ params }: Props) {
  const { atlas, industry, category } = resolveIndustry(
    params.category,
    params.industry,
  )
  return (
    <>
      <JsonLd
        data={industryBreadcrumbJsonLd([
          { name: 'Trang chủ', path: '/' },
          { name: 'Ngành hàng', path: '/nganh-hang' },
          { name: category.title, path: category.path },
          { name: industry.title, path: industry.path },
        ])}
      />
      <JsonLd data={industryFaqJsonLd(industry.faqs)} />
      <IndustryDetailPage industry={industry} atlas={atlas} />
    </>
  )
}
