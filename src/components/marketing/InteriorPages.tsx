import { fixedPageCopy } from '@/lib/studio/fixed-pages'
import type { FixedPagePayload } from '@/lib/studio/content-model'
import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import Link from 'next/link'
import { ArrowRightIcon, EnvelopeIcon } from '@heroicons/react/24/outline'
import MarketingShell, {
  Breadcrumb,
  PageIntro,
} from '@/components/marketing/MarketingShell'
import { ContactLinks } from '@/components/marketing/ContactLinks'
import BriefCopy from '@/components/marketing/BriefCopy'
import KnowledgeFilter from '@/components/marketing/KnowledgeFilter'
import FAQList from '@/components/marketing/FAQList'
import {
  commonFAQs as defaultFAQs,
  site,
  type Article,
  type Industry,
  type Service,
} from '@/data/marketing'
import {
  publishedItems,
  publishedPages,
  publicSiteSettings,
  publicTemplates,
} from '@/lib/studio/public-content'

export function pageMetadata(
  title: string,
  description: string,
  path: string,
): Metadata {
  const { identity } = publicSiteSettings()
  const url = `${site.url}${path === '/' ? '/' : `${path.replace(/\/$/, '')}/`}`
  return {
    title: { absolute: `${title} | ${identity.name}` },
    description,
    alternates: { canonical: url },
    openGraph: {
      title: `${title} | ${identity.name}`,
      description,
      url,
      siteName: identity.name,
      locale: 'vi_VN',
      type: 'website',
      images: [
        {
          url: identity.shareImage,
          alt: identity.shareImageAlt,
        },
      ],
    },
  }
}

import {
  BulletList,
  MoreLink,
  PageFrame,
  ServiceCards,
  Sidebar,
  TextSection,
} from '@/components/marketing/InteriorPrimitives'

export function ServiceHubPage({
  preview,
}: { preview?: FixedPagePayload } = {}) {
  const copy = fixedPageCopy('services', preview)

  return (
    <PageFrame
      eyebrow={copy.text('copy-1')}
      title={copy.title}
      description={copy.summary}
      image={copy.image}
      imageAlt={copy.imageAlts?.[copy.image]}
    >
      <section className="tbs-section">
        <div className="tbs-container">
          <h2 className="tbs-heading">{copy.text('copy-2')}</h2>
          <ServiceCards />
        </div>
      </section>
      <section className="tbs-section">
        <div className="tbs-container tbs-prose">
          <h2>{copy.text('copy-3')}</h2>
          <p>{copy.text('copy-4')}</p>
          <MoreLink href={copy.text('copy-5')}>{copy.text('copy-6')}</MoreLink>
        </div>
      </section>
    </PageFrame>
  )
}

