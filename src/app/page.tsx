import { fixedPageMetadata } from '@/lib/studio/fixed-pages'
export const dynamic = 'force-dynamic'
export function generateMetadata() { return fixedPageMetadata('home') }

import HomePage from '@/components/marketing/HomePage'



export default function Home() {
  return <HomePage />
}
