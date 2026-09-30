import Image from 'next/image'
import Link from 'next/link'
import type { FixedPagePayload } from '@/lib/studio/content-model'
import type { Industry, IndustryCategory } from '@/lib/studio/content-model'
import { fixedPageCopy } from '@/lib/studio/fixed-pages'
import {
  publicIndustryAtlas,
  publicIndustrySearch,
  publicMediaAlt,
  publishedItems,
  publicTemplates,
} from '@/lib/studio/public-content'
import type {
  PublicIndustry,
  PublicIndustryAtlas,
  PublicIndustryCategory,
} from '@/lib/industries/public'
import {
  parseIndustrySearchState,
  type IndustrySearchState,
} from '@/lib/industries/search'
import type { IndustryTrait } from '@/lib/studio/industry-taxonomy-model'
import { site } from '@/data/marketing'
import { ContactLinks } from './ContactLinks'
import BriefCopy from './BriefCopy'
import FAQList from './FAQList'
import IndustryExplorer from './IndustryExplorer'
import {
  BulletList,
  MoreLink,
  PageFrame,
  ServiceCards,
  Sidebar,
  TextSection,
} from './InteriorPrimitives'
import styles from './IndustryAtlas.module.css'

export const industryPreparationItems = [
  'Ảnh hoặc đường dẫn sản phẩm',
  'Công dụng và vật liệu chính',
  'Model, catalogue hoặc thông số nếu có',
  'Số lượng, kích thước và trọng lượng dự kiến',
  'Điểm nhận hàng và điểm giao tại Việt Nam',
]

type SearchParams = Record<string, string | string[] | undefined>

function traitMap(traits: IndustryTrait[]) {
  return new Map(traits.map((trait) => [trait.slug, trait]))
}

function imageAlt(item: { image: string; imageAlts?: Record<string, string>; title: string }) {
  return item.imageAlts?.[item.image] ?? item.title
}

function childrenOf(atlas: PublicIndustryAtlas, categorySlug: string) {
  return atlas.industries.filter((item) => item.categorySlug === categorySlug)
}

function orderedChildren(atlas: PublicIndustryAtlas, category: PublicIndustryCategory) {
  const children = childrenOf(atlas, category.slug)
  const featured = category.featuredIndustryIds.flatMap((id) =>
    children.filter((item) => item.id === id),
  )
  return [...featured, ...children.filter((item) => !featured.includes(item))]
}

function hasFilterParams(searchParams: SearchParams) {
  return ['q', 'category', 'traits'].some((key) => {
    const value = searchParams[key]
    return Array.isArray(value) ? value.length > 0 : Boolean(value)
  })
}

export function industryHubHasFilter(searchParams: SearchParams = {}) {
  return hasFilterParams(searchParams)
}

function TraitTags({
  slugs,
  traits,
}: {
  slugs: string[]
  traits: Map<string, IndustryTrait>
}) {
  if (!slugs.length) return null
  return (
    <ul className={styles.tagList} aria-label="Đặc tính">
      {slugs.map((slug) => (
        <li key={slug}>{traits.get(slug)?.label || slug}</li>
      ))}
    </ul>
  )
}

function IndustryRows({
  items,
  traits,
  categoryTitle,
}: {
  items: PublicIndustry[]
  traits: Map<string, IndustryTrait>
  categoryTitle?: string
}) {
  return (
    <ul className={styles.resultList}>
      {items.map((industry) => (
        <li key={industry.id} className={styles.resultRow}>
          <div className={styles.resultThumb}>
            <Image
              src={industry.image}
              alt={imageAlt(industry)}
              fill
              sizes="112px"
              loading="lazy"
            />
          </div>
          <div>
            {categoryTitle && <p className={styles.resultCategory}>{categoryTitle}</p>}
            <h3>
              <Link href={`${industry.path}/`}>{industry.title}</Link>
            </h3>
            <p>{industry.summary}</p>
            <TraitTags slugs={industry.traits} traits={traits} />
          </div>
        </li>
      ))}
    </ul>
  )
}