export function ServicePage({ service }: { service: Service }) {
  const { services: copy, shared } = publicTemplates()
  return (
    <PageFrame
      eyebrow={copy.eyebrow}
      title={service.title}
      description={service.summary}
      image={service.image}
      imageAlt={service.imageAlts?.[service.image]}
      parents={[{ label: copy.parent, href: '/dich-vu' }]}
    >
      <div className="tbs-container tbs-section tbs-page-grid">
        <div className="tbs-prose">
          <TextSection id="phu-hop" title={copy.audienceTitle}>
            <p>{service.audience}</p>
          </TextSection>
          <TextSection id="pham-vi" title={copy.scopeTitle}>
            <BulletList items={service.scope} />
          </TextSection>
          <TextSection id="chuan-bi" title={copy.inputsTitle}>
            <BulletList items={service.inputs} />
            <MoreLink href={copy.preparationHref}>
              {copy.preparationLink}
            </MoreLink>
          </TextSection>
          {service.slug === 'van-chuyen-trung-viet' && (
            <TextSection id="giao-nhan" title={copy.transport.title}>
              <div
                className="tbs-table-wrap"
                role="region"
                aria-label="Phạm vi giao nhận"
                tabIndex={0}
              >
                <table className="tbs-table">
                  <caption>{copy.transport.caption}</caption>
                  <thead>
                    <tr>
                      {copy.transport.columns.map((column, index) => (
                        <th key={index} scope="col">
                          {column}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {copy.transport.rows.map((row, index) => (
                      <tr key={index}>
                        <th scope="row">{row[0]}</th>
                        {row.slice(1).map((cell, cellIndex) => (
                          <td key={cellIndex}>{cell}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TextSection>
          )}
          <TextSection id="phoi-hop" title={copy.processTitle}>
            <ol className="tbs-list">
              {copy.steps.map((step, index) => (
                <li key={index}>{step}</li>
              ))}
            </ol>
            <MoreLink href={copy.processHref}>{copy.processLink}</MoreLink>
          </TextSection>
          <TextSection id="dieu-kien" title={copy.boundariesTitle}>
            <BulletList items={service.boundaries} />
            <p>{copy.boundariesBody}</p>
            <MoreLink href={copy.costsHref}>{copy.costsLink}</MoreLink>
          </TextSection>
          <TextSection id="hoi-dap" title={copy.faqTitle}>
            <FAQList items={service.faqs} relatedLabel={shared.faqLink} />
          </TextSection>
        </div>
        <Sidebar
          items={[
            { label: copy.navigation[0], href: '#phu-hop' },
            { label: copy.navigation[1], href: '#pham-vi' },
            { label: copy.navigation[2], href: '#chuan-bi' },
            { label: copy.navigation[3], href: '#phoi-hop' },
            { label: copy.navigation[4], href: '#dieu-kien' },
            { label: copy.navigation[5], href: '#hoi-dap' },
          ]}
        />
      </div>
    </PageFrame>
  )
}

export function AboutPage({ preview }: { preview?: FixedPagePayload } = {}) {
  const copy = fixedPageCopy('about', preview)

  return (
    <PageFrame
      eyebrow={copy.text('copy-1')}
      title={copy.title}
      description={copy.summary}
      image={copy.image}
      imageAlt={copy.imageAlts?.[copy.image]}
    >
      <div className="tbs-container tbs-section tbs-page-grid">
        <div className="tbs-prose">
          <TextSection id="dinh-huong" title={copy.text('copy-2')}>
            <p>{copy.text('copy-3')}</p>
            <p>{copy.text('copy-4')}</p>
          </TextSection>
          <TextSection id="hop-tac" title={copy.text('copy-5')}>
            <h3>{copy.text('copy-6')}</h3>
            <p>{copy.text('copy-7')}</p>
            <h3>{copy.text('copy-8')}</h3>
            <p>{copy.text('copy-9')}</p>
            <h3>{copy.text('copy-10')}</h3>
            <p>{copy.text('copy-11')}</p>
          </TextSection>
          <TextSection id="bat-dau" title={copy.text('copy-12')}>
            <p>{copy.text('copy-13')}</p>
            <MoreLink href={copy.text('copy-14')}>
              {copy.text('copy-15')}
            </MoreLink>
          </TextSection>
        </div>
        <Sidebar
          items={[
            { label: copy.text('copy-16'), href: copy.text('copy-17') },
            { label: copy.text('copy-18'), href: copy.text('copy-19') },
            { label: copy.text('copy-20'), href: copy.text('copy-21') },
          ]}
        />
      </div>
    </PageFrame>
  )
}

export function OperationsPage({
  preview,
}: { preview?: FixedPagePayload } = {}) {
  const copy = fixedPageCopy('operations', preview)

  return (
    <PageFrame
      eyebrow={copy.text('copy-1')}
      title={copy.title}
      description={copy.summary}
      image={copy.image}
      imageAlt={copy.imageAlts?.[copy.image]}
    >
      <div className="tbs-container tbs-section tbs-page-grid">
        <div className="tbs-prose">
          <TextSection id="tiep-nhan" title={copy.text('copy-2')}>
            <p>{copy.text('copy-3')}</p>
            <BulletList
              items={[
                copy.text('copy-4'),
                copy.text('copy-5'),
                copy.text('copy-6'),
              ]}
            />
          </TextSection>
          <TextSection id="phan-cong" title={copy.text('copy-7')}>
            <p>{copy.text('copy-8')}</p>
            <BulletList
              items={[
                copy.text('copy-9'),
                copy.text('copy-10'),
                copy.text('copy-11'),
                copy.text('copy-12'),
              ]}
            />
          </TextSection>
          <TextSection id="doi-chieu" title={copy.text('copy-13')}>
            <p>{copy.text('copy-14')}</p>
            <p>{copy.text('copy-15')}</p>
            <MoreLink href={copy.text('copy-16')}>
              {copy.text('copy-17')}
            </MoreLink>
          </TextSection>
          <TextSection id="thay-doi" title={copy.text('copy-18')}>
            <p>{copy.text('copy-19')}</p>
            <MoreLink href={copy.text('copy-20')}>
              {copy.text('copy-21')}
            </MoreLink>
          </TextSection>
        </div>
        <Sidebar
          items={[
            { label: copy.text('copy-22'), href: copy.text('copy-23') },
            { label: copy.text('copy-24'), href: copy.text('copy-25') },
            { label: copy.text('copy-26'), href: copy.text('copy-27') },
            { label: copy.text('copy-28'), href: copy.text('copy-29') },
          ]}
        />
      </div>
    </PageFrame>
  )
}

const processStepsDefault = [
  {
    title: 'Tiếp nhận thông tin',
    input:
      'Doanh nghiệp cung cấp sản phẩm, số lượng, điểm nhận và giao, nhu cầu hồ sơ.',
    work: 'Đầu mối tiếp nhận tổng hợp nhu cầu và các phần việc doanh nghiệp đã tự thực hiện.',
    output:
      'Danh sách dữ liệu đã có, còn thiếu và người bổ sung. Chuyển bước khi đủ đầu vào để kiểm tra phương án.',
  },
  {
    title: 'Kiểm tra phương án',
    input:
      'Bổ sung catalogue, thông số và điều kiện giao dịch theo yêu cầu của trường hợp cụ thể.',
    work: 'TBS phối hợp kiểm tra các điểm về hàng hóa, giao nhận và hồ sơ; phân biệt nội dung đã xác minh với nội dung còn mở.',
    output:
      'Phạm vi có thể trao đổi, điều kiện áp dụng và điểm cần xác nhận trước khi lập báo giá.',
  },
  {
    title: 'Thống nhất phạm vi và chi phí',
    input:
      'Doanh nghiệp xác nhận phương án, đầu mối có quyền phê duyệt và yêu cầu bàn giao.',
    work: 'Các bên đối chiếu báo giá, việc đã gồm và chưa gồm, trách nhiệm, hiệu lực và điều kiện thanh toán.',
    output:
      'Báo giá hoặc thỏa thuận được chấp thuận; hợp đồng theo phương án. Chỉ tổ chức công việc khi đáp ứng điều kiện đã thống nhất.',
  },
  {
    title: 'Tổ chức công việc theo lô',
    input:
      'Nhà cung cấp và doanh nghiệp bàn giao hàng, dữ liệu và hồ sơ theo phân công.',
    work: 'Các đầu mối thực hiện phần việc đã nhận; cập nhật các mốc và ghi nhận sai khác nếu có.',
    output:
      'Kết quả công việc theo mốc. Mọi thay đổi ảnh hưởng phạm vi cần được đối chiếu và xác nhận theo thỏa thuận.',
  },
  {
    title: 'Bàn giao và đối chiếu',
    input:
      'Bên nhận phối hợp kiểm tra tại điểm bàn giao và phản hồi nội dung cần làm rõ.',
    work: 'Các bên đối chiếu hàng, công việc, hồ sơ và khoản thanh toán với phương án cùng các thay đổi đã duyệt.',
    output:
      'Xác nhận bàn giao và danh sách nội dung còn cần xử lý nếu có, kèm đầu mối theo dõi.',
  },
]

export function ProcessPage({ preview }: { preview?: FixedPagePayload } = {}) {
  const copy = fixedPageCopy('process', preview)
  const processSteps = copy.collection(processStepsDefault, 'processSteps')

  return (
    <PageFrame
      eyebrow={copy.text('copy-1')}
      title={copy.title}
      description={copy.summary}
      image={copy.image}
      imageAlt={copy.imageAlts?.[copy.image]}
    >
      <div className="tbs-container tbs-section tbs-page-grid">
        <div className="tbs-prose">
          {processSteps.map((step, index) => (
            <TextSection
              key={step.title}
              id={`buoc-${index + 1}`}
              title={`${index + 1}. ${step.title}`}
            >
              <h3>{copy.text('copy-2')}</h3>
              <p>{step.input}</p>
              <h3>{copy.text('copy-3')}</h3>
              <p>{step.work}</p>
              <h3>{copy.text('copy-4')}</h3>
              <p>{step.output}</p>
            </TextSection>
          ))}
          <TextSection id="phat-sinh" title={copy.text('copy-5')}>
            <p>{copy.text('copy-6')}</p>
            <MoreLink href={copy.text('copy-7')}>
              {copy.text('copy-8')}
            </MoreLink>
          </TextSection>
        </div>
        <Sidebar
          items={processSteps.map((step, index) => ({
            label: `${index + 1}. ${step.title}`,
            href: `#buoc-${index + 1}`,
          }))}
        />
      </div>
    </PageFrame>
  )
}

const costRowsDefault = [
  [
    'Hàng hóa',
    'Giá hàng có nằm trong báo giá hay do doanh nghiệp giao dịch riêng?',
    'Giá của nhà cung cấp, số lượng và phạm vi mua hàng.',
  ],
  [
    'Tại Trung Quốc',
    'Thu gom, giao nội địa, kiểm đếm, lưu giữ hoặc đóng gói gồm những việc nào?',
    'Điểm nhận, đơn vị tính, vật tư và bên thanh toán.',
  ],
  [
    'Vận chuyển',
    'Điểm đầu và cuối ở đâu; cước tính theo dữ liệu nào?',
    'Khối lượng, thể tích, quy cách kiện, thời điểm thực hiện.',
  ],
  [
    'Hồ sơ và phối hợp chuyên môn',
    'Những phần việc nào được nhận; đơn vị nào thực hiện?',
    'Phạm vi công việc và dữ liệu cần kiểm tra thêm.',
  ],
  [
    'Thuế và nghĩa vụ liên quan',
    'Khoản nào đã kiểm tra, khoản nào còn dự kiến?',
    'Kết quả xác minh theo sản phẩm và phương án của lô hàng.',
  ],
  [
    'Tại Việt Nam',
    'Giao tới đâu; có nâng hạ, lưu kho hoặc hẹn giao không?',
    'Địa điểm thực tế và điều kiện bàn giao.',
  ],
  [
    'Dịch vụ TBS',
    'Phí gắn với những công việc cụ thể nào?',
    'Nội dung dịch vụ, cách tính và điều kiện áp dụng.',
  ],
  [
    'Phát sinh',
    'Tình huống nào cần xác nhận lại trước khi thực hiện?',
    'Lý do, bằng chứng, chi phí cập nhật và người duyệt.',
  ],
]

export function CostsPage({ preview }: { preview?: FixedPagePayload } = {}) {
  const copy = fixedPageCopy('costs', preview)
  const costRows = copy.collection(costRowsDefault, 'costRows')

  return (
    <PageFrame
      eyebrow={copy.text('copy-1')}
      title={copy.title}
      description={copy.summary}
      image={copy.image}
      imageAlt={copy.imageAlts?.[copy.image]}
    >
      <div className="tbs-container tbs-section tbs-page-grid">
        <div className="tbs-prose">
          <TextSection id="chi-phi" title={copy.text('copy-2')}>
            <p>{copy.text('copy-3')}</p>
            <div
              className="tbs-table-wrap"
              role="region"
              aria-label="Nhóm chi phí nhập hàng"
              tabIndex={0}
            >
              <table className="tbs-table">
                <caption>{copy.text('copy-4')}</caption>
                <thead>
                  <tr>
                    <th scope="col">{copy.text('copy-5')}</th>
                    <th scope="col">{copy.text('copy-6')}</th>
                    <th scope="col">{copy.text('copy-7')}</th>
                  </tr>
                </thead>
                <tbody>
                  {costRows.map((row) => (
                    <tr key={row[0]}>
                      <th scope="row">{row[0]}</th>
                      <td>{row[1]}</td>
                      <td>{row[2]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TextSection>
          <TextSection id="bao-gia" title={copy.text('copy-8')}>
            <BulletList
              items={[
                copy.text('copy-9'),
                copy.text('copy-10'),
                copy.text('copy-11'),
                copy.text('copy-12'),
                copy.text('copy-13'),
              ]}
            />
            <MoreLink href={copy.text('copy-14')}>
              {copy.text('copy-15')}
            </MoreLink>
          </TextSection>
          <TextSection id="chung-tu" title={copy.text('copy-16')}>
            <h3>{copy.text('copy-17')}</h3>
            <p>{copy.text('copy-18')}</p>
            <h3>{copy.text('copy-19')}</h3>
            <p>{copy.text('copy-20')}</p>
            <h3>{copy.text('copy-21')}</h3>
            <p>{copy.text('copy-22')}</p>
            <div
              className="tbs-table-wrap"
              role="region"
              aria-label="Thông tin cần xác nhận về hồ sơ"
              tabIndex={0}
            >
              <table className="tbs-table">
                <caption>{copy.text('copy-23')}</caption>
                <thead>
                  <tr>
                    <th scope="col">{copy.text('copy-24')}</th>
                    <th scope="col">{copy.text('copy-25')}</th>
                    <th scope="col">{copy.text('copy-26')}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th scope="row">{copy.text('copy-27')}</th>
                    <td>{copy.text('copy-28')}</td>
                    <td>{copy.text('copy-29')}</td>
                  </tr>
                  <tr>
                    <th scope="row">{copy.text('copy-30')}</th>
                    <td>{copy.text('copy-31')}</td>
                    <td>{copy.text('copy-32')}</td>
                  </tr>
                  <tr>
                    <th scope="row">{copy.text('copy-33')}</th>
                    <td>{copy.text('copy-34')}</td>
                    <td>{copy.text('copy-35')}</td>
                  </tr>
                  <tr>
                    <th scope="row">{copy.text('copy-36')}</th>
                    <td>{copy.text('copy-37')}</td>
                    <td>{copy.text('copy-38')}</td>
                  </tr>
                  <tr>
                    <th scope="row">{copy.text('copy-39')}</th>
                    <td>{copy.text('copy-40')}</td>
                    <td>{copy.text('copy-41')}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p>{copy.text('copy-42')}</p>
          </TextSection>
          <TextSection id="phat-sinh" title={copy.text('copy-43')}>
            <p>{copy.text('copy-44')}</p>
            <MoreLink href={copy.text('copy-45')}>
              {copy.text('copy-46')}
            </MoreLink>
          </TextSection>
        </div>
        <Sidebar
          items={[
            { label: copy.text('copy-47'), href: copy.text('copy-48') },
            { label: copy.text('copy-49'), href: copy.text('copy-50') },
            { label: copy.text('copy-51'), href: copy.text('copy-52') },
            { label: copy.text('copy-53'), href: copy.text('copy-54') },
          ]}
        />
      </div>
    </PageFrame>
  )
}

export function KnowledgePage({
  q,
  category,
  preview,
}: {
  q?: string
  category?: string
  preview?: FixedPagePayload
}) {
  const copy = fixedPageCopy('knowledge', preview)

  return (
    <PageFrame
      eyebrow={copy.text('copy-1')}
      title={copy.title}
      description={copy.summary}
      image={copy.image}
      imageAlt={copy.imageAlts?.[copy.image]}
    >
      <section className="tbs-section">
        <div className="tbs-container">
          <KnowledgeFilter q={q} category={category} />
        </div>
      </section>
    </PageFrame>
  )
}

export function ArticlePage({ article }: { article: Article }) {
  const { article: copy } = publicTemplates()
  const articles = publishedItems('article')
  const related = articles.filter((item) => item.slug !== article.slug)
  return (
    <PageFrame
      eyebrow={article.category}
      title={article.title}
      description={article.summary}
      parents={[{ label: copy.parent, href: '/kien-thuc' }]}
    >
      <div className="tbs-container tbs-section tbs-page-grid">
        <article className="tbs-prose">
          <p className="tbs-article-meta">{copy.byline}</p>
          {article.sections.map((section, index) => (
            <TextSection
              key={section.heading}
              id={`muc-${index + 1}`}
              title={section.heading}
            >
              {section.body.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </TextSection>
          ))}
          {article.slug === 'chuan-bi-thong-tin-lo-hang' && (
            <TextSection id="noi-dung-chuan-bi" title={copy.briefTitle}>
              <BriefCopy text={copy.brief} />
            </TextSection>
          )}
          <TextSection id="lien-quan" title={copy.relatedTitle}>
            {related.map((item) => (
              <p key={item.slug}>
                <MoreLink href={`/kien-thuc/${item.slug}`}>
                  {item.title}
                </MoreLink>
              </p>
            ))}
            <p>
              <MoreLink href={copy.costsHref}>{copy.costsLink}</MoreLink>
            </p>
          </TextSection>
        </article>
        <Sidebar
          items={article.sections.map((section, index) => ({
            label: section.heading,
            href: `#muc-${index + 1}`,
          }))}
        />
      </div>
    </PageFrame>
  )
}

export function FAQPage({ preview }: { preview?: FixedPagePayload } = {}) {
  const copy = fixedPageCopy('faq', preview)
  const commonFAQs = copy.collection(defaultFAQs, 'faqs')

  return (
    <PageFrame
      eyebrow={copy.text('copy-1')}
      title={copy.title}
      description={copy.summary}
      image={copy.image}
      imageAlt={copy.imageAlts?.[copy.image]}
    >
      <section className="tbs-section">
        <div className="tbs-container tbs-prose">
          <FAQList
            items={commonFAQs}
            relatedLabel={publicTemplates().shared.faqLink}
          />
        </div>
      </section>
    </PageFrame>
  )
}

export function ContactPage({ preview }: { preview?: FixedPagePayload } = {}) {
  const { identity: site } = publicSiteSettings()
  const copy = fixedPageCopy('contact', preview)

  return (
    <PageFrame
      eyebrow={copy.text('copy-1')}
      title={copy.title}
      description={copy.summary}
      image={copy.image}
      imageAlt={copy.imageAlts?.[copy.image]}
    >
      <section className="tbs-section">
        <div className="tbs-container tbs-page-grid">
          <div className="tbs-prose">
            <TextSection id="dau-moi" title={copy.text('copy-2')}>
              <p>
                {copy.text('copy-3')}
                <a href={`tel:${site.phone}`}>{site.phoneDisplay}</a>
              </p>
              <ContactLinks placement="contact-main" />
              <p>
                <a className="tbs-inline-link" href={`mailto:${site.email}`}>
                  <EnvelopeIcon width={20} height={20} aria-hidden="true" />
                  {site.email}
                </a>
              </p>
              <p>{copy.text('copy-4')}</p>
            </TextSection>
            <TextSection id="chuan-bi" title={copy.text('copy-5')}>
              <BriefCopy text={copy.text('preparation-brief')} />
            </TextSection>
          </div>
          <aside className="tbs-sidebar">
            <h2>{copy.text('copy-6')}</h2>
            <p>{copy.text('copy-7')}</p>
            <h2>{copy.text('copy-8')}</h2>
            <p>{copy.text('copy-9')}</p>
            <MoreLink href={copy.text('copy-10')}>
              {copy.text('copy-11')}
            </MoreLink>
            <MoreLink href={copy.text('copy-12')}>
              {copy.text('copy-13')}
            </MoreLink>
          </aside>
        </div>
      </section>
    </PageFrame>
  )
}

export const policyContent = {
  'bao-mat': {
    title: 'Thông tin về dữ liệu và quyền riêng tư',
    description:
      'Cách sử dụng thông tin khi đọc nội dung website và chủ động liên hệ với TBS.',
    sections: [
      {
        heading: 'Đọc nội dung và tìm kiếm',
        body: [
          'Các trang giới thiệu dịch vụ có thể đọc mà không cần đăng ký tài khoản. Website không có biểu mẫu xin số điện thoại hoặc đăng ký nhận tin trên các trang marketing này.',
          'Từ khóa tìm kiếm và lựa chọn chủ đề xuất hiện trong địa chỉ trang kiến thức, có thể được lưu trong lịch sử trình duyệt và nhật ký truy cập của hạ tầng. Không nhập thông tin riêng tư hoặc dữ liệu lô hàng vào ô tìm kiếm.',
        ],
      },
      {
        heading: 'Khi chủ động liên hệ',
        body: [
          'Liên kết điện thoại, email và Zalo mở ứng dụng hoặc dịch vụ tương ứng. Thông tin anh/chị gửi qua những kênh đó do anh/chị chủ động lựa chọn; mỗi nền tảng có cơ chế xử lý dữ liệu riêng.',
          'Thông tin về sản phẩm, giao nhận và đầu mối liên hệ được dùng để trao đổi nhu cầu và phối hợp công việc được yêu cầu. Chỉ chia sẻ dữ liệu cần thiết; hồ sơ có dữ liệu của bên khác cần được kiểm tra quyền chia sẻ trước khi gửi.',
        ],
      },
      {
        heading: 'Nội dung sao chép và dữ liệu kỹ thuật',
        body: [
          'Nút sao chép chỉ ghi mẫu văn bản chuẩn bị vào bộ nhớ tạm sau thao tác của người dùng. Chức năng này không đọc nội dung sẵn có trong bộ nhớ tạm và không gửi mẫu đã chỉnh sửa cho TBS.',
          'Việc truy cập website có thể tạo dữ liệu kỹ thuật ở trình duyệt và hạ tầng phục vụ trang, như địa chỉ mạng, thời điểm, trang được yêu cầu và thông tin lỗi. Đây là dữ liệu khác với thông tin anh/chị chủ động gửi qua kênh liên hệ.',
        ],
      },
      {
        heading: 'Phạm vi chia sẻ khi thực hiện dịch vụ',
        body: [
          'Khi một phương án cần phối hợp nhiều bên, phạm vi thông tin chuyển cho nhà cung cấp hoặc đơn vị thực hiện cần được xác định theo phần việc. Không nên gửi toàn bộ dữ liệu giao dịch nếu chỉ một phần cần thiết cho người tiếp nhận.',
          'Yêu cầu giữ bí mật, quyền chia sẻ hồ sơ và điều kiện lưu giữ cần được thống nhất theo giao dịch. Trang này không đưa ra thời hạn lưu giữ hoặc cam kết bảo mật tuyệt đối cho mọi nền tảng liên lạc.',
        ],
      },
      {
        heading: 'Trao đổi về thông tin đã cung cấp',
        body: [
          'Để yêu cầu kiểm tra, sửa hoặc trao đổi về việc sử dụng thông tin đã gửi cho TBS, liên hệ email hoặc điện thoại công khai bên dưới. Nêu kênh đã sử dụng, thời điểm và nội dung cần xử lý; tránh gửi thêm dữ liệu nhạy cảm không cần thiết.',
          'Yêu cầu được xem xét theo hồ sơ thực tế và trách nhiệm liên quan của giao dịch. Nội dung ở đây mô tả phạm vi website và cách liên hệ, không thay thế thỏa thuận xử lý dữ liệu riêng nếu các bên có ký kết.',
        ],
      },
    ],
  },
  'dieu-khoan': {
    title: 'Điều khoản sử dụng website',
    description:
      'Phạm vi tham khảo của nội dung, liên kết và thông tin dịch vụ trên website TBS GROUP.',
    sections: [
      {
        heading: 'Mục đích của nội dung',
        body: [
          'Website giới thiệu dịch vụ và cung cấp hướng dẫn chuẩn bị thông tin trước khi trao đổi với TBS. Nội dung không phải báo giá ràng buộc, xác nhận nhận mọi loại hàng hoặc cam kết kết quả cho một lô hàng chưa được kiểm tra.',
          'Các hướng dẫn về hồ sơ và chi phí là khung trao đổi. Việc áp dụng cần dựa trên sản phẩm, phương án giao dịch, dữ liệu và thời điểm thực hiện cụ thể.',
        ],
      },
      {
        heading: 'Xác nhận trước khi giao dịch',
        body: [
          'Phạm vi công việc, đơn vị thực hiện, điều kiện thanh toán, thời gian dự kiến và trách nhiệm các bên cần được thể hiện trong báo giá hoặc thỏa thuận phù hợp. Chỉ việc đọc trang hoặc bấm liên hệ không tạo thành xác nhận đặt dịch vụ.',
          'Khi nội dung trao đổi thay đổi, đề nghị đầu mối xác nhận phiên bản áp dụng. Nếu có điểm khác giữa thông tin giới thiệu và tài liệu của giao dịch, cần làm rõ trước khi triển khai.',
        ],
      },
      {
        heading: 'Sử dụng nội dung có trách nhiệm',
        body: [
          'Có thể chia sẻ đường dẫn đến bài viết để cùng trao đổi nhu cầu. Khi trích dẫn, giữ nguyên ngữ cảnh và ghi nguồn, không biến nội dung hướng dẫn thành một cam kết thương mại của TBS.',
          'Không sử dụng website để gửi dữ liệu trái phép, can thiệp hoạt động hoặc truy cập phần quản trị khi không có quyền. Việc sử dụng hình ảnh hay nội dung ngoài phạm vi tham khảo cần kiểm tra quyền sử dụng tương ứng.',
        ],
      },
      {
        heading: 'Liên kết và hình ảnh',
        body: [
          'Các liên kết mở ứng dụng liên lạc hoặc website bên ngoài chịu điều kiện vận hành của bên cung cấp tương ứng. Kiểm tra đúng đầu mối trước khi gửi thông tin giao dịch.',
          'Hình ảnh minh họa bối cảnh logistics không phải bằng chứng về quyền sở hữu kho, phương tiện, một khách hàng hay một lô hàng cụ thể của TBS. Không suy ra năng lực định lượng từ hình ảnh giới thiệu.',
        ],
      },
      {
        heading: 'Phản hồi về nội dung',
        body: [
          'Khi phát hiện thông tin chưa rõ hoặc có dấu hiệu không còn phù hợp, gửi đường dẫn và nội dung cần kiểm tra đến đầu mối công khai. TBS có thể cập nhật nội dung giới thiệu; điều kiện của một giao dịch đã xác nhận cần được trao đổi theo tài liệu của giao dịch đó.',
        ],
      },
    ],
  },
  'dich-vu': {
    title: 'Nguyên tắc thỏa thuận dịch vụ',
    description:
      'Những nội dung cần xác nhận về phạm vi, chi phí, giao nhận và phản hồi cho từng lô hàng.',
    sections: [
      {
        heading: 'Phạm vi được xác nhận theo lô',
        body: [
          'Trước khi thực hiện, các bên cần xác định hàng hóa, chủ thể giao dịch, phần việc, đơn vị phụ trách và đầu ra bàn giao. Phần việc phối hợp với bên khác cần được ghi rõ.',
          'Trang này là khung thông tin để trao đổi, không phải hợp đồng mẫu và không tự bổ sung quyền hoặc nghĩa vụ vào một thỏa thuận đã ký. Điều kiện áp dụng cần được đối chiếu với tài liệu của giao dịch.',
        ],
      },
      {
        heading: 'Đầu vào và thay đổi thông tin',
        body: [
          'Doanh nghiệp và nhà cung cấp cần phối hợp cung cấp dữ liệu đúng với hàng thực tế. Khi đổi model, vật liệu, số lượng, đóng gói hoặc nơi giao, thông báo cho đầu mối phụ trách để kiểm tra tác động.',
          'Nếu thông tin chưa đủ để xác định phương án, hai bên làm rõ nội dung cần bổ sung và điều kiện tiếp tục. Không mặc định dữ liệu của một lô trước áp dụng nguyên vẹn cho lô mới.',
        ],
      },
      {
        heading: 'Báo giá, thanh toán và phát sinh',
        body: [
          'Báo giá cần nêu phần đã gồm, chưa gồm, cơ sở tính, hiệu lực và mốc thanh toán. Khoản còn dự kiến cần được xác nhận khi đủ dữ liệu.',
          'Việc phát sinh cần có nội dung, lý do, căn cứ đối chiếu, chi phí và ảnh hưởng tiến độ nếu có. Người có quyền phê duyệt xác nhận theo thỏa thuận trước khi thực hiện phần việc mới.',
        ],
      },
      {
        heading: 'Giao nhận và hồ sơ',
        body: [
          'Thống nhất địa điểm, người nhận, phạm vi kiểm tra và cách ghi nhận bàn giao. Khi thấy khác biệt về kiện hàng hoặc hiện trạng, ghi lại dữ liệu liên quan để đối chiếu với đầu mối phụ trách.',
          'Danh mục hồ sơ, bên đứng tên, dạng bản bàn giao và thời điểm nhận được xác nhận theo phương án. Không áp dụng một danh sách chứng từ chung cho mọi mặt hàng và mọi hình thức giao dịch.',
        ],
      },
      {
        heading: 'Phản hồi, tổn thất và trách nhiệm',
        body: [
          'Phản hồi cần có mã lô, nội dung sự việc, thời điểm và dữ liệu đối chiếu phù hợp. Cách xử lý, điều kiện và phạm vi trách nhiệm được xem xét theo thỏa thuận cùng hồ sơ thực tế.',
          'Trang này không đưa ra tỷ lệ bồi thường, thời hạn khiếu nại, mức bảo hiểm hay cam kết hoàn tiền mặc định. Những nội dung đó cần được làm rõ trong tài liệu dịch vụ liên quan trước khi giao dịch.',
        ],
      },
    ],
  },
}

export type PolicySlug = keyof typeof policyContent

export function PolicyPage({
  slug,
  preview,
}: {
  slug: PolicySlug
  preview?: FixedPagePayload
}) {
  const copy = fixedPageCopy(`policy-${slug}`, preview)
  const shared = publicTemplates().shared
  const { identity: site } = publicSiteSettings()
  const policy = {
    title: copy.title,
    description: copy.summary,
    sections: copy.collection(policyContent[slug].sections, 'sections'),
  }
  return (
    <PageFrame
      eyebrow={shared.policyEyebrow}
      title={policy.title}
      description={policy.description}
      image={copy.image}
      imageAlt={copy.imageAlts?.[copy.image]}
    >
      <div className="tbs-container tbs-section tbs-page-grid">
        <article className="tbs-prose">
          {policy.sections.map((section, index) => (
            <TextSection
              key={section.heading}
              id={`muc-${index + 1}`}
              title={section.heading}
            >
              {section.body.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </TextSection>
          ))}
          <TextSection id="lien-he" title={shared.policyContactTitle}>
            <p>
              <a href={`mailto:${site.email}`}>{site.email}</a>
              <br />
              <a href={`tel:${site.phone}`}>{site.phoneDisplay}</a>
            </p>
            <p>
              <MoreLink href={shared.policyContactHref}>
                {shared.policyContactLink}
              </MoreLink>
            </p>
          </TextSection>
        </article>
        <Sidebar
          items={policy.sections.map((section, index) => ({
            label: section.heading,
            href: `#muc-${index + 1}`,
          }))}
        />
      </div>
    </PageFrame>
  )
}

export function SitemapPage() {
  const { sitemap: copy } = publicTemplates()
  const publicPages = publishedPages()
  return (
    <PageFrame
      eyebrow={copy.eyebrow}
      title={copy.title}
      description={copy.description}
    >
      <section className="tbs-section">
        <div className="tbs-container tbs-prose">
          <ul className="tbs-list">
            {publicPages.map((page) => (
              <li key={page.path}>
                <Link href={page.path}>{page.title}</Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </PageFrame>
  )
}
