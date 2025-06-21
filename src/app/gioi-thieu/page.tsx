import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import BackToTop from '@/components/BackToTop'
import MessengerButton from '@/components/MessengerButton'
import AnimatedCounter from '@/components/AnimatedCounter'
import Link from 'next/link'
import Image from 'next/image'
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
      
      {/* Hero Section with Company Image */}
      <section className="relative h-[70vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-900/90 to-primary-600/70 z-10"></div>
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')"
          }}
        ></div>
        
        <div className="relative z-20 text-center text-white px-4">
          <h1 className="text-5xl lg:text-7xl font-bold mb-6 animate-fade-in-up">
            TBS GROUP
          </h1>
          <p className="text-xl lg:text-2xl mb-8 max-w-4xl mx-auto animate-fade-in-up animation-delay-200">
            Đơn vị hàng đầu trong lĩnh vực dịch vụ nhập khẩu và logistics tại Việt Nam với hơn 8 năm kinh nghiệm
          </p>
          <div className="animate-fade-in-up animation-delay-400">
            <Link 
              href="#about" 
              className="inline-flex items-center px-8 py-4 bg-white text-primary-600 rounded-full hover:bg-gray-100 transition-all duration-300 hover:scale-105 shadow-lg"
            >
              <span className="font-semibold">Tìm hiểu thêm</span>
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Animated Company Stats */}
      <section className="section-padding bg-white" id="stats">
        <div className="container-max">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Những con số ấn tượng</h2>
            <p className="text-xl text-gray-600">Hành trình phát triển của TBS GROUP qua các con số</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center group">
              <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-2xl p-8 hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                <div className="text-5xl lg:text-6xl font-bold text-primary-600 mb-3">
                  <AnimatedCounter end={8} suffix="+" />
                </div>
                <div className="text-gray-700 font-medium">Năm kinh nghiệm</div>
                <div className="text-sm text-gray-500 mt-2">Phục vụ thị trường</div>
              </div>
            </div>
            
            <div className="text-center group">
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-8 hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                <div className="text-5xl lg:text-6xl font-bold text-green-600 mb-3">
                  <AnimatedCounter end={8000} suffix="+" />
                </div>
                <div className="text-gray-700 font-medium">Khách hàng</div>
                <div className="text-sm text-gray-500 mt-2">Tin tưởng sử dụng</div>
              </div>
            </div>
            
            <div className="text-center group">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8 hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                <div className="text-5xl lg:text-6xl font-bold text-blue-600 mb-3">
                  <AnimatedCounter end={200} suffix="K+" />
                </div>
                <div className="text-gray-700 font-medium">Đơn hàng</div>
                <div className="text-sm text-gray-500 mt-2">Hoàn thành thành công</div>
              </div>
            </div>
            
            <div className="text-center group">
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-8 hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                <div className="text-5xl lg:text-6xl font-bold text-orange-600 mb-3">
                  <AnimatedCounter end={24} suffix="/7" />
                </div>
                <div className="text-gray-700 font-medium">Hỗ trợ</div>
                <div className="text-sm text-gray-500 mt-2">Luôn sẵn sàng phục vụ</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Company Story with Image */}
      <section className="section-padding bg-gray-50" id="about">
        <div className="container-max">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1">
              <h2 className="text-4xl font-bold text-gray-900 mb-8">
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
                <p>
                  Ngày hôm nay, chúng tôi tự hào là một trong những đơn vị dẫn đầu trong lĩnh vực logistics và 
                  nhập khẩu, với đội ngũ chuyên nghiệp và hệ thống vận hành hiện đại.
                </p>
              </div>
              
              <div className="mt-8 flex flex-wrap gap-4">
                <div className="flex items-center bg-white px-4 py-2 rounded-full shadow-sm">
                  <span className="text-green-500 mr-2">✓</span>
                  <span className="text-sm font-medium">Uy tín hàng đầu</span>
                </div>
                <div className="flex items-center bg-white px-4 py-2 rounded-full shadow-sm">
                  <span className="text-green-500 mr-2">✓</span>
                  <span className="text-sm font-medium">Quy trình chuẩn hóa</span>
                </div>
                <div className="flex items-center bg-white px-4 py-2 rounded-full shadow-sm">
                  <span className="text-green-500 mr-2">✓</span>
                  <span className="text-sm font-medium">Hỗ trợ 24/7</span>
                </div>
              </div>
            </div>
            
            <div className="order-1 lg:order-2">
              <div className="relative">
                <div className="rounded-2xl overflow-hidden shadow-2xl">
                  <Image
                    src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=1026&q=80"
                    alt="TBS GROUP Office"
                    width={600}
                    height={400}
                    className="w-full h-auto"
                  />
                </div>
                <div className="absolute -bottom-6 -left-6 bg-primary-600 text-white p-6 rounded-xl shadow-xl">
                  <div className="text-2xl font-bold">
                    <AnimatedCounter end={8} suffix="+" />
                  </div>
                  <div className="text-sm opacity-90">Năm kinh nghiệm</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team & Office Gallery */}
      <section className="section-padding bg-white">
        <div className="container-max">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Đội ngũ & Văn phòng</h2>
            <p className="text-xl text-gray-600">Những con người tạo nên thành công của TBS GROUP</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Office Image */}
            <div className="group cursor-pointer">
              <div className="relative overflow-hidden rounded-2xl">
                <Image
                  src="https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1169&q=80"
                  alt="Văn phòng TBS GROUP"
                  width={400}
                  height={300}
                  className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="font-semibold">Văn phòng hiện đại</h3>
                    <p className="text-sm opacity-90">Không gian làm việc chuyên nghiệp</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Team Meeting */}
            <div className="group cursor-pointer">
              <div className="relative overflow-hidden rounded-2xl">
                <Image
                  src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80"
                  alt="Đội ngũ TBS GROUP"
                  width={400}
                  height={300}
                  className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="font-semibold">Đội ngũ chuyên nghiệp</h3>
                    <p className="text-sm opacity-90">Kinh nghiệm và tận tâm</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Operations */}
            <div className="group cursor-pointer">
              <div className="relative overflow-hidden rounded-2xl">
                <Image
                  src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80"
                  alt="Hoạt động vận hành"
                  width={400}
                  height={300}
                  className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="font-semibold">Vận hành logistics</h3>
                    <p className="text-sm opacity-90">Quy trình chuyên nghiệp</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Customer Service */}
            <div className="group cursor-pointer">
              <div className="relative overflow-hidden rounded-2xl">
                <Image
                  src="https://images.unsplash.com/photo-1556761175-b413da4baf72?ixlib=rb-4.0.3&auto=format&fit=crop&w=1074&q=80"
                  alt="Chăm sóc khách hàng"
                  width={400}
                  height={300}
                  className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="font-semibold">Chăm sóc khách hàng</h3>
                    <p className="text-sm opacity-90">Hỗ trợ tận tình 24/7</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Warehouse */}
            <div className="group cursor-pointer">
              <div className="relative overflow-hidden rounded-2xl">
                <Image
                  src="https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80"
                  alt="Kho bãi TBS GROUP"
                  width={400}
                  height={300}
                  className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="font-semibold">Hệ thống kho bãi</h3>
                    <p className="text-sm opacity-90">Hiện đại và an toàn</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Technology */}
            <div className="group cursor-pointer">
              <div className="relative overflow-hidden rounded-2xl">
                <Image
                  src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1215&q=80"
                  alt="Công nghệ TBS GROUP"
                  width={400}
                  height={300}
                  className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="font-semibold">Công nghệ hiện đại</h3>
                    <p className="text-sm opacity-90">Hệ thống quản lý thông minh</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="section-padding bg-gradient-to-br from-gray-50 to-primary-50">
        <div className="container-max">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Giá trị cốt lõi</h2>
            <p className="text-xl text-gray-600">Những nguyên tắc định hướng mọi hoạt động của chúng tôi</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 text-center hover:shadow-xl transition-all duration-300 group hover:-translate-y-2">
              <div className="w-20 h-20 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <span className="text-3xl">🤝</span>
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-gray-900">Uy tín</h3>
              <p className="text-gray-600 leading-relaxed">
                Cam kết thực hiện đúng những gì đã hứa với khách hàng, minh bạch trong mọi giao dịch và luôn đặt lợi ích khách hàng lên hàng đầu.
              </p>
            </div>
            
            <div className="bg-white rounded-2xl p-8 text-center hover:shadow-xl transition-all duration-300 group hover:-translate-y-2">
              <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <span className="text-3xl">⚡</span>
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-gray-900">Chuyên nghiệp</h3>
              <p className="text-gray-600 leading-relaxed">
                Đội ngũ có kinh nghiệm lâu năm, quy trình chuẩn hóa theo tiêu chuẩn quốc tế, đảm bảo chất lượng dịch vụ cao nhất.
              </p>
            </div>
            
            <div className="bg-white rounded-2xl p-8 text-center hover:shadow-xl transition-all duration-300 group hover:-translate-y-2">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <span className="text-3xl">💡</span>
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-gray-900">Sáng tạo</h3>
              <p className="text-gray-600 leading-relaxed">
                Liên tục cải tiến và áp dụng công nghệ mới để nâng cao trải nghiệm khách hàng và tối ưu hóa quy trình vận hành.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="section-padding bg-white">
        <div className="container-max">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-8">
                Tại sao chọn TBS GROUP?
              </h2>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-primary-600 font-bold text-lg">1</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Kinh nghiệm dày dặn</h3>
                    <p className="text-gray-600">Hơn 8 năm trong lĩnh vực xuất nhập khẩu với hàng nghìn dự án thành công.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 font-bold text-lg">2</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Mạng lưới rộng khắp</h3>
                    <p className="text-gray-600">Đối tác tin cậy tại Trung Quốc và hệ thống logistics toàn cầu.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-bold text-lg">3</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Công nghệ hiện đại</h3>
                    <p className="text-gray-600">Hệ thống quản lý và theo dõi đơn hàng thời gian thực 24/7.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                    <span className="text-orange-600 font-bold text-lg">4</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Đội ngũ chuyên nghiệp</h3>
                    <p className="text-gray-600">Đội ngũ tư vấn giàu kinh nghiệm và hỗ trợ khách hàng 24/7.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <Image
                  src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1084&q=80"
                  alt="Teamwork"
                  width={300}
                  height={200}
                  className="rounded-2xl w-full h-40 object-cover"
                />
                <Image
                  src="https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1074&q=80"
                  alt="Meeting"
                  width={300}
                  height={250}
                  className="rounded-2xl w-full h-48 object-cover"
                />
              </div>
              <div className="space-y-4 pt-8">
                <Image
                  src="https://images.unsplash.com/photo-1553028826-f4804a6dba3b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80"
                  alt="Logistics"
                  width={300}
                  height={250}
                  className="rounded-2xl w-full h-48 object-cover"
                />
                <Image
                  src="https://images.unsplash.com/photo-1556740738-b6a63e27c4df?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80"
                  alt="Technology"
                  width={300}
                  height={200}
                  className="rounded-2xl w-full h-40 object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-gradient-to-r from-primary-600 to-primary-700">
        <div className="container-max text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Sẵn sàng hợp tác cùng chúng tôi?
          </h2>
          <p className="text-xl text-primary-100 mb-10 max-w-3xl mx-auto">
            Liên hệ ngay để được tư vấn miễn phí về nhu cầu nhập khẩu của bạn. 
            Đội ngũ chuyên gia của chúng tôi luôn sẵn sàng hỗ trợ 24/7.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link 
              href="/lien-he" 
              className="bg-white text-primary-600 hover:bg-gray-100 font-semibold py-4 px-8 rounded-full transition-all duration-300 hover:scale-105 shadow-lg"
            >
              Liên hệ tư vấn miễn phí
            </Link>
            <a 
              href="tel:+84976005335" 
              className="border-2 border-white text-white hover:bg-white hover:text-primary-600 font-semibold py-4 px-8 rounded-full transition-all duration-300 hover:scale-105"
            >
              📞 Hotline: 0976 005 335
            </a>
          </div>
          
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl mb-2">⚡</div>
              <div className="text-white font-medium">Phản hồi nhanh</div>
              <div className="text-primary-200 text-sm">Trong vòng 30 phút</div>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">💡</div>
              <div className="text-white font-medium">Tư vấn miễn phí</div>
              <div className="text-primary-200 text-sm">Không có phí ẩn</div>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">🤝</div>
              <div className="text-white font-medium">Cam kết chất lượng</div>
              <div className="text-primary-200 text-sm">Dịch vụ tốt nhất</div>
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