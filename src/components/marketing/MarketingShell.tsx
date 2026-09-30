import Link from 'next/link'
import Image from 'next/image'
import {
  ArrowUpRightIcon,
  ChevronRightIcon,
  EnvelopeIcon,
} from '@heroicons/react/24/outline'
import {
  publicSiteSettings,
  publicTemplates,
} from '@/lib/studio/public-content'
import { site as deployment } from '@/data/marketing'
import { SiteSettingsProvider } from './SiteSettingsProvider'
import MarketingHeader from './MarketingHeader'
import MarketingMotion from './MarketingMotion'
import { ContactLinks } from './ContactLinks'

export function Breadcrumb({
  items,
}: {
  items: { label: string; href?: string }[]
}) {
  return (
    <nav className="tbs-breadcrumb tbs-container" aria-label="Đường dẫn">
      <ol>
        <li>
          <Link href="/">Trang chủ</Link>
        </li>
        {items.map((item, index) => (
          <li key={`${item.label}-${index}`}>
            <ChevronRightIcon aria-hidden="true" />
            {item.href ? (
              <Link href={item.href}>{item.label}</Link>
            ) : (
              <span aria-current="page">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}

export function PageIntro({
  eyebrow,
  title,
  description,
  image,
  imageAlt,
}: {
  eyebrow: string
  title: string
  description: string
  image?: string
  imageAlt?: string
}) {
  return (
    <section
      className={`tbs-page-intro ${image ? 'tbs-page-intro-image' : ''}`}
    >
      <div className="tbs-container tbs-page-intro-inner">
        <div>
          <p className="tbs-eyebrow">{eyebrow}</p>
          <h1>{title}</h1>
          <p className="tbs-lead">{description}</p>
        </div>
        {image && (
          <div className="tbs-intro-media">
            <Image
              src={image}
              alt={imageAlt ?? 'Minh họa hoạt động logistics'}
              fill
              sizes="(max-width: 760px) 100vw, 42vw"
              priority
            />
          </div>
        )}
      </div>
    </section>
  )
}

export default function MarketingShell({
  children,
}: {
  children: React.ReactNode
}) {
  const settings = publicSiteSettings()
  const { identity: site, footer } = settings
  return (
    <SiteSettingsProvider value={settings}>
      <div
        className="tbs-site"
        data-site-name={site.name}
        data-transition-caption={publicTemplates().shared.transitionCaption}
      >
        <a href="#noi-dung" className="tbs-skip">
          Đến nội dung chính
        </a>
        <MarketingHeader />
        <main id="noi-dung">{children}</main>
        <footer className="tbs-footer">
          <div className="tbs-container">
            <div className="tbs-footer-top">
              <div>
                <p className="tbs-eyebrow">{footer.eyebrow}</p>
                <h2 className="tbs-multiline">{footer.headline}</h2>
              </div>
              <div>
                <p className="tbs-multiline">{footer.body}</p>
                <ContactLinks variant="light" placement="footer" />
              </div>
            </div>
            <div className="tbs-footer-grid">
              <div className="tbs-footer-brand">
                <Image
                  src={site.footerLogo}
                  alt={site.name}
                  width={142}
                  height={82}
                />
                <p className="tbs-multiline">{footer.tagline}</p>
                <a href={`mailto:${site.email}`}>
                  <EnvelopeIcon aria-hidden="true" />
                  {site.email}
                </a>
              </div>
              {footer.columns.map((column, index) => (
                <div key={index}>
                  <h3>{column.title}</h3>
                  {column.links.map((link) => (
                    <Link key={link.href} href={link.href}>
                      {link.label}
                      {link.href === '/lien-he/' && (
                        <ArrowUpRightIcon aria-hidden="true" />
                      )}
                    </Link>
                  ))}
                </div>
              ))}
            </div>
            <div className="tbs-footer-bottom">
              <span>
                © {new Date().getFullYear()} {site.name}.
              </span>
              <div>
                {footer.legalLinks.map((link) => (
                  <Link key={link.href} href={link.href}>
                    {link.label}
                  </Link>
                ))}
              </div>
              <span>{footer.routeLabel}</span>
            </div>
          </div>
        </footer>
        <div className="tbs-mobile-dock">
          <ContactLinks variant="compact" placement="mobile-dock" />
        </div>
        <MarketingMotion />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: site.name,
              url: deployment.url,
              logo: `${deployment.url}${site.logo}`,
              telephone: site.phone,
              email: site.email,
              contactPoint: {
                '@type': 'ContactPoint',
                telephone: site.phone,
                contactType: 'sales',
                availableLanguage: 'Vietnamese',
              },
            }).replace(/</g, '\\u003c'),
          }}
        />
      </div>
    </SiteSettingsProvider>
  )
}
