import type { ReactNode } from 'react'
import Link from 'next/link'
import { ArrowRightIcon } from '@heroicons/react/24/outline'
import MarketingShell, {
  Breadcrumb,
  PageIntro,
} from '@/components/marketing/MarketingShell'
import { ContactLinks } from '@/components/marketing/ContactLinks'
import type { Service } from '@/data/marketing'
import { publishedItems, publicTemplates } from '@/lib/studio/public-content'

export function PageFrame({
  title,
  description,
  eyebrow,
  image,
  imageAlt,
  parents = [],
  children,
}: {
  title: string
  description: string
  eyebrow: string
  image?: string
  imageAlt?: string
  parents?: { label: string; href: string }[]
  children: ReactNode
}) {
  return (
    <MarketingShell>
      <Breadcrumb items={[...parents, { label: title }]} />
      <PageIntro
        eyebrow={eyebrow}
        title={title}
        description={description}
        image={image}
        imageAlt={imageAlt}
      />
      <div className="tbs-container">
        <ContactLinks placement="interior-intro" />
      </div>
      {children}
    </MarketingShell>
  )
}

export function TextSection({
  id,
  title,
  children,
}: {
  id: string
  title: string
  children: ReactNode
}) {
  return (
    <section
      id={id}
      className="tbs-prose-section"
      aria-labelledby={`${id}-title`}
    >
      <h2 id={`${id}-title`}>{title}</h2>
      {children}
    </section>
  )
}

export function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="tbs-list">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  )
}

export function MoreLink({ href, children }: { href: string; children: ReactNode }) {
  if (!href) return null
  return (
    <Link className="tbs-inline-link" href={href}>
      {children}
      <ArrowRightIcon width={18} height={18} aria-hidden="true" />
    </Link>
  )
}

export function Sidebar({ items }: { items: { label: string; href: string }[] }) {
  const { sidebar: copy } = publicTemplates()
  return (
    <aside className="tbs-sidebar">
      <nav aria-label="Trong trang này">
        <h2>Nội dung</h2>
        <ul className="tbs-list">
          {items.map((item) => (
            <li key={item.href}>
              <Link href={item.href}>{item.label}</Link>
            </li>
          ))}
        </ul>
      </nav>
      <h2>{copy.heading}</h2>
      <p>{copy.body}</p>
      <ContactLinks variant="compact" placement="interior-sidebar" />
      <MoreLink href={copy.href}>{copy.link}</MoreLink>
    </aside>
  )
}

export function ServiceCards({
  items = publishedItems('service'),
}: {
  items?: Service[]
}) {
  const { services: copy } = publicTemplates()
  return (
    <div className="tbs-card-grid">
      {items.map((service) => (
        <article className="tbs-content-card" key={service.slug}>
          <h3>
            <Link href={`/dich-vu/${service.slug}`}>{service.shortTitle}</Link>
          </h3>
          <p>{service.summary}</p>
          <MoreLink href={`/dich-vu/${service.slug}`}>
            {copy.cardLink}
            <span className="tbs-sr-only">: {service.shortTitle}</span>
          </MoreLink>
        </article>
      ))}
    </div>
  )
}
