import type { Metadata } from 'next'
import { fixedPageMetadata } from '@/lib/studio/fixed-pages'
import {
  IndustryHubPage,
  industryHubHasFilter,
} from '@/components/marketing/IndustryPages'

export const dynamic = 'force-dynamic'

type Props = { searchParams: Record<string, string | string[] | undefined> }

export function generateMetadata({ searchParams }: Props): Metadata {
  const metadata = fixedPageMetadata('industries')
  // Trạng thái lọc chia sẻ được nhưng không index; canonical luôn về hub.
  return industryHubHasFilter(searchParams)
    ? { ...metadata, robots: { index: false, follow: true } }
    : metadata
}

export default function Page({ searchParams }: Props) {
  return <IndustryHubPage searchParams={searchParams} />
}
