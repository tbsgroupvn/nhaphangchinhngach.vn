import { notFound } from 'next/navigation'
import { publishedRedirect } from '@/lib/studio/public-content'

export const dynamic = 'force-dynamic'
type Props = { params: { path: string[] } }
// Resolve during metadata so redirects have an HTTP status before HTML streams.
export function generateMetadata({ params }: Props) {
  publishedRedirect(`/${params.path.join('/')}`)
  return { robots: { index: false, follow: false } }
}
export default function RetiredPath({ params }: Props) {
  publishedRedirect(`/${params.path.join('/')}`)
  notFound()
}
