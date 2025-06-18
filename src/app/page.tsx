import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import BackToTop from '@/components/BackToTop'
import MessengerButton from '@/components/MessengerButton'
import ShippingCalculator from '@/components/ShippingCalculator'
import ResourceCenter from '@/components/ResourceCenter'
import Testimonials from '@/components/Testimonials'
import Newsletter from '@/components/Newsletter'
import ProcessSteps from '@/components/ProcessSteps'
import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="section-padding bg-gradient-to-br from-primary-50 to-white relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="absolute top-20 right-20 w-64 h-64 bg-primary-200 rounded-full opacity-10 blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-48 h-48 bg-blue-200 rounded-full opacity-10 blur-3xl"></div>
        
        <div className="container-max relative z-10">
          <div className="text-center">
            <div className="flex items-center justify-center mb-6">
              <div className="flex items-center space-x-2">
                <span className="text-3xl animate-bounce">🚢</span>
                <span className="text-3xl animate-pulse">🏭</span>
                <span className="text-3xl animate-bounce delay-100">🚛</span>
              </div>
            </div>
            
            <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              TBS GROUP
            </h1>
            <h2 className="text-2xl lg:text-3xl text-primary-600 mb-8">
              Dịch vụ nhập hàng Trung Quốc chính ngạch uy tín
            </h2>
            <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
              Chuyên cung cấp dịch vụ nhập khẩu hàng hóa từ Trung Quốc với đầy đủ hóa đơn, 
              hợp đồng chính ngạch. Cam kết minh bạch, bảo vệ quyền lợi tối đa cho khách hàng.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
              <Link href="/lien-he" className="btn-primary text-center flex items-center justify-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                Tư vấn miễn phí
              </Link>
              <Link href="/dich-vu" className="btn-secondary text-center flex items-center justify-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                Xem bảng giá
              </Link>
            </div>
          </div>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 bg-white rounded-2xl shadow-lg p-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-600 mb-2">8</div>
              <div className="text-gray-600">Năm kinh nghiệm</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-600 mb-2">8000+</div>
              <div className="text-gray-600">Khách hàng tin tưởng</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-600 mb-2">200000</div>
              <div className="text-gray-600">Đơn nhập khẩu chính ngạch</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-600 mb-2">24/7</div>
              <div className="text-gray-600">Hỗ trợ khách hàng</div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="section-padding bg-gray-50">
        <div className="container-max">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Dịch vụ chính
            </h2>
            <p className="text-xl text-gray-600">
              Giải pháp nhập khẩu toàn diện cho doanh nghiệp và cá nhân
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="card hover:shadow-xl transition-all duration-300 group text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary-200 transition-colors">
                <span className="text-2xl">📋</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Nhập khẩu chính ngạch</h3>
              <p className="text-gray-600 mb-4">Đầy đủ hóa đơn, hợp đồng, minh bạch 100%</p>
              <Link href="/dich-vu" className="text-primary-600 hover:text-primary-700 font-medium">
                Tìm hiểu thêm →
              </Link>
            </div>
            
            <div className="card hover:shadow-xl transition-all duration-300 group text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-200 transition-colors">
                <span className="text-2xl">🚛</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Vận chuyển đa tuyến</h3>
              <p className="text-gray-600 mb-4">Đường bộ, đường biển với giá cước cạnh tranh</p>
              <Link href="/dich-vu" className="text-primary-600 hover:text-primary-700 font-medium">
                Xem bảng giá →
              </Link>
            </div>
            
            <div className="card hover:shadow-xl transition-all duration-300 group text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors">
                <span className="text-2xl">📦</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Gom hàng tại nguồn</h3>
              <p className="text-gray-600 mb-4">Chiết Giang, Hà Bắc - trung tâm sản xuất lớn</p>
              <Link href="/gioi-thieu" className="text-primary-600 hover:text-primary-700 font-medium">
                Tìm hiểu thêm →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Process Steps */}
      <ProcessSteps />

      {/* Shipping Calculator */}
      <ShippingCalculator />

      {/* Latest News Preview */}
      <section className="section-padding bg-white">
        <div className="container-max">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Tin tức mới nhất
              </h2>
              <p className="text-xl text-gray-600">
                Cập nhật thông tin XNK và chính sách mới
              </p>
            </div>
            <Link href="/tin-tuc" className="btn-primary">
              Xem tất cả
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="card hover:shadow-xl transition-all duration-300">
              <div className="flex items-center mb-4">
                <span className="text-3xl mr-3">🏛️</span>
                <div>
                  <span className="inline-block px-2 py-1 text-xs bg-primary-100 text-primary-800 rounded-full">Chính sách</span>
                  <div className="text-sm text-gray-500 mt-1">15/06/2024</div>
                </div>
              </div>
              <h3 className="text-lg font-semibold mb-3">Chính sách thuế nhập khẩu mới 2024</h3>
              <p className="text-gray-600 mb-4">Bộ Tài chính điều chỉnh thuế suất cho một số mặt hàng từ Trung Quốc...</p>
              <Link href="/tin-tuc" className="text-primary-600 hover:text-primary-700 font-medium">
                Đọc thêm →
              </Link>
            </div>
            
            <div className="card hover:shadow-xl transition-all duration-300">
              <div className="flex items-center mb-4">
                <span className="text-3xl mr-3">📋</span>
                <div>
                  <span className="inline-block px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">Quy trình</span>
                  <div className="text-sm text-gray-500 mt-1">12/06/2024</div>
                </div>
              </div>
              <h3 className="text-lg font-semibold mb-3">Khai báo hải quan điện tử mới</h3>
              <p className="text-gray-600 mb-4">Hệ thống khai báo thế hệ mới giúp tiết kiệm thời gian...</p>
              <Link href="/tin-tuc" className="text-primary-600 hover:text-primary-700 font-medium">
                Đọc thêm →
              </Link>
            </div>
            
            <div className="card hover:shadow-xl transition-all duration-300">
              <div className="flex items-center mb-4">
                <span className="text-3xl mr-3">🏠</span>
                <div>
                  <span className="inline-block px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">Thị trường</span>
                  <div className="text-sm text-gray-500 mt-1">10/06/2024</div>
                </div>
              </div>
              <h3 className="text-lg font-semibold mb-3">Xu hướng hàng gia dụng điện</h3>
              <p className="text-gray-600 mb-4">Thị trường tiếp tục tăng trưởng với nhiều sản phẩm mới...</p>
              <Link href="/tin-tuc" className="text-primary-600 hover:text-primary-700 font-medium">
                Đọc thêm →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <Testimonials />

      {/* Newsletter */}
      <Newsletter />

      {/* Resource Center */}
      <ResourceCenter />

      {/* CTA Section */}
      <section className="section-padding bg-primary-600">
        <div className="container-max text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Sẵn sàng bắt đầu nhập khẩu?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Liên hệ ngay để được tư vấn miễn phí và báo giá chi tiết cho nhu cầu của bạn
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/lien-he" className="bg-white text-primary-600 hover:bg-gray-100 font-medium py-3 px-6 rounded-lg transition-colors">
              Tư vấn miễn phí
            </Link>
            <a href="tel:+84976005335" className="border-2 border-white text-white hover:bg-white hover:text-primary-600 font-medium py-3 px-6 rounded-lg transition-colors">
              Gọi ngay: 0976 005 335
            </a>
          </div>
        </div>
      </section>

      <Footer />
      <BackToTop />
      <MessengerButton />
    </main>
  )
} 