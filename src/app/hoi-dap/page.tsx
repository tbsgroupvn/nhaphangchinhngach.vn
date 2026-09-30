import { fixedPageMetadata } from '@/lib/studio/fixed-pages'
export const dynamic = 'force-dynamic'
export function generateMetadata() { return fixedPageMetadata('faq') }
import { FAQPage } from '@/components/marketing/InteriorPages'



export default function Page() { return <FAQPage /> }
