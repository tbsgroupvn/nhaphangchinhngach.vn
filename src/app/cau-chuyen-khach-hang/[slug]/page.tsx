import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import BackToTop from '@/components/BackToTop'
import MessengerButton from '@/components/MessengerButton'
import Link from 'next/link'
import { customerStories } from '@/data/customerStories'

interface Props {
  params: {
    slug: string
  }
}

export async function generateStaticParams() {
  return customerStories.map((story) => ({
    slug: story.slug,
  }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const story = customerStories.find(s => s.slug === params.slug)
  
  if (!story) {
    return {
      title: 'Câu chuyện không tìm thấy - TBS GROUP'
    }
  }

  return {
    title: `${story.title} - TBS GROUP`,
    description: story.summary,
    keywords: `case study, success story, ${story.industry}, TBS GROUP`
  }
}

export default function CustomerStoryDetailPage({ params }: Props) {
  const story = customerStories.find(s => s.slug === params.slug)

  if (!story) {
    notFound()
  }

  return (
    <main className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="section-padding bg-gradient-to-br from-primary-50 to-white">
        <div className="container-max">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <span className="inline-block px-4 py-2 bg-primary-100 text-primary-800 rounded-full text-sm font-medium">
                {story.category}
              </span>
              <span className="inline-block px-4 py-2 bg-gray-100 text-gray-600 rounded-full text-sm">
                {story.industry}
              </span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              {story.title}
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              {story.summary}
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary-600">{story.timeline}</div>
                <div className="text-sm text-gray-600">Thời gian</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary-600">{story.orderValue}</div>
                <div className="text-sm text-gray-600">Giá trị đơn hàng</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary-600">{story.productTypes.length}</div>
                <div className="text-sm text-gray-600">Loại sản phẩm</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary-600">98%</div>
                <div className="text-sm text-gray-600">Hài lòng</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Story Content */}
      <section className="section-padding bg-white">
        <div className="container-max">
          <div className="max-w-4xl mx-auto">
            <div className="prose prose-lg max-w-none">
              <h2>Thách thức</h2>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{story.challenge.title}</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                {story.challenge.description}
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                {story.challenge.painPoints.map((point, index) => (
                  <li key={index}>{point}</li>
                ))}
              </ul>
              
              <h2>Giải pháp của TBS GROUP</h2>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{story.solution.title}</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                {story.solution.description}
              </p>
              <div className="mb-4">
                <h4 className="font-semibold text-gray-900 mb-2">Phương pháp tiếp cận:</h4>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  {story.solution.approach.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Dịch vụ chính:</h4>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  {story.solution.keyServices.map((service, index) => (
                    <li key={index}>{service}</li>
                  ))}
                </ul>
              </div>
              
              <h2>Kết quả đạt được</h2>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{story.results.title}</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                {story.results.description}
              </p>
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-3">Thành tựu đạt được:</h4>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  {story.results.achievements.map((achievement, index) => (
                    <li key={index}>{achievement}</li>
                  ))}
                </ul>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {story.results.metrics.map((metric, index) => (
                  <div key={index} className="card text-center">
                    <div className="text-2xl font-bold text-primary-600 mb-1">{metric.value}</div>
                    <div className="text-sm text-gray-600">{metric.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products */}
      <section className="section-padding bg-gray-50">
        <div className="container-max">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Sản phẩm đã nhập khẩu
            </h2>
            <div className="flex flex-wrap gap-3 justify-center">
              {story.productTypes.map((product, index) => (
                <span key={index} className="inline-block px-4 py-2 bg-white text-gray-700 rounded-lg shadow-sm">
                  {product}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="section-padding bg-white">
        <div className="container-max">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              Khách hàng nói gì
            </h2>
            <div className="card max-w-2xl mx-auto">
              <blockquote className="text-lg text-gray-700 italic leading-relaxed mb-6 border-l-4 border-primary-500 pl-6">
                &ldquo;{story.testimonial.quote}&rdquo;
              </blockquote>
              <div className="text-center">
                <div className="font-semibold text-gray-900 mb-1">
                  {story.testimonial.author}
                </div>
                <div className="text-sm text-gray-500">
                  {story.testimonial.position}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-primary-600">
        <div className="container-max text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Bạn cũng muốn có câu chuyện thành công như vậy?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Liên hệ ngay để TBS GROUP tư vấn giải pháp nhập khẩu tối ưu cho doanh nghiệp bạn
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/lien-he" className="bg-white text-primary-600 hover:bg-gray-100 font-medium py-3 px-6 rounded-lg transition-colors">
              Tư vấn miễn phí
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