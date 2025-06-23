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
import Image from 'next/image'

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      
      {/* Hero Banner */}
      <section className="relative h-[70vh] min-h-[600px] overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')"
          }}
        >
          {/* Dark overlay for better text readability */}
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
          
          {/* Additional gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary-900/80 via-transparent to-secondary-900/80"></div>
        </div>

        {/* Content Overlay */}
        <div className="relative z-10 h-full flex items-center">
          <div className="container-max">
            <div className="max-w-4xl">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
                <span className="block">Logistics</span>
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary-300 to-primary-400">
                  Chuyên nghiệp
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-primary-100 mb-8 max-w-2xl">
                Dịch vụ nhập khẩu từ Trung Quốc uy tín, nhanh chóng và an toàn. 
                Đối tác tin cậy cho doanh nghiệp của bạn.
              </p>
              
              {/* Quick stats */}
              <div className="flex flex-wrap gap-8 mb-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary-300">8</div>
                  <div className="text-sm text-primary-200">Năm kinh nghiệm</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary-300">500+</div>
                  <div className="text-sm text-primary-200">Container/năm</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary-300">95%</div>
                  <div className="text-sm text-primary-200">Hài lòng</div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  href="/lien-he" 
                  className="bg-primary-600 hover:bg-primary-700 text-white font-semibold py-4 px-8 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg inline-flex items-center justify-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  Tư vấn miễn phí
                </Link>
                <Link 
                  href="/dich-vu" 
                  className="border-2 border-white text-white hover:bg-white hover:text-secondary-800 font-semibold py-4 px-8 rounded-full transition-all duration-300 transform hover:scale-105 inline-flex items-center justify-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  Xem dịch vụ
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent"></div>
      </section>

      {/* Services Overview - 11 Dịch vụ */}
      <section className="section-padding bg-gray-50">
        <div className="container-max">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-responsive-4xl font-bold text-gray-900 mb-4">
              11 Dịch vụ chuyên nghiệp
            </h2>
            <p className="text-responsive-xl text-gray-600">
              Giải pháp nhập khẩu toàn diện cho doanh nghiệp và cá nhân
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 sm:gap-6">
            {/* 1. Nhập khẩu chính ngạch */}
            <Link href="/dich-vu/nhap-khau-chinh-ngach" className="group">
              <div className="bg-white rounded-2xl p-4 sm:p-6 text-center hover:shadow-xl hover:scale-105 transition-all duration-300 border-2 border-transparent hover:border-sky-200">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-sky-500 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl sm:text-3xl text-white">🚢</span>
                </div>
                <h3 className="text-sm sm:text-base font-semibold text-slate-800 group-hover:text-sky-600 transition-colors">Nhập khẩu chính ngạch</h3>
              </div>
            </Link>

            {/* 2. Gom hàng lẻ */}
            <Link href="/dich-vu/gom-hang-le-ghep-container" className="group">
              <div className="bg-white rounded-2xl p-4 sm:p-6 text-center hover:shadow-xl hover:scale-105 transition-all duration-300 border-2 border-transparent hover:border-sky-200">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-sky-600 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl sm:text-3xl text-white">📦</span>
                </div>
                <h3 className="text-sm sm:text-base font-semibold text-slate-800 group-hover:text-sky-600 transition-colors">Gom hàng lẻ</h3>
              </div>
            </Link>

            {/* 3. Vận chuyển quốc tế */}
            <Link href="/dich-vu/van-chuyen-quoc-te" className="group">
              <div className="bg-white rounded-2xl p-4 sm:p-6 text-center hover:shadow-xl hover:scale-105 transition-all duration-300 border-2 border-transparent hover:border-sky-200">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-sky-700 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl sm:text-3xl text-white">🌍</span>
                </div>
                <h3 className="text-sm sm:text-base font-semibold text-slate-800 group-hover:text-sky-600 transition-colors">Vận chuyển quốc tế</h3>
              </div>
            </Link>

            {/* 4. Ủy thác XNK */}
            <Link href="/dich-vu/uy-thac-xuat-nhap-khau" className="group">
              <div className="bg-white rounded-2xl p-4 sm:p-6 text-center hover:shadow-xl hover:scale-105 transition-all duration-300 border-2 border-transparent hover:border-sky-200">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-slate-600 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl sm:text-3xl text-white">📄</span>
                </div>
                <h3 className="text-sm sm:text-base font-semibold text-slate-800 group-hover:text-sky-600 transition-colors">Ủy thác XNK</h3>
              </div>
            </Link>

            {/* 5. Tư vấn pháp lý */}
            <Link href="/dich-vu/tu-van-phap-ly-thue-xnk" className="group">
              <div className="bg-white rounded-2xl p-4 sm:p-6 text-center hover:shadow-xl hover:scale-105 transition-all duration-300 border-2 border-transparent hover:border-sky-200">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-slate-700 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl sm:text-3xl text-white">⚖️</span>
                </div>
                <h3 className="text-sm sm:text-base font-semibold text-slate-800 group-hover:text-sky-600 transition-colors">Tư vấn pháp lý</h3>
              </div>
            </Link>

            {/* 6. Kiểm tra nhà cung cấp */}
            <Link href="/dich-vu/kiem-tra-nha-cung-cap" className="group">
              <div className="bg-white rounded-2xl p-4 sm:p-6 text-center hover:shadow-xl hover:scale-105 transition-all duration-300 border-2 border-transparent hover:border-sky-200">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-sky-500 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl sm:text-3xl text-white">🔍</span>
                </div>
                <h3 className="text-sm sm:text-base font-semibold text-slate-800 group-hover:text-sky-600 transition-colors">Kiểm tra NCC</h3>
              </div>
            </Link>

            {/* 7. Thanh toán hộ */}
            <Link href="/dich-vu/thanh-toan-ho-trung-quoc" className="group">
              <div className="bg-white rounded-2xl p-4 sm:p-6 text-center hover:shadow-xl hover:scale-105 transition-all duration-300 border-2 border-transparent hover:border-sky-200">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-slate-500 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl sm:text-3xl text-white">💰</span>
                </div>
                <h3 className="text-sm sm:text-base font-semibold text-slate-800 group-hover:text-sky-600 transition-colors">Thanh toán hộ</h3>
              </div>
            </Link>

            {/* 8. Thông quan */}
            <Link href="/dich-vu/thong-quan-chung-tu" className="group">
              <div className="bg-white rounded-2xl p-4 sm:p-6 text-center hover:shadow-xl hover:scale-105 transition-all duration-300 border-2 border-transparent hover:border-sky-200">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-sky-800 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl sm:text-3xl text-white">📋</span>
                </div>
                <h3 className="text-sm sm:text-base font-semibold text-slate-800 group-hover:text-sky-600 transition-colors">Thông quan</h3>
              </div>
            </Link>

            {/* 9. Đóng gói & bảo hiểm */}
            <Link href="/dich-vu/dong-goi-bao-hiem-hang" className="group">
              <div className="bg-white rounded-2xl p-4 sm:p-6 text-center hover:shadow-xl hover:scale-105 transition-all duration-300 border-2 border-transparent hover:border-sky-200">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-slate-600 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl sm:text-3xl text-white">📦</span>
                </div>
                <h3 className="text-sm sm:text-base font-semibold text-slate-800 group-hover:text-sky-600 transition-colors">Đóng gói & bảo hiểm</h3>
              </div>
            </Link>

            {/* 10. Kho bãi */}
            <Link href="/dich-vu/kho-bai-trung-viet" className="group">
              <div className="bg-white rounded-2xl p-4 sm:p-6 text-center hover:shadow-xl hover:scale-105 transition-all duration-300 border-2 border-transparent hover:border-sky-200">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-sky-600 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl sm:text-3xl text-white">🏭</span>
                </div>
                <h3 className="text-sm sm:text-base font-semibold text-slate-800 group-hover:text-sky-600 transition-colors">Kho bãi TQ-VN</h3>
              </div>
            </Link>

            {/* 11. Cảnh báo rủi ro */}
            <Link href="/dich-vu/canh-bao-rui-ro-xnk" className="group">
              <div className="bg-white rounded-2xl p-4 sm:p-6 text-center hover:shadow-xl hover:scale-105 transition-all duration-300 border-2 border-transparent hover:border-sky-200">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-slate-700 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl sm:text-3xl text-white">⚠️</span>
                </div>
                <h3 className="text-sm sm:text-base font-semibold text-slate-800 group-hover:text-sky-600 transition-colors">Cảnh báo rủi ro</h3>
              </div>
            </Link>
          </div>
        </div>
      </section>





      {/* Process Steps */}
      <ProcessSteps />

      {/* Shipping Calculator */}
      <ShippingCalculator />

      {/* Latest News Preview - Redesigned */}
      <section className="section-padding bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container-max">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              📰 Tin tức & Cập nhật chính sách
            </h2>
            <p className="text-xl text-gray-600 mb-6">
              Thông tin mới nhất về xuất nhập khẩu, chính sách thuế và xu hướng thị trường
            </p>
            <Link href="/tin-tuc" className="btn-primary inline-flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2.5 2.5 0 00-2.5-2.5H15" />
              </svg>
              Xem tất cả tin tức
            </Link>
          </div>
          
          {/* Featured News */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Main Featured Article */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden group hover:shadow-2xl transition-all duration-300">
              <div className="h-48 bg-gradient-to-r from-primary-500 to-blue-600 relative overflow-hidden">
                <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                <div className="absolute top-4 left-4">
                  <span className="inline-block px-3 py-1 bg-red-500 text-white text-xs font-semibold rounded-full">
                    🔥 HOT
                  </span>
                </div>
                <div className="absolute bottom-4 left-4 text-white">
                  <div className="text-xs opacity-80">20/12/2024</div>
                  <div className="text-sm font-medium">Chính sách mới</div>
                </div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-6xl opacity-30">
                  🏛️
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary-600 transition-colors">
                  Thuế suất nhập khẩu mới 2024 - Giảm 5-15% cho hàng điện tử
                </h3>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  Chính phủ chính thức ban hành nghị định mới về thuế nhập khẩu ưu đãi cho các mặt hàng điện tử, gia dụng từ ASEAN và Trung Quốc...
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-gray-500">
                    <span className="mr-2">👁️</span>
                    <span>2,450 lượt xem</span>
                  </div>
                  <Link href="/tin-tuc" className="text-primary-600 hover:text-primary-700 font-semibold flex items-center">
                    Đọc chi tiết
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>

            {/* Secondary Articles */}
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border-l-4 border-green-500">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-2xl">
                    📋
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Hướng dẫn</span>
                      <span className="text-xs text-gray-500">18/12/2024</span>
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2 hover:text-green-600 transition-colors cursor-pointer">
                      Quy trình thông quan hải quan điện tử mới
                    </h4>
                    <p className="text-sm text-gray-600 mb-3">
                      Hệ thống VNACCS/VCIS phiên bản 5.0 chính thức áp dụng từ 01/01/2025...
                    </p>
                    <div className="flex items-center text-xs text-gray-500">
                      <span className="mr-3">👁️ 1,230</span>
                      <span>💬 15 bình luận</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border-l-4 border-purple-500">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-2xl">
                    📈
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">Phân tích</span>
                      <span className="text-xs text-gray-500">15/12/2024</span>
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2 hover:text-purple-600 transition-colors cursor-pointer">
                      Thị trường nhập khẩu Q4/2024: Tăng trưởng 18%
                    </h4>
                    <p className="text-sm text-gray-600 mb-3">
                      Khảo sát của Tổng cục Hải quan cho thấy kim ngạch nhập khẩu từ TQ tăng mạnh...
                    </p>
                    <div className="flex items-center text-xs text-gray-500">
                      <span className="mr-3">👁️ 890</span>
                      <span>💬 8 bình luận</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border-l-4 border-orange-500">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center text-2xl">
                    ⚠️
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full">Cảnh báo</span>
                      <span className="text-xs text-gray-500">12/12/2024</span>
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2 hover:text-orange-600 transition-colors cursor-pointer">
                      Danh sách hàng cấm nhập khẩu cập nhật mới
                    </h4>
                    <p className="text-sm text-gray-600 mb-3">
                      Bộ Công Thương bổ sung 12 mặt hàng mới vào danh sách cấm nhập khẩu...
                    </p>
                    <div className="flex items-center text-xs text-gray-500">
                      <span className="mr-3">👁️ 3,120</span>
                      <span>💬 25 bình luận</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary-600 mb-1">156</div>
                <div className="text-sm text-gray-600">Bài viết hữu ích</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600 mb-1">24/7</div>
                <div className="text-sm text-gray-600">Cập nhật tin tức</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600 mb-1">8,500+</div>
                <div className="text-sm text-gray-600">Lượt đọc/tháng</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600 mb-1">95%</div>
                <div className="text-sm text-gray-600">Thông tin chính xác</div>
              </div>
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
          <h2 className="text-responsive-4xl font-bold text-white mb-4">
            Sẵn sàng bắt đầu nhập khẩu?
          </h2>
          <p className="text-responsive-xl text-primary-100 mb-6 sm:mb-8 max-w-2xl mx-auto">
            Liên hệ ngay để được tư vấn miễn phí và báo giá chi tiết cho nhu cầu của bạn
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/lien-he" className="bg-white text-primary-600 hover:bg-gray-100 font-medium py-3 px-6 rounded-lg transition-colors inline-flex items-center justify-center">
              Tư vấn miễn phí
            </Link>
            <a href="tel:+84976005335" className="border-2 border-white text-white hover:bg-white hover:text-primary-600 font-medium py-3 px-6 rounded-lg transition-colors inline-flex items-center justify-center">
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