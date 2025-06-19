import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import ZaloQR from '@/components/ZaloQR'
import MiniChatbot from '@/components/MiniChatbot'
import AnalyticsScripts from '@/components/AnalyticsScripts'
import React, { Suspense } from 'react'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'TBS GROUP - Dịch vụ nhập hàng Trung Quốc chính ngạch uy tín',
  description: 'TBS GROUP chuyên cung cấp dịch vụ nhập khẩu hàng hóa từ Trung Quốc chính ngạch. Minh bạch, uy tín, giá cước cạnh tranh. Hotline: 0976 005 335',
  keywords: 'nhập khẩu trung quốc, hàng chính ngạch, vận chuyển hàng hóa, TBS GROUP, xuất nhập khẩu',
  authors: [{ name: 'TBS GROUP' }],
  creator: 'TBS GROUP',
  publisher: 'TBS GROUP',
  openGraph: {
    title: 'TBS GROUP - Dịch vụ nhập hàng Trung Quốc chính ngạch uy tín',
    description: 'TBS GROUP chuyên cung cấp dịch vụ nhập khẩu hàng hóa từ Trung Quốc chính ngạch. Minh bạch, uy tín, giá cước cạnh tranh.',
    images: [
      {
        url: '/images/tbs-logo.png',
        width: 800,
        height: 600,
        alt: 'TBS GROUP Logo',
      },
    ],
    locale: 'vi_VN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TBS GROUP - Dịch vụ nhập hàng Trung Quốc chính ngạch uy tín',
    description: 'TBS GROUP chuyên cung cấp dịch vụ nhập khẩu hàng hóa từ Trung Quốc chính ngạch. Minh bạch, uy tín, giá cước cạnh tranh.',
    images: ['/images/tbs-logo.png'],
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/images/tbs-logo.png', sizes: '32x32', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: '/images/tbs-logo.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="vi">
      <head>
        {/* DNS Prefetch for Performance */}
        <link rel="dns-prefetch" href="//www.google-analytics.com" />
        <link rel="dns-prefetch" href="//www.googletagmanager.com" />
        <link rel="dns-prefetch" href="//clarity.ms" />
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        
        {/* Preconnect for better performance */}
        <link rel="preconnect" href="https://www.google-analytics.com" />
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://clarity.ms" />
      </head>
      <body className={inter.className}>
        {children}
        
        {/* Analytics Scripts */}
        <Suspense fallback={null}>
          <AnalyticsScripts />
        </Suspense>
        
        {/* Global Floating Components */}
        <ZaloQR />
        <MiniChatbot />
        
        {/* Cookie Consent - Load after page */}
        <Suspense fallback={null}>
          {/* <CookieConsent /> */}
        </Suspense>
        
        {/* Structured Data for Organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "TBS GROUP",
              "url": "https://tbs-group.netlify.app",
              "logo": "https://tbs-group.netlify.app/images/tbs-logo.png",
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
            })
          }}
        />
      </body>
    </html>
  )
} 