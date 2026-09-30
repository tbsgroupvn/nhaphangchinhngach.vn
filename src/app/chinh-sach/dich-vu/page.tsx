import { fixedPageMetadata } from '@/lib/studio/fixed-pages'
export const dynamic = 'force-dynamic'
export function generateMetadata() { return fixedPageMetadata('policy-dich-vu') }
import { PolicyPage } from '@/components/marketing/InteriorPages'




export default function Page() {
  return <PolicyPage slug="dich-vu" />
}
