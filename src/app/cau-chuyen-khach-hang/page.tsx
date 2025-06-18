import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import BackToTop from '@/components/BackToTop'
import MessengerButton from '@/components/MessengerButton'
import Link from 'next/link'
import { Metadata } from 'next'
import { customerStories } from '@/data/customerStories'

export const metadata: Metadata = {
  title: 'Câu chuyện khách hàng TBS GROUP - Success Stories và Case Studies',
  description: 'Khám phá những câu chuyện thành công của khách hàng TBS GROUP. Từ doanh nghiệp nhỏ đến công ty lớn, tất cả đều tin tưởng dịch vụ của chúng tôi.',
  keywords: 'câu chuyện khách hàng, success stories, case studies, TBS GROUP testimonials'
}

export default function CustomerStoriesPage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="section-padding bg-gradient-to-br from-primary-50 to-white">
        <div className="container-max text-center">
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Câu chuyện khách hàng
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Những câu chuyện thành công thực tế từ khách hàng tin tưởng và đồng hành cùng TBS GROUP
          </p>
          <div className="grid grid-cols-3 gap-6 max-w-md mx-auto">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600">8000+</div>
              <div className="text-sm text-gray-600">Khách hàng</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600">98%</div>
              <div className="text-sm text-gray-600">Hài lòng</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600">50+</div>
              <div className="text-sm text-gray-600">Case Studies</div>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Stories Grid */}
      <section className="section-padding bg-white">
        <div className="container-max">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {customerStories.map((story) => (
              <div key={story.slug} className="card hover:shadow-xl transition-all duration-300 group">
                <div className="flex items-center justify-between mb-4">
                  <span className="inline-block px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm font-medium">
                    {story.category}
                  </span>
                  <span className="inline-block px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                    {story.industry}
                  </span>
                </div>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-primary-600 transition-colors">
                  {story.title}
                </h3>
                
                <p className="text-gray-600 mb-4 leading-relaxed">
                  {story.summary}
                </p>
                
                <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                  <div>
                    <span className="text-gray-500">Thời gian:</span>
                    <div className="font-semibold text-primary-600">{story.timeline}</div>
                  </div>
                  <div>
                    <span className="text-gray-500">Giá trị:</span>
                    <div className="font-semibold text-primary-600">{story.orderValue}</div>
                  </div>
                </div>
                
                <div className="mb-6">
                  <div className="text-sm text-gray-500 mb-2">Sản phẩm:</div>
                  <div className="flex flex-wrap gap-1">
                    {story.productTypes.slice(0, 3).map((product, index) => (
                      <span key={index} className="inline-block px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                        {product}
                      </span>
                    ))}
                    {story.productTypes.length > 3 && (
                      <span className="inline-block px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                        +{story.productTypes.length - 3}
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="border-t pt-4">
                  <Link 
                    href={`/cau-chuyen-khach-hang/${story.slug}`}
                    className="btn-primary text-center block"
                  >
                    Đọc câu chuyện đầy đủ
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Summary */}
      <section className="section-padding bg-gray-50">
        <div className="container-max">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
            Khách hàng nói về chúng tôi
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="card text-center">
              <span className="text-4xl mb-4 block">⭐</span>
              <p className="text-gray-600 italic mb-4">
                &ldquo;Dịch vụ chuyên nghiệp, giá cả hợp lý. Đã hợp tác 3 năm và rất hài lòng.&rdquo;
              </p>
              <div className="font-semibold text-gray-900">Nguyễn Văn A</div>
              <div className="text-sm text-gray-500">CEO - Công ty ABC</div>
            </div>
            <div className="card text-center">
              <span className="text-4xl mb-4 block">🚀</span>
              <p className="text-gray-600 italic mb-4">
                &ldquo;TBS GROUP giúp chúng tôi mở rộng thị trường nhanh chóng và hiệu quả.&rdquo;
              </p>
              <div className="font-semibold text-gray-900">Trần Thị B</div>
              <div className="text-sm text-gray-500">Giám đốc - Công ty XYZ</div>
            </div>
            <div className="card text-center">
              <span className="text-4xl mb-4 block">💯</span>
              <p className="text-gray-600 italic mb-4">
                &ldquo;Quy trình minh bạch, thời gian giao hàng đúng hẹn. Rất đáng tin cậy.&rdquo;
              </p>
              <div className="font-semibold text-gray-900">Lê Văn C</div>
              <div className="text-sm text-gray-500">Owner - Cửa hàng DEF</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-primary-600">
        <div className="container-max text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Bạn muốn có câu chuyện thành công tiếp theo?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Hãy để TBS GROUP đồng hành cùng bạn tạo nên những thành tựu mới trong lĩnh vực nhập khẩu
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/lien-he" className="bg-white text-primary-600 hover:bg-gray-100 font-medium py-3 px-6 rounded-lg transition-colors">
              Bắt đầu hành trình
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