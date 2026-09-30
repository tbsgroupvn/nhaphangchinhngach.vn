import { fixedPageCopy } from '@/lib/studio/fixed-pages'
import type { FixedPagePayload } from '@/lib/studio/content-model'
import Image from 'next/image'
import Link from 'next/link'
import {
  ArrowDownIcon,
  ArrowRightIcon,
  ArrowUpRightIcon,
  CubeIcon,
  TruckIcon,
  DocumentCheckIcon,
  BuildingStorefrontIcon,
  ClipboardDocumentCheckIcon,
  MagnifyingGlassIcon,
  CheckIcon,
} from '@heroicons/react/24/outline'
import {
  publicIndustryAtlas,
  publishedItems,
  publicTemplates,
} from '@/lib/studio/public-content'
import MarketingShell from './MarketingShell'
import { ContactLinks } from './ContactLinks'
import Journey from './Journey'
import HeroExperience from './HeroExperience'

const serviceIcons = [
  CubeIcon,
  DocumentCheckIcon,
  TruckIcon,
  ClipboardDocumentCheckIcon,
  MagnifyingGlassIcon,
  BuildingStorefrontIcon,
]

export default function HomePage({
  preview,
}: { preview?: FixedPagePayload } = {}) {
  const copy = fixedPageCopy('home', preview)

  const services = publishedItems('service'),
    atlasPaths = new Map(
      publicIndustryAtlas().industries.map((item) => [item.slug, item.path]),
    ),
    // Chỉ ngành có nhóm đã xuất bản; giữ thứ tự cũ, tối đa 6 mục trên trang chủ.
    industries = publishedItems('industry')
      .filter((item) => atlasPaths.has(item.slug))
      .slice(0, 6),
    articles = publishedItems('article')
  return (
    <MarketingShell>
      <HeroExperience>
        <div className="tbs-hero-media" id="hero-visual">
          <div className="tbs-hero-depth">
            <Image
              className="tbs-hero-image"
              src={copy.image}
              alt={copy.imageAlts?.[copy.image] ?? copy.text('copy-2')}
              fill
              sizes="100vw"
              priority
              fetchPriority="high"
            />
          </div>
        </div>
        <div className="tbs-hero-shade" />
        <div className="tbs-container tbs-hero-content">
          <p className="tbs-hero-eyebrow">
            <span />
            {copy.text('copy-3')}
          </p>
          <h1 id="hero-title">
            <span className="tbs-hero-word">{copy.title.split(' ')[0]}</span>{' '}
            <span className="tbs-hero-word">
              {copy.title.split(' ').slice(1).join(' ')}
            </span>
            <span className="tbs-hero-tagline">
              {copy.text('copy-6')}
              <br />
              {copy.text('copy-7')}
            </span>
          </h1>
          <p className="tbs-hero-description tbs-editable-hero-description">
            {copy.summary}
          </p>
          <ContactLinks variant="light" placement="hero" />
          <a href={copy.text('copy-10')} className="tbs-hero-explore">
            {copy.text('copy-11')}
            <ArrowDownIcon aria-hidden="true" />
          </a>
        </div>
        <div className="tbs-hero-caption">
          <span>{copy.text('copy-12')}</span>
          <i />
          <span>{copy.text('copy-13')}</span>
          <small>{copy.text('copy-14')}</small>
        </div>
      </HeroExperience>
      <div className="tbs-principles">
        <div className="tbs-container">
          <div>
            <span>01</span>
            <p>
              {copy.text('copy-15')}
              <small>{copy.text('copy-16')}</small>
            </p>
          </div>
          <div>
            <span>02</span>
            <p>
              {copy.text('copy-17')}
              <small>{copy.text('copy-18')}</small>
            </p>
          </div>
          <div>
            <span>03</span>
            <p>
              {copy.text('copy-19')}
              <small>{copy.text('copy-20')}</small>
            </p>
          </div>
          <Link href={copy.text('copy-21')}>
            {copy.text('copy-22')}
            <ArrowUpRightIcon aria-hidden="true" />
          </Link>
        </div>
      </div>
      <section className="tbs-section" id="giai-phap">
        <div className="tbs-container">
          <div className="tbs-section-heading" data-reveal>
            <div>
              <p className="tbs-eyebrow">{copy.text('copy-23')}</p>
              <h2 className="tbs-heading">
                {copy.text('copy-24')}
                <br />
                {copy.text('copy-25')}
              </h2>
            </div>
            <div>
              <p className="tbs-section-description">{copy.text('copy-26')}</p>
              <Link className="tbs-inline-link" href={copy.text('copy-27')}>
                {copy.text('copy-28')}
                <ArrowUpRightIcon aria-hidden="true" />
              </Link>
            </div>
          </div>
          <div className="tbs-service-grid">
            {services.map((service, index) => {
              const Icon = serviceIcons[index % serviceIcons.length]
              return (
                <Link
                  href={`/dich-vu/${service.slug}/`}
                  className="tbs-service-item"
                  key={service.slug}
                  data-reveal
                >
                  <div className="tbs-service-top">
                    <Icon aria-hidden="true" />
                    <span>0{index + 1}</span>
                  </div>
                  <h3>{service.shortTitle || service.title}</h3>
                  <p>{service.summary}</p>
                  <span className="tbs-service-arrow">
                    <ArrowUpRightIcon aria-hidden="true" />
                    <span className="sr-only">{copy.text('copy-29')}</span>
                  </span>
                </Link>
              )
            })}
          </div>
        </div>
      </section>
      <Journey copy={publicTemplates().journey} />
      <section className="tbs-section tbs-about-section">
        <div className="tbs-container tbs-about-grid">
          <div className="tbs-about-image" data-reveal>
            <Image
              src={copy.text('copy-30')}
              alt={
                copy.imageAlts?.[copy.text('copy-30')] ?? copy.text('copy-31')
              }
              fill
              sizes="(max-width: 760px) 100vw, 50vw"
            />
            <span>
              {copy.text('copy-32')}
              <small>{copy.text('copy-33')}</small>
            </span>
          </div>
          <div className="tbs-about-copy" data-reveal>
            <p className="tbs-eyebrow">{copy.text('copy-34')}</p>
            <h2 className="tbs-heading">
              {copy.text('copy-35')}
              <br />
              {copy.text('copy-36')}
            </h2>
            <p className="tbs-lead">{copy.text('copy-37')}</p>
            <ul className="tbs-check-list">
              <li>
                <CheckIcon aria-hidden="true" />
                <div>
                  <strong>{copy.text('copy-38')}</strong>
                  <p>{copy.text('copy-39')}</p>
                </div>
              </li>
              <li>
                <CheckIcon aria-hidden="true" />
                <div>
                  <strong>{copy.text('copy-40')}</strong>
                  <p>{copy.text('copy-41')}</p>
                </div>
              </li>
              <li>
                <CheckIcon aria-hidden="true" />
                <div>
                  <strong>{copy.text('copy-42')}</strong>
                  <p>{copy.text('copy-43')}</p>
                </div>
              </li>
            </ul>
            <Link className="tbs-inline-link" href={copy.text('copy-44')}>
              {copy.text('copy-45')}
              <ArrowUpRightIcon aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
      <section className="tbs-section tbs-industries-section">
        <div className="tbs-container">
          <div className="tbs-section-heading" data-reveal>
            <div>
              <p className="tbs-eyebrow">{copy.text('copy-46')}</p>
              <h2 className="tbs-heading">
                {copy.text('copy-47')}
                <br />
                {copy.text('copy-48')}
              </h2>
            </div>
            <Link className="tbs-inline-link" href={copy.text('copy-49')}>
              {copy.text('copy-50')}
              <ArrowUpRightIcon aria-hidden="true" />
            </Link>
          </div>
          <div className="tbs-industry-list">
            {industries.map((industry, index) => (
              <Link
                href={`${atlasPaths.get(industry.slug)}/`}
                key={industry.slug}
                data-reveal
              >
                <span className="tbs-industry-index">0{index + 1}</span>
                <h3>{industry.title}</h3>
                <p>{industry.summary}</p>
                <ArrowUpRightIcon aria-hidden="true" />
              </Link>
            ))}
          </div>
        </div>
      </section>
      <section className="tbs-section tbs-cost-section">
        <div className="tbs-container tbs-cost-grid">
          <div data-reveal>
            <p className="tbs-eyebrow">{copy.text('copy-51')}</p>
            <h2 className="tbs-heading">
              {copy.text('copy-52')}
              <br />
              {copy.text('copy-53')}
            </h2>
            <p className="tbs-lead">{copy.text('copy-54')}</p>
            <Link
              className="tbs-button tbs-button-primary"
              href={copy.text('copy-55')}
            >
              {copy.text('copy-56')}
              <ArrowUpRightIcon aria-hidden="true" />
            </Link>
          </div>
          <div className="tbs-cost-checklist" data-reveal>
            <p className="tbs-eyebrow">{copy.text('copy-57')}</p>
            {[
              copy.text('copy-58'),
              copy.text('copy-59'),
              copy.text('copy-60'),
              copy.text('copy-61'),
            ].map((label, i) => (
              <div key={label}>
                <span>0{i + 1}</span>
                <p>{label}</p>
                <CheckIcon aria-hidden="true" />
              </div>
            ))}
            <Link href={copy.text('copy-62')} className="tbs-inline-link">
              {copy.text('copy-63')}
              <ArrowRightIcon aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
      <section className="tbs-section">
        <div className="tbs-container">
          <div className="tbs-section-heading" data-reveal>
            <div>
              <p className="tbs-eyebrow">{copy.text('copy-64')}</p>
              <h2 className="tbs-heading">
                {copy.text('copy-65')}
                <br />
                {copy.text('copy-66')}
              </h2>
            </div>
            <Link className="tbs-inline-link" href={copy.text('copy-67')}>
              {copy.text('copy-68')}
              <ArrowUpRightIcon aria-hidden="true" />
            </Link>
          </div>
          <div className="tbs-home-articles">
            {articles.slice(0, 2).map((article, index) => (
              <Link
                href={`/kien-thuc/${article.slug}/`}
                key={article.slug}
                className="tbs-home-article"
                data-reveal
              >
                <div className="tbs-article-number">
                  <span>0{index + 1}</span>
                  {index === 0 ? (
                    <ClipboardDocumentCheckIcon aria-hidden="true" />
                  ) : (
                    <DocumentCheckIcon aria-hidden="true" />
                  )}
                </div>
                <div>
                  <p className="tbs-eyebrow">{article.category}</p>
                  <h3>{article.title}</h3>
                  <p>{article.summary}</p>
                  <span className="tbs-inline-link">
                    {copy.text('copy-69')}
                    <ArrowUpRightIcon aria-hidden="true" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </MarketingShell>
  )
}
