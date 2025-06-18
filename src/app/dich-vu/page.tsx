import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import BackToTop from '@/components/BackToTop'
import MessengerButton from '@/components/MessengerButton'
import Link from 'next/link'
import { Metadata } from 'next'
import { services } from '@/data/services'

export const metadata: Metadata = {
  title: 'Dịch vụ TBS GROUP - 11 Dịch vụ nhập khẩu Trung Quốc chuyên nghiệp',
  description: 'TBS GROUP cung cấp 11 dịch vụ chuyên nghiệp: Nhập khẩu chính ngạch, vận chuyển quốc tế, gom hàng lẻ, tư vấn pháp lý, kho bãi và nhiều dịch vụ khác.',
  keywords: 'dịch vụ nhập khẩu, nhập khẩu chính ngạch, vận chuyển quốc tế, gom hàng lẻ, TBS GROUP'
}

export default function ServicesPage() {
  const servicesByCategory = services.reduce((acc, service) => {
    const category = service.category
    if (!acc[category]) {
      acc[category] = []
    }
    acc[category].push(service)
    return acc
  }, {} as Record<string, typeof services>)

  const categoryNames = {
    import: 'Nhập khẩu',
    logistics: 'Logistics', 
    consulting: 'Tư vấn',
    support: 'Hỗ trợ'
  }

  const categoryColors = {
    import: 'from-blue-500 to-blue-600',
    logistics: 'from-green-500 to-green-600',
    consulting: 'from-purple-500 to-purple-600', 
    support: 'from-orange-500 to-orange-600'
  }

  return (
    <main className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="section-padding bg-gradient-to-br from-primary-50 to-white">
        <div className="container-max text-center">
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Dịch vụ TBS GROUP
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            11 dịch vụ chuyên nghiệp giúp doanh nghiệp nhập khẩu từ Trung Quốc hiệu quả và an toàn
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600">11</div>
              <div className="text-sm text-gray-600">Dịch vụ</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600">8000+</div>
              <div className="text-sm text-gray-600">Khách hàng</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600">200K+</div>
              <div className="text-sm text-gray-600">Đơn hàng</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600">24/7</div>
              <div className="text-sm text-gray-600">Hỗ trợ</div>
            </div>
          </div>
        </div>
      </section>

      {/* Services by Category */}
      {Object.entries(servicesByCategory).map(([category, categoryServices]) => (
        <section key={category} className="section-padding bg-white">
          <div className="container-max">
            <div className="text-center mb-12">
              <div className={`inline-block px-6 py-2 bg-gradient-to-r ${categoryColors[category as keyof typeof categoryColors]} text-white rounded-full text-sm font-medium mb-4`}>
                {categoryNames[category as keyof typeof categoryNames]}
              </div>
              <h2 className="text-3xl font-bold text-gray-900">
                Dịch vụ {categoryNames[category as keyof typeof categoryNames]}
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {categoryServices.map((service) => (
                <div key={service.slug} className="card hover:shadow-xl transition-all duration-300 group">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mr-4 group-hover:bg-primary-200 transition-colors">
                      <span className="text-2xl">{service.icon}</span>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                      {service.title}
                    </h3>
                  </div>
                  
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {service.description}
                  </p>
                  
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Lợi ích chính:</h4>
                    <ul className="space-y-2">
                      {service.benefits.slice(0, 3).map((benefit, index) => (
                        <li key={index} className="flex items-start text-sm text-gray-600">
                          <span className="text-green-500 mr-2 mt-1">✓</span>
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="mt-auto">
                    <Link 
                      href={`/dich-vu/${service.slug}`}
                      className="btn-primary text-center block"
                    >
                      {service.ctaText}
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      ))}

      {/* CTA Section */}
      <section className="section-padding bg-primary-600">
        <div className="container-max text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Cần tư vấn dịch vụ phù hợp?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Đội ngũ chuyên gia TBS GROUP sẵn sàng tư vấn miễn phí giải pháp nhập khẩu tối ưu cho doanh nghiệp bạn
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