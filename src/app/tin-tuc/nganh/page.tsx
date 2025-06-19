import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import BackToTop from '@/components/BackToTop'
import MessengerButton from '@/components/MessengerButton'
import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Tin tức ngành - TBS GROUP | Cập nhật thông tin thị trường xuất nhập khẩu',
  description: 'Theo dõi những tin tức mới nhất về thị trường xuất nhập khẩu, logistics và thương mại quốc tế. Cập nhật chính sách, quy định và xu hướng ngành.',
  keywords: 'tin tức ngành, xuất nhập khẩu, logistics, thương mại quốc tế, chính sách xuất nhập khẩu'
}

export default function IndustryNewsPage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      
      {/* Breadcrumb */}
      <section className="bg-gray-50 py-4">
        <div className="container-max">
          <nav className="flex items-center space-x-2 text-sm">
            <Link href="/" className="text-gray-500 hover:text-primary-600 transition-colors">
              Trang chủ
            </Link>
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <Link href="/tin-tuc" className="text-gray-500 hover:text-primary-600 transition-colors">
              Tin tức
            </Link>
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-gray-900 font-medium">Tin tức ngành</span>
          </nav>
        </div>
      </section>

      {/* Hero Section */}
      <section className="section-padding bg-gradient-to-br from-blue-50 via-white to-blue-100 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 left-10 w-32 h-32 bg-blue-600 rounded-full animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-24 h-24 bg-blue-400 rounded-full animate-bounce"></div>
        </div>
        
        <div className="container-max text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            <div className="inline-block p-4 bg-white rounded-2xl shadow-xl mb-6 hover:shadow-2xl transition-shadow duration-300">
              <span className="text-5xl">📈</span>
            </div>
            <h1 className="text-responsive-4xl font-bold text-gray-900 mb-6 fade-in">
              Tin tức ngành
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed slide-in-left">
              Cập nhật những <strong>thông tin mới nhất</strong> về thị trường xuất nhập khẩu, logistics và thương mại quốc tế
            </p>
          </div>
        </div>
      </section>

      {/* News Categories Navigation */}
      <section className="py-8 bg-white border-b border-gray-200">
        <div className="container-max">
          <div className="flex flex-wrap justify-center gap-4">
            <div className="flex items-center px-6 py-3 bg-blue-100 text-blue-700 rounded-full font-semibold">
              <span className="mr-2">📈</span>
              Tin tức ngành
            </div>
            <Link 
              href="/tin-tuc/noi-bo"
              className="flex items-center px-6 py-3 bg-gray-100 text-gray-700 rounded-full hover:bg-green-100 hover:text-green-700 transition-all duration-300 group"
            >
              <span className="mr-2 group-hover:animate-bounce">🏢</span>
              Tin tức nội bộ
            </Link>
            <Link 
              href="/tin-tuc/tuyen-dung"
              className="flex items-center px-6 py-3 bg-gray-100 text-gray-700 rounded-full hover:bg-purple-100 hover:text-purple-700 transition-all duration-300 group"
            >
              <span className="mr-2 group-hover:animate-bounce">👥</span>
              Tuyển dụng
            </Link>
            <Link 
              href="/tin-tuc"
              className="flex items-center px-6 py-3 bg-primary-600 text-white rounded-full hover:bg-primary-700 transition-all duration-300 group"
            >
              <span className="mr-2 group-hover:animate-bounce">📰</span>
              Tất cả tin tức
            </Link>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="section-padding bg-white">
        <div className="container-max">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Tin tức ngành sắp cập nhật
            </h2>
            <div className="text-center">
              <p className="text-lg text-gray-600 mb-8">
                Chúng tôi đang chuẩn bị nội dung tin tức ngành mới nhất. Vui lòng quay lại sau!
              </p>
              <Link href="/tin-tuc" className="btn-primary">
                Quay lại trang tin tức
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <BackToTop />
      <MessengerButton />
    </main>
  )
}
