import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import BackToTop from '@/components/BackToTop'
import MessengerButton from '@/components/MessengerButton'
import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Giới thiệu TBS GROUP - Dịch vụ nhập khẩu Trung Quốc uy tín',
  description: 'TBS GROUP với 8+ năm kinh nghiệm trong lĩnh vực nhập khẩu từ Trung Quốc. Đội ngũ chuyên nghiệp, quy trình minh bạch, cam kết chất lượng dịch vụ tốt nhất.',
  keywords: 'TBS GROUP, giới thiệu, nhập khẩu trung quốc, dịch vụ logistics, kinh nghiệm'
}

export default function AboutPage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="section-padding bg-gradient-to-br from-primary-50 to-white">
        <div className="container-max">
          <div className="text-center mb-16">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Về TBS GROUP
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Đơn vị hàng đầu trong lĩnh vực dịch vụ nhập khẩu và logistics tại Việt Nam với hơn 8 năm kinh nghiệm
            </p>
          </div>
        </div>
      </section>

      {/* Company Stats */}
      <section className="section-padding bg-white">
        <div className="container-max">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="card hover:shadow-lg transition-all">
              <div className="text-4xl font-bold text-primary-600 mb-2">8+</div>
              <div className="text-gray-600">Năm kinh nghiệm</div>
            </div>
            <div className="card hover:shadow-lg transition-all">
              <div className="text-4xl font-bold text-primary-600 mb-2">8000+</div>
              <div className="text-gray-600">Khách hàng tin tưởng</div>
            </div>
            <div className="card hover:shadow-lg transition-all">
              <div className="text-4xl font-bold text-primary-600 mb-2">200K+</div>
              <div className="text-gray-600">Đơn hàng thành công</div>
            </div>
            <div className="card hover:shadow-lg transition-all">
              <div className="text-4xl font-bold text-primary-600 mb-2">24/7</div>
              <div className="text-gray-600">Hỗ trợ khách hàng</div>
            </div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="section-padding bg-gray-50">
        <div className="container-max">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Câu chuyện của chúng tôi
            </h2>
            <div className="space-y-6 text-lg text-gray-700 leading-relaxed">
              <p>
                TBS GROUP được thành lập với sứ mệnh đơn giản nhưng quan trọng: Mang đến cho các doanh nghiệp 
                Việt Nam dịch vụ nhập khẩu từ Trung Quốc minh bạch, uy tín và hiệu quả nhất.
              </p>
              <p>
                Với hơn 8 năm kinh nghiệm trong lĩnh vực xuất nhập khẩu, chúng tôi hiểu rõ những thách thức 
                mà doanh nghiệp phải đối mặt khi nhập khẩu hàng hóa từ Trung Quốc. Từ đó, TBS GROUP không ngừng 
                phát triển và hoàn thiện dịch vụ để trở thành đối tác tin cậy của hàng nghìn khách hàng.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="section-padding bg-white">
        <div className="container-max">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
            Giá trị cốt lõi
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🤝</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Uy tín</h3>
              <p className="text-gray-600">
                Cam kết thực hiện đúng những gì đã hứa với khách hàng, minh bạch trong mọi giao dịch
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Chuyên nghiệp</h3>
              <p className="text-gray-600">
                Đội ngũ có kinh nghiệm lâu năm, quy trình chuẩn hóa, đảm bảo chất lượng dịch vụ
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💡</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Sáng tạo</h3>
              <p className="text-gray-600">
                Liên tục cải tiến và áp dụng công nghệ mới để nâng cao trải nghiệm khách hàng
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-primary-600">
        <div className="container-max text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Sẵn sàng hợp tác cùng chúng tôi?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Liên hệ ngay để được tư vấn miễn phí về nhu cầu nhập khẩu của bạn
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/lien-he" className="bg-white text-primary-600 hover:bg-gray-100 font-medium py-3 px-6 rounded-lg transition-colors">
              Liên hệ ngay
            </Link>
            <a href="tel:+84976005335" className="border-2 border-white text-white hover:bg-white hover:text-primary-600 font-medium py-3 px-6 rounded-lg transition-colors">
              Hotline: 0976 005 335
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