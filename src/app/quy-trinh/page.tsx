import { fixedPageMetadata } from '@/lib/studio/fixed-pages'
export const dynamic = 'force-dynamic'
export function generateMetadata() { return fixedPageMetadata('process') }
import { ProcessPage } from '@/components/marketing/InteriorPages'



export default function Page() { return <ProcessPage /> }
