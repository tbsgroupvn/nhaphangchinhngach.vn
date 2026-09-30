import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import PageTransitions from '@/components/marketing/PageTransitions'
import {
  publicSeoSettings,
  publicSiteSettings,
} from '@/lib/studio/public-content'
import { NavigationGuardProvider } from 'next-navigation-guard'
import './globals.css'
import './marketing.css'

const inter = Inter({
  subsets: ['latin', 'vietnamese'],
  display: 'swap',
  variable: '--font-inter',
})
export function generateMetadata(): Metadata {
  const { indexable, googleVerification } = publicSeoSettings()
  const { identity } = publicSiteSettings()
  return {
    metadataBase: new URL('https://nhaphangchinhngach.vn'),
    title: {
      default: identity.defaultTitle,
      template: `%s | ${identity.name}`,
    },
    description: identity.description,
    robots: { index: indexable, follow: indexable },
    openGraph: {
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
    twitter: { card: 'summary_large_image' },
    icons: { icon: '/favicon.ico' },
    verification: googleVerification.length
      ? { google: googleVerification }
      : undefined,
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="vi" className={inter.variable}>
      <body className={inter.className}>
        <NavigationGuardProvider>{children}</NavigationGuardProvider>
        <PageTransitions />
      </body>
    </html>
  )
}
