import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import BackToTop from '@/components/BackToTop'
import MessengerButton from '@/components/MessengerButton'
import NewsSection from '@/components/NewsSection'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Tin tức xuất nhập khẩu - TBS GROUP | Cập nhật chính sách và xu hướng thị trường',
  description: 'Theo dõi tin tức mới nhất về xuất nhập khẩu, chính sách thuế, quy trình hải quan và xu hướng thị trường từ TBS GROUP.',
  keywords: 'tin tức xuất nhập khẩu, chính sách thuế, quy trình hải quan, xu hướng thị trường'
}

export default function NewsPage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="section-padding bg-gradient-to-br from-primary-50 to-white">
        <div className="container-max text-center">
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Tin tức Xuất Nhập Khẩu
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Cập nhật nhanh nhất về chính sách, quy trình và xu hướng thị trường xuất nhập khẩu
          </p>
        </div>
      </section>

      {/* News Content */}
      <NewsSection />

      <Footer />
      <BackToTop />
      <MessengerButton />
    </main>
  )
} 