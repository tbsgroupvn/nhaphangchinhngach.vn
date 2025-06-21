import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import BackToTop from '@/components/BackToTop'
import MessengerButton from '@/components/MessengerButton'
import Link from 'next/link'
import { services } from '@/data/services'

interface Props {
  params: {
    slug: string
  }
}

export async function generateStaticParams() {
  return services.map((service) => ({
    slug: service.slug,
  }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const service = services.find(s => s.slug === params.slug)
  
  if (!service) {
    return {
      title: 'Dịch vụ không tìm thấy - TBS GROUP'
    }
  }

  return {
    title: `${service.title} - TBS GROUP`,
    description: service.description,
    keywords: `${service.title}, ${service.category}, TBS GROUP, xuất nhập khẩu, logistics`
  }
}

export default function ServiceDetailPage({ params }: Props) {
  const service = services.find(s => s.slug === params.slug)

  if (!service) {
    notFound()
  }

  return (
    <main className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="section-padding bg-gradient-to-br from-primary-50 via-white to-primary-100">
        <div className="container-max">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-block p-6 bg-white rounded-2xl shadow-xl mb-6 hover:shadow-2xl transition-shadow duration-300">
                <span className="text-5xl">{service.icon}</span>
              </div>
              <h1 className="text-responsive-4xl font-bold text-gray-900 mb-6">
                {service.title}
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
                {service.description}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a 
                  href="tel:+84976005335" 
                  className="btn-primary text-lg px-8 py-4 group"
                >
                  <svg className="w-5 h-5 mr-2 group-hover:animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  {service.ctaText}
                </a>
                <Link 
                  href="/lien-he" 
                  className="btn-secondary text-lg px-8 py-4 group"
                >
                  <svg className="w-5 h-5 mr-2 group-hover:animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  Tư vấn miễn phí
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="section-padding bg-white">
        <div className="container-max">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Lợi ích khi sử dụng dịch vụ
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Những giá trị thiết thực mà bạn sẽ nhận được khi sử dụng dịch vụ {service.title}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
              {service.benefits.map((benefit, index) => (
                <div key={index} className="flex items-start group hover:scale-105 transition-transform duration-300">
                  <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-4 group-hover:bg-green-200 transition-colors">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-700 text-lg leading-relaxed">{benefit}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="section-padding bg-gray-50">
        <div className="container-max">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Quy trình thực hiện
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Quy trình chuyên nghiệp và tối ưu để đảm bảo dịch vụ được thực hiện hiệu quả nhất
              </p>
            </div>

            {/* Process Steps for Import Service */}
            {service.slug === 'nhap-khau-chinh-ngach' ? (
              <div className="space-y-12">
                {service.process.map((step, index) => (
                  <div key={index} className="flex flex-col lg:flex-row items-center gap-8">
                    <div className={`lg:w-1/2 ${index % 2 === 0 ? 'lg:order-1' : 'lg:order-2'}`}>
                      <div className="bg-white p-8 rounded-2xl shadow-lg">
                        <div className="flex items-center mb-4">
                          <div className="w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold text-lg mr-4">
                            {index + 1}
                          </div>
                          <h3 className="text-xl font-bold text-gray-900">
                            {step.split(':')[0]}
                          </h3>
                        </div>
                        <p className="text-gray-600 leading-relaxed">
                          {step.split(':')[1]}
                        </p>
                      </div>
                    </div>
                    <div className={`lg:w-1/2 ${index % 2 === 0 ? 'lg:order-2' : 'lg:order-1'}`}>
                      <div className="relative">
                        <img 
                          src={[
                            'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=400&fit=crop',
                            'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=400&fit=crop',
                            'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&h=400&fit=crop',
                            'https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55?w=600&h=400&fit=crop'
                          ][index]} 
                          alt={`Quy trình bước ${index + 1}`}
                          className="w-full h-64 object-cover rounded-2xl shadow-lg"
                        />
                        <div className="absolute top-4 right-4 bg-primary-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                          Bước {index + 1}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {service.process.map((step, index) => (
                  <div key={index} className="relative group">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold text-xl mx-auto mb-4 group-hover:bg-primary-700 transition-colors shadow-lg">
                        {index + 1}
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-2">Bước {index + 1}</h3>
                      <p className="text-gray-600 text-sm leading-relaxed">{step}</p>
                    </div>
                    {index < service.process.length - 1 && (
                      <div className="hidden lg:block absolute top-8 left-full w-full">
                        <svg className="w-full h-6 text-primary-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Why Choose Official Import Section - Only for import service */}
      {service.slug === 'nhap-khau-chinh-ngach' && (
        <section className="section-padding bg-white">
          <div className="container-max">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                  Tại sao chọn nhập khẩu chính ngạch cùng TBS GROUP?
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  So sánh rõ ràng giữa nhập khẩu chính ngạch và phi chính ngạch
                </p>
              </div>
              
              {/* Comparison Table */}
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-8 mb-12">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b-2 border-gray-200">
                        <th className="text-left py-4">Tiêu chí</th>
                        <th className="text-center py-4 text-green-600 font-bold">Nhập khẩu chính ngạch</th>
                        <th className="text-center py-4 text-red-600 font-bold">Nhập khẩu phi chính ngạch</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        {
                          criteria: 'Bảo vệ pháp lý',
                          official: '✅ Được pháp luật bảo vệ toàn diện',
                          unofficial: '❌ Không được bảo vệ, rủi ro cao'
                        },
                        {
                          criteria: 'Hóa đơn VAT',
                          official: '✅ Xuất hóa đơn VAT đầy đủ',
                          unofficial: '❌ Không có hóa đơn VAT hợp lệ'
                        },
                        {
                          criteria: 'Chi phí ổn định',
                          official: '✅ Chi phí minh bạch, không phát sinh',
                          unofficial: '❌ Chi phí biến động, nhiều phát sinh'
                        },
                        {
                          criteria: 'Tư vấn chuyên nghiệp',
                          official: '✅ Đội ngũ chuyên gia tư vấn 24/7',
                          unofficial: '❌ Thiếu hỗ trợ chuyên nghiệp'
                        }
                      ].map((row, index) => (
                        <tr key={index} className="border-b border-gray-100">
                          <td className="py-4 font-medium text-gray-900">{row.criteria}</td>
                          <td className="py-4 text-center text-green-700">{row.official}</td>
                          <td className="py-4 text-center text-red-700">{row.unofficial}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Customer Testimonials - Only for import service */}
      {service.slug === 'nhap-khau-chinh-ngach' && (
        <section className="section-padding bg-gray-50">
          <div className="container-max">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                  Khách hàng nói gì về TBS GROUP
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  Những phản hồi thực tế từ các doanh nghiệp đã sử dụng dịch vụ
                </p>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-8 rounded-2xl shadow-lg">
                  <div className="flex items-start mb-6">
                    <img 
                      src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop&crop=face" 
                      alt="Anh Minh - CEO"
                      className="w-12 h-12 rounded-full object-cover mr-4"
                    />
                    <div>
                      <h4 className="font-semibold text-gray-900">Anh Minh Nguyễn</h4>
                      <p className="text-gray-600 text-sm">CEO - Công ty TNHH Thương Mại ABC</p>
                    </div>
                  </div>
                  <p className="text-gray-700 italic mb-4">
                    "Trước khi hợp tác với TBS GROUP, chúng tôi đã gặp nhiều khó khăn với việc nhập khẩu nguyên liệu từ Trung Quốc. 
                    Nhờ có TBS GROUP tư vấn và hỗ trợ thủ tục, chúng tôi đã tiết kiệm được 30% chi phí và thời gian thông quan 
                    nhanh hơn 50%. Đặc biệt, việc được xuất hóa đơn VAT đầy đủ giúp công ty chúng tôi khấu trừ thuế một cách hợp pháp."
                  </p>
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                      </svg>
                    ))}
                  </div>
                </div>

                <div className="bg-white p-8 rounded-2xl shadow-lg">
                  <div className="flex items-start mb-6">
                    <img 
                      src="https://images.unsplash.com/photo-1494790108755-2616b612b169?w=60&h=60&fit=crop&crop=face" 
                      alt="Chị Lan - Giám đốc"
                      className="w-12 h-12 rounded-full object-cover mr-4"
                    />
                    <div>
                      <h4 className="font-semibold text-gray-900">Chị Lan Phạm</h4>
                      <p className="text-gray-600 text-sm">Giám đốc - Công ty Cổ phần XYZ</p>
                    </div>
                  </div>
                  <p className="text-gray-700 italic mb-4">
                    "Là một doanh nghiệp mới trong lĩnh vực nhập khẩu, chúng tôi rất lo lắng về các thủ tục pháp lý. 
                    TBS GROUP đã tư vấn rất chi tiết và đồng hành cùng chúng tôi trong suốt quá trình. 
                    Điều ấn tượng nhất là cam kết 'khai báo đúng 100%' và thực sự họ đã làm được điều đó. 
                    Chúng tôi hoàn toàn yên tâm về mặt pháp lý khi hợp tác với TBS GROUP."
                  </p>
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                      </svg>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Features Section */}
      <section className="section-padding bg-white">
        <div className="container-max">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                {service.slug === 'nhap-khau-chinh-ngach' ? 'Dịch vụ chuyên biệt' : 'Tính năng nổi bật'}
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                {service.slug === 'nhap-khau-chinh-ngach' 
                  ? 'Những dịch vụ chuyên biệt chỉ có tại TBS GROUP' 
                  : `Những tính năng độc đáo và ưu việt của dịch vụ ${service.title}`
                }
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
              {service.features.map((feature, index) => (
                <div key={index} className="card hover:shadow-xl transition-shadow duration-300 group">
                  <div className="flex items-start">
                    <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mr-4 group-hover:bg-primary-200 transition-colors flex-shrink-0">
                      <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-700 font-medium leading-relaxed">{feature}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Commitment Section */}
      <section className="section-padding bg-gradient-to-r from-primary-600 to-primary-700">
        <div className="container-max">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                Cam kết với khách hàng
              </h2>
              <p className="text-xl text-primary-100 max-w-2xl mx-auto">
                TBS GROUP cam kết mang đến trải nghiệm dịch vụ tốt nhất cho khách hàng
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {service.commitment.map((commitment, index) => (
                <div key={index} className="flex items-start group">
                  <div className="flex-shrink-0 w-10 h-10 bg-white/20 rounded-full flex items-center justify-center mr-4 group-hover:bg-white/30 transition-colors">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-white text-lg leading-relaxed">{commitment}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-gray-50">
        <div className="container-max">
          <div className="max-w-5xl mx-auto text-center">
            <div className="bg-white p-8 lg:p-12 rounded-2xl shadow-xl">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Sẵn sàng sử dụng dịch vụ này?
              </h2>
              <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
                Liên hệ ngay để được tư vấn chi tiết và nhận báo giá ưu đãi cho dịch vụ <strong>{service.title}</strong>
              </p>
              
              {/* Contact Options */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Hotline 24/7</h3>
                  <p className="text-gray-600">0976 005 335</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Email</h3>
                  <p className="text-gray-600">info@xuatnhapkhautbs.vn</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Zalo</h3>
                  <p className="text-gray-600">Chat trực tiếp</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a 
                  href="tel:+84976005335" 
                  className="btn-primary text-lg px-8 py-4 group"
                >
                  <svg className="w-5 h-5 mr-2 group-hover:animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  Gọi ngay: 0976 005 335
                </a>
                <Link 
                  href="/lien-he" 
                  className="btn-secondary text-lg px-8 py-4 group"
                >
                  <svg className="w-5 h-5 mr-2 group-hover:animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  Tư vấn miễn phí
                </Link>
                <a 
                  href="https://zalo.me/0976005335" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn-outline text-lg px-8 py-4 group"
                >
                  <span className="mr-2 group-hover:animate-bounce">💬</span>
                  Chat Zalo
                </a>
              </div>
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