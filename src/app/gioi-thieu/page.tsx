import { fixedPageMetadata } from '@/lib/studio/fixed-pages'
export const dynamic = 'force-dynamic'
export function generateMetadata() { return fixedPageMetadata('about') }
import { AboutPage } from '@/components/marketing/InteriorPages'



export default function Page() { return <AboutPage /> }
