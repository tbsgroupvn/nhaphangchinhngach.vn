import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import landingData from '@/data/landing-data.json';
import LandingForm from '@/components/LandingForm';
import ZaloChatBubble from '@/components/ZaloChatBubble';

export const metadata: Metadata = {
  title: 'Nhập khẩu chính ngạch an toàn - TBS GROUP | Minh bạch thuế VAT',
  description: 'Dịch vụ nhập khẩu chính ngạch uy tín 8+ năm kinh nghiệm. Minh bạch chi phí, thời gian 10-18 ngày, 100% hóa đơn VAT. Báo giá miễn phí 15 phút.',
  keywords: 'nhập khẩu chính ngạch, nhập hàng Trung Quốc, thuế VAT, thông quan, TBS GROUP',
  openGraph: {
    title: 'Nhập khẩu chính ngạch an toàn - TBS GROUP',
    description: 'Dịch vụ nhập khẩu chính ngạch uy tín với 8+ năm kinh nghiệm. Minh bạch chi phí, đúng hạn, 100% hóa đơn VAT.',
    type: 'website',
    locale: 'vi_VN',
  },
};

export default function LandingPage() {
  const { stats, benefits, testimonials, process, guarantees, caseStudy, mediaContent, responseGuarantee } = landingData;

  return (
    <div className="min-h-screen bg-white">
      {/* GTM Container - Placeholder for tracking */}
      {/* <!-- Google Tag Manager (noscript) --> */}
      {/* <!-- Meta Pixel Code --> */}

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative container mx-auto px-4 py-16 lg:py-24">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-6">
              <span className="inline-block px-4 py-2 bg-yellow-400 text-blue-900 font-semibold rounded-full text-sm mb-4">
                🛡️ An toàn & Minh bạch
              </span>
            </div>
            
            <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
              Nhập khẩu chính ngạch
              <span className="block text-yellow-400">an toàn</span>
            </h1>
            
            <p className="text-xl lg:text-2xl mb-8 font-medium opacity-90">
              Không phí ẩn – Thuế, vận chuyển minh bạch
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <a
                href="#form"
                className="bg-yellow-400 hover:bg-yellow-500 text-blue-900 font-bold py-4 px-8 rounded-full text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                📋 Nhận báo giá 15 phút
              </a>
              <a
                href="#process"
                className="border-2 border-white text-white hover:bg-white hover:text-blue-900 font-semibold py-4 px-8 rounded-full text-lg transition-all duration-300"
              >
                Xem quy trình
              </a>
            </div>

            {/* Hero Visual */}
            <div className="relative mt-12">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 inline-block">
                <div className="flex items-center gap-4 flex-wrap justify-center">
                  <span className="text-2xl">🚛</span>
                  <span className="text-lg">→</span>
                  <span className="text-2xl">🛃</span>
                  <span className="text-lg">→</span>
                  <span className="text-2xl">✅</span>
                  <span className="text-lg">→</span>
                  <span className="text-2xl">🏪</span>
                </div>
                <p className="text-sm mt-2 opacity-80">Vận chuyển → Thông quan → Hoàn tất → Giao hàng</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Stats */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl mb-2">{stat.icon}</div>
                <div className="text-3xl lg:text-4xl font-bold text-blue-600 mb-1">
                  {stat.number}
                </div>
                <div className="text-gray-600 text-sm font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Case Study Section */}
      <section className="py-16 bg-gradient-to-r from-green-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <span className="inline-block px-4 py-2 bg-green-100 text-green-800 font-semibold rounded-full text-sm mb-4">
                📊 {caseStudy.title}
              </span>
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">
                Tiết kiệm 68% chi phí thuế nhờ khai chuẩn HS Code
              </h2>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-8 lg:p-12">
              <div className="grid lg:grid-cols-2 gap-8 items-center">
                {/* Before/After Content */}
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-6">{caseStudy.company}</h3>
                  
                  {/* Before */}
                  <div className="mb-6 p-4 bg-red-50 rounded-lg border-l-4 border-red-400">
                    <div className="flex items-start gap-3">
                      <span className="text-red-500 text-xl">❌</span>
                      <div>
                        <h4 className="font-semibold text-red-800 mb-1">Trước khi dùng TBS:</h4>
                        <p className="text-red-700 text-sm">{caseStudy.problem}</p>
                        <p className="font-bold text-red-800 mt-2">💸 Mất: 120 triệu VNĐ</p>
                      </div>
                    </div>
                  </div>

                  {/* After */}
                  <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-400">
                    <div className="flex items-start gap-3">
                      <span className="text-green-500 text-xl">✅</span>
                      <div>
                        <h4 className="font-semibold text-green-800 mb-1">Sau khi chuyển TBS:</h4>
                        <p className="text-green-700 text-sm">{caseStudy.solution}</p>
                        <p className="font-bold text-green-800 mt-2">💰 Chỉ: 38 triệu VNĐ</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Savings Highlight */}
                <div className="text-center lg:text-left">
                  <div className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl p-8 text-white">
                    <div className="text-4xl lg:text-6xl font-bold mb-2">68%</div>
                    <div className="text-lg font-semibold mb-4">Tiết kiệm chi phí</div>
                    <div className="text-2xl font-bold border-t border-white/30 pt-4">
                      {caseStudy.savings}
                    </div>
                    <div className="text-sm opacity-90 mt-2">{caseStudy.timeframe}</div>
                  </div>
                  
                  <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600 italic">
                      &quot;Chuyển sang chính ngạch với TBS là quyết định đúng đắn nhất!&quot;
                    </p>
                    <p className="text-xs text-gray-500 mt-1">- Giám đốc Công ty X</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Vì sao chọn chính ngạch với TBS?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Giải pháp nhập khẩu an toàn, minh bạch và tiết kiệm nhất cho doanh nghiệp
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-blue-200 group"
              >
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {benefit.title}
                </h3>
                <p className="text-gray-600 mb-4">
                  {benefit.description}
                </p>
                <p className="text-sm text-blue-600 font-medium">
                  {benefit.details}
                </p>
              </div>
            ))}
          </div>

          {/* Real Media Section */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-3xl p-8 lg:p-12">
            <div className="text-center mb-8">
              <span className="inline-block px-4 py-2 bg-blue-100 text-blue-800 font-semibold rounded-full text-sm mb-4">
                🎥 Hậu trường thực tế
              </span>
              <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
                Xem quy trình đóng container thực tế tại TBS
              </h3>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Không phải hình ảnh stock - Đây là video thực tế 15 giây cho thấy độ chuyên nghiệp của chúng tôi
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8 items-center">
              {/* Video Player */}
              <div className="relative">
                <div className="relative bg-black rounded-2xl overflow-hidden shadow-2xl">
                  <Image
                    src={mediaContent.video.thumbnail}
                    alt={mediaContent.video.alt}
                    width={600}
                    height={400}
                    className="w-full h-64 lg:h-80 object-cover"
                    loading="lazy"
                  />
                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40 transition-all duration-300 cursor-pointer group">
                    <div className="bg-white/90 hover:bg-white rounded-full p-6 group-hover:scale-110 transition-all duration-300">
                      <svg className="w-8 h-8 text-blue-600 ml-1" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                    </div>
                  </div>
                  {/* Duration Badge */}
                  <div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-medium">
                    {mediaContent.video.duration}
                  </div>
                </div>
                <p className="text-center text-sm text-gray-500 mt-3">
                  🎬 Video thực tế - không dàn dựng
                </p>
              </div>

              {/* Real Stats */}
              <div>
                <div className="grid grid-cols-2 gap-6 mb-8">
                  <div className="text-center p-6 bg-white rounded-xl shadow-md">
                    <div className="text-3xl font-bold text-blue-600 mb-2">100%</div>
                    <div className="text-sm text-gray-600">Quy trình thực tế</div>
                    <div className="text-xs text-gray-500 mt-1">Không stock image</div>
                  </div>
                  <div className="text-center p-6 bg-white rounded-xl shadow-md">
                    <div className="text-3xl font-bold text-green-600 mb-2">15s</div>
                    <div className="text-sm text-gray-600">Video ngắn gọn</div>
                    <div className="text-xs text-gray-500 mt-1">Xem nhanh, hiểu rõ</div>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-md">
                  <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <span className="text-xl">📋</span>
                    Trong video bạn sẽ thấy:
                  </h4>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-center gap-2">
                      <span className="text-green-500">✓</span>
                      Nhân viên TBS kiểm tra hàng hóa tỉ mỉ
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-green-500">✓</span>
                      Quy trình đóng gói chuyên nghiệp
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-green-500">✓</span>
                      Container được seal an toàn
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-green-500">✓</span>
                      Cập nhật real-time cho khách hàng
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-blue-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Khách hàng nói gì về TBS?
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-center mb-6">
                  <Image
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    width={60}
                    height={60}
                    className="rounded-full mr-4 object-cover"
                    loading="lazy"
                  />
                  <div>
                    <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600">{testimonial.company}</p>
                  </div>
                </div>
                <p className="text-gray-700 italic leading-relaxed">
                  &quot;{testimonial.content}&quot;
                </p>
                <div className="flex text-yellow-400 mt-4">
                  {'★'.repeat(5)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Timeline */}
      <section id="process" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Quy trình 4 bước đơn giản
            </h2>
            <p className="text-xl text-gray-600">
              Từ yêu cầu đến nhận hàng, chỉ 10-18 ngày
            </p>
          </div>

          {/* Desktop Timeline */}
          <div className="hidden lg:block max-w-6xl mx-auto">
            <div className="relative">
              <div className="absolute top-1/2 left-0 right-0 h-1 bg-blue-200 transform -translate-y-1/2"></div>
              <div className="grid grid-cols-4 gap-8">
                {process.map((step, index) => (
                  <div key={index} className="relative text-center">
                    <div className="bg-blue-600 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4 relative z-10">
                      {step.step}
                    </div>
                    <div className="text-2xl mb-2">{step.icon}</div>
                    <h3 className="font-bold text-gray-900 mb-2">{step.title}</h3>
                    <p className="text-sm text-gray-600">{step.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Mobile Timeline */}
          <div className="lg:hidden max-w-md mx-auto">
            {process.map((step, index) => (
              <div key={index} className="relative flex items-start mb-8 last:mb-0">
                <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold mr-4 flex-shrink-0">
                  {step.step}
                </div>
                <div className="flex-1">
                  <div className="text-xl mb-1">{step.icon}</div>
                  <h3 className="font-bold text-gray-900 mb-1">{step.title}</h3>
                  <p className="text-sm text-gray-600">{step.description}</p>
                </div>
                {index < process.length - 1 && (
                  <div className="absolute left-6 top-12 bottom-0 w-px bg-blue-200 transform -translate-x-1/2"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lead Form Section */}
      <section id="form" className="py-16 bg-gradient-to-br from-blue-800 via-blue-700 to-blue-600 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Nhận báo giá miễn phí ngay!
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Chỉ 15 phút để có báo giá chi tiết và tư vấn miễn phí
            </p>
            
            <LandingForm />
          </div>
        </div>
      </section>

      {/* Guarantees */}
      <section className="py-16 bg-green-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Cam kết & Bảo chứng
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {guarantees.map((guarantee, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 text-center"
              >
                <div className="text-4xl text-green-600 mb-4">✓</div>
                <h3 className="font-bold text-gray-900 mb-2">
                  {guarantee.title}
                </h3>
                <p className="text-gray-600">
                  {guarantee.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mini Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <div className="font-bold text-xl mb-2">TBS GROUP</div>
              <p className="text-gray-400 text-sm">Nhập khẩu chính ngạch an toàn & minh bạch</p>
            </div>
            
            <div className="flex items-center gap-6">
              <a
                href="tel:+84123456789"
                className="flex items-center gap-2 text-yellow-400 hover:text-yellow-300 transition-colors"
              >
                📞 Hotline: (028) 1234 5678
              </a>
              <a
                href="https://zalo.me/tbsgroup"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
              >
                💬 Chat Zalo
              </a>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-6 pt-6 text-center text-sm text-gray-400">
            <div className="flex flex-wrap justify-center gap-4 mb-4">
              <Link href="/chinh-sach/dieu-khoan" className="hover:text-white transition-colors">
                Điều khoản
              </Link>
              <Link href="/chinh-sach/cookie" className="hover:text-white transition-colors">
                Cookie
              </Link>
              <Link href="/chinh-sach" className="hover:text-white transition-colors">
                Chính sách
              </Link>
            </div>
            <p>&copy; 2024 TBS GROUP. Tất cả quyền được bảo lưu.</p>
          </div>
        </div>
      </footer>

      {/* Fixed Elements */}
      <ZaloChatBubble />
      
      {/* Mobile Call Button */}
      <div className="fixed bottom-4 left-4 sm:hidden z-40">
        <a
          href="tel:+84123456789"
          className="bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg transition-all duration-300 flex items-center gap-2"
        >
          <span className="text-xl">📞</span>
          <span className="text-sm font-medium">Gọi ngay</span>
        </a>
      </div>
    </div>
  );
} 