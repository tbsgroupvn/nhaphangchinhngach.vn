import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'TBS Learning - Hệ thống đào tạo nội bộ',
  description: 'Nền tảng học trực tuyến chuyên nghiệp dành cho nhân viên TBS GROUP',
  keywords: 'TBS GROUP, đào tạo, học trực tuyến, logistics, LMS',
  authors: [{ name: 'TBS GROUP IT Team' }],
  openGraph: {
    title: 'TBS Learning - Hệ thống đào tạo nội bộ',
    description: 'Nền tảng học trực tuyến chuyên nghiệp dành cho nhân viên TBS GROUP',
    url: 'https://daotao.nhapkhauchinhngach.vn',
    siteName: 'TBS Learning',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="vi">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
} 