function CategoryBands({
  atlas,
  heading,
  linkLabel,
}: {
  atlas: PublicIndustryAtlas
  heading: string
  linkLabel: string
}) {
  return (
    <section className={styles.bands} aria-labelledby="atlas-categories-title">
      <div className="tbs-container">
        <h2 id="atlas-categories-title" className="tbs-heading">
          {heading}
        </h2>
      </div>
      {atlas.categories.map((category, position) => {
        const children = orderedChildren(atlas, category)
        return (
          <article key={category.id} className={styles.band} data-atlas-category={category.slug}>
            <div className={`tbs-container ${styles.bandInner}`}>
              <div className={styles.bandMedia}>
                <Image
                  src={category.image}
                  alt={imageAlt(category)}
                  fill
                  sizes="(max-width: 760px) 100vw, 40vw"
                  priority={position === 0}
                  loading={position === 0 ? undefined : 'lazy'}
                />
              </div>
              <div className={styles.bandBody}>
                <p className={styles.bandCount}>
                  {children.length} ngành hàng đã xuất bản
                </p>
                <h3>
                  <Link href={`${category.path}/`}>{category.title}</Link>
                </h3>
                <p>{category.summary}</p>
                <details className={styles.bandList} open>
                  <summary>Ngành hàng tiêu biểu</summary>
                  <ul>
                    {children.slice(0, 4).map((industry) => (
                      <li key={industry.id}>
                        <Link href={`${industry.path}/`}>{industry.title}</Link>
                        <span className="tbs-sr-only">
                          {' '}
                          — {linkLabel}: {industry.title}
                        </span>
                      </li>
                    ))}
                  </ul>
                </details>
                <MoreLink href={`${category.path}/`}>
                  Xem nhóm {category.title}
                </MoreLink>
              </div>
            </div>
          </article>
        )
      })}
    </section>
  )
}

