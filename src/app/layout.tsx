import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import ZaloQR from '@/components/ZaloQR'
import MiniChatbot from '@/components/MiniChatbot'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'TBS GROUP - Dịch vụ nhập hàng Trung Quốc chính ngạch uy tín',
  description: 'TBS GROUP chuyên cung cấp dịch vụ nhập khẩu hàng hóa từ Trung Quốc chính ngạch. Minh bạch, uy tín, giá cước cạnh tranh. Hotline: 0976 005 335',
  keywords: 'nhập khẩu trung quốc, hàng chính ngạch, vận chuyển hàng hóa, TBS GROUP, xuất nhập khẩu',
  authors: [{ name: 'TBS GROUP' }],
  creator: 'TBS GROUP',
  publisher: 'TBS GROUP',
  icons: {
    icon: '/favicon.ico',
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
      <body className={inter.className}>
        {children}
        {/* Global Floating Components */}
        <ZaloQR />
        <MiniChatbot />
      </body>
    </html>
  )
} 