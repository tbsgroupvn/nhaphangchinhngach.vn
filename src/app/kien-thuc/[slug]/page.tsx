import { notFound } from 'next/navigation'
import { ArticlePage } from '@/components/marketing/InteriorPages'
import { publishedAt, publishedMetadata } from '@/lib/studio/public-content'

export const dynamic = 'force-dynamic'

type Props = { params: { slug: string } }

function getContent(slug: string) {
  const item = publishedAt(`/kien-thuc/${slug}`)
  if (!item || item.kind !== 'article') notFound()
  return item
}

export function generateMetadata({ params }: Props) {
  const item = getContent(params.slug)
  return publishedMetadata(item, `/kien-thuc/${item.data.slug}`)
}

export default function Page({ params }: Props) {
  return <ArticlePage article={getContent(params.slug).data} />
}
