import { fixedPageMetadata } from '@/lib/studio/fixed-pages'
export const dynamic = 'force-dynamic'
export function generateMetadata() { return fixedPageMetadata('contact') }
import { ContactPage } from '@/components/marketing/InteriorPages'



export default function Page() { return <ContactPage /> }
