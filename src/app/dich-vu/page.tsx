import { fixedPageMetadata } from '@/lib/studio/fixed-pages'
export const dynamic = 'force-dynamic'
export function generateMetadata() { return fixedPageMetadata('services') }
import { ServiceHubPage } from '@/components/marketing/InteriorPages'



export default function Page() { return <ServiceHubPage /> }
