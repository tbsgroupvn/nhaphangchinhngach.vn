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
                        <Image 
                          src={[
                            'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=400&fit=crop',
                            'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=400&fit=crop',
                            'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&h=400&fit=crop',
                            'https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55?w=600&h=400&fit=crop'
                          ][index]} 
                          alt={`Quy trình bước ${index + 1}`}
                          width={600}
                          height={400}
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

      {/* International Transport Features - Only for van-chuyen-quoc-te */}
      {service.slug === 'van-chuyen-quoc-te' && (
        <section className="section-padding bg-gray-50">
          <div className="container-max">
            <div className="max-w-6xl mx-auto space-y-12">
              {/* International Partners */}
              <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-8 rounded-3xl shadow-2xl border border-blue-100">
                <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
                  🤝 Đối tác vận chuyển quốc tế uy tín
                </h2>
                <p className="text-lg text-gray-600 text-center mb-8">
                  TBS GROUP hợp tác với các hãng tàu, hãng bay hàng đầu thế giới
                </p>
                
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                  {/* Shipping Lines */}
                  <div className="bg-white p-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-center group">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-blue-200 transition-colors">
                      <span className="text-2xl font-bold text-blue-600">🚢</span>
                    </div>
                    <h4 className="font-bold text-sm text-gray-900">COSCO</h4>
                    <p className="text-xs text-gray-600">Shipping Line</p>
                  </div>
                  
                  <div className="bg-white p-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-center group">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-blue-200 transition-colors">
                      <span className="text-2xl font-bold text-blue-600">⚓</span>
                    </div>
                    <h4 className="font-bold text-sm text-gray-900">Maersk</h4>
                    <p className="text-xs text-gray-600">Global Carrier</p>
                  </div>
                  
                  <div className="bg-white p-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-center group">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-blue-200 transition-colors">
                      <span className="text-2xl font-bold text-blue-600">🌊</span>
                    </div>
                    <h4 className="font-bold text-sm text-gray-900">OOCL</h4>
                    <p className="text-xs text-gray-600">Ocean Network</p>
                  </div>
                  
                  {/* Airlines */}
                  <div className="bg-white p-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-center group">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-red-200 transition-colors">
                      <span className="text-2xl font-bold text-red-600">✈️</span>
                    </div>
                    <h4 className="font-bold text-sm text-gray-900">Air China</h4>
                    <p className="text-xs text-gray-600">Cargo Airlines</p>
                  </div>
                  
                  <div className="bg-white p-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-center group">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-green-200 transition-colors">
                      <span className="text-2xl font-bold text-green-600">🛩️</span>
                    </div>
                    <h4 className="font-bold text-sm text-gray-900">VietJet</h4>
                    <p className="text-xs text-gray-600">Air Cargo</p>
                  </div>
                  
                  <div className="bg-white p-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-center group">
                    <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-purple-200 transition-colors">
                      <span className="text-2xl font-bold text-purple-600">🚛</span>
                    </div>
                    <h4 className="font-bold text-sm text-gray-900">DHL</h4>
                    <p className="text-xs text-gray-600">Express</p>
                  </div>
                </div>
                
                <div className="mt-8 text-center">
                  <p className="text-gray-600 italic">
                    &ldquo;Mạng lưới đối tác rộng khắp đảm bảo tuyến vận tối ưu cho mọi loại hàng hóa&rdquo;
                  </p>
                </div>
              </div>

              {/* USP Block */}
              <div className="bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 p-8 rounded-3xl shadow-2xl text-white">
                <h2 className="text-3xl font-bold mb-8 text-center">
                  🌟 Vì sao chọn TBS GROUP cho vận chuyển quốc tế?
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-300">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mb-4 mx-auto">
                      <span className="text-2xl">💰</span>
                    </div>
                    <h3 className="font-bold text-lg mb-3 text-center">Giá ổn định</h3>
                    <p className="text-sm text-gray-300 text-center">
                      Hợp đồng dài hạn với carriers lớn, không lo sốc giá mùa cao điểm
                    </p>
                  </div>
                  
                  <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-300">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full flex items-center justify-center mb-4 mx-auto">
                      <span className="text-2xl">🌐</span>
                    </div>
                    <h3 className="font-bold text-lg mb-3 text-center">Đa ngôn ngữ</h3>
                    <p className="text-sm text-gray-300 text-center">
                      Đội ngũ Việt-Anh-Trung, giao tiếp trực tiếp với đối tác quốc tế
                    </p>
                  </div>
                  
                  <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-300">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center mb-4 mx-auto">
                      <span className="text-2xl">🏢</span>
                    </div>
                    <h3 className="font-bold text-lg mb-3 text-center">Văn phòng đại diện</h3>
                    <p className="text-sm text-gray-300 text-center">
                      Có mặt tại TQ & VN, hỗ trợ trực tiếp 24/7 hai đầu tuyến
                    </p>
                  </div>
                  
                  <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-300">
                    <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center mb-4 mx-auto">
                      <span className="text-2xl">🛡️</span>
                    </div>
                    <h3 className="font-bold text-lg mb-3 text-center">Bảo hiểm toàn diện</h3>
                    <p className="text-sm text-gray-300 text-center">
                      Đối tác bảo hiểm quốc tế, bồi thường nhanh trong 48h
                    </p>
                  </div>
                </div>
              </div>

              {/* Multimodal Explanation */}
              <div className="bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 p-8 rounded-3xl shadow-2xl border border-green-100">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">
                    🔄 Vận chuyển đa phương thức (Multimodal)
                  </h2>
                  <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                    Kết hợp biển – bộ – hàng không để tối ưu thời gian, chi phí, đáp ứng mọi nhu cầu đặc thù
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="text-center group">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-105">
                      <span className="text-3xl text-white">🌊</span>
                    </div>
                    <h3 className="font-bold text-lg text-gray-900 mb-2">Đường biển</h3>
                    <p className="text-sm text-gray-600">Chi phí thấp<br/>Hàng khối lượng lớn</p>
                    <div className="mt-3 bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full inline-block">
                      Sea Freight
                    </div>
                  </div>
                  
                  <div className="text-center group">
                    <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-105">
                      <span className="text-3xl text-white">✈️</span>
                    </div>
                    <h3 className="font-bold text-lg text-gray-900 mb-2">Hàng không</h3>
                    <p className="text-sm text-gray-600">Nhanh chóng<br/>Hàng urgent/cao cấp</p>
                    <div className="mt-3 bg-red-100 text-red-800 text-xs px-3 py-1 rounded-full inline-block">
                      Air Freight
                    </div>
                  </div>
                  
                  <div className="text-center group">
                    <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-105">
                      <span className="text-3xl text-white">🚚</span>
                    </div>
                    <h3 className="font-bold text-lg text-gray-900 mb-2">Đường bộ</h3>
                    <p className="text-sm text-gray-600">Linh hoạt<br/>Cross-border</p>
                    <div className="mt-3 bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full inline-block">
                      Road Freight
                    </div>
                  </div>
                  
                  <div className="text-center group">
                    <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-105">
                      <span className="text-3xl text-white">🔄</span>
                    </div>
                    <h3 className="font-bold text-lg text-gray-900 mb-2">Kết hợp</h3>
                    <p className="text-sm text-gray-600">Tối ưu toàn diện<br/>Chi phí & thời gian</p>
                    <div className="mt-3 bg-purple-100 text-purple-800 text-xs px-3 py-1 rounded-full inline-block">
                      Multimodal
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Quote Form */}
              <div className="bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-8 rounded-3xl shadow-2xl text-white">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold mb-4">📋 Báo giá nhanh vận chuyển quốc tế</h2>
                  <p className="text-lg text-gray-300">
                    &ldquo;Gửi yêu cầu nhận báo giá chỉ trong 1 tiếng – miễn phí!&rdquo;
                  </p>
                </div>
                
                <div className="max-w-4xl mx-auto">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-2">
                        🚚 Phương thức vận chuyển
                      </label>
                      <select className="w-full p-3 rounded-xl border border-white/20 bg-white/10 backdrop-blur-sm text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200">
                        <option value="" className="text-gray-900">Chọn phương thức</option>
                        <option value="sea" className="text-gray-900">🌊 Đường biển (Sea)</option>
                        <option value="air" className="text-gray-900">✈️ Hàng không (Air)</option>
                        <option value="road" className="text-gray-900">🚚 Đường bộ (Road)</option>
                        <option value="multimodal" className="text-gray-900">🔄 Đa phương thức</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-2">
                        📦 Loại hàng hóa
                      </label>
                      <input 
                        type="text" 
                        placeholder="VD: Container, pallet, kg..."
                        className="w-full p-3 rounded-xl border border-white/20 bg-white/10 backdrop-blur-sm text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-2">
                        🌍 Tuyến vận chuyển
                      </label>
                      <input 
                        type="text" 
                        placeholder="VD: TQ → VN, US → VN..."
                        className="w-full p-3 rounded-xl border border-white/20 bg-white/10 backdrop-blur-sm text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-2">
                        📱 Số điện thoại
                      </label>
                      <input 
                        type="tel" 
                        placeholder="Nhập SĐT nhận báo giá"
                        className="w-full p-3 rounded-xl border border-white/20 bg-white/10 backdrop-blur-sm text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                      />
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <button className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 text-white px-10 py-4 rounded-2xl font-bold text-lg hover:from-orange-600 hover:via-red-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-orange-500/25 mb-4">
                      <span className="flex items-center justify-center">
                        ⚡ Nhận báo giá trong 1 tiếng (Miễn phí)
                        <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </span>
                    </button>
                    <p className="text-sm text-gray-400">
                      ✅ Chuyên gia vận chuyển quốc tế sẽ liên hệ ngay
                    </p>
                  </div>
                </div>
              </div>

              {/* Tooltips & Links */}
              <div className="bg-gradient-to-r from-amber-50 via-orange-50 to-yellow-50 p-8 rounded-3xl shadow-2xl border border-amber-200">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                  💡 Thuật ngữ & Tài liệu hữu ích
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                    <h4 className="font-bold text-lg text-gray-900 mb-3">📚 Thuật ngữ quốc tế</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-700">Bill of Lading:</span>
                        <span className="text-gray-600">Vận đơn</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-700">Multimodal:</span>
                        <span className="text-gray-600">Đa phương thức</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-700">Cross-border:</span>
                        <span className="text-gray-600">Xuyên biên giới</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-700">Freight:</span>
                        <span className="text-gray-600">Cước vận chuyển</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                    <h4 className="font-bold text-lg text-gray-900 mb-3">🔗 Dịch vụ liên quan</h4>
                    <div className="space-y-3 text-sm">
                      <a href="/dich-vu/gom-hang-le-ghep-container" className="block text-blue-600 hover:text-blue-800 font-medium hover:underline">
                        → Dịch vụ gom hàng lẻ
                      </a>
                      <a href="/dich-vu/thong-quan-chung-tu" className="block text-blue-600 hover:text-blue-800 font-medium hover:underline">
                        → Thông quan & chứng từ
                      </a>
                      <a href="/dich-vu/dong-goi-bao-hiem-hang" className="block text-blue-600 hover:text-blue-800 font-medium hover:underline">
                        → Đóng gói & bảo hiểm
                      </a>
                      <a href="/dich-vu/kho-bai-trung-viet" className="block text-blue-600 hover:text-blue-800 font-medium hover:underline">
                        → Kho bãi Trung - Việt
                      </a>
                    </div>
                  </div>
                  
                  <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                    <h4 className="font-bold text-lg text-gray-900 mb-3">📄 Tài liệu tham khảo</h4>
                    <div className="space-y-3 text-sm">
                      <a href="#" className="block text-green-600 hover:text-green-800 font-medium hover:underline">
                        📥 Quy trình book hàng quốc tế
                      </a>
                      <a href="#" className="block text-green-600 hover:text-green-800 font-medium hover:underline">
                        📥 Cách chọn tuyến vận tối ưu
                      </a>
                      <a href="#" className="block text-green-600 hover:text-green-800 font-medium hover:underline">
                        📥 Bảng giá vận chuyển 2024
                      </a>
                      <a href="#" className="block text-green-600 hover:text-green-800 font-medium hover:underline">
                        📥 Hướng dẫn multimodal
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Delegation Service Features - Only for uy-thac-xuat-nhap-khau */}
      {service.slug === 'uy-thac-xuat-nhap-khau' && (
        <section className="section-padding bg-gray-50">
          <div className="container-max">
            <div className="max-w-6xl mx-auto space-y-12">
              {/* Legal Barrier Liberation USP */}
              <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-8 rounded-3xl shadow-2xl border border-blue-100">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">
                    🚀 Giải phóng rào cản pháp lý - Mở cửa thị trường XNK
                  </h2>
                  <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
                    &ldquo;Toàn bộ quy trình do TBS GROUP đại diện pháp lý, khách hàng chỉ cần ký nhận hàng&rdquo;
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="text-center group">
                    <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-105">
                      <span className="text-3xl text-white">🚫</span>
                    </div>
                    <h3 className="font-bold text-lg text-gray-900 mb-2">Không cần giấy phép</h3>
                    <p className="text-sm text-gray-600">
                      Tránh thủ tục phức tạp<br/>
                      Tiết kiệm thời gian & chi phí
                    </p>
                  </div>
                  
                  <div className="text-center group">
                    <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-105">
                      <span className="text-3xl text-white">⚖️</span>
                    </div>
                    <h3 className="font-bold text-lg text-gray-900 mb-2">TBS đại diện pháp lý</h3>
                    <p className="text-sm text-gray-600">
                      Chịu trách nhiệm 100%<br/>
                      Doanh nghiệp hoàn toàn yên tâm
                    </p>
                  </div>
                  
                  <div className="text-center group">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-105">
                      <span className="text-3xl text-white">🔒</span>
                    </div>
                    <h3 className="font-bold text-lg text-gray-900 mb-2">Bảo mật tuyệt đối</h3>
                    <p className="text-sm text-gray-600">
                      Thông tin được bảo vệ<br/>
                      Ký cam kết bảo mật
                    </p>
                  </div>
                </div>
              </div>

              {/* Case Study - Real Success Story */}
              <div className="bg-gradient-to-r from-green-50 via-emerald-50 to-teal-50 p-8 rounded-3xl shadow-2xl border border-green-100">
                <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                  📊 Câu chuyện thành công thực tế
                </h2>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="bg-white p-6 rounded-2xl shadow-lg">
                    <div className="flex items-start mb-4">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                        <span className="text-2xl">🏭</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Công ty A - Ngành dệt may</h4>
                        <p className="text-gray-600 text-sm">Doanh nghiệp nhỏ, chưa có giấy phép XNK</p>
                      </div>
                    </div>
                    <div className="bg-green-50 p-4 rounded-xl mb-4">
                      <h5 className="font-bold text-green-800 mb-2">Kết quả đạt được:</h5>
                      <ul className="text-sm text-green-700 space-y-1">
                        <li>✅ Nhập lô hàng đầu tiên chỉ trong 10 ngày</li>
                        <li>✅ Không gặp trở ngại pháp lý nào</li>
                        <li>✅ Tiết kiệm hơn 30% so với giải pháp tự làm</li>
                        <li>✅ Mở rộng được 3 dòng sản phẩm mới</li>
                      </ul>
                    </div>
                    <p className="text-gray-700 italic text-sm">
                      &ldquo;Nhờ ủy thác với TBS GROUP, chúng tôi đã thử nghiệm thành công thị trường nhập khẩu 
                      mà không cần đầu tư lớn ban đầu. Giờ đã sẵn sàng mở rộng quy mô!&rdquo;
                    </p>
                  </div>
                  
                  <div className="bg-white p-6 rounded-2xl shadow-lg">
                    <div className="flex items-start mb-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                        <span className="text-2xl">🛒</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Công ty B - Thương mại điện tử</h4>
                        <p className="text-gray-600 text-sm">Startup, cần test sản phẩm nhanh</p>
                      </div>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-xl mb-4">
                      <h5 className="font-bold text-blue-800 mb-2">Lợi ích thiết thực:</h5>
                      <ul className="text-sm text-blue-700 space-y-1">
                        <li>✅ Test 5 mẫu sản phẩm khác nhau</li>
                        <li>✅ Tập trung 100% vào marketing & bán hàng</li>
                        <li>✅ Tránh được rủi ro pháp lý cho startup</li>
                        <li>✅ Linh hoạt điều chỉnh chiến lược</li>
                      </ul>
                    </div>
                    <p className="text-gray-700 italic text-sm">
                      &ldquo;TBS giúp chúng tôi tập trung vào việc mình giỏi nhất là bán hàng. 
                      Mọi thủ tục pháp lý đều được xử lý chuyên nghiệp, minh bạch.&rdquo;
                    </p>
                  </div>
                </div>
              </div>

              {/* Detailed Process Explanation */}
              <div className="bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 p-8 rounded-3xl shadow-2xl text-white">
                <h2 className="text-3xl font-bold mb-8 text-center">
                  📋 Quy trình ủy thác chi tiết - Minh bạch từng bước
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20">
                      <div className="flex items-center mb-4">
                        <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mr-3">
                          <span className="text-white font-bold text-sm">1</span>
                        </div>
                        <h3 className="font-bold text-lg">Ký hợp đồng & Nhận thông tin</h3>
                      </div>
                      <p className="text-gray-300 text-sm leading-relaxed">
                        Khách cung cấp thông tin chi tiết hàng hóa → TBS đánh giá khả thi 
                        → Ký hợp đồng ủy thác với cam kết rõ ràng về quyền lợi
                      </p>
                    </div>
                    
                    <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20">
                      <div className="flex items-center mb-4">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full flex items-center justify-center mr-3">
                          <span className="text-white font-bold text-sm">2</span>
                        </div>
                        <h3 className="font-bold text-lg">Chuẩn bị chứng từ pháp lý</h3>
                      </div>
                      <p className="text-gray-300 text-sm leading-relaxed">
                        TBS lập đầy đủ hồ sơ → Kiểm tra mã HS, chính sách mặt hàng 
                        → Đảm bảo 100% tuân thủ pháp luật hiện hành
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20">
                      <div className="flex items-center mb-4">
                        <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center mr-3">
                          <span className="text-white font-bold text-sm">3</span>
                        </div>
                        <h3 className="font-bold text-lg">Thực hiện thủ tục hải quan</h3>
                      </div>
                      <p className="text-gray-300 text-sm leading-relaxed">
                        TBS chịu trách nhiệm toàn bộ: Khai báo → Đóng thuế → Nhận hàng 
                        → Khách chỉ cần theo dõi tiến độ qua Zalo/Email
                      </p>
                    </div>
                    
                    <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20">
                      <div className="flex items-center mb-4">
                        <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center mr-3">
                          <span className="text-white font-bold text-sm">4</span>
                        </div>
                        <h3 className="font-bold text-lg">Bàn giao & Hoàn thiện</h3>
                      </div>
                      <p className="text-gray-300 text-sm leading-relaxed">
                        Giao hàng tận nơi → Thanh lý hồ sơ → Hướng dẫn sử dụng hàng hóa hợp pháp 
                        → Tư vấn cho lần ủy thác tiếp theo
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Mini Form CTA */}
              <div className="bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-8 rounded-3xl shadow-2xl text-white">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold mb-4">📝 Đăng ký tư vấn ủy thác miễn phí</h2>
                  <p className="text-lg text-gray-300">
                    &ldquo;Chuyên gia pháp lý sẽ tư vấn chi tiết trong 30 phút&rdquo;
                  </p>
                </div>
                
                <div className="max-w-4xl mx-auto">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-2">
                        🏢 Tên doanh nghiệp *
                      </label>
                      <input 
                        type="text" 
                        placeholder="VD: Công ty TNHH ABC..."
                        className="w-full p-3 rounded-xl border border-white/20 bg-white/10 backdrop-blur-sm text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-2">
                        📦 Loại hàng hóa cần ủy thác *
                      </label>
                      <select className="w-full p-3 rounded-xl border border-white/20 bg-white/10 backdrop-blur-sm text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200">
                        <option value="" className="text-gray-900">Chọn loại hàng</option>
                        <option value="thoi-trang" className="text-gray-900">📱 Điện tử - Công nghệ</option>
                        <option value="dien-tu" className="text-gray-900">👕 Thời trang - Dệt may</option>
                        <option value="me-be" className="text-gray-900">🍼 Mẹ và bé</option>
                        <option value="gia-dung" className="text-gray-900">🏠 Gia dụng - Nội thất</option>
                        <option value="thuc-pham" className="text-gray-900">🍯 Thực phẩm - Đồ uống</option>
                        <option value="my-pham" className="text-gray-900">💄 Mỹ phẩm - Chăm sóc</option>
                        <option value="khac" className="text-gray-900">🔄 Khác (sẽ tư vấn chi tiết)</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-2">
                        📱 Số điện thoại/Zalo *
                      </label>
                      <input 
                        type="tel" 
                        placeholder="Nhập SĐT để được gọi lại"
                        className="w-full p-3 rounded-xl border border-white/20 bg-white/10 backdrop-blur-sm text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                      />
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <button className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 text-white px-10 py-4 rounded-2xl font-bold text-lg hover:from-orange-600 hover:via-red-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-orange-500/25 mb-4">
                      <span className="flex items-center justify-center">
                        🚀 Gửi yêu cầu tư vấn (Miễn phí)
                        <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </span>
                    </button>
                    <p className="text-sm text-gray-400">
                      ✅ Chuyên gia pháp lý XNK sẽ liên hệ trong 30 phút
                    </p>
                  </div>
                </div>
              </div>

              {/* FAQ & Educational Content */}
              <div className="bg-gradient-to-r from-amber-50 via-orange-50 to-yellow-50 p-8 rounded-3xl shadow-2xl border border-amber-200">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                  💡 Câu hỏi thường gặp & Tài liệu hữu ích
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                    <h4 className="font-bold text-lg text-gray-900 mb-3">❓ Ủy thác XNK là gì?</h4>
                    <div className="space-y-2 text-sm text-gray-700">
                      <p><strong>Định nghĩa:</strong> TBS đứng tên thực hiện XNK thay cho doanh nghiệp</p>
                      <p><strong>Phù hợp:</strong> DN chưa có giấy phép XNK, muốn test thị trường</p>
                      <p><strong>Lợi ích:</strong> Tiết kiệm thời gian, chi phí, tránh rủi ro pháp lý</p>
                    </div>
                  </div>
                  
                  <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                    <h4 className="font-bold text-lg text-gray-900 mb-3">🛡️ Có rủi ro gì không?</h4>
                    <div className="space-y-2 text-sm text-gray-700">
                      <p><strong>Pháp lý:</strong> TBS chịu trách nhiệm 100% trước pháp luật</p>
                      <p><strong>Bảo mật:</strong> Ký cam kết bảo mật thông tin doanh nghiệp</p>
                      <p><strong>Tài chính:</strong> Hợp đồng rõ ràng, không phát sinh chi phí ẩn</p>
                    </div>
                  </div>
                  
                  <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                    <h4 className="font-bold text-lg text-gray-900 mb-3">👥 Ai nên sử dụng?</h4>
                    <div className="space-y-2 text-sm text-gray-700">
                      <p><strong>Startup:</strong> Muốn test sản phẩm nhanh, ít rủi ro</p>
                      <p><strong>DN nhỏ:</strong> Chưa đủ điều kiện xin giấy phép XNK</p>
                      <p><strong>Cá nhân:</strong> Kinh doanh cá thể muốn mở rộng</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8">
                  <h4 className="font-bold text-lg text-gray-900 mb-4 text-center">📚 Tài liệu tham khảo miễn phí</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white p-4 rounded-xl shadow-lg">
                      <h5 className="font-semibold text-gray-900 mb-2">📖 Hướng dẫn chi tiết</h5>
                      <div className="space-y-2 text-sm">
                        <a href="#" className="block text-blue-600 hover:text-blue-800 font-medium hover:underline">
                          📥 Bắt đầu XNK cho doanh nghiệp nhỏ
                        </a>
                        <a href="#" className="block text-blue-600 hover:text-blue-800 font-medium hover:underline">
                          📥 So sánh: Ủy thác vs Tự làm XNK
                        </a>
                        <a href="#" className="block text-blue-600 hover:text-blue-800 font-medium hover:underline">
                          📥 Checklist hàng hóa cho ủy thác
                        </a>
                      </div>
                    </div>
                    
                    <div className="bg-white p-4 rounded-xl shadow-lg">
                      <h5 className="font-semibold text-gray-900 mb-2">⚖️ Chính sách pháp lý</h5>
                      <div className="space-y-2 text-sm">
                        <a href="#" className="block text-green-600 hover:text-green-800 font-medium hover:underline">
                          📥 Các chính sách XNK cần biết 2024
                        </a>
                        <a href="#" className="block text-green-600 hover:text-green-800 font-medium hover:underline">
                          📥 Mẫu hợp đồng ủy thác chuẩn
                        </a>
                        <a href="#" className="block text-green-600 hover:text-green-800 font-medium hover:underline">
                          📥 Quyền lợi của bên ủy thác
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Legal & Tax Consulting Features - Only for tu-van-phap-ly-thue-xnk */}
      {service.slug === 'tu-van-phap-ly-thue-xnk' && (
        <section className="section-padding bg-gray-50">
          <div className="container-max">
            <div className="max-w-6xl mx-auto space-y-12">
              {/* Expert Credentials & Trust Building */}
              <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-8 rounded-3xl shadow-2xl border border-indigo-100">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">
                    🏆 Đội ngũ chuyên gia pháp lý XNK hàng đầu
                  </h2>
                  <p className="text-lg text-gray-600 max-w-4xl mx-auto leading-relaxed">
                    &ldquo;1.000+ ca thực tế đã xử lý thành công - Từ kiểm tra HS code đến khiếu nại thuế phức tạp&rdquo;
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="text-center group">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-105">
                      <span className="text-3xl text-white">⚖️</span>
                    </div>
                    <h3 className="font-bold text-lg text-gray-900 mb-2">Luật sư XNK Certified</h3>
                    <p className="text-sm text-gray-600">
                      Đội ngũ luật sư & nguyên cán bộ XNK<br/>
                      15+ năm kinh nghiệm thực tiễn
                    </p>
                  </div>
                  
                  <div className="text-center group">
                    <div className="w-20 h-20 bg-gradient-to-br from-green-600 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-105">
                      <span className="text-3xl text-white">📊</span>
                    </div>
                    <h3 className="font-bold text-lg text-gray-900 mb-2">1000+ Ca thành công</h3>
                    <p className="text-sm text-gray-600">
                      Kiểm tra HS code, khiếu nại thuế<br/>
                      Cập nhật nghị định mới
                    </p>
                  </div>
                  
                  <div className="text-center group">
                    <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-105">
                      <span className="text-3xl text-white">🎯</span>
                    </div>
                    <h3 className="font-bold text-lg text-gray-900 mb-2">Trực tiếp chuyên gia</h3>
                    <p className="text-sm text-gray-600">
                      Không qua trung gian sale<br/>
                      Tư vấn một-một chuyên sâu
                    </p>
                  </div>
                </div>
              </div>

              {/* Success Cases & Testimonials */}
              <div className="bg-gradient-to-r from-green-50 via-emerald-50 to-teal-50 p-8 rounded-3xl shadow-2xl border border-green-100">
                <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                  💼 Câu chuyện thành công thực tế
                </h2>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                  <div className="bg-white p-6 rounded-2xl shadow-lg">
                    <div className="flex items-start mb-4">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                        <span className="text-2xl">💰</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Công ty A - Điện tử</h4>
                        <p className="text-gray-600 text-sm">Bị truy thu thuế do sai mã HS</p>
                      </div>
                    </div>
                    <div className="bg-green-50 p-4 rounded-xl mb-4">
                      <h5 className="font-bold text-green-800 mb-2">Kết quả đạt được:</h5>
                      <ul className="text-sm text-green-700 space-y-1">
                        <li>✅ Tránh được truy thu 800 triệu tiền thuế</li>
                        <li>✅ Giải trình thành công với hải quan</li>
                        <li>✅ Cập nhật mã HS đúng cho lần sau</li>
                        <li>✅ Tiết kiệm 15% chi phí thuế hàng năm</li>
                      </ul>
                    </div>
                    <p className="text-gray-700 italic text-sm">
                      &ldquo;Nhờ tư vấn của TBS, chúng tôi tránh được truy thu 800 triệu tiền thuế sai mã HS. 
                      Đội ngũ chuyên gia rất am hiểu và hỗ trợ tận tình!&rdquo;
                    </p>
                  </div>
                  
                  <div className="bg-white p-6 rounded-2xl shadow-lg">
                    <div className="flex items-start mb-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                        <span className="text-2xl">🏭</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Công ty B - Dệt may</h4>
                        <p className="text-gray-600 text-sm">Khiếu nại thuế chống bán phá giá</p>
                      </div>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-xl mb-4">
                      <h5 className="font-bold text-blue-800 mb-2">Thành tích nổi bật:</h5>
                      <ul className="text-sm text-blue-700 space-y-1">
                        <li>✅ Giúp hoàn thuế XNK 2 tỷ trong 1 lần giải trình</li>
                        <li>✅ Xử lý thành công khiếu nại chống bán phá giá</li>
                        <li>✅ Thiết lập quy trình pháp lý chuẩn</li>
                        <li>✅ Đào tạo đội ngũ nội bộ về pháp lý XNK</li>
                      </ul>
                    </div>
                    <p className="text-gray-700 italic text-sm">
                      &ldquo;TBS đã giúp chúng tôi hoàn thuế 2 tỷ thành công. Không chỉ giải quyết được vấn đề 
                      mà còn xây dựng được hệ thống pháp lý vững chắc.&rdquo;
                    </p>
                  </div>
                </div>

                {/* Expert Team Showcase */}
                <div className="bg-gradient-to-r from-blue-100 to-purple-100 p-6 rounded-2xl">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">
                    📸 Đội ngũ chuyên gia thực tế
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white p-4 rounded-xl shadow-lg text-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mx-auto mb-3 flex items-center justify-center">
                        <span className="text-white text-2xl">👨‍💼</span>
                      </div>
                      <h4 className="font-bold text-gray-900">Luật sư XNK</h4>
                      <p className="text-sm text-gray-600">Chuyên gia pháp lý 15+ năm</p>
                    </div>
                    
                    <div className="bg-white p-4 rounded-xl shadow-lg text-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-teal-600 rounded-full mx-auto mb-3 flex items-center justify-center">
                        <span className="text-white text-2xl">👩‍💼</span>
                      </div>
                      <h4 className="font-bold text-gray-900">Nguyên cán bộ Hải quan</h4>
                      <p className="text-sm text-gray-600">Expert thuế XNK thực chiến</p>
                    </div>
                    
                    <div className="bg-white p-4 rounded-xl shadow-lg text-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-full mx-auto mb-3 flex items-center justify-center">
                        <span className="text-white text-2xl">🎓</span>
                      </div>
                      <h4 className="font-bold text-gray-900">Đội nghiên cứu</h4>
                      <p className="text-sm text-gray-600">Cập nhật chính sách 24/7</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Training & Workshop Section */}
              <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-blue-900 p-8 rounded-3xl shadow-2xl text-white">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold mb-4">
                    🎓 Đào tạo ngắn hạn chuyên sâu
                  </h2>
                  <p className="text-lg text-gray-300">
                    &ldquo;Nâng cao kiến thức pháp lý XNK cho đội ngũ doanh nghiệp&rdquo;
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20">
                    <h3 className="font-bold text-xl mb-4">📚 Khóa học pháp lý XNK cơ bản</h3>
                    <ul className="space-y-2 text-gray-300">
                      <li>✅ Hiểu rõ quy trình XNK hợp pháp</li>
                      <li>✅ Cách xác định mã HS chính xác</li>
                      <li>✅ Tránh những sai lầm phổ biến</li>
                      <li>✅ Cập nhật chính sách mới nhất</li>
                    </ul>
                    <div className="mt-4 p-3 bg-purple-500/20 rounded-xl">
                      <p className="text-yellow-300 font-semibold">
                        🎯 Thời lượng: 4 tiếng - Tài liệu đầy đủ
                      </p>
                    </div>
                  </div>
                  
                  <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20">
                    <h3 className="font-bold text-xl mb-4">⚡ Workshop xử lý khẩn cấp</h3>
                    <ul className="space-y-2 text-gray-300">
                      <li>✅ Đối phó kiểm tra đột xuất</li>
                      <li>✅ Kỹ năng đối đáp với hải quan</li>
                      <li>✅ Chuẩn bị hồ sơ phòng thủ</li>
                      <li>✅ Quy trình khiếu nại hiệu quả</li>
                    </ul>
                    <div className="mt-4 p-3 bg-blue-500/20 rounded-xl">
                      <p className="text-cyan-300 font-semibold">
                        🚨 Đặc biệt: Hotline 24/7 cho học viên
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="text-center mt-8">
                  <button className="bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:from-yellow-600 hover:via-orange-600 hover:to-red-600 transition-all duration-300 transform hover:scale-105 shadow-2xl">
                    📝 Đăng ký hội thảo miễn phí tháng này
                  </button>
                </div>
              </div>

              {/* Super Strong CTA with Situation Form */}
              <div className="bg-gradient-to-br from-red-900 via-pink-900 to-purple-900 p-8 rounded-3xl shadow-2xl text-white">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold mb-4">🚨 Gửi tình huống pháp lý của bạn</h2>
                  <p className="text-lg text-gray-300 max-w-3xl mx-auto">
                    &ldquo;Mô tả chi tiết tình huống - Chuyên gia pháp lý sẽ phân tích miễn phí trong 2 giờ&rdquo;
                  </p>
                  <div className="mt-4 inline-block bg-yellow-500/20 px-6 py-2 rounded-full">
                    <p className="text-yellow-300 font-semibold">
                      🔒 100% bảo mật - Cam kết không chia sẻ cho bên thứ ba
                    </p>
                  </div>
                </div>
                
                <div className="max-w-4xl mx-auto">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-2">
                        🏢 Tên doanh nghiệp/Cá nhân *
                      </label>
                      <input 
                        type="text" 
                        placeholder="VD: Công ty TNHH ABC..."
                        className="w-full p-3 rounded-xl border border-white/20 bg-white/10 backdrop-blur-sm text-white placeholder-gray-400 focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-2">
                        📱 Email & Số điện thoại *
                      </label>
                      <input 
                        type="text" 
                        placeholder="email@domain.com - 0900123456"
                        className="w-full p-3 rounded-xl border border-white/20 bg-white/10 backdrop-blur-sm text-white placeholder-gray-400 focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200"
                      />
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                      ⚖️ Mô tả chi tiết tình huống pháp lý/thuế *
                    </label>
                    <textarea 
                      rows={5}
                      placeholder="VD: Công ty tôi bị hải quan thông báo truy thu thuế do sai mã HS code. Hàng hóa là... Tôi cần tư vấn cách giải quyết và khiếu nại..."
                      className="w-full p-4 rounded-xl border border-white/20 bg-white/10 backdrop-blur-sm text-white placeholder-gray-400 focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 resize-none"
                    />
                  </div>
                  
                  <div className="mb-6">
                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                      🚨 Mức độ khẩn cấp
                    </label>
                    <select className="w-full p-3 rounded-xl border border-white/20 bg-white/10 backdrop-blur-sm text-white focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200">
                      <option value="" className="text-gray-900">Chọn mức độ</option>
                      <option value="binh-thuong" className="text-gray-900">⏰ Bình thường (2-3 ngày)</option>
                      <option value="gap" className="text-gray-900">🔥 Gấp (trong ngày)</option>
                      <option value="khan-cap" className="text-gray-900">🚨 Khẩn cấp (trong 2 giờ)</option>
                    </select>
                  </div>
                  
                  <div className="text-center">
                    <button className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 text-white px-10 py-4 rounded-2xl font-bold text-lg hover:from-orange-600 hover:via-red-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-orange-500/25 mb-4">
                      <span className="flex items-center justify-center">
                        🚀 Gửi yêu cầu tư vấn (100% miễn phí)
                        <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </span>
                    </button>
                    <p className="text-sm text-gray-400">
                      ✅ Luật sư/Chuyên gia XNK sẽ phân tích & phản hồi trong 2 giờ
                    </p>
                  </div>
                </div>
              </div>

              {/* FAQ & Educational Resources */}
              <div className="bg-gradient-to-r from-amber-50 via-yellow-50 to-orange-50 p-8 rounded-3xl shadow-2xl border border-amber-200">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                  💡 Kiến thức pháp lý XNK cần biết
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                    <h4 className="font-bold text-lg text-gray-900 mb-3">❓ HS code là gì?</h4>
                    <div className="space-y-2 text-sm text-gray-700">
                      <p><strong>Định nghĩa:</strong> Mã phân loại hàng hóa quốc tế 6-10 số</p>
                      <p><strong>Tác dụng:</strong> Xác định thuế suất, thủ tục nhập khẩu</p>
                      <p><strong>Rủi ro:</strong> Khai sai có thể bị phạt, truy thu thuế</p>
                    </div>
                  </div>
                  
                  <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                    <h4 className="font-bold text-lg text-gray-900 mb-3">⚖️ Vì sao phải tư vấn pháp lý?</h4>
                    <div className="space-y-2 text-sm text-gray-700">
                      <p><strong>Phòng ngừa:</strong> Tránh vi phạm từ đầu, tiết kiệm chi phí</p>
                      <p><strong>Tối ưu:</strong> Khai báo đúng để giảm thuế hợp pháp</p>
                      <p><strong>Xử lý:</strong> Đối phó kiểm tra, khiếu nại hiệu quả</p>
                    </div>
                  </div>
                  
                  <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                    <h4 className="font-bold text-lg text-gray-900 mb-3">📋 Chính sách mới cập nhật ở đâu?</h4>
                    <div className="space-y-2 text-sm text-gray-700">
                      <p><strong>Chính thức:</strong> Website Tổng cục Hải quan</p>
                      <p><strong>Thực tiễn:</strong> TBS cung cấp bản tóm tắt dễ hiểu</p>
                      <p><strong>Ứng dụng:</strong> Tư vấn cách áp dụng cụ thể</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8">
                  <h4 className="font-bold text-lg text-gray-900 mb-4 text-center">📚 Tài liệu miễn phí độc quyền</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white p-6 rounded-xl shadow-lg">
                      <h5 className="font-semibold text-gray-900 mb-3">🔍 Kiểm tra & Phòng ngừa</h5>
                      <div className="space-y-2 text-sm">
                        <a href="#" className="block text-blue-600 hover:text-blue-800 font-medium hover:underline">
                          📥 5 rủi ro pháp lý phổ biến khi nhập khẩu
                        </a>
                        <a href="#" className="block text-blue-600 hover:text-blue-800 font-medium hover:underline">
                          📥 Checklist kiểm tra pháp lý trước XNK
                        </a>
                        <a href="#" className="block text-blue-600 hover:text-blue-800 font-medium hover:underline">
                          📥 Template hồ sơ pháp lý chuẩn
                        </a>
                      </div>
                    </div>
                    
                    <div className="bg-white p-6 rounded-xl shadow-lg">
                      <h5 className="font-semibold text-gray-900 mb-3">⚡ Xử lý khẩn cấp</h5>
                      <div className="space-y-2 text-sm">
                        <a href="#" className="block text-red-600 hover:text-red-800 font-medium hover:underline">
                          📥 SOS: Bị kiểm tra đột xuất - Làm gì?
                        </a>
                        <a href="#" className="block text-red-600 hover:text-red-800 font-medium hover:underline">
                          📥 Quy trình khiếu nại thuế hiệu quả
                        </a>
                        <a href="#" className="block text-red-600 hover:text-red-800 font-medium hover:underline">
                          📥 Cách đối đáp với cán bộ hải quan
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Internal Links */}
                <div className="mt-8 p-6 bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl">
                  <h5 className="font-bold text-gray-900 mb-4 text-center">🔗 Dịch vụ liên quan</h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <a href="/dich-vu/nhap-khau-chinh-ngach" className="block p-3 bg-white rounded-xl hover:shadow-lg transition-all duration-300 text-center">
                      <span className="text-2xl mb-2 block">🚢</span>
                      <span className="text-sm font-medium text-gray-900">Nhập khẩu chính ngạch</span>
                    </a>
                    <a href="/dich-vu/uy-thac-xuat-nhap-khau" className="block p-3 bg-white rounded-xl hover:shadow-lg transition-all duration-300 text-center">
                      <span className="text-2xl mb-2 block">📄</span>
                      <span className="text-sm font-medium text-gray-900">Ủy thác XNK</span>
                    </a>
                    <a href="/dich-vu/thong-quan-chung-tu" className="block p-3 bg-white rounded-xl hover:shadow-lg transition-all duration-300 text-center">
                      <span className="text-2xl mb-2 block">📋</span>
                      <span className="text-sm font-medium text-gray-900">Thông quan</span>
                    </a>
                    <a href="/dich-vu/canh-bao-rui-ro-xnk" className="block p-3 bg-white rounded-xl hover:shadow-lg transition-all duration-300 text-center">
                      <span className="text-2xl mb-2 block">⚠️</span>
                      <span className="text-sm font-medium text-gray-900">Cảnh báo rủi ro</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Supplier Verification Features - Only for kiem-tra-nha-cung-cap */}
      {service.slug === 'kiem-tra-nha-cung-cap' && (
        <section className="section-padding bg-gray-50">
          <div className="container-max">
            <div className="max-w-6xl mx-auto space-y-12">
              {/* Risk Alert & Solution USP */}
              <div className="bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 p-8 rounded-3xl shadow-2xl border border-red-200">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">
                    🚨 90% rủi ro đến từ việc chọn sai nhà cung cấp
                  </h2>
                  <p className="text-lg text-gray-700 max-w-4xl mx-auto leading-relaxed">
                    &ldquo;Mất tiền cọc, nhận hàng kém chất lượng, không thể kiện tụng. 
                    Đừng để doanh nghiệp của bạn thành nạn nhân tiếp theo!&rdquo;
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="text-center group">
                    <div className="w-20 h-20 bg-gradient-to-br from-red-600 to-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-105">
                      <span className="text-3xl text-white">💸</span>
                    </div>
                    <h3 className="font-bold text-lg text-gray-900 mb-2">Mất tiền cọc</h3>
                    <p className="text-sm text-gray-600">
                      Nhà máy &quot;ma&quot;, giấy tờ giả<br/>
                      Không thể đòi lại tiền
                    </p>
                  </div>
                  
                  <div className="text-center group">
                    <div className="w-20 h-20 bg-gradient-to-br from-orange-600 to-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-105">
                      <span className="text-3xl text-white">📦</span>
                    </div>
                    <h3 className="font-bold text-lg text-gray-900 mb-2">Hàng kém chất lượng</h3>
                    <p className="text-sm text-gray-600">
                      Không đúng mẫu cam kết<br/>
                      Khó khăn đòi bồi thường
                    </p>
                  </div>
                  
                  <div className="text-center group">
                    <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-105">
                      <span className="text-3xl text-white">⚖️</span>
                    </div>
                    <h3 className="font-bold text-lg text-gray-900 mb-2">Không thể kiện tụng</h3>
                    <p className="text-sm text-gray-600">
                      Thiếu bằng chứng pháp lý<br/>
                      Thua thiệt khi tranh chấp
                    </p>
                  </div>
                </div>

                <div className="mt-8 bg-green-100 p-6 rounded-2xl text-center">
                  <h3 className="text-xl font-bold text-green-800 mb-2">
                    ✅ TBS GROUP - Giải pháp an toàn cho doanh nghiệp
                  </h3>
                  <p className="text-green-700">
                    <strong>300+ doanh nghiệp</strong> đã tránh được đối tác lừa đảo, tiết kiệm <strong>hàng tỷ đồng</strong> 
                    nhờ kiểm tra trực tiếp trước khi ký hợp đồng
                  </p>
                </div>
              </div>

              {/* Success Cases & Real Testimonials */}
              <div className="bg-gradient-to-r from-blue-50 via-cyan-50 to-teal-50 p-8 rounded-3xl shadow-2xl border border-blue-100">
                <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                  💼 Câu chuyện khách hàng thực tế
                </h2>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                  <div className="bg-white p-6 rounded-2xl shadow-lg">
                    <div className="flex items-start mb-4">
                      <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
                        <span className="text-2xl">🚨</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Công ty A - Thời trang</h4>
                        <p className="text-gray-600 text-sm">Suýt bị lừa 200 triệu tiền cọc</p>
                      </div>
                    </div>
                    <div className="bg-red-50 p-4 rounded-xl mb-4">
                      <h5 className="font-bold text-red-800 mb-2">Phát hiện kịp thời:</h5>
                      <ul className="text-sm text-red-700 space-y-1">
                        <li>❌ &quot;Nhà máy&quot; chỉ là văn phòng cho thuê</li>
                        <li>❌ Giấy phép kinh doanh đã hết hạn</li>
                        <li>❌ Không có dây chuyền sản xuất thực tế</li>
                        <li>✅ Tránh mất 200 triệu đồng tiền cọc</li>
                      </ul>
                    </div>
                    <p className="text-gray-700 italic text-sm">
                      &ldquo;Nhờ kiểm tra thực tế của TBS, chúng tôi phát hiện nhà máy chỉ là văn phòng cho thuê, 
                      tránh mất cọc 200 triệu đồng. Thật may mắn!&rdquo;
                    </p>
                  </div>
                  
                  <div className="bg-white p-6 rounded-2xl shadow-lg">
                    <div className="flex items-start mb-4">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                        <span className="text-2xl">✅</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Công ty B - Điện tử</h4>
                        <p className="text-gray-600 text-sm">Xác minh năng lực sản xuất</p>
                      </div>
                    </div>
                    <div className="bg-green-50 p-4 rounded-xl mb-4">
                      <h5 className="font-bold text-green-800 mb-2">Kết quả tích cực:</h5>
                      <ul className="text-sm text-green-700 space-y-1">
                        <li>✅ Xác minh năng lực 10.000 sản phẩm/tháng</li>
                        <li>✅ Kiểm tra dây chuyền hiện đại</li>
                        <li>✅ Đánh giá đội ngũ 50+ nhân viên</li>
                        <li>✅ Tự tin ký hợp đồng lớn đầu tiên</li>
                      </ul>
                    </div>
                    <p className="text-gray-700 italic text-sm">
                      &ldquo;TBS đã giúp xác minh nhà máy thật sự có năng lực xuất 10.000 sản phẩm/tháng như cam kết, 
                      giúp tôi tự tin ký hợp đồng lớn đầu tiên.&rdquo;
                    </p>
                  </div>
                </div>

                {/* Inspection Report Sample */}
                <div className="bg-gradient-to-r from-gray-100 to-blue-100 p-6 rounded-2xl">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">
                    📋 Mẫu báo cáo kiểm tra thực tế
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white p-4 rounded-xl shadow-lg text-center">
                      <div className="w-16 h-20 bg-gradient-to-br from-red-500 to-pink-600 rounded-lg mx-auto mb-3 flex items-center justify-center">
                        <span className="text-white text-xs font-bold">PDF</span>
                      </div>
                      <h4 className="font-bold text-gray-900 text-sm">Báo cáo tổng quan</h4>
                      <p className="text-xs text-gray-600">15 trang, 40+ ảnh thực tế</p>
                    </div>
                    
                    <div className="bg-white p-4 rounded-xl shadow-lg text-center">
                      <div className="w-16 h-20 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg mx-auto mb-3 flex items-center justify-center">
                        <span className="text-white text-xs font-bold">VIDEO</span>
                      </div>
                      <h4 className="font-bold text-gray-900 text-sm">Video thực tế</h4>
                      <p className="text-xs text-gray-600">10-15 phút quay xưởng</p>
                    </div>
                    
                    <div className="bg-white p-4 rounded-xl shadow-lg text-center">
                      <div className="w-16 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg mx-auto mb-3 flex items-center justify-center">
                        <span className="text-white text-xs font-bold">CERT</span>
                      </div>
                      <h4 className="font-bold text-gray-900 text-sm">Giấy tờ pháp lý</h4>
                      <p className="text-xs text-gray-600">Scan chất lượng cao</p>
                    </div>
                  </div>
                  <p className="text-center text-sm text-gray-600 mt-4">
                    📥 <strong>Mẫu báo cáo mẫu</strong> (ẩn thông tin nhạy cảm) - 
                    <a href="#" className="text-blue-600 hover:underline">Tải xuống để xem chi tiết</a>
                  </p>
                </div>
              </div>

              {/* Advanced Inspection Capabilities */}
              <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-blue-900 p-8 rounded-3xl shadow-2xl text-white">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold mb-4">
                    🔬 Quy trình kiểm tra chuyên nghiệp
                  </h2>
                  <p className="text-lg text-gray-300">
                    &ldquo;Khách hàng được xem toàn bộ ảnh/video và nhận báo cáo độc lập – minh bạch 100%&rdquo;
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20">
                      <div className="flex items-center mb-4">
                        <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mr-3">
                          <span className="text-white font-bold text-sm">1</span>
                        </div>
                        <h3 className="font-bold text-lg">Phân tích mục tiêu kiểm tra</h3>
                      </div>
                      <p className="text-gray-300 text-sm leading-relaxed">
                        Xác định chính xác nhu cầu: kiểm tra giấy phép, chất lượng, 
                        năng lực sản xuất hay uy tín tài chính
                      </p>
                    </div>
                    
                    <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20">
                      <div className="flex items-center mb-4">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full flex items-center justify-center mr-3">
                          <span className="text-white font-bold text-sm">2</span>
                        </div>
                        <h3 className="font-bold text-lg">Liên hệ & đặt lịch</h3>
                      </div>
                      <p className="text-gray-300 text-sm leading-relaxed">
                        Liên hệ nhà cung cấp, đặt lịch kiểm tra trực tiếp hoặc online, 
                        chuẩn bị checklist theo yêu cầu riêng
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20">
                      <div className="flex items-center mb-4">
                        <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center mr-3">
                          <span className="text-white font-bold text-sm">3</span>
                        </div>
                        <h3 className="font-bold text-lg">Kiểm tra thực tế tại xưởng</h3>
                      </div>
                      <p className="text-gray-300 text-sm leading-relaxed">
                        Chụp ảnh/quay video thực tế, thu thập giấy tờ pháp lý, 
                        kiểm tra máy móc và năng lực sản xuất thật
                      </p>
                    </div>
                    
                    <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20">
                      <div className="flex items-center mb-4">
                        <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center mr-3">
                          <span className="text-white font-bold text-sm">4</span>
                        </div>
                        <h3 className="font-bold text-lg">Báo cáo & tư vấn</h3>
                      </div>
                      <p className="text-gray-300 text-sm leading-relaxed">
                        Lập báo cáo chi tiết với ảnh/video, tư vấn thương lượng, 
                        gửi hồ sơ xác thực minh bạch 100%
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Super Strong CTA with Inspection Request Form */}
              <div className="bg-gradient-to-br from-orange-900 via-red-900 to-pink-900 p-8 rounded-3xl shadow-2xl text-white">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold mb-4">🎯 Đăng ký kiểm tra nhà cung cấp</h2>
                  <p className="text-lg text-gray-300 max-w-3xl mx-auto">
                    &ldquo;Để lại số điện thoại, chuyên viên sẽ liên hệ trong 15 phút và tư vấn lộ trình kiểm tra phù hợp&rdquo;
                  </p>
                  <div className="mt-4 inline-block bg-green-500/20 px-6 py-2 rounded-full">
                    <p className="text-green-300 font-semibold">
                      🆓 Miễn phí đánh giá sơ bộ nhà cung cấp!
                    </p>
                  </div>
                </div>
                
                <div className="max-w-4xl mx-auto">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-2">
                        🏢 Tên doanh nghiệp *
                      </label>
                      <input 
                        type="text" 
                        placeholder="VD: Công ty TNHH ABC..."
                        className="w-full p-3 rounded-xl border border-white/20 bg-white/10 backdrop-blur-sm text-white placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-2">
                        📱 Số điện thoại/Email *
                      </label>
                      <input 
                        type="text" 
                        placeholder="0900123456 hoặc email@domain.com"
                        className="w-full p-3 rounded-xl border border-white/20 bg-white/10 backdrop-blur-sm text-white placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-2">
                        🔗 Link/WeChat/Website nhà cung cấp *
                      </label>
                      <input 
                        type="url" 
                        placeholder="VD: www.factory.com hoặc WeChat ID"
                        className="w-full p-3 rounded-xl border border-white/20 bg-white/10 backdrop-blur-sm text-white placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-2">
                        📦 Loại sản phẩm muốn kiểm tra *
                      </label>
                      <select className="w-full p-3 rounded-xl border border-white/20 bg-white/10 backdrop-blur-sm text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200">
                        <option value="" className="text-gray-900">Chọn loại sản phẩm</option>
                        <option value="thoi-trang" className="text-gray-900">👕 Thời trang - Dệt may</option>
                        <option value="dien-tu" className="text-gray-900">📱 Điện tử - Công nghệ</option>
                        <option value="gia-dung" className="text-gray-900">🏠 Gia dụng - Nội thất</option>
                        <option value="me-be" className="text-gray-900">🍼 Mẹ và bé</option>
                        <option value="my-pham" className="text-gray-900">💄 Mỹ phẩm - Chăm sóc</option>
                        <option value="thuc-pham" className="text-gray-900">🍯 Thực phẩm - Đồ uống</option>
                        <option value="cong-nghiep" className="text-gray-900">⚙️ Thiết bị công nghiệp</option>
                        <option value="khac" className="text-gray-900">🔄 Khác (sẽ tư vấn chi tiết)</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <button className="bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 text-white px-10 py-4 rounded-2xl font-bold text-lg hover:from-yellow-600 hover:via-orange-600 hover:to-red-600 transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-orange-500/25 mb-4">
                      <span className="flex items-center justify-center">
                        🚀 Gửi yêu cầu kiểm tra (Miễn phí đánh giá)
                        <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </span>
                    </button>
                    <p className="text-sm text-gray-400">
                      ✅ Chuyên gia kiểm tra sẽ liên hệ trong 15 phút
                    </p>
                  </div>
                </div>
              </div>

              {/* FAQ & Educational Resources */}
              <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-cyan-50 p-8 rounded-3xl shadow-2xl border border-emerald-200">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                  💡 Kiến thức cần biết về kiểm tra nhà cung cấp
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                    <h4 className="font-bold text-lg text-gray-900 mb-3">❓ Kiểm tra nhà cung cấp gồm những gì?</h4>
                    <div className="space-y-2 text-sm text-gray-700">
                      <p><strong>Giấy phép:</strong> GPKD, chứng nhận xuất xứ, kiểm định</p>
                      <p><strong>Thực tế:</strong> Nhà xưởng, dây chuyền, nhân sự</p>
                      <p><strong>Tài chính:</strong> Lịch sử giao dịch, uy tín</p>
                    </div>
                  </div>
                  
                  <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                    <h4 className="font-bold text-lg text-gray-900 mb-3">📹 Có được xem video/xưởng thật không?</h4>
                    <div className="space-y-2 text-sm text-gray-700">
                      <p><strong>Video live:</strong> Quay trực tiếp qua video call</p>
                      <p><strong>Ảnh thực tế:</strong> 40+ ảnh chi tiết nhà xưởng</p>
                      <p><strong>Báo cáo:</strong> File PDF 15+ trang chi tiết</p>
                    </div>
                  </div>
                  
                  <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                    <h4 className="font-bold text-lg text-gray-900 mb-3">⚠️ Nếu kết quả không đạt thì xử lý sao?</h4>
                    <div className="space-y-2 text-sm text-gray-700">
                      <p><strong>Báo cáo trung thực:</strong> Không bao che khuyết điểm</p>
                      <p><strong>Tư vấn:</strong> Gợi ý nhà cung cấp thay thế</p>
                      <p><strong>Hỗ trợ:</strong> Thương lượng hoặc hủy hợp đồng</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8">
                  <h4 className="font-bold text-lg text-gray-900 mb-4 text-center">📚 Tài liệu miễn phí đặc biệt</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white p-6 rounded-xl shadow-lg">
                      <h5 className="font-semibold text-gray-900 mb-3">🛡️ Cẩm nang phòng chống lừa đảo</h5>
                      <div className="space-y-2 text-sm">
                        <a href="#" className="block text-red-600 hover:text-red-800 font-medium hover:underline">
                          📥 Cẩm nang phòng tránh lừa đảo khi nhập hàng TQ
                        </a>
                        <a href="#" className="block text-red-600 hover:text-red-800 font-medium hover:underline">
                          📥 10 dấu hiệu nhận biết nhà máy &quot;ma&quot;
                        </a>
                        <a href="#" className="block text-red-600 hover:text-red-800 font-medium hover:underline">
                          📥 Checklist kiểm tra nhà cung cấp tự làm
                        </a>
                      </div>
                    </div>
                    
                    <div className="bg-white p-6 rounded-xl shadow-lg">
                      <h5 className="font-semibold text-gray-900 mb-3">📋 Mẫu báo cáo & Template</h5>
                      <div className="space-y-2 text-sm">
                        <a href="#" className="block text-blue-600 hover:text-blue-800 font-medium hover:underline">
                          📥 Tải mẫu báo cáo kiểm tra nhà cung cấp
                        </a>
                        <a href="#" className="block text-blue-600 hover:text-blue-800 font-medium hover:underline">
                          📥 Template đánh giá năng lực sản xuất
                        </a>
                        <a href="#" className="block text-blue-600 hover:text-blue-800 font-medium hover:underline">
                          📥 Hợp đồng mẫu với nhà cung cấp TQ
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Internal Links */}
                <div className="mt-8 p-6 bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl">
                  <h5 className="font-bold text-gray-900 mb-4 text-center">🔗 Dịch vụ liên quan</h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <a href="/dich-vu/nhap-khau-chinh-ngach" className="block p-3 bg-white rounded-xl hover:shadow-lg transition-all duration-300 text-center">
                      <span className="text-2xl mb-2 block">🚢</span>
                      <span className="text-sm font-medium text-gray-900">Nhập khẩu chính ngạch</span>
                    </a>
                    <a href="/dich-vu/gom-hang-le-ghep-container" className="block p-3 bg-white rounded-xl hover:shadow-lg transition-all duration-300 text-center">
                      <span className="text-2xl mb-2 block">📦</span>
                      <span className="text-sm font-medium text-gray-900">Gom hàng lẻ</span>
                    </a>
                    <a href="/dich-vu/thanh-toan-ho-trung-quoc" className="block p-3 bg-white rounded-xl hover:shadow-lg transition-all duration-300 text-center">
                      <span className="text-2xl mb-2 block">💰</span>
                      <span className="text-sm font-medium text-gray-900">Thanh toán hộ TQ</span>
                    </a>
                    <a href="/dich-vu/tu-van-phap-ly-thue-xnk" className="block p-3 bg-white rounded-xl hover:shadow-lg transition-all duration-300 text-center">
                      <span className="text-2xl mb-2 block">⚖️</span>
                      <span className="text-sm font-medium text-gray-900">Tư vấn pháp lý</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Real Evidence & Warehouse Images - Only for packaging service */}
      {service.slug === 'dong-goi-bao-hiem-hang' && (
        <section className="section-padding bg-gray-50">
          <div className="container-max">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                  Minh chứng thực tế quy trình đóng gói
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  Hình ảnh thực tế tại kho đóng gói và quy trình bảo hiểm của TBS GROUP
                </p>
              </div>

              {/* Warehouse Images Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                <div className="relative group overflow-hidden rounded-2xl shadow-lg">
                  <Image 
                    src="https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=400&fit=crop" 
                    alt="Nhân viên đóng gói chuyên nghiệp"
                    width={600}
                    height={400}
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                    <div className="p-6 text-white">
                      <h3 className="font-bold text-lg mb-2">👷‍♂️ Nhân viên đóng gói chuyên nghiệp</h3>
                      <p className="text-sm text-gray-200">Đội ngũ được đào tạo chuẩn quốc tế</p>
                    </div>
                  </div>
                </div>

                <div className="relative group overflow-hidden rounded-2xl shadow-lg">
                  <Image 
                    src="https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=400&fit=crop" 
                    alt="Container và logistics"
                    width={600}
                    height={400}
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                    <div className="p-6 text-white">
                      <h3 className="font-bold text-lg mb-2">📦 Container logistics hiện đại</h3>
                      <p className="text-sm text-gray-200">Hệ thống vận chuyển an toàn</p>
                    </div>
                  </div>
                </div>

                <div className="relative group overflow-hidden rounded-2xl shadow-lg">
                  <Image 
                    src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&h=400&fit=crop" 
                    alt="Kho bãi hiện đại"
                    width={600}
                    height={400}
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                    <div className="p-6 text-white">
                      <h3 className="font-bold text-lg mb-2">🏭 Kho bãi hiện đại</h3>
                      <p className="text-sm text-gray-200">Kiểm soát nhiệt độ và độ ẩm</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Customer Testimonials for Packaging */}
              <div className="bg-gradient-to-br from-blue-50 via-white to-green-50 p-8 rounded-3xl shadow-xl">
                <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
                  💬 Phản hồi thực tế từ khách hàng
                </h3>
                
                {service.testimonials && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {service.testimonials.map((testimonial, index) => (
                      <div key={index} className="bg-white p-6 rounded-2xl shadow-lg">
                        <div className="flex items-start mb-4">
                          <Image 
                            src={index === 0 
                              ? "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face"
                              : "https://images.unsplash.com/photo-1494790108755-2616b612b169?w=50&h=50&fit=crop&crop=face"
                            }
                            alt={testimonial.author}
                            width={48}
                            height={48}
                            className="w-12 h-12 rounded-full object-cover mr-4"
                          />
                          <div>
                            <h4 className="font-semibold text-gray-900">{testimonial.author}</h4>
                            <p className="text-gray-600 text-sm">{testimonial.role}</p>
                          </div>
                        </div>
                        <p className="text-gray-700 italic mb-4">
                          &ldquo;{testimonial.content}&rdquo;
                        </p>
                        <div className="flex text-yellow-400">
                          {[...Array(5)].map((_, i) => (
                            <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                            </svg>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Strong Quote */}
                <div className="mt-8 text-center p-6 bg-gradient-to-r from-green-100 to-blue-100 rounded-2xl">
                  <blockquote className="text-2xl font-bold text-gray-900 italic">
                    &ldquo;Lô hàng đầu tiên về đúng hạn, tiết kiệm 30% chi phí, cảm ơn TBS!&rdquo;
                  </blockquote>
                  <p className="text-gray-600 mt-2">- Khách hàng sử dụng dịch vụ đóng gói & bảo hiểm</p>
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
                {service.slug === 'nhap-khau-chinh-ngach' ? 'Dịch vụ chuyên biệt' : 
                 service.slug === 'dong-goi-bao-hiem-hang' ? 'Dịch vụ chuyên sâu' : 'Tính năng nổi bật'}
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                {service.slug === 'nhap-khau-chinh-ngach' 
                  ? 'Những dịch vụ chuyên biệt chỉ có tại TBS GROUP' 
                  : service.slug === 'dong-goi-bao-hiem-hang'
                  ? 'Dịch vụ đóng gói và bảo hiểm chuyên nghiệp với công nghệ hiện đại'
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

      {/* Warehouse Locations & Technology - Only for warehouse service */}
      {service.slug === 'kho-bai-trung-viet' && (
        <section className="section-padding bg-gray-50">
          <div className="container-max">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                  🏭 Hệ thống kho bãi hiện đại hai đầu biên giới
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  Vị trí chiến lược, trang thiết bị hiện đại và công nghệ WMS tiên tiến
                </p>
              </div>

              {/* Warehouse Locations */}
              {service.warehouseLocations && (
                <div className="space-y-12">
                  {service.warehouseLocations.map((countryData, countryIndex) => (
                    <div key={countryIndex}>
                      <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
                        📍 Kho bãi tại {countryData.country}
                      </h3>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {countryData.locations.map((location, locationIndex) => (
                          <div key={locationIndex} className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
                            <div className="flex items-start mb-6">
                              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mr-4">
                                <span className="text-3xl">🏢</span>
                              </div>
                              <div>
                                <h4 className="text-xl font-bold text-gray-900 mb-2">{location.name}</h4>
                                <p className="text-gray-600 mb-3">{location.address}</p>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                  <div>
                                    <span className="font-semibold text-gray-900">Diện tích:</span>
                                    <span className="text-blue-600 ml-1">{location.area}</span>
                                  </div>
                                  <div>
                                    <span className="font-semibold text-gray-900">Sức chứa:</span>
                                    <span className="text-green-600 ml-1">{location.capacity}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            <div className="mb-4">
                              <h5 className="font-semibold text-gray-900 mb-3">🎯 Chuyên về:</h5>
                              <div className="flex flex-wrap gap-2">
                                {location.specialties.map((specialty, specIndex) => (
                                  <span 
                                    key={specIndex}
                                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                                  >
                                    {specialty}
                                  </span>
                                ))}
                              </div>
                            </div>
                            
                            <div className="border-t pt-4">
                              <div className="grid grid-cols-2 gap-4 text-sm">
                                <div className="flex items-center">
                                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                                  <span className="text-gray-700">WMS system</span>
                                </div>
                                <div className="flex items-center">
                                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                                  <span className="text-gray-700">Bảo mật 24/7</span>
                                </div>
                                <div className="flex items-center">
                                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                                  <span className="text-gray-700">Kiểm soát nhiệt độ</span>
                                </div>
                                <div className="flex items-center">
                                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                                  <span className="text-gray-700">Camera giám sát</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* WMS Technology Demo */}
              <div className="mt-16 bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 p-8 rounded-3xl shadow-2xl text-white">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold mb-4">💻 Công nghệ WMS - Quản lý kho thông minh</h3>
                  <p className="text-blue-200 max-w-3xl mx-auto">
                    Hệ thống quản lý kho hiện đại cho phép khách hàng theo dõi và kiểm soát hàng hóa mọi lúc mọi nơi
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20">
                    <div className="text-3xl mb-4">📊</div>
                    <h4 className="font-bold mb-2">Theo dõi tồn kho</h4>
                    <p className="text-sm text-gray-300">Cập nhật realtime số lượng, vị trí từng kiện hàng</p>
                  </div>
                  
                  <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20">
                    <div className="text-3xl mb-4">📱</div>
                    <h4 className="font-bold mb-2">App mobile</h4>
                    <p className="text-sm text-gray-300">Truy cập mọi lúc trên điện thoại, tablet</p>
                  </div>
                  
                  <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20">
                    <div className="text-3xl mb-4">📈</div>
                    <h4 className="font-bold mb-2">Báo cáo chi tiết</h4>
                    <p className="text-sm text-gray-300">Thống kê nhập/xuất, dự báo nhu cầu</p>
                  </div>
                  
                  <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20">
                    <div className="text-3xl mb-4">🔔</div>
                    <h4 className="font-bold mb-2">Cảnh báo tự động</h4>
                    <p className="text-sm text-gray-300">Thông báo khi tồn kho thấp, hết hạn</p>
                  </div>
                </div>
              </div>

              {/* Customer Testimonials */}
              {service.testimonials && (
                <div className="mt-16 bg-gradient-to-br from-green-50 via-white to-blue-50 p-8 rounded-3xl shadow-xl">
                  <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
                    💬 Phản hồi từ khách hàng sử dụng kho bãi
                  </h3>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {service.testimonials.map((testimonial, index) => (
                      <div key={index} className="bg-white p-6 rounded-2xl shadow-lg">
                        <div className="flex items-start mb-4">
                          <Image 
                            src={index === 0 
                              ? "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face"
                              : "https://images.unsplash.com/photo-1494790108755-2616b612b169?w=50&h=50&fit=crop&crop=face"
                            }
                            alt={testimonial.author}
                            width={48}
                            height={48}
                            className="w-12 h-12 rounded-full object-cover mr-4"
                          />
                          <div>
                            <h4 className="font-semibold text-gray-900">{testimonial.author}</h4>
                            <p className="text-gray-600 text-sm">{testimonial.role}</p>
                          </div>
                        </div>
                        <p className="text-gray-700 italic mb-4">
                          &ldquo;{testimonial.content}&rdquo;
                        </p>
                        <div className="flex text-yellow-400">
                          {[...Array(5)].map((_, i) => (
                            <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                            </svg>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Payment Service Trust & Evidence Section - Only for payment service */}
      {service.slug === 'thanh-toan-ho-trung-quoc' && (
        <section className="section-padding bg-gradient-to-br from-green-50 via-white to-blue-50">
          <div className="container-max">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                  💬 Minh chứng thực tế từ khách hàng
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  Hàng nghìn giao dịch thành công, khách hàng tin tưởng và đồng hành cùng TBS GROUP
                </p>
              </div>

              {/* Customer Testimonials for Payment Service */}
              {service.testimonials && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                  {service.testimonials.map((testimonial, index) => (
                    <div key={index} className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
                      <div className="flex items-start mb-6">
                        <Image 
                          src={index === 0 
                            ? "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&h=60&fit=crop&crop=face"
                            : "https://images.unsplash.com/photo-1494790108755-2616b612b169?w=60&h=60&fit=crop&crop=face"
                          }
                          alt={testimonial.author}
                          width={60}
                          height={60}
                                                     className="w-16 h-16 rounded-full object-cover mr-4"
                        />
                        <div className="flex-1">
                          <h4 className="font-bold text-gray-900 text-lg">{testimonial.author}</h4>
                          <p className="text-gray-600 text-sm">{testimonial.role}</p>
                          <div className="flex text-yellow-400 mt-2">
                            {[...Array(5)].map((_, i) => (
                              <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                              </svg>
                            ))}
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-700 italic text-lg leading-relaxed mb-4">
                        &ldquo;{testimonial.content}&rdquo;
                      </p>
                      <div className="flex items-center text-green-600 text-sm font-semibold">
                        <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                        Giao dịch thành công 100%
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Payment Method Icons */}
              <div className="bg-white p-8 rounded-2xl shadow-lg">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                  💳 Hỗ trợ đa phương thức thanh toán
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-6 bg-green-50 rounded-xl">
                    <div className="text-4xl mb-4">💬</div>
                    <h4 className="font-bold text-gray-900 mb-2">WeChat Pay</h4>
                    <p className="text-gray-600 text-sm">Phổ biến nhất tại TQ<br/>Chuyển tiền tức thì</p>
                  </div>
                  <div className="text-center p-6 bg-blue-50 rounded-xl">
                    <div className="text-4xl mb-4">🅰️</div>
                    <h4 className="font-bold text-gray-900 mb-2">Alipay</h4>
                    <p className="text-gray-600 text-sm">An toàn, bảo mật cao<br/>Nhiều NCC sử dụng</p>
                  </div>
                  <div className="text-center p-6 bg-purple-50 rounded-xl">
                    <div className="text-4xl mb-4">🏦</div>
                    <h4 className="font-bold text-gray-900 mb-2">Bank Transfer</h4>
                    <p className="text-gray-600 text-sm">Truyền thống, uy tín<br/>Số tiền lớn an toàn</p>
                  </div>
                </div>
              </div>

              {/* Security Features */}
              <div className="mt-12 bg-gradient-to-r from-indigo-900 via-purple-900 to-pink-900 p-8 rounded-3xl shadow-2xl text-white">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold mb-4">🔒 Hệ thống bảo mật đa lớp</h3>
                  <p className="text-indigo-200 max-w-3xl mx-auto">
                    Cam kết bảo vệ tuyệt đối thông tin và tài sản của khách hàng
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20">
                    <div className="text-3xl mb-4">🛡️</div>
                    <h4 className="font-bold mb-2">Xác thực 2 lớp</h4>
                    <p className="text-sm text-gray-300">Kiểm tra kép mọi giao dịch</p>
                  </div>
                  
                  <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20">
                    <div className="text-3xl mb-4">📱</div>
                    <h4 className="font-bold mb-2">SMS xác nhận</h4>
                    <p className="text-sm text-gray-300">Thông báo realtime mọi bước</p>
                  </div>
                  
                  <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20">
                    <div className="text-3xl mb-4">💾</div>
                    <h4 className="font-bold mb-2">Lưu trữ nội bộ</h4>
                    <p className="text-sm text-gray-300">Không để thông tin trên cloud nước ngoài</p>
                  </div>
                  
                  <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20">
                    <div className="text-3xl mb-4">📋</div>
                    <h4 className="font-bold mb-2">Lưu chứng từ</h4>
                    <p className="text-sm text-gray-300">Đối chiếu dễ dàng khi cần</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Customs Process Table - Only for customs clearance service */}
      {service.slug === 'thong-quan-chung-tu' && service.customsProcess && (
        <section className="section-padding bg-gradient-to-br from-indigo-900 via-blue-900 to-purple-900 text-white">
          <div className="container-max">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                  📊 Quy trình thông quan minh bạch - Trách nhiệm rõ ràng
                </h2>
                <p className="text-lg text-blue-200 max-w-3xl mx-auto leading-relaxed">
                  Khách hàng theo dõi trạng thái real-time qua Zalo/email, nhận ảnh kiểm hóa (nếu có)
                </p>
              </div>

              {/* Process Table */}
              <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/20">
                        <th className="text-left py-4 px-6 font-bold text-yellow-300">Bước</th>
                        <th className="text-left py-4 px-6 font-bold text-yellow-300">Việc của TBS</th>
                        <th className="text-left py-4 px-6 font-bold text-yellow-300">Lợi ích cho khách</th>
                      </tr>
                    </thead>
                    <tbody>
                      {service.customsProcess.map((process, index) => (
                        <tr key={index} className="border-b border-white/10 hover:bg-white/5 transition-colors">
                          <td className="py-6 px-6">
                            <div className="flex items-center">
                              <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mr-4">
                                <span className="text-2xl">{process.icon}</span>
                              </div>
                              <div>
                                <div className="font-bold text-lg text-yellow-300">Bước {process.step}</div>
                              </div>
                            </div>
                          </td>
                          <td className="py-6 px-6">
                            <div className="space-y-2">
                              <h4 className="font-bold text-lg">{process.tbsTask}</h4>
                              <p className="text-blue-200 text-sm leading-relaxed">{process.tbsDetail}</p>
                            </div>
                          </td>
                          <td className="py-6 px-6">
                            <div className="bg-green-500/20 backdrop-blur-sm p-4 rounded-xl border border-green-400/30">
                              <p className="text-green-200 font-medium">{process.customerBenefit}</p>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Success Statistics */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-green-500/20 backdrop-blur-sm p-6 rounded-2xl border border-green-400/30 text-center">
                    <div className="text-3xl font-bold text-green-300 mb-2">99.9%</div>
                    <p className="text-green-200 text-sm">Tỷ lệ đậu lần đầu</p>
                  </div>
                  <div className="bg-blue-500/20 backdrop-blur-sm p-6 rounded-2xl border border-blue-400/30 text-center">
                    <div className="text-3xl font-bold text-blue-300 mb-2">3,200+</div>
                    <p className="text-blue-200 text-sm">Tờ khai/năm</p>
                  </div>
                  <div className="bg-purple-500/20 backdrop-blur-sm p-6 rounded-2xl border border-purple-400/30 text-center">
                    <div className="text-3xl font-bold text-purple-300 mb-2">0</div>
                    <p className="text-purple-200 text-sm">Sự cố phạt</p>
                  </div>
                </div>

                {/* Red Lane Solution */}
                <div className="mt-8 bg-red-500/20 backdrop-blur-sm p-6 rounded-2xl border border-red-400/30">
                  <div className="flex items-center mb-4">
                    <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center mr-3">
                      <span className="text-white font-bold">🔴</span>
                    </div>
                    <h3 className="text-xl font-bold text-red-300">Chuyên xử lý lô hàng &quot;màu đỏ&quot;</h3>
                  </div>
                  <p className="text-red-200 leading-relaxed">
                    <strong>Tư vấn &quot;lối thoát&quot; cho lô hàng màu đỏ:</strong> Đội ngũ cựu cán bộ hải quan với kinh nghiệm thực chiến 15+ năm, 
                    đã giúp hàng trăm khách hàng xử lý thành công các case khó: trị giá tính thuế, tự vệ thương mại, kiểm tra chuyên ngành...
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Quick Quote Form & Tooltips - For packaging, warehouse, payment and customs services */}
      {(service.slug === 'dong-goi-bao-hiem-hang' || service.slug === 'kho-bai-trung-viet' || service.slug === 'thanh-toan-ho-trung-quoc' || service.slug === 'thong-quan-chung-tu') && service.quickQuoteForm && (
        <section className="section-padding bg-gradient-to-br from-orange-50 via-yellow-50 to-red-50">
          <div className="container-max">
            <div className="max-w-6xl mx-auto">
              <div className="bg-white p-8 rounded-3xl shadow-2xl">
                <div className="text-center mb-8">
                  <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                    {service.slug === 'dong-goi-bao-hiem-hang' 
                      ? '📋 Báo giá nhanh đóng gói & bảo hiểm'
                      : service.slug === 'kho-bai-trung-viet'
                      ? '🏭 Báo giá nhanh thuê kho bãi & WMS'
                      : service.slug === 'thanh-toan-ho-trung-quoc'
                      ? '💰 Tư vấn tỷ giá & thanh toán an toàn'
                      : '📋 Báo giá nhanh thông quan & chứng từ'
                    }
                  </h2>
                  <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
                    {service.quickQuoteForm.title}
                  </p>
                </div>

                {/* Quick Quote Form */}
                <div className="bg-gradient-to-r from-blue-50 to-green-50 p-8 rounded-2xl mb-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                    {service.quickQuoteForm.fields.map((field, index) => (
                      <div key={index}>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {field.label} {field.required && <span className="text-red-500">*</span>}
                        </label>
                        {field.type === 'select' ? (
                          <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
                            <option value="">Chọn {field.label.toLowerCase()}</option>
                            {field.options?.map((option, optIndex) => (
                              <option key={optIndex} value={option}>{option}</option>
                            ))}
                          </select>
                        ) : (
                          <input 
                            type={field.type}
                            placeholder={`Nhập ${field.label.toLowerCase()}`}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="text-center">
                    <button className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-12 py-4 rounded-2xl font-bold text-lg hover:from-orange-600 hover:to-red-600 transition-all duration-300 transform hover:scale-105 shadow-lg">
                      🚀 {service.quickQuoteForm.submitText}
                    </button>
                    <p className="text-sm text-gray-600 mt-4">
                      ⚡ {service.quickQuoteForm.note}
                    </p>
                  </div>
                </div>

                {/* Tooltips Section */}
                {service.tooltips && (
                  <div className="bg-blue-50 p-6 rounded-xl mb-8">
                    <h4 className="font-bold text-gray-900 mb-4">💡 Giải thích thuật ngữ:</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {service.tooltips.map((tooltip, index) => (
                        <div key={index} className="bg-white p-4 rounded-lg">
                          <h5 className="font-semibold text-gray-900 mb-2">{tooltip.term}</h5>
                          <p className="text-gray-600 text-sm">{tooltip.definition}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Help Resources */}
                {service.helpResources && (
                  <div className="bg-green-50 p-6 rounded-xl">
                    <h4 className="font-bold text-gray-900 mb-4">📚 Tài liệu hỗ trợ:</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {service.helpResources.map((resource, index) => (
                        <a 
                          key={index}
                          href={resource.url}
                          className="block p-4 bg-white rounded-lg hover:shadow-lg transition-all duration-300 group"
                        >
                          <div className="flex items-center mb-2">
                            <span className="text-2xl mr-3">
                              {resource.type === 'guide' ? '📖' : 
                               resource.type === 'video' ? '🎥' : '❓'}
                            </span>
                            <span className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                              {resource.title}
                            </span>
                          </div>
                          <div className="text-right">
                            <span className="text-primary-600 text-sm group-hover:underline">
                              Xem chi tiết →
                            </span>
                          </div>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

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