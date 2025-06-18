import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import BackToTop from '@/components/BackToTop'
import MessengerButton from '@/components/MessengerButton'
import ContactForm from '@/components/ContactForm'
import GoogleMaps from '@/components/GoogleMaps'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Liên hệ TBS GROUP - Tư vấn miễn phí dịch vụ nhập khẩu Trung Quốc',
  description: 'Liên hệ TBS GROUP để được tư vấn miễn phí về dịch vụ nhập khẩu từ Trung Quốc. Hotline: 0976 005 335, Email: info@xuatnhapkhautbs.vn',
  keywords: 'liên hệ TBS GROUP, tư vấn nhập khẩu, hotline, địa chỉ văn phòng'
}

export default function ContactPage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="section-padding bg-gradient-to-br from-primary-50 to-white">
        <div className="container-max text-center">
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Liên hệ với chúng tôi
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Đội ngũ tư vấn TBS GROUP sẵn sàng hỗ trợ bạn 24/7. Hãy để lại thông tin để được tư vấn miễn phí!
          </p>
        </div>
      </section>

      {/* Contact Info */}
      <section className="section-padding bg-white">
        <div className="container-max">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* Contact Form */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Gửi yêu cầu tư vấn
              </h2>
              <p className="text-gray-600 mb-8">
                Điền thông tin bên dưới, chúng tôi sẽ liên hệ tư vấn trong vòng 30 phút.
              </p>
              <ContactForm />
            </div>

            {/* Contact Details */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Thông tin liên hệ
              </h2>
              
              <div className="space-y-6">
                {/* Hotline */}
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                    <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Hotline 24/7</h3>
                    <p className="text-gray-600 mb-2">Liên hệ ngay để được hỗ trợ</p>
                    <a href="tel:+84976005335" className="text-primary-600 hover:text-primary-700 font-medium text-lg">
                      0976 005 335
                    </a>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Email</h3>
                    <p className="text-gray-600 mb-2">Gửi email cho chúng tôi</p>
                    <a href="mailto:info@xuatnhapkhautbs.vn" className="text-primary-600 hover:text-primary-700 font-medium">
                      info@xuatnhapkhautbs.vn
                    </a>
                  </div>
                </div>

                {/* Zalo */}
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                    <span className="text-2xl">💬</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Zalo</h3>
                    <p className="text-gray-600 mb-2">Chat trực tiếp qua Zalo</p>
                    <a href="https://zalo.me/0976005335" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:text-primary-700 font-medium">
                      Chat ngay
                    </a>
                  </div>
                </div>

                {/* Office Hours */}
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                    <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Giờ làm việc</h3>
                    <p className="text-gray-600">Thứ 2 - Thứ 6: 8:00 - 17:30</p>
                    <p className="text-gray-600">Thứ 7: 8:00 - 12:00</p>
                    <p className="text-gray-600">Chủ nhật: Nghỉ</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Office Locations */}
      <section className="section-padding bg-gray-50">
        <div className="container-max">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
            Văn phòng TBS GROUP
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Hanoi Office */}
            <div className="card">
              <div className="flex items-center mb-4">
                <span className="text-2xl mr-3">🏢</span>
                <h3 className="text-xl font-semibold text-gray-900">Trụ sở chính - Hà Nội</h3>
              </div>
              <div className="space-y-3 text-gray-600">
                <p className="flex items-start">
                  <svg className="w-5 h-5 text-primary-600 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Kim Nỗ, Đông Anh, Hà Nội
                </p>
                <p className="flex items-center">
                  <svg className="w-5 h-5 text-primary-600 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  0976 005 335
                </p>
                <p className="flex items-center">
                  <svg className="w-5 h-5 text-primary-600 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  hanoi@xuatnhapkhautbs.vn
                </p>
              </div>
            </div>

            {/* Ho Chi Minh Office */}
            <div className="card">
              <div className="flex items-center mb-4">
                <span className="text-2xl mr-3">🏢</span>
                <h3 className="text-xl font-semibold text-gray-900">Chi nhánh TP.HCM</h3>
              </div>
              <div className="space-y-3 text-gray-600">
                <p className="flex items-start">
                  <svg className="w-5 h-5 text-primary-600 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Xuân Thới Đông, Hóc Môn, TP.HCM
                </p>
                <p className="flex items-center">
                  <svg className="w-5 h-5 text-primary-600 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  0976 005 335
                </p>
                <p className="flex items-center">
                  <svg className="w-5 h-5 text-primary-600 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  hcm@xuatnhapkhautbs.vn
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="bg-white">
        <GoogleMaps />
      </section>

      {/* FAQ Section */}
      <section className="section-padding bg-gray-50">
        <div className="container-max">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
            Câu hỏi thường gặp
          </h2>
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="card">
              <h3 className="font-semibold text-gray-900 mb-2">
                Tôi cần chuẩn bị gì khi liên hệ TBS GROUP?
              </h3>
              <p className="text-gray-600">
                Bạn chỉ cần chuẩn bị thông tin về sản phẩm muốn nhập khẩu, số lượng dự kiến và thời gian mong muốn. 
                Đội ngũ chúng tôi sẽ tư vấn chi tiết về quy trình và chi phí.
              </p>
            </div>
            <div className="card">
              <h3 className="font-semibold text-gray-900 mb-2">
                TBS GROUP có thu phí tư vấn không?
              </h3>
              <p className="text-gray-600">
                Không, dịch vụ tư vấn của TBS GROUP hoàn toàn miễn phí. Chúng tôi chỉ thu phí khi khách hàng 
                quyết định sử dụng dịch vụ và ký hợp đồng.
              </p>
            </div>
            <div className="card">
              <h3 className="font-semibold text-gray-900 mb-2">
                Thời gian phản hồi của TBS GROUP như thế nào?
              </h3>
              <p className="text-gray-600">
                Chúng tôi cam kết phản hồi trong vòng 30 phút đối với các yêu cầu tư vấn trong giờ hành chính. 
                Đối với các trường hợp khẩn cấp, bạn có thể gọi trực tiếp hotline 24/7.
              </p>
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