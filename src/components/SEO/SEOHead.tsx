import Head from 'next/head'
import { useRouter } from 'next/router'

interface SEOProps {
  title?: string
  description?: string
  keywords?: string[]
  image?: string
  url?: string
  type?: 'website' | 'article' | 'service' | 'product'
  publishedTime?: string
  modifiedTime?: string
  author?: string
  category?: string
  tags?: string[]
  structuredData?: any
  noIndex?: boolean
  canonical?: string
}

export default function SEOHead({
  title = 'TBS GROUP - Công ty Xuất Nhập Khẩu Hàng Đầu Việt Nam',
  description = 'TBS GROUP chuyên cung cấp dịch vụ xuất nhập khẩu, logistics, thông quan hải quan với hơn 8000+ khách hàng tin tưởng. Tiết kiệm 30% chi phí, nhanh hơn 50% thời gian.',
  keywords = ['xuất nhập khẩu', 'nhập khẩu Trung Quốc', 'thông quan hải quan', 'logistics', 'TBS GROUP'],
  image = '/images/tbs-logo.png',
  url,
  type = 'website',
  publishedTime,
  modifiedTime,
  author = 'TBS GROUP',
  category,
  tags = [],
  structuredData,
  noIndex = false,
  canonical
}: SEOProps) {
  const router = useRouter()
  const currentUrl = url || `${process.env.NEXT_PUBLIC_SITE_URL || 'https://nhaphangchinhngach.vn'}${router.asPath}`
  const fullImageUrl = image.startsWith('http') ? image : `${process.env.NEXT_PUBLIC_SITE_URL || 'https://nhaphangchinhngach.vn'}${image}`

  // Generate title with brand
  const fullTitle = title.includes('TBS GROUP') ? title : `${title} | TBS GROUP`

  // Default structured data for organization
  const defaultStructuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "TBS GROUP",
    "url": "https://nhaphangchinhngach.vn",
    "logo": "https://nhaphangchinhngach.vn/images/tbs-logo.png",
    "description": "Công ty xuất nhập khẩu hàng đầu Việt Nam",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "123 Đường ABC",
      "addressLocality": "Quận 1",
      "addressRegion": "TP.HCM",
      "addressCountry": "VN"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+84-363-212-333",
      "contactType": "Customer Service",
      "areaServed": "VN",
      "availableLanguage": "Vietnamese"
    },
    "sameAs": [
      "https://facebook.com/tbsgroup",
      "https://linkedin.com/company/tbsgroup"
    ]
  }

  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords.join(', ')} />
      <meta name="author" content={author} />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="robots" content={noIndex ? 'noindex,nofollow' : 'index,follow'} />
      <meta name="language" content="Vietnamese" />
      <meta name="revisit-after" content="7 days" />
      <meta name="distribution" content="global" />
      <meta name="rating" content="general" />

      {/* Canonical URL */}
      <link rel="canonical" href={canonical || currentUrl} />

      {/* Open Graph Meta Tags */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:image" content={fullImageUrl} />
      <meta property="og:image:alt" content={title} />
      <meta property="og:site_name" content="TBS GROUP" />
      <meta property="og:locale" content="vi_VN" />
      {publishedTime && <meta property="article:published_time" content={publishedTime} />}
      {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
      {author && <meta property="article:author" content={author} />}
      {category && <meta property="article:section" content={category} />}
      {tags.map((tag, index) => (
        <meta key={index} property="article:tag" content={tag} />
      ))}

      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImageUrl} />
      <meta name="twitter:site" content="@tbsgroup" />
      <meta name="twitter:creator" content="@tbsgroup" />

      {/* Additional Meta Tags for Vietnamese market */}
      <meta name="geo.region" content="VN" />
      <meta name="geo.placename" content="Ho Chi Minh City" />
      <meta name="geo.position" content="10.8231;106.6297" />
      <meta name="ICBM" content="10.8231, 106.6297" />

      {/* Favicon and Icons */}
      <link rel="icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="manifest" href="/site.webmanifest" />

      {/* DNS Prefetch for Performance */}
      <link rel="dns-prefetch" href="//www.google-analytics.com" />
      <link rel="dns-prefetch" href="//www.googletagmanager.com" />
      <link rel="dns-prefetch" href="//clarity.ms" />
      <link rel="dns-prefetch" href="//fonts.googleapis.com" />

      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData || defaultStructuredData)
        }}
      />

      {/* Additional meta for business */}
      <meta name="business:contact_data:street_address" content="123 Đường ABC, Quận 1" />
      <meta name="business:contact_data:locality" content="TP.HCM" />
      <meta name="business:contact_data:region" content="TP.HCM" />
      <meta name="business:contact_data:postal_code" content="700000" />
      <meta name="business:contact_data:country_name" content="Vietnam" />
      <meta name="business:contact_data:email" content="info@tbs-group.vn" />
      <meta name="business:contact_data:phone_number" content="+84-363-212-333" />
              <meta name="business:contact_data:website" content="https://nhaphangchinhngach.vn" />

      {/* Performance hints */}
      <link rel="preconnect" href="https://www.google-analytics.com" />
      <link rel="preconnect" href="https://www.googletagmanager.com" />
      <link rel="preconnect" href="https://clarity.ms" />
    </Head>
  )
}

// Helper function to generate structured data for different content types
export const generateStructuredData = {
  service: (service: any) => ({
    "@context": "https://schema.org",
    "@type": "Service",
    "name": service.title,
    "description": service.description,
    "provider": {
      "@type": "Organization",
      "name": "TBS GROUP",
                "url": "https://nhaphangchinhngach.vn"
    },
    "category": service.category,
    "offers": {
      "@type": "Offer",
      "price": service.priceFrom,
      "priceCurrency": "VND",
      "availability": "https://schema.org/InStock"
    }
  }),

  article: (article: any) => ({
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": article.title,
    "description": article.description,
    "image": article.image,
    "author": {
      "@type": "Organization",
      "name": "TBS GROUP"
    },
    "publisher": {
      "@type": "Organization",
      "name": "TBS GROUP",
      "logo": {
        "@type": "ImageObject",
                  "url": "https://nhaphangchinhngach.vn/images/tbs-logo.png"
      }
    },
    "datePublished": article.date,
    "dateModified": article.modifiedTime || article.date
  }),

  breadcrumb: (items: {name: string, url: string}[]) => ({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url
    }))
  }),

  faq: (faqs: {question: string, answer: string}[]) => ({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  })
} 