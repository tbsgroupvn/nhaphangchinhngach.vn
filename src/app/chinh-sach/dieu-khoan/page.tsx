import { fixedPageMetadata } from '@/lib/studio/fixed-pages'
export const dynamic = 'force-dynamic'
export function generateMetadata() { return fixedPageMetadata('policy-dieu-khoan') }
import { PolicyPage } from '@/components/marketing/InteriorPages'




export default function Page() {
  return <PolicyPage slug="dieu-khoan" />
}
