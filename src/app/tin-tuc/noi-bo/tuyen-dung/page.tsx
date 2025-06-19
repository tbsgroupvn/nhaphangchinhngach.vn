import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import BackToTop from '@/components/BackToTop'
import MessengerButton from '@/components/MessengerButton'
import JobsSection from '@/components/JobsSection'
import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Tuyển dụng - TBS GROUP | Cơ hội nghề nghiệp xuất nhập khẩu',
  description: 'Tham gia đội ngũ TBS GROUP với mức lương hấp dẫn, môi trường chuyên nghiệp và cơ hội phát triển. Tuyển dụng các vị trí trong lĩnh vực logistics.',
  keywords: 'tuyển dụng TBS GROUP, việc làm logistics, xuất nhập khẩu, cơ hội nghề nghiệp, tin tức tuyển dụng'
}

export default function RecruitmentPage() {
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
            <Link href="/tin-tuc/noi-bo" className="text-gray-500 hover:text-primary-600 transition-colors">
              Tin nội bộ
            </Link>
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-gray-900 font-medium">Tuyển dụng</span>
          </nav>
        </div>
      </section>

      {/* Hero Section */}
      <section className="section-padding bg-gradient-to-br from-purple-50 via-white to-purple-100 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 left-10 w-32 h-32 bg-purple-600 rounded-full animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-24 h-24 bg-purple-400 rounded-full animate-bounce"></div>
        </div>
        
        <div className="container-max text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            <div className="inline-block p-4 bg-white rounded-2xl shadow-xl mb-6 hover:shadow-2xl transition-shadow duration-300">
              <span className="text-5xl">👥</span>
            </div>
            <h1 className="text-responsive-4xl font-bold text-gray-900 mb-6 fade-in">
              Tuyển dụng TBS GROUP
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-12 leading-relaxed slide-in-left">
              Tham gia đội ngũ <strong>chuyên nghiệp</strong> của TBS GROUP và phát triển sự nghiệp trong lĩnh vực <strong>xuất nhập khẩu</strong> đầy tiềm năng
            </p>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto mb-12">
              <div className="stat-card group hover:scale-110 transition-all duration-300">
                <div className="text-3xl font-bold text-white mb-2 group-hover:animate-bounce">8+</div>
                <div className="text-sm text-white/80">Năm phát triển</div>
              </div>
              <div className="stat-card group hover:scale-110 transition-all duration-300" style={{ animationDelay: '100ms' }}>
                <div className="text-3xl font-bold text-white mb-2 group-hover:animate-bounce">100+</div>
                <div className="text-sm text-white/80">Nhân viên</div>
              </div>
              <div className="stat-card group hover:scale-110 transition-all duration-300" style={{ animationDelay: '200ms' }}>
                <div className="text-3xl font-bold text-white mb-2 group-hover:animate-bounce">15+</div>
                <div className="text-sm text-white/80">Vị trí tuyển dụng</div>
              </div>
              <div className="stat-card group hover:scale-110 transition-all duration-300" style={{ animationDelay: '300ms' }}>
                <div className="text-3xl font-bold text-white mb-2 group-hover:animate-bounce">24/7</div>
                <div className="text-sm text-white/80">Môi trường năng động</div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="https://tbsgroup.sg.larksuite.com/share/base/form/shrlgmnZyfBzBpBASsSeOdDoD2c" 
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary text-lg px-8 py-4 group"
              >
                <svg className="w-5 h-5 mr-2 group-hover:animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                Ứng tuyển ngay
              </a>
              <a 
                href="mailto:hr@xuatnhapkhautbs.vn" 
                className="btn-secondary text-lg px-8 py-4 group"
              >
                <svg className="w-5 h-5 mr-2 group-hover:animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Liên hệ HR
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* News Categories Navigation */}
      <section className="py-8 bg-white border-b border-gray-200">
        <div className="container-max">
          <div className="flex flex-wrap justify-center gap-4">
            <Link 
              href="/cau-chuyen-khach-hang"
              className="flex items-center px-6 py-3 bg-gray-100 text-gray-700 rounded-full hover:bg-amber-100 hover:text-amber-700 transition-all duration-300 group"
            >
              <span className="mr-2 group-hover:animate-bounce">💼</span>
              Câu chuyện khách hàng
            </Link>
            <Link 
              href="/tin-tuc/nganh"
              className="flex items-center px-6 py-3 bg-gray-100 text-gray-700 rounded-full hover:bg-blue-100 hover:text-blue-700 transition-all duration-300 group"
            >
              <span className="mr-2 group-hover:animate-bounce">📈</span>
              Tin tức ngành
            </Link>
            <Link 
              href="/tin-tuc/noi-bo"
              className="flex items-center px-6 py-3 bg-gray-100 text-gray-700 rounded-full hover:bg-green-100 hover:text-green-700 transition-all duration-300 group"
            >
              <span className="mr-2 group-hover:animate-bounce">🏢</span>
              Tin nội bộ
            </Link>
            <Link 
              href="/tin-tuc/noi-bo/hoat-dong-cong-ty"
              className="flex items-center px-6 py-3 bg-gray-100 text-gray-700 rounded-full hover:bg-teal-100 hover:text-teal-700 transition-all duration-300 group"
            >
              <span className="mr-2 group-hover:animate-bounce">🎯</span>
              Hoạt động công ty
            </Link>
            <div className="flex items-center px-6 py-3 bg-purple-100 text-purple-700 rounded-full font-semibold">
              <span className="mr-2">👥</span>
              Tuyển dụng
            </div>
            <Link 
              href="/tin-tuc/cam-nang-xnk"
              className="flex items-center px-6 py-3 bg-gray-100 text-gray-700 rounded-full hover:bg-indigo-100 hover:text-indigo-700 transition-all duration-300 group"
            >
              <span className="mr-2 group-hover:animate-bounce">📚</span>
              Kiến thức - Cẩm nang XNK
            </Link>
          </div>
        </div>
      </section>

      {/* Jobs Content */}
      <JobsSection />

      <Footer />
      <BackToTop />
      <MessengerButton />
    </main>
  )
}
