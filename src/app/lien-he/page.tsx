import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import BackToTop from '@/components/BackToTop'
import MessengerButton from '@/components/MessengerButton'
import ContactForm from '@/components/ContactForm'
import GoogleMaps from '@/components/GoogleMaps'
import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Liên hệ TBS GROUP - Tư vấn miễn phí dịch vụ nhập khẩu Trung Quốc',
  description: 'Liên hệ TBS GROUP để được tư vấn miễn phí về dịch vụ nhập khẩu từ Trung Quốc. Hotline: 0976 005 335, Email: info@xuatnhapkhautbs.vn',
  keywords: 'liên hệ TBS GROUP, tư vấn nhập khẩu, hotline, địa chỉ văn phòng'
}

export default function ContactPage() {
  const contactMethods = [
    {
      icon: "📞",
      title: "Hotline 24/7",
      description: "Hỗ trợ nhanh chóng",
      value: "0976 005 335",
      href: "tel:+84976005335",
      color: "from-orange-500 to-red-500"
    },
    {
      icon: "✉️",
      title: "Email",
      description: "Gửi yêu cầu hỗ trợ",
      value: "info@xuatnhapkhautbs.vn",
      href: "mailto:info@xuatnhapkhautbs.vn",
      color: "from-blue-500 to-indigo-600"
    },
    {
      icon: "💬",
      title: "Zalo Chat",
      description: "Chat trực tiếp",
      value: "Chat ngay",
      href: "https://zalo.me/0976005335",
      color: "from-green-500 to-emerald-600"
    },
    {
      icon: "📘",
      title: "Facebook",
      description: "Fanpage chính thức",
      value: "Nhắn tin ngay",
      href: "https://www.facebook.com/messages/t/964583050381612",
      color: "from-blue-600 to-blue-700"
    }
  ]





  return (
    <main className="min-h-screen">
      <Navbar />
      
      {/* Breadcrumb */}
      <section className="bg-gray-50 py-3">
        <div className="container-max">
          <nav className="flex items-center space-x-2 text-sm">
            <Link href="/" className="text-gray-500 hover:text-primary-600 transition-colors">
              Trang chủ
            </Link>
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-gray-900 font-medium">Liên hệ</span>
          </nav>
        </div>
      </section>

      {/* Hero Section - Thu gọn */}
      <section className="py-12 md:py-16 bg-gradient-to-br from-primary-50 via-white to-blue-50 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 left-10 w-20 h-20 bg-primary-600 rounded-full animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-16 h-16 bg-blue-400 rounded-full animate-bounce"></div>
        </div>
        
        <div className="container-max text-center relative z-10">
          <div className="max-w-3xl mx-auto">
            <div className="inline-block p-3 bg-white rounded-xl shadow-lg mb-4">
              <span className="text-4xl">📞</span>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Liên hệ với TBS GROUP
            </h1>
            <p className="text-lg text-gray-600 mb-6">
              Đội ngũ tư vấn chuyên nghiệp sẵn sàng hỗ trợ bạn 24/7
            </p>

            {/* Quick Stats - Compact */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
              <div className="bg-primary-600 rounded-lg p-3 text-white">
                <div className="text-2xl font-bold">24/7</div>
                <div className="text-xs opacity-90">Hỗ trợ</div>
              </div>
              <div className="bg-primary-600 rounded-lg p-3 text-white">
                <div className="text-2xl font-bold">4</div>
                <div className="text-xs opacity-90">Kênh liên hệ</div>
              </div>
              <div className="bg-primary-600 rounded-lg p-3 text-white">
                <div className="text-2xl font-bold">100%</div>
                <div className="text-xs opacity-90">Miễn phí</div>
              </div>
              <div className="bg-primary-600 rounded-lg p-3 text-white">
                <div className="text-2xl font-bold">8+</div>
                <div className="text-xs opacity-90">Năm kinh nghiệm</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Contact Methods - Đồng nhất height */}
      <section className="py-12 bg-white">
        <div className="container-max">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Liên hệ nhanh</h2>
            <p className="text-gray-600">Chọn phương thức phù hợp nhất</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactMethods.map((method, index) => (
              <a
                key={index}
                href={method.href}
                target={method.href.startsWith('http') ? '_blank' : undefined}
                rel={method.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="group bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden hover:-translate-y-1 border border-gray-100 h-48"
              >
                <div className={`bg-gradient-to-r ${method.color} p-4 text-white h-20 flex items-center justify-center`}>
                  <div className="text-center">
                    <div className="text-2xl mb-1 group-hover:animate-bounce">{method.icon}</div>
                    <h3 className="text-sm font-semibold">{method.title}</h3>
                  </div>
                </div>
                
                <div className="p-4 h-28 flex flex-col justify-between">
                  <div>
                    <p className="text-xs text-gray-600 mb-2">{method.description}</p>
                    <p className="font-medium text-gray-900 text-sm">
                      {method.value}
                    </p>
                  </div>
                  
                  <div className="flex items-center text-primary-600 text-xs font-medium mt-2">
                    {method.title === "Giờ làm việc" ? "Chi tiết" : "Liên hệ"}
                    {method.title !== "Giờ làm việc" && (
                      <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    )}
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form - Đăng ký tư vấn miễn phí */}
      <section className="py-12 bg-gray-50">
        <div className="container-max">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="text-center mb-8">
                <div className="inline-block p-3 bg-primary-100 rounded-lg mb-4">
                  <span className="text-3xl">📝</span>
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-3">
                  Đăng ký tư vấn miễn phí
                </h2>
                <p className="text-gray-600 mb-2">
                  Chúng tôi sẽ liên hệ trong vòng <strong>30 phút</strong> để tư vấn chi tiết
                </p>
                <p className="text-sm text-green-600 font-medium">
                  🔒 Thông tin của bạn được bảo mật - Không bị làm phiền
                </p>
              </div>
              <ContactForm />
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="bg-gray-100">
        <GoogleMaps />
      </section>



      <Footer />
      <BackToTop />
      <MessengerButton />
    </main>
  )
} 