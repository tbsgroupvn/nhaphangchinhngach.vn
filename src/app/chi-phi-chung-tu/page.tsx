import { fixedPageMetadata } from '@/lib/studio/fixed-pages'
export const dynamic = 'force-dynamic'
export function generateMetadata() { return fixedPageMetadata('costs') }
import { CostsPage } from '@/components/marketing/InteriorPages'



export default function Page() { return <CostsPage /> }
