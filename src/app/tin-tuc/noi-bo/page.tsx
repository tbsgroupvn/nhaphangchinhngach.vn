import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import BackToTop from '@/components/BackToTop'
import MessengerButton from '@/components/MessengerButton'
import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Tin tức nội bộ - TBS GROUP | Hoạt động và sự kiện công ty',
  description: 'Cập nhật những hoạt động, sự kiện và thông tin nội bộ của TBS GROUP. Văn hóa doanh nghiệp, thành tựu và các hoạt động team building.',
  keywords: 'tin tức nội bộ TBS GROUP, hoạt động công ty, văn hóa doanh nghiệp, team building, thành tựu'
}

export default function InternalNewsPage() {
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
            <span className="text-gray-900 font-medium">Tin tức nội bộ</span>
          </nav>
        </div>
      </section>

      {/* Hero Section */}
      <section className="section-padding bg-gradient-to-br from-green-50 via-white to-green-100 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 left-10 w-32 h-32 bg-green-600 rounded-full animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-24 h-24 bg-green-400 rounded-full animate-bounce"></div>
        </div>
        
        <div className="container-max text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            <div className="inline-block p-4 bg-white rounded-2xl shadow-xl mb-6 hover:shadow-2xl transition-shadow duration-300">
              <span className="text-5xl">🏢</span>
            </div>
            <h1 className="text-responsive-4xl font-bold text-gray-900 mb-6 fade-in">
              Tin tức nội bộ TBS GROUP
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed slide-in-left">
              Cập nhật những <strong>hoạt động và sự kiện</strong> nội bộ của TBS GROUP, văn hóa doanh nghiệp và thành tựu đạt được
            </p>
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
            <div className="flex items-center px-6 py-3 bg-green-100 text-green-700 rounded-full font-semibold">
              <span className="mr-2">🏢</span>
              Tin nội bộ
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

      {/* Sub-categories */}
      <section className="section-padding bg-gray-50">
        <div className="container-max">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Chuyên mục tin nội bộ</h2>
            <p className="text-xl text-gray-600">Khám phá các hoạt động và cơ hội tại TBS GROUP</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Link 
              href="/tin-tuc/noi-bo/hoat-dong-cong-ty"
              className="group bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden hover:-translate-y-2"
            >
              <div className="bg-gradient-to-r from-teal-500 to-cyan-600 p-8 text-white">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center group-hover:bg-white/30 transition-colors">
                    <span className="text-3xl group-hover:animate-bounce">🎯</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm opacity-80">Cập nhật</div>
                    <div className="font-semibold">20+ hoạt động</div>
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-2">Hoạt động công ty</h3>
                <p className="text-white/90">Sự kiện, team building và văn hóa doanh nghiệp</p>
              </div>
              
              <div className="p-6">
                <div className="mb-4">
                  <span className="text-sm text-gray-500">Hoạt động mới nhất:</span>
                  <h4 className="font-semibold text-gray-900 mt-1 line-clamp-2 group-hover:text-teal-600 transition-colors">
                    Team Building Quý 4/2024 - Hành trình gắn kết tại Đà Lạt
                  </h4>
                </div>
                
                <div className="flex items-center text-teal-600 font-medium group-hover:translate-x-2 transition-transform duration-300">
                  Khám phá ngay
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>

            <Link 
              href="/tin-tuc/noi-bo/tuyen-dung"
              className="group bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden hover:-translate-y-2"
            >
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-8 text-white">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center group-hover:bg-white/30 transition-colors">
                    <span className="text-3xl group-hover:animate-bounce">👥</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm opacity-80">Cập nhật</div>
                    <div className="font-semibold">15+ vị trí</div>
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-2">Tuyển dụng</h3>
                <p className="text-white/90">Cơ hội nghề nghiệp và phát triển tại TBS GROUP</p>
              </div>
              
              <div className="p-6">
                <div className="mb-4">
                  <span className="text-sm text-gray-500">Vị trí hot nhất:</span>
                  <h4 className="font-semibold text-gray-900 mt-1 line-clamp-2 group-hover:text-purple-600 transition-colors">
                    Nhân viên Xuất nhập khẩu - Mức lương hấp dẫn
                  </h4>
                </div>
                
                <div className="flex items-center text-purple-600 font-medium group-hover:translate-x-2 transition-transform duration-300">
                  Ứng tuyển ngay
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured News */}
      <section className="section-padding bg-white">
        <div className="container-max">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Tin nổi bật</h2>
            <p className="text-xl text-gray-600">Những thông tin nội bộ quan trọng nhất</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <article className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group hover:-translate-y-2">
              <div className="p-6 text-center border-b border-gray-100">
                <div className="text-5xl mb-3 group-hover:animate-bounce">🏆</div>
                <div className="inline-block px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full mb-2">
                  Thành tựu
                </div>
                <div className="text-sm text-gray-500">20/12/2024</div>
              </div>
              
              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2">
                  TBS GROUP đạt chứng nhận ISO 9001:2015
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-3">
                  Sau quá trình nỗ lực không ngừng, TBS GROUP đã chính thức đạt được chứng nhận ISO 9001:2015, khẳng định cam kết về chất lượng dịch vụ...
                </p>
                
                <button className="w-full btn-secondary group">
                  <span>Đọc thêm</span>
                  <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </article>

            <article className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group hover:-translate-y-2">
              <div className="p-6 text-center border-b border-gray-100">
                <div className="text-5xl mb-3 group-hover:animate-bounce">🎉</div>
                <div className="inline-block px-3 py-1 bg-teal-100 text-teal-700 text-xs font-semibold rounded-full mb-2">
                  Sự kiện
                </div>
                <div className="text-sm text-gray-500">15/12/2024</div>
              </div>
              
              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2">
                  Lễ tổng kết năm 2024 thành công rực rỡ
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-3">
                  TBS GROUP tổ chức lễ tổng kết năm 2024 với sự tham gia nhiệt tình của toàn thể cán bộ nhân viên, đánh dấu một năm thành công...
                </p>
                
                <button className="w-full btn-secondary group">
                  <span>Đọc thêm</span>
                  <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </article>

            <article className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group hover:-translate-y-2">
              <div className="p-6 text-center border-b border-gray-100">
                <div className="text-5xl mb-3 group-hover:animate-bounce">💼</div>
                <div className="inline-block px-3 py-1 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full mb-2">
                  Tuyển dụng
                </div>
                <div className="text-sm text-gray-500">10/12/2024</div>
              </div>
              
              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2">
                  Mở rộng đội ngũ với 15 vị trí mới
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-3">
                  Để đáp ứng nhu cầu mở rộng kinh doanh, TBS GROUP đang tuyển dụng 15 vị trí với mức lương cạnh tranh và phúc lợi hấp dẫn...
                </p>
                
                <Link href="/tin-tuc/noi-bo/tuyen-dung" className="w-full btn-primary group">
                  <span>Ứng tuyển ngay</span>
                  <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </article>
          </div>
        </div>
      </section>

      <Footer />
      <BackToTop />
      <MessengerButton />
    </main>
  )
}
