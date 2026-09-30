import { notFound, permanentRedirect } from 'next/navigation'
import { ServicePage } from '@/components/marketing/InteriorPages'
import { legacyServiceAliases } from '@/data/marketing'
import { publishedAt, publishedMetadata } from '@/lib/studio/public-content'

export const dynamic = 'force-dynamic'

type Props = { params: { slug: string } }

function resolveService(slug: string) {
  const canonicalSlug = Object.prototype.hasOwnProperty.call(legacyServiceAliases, slug) ? legacyServiceAliases[slug] : slug
  const service = publishedAt(`/dich-vu/${canonicalSlug}`)
  if (!service || service.kind !== 'service') notFound()
  return service
}

export function generateMetadata({ params }: Props) {
  const service = resolveService(params.slug)
  return publishedMetadata(service, `/dich-vu/${service.data.slug}`)
}

export default function Page({ params }: Props) {
  const service = resolveService(params.slug)
  if (service.data.slug !== params.slug) permanentRedirect(`/dich-vu/${service.data.slug}`)
  return <ServicePage service={service.data} />
}
