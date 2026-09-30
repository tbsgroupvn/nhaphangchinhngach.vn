import { fixedPageMetadata } from '@/lib/studio/fixed-pages'
export const dynamic = 'force-dynamic'
export function generateMetadata() { return fixedPageMetadata('knowledge') }
import { KnowledgePage } from '@/components/marketing/InteriorPages'



type SearchParams = { q?: string | string[]; category?: string | string[] }

export default function Page({ searchParams }: { searchParams: SearchParams }) {
  const first = (value: string | string[] | undefined) => Array.isArray(value) ? value[0] : value
  return <KnowledgePage q={first(searchParams.q)} category={first(searchParams.category)} />
}