function ProofShowcase({ items }: { items: PublicIndustry[] }) {
  const proofs = items
    .flatMap((industry) =>
      industry.proofItems
        .filter((proof) => proof.rightsStatus === 'approved')
        .map((proof) => ({ proof, industry, alt: publicMediaAlt(proof.mediaId) })),
    )
    .filter((item) => item.alt)
    .slice(0, 3)
  if (!proofs.length) return null
  return (
    <section className="tbs-section" aria-labelledby="atlas-proof-title">
      <div className="tbs-container">
        <h2 id="atlas-proof-title" className="tbs-heading">
          Bằng chứng từ hoạt động TBS
        </h2>
        <ul className={styles.proofList}>
          {proofs.map(({ proof, industry, alt }) => (
            <li key={`${industry.id}-${proof.id}`}>
              <div className={styles.proofMedia}>
                <Image
                  src={`/api/studio/media/${proof.mediaId}/`}
                  alt={alt}
                  fill
                  sizes="(max-width: 760px) 100vw, 33vw"
                  loading="lazy"
                />
              </div>
              <h3>{proof.title}</h3>
              <p>{proof.caption}</p>
              <p className={styles.scopeNote}>{proof.scopeNote}</p>
              <Link href={`${industry.path}/`}>{industry.title}</Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export function IndustryHubPage({
  preview,
  searchParams = {},
}: {
  preview?: FixedPagePayload
  searchParams?: SearchParams
} = {}) {
  const copy = fixedPageCopy('industries', preview)
  const atlas = publicIndustryAtlas()
  const projection = publicIndustrySearch(atlas)
  const parsed = parseIndustrySearchState(searchParams, atlas)
  const rawQuery = Array.isArray(searchParams.q) ? searchParams.q[0] : searchParams.q
  const initialState: IndustrySearchState = {
    ...parsed,
    q: parsed.q ? (rawQuery || '').trim().slice(0, 120) : '',
  }
  const featured = atlas.featured.flatMap((id) =>
    atlas.industries.filter((item) => item.id === id),
  )
  return (
    <PageFrame
      eyebrow={copy.text('copy-1')}
      title={copy.title}
      description={copy.summary}
      image={copy.image}
      imageAlt={copy.imageAlts?.[copy.image]}
    >
      <div className="tbs-container">
        <IndustryExplorer
          index={projection.index}
          categories={atlas.categories.map(({ slug, title, path }) => ({ slug, title, path }))}
          traits={atlas.traits.map(({ slug, label, active }) => ({ slug, label, active }))}
          media={Object.fromEntries(
            atlas.industries.map((item) => [item.id, { image: item.image, alt: imageAlt(item) }]),
          )}
          initialState={initialState}
          unavailable={projection.unavailable}
          preparationItems={industryPreparationItems}
        />
      </div>
      <CategoryBands atlas={atlas} heading={copy.text('copy-2')} linkLabel={copy.text('copy-3')} />
      <ProofShowcase items={featured.length ? featured : atlas.industries} />
      <section className="tbs-section" aria-labelledby="atlas-missing-title">
        <div className={`tbs-container ${styles.missing}`}>
          <div className="tbs-prose">
            <h2 id="atlas-missing-title">{copy.text('copy-4')}</h2>
            <p>{copy.text('copy-5')}</p>
            <BulletList items={industryPreparationItems} />
            <MoreLink href={copy.text('copy-6')}>{copy.text('copy-7')}</MoreLink>
          </div>
          <ContactLinks placement="industry_hub" />
        </div>
      </section>
    </PageFrame>
  )
}

export function IndustryCategoryPage({
  category,
  atlas,
}: {
  category: IndustryCategory & { path?: string }
  atlas: PublicIndustryAtlas
}) {
  const traits = traitMap(atlas.traits)
  const published = atlas.categories.find((item) => item.slug === category.slug)
  const children = published ? orderedChildren(atlas, published) : []
  const traitCounts = new Map<string, number>()
  for (const industry of children)
    for (const slug of industry.traits)
      traitCounts.set(slug, (traitCounts.get(slug) || 0) + 1)
  const commonTraits = [...traitCounts.entries()]
    .sort((left, right) => right[1] - left[1])
    .slice(0, 8)
    .flatMap(([slug]) => (traits.get(slug) ? [traits.get(slug)!] : []))
  const serviceSlugs = [...new Set(children.flatMap((item) => item.serviceSlugs))]
  const services = publishedItems('service')
    .filter((service) => serviceSlugs.includes(service.slug))
    .slice(0, 3)
  const articleSlugs = new Set(children.flatMap((item) => item.articleSlugs))
  const articles = publishedItems('article').filter((article) => articleSlugs.has(article.slug))
  return (
    <PageFrame
      eyebrow="Nhóm ngành hàng"
      title={category.title}
      description={category.summary}
      image={category.image}
      imageAlt={imageAlt(category)}
      parents={[{ label: 'Ngành hàng', href: '/nganh-hang' }]}
    >
      <div className="tbs-container tbs-section">
        <p className={styles.disclaimer}>
          Nhóm ngành giúp định hướng trao đổi, không phải xác nhận tự động khả
          năng nhập khẩu. Chính sách, hồ sơ và phương án được kiểm tra theo từng
          sản phẩm cụ thể.
        </p>
        <section aria-labelledby="category-industries-title">
          <h2 id="category-industries-title" className="tbs-heading">
            Ngành hàng trong nhóm
          </h2>
          <IndustryRows items={children} traits={traits} />
        </section>
        {commonTraits.length > 0 && (
          <section className={styles.categoryBlock} aria-labelledby="category-traits-title">
            <h2 id="category-traits-title" className="tbs-heading">
              Đặc tính thường cần xác minh
            </h2>
            <ul className={styles.traitGrid}>
              {commonTraits.map((trait) => (
                <li key={trait.slug}>
                  <h3>{trait.label}</h3>
                  {trait.description && <p>{trait.description}</p>}
                  {trait.active && (
                    <Link href={`/nganh-hang/?category=${category.slug}&traits=${trait.slug}`}>
                      Lọc theo đặc tính này
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
      {services.length > 0 && (
        <section className="tbs-section" aria-labelledby="category-services-title">
          <div className="tbs-container">
            <h2 id="category-services-title" className="tbs-heading">
              Phần việc TBS thường liên quan
            </h2>
            <ServiceCards items={services} />
          </div>
        </section>
      )}
      {articles.length > 0 && (
        <section className="tbs-section" aria-labelledby="category-articles-title">
          <div className="tbs-container tbs-prose">
            <h2 id="category-articles-title">Bài kiến thức liên quan</h2>
            <ul className="tbs-list">
              {articles.map((article) => (
                <li key={article.slug}>
                  <Link href={`/kien-thuc/${article.slug}/`}>{article.title}</Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
      <section className="tbs-section" aria-labelledby="category-contact-title">
        <div className={`tbs-container ${styles.missing}`}>
          <div className="tbs-prose">
            <h2 id="category-contact-title">Chuẩn bị dữ liệu trước khi trao đổi</h2>
            <BulletList items={industryPreparationItems} />
          </div>
          <ContactLinks placement="industry_category" />
        </div>
      </section>
    </PageFrame>
  )
}

function briefText(industry: Industry) {
  const items = industry.saleBriefItems.length
    ? industry.saleBriefItems
    : industryPreparationItems
  return [
    `Ngành hàng: ${industry.title}`,
    ...items.map((item) => `${item}:`),
    'Nơi giao tại Việt Nam:',
  ].join('\n')
}

export function IndustryDetailPage({
  industry,
  atlas,
}: {
  industry: Industry
  atlas: PublicIndustryAtlas
}) {
  const { industry: copy } = publicTemplates()
  const traits = traitMap(atlas.traits)
  const category = atlas.categories.find((item) => item.slug === industry.categorySlug)
  const services = publishedItems('service')
    .filter((service) => industry.serviceSlugs.includes(service.slug))
    .slice(0, 3)
  const articles = publishedItems('article').filter((article) =>
    industry.articleSlugs.includes(article.slug),
  )
  const proofs = industry.proofItems
    .filter((proof) => proof.rightsStatus === 'approved')
    .map((proof) => ({ proof, alt: publicMediaAlt(proof.mediaId) }))
    .filter((item) => item.alt)
  const technical = [
    ...industry.technicalInputs,
    ...(industry.models.length ? [`Model/dòng sản phẩm: ${industry.models.join(', ')}`] : []),
    ...(industry.materials.length ? [`Vật liệu chính: ${industry.materials.join(', ')}`] : []),
  ]
  const nav = [
    { label: copy.navigation[0] || 'Đặc điểm', href: '#dac-diem' },
    ...(industry.preparationItems.length
      ? [{ label: 'Trước khi đặt hàng', href: '#truoc-khi-dat-hang' }]
      : []),
    { label: copy.navigation[1] || 'Thông tin cần chuẩn bị', href: '#chuan-bi' },
    ...(industry.packingNotes.length ? [{ label: 'Đóng gói & vận chuyển', href: '#dong-goi' }] : []),
    { label: copy.navigation[2] || 'Kiểm tra theo sản phẩm', href: '#kiem-tra' },
    ...(proofs.length ? [{ label: 'Bằng chứng TBS', href: '#bang-chung' }] : []),
    ...(industry.faqs.length ? [{ label: 'Câu hỏi thường gặp', href: '#hoi-dap' }] : []),
    { label: 'Brief cho trao đổi', href: '#brief' },
  ]
  const parents = [
    { label: copy.parent, href: '/nganh-hang' },
    ...(category ? [{ label: category.title, href: category.path }] : []),
  ]
  return (
    <PageFrame
      eyebrow={copy.eyebrow}
      title={industry.title}
      description={industry.summary}
      image={industry.image}
      imageAlt={imageAlt(industry)}
      parents={parents}
    >
      <div className="tbs-container tbs-section tbs-page-grid">
        <div className="tbs-prose">
          <TextSection id="dac-diem" title={copy.detailsTitle}>
            {industry.details.map((detail) => (
              <p key={detail}>{detail}</p>
            ))}
            {industry.uses.length > 0 && (
              <>
                <h3>Công dụng thường gặp</h3>
                <BulletList items={industry.uses} />
              </>
            )}
            {industry.traits.length > 0 && (
              <>
                <h3>Đặc tính cần lưu ý</h3>
                <TraitTags slugs={industry.traits} traits={traits} />
              </>
            )}
          </TextSection>
          {industry.preparationItems.length > 0 && (
            <TextSection id="truoc-khi-dat-hang" title="Trước khi đặt hàng">
              <BulletList items={industry.preparationItems} />
            </TextSection>
          )}
          <TextSection id="chuan-bi" title={copy.inputsTitle}>
            <BulletList items={industry.inputs} />
            {technical.length > 0 && (
              <>
                <h3>Dữ liệu kỹ thuật</h3>
                <BulletList items={technical} />
              </>
            )}
          </TextSection>
          {industry.packingNotes.length > 0 && (
            <TextSection id="dong-goi" title="Đóng gói và vận chuyển">
              <BulletList items={industry.packingNotes} />
            </TextSection>
          )}
          <TextSection id="kiem-tra" title={copy.checkTitle}>
            <p>{copy.checkBody}</p>
            {industry.verificationPoints.length > 0 && (
              <BulletList items={industry.verificationPoints} />
            )}
            <MoreLink href={copy.costsHref}>{copy.costsLink}</MoreLink>
          </TextSection>
          {proofs.length > 0 && (
            <TextSection id="bang-chung" title="Bằng chứng từ hoạt động TBS">
              <ul className={styles.proofList}>
                {proofs.map(({ proof, alt }) => (
                  <li key={proof.id}>
                    <div className={styles.proofMedia}>
                      <Image
                        src={`/api/studio/media/${proof.mediaId}/`}
                        alt={alt}
                        fill
                        sizes="(max-width: 760px) 100vw, 30vw"
                        loading="lazy"
                      />
                    </div>
                    <h3>{proof.title}</h3>
                    <p>{proof.caption}</p>
                    <p className={styles.scopeNote}>{proof.scopeNote}</p>
                  </li>
                ))}
              </ul>
            </TextSection>
          )}
          {industry.faqs.length > 0 && (
            <section id="hoi-dap" className="tbs-prose-section" aria-labelledby="hoi-dap-title">
              <h2 id="hoi-dap-title">Câu hỏi thường gặp</h2>
              <FAQList items={industry.faqs} relatedLabel="Xem thêm" />
            </section>
          )}
          <TextSection id="brief" title="Brief cho trao đổi với TBS">
            <p>
              Sao chép mẫu dưới đây, điền thông tin lô hàng rồi gửi qua Zalo
              hoặc đọc khi gọi điện.
            </p>
            <BriefCopy text={briefText(industry)} industryId={industry.slug} />
          </TextSection>
          {articles.length > 0 && (
            <TextSection id="kien-thuc" title="Bài kiến thức liên quan">
              <ul className="tbs-list">
                {articles.map((article) => (
                  <li key={article.slug}>
                    <Link href={`/kien-thuc/${article.slug}/`}>{article.title}</Link>
                  </li>
                ))}
              </ul>
            </TextSection>
          )}
        </div>
        <Sidebar items={nav} />
      </div>
      {services.length > 0 && (
        <section className="tbs-section">
          <div className="tbs-container">
            <h2 className="tbs-heading">{copy.relatedTitle}</h2>
            <ServiceCards items={services} />
          </div>
        </section>
      )}
      <section className="tbs-section" aria-labelledby="detail-contact-title">
        <div className={`tbs-container ${styles.missing}`}>
          <div className="tbs-prose">
            <h2 id="detail-contact-title">Trao đổi trực tiếp với TBS</h2>
            <p>Gọi điện hoặc nhắn Zalo kèm brief ở trên để được hướng dẫn bước tiếp theo.</p>
          </div>
          <ContactLinks placement="industry_detail" />
        </div>
      </section>
    </PageFrame>
  )
}

export function industryBreadcrumbJsonLd(
  items: { name: string; path: string }[],
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, position) => ({
      '@type': 'ListItem',
      position: position + 1,
      name: item.name,
      item: `${site.url}${item.path === '/' ? '/' : `${item.path.replace(/\/$/, '')}/`}`,
    })),
  }
}

export function industryFaqJsonLd(faqs: { q: string; a: string }[]) {
  if (!faqs.length) return null
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: { '@type': 'Answer', text: faq.a },
    })),
  }
}

export function JsonLd({ data }: { data: object | null }) {
  if (!data) return null
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, '\\u003c'),
      }}
    />
  )
}
