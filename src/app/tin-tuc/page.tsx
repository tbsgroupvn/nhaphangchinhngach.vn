import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import BackToTop from '@/components/BackToTop'
import MessengerButton from '@/components/MessengerButton'
import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Tin tức TBS GROUP - Cập nhật thông tin ngành và hoạt động công ty',
  description: 'Tin tức mới nhất về thị trường xuất nhập khẩu, hoạt động nội bộ TBS GROUP và thông tin tuyển dụng. Cập nhật chính sách, quy định và xu hướng ngành.',
  keywords: 'tin tức TBS GROUP, tin tức ngành, xuất nhập khẩu, logistics, tuyển dụng, hoạt động công ty'
}

export default function NewsPage() {
  const newsCategories = [
    {
      title: "Câu chuyện khách hàng",
      description: "Trải nghiệm và phản hồi của khách hàng về dịch vụ TBS GROUP",
      icon: "💼",
      color: "amber",
      href: "/cau-chuyen-khach-hang",
      count: "20 câu chuyện",
      latest: "Khách hàng A chia sẻ về trải nghiệm xuất khẩu nông sản sang EU"
    },
    {
      title: "Tin tức ngành",
      description: "Cập nhật thông tin thị trường xuất nhập khẩu, logistics và thương mại quốc tế",
      icon: "📈",
      color: "blue",
      href: "/tin-tuc/nganh",
      count: "25 bài viết",
      latest: "Chính sách mới về thuế xuất nhập khẩu có hiệu lực từ 1/1/2025"
    },
    {
      title: "Tin nội bộ",
      description: "Hoạt động công ty, văn hóa doanh nghiệp và cơ hội tuyển dụng",
      icon: "🏢", 
      color: "green",
      href: "/tin-tuc/noi-bo",
      count: "30 bài viết",
      latest: "TBS GROUP đạt chứng nhận ISO 9001:2015 về quản lý chất lượng",
      subCategories: [
        { title: "Hoạt động công ty", href: "/tin-tuc/noi-bo/hoat-dong-cong-ty", icon: "🎯" },
        { title: "Tuyển dụng", href: "/tin-tuc/noi-bo/tuyen-dung", icon: "👥" }
      ]
    },
    {
      title: "Kiến thức - Cẩm nang XNK",
      description: "Tài liệu chuyên môn, hướng dẫn và kiến thức về xuất nhập khẩu",
      icon: "📚",
      color: "indigo", 
      href: "/tin-tuc/cam-nang-xnk",
      count: "200+ tài liệu",
      latest: "Hướng dẫn xuất khẩu nông sản sang EU theo EVFTA"
    }
  ]

  const featuredNews = [
    {
      id: 1,
      title: "TBS GROUP đạt chứng nhận ISO 9001:2015 về quản lý chất lượng",
      excerpt: "Sau quá trình nỗ lực không ngừng, TBS GROUP đã chính thức đạt được chứng nhận ISO 9001:2015, khẳng định cam kết về chất lượng dịch vụ...",
      date: "22/12/2024",
      category: "Tin tức nội bộ",
      categoryColor: "green",
      image: "🏆",
      href: "/tin-tuc/noi-bo"
    },
    {
      id: 2,
      title: "Chính sách mới về thuế xuất nhập khẩu có hiệu lực từ 1/1/2025",
      excerpt: "Bộ Tài chính vừa ban hành thông tư mới điều chỉnh mức thuế xuất nhập khẩu đối với một số nhóm hàng hóa, tác động trực tiếp đến hoạt động kinh doanh...",
      date: "20/12/2024",
      category: "Tin tức ngành",
      categoryColor: "blue",
      image: "📋",
      href: "/tin-tuc/nganh"
    },
    {
      id: 3,
      title: "TBS GROUP tuyển dụng Nhân viên Xuất nhập khẩu tháng 12/2024",
      excerpt: "Chúng tôi đang tìm kiếm những ứng viên tài năng cho vị trí Nhân viên Xuất nhập khẩu với mức lương hấp dẫn và cơ hội phát triển...",
      date: "18/12/2024",
      category: "Tuyển dụng",
      categoryColor: "purple",
      image: "🎯",
      href: "/tin-tuc/tuyen-dung"
    }
  ]

  const allNews = [
    {
      id: 4,
      title: "Thị trường logistics Việt Nam tăng trưởng 15% trong năm 2024",
      excerpt: "Báo cáo của Hiệp hội Logistics Việt Nam cho thấy ngành logistics đạt mức tăng trưởng ấn tượng 15% so với năm trước...",
      date: "15/12/2024",
      category: "Tin tức ngành",
      categoryColor: "blue",
      image: "📊"
    },
    {
      id: 5,
      title: "Lễ tổng kết năm 2024 và kế hoạch phát triển 2025",
      excerpt: "TBS GROUP tổ chức lễ tổng kết năm 2024 thành công với sự tham gia của toàn thể cán bộ nhân viên...",
      date: "12/12/2024",
      category: "Tin tức nội bộ",
      categoryColor: "green",
      image: "🎉"
    },
    {
      id: 6,
      title: "Cơ hội thăng tiến tại TBS GROUP - Từ Nhân viên lên Trưởng phòng",
      excerpt: "Khám phá lộ trình phát triển nghề nghiệp rõ ràng và cơ hội thăng tiến nhanh chóng tại TBS GROUP...",
      date: "10/12/2024",
      category: "Tuyển dụng",
      categoryColor: "purple",
      image: "🚀"
    },
    {
      id: 7,
      title: "EVFTA mở ra cơ hội xuất khẩu mới cho doanh nghiệp Việt Nam",
      excerpt: "Hiệp định Thương mại Tự do Việt Nam - EU (EVFTA) tiếp tục tạo ra những cơ hội xuất khẩu mới...",
      date: "08/12/2024",
      category: "Tin tức ngành",
      categoryColor: "blue",
      image: "🌍"
    },
    {
      id: 8,
      title: "Chương trình team building 'TBS United 2024' tại Đà Lạt",
      excerpt: "Toàn bộ đội ngũ TBS GROUP đã có 3 ngày 2 đêm trải nghiệm đáng nhớ tại Đà Lạt...",
      date: "05/12/2024",
      category: "Tin tức nội bộ",
      categoryColor: "green",
      image: "🏔️"
    },
    {
      id: 9,
      title: "Phúc lợi hấp dẫn cho nhân viên TBS GROUP năm 2024",
      excerpt: "Tìm hiểu về gói phúc lợi toàn diện bao gồm bảo hiểm, thưởng hiệu suất và các chính sách hỗ trợ nhân viên...",
      date: "03/12/2024",
      category: "Tuyển dụng",
      categoryColor: "purple",
      image: "💎"
    }
  ]

  const getCategoryColorClasses = (color: string) => {
    const colors = {
      amber: {
        bg: "from-amber-500 to-orange-600",
        hover: "hover:from-amber-600 hover:to-orange-700",
        text: "text-amber-600",
        bgLight: "bg-amber-100",
        textLight: "text-amber-700"
      },
      blue: {
        bg: "from-blue-500 to-blue-600",
        hover: "hover:from-blue-600 hover:to-blue-700",
        text: "text-blue-600",
        bgLight: "bg-blue-100",
        textLight: "text-blue-700"
      },
      green: {
        bg: "from-green-500 to-green-600", 
        hover: "hover:from-green-600 hover:to-green-700",
        text: "text-green-600",
        bgLight: "bg-green-100",
        textLight: "text-green-700"
      },
      indigo: {
        bg: "from-indigo-500 to-indigo-600",
        hover: "hover:from-indigo-600 hover:to-indigo-700", 
        text: "text-indigo-600",
        bgLight: "bg-indigo-100",
        textLight: "text-indigo-700"
      },
      purple: {
        bg: "from-purple-500 to-purple-600",
        hover: "hover:from-purple-600 hover:to-purple-700", 
        text: "text-purple-600",
        bgLight: "bg-purple-100",
        textLight: "text-purple-700"
      }
    }
    return colors[color as keyof typeof colors] || colors.blue
  }

  return (
    <main className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="section-padding bg-gradient-to-br from-primary-50 via-white to-primary-100 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 left-10 w-32 h-32 bg-primary-600 rounded-full animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-24 h-24 bg-primary-400 rounded-full animate-bounce"></div>
        </div>
        
        <div className="container-max text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            <div className="inline-block p-4 bg-white rounded-2xl shadow-xl mb-6 hover:shadow-2xl transition-shadow duration-300">
              <span className="text-5xl">📰</span>
            </div>
            <h1 className="text-responsive-4xl font-bold text-gray-900 mb-6 fade-in">
              Tin tức TBS GROUP
          </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-12 leading-relaxed slide-in-left">
              Cập nhật những <strong>thông tin mới nhất</strong> về thị trường xuất nhập khẩu, hoạt động công ty và cơ hội nghề nghiệp
            </p>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
              {newsCategories.map((category, index) => (
                <div key={index} className="stat-card group hover:scale-110 transition-all duration-300" style={{ animationDelay: `${index * 100}ms` }}>
                  <div className="text-3xl mb-2 group-hover:animate-bounce">{category.icon}</div>
                  <div className="text-white font-semibold">{category.title}</div>
                  <div className="text-white/80 text-sm">{category.count}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* News Categories */}
      <section className="section-padding bg-white">
        <div className="container-max">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Danh mục tin tức
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Chọn danh mục bạn quan tâm để xem thông tin chi tiết
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {newsCategories.map((category, index) => {
                const colorClasses = getCategoryColorClasses(category.color)
                return (
                  <Link
                    key={index}
                    href={category.href}
                    className="group block"
                  >
                    <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group-hover:scale-105">
                      {/* Header */}
                      <div className={`bg-gradient-to-r ${colorClasses.bg} ${colorClasses.hover} p-6 text-white transition-all duration-300`}>
                        <div className="flex items-center justify-between mb-4">
                          <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center group-hover:bg-white/30 transition-colors">
                            <span className="text-3xl group-hover:animate-bounce">{category.icon}</span>
                          </div>
                          <div className="text-right">
                            <div className="text-sm opacity-80">Cập nhật</div>
                            <div className="font-semibold">{category.count}</div>
                          </div>
                        </div>
                        <h3 className="text-2xl font-bold mb-2">{category.title}</h3>
                        <p className="text-white/90">{category.description}</p>
                      </div>
                      
                      {/* Content */}
                      <div className="p-6">
                        <div className="mb-4">
                          <span className="text-sm text-gray-500">
                            {category.title === "Kiến thức - Cẩm nang XNK" ? "Tài liệu mới nhất:" : "Bài viết mới nhất:"}
                          </span>
                          <h4 className="font-semibold text-gray-900 mt-1 line-clamp-2 group-hover:text-primary-600 transition-colors">
                            {category.latest}
                          </h4>
                        </div>
                        
                        {/* Sub-categories for Tin nội bộ */}
                        {category.subCategories && (
                          <div className="mb-4 space-y-2">
                            <span className="text-sm text-gray-500">Chuyên mục con:</span>
                            {category.subCategories.map((sub, subIndex) => (
                              <Link
                                key={subIndex}
                                href={sub.href}
                                className="flex items-center text-sm text-gray-700 hover:text-primary-600 transition-colors p-2 rounded hover:bg-gray-50"
                              >
                                <span className="mr-2">{sub.icon}</span>
                                {sub.title}
                              </Link>
                            ))}
                          </div>
                        )}
                        
                        <div className={`flex items-center ${colorClasses.text} font-medium group-hover:translate-x-2 transition-transform duration-300`}>
                          {category.title === "Kiến thức - Cẩm nang XNK" ? "Khám phá ngay" : "Xem tất cả"}
                          <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Featured News */}
      <section className="section-padding bg-gray-50">
        <div className="container-max">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Tin tức nổi bật
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Những thông tin quan trọng và mới nhất từ TBS GROUP
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {featuredNews.map((news, index) => {
                const colorClasses = getCategoryColorClasses(news.categoryColor)
                return (
                  <article key={news.id} className={`${index === 0 ? 'lg:col-span-2' : ''} bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group hover:scale-105`}>
                    <div className={`${index === 0 ? 'lg:flex lg:items-center' : ''} h-full`}>
                      <div className={`${index === 0 ? 'lg:flex-1' : ''} p-6`}>
                        <div className="flex items-center mb-4">
                          <div className={`w-12 h-12 ${colorClasses.bgLight} rounded-lg flex items-center justify-center mr-4 group-hover:scale-110 transition-transform`}>
                            <span className="text-2xl group-hover:animate-bounce">{news.image}</span>
                          </div>
                          <div>
                            <span className={`inline-block px-3 py-1 ${colorClasses.bgLight} ${colorClasses.textLight} text-xs font-medium rounded-full`}>
                              {news.category}
                            </span>
                            <p className="text-sm text-gray-500 mt-1">{news.date}</p>
                          </div>
                        </div>
                        <h3 className={`${index === 0 ? 'text-2xl' : 'text-lg'} font-bold text-gray-900 mb-3 group-hover:${colorClasses.text} transition-colors`}>
                          {news.title}
                        </h3>
                        <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 mb-4">
                          {news.excerpt}
                        </p>
                        <Link href={news.href} className={`inline-flex items-center ${colorClasses.text} font-medium text-sm group-hover:translate-x-1 transition-transform`}>
                          Đọc thêm
                          <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </Link>
                      </div>
                      {index === 0 && (
                        <div className="lg:w-80 lg:h-full flex items-center justify-center p-8">
                          <div className="w-32 h-32 bg-gradient-to-br from-primary-100 to-primary-200 rounded-2xl shadow-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                            <span className="text-6xl group-hover:animate-bounce">{news.image}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </article>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Latest News */}
      <section className="section-padding bg-white">
        <div className="container-max">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Tin tức mới nhất
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Cập nhật liên tục những thông tin mới nhất
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {allNews.map((news, index) => {
                const colorClasses = getCategoryColorClasses(news.categoryColor)
                return (
                  <article key={news.id} className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group hover:scale-105">
                    <div className="p-6">
                      <div className="flex items-center mb-4">
                        <div className={`w-10 h-10 ${colorClasses.bgLight} rounded-lg flex items-center justify-center mr-3 group-hover:scale-110 transition-transform`}>
                          <span className="text-lg group-hover:animate-bounce">{news.image}</span>
                        </div>
                        <div>
                          <span className={`inline-block px-2 py-1 ${colorClasses.bgLight} ${colorClasses.textLight} text-xs font-medium rounded-full`}>
                            {news.category}
                          </span>
                          <p className="text-xs text-gray-500 mt-1">{news.date}</p>
                        </div>
                      </div>
                      <h3 className={`text-lg font-bold text-gray-900 mb-3 group-hover:${colorClasses.text} transition-colors line-clamp-2`}>
                        {news.title}
                      </h3>
                      <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 mb-4">
                        {news.excerpt}
                      </p>
                      <div className={`flex items-center ${colorClasses.text} font-medium text-sm group-hover:translate-x-1 transition-transform`}>
                        Đọc thêm
                        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </article>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Subscription */}
      <section className="section-padding bg-gradient-to-r from-primary-600 to-primary-700">
        <div className="container-max">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-white/10 backdrop-blur-sm p-8 lg:p-12 rounded-2xl">
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                Đăng ký nhận tin tức
              </h2>
              <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
                Nhận những thông tin mới nhất về thị trường xuất nhập khẩu và hoạt động TBS GROUP qua email
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
                <input 
                  type="email" 
                  placeholder="Nhập email của bạn"
                  className="flex-1 px-4 py-3 rounded-lg border-0 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-white/50 outline-none"
                />
                <button className="bg-white text-primary-600 hover:bg-gray-100 font-semibold py-3 px-6 rounded-lg transition-colors">
                  Đăng ký
                </button>
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