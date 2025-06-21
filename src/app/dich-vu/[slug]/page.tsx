import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import Image from 'next/image'
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

      {/* Cost Savings Comparison - Only for consolidation service */}
      {service.slug === 'gom-hang-le-ghep-container' && (
        <section className="section-padding bg-gradient-to-br from-green-50 via-white to-green-100">
          <div className="container-max">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                  Gom hàng lẻ – thực tế giúp bạn tiết kiệm bao nhiêu?
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  Con số cụ thể về chi phí tiết kiệm khi sử dụng dịch vụ gom hàng lẻ
                </p>
              </div>
              
              {/* Savings Comparison */}
              <div className="bg-gradient-to-br from-white via-blue-50 to-green-50 p-8 rounded-3xl shadow-2xl mb-8 border border-gray-100">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="text-center group">
                    <div className="relative w-24 h-24 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-105">
                      <span className="text-3xl">📦</span>
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">×</span>
                      </div>
                    </div>
                    <h3 className="font-bold text-gray-900 mb-3 text-lg">Thuê nguyên container</h3>
                    <div className="bg-red-50 p-4 rounded-xl mb-4">
                      <p className="text-4xl font-black text-red-600 mb-1">$2,500</p>
                      <p className="text-red-500 text-sm font-medium">Chi phí cao</p>
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed">Phải thuê cả container dù chỉ có 5m³ hàng</p>
                  </div>
                  
                  <div className="flex items-center justify-center">
                    <div className="text-center">
                      <div className="relative w-20 h-20 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg animate-pulse">
                        <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </div>
                      <div className="bg-gradient-to-r from-emerald-500 to-green-600 text-white px-6 py-2 rounded-full font-bold text-sm mb-2 shadow-lg">
                        TIẾT KIỆM
                      </div>
                      <p className="text-5xl font-black bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">40%</p>
                    </div>
                  </div>
                  
                  <div className="text-center group">
                    <div className="relative w-24 h-24 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-105">
                      <span className="text-3xl">🚛</span>
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">✓</span>
                      </div>
                    </div>
                    <h3 className="font-bold text-gray-900 mb-3 text-lg">Gom hàng lẻ TBS</h3>
                    <div className="bg-green-50 p-4 rounded-xl mb-4">
                      <p className="text-4xl font-black text-green-600 mb-1">$1,500</p>
                      <p className="text-green-500 text-sm font-medium">Tiết kiệm 40%</p>
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed">Chỉ trả cho không gian thực tế sử dụng</p>
                  </div>
                </div>
                
                <div className="mt-8 p-6 bg-gradient-to-r from-amber-50 via-orange-50 to-yellow-50 rounded-2xl border border-amber-200">
                  <h4 className="font-bold text-gray-900 mb-4 text-lg flex items-center">
                    <span className="w-8 h-8 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center mr-3">
                      💡
                    </span>
                    Lợi ích đặc biệt
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-start group hover:bg-white/50 p-3 rounded-lg transition-all duration-200">
                      <div className="w-6 h-6 bg-gradient-to-br from-emerald-400 to-green-500 rounded-full flex items-center justify-center mr-3 mt-0.5">
                        <span className="text-white text-xs font-bold">✓</span>
                      </div>
                      <span className="text-gray-700 font-medium">Không cần tồn kho lớn tại VN</span>
                    </div>
                    <div className="flex items-start group hover:bg-white/50 p-3 rounded-lg transition-all duration-200">
                      <div className="w-6 h-6 bg-gradient-to-br from-emerald-400 to-green-500 rounded-full flex items-center justify-center mr-3 mt-0.5">
                        <span className="text-white text-xs font-bold">✓</span>
                      </div>
                      <span className="text-gray-700 font-medium">Giảm rủi ro hàng ứ đọng</span>
                    </div>
                    <div className="flex items-start group hover:bg-white/50 p-3 rounded-lg transition-all duration-200">
                      <div className="w-6 h-6 bg-gradient-to-br from-emerald-400 to-green-500 rounded-full flex items-center justify-center mr-3 mt-0.5">
                        <span className="text-white text-xs font-bold">✓</span>
                      </div>
                      <span className="text-gray-700 font-medium">Tối ưu cho đơn hàng nhỏ</span>
                    </div>
                    <div className="flex items-start group hover:bg-white/50 p-3 rounded-lg transition-all duration-200">
                      <div className="w-6 h-6 bg-gradient-to-br from-emerald-400 to-green-500 rounded-full flex items-center justify-center mr-3 mt-0.5">
                        <span className="text-white text-xs font-bold">✓</span>
                      </div>
                      <span className="text-gray-700 font-medium">Không bị ép mua dư</span>
                    </div>
                  </div>
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
                    <Image 
                      src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop&crop=face" 
                      alt="Anh Minh - CEO"
                      width={48}
                      height={48}
                      className="w-12 h-12 rounded-full object-cover mr-4"
                    />
                    <div>
                      <h4 className="font-semibold text-gray-900">Anh Minh Nguyễn</h4>
                      <p className="text-gray-600 text-sm">CEO - Công ty TNHH Thương Mại ABC</p>
                    </div>
                  </div>
                  <p className="text-gray-700 italic mb-4">
                    &ldquo;Trước khi hợp tác với TBS GROUP, chúng tôi đã gặp nhiều khó khăn với việc nhập khẩu nguyên liệu từ Trung Quốc. 
                    Nhờ có TBS GROUP tư vấn và hỗ trợ thủ tục, chúng tôi đã tiết kiệm được 30% chi phí và thời gian thông quan 
                    nhanh hơn 50%. Đặc biệt, việc được xuất hóa đơn VAT đầy đủ giúp công ty chúng tôi khấu trừ thuế một cách hợp pháp.&rdquo;
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
                    <Image 
                      src="https://images.unsplash.com/photo-1494790108755-2616b612b169?w=60&h=60&fit=crop&crop=face" 
                      alt="Chị Lan - Giám đốc"
                      width={48}
                      height={48}
                      className="w-12 h-12 rounded-full object-cover mr-4"
                    />
                    <div>
                      <h4 className="font-semibold text-gray-900">Chị Lan Phạm</h4>
                      <p className="text-gray-600 text-sm">Giám đốc - Công ty Cổ phần XYZ</p>
                    </div>
                  </div>
                  <p className="text-gray-700 italic mb-4">
                    &ldquo;Là một doanh nghiệp mới trong lĩnh vực nhập khẩu, chúng tôi rất lo lắng về các thủ tục pháp lý. 
                    TBS GROUP đã tư vấn rất chi tiết và đồng hành cùng chúng tôi trong suốt quá trình. 
                    Điều ấn tượng nhất là cam kết &lsquo;khai báo đúng 100%&rsquo; và thực sự họ đã làm được điều đó. 
                    Chúng tôi hoàn toàn yên tâm về mặt pháp lý khi hợp tác với TBS GROUP.&rdquo;
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

      {/* Customer Testimonials - Only for consolidation service */}
      {service.slug === 'gom-hang-le-ghep-container' && (
        <section className="section-padding bg-gray-50">
          <div className="container-max">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                  Feedback thực tế từ khách hàng
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  Những trải nghiệm chân thật từ doanh nghiệp đã sử dụng dịch vụ gom hàng lẻ
                </p>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <div className="bg-white p-6 rounded-2xl shadow-lg">
                  <div className="flex items-start mb-4">
                    <Image 
                      src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face" 
                      alt="Anh Tuấn - Chủ shop"
                      width={48}
                      height={48}
                      className="w-12 h-12 rounded-full object-cover mr-4"
                    />
                    <div>
                      <h4 className="font-semibold text-gray-900">Anh Tuấn Lê</h4>
                      <p className="text-gray-600 text-sm">Chủ shop thời trang online</p>
                    </div>
                  </div>
                  <p className="text-gray-700 italic mb-4">
                    &ldquo;Lô hàng lẻ đầu tiên của tôi về đúng hạn, tiết kiệm được 30% phí so với trước, 
                    cảm ơn TBS! Đặc biệt là được xem video đóng kiện, tôi yên tâm 100%.&rdquo;
                  </p>
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                      </svg>
                    ))}
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-lg">
                  <div className="flex items-start mb-4">
                    <Image 
                      src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face" 
                      alt="Chị Hằng - Quản lý"
                      width={48}
                      height={48}
                      className="w-12 h-12 rounded-full object-cover mr-4"
                    />
                    <div>
                      <h4 className="font-semibold text-gray-900">Chị Hằng Nguyễn</h4>
                      <p className="text-gray-600 text-sm">Quản lý cửa hàng mẹ và bé</p>
                    </div>
                  </div>
                  <p className="text-gray-700 italic mb-4">
                    &ldquo;Shop nhỏ như tôi không đủ tiền thuê nguyên container. 
                    Nhờ TBS gom hàng lẻ, giờ nhập được đều đặn mà chi phí hợp lý. Ảnh thực tế rất chi tiết!&rdquo;
                  </p>
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                      </svg>
                    ))}
                  </div>
                </div>
              </div>

              {/* Real warehouse images */}
              <div className="bg-white p-8 rounded-2xl shadow-lg">
                <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">
                  🏭 Hình ảnh thực tế kho TBS tại Trung Quốc
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="relative">
                    <Image 
                      src="https://images.unsplash.com/photo-1553413077-190dd305871c?w=400&h=250&fit=crop" 
                      alt="Nhân viên đóng kiện"
                      width={400}
                      height={250}
                      className="w-full h-48 object-cover rounded-xl"
                    />
                    <div className="absolute bottom-3 left-3 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                      Nhân viên đóng kiện
                    </div>
                  </div>
                  <div className="relative">
                    <Image 
                      src="https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55?w=400&h=250&fit=crop" 
                      alt="Container thực tế"
                      width={400}
                      height={250}
                      className="w-full h-48 object-cover rounded-xl"
                    />
                    <div className="absolute bottom-3 left-3 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                      Container thực tế
                    </div>
                  </div>
                  <div className="relative">
                    <Image 
                      src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400&h=250&fit=crop" 
                      alt="Kho tại Trung Quốc"
                      width={400}
                      height={250}
                      className="w-full h-48 object-cover rounded-xl"
                    />
                    <div className="absolute bottom-3 left-3 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                      Kho tại TQ
                    </div>
                  </div>
                </div>
                <p className="text-center text-gray-600 mt-4 italic">
                  &ldquo;Khách hàng luôn nhận được video/ảnh minh chứng quá trình đóng kiện hàng hóa&rdquo;
                </p>
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
              {service.slug === 'gom-hang-le-ghep-container' ? (
                <>
                  <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                    Đăng ký tư vấn gom hàng lẻ nhanh
                  </h2>
                  <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
                    Chỉ cần để lại số điện thoại, chuyên viên sẽ gọi lại trong <strong>15 phút</strong>
                  </p>
                  
                  {/* Quick Quote Form */}
                  <div className="bg-gradient-to-r from-green-50 to-blue-50 p-8 rounded-2xl mb-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">📋 Báo giá nhanh gom hàng lẻ</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Loại hàng hóa <span className="text-red-500">*</span>
                        </label>
                        <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
                          <option value="">Chọn loại hàng</option>
                          <option value="thoi-trang">Thời trang</option>
                          <option value="dien-tu">Điện tử</option>
                          <option value="me-be">Mẹ và bé</option>
                          <option value="gia-dung">Gia dụng</option>
                          <option value="khac">Khác</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Số lượng kiện <span className="text-red-500">*</span>
                        </label>
                        <input 
                          type="number" 
                          placeholder="VD: 10 kiện"
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Địa chỉ nhận hàng <span className="text-red-500">*</span>
                        </label>
                        <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
                          <option value="">Chọn tỉnh/thành</option>
                          <option value="hcm">TP. Hồ Chí Minh</option>
                          <option value="hanoi">Hà Nội</option>
                          <option value="danang">Đà Nẵng</option>
                          <option value="khac">Tỉnh khác</option>
                        </select>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Họ tên <span className="text-red-500">*</span>
                        </label>
                        <input 
                          type="text" 
                          placeholder="Nhập họ tên của bạn"
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Số điện thoại <span className="text-red-500">*</span>
                        </label>
                        <input 
                          type="tel" 
                          placeholder="VD: 0976005335"
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        />
                      </div>
                    </div>
                    <button className="btn-primary text-lg px-12 py-4 font-bold">
                      🚀 Gửi báo giá nhanh (Miễn phí)
                    </button>
                    <p className="text-sm text-gray-600 mt-4">
                      ⚡ Chuyên viên TBS sẽ gọi lại trong 15 phút để tư vấn chi tiết
                    </p>
                  </div>

                  {/* Tooltips for terms */}
                  <div className="bg-blue-50 p-6 rounded-xl mb-8">
                    <h4 className="font-bold text-gray-900 mb-4">💡 Giải thích thuật ngữ:</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                      <div className="bg-white p-4 rounded-lg">
                        <h5 className="font-semibold text-gray-900 mb-2">📦 FCL là gì?</h5>
                        <p className="text-gray-600 text-sm">Full Container Load - Thuê nguyên container, phù hợp với đơn hàng lớn</p>
                      </div>
                      <div className="bg-white p-4 rounded-lg">
                        <h5 className="font-semibold text-gray-900 mb-2">🚛 LCL là gì?</h5>
                        <p className="text-gray-600 text-sm">Less than Container Load - Gom hàng lẻ nhiều chủ, tiết kiệm cho đơn nhỏ</p>
                      </div>
                      <div className="bg-white p-4 rounded-lg">
                        <h5 className="font-semibold text-gray-900 mb-2">🛡️ Bảo hiểm hàng hóa</h5>
                        <p className="text-gray-600 text-sm">Bảo vệ 100% giá trị hàng nếu mất mát, hư hỏng trong vận chuyển</p>
                      </div>
                      <div className="bg-white p-4 rounded-lg">
                        <h5 className="font-semibold text-gray-900 mb-2">📋 Gom hàng lẻ</h5>
                        <p className="text-gray-600 text-sm">Thu gom hàng từ nhiều nhà cung cấp, ghép chung 1 container</p>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                    Sẵn sàng sử dụng dịch vụ này?
                  </h2>
                  <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
                    Liên hệ ngay để được tư vấn chi tiết và nhận báo giá ưu đãi cho dịch vụ <strong>{service.title}</strong>
                  </p>
                </>
              )}
              
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