import Head from 'next/head'

interface SEOProps {
  title?: string
  description?: string
  keywords?: string[]
  image?: string
  url?: string
  type?: 'website' | 'article' | 'service'
  structuredData?: any
  noIndex?: boolean
}

export default function SEOHead({
  title = 'TBS GROUP - Công ty Xuất Nhập Khẩu Hàng Đầu Việt Nam',
  description = 'TBS GROUP chuyên cung cấp dịch vụ xuất nhập khẩu, logistics, thông quan hải quan với hơn 8000+ khách hàng tin tưởng.',
  keywords = ['xuất nhập khẩu', 'nhập khẩu Trung Quốc', 'logistics', 'TBS GROUP'],
  image = '/images/tbs-logo.png',
  url = 'https://nhaphangchinhngach.vn',
  type = 'website',
  structuredData,
  noIndex = false
}: SEOProps) {
  const fullTitle = title.includes('TBS GROUP') ? title : `${title} | TBS GROUP`
  const fullImageUrl = image.startsWith('http') ? image : `https://nhaphangchinhngach.vn${image}`

  const defaultStructuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "TBS GROUP",
    "url": "https://nhaphangchinhngach.vn",
    "logo": "https://nhaphangchinhngach.vn/images/tbs-logo.png",
    "description": "Công ty xuất nhập khẩu hàng đầu Việt Nam"
  }

  return (
    <Head>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords.join(', ')} />
      <meta name="robots" content={noIndex ? 'noindex,nofollow' : 'index,follow'} />
      
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={fullImageUrl} />
      <meta property="og:site_name" content="TBS GROUP" />
      
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImageUrl} />
      
      <link rel="canonical" href={url} />
      
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData || defaultStructuredData)
        }}
      />
    </Head>
  )
} 