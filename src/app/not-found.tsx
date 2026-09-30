import Link from 'next/link'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import MarketingShell from '@/components/marketing/MarketingShell'
import { ContactLinks } from '@/components/marketing/ContactLinks'
import { publicTemplates } from '@/lib/studio/public-content'

export default function NotFound() {
  const copy = publicTemplates().notFound
  return (
    <MarketingShell>
      <section className="tbs-section">
        <div className="tbs-container">
          <p className="tbs-eyebrow">{copy.eyebrow}</p>
          <h1 className="tbs-heading">{copy.title}</h1>
          <p className="tbs-lead" style={{ margin: '24px 0' }}>
            {copy.body}
          </p>
          <ContactLinks placement="not-found" />
          <Link className="tbs-inline-link" href="/" style={{ marginTop: 28 }}>
            <ArrowLeftIcon aria-hidden="true" />
            {copy.link}
          </Link>
        </div>
      </section>
    </MarketingShell>
  )
}
