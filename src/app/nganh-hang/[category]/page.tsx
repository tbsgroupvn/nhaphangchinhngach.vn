import { notFound } from 'next/navigation'
import {
  IndustryCategoryPage,
  JsonLd,
  industryBreadcrumbJsonLd,
} from '@/components/marketing/IndustryPages'
import {
  publicIndustryAtlas,
  publishedAt,
  publishedMetadata,
} from '@/lib/studio/public-content'

export const dynamic = 'force-dynamic'

type Props = { params: { category: string } }

function resolveCategory(slug: string) {
  // publishedAt tự chuyển hướng 308 cho URL một cấp cũ.
  const item = publishedAt(`/nganh-hang/${slug}`)
  if (!item || item.kind !== 'industryCategory') notFound()
  const atlas = publicIndustryAtlas()
  const category = atlas.categories.find((entry) => entry.slug === item.data.slug)
  // Nhóm rỗng không được xuất hiện public.
  if (!category || !atlas.industries.some((entry) => entry.categorySlug === category.slug))
    notFound()
  return { item, atlas, category }
}

export function generateMetadata({ params }: Props) {
  const { item, category } = resolveCategory(params.category)
  return publishedMetadata(item, category.path)
}

export default function Page({ params }: Props) {
  const { atlas, category } = resolveCategory(params.category)
  return (
    <>
      <JsonLd
        data={industryBreadcrumbJsonLd([
          { name: 'Trang chủ', path: '/' },
          { name: 'Ngành hàng', path: '/nganh-hang' },
          { name: category.title, path: category.path },
        ])}
      />
      <IndustryCategoryPage category={category} atlas={atlas} />
    </>
  )
}
