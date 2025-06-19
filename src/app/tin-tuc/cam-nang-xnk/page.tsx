import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import BackToTop from '@/components/BackToTop'
import MessengerButton from '@/components/MessengerButton'
import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Kiến thức - Cẩm nang XNK - TBS GROUP | Tài liệu chuyên môn xuất nhập khẩu',
  description: 'Kho tài liệu chuyên môn về xuất nhập khẩu, logistics và thủ tục hải quan. Cẩm nang hướng dẫn chi tiết cho doanh nghiệp và cá nhân.',
  keywords: 'cẩm nang xuất nhập khẩu, thủ tục hải quan, logistics, kiến thức XNK, hướng dẫn xuất nhập khẩu, TBS GROUP'
}

export default function ImportExportGuidePage() {
  const knowledgeCategories = [
    {
      id: 1,
      title: "Thủ tục Hải quan",
      icon: "📋",
      color: "from-blue-400 to-indigo-500",
      description: "Hướng dẫn chi tiết các thủ tục hải quan, khai báo hàng hóa và giải quyết vướng mắc",
      articles: [
        "Quy trình khai báo hải quan điện tử",
        "Hồ sơ cần thiết cho hàng xuất khẩu",
        "Xử lý hàng bị tạm giữ tại cảng",
        "Thuế suất và ưu đãi thuế"
      ]
    },
    {
      id: 2,
      title: "Logistics & Vận chuyển",
      icon: "🚛",
      color: "from-green-400 to-teal-500",
      description: "Kiến thức về logistics, vận chuyển quốc tế và quản lý chuỗi cung ứng",
      articles: [
        "Lựa chọn phương thức vận chuyển phù hợp",
        "Bảo hiểm hàng hóa trong vận chuyển",
        "Incoterms 2020 và ứng dụng thực tế",
        "Tối ưu chi phí logistics"
      ]
    },
    {
      id: 3,
      title: "Chứng từ & Pháp lý",
      icon: "📑",
      color: "from-purple-400 to-pink-500",
      description: "Các loại chứng từ xuất nhập khẩu và quy định pháp lý hiện hành",
      articles: [
        "Bill of Lading và các loại vận đơn",
        "Certificate of Origin (C/O)",
        "Hóa đơn thương mại và packing list",
        "Giấy phép xuất nhập khẩu đặc biệt"
      ]
    },
    {
      id: 4,
      title: "Thanh toán Quốc tế",
      icon: "💳",
      color: "from-orange-400 to-red-500",
      description: "Phương thức thanh toán và tài chính thương mại quốc tế",
      articles: [
        "Letter of Credit (L/C)",
        "Collection và Open Account",
        "Quản lý rủi ro tỷ giá",
        "Tài chính chuỗi cung ứng"
      ]
    },
    {
      id: 5,
      title: "Quy định Quốc tế",
      icon: "🌍",
      color: "from-cyan-400 to-blue-500",
      description: "Các hiệp định thương mại và quy định quốc tế về XNK",
      articles: [
        "Hiệp định EVFTA và ưu đãi thuế",
        "CPTPP và cơ hội xuất khẩu",
        "Quy tắc xuất xứ hàng hóa",
        "Rào cản kỹ thuật trong thương mại"
      ]
    },
    {
      id: 6,
      title: "Công nghệ & Digitalization",
      icon: "💻",
      color: "from-indigo-400 to-purple-500",
      description: "Ứng dụng công nghệ trong xuất nhập khẩu và chuyển đổi số",
      articles: [
        "Hệ thống quản lý TMS/WMS",
        "Blockchain trong logistics",
        "AI và dự báo nhu cầu",
        "Digital transformation trong XNK"
      ]
    }
  ]

  const featuredGuides = [
    {
      id: 1,
      title: "Hướng dẫn xuất khẩu nông sản sang EU theo EVFTA",
      date: "15/12/2024",
      readTime: "15 phút",
      level: "Trung cấp", 
      downloads: "2.5K",
      image: "🇪🇺",
      description: "Cẩm nang chi tiết về quy trình xuất khẩu nông sản sang thị trường EU, tận dụng ưu đãi từ hiệp định EVFTA.",
      tags: ["EVFTA", "Nông sản", "EU", "Thủ tục"]
    },
    {
      id: 2,
      title: "Checklist hoàn chỉnh cho doanh nghiệp mới xuất khẩu",
      date: "10/12/2024",
      readTime: "20 phút",
      level: "Cơ bản",
      downloads: "5.2K",
      image: "✅",
      description: "Danh sách kiểm tra đầy đủ các bước cần thiết cho doanh nghiệp lần đầu tham gia hoạt động xuất khẩu.",
      tags: ["Checklist", "Cơ bản", "Doanh nghiệp mới", "Hướng dẫn"]
    },
    {
      id: 3,
      title: "Xu hướng logistics 2025 và cơ hội đầu tư",
      date: "05/12/2024",
      readTime: "12 phút", 
      level: "Nâng cao",
      downloads: "1.8K",
      image: "📈",
      description: "Phân tích xu hướng phát triển của ngành logistics trong năm 2025 và các cơ hội đầu tư tiềm năng.",
      tags: ["Xu hướng", "2025", "Đầu tư", "Logistics"]
    }
  ]

  return (
    <main className="min-h-screen">
      <Navbar />
      
      {/* Breadcrumb */}
      <section className="bg-gray-50 py-4">
        <div className="container-max">
          <nav className="flex items-center space-x-2 text-sm">
            <Link href="/" className="text-gray-500 hover:text-primary-600 transition-colors">
              Trang chủ
            </Link>
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <Link href="/tin-tuc" className="text-gray-500 hover:text-primary-600 transition-colors">
              Tin tức
            </Link>
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-gray-900 font-medium">Kiến thức - Cẩm nang XNK</span>
          </nav>
        </div>
      </section>

      {/* Hero Section */}
      <section className="section-padding bg-gradient-to-br from-indigo-50 via-white to-blue-100 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 left-10 w-32 h-32 bg-indigo-600 rounded-full animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-24 h-24 bg-blue-400 rounded-full animate-bounce"></div>
          <div className="absolute top-1/3 right-1/4 w-20 h-20 bg-purple-300 rounded-full animate-ping"></div>
        </div>
        
        <div className="container-max text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            <div className="inline-block p-4 bg-white rounded-2xl shadow-xl mb-6 hover:shadow-2xl transition-shadow duration-300">
              <span className="text-5xl">📚</span>
            </div>
            <h1 className="text-responsive-4xl font-bold text-gray-900 mb-6 fade-in">
              Kiến thức - Cẩm nang XNK
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-12 leading-relaxed slide-in-left">
              Kho tàng <strong>kiến thức chuyên môn</strong> về xuất nhập khẩu, logistics và thương mại quốc tế. Cẩm nang hướng dẫn <strong>chi tiết và thực tế</strong> cho doanh nghiệp
            </p>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto mb-12">
              <div className="stat-card group hover:scale-110 transition-all duration-300 bg-indigo-500">
                <div className="text-3xl font-bold text-white mb-2 group-hover:animate-bounce">200+</div>
                <div className="text-sm text-white/80">Bài viết</div>
              </div>
              <div className="stat-card group hover:scale-110 transition-all duration-300 bg-blue-500" style={{ animationDelay: '100ms' }}>
                <div className="text-3xl font-bold text-white mb-2 group-hover:animate-bounce">50K+</div>
                <div className="text-sm text-white/80">Lượt tải</div>
              </div>
              <div className="stat-card group hover:scale-110 transition-all duration-300 bg-purple-500" style={{ animationDelay: '200ms' }}>
                <div className="text-3xl font-bold text-white mb-2 group-hover:animate-bounce">6</div>
                <div className="text-sm text-white/80">Chuyên mục</div>
              </div>
              <div className="stat-card group hover:scale-110 transition-all duration-300 bg-cyan-500" style={{ animationDelay: '300ms' }}>
                <div className="text-3xl font-bold text-white mb-2 group-hover:animate-bounce">24/7</div>
                <div className="text-sm text-white/80">Cập nhật</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* News Categories Navigation */}
      <section className="py-8 bg-white border-b border-gray-200">
        <div className="container-max">
          <div className="flex flex-wrap justify-center gap-4">
            <Link 
              href="/cau-chuyen-khach-hang"
              className="flex items-center px-6 py-3 bg-gray-100 text-gray-700 rounded-full hover:bg-amber-100 hover:text-amber-700 transition-all duration-300 group"
            >
              <span className="mr-2 group-hover:animate-bounce">💼</span>
              Câu chuyện khách hàng
            </Link>
            <Link 
              href="/tin-tuc/nganh"
              className="flex items-center px-6 py-3 bg-gray-100 text-gray-700 rounded-full hover:bg-blue-100 hover:text-blue-700 transition-all duration-300 group"
            >
              <span className="mr-2 group-hover:animate-bounce">📈</span>
              Tin tức ngành
            </Link>
            <Link 
              href="/tin-tuc/noi-bo"
              className="flex items-center px-6 py-3 bg-gray-100 text-gray-700 rounded-full hover:bg-green-100 hover:text-green-700 transition-all duration-300 group"
            >
              <span className="mr-2 group-hover:animate-bounce">🏢</span>
              Tin nội bộ
            </Link>
            <Link 
              href="/tin-tuc/noi-bo/hoat-dong-cong-ty"
              className="flex items-center px-6 py-3 bg-gray-100 text-gray-700 rounded-full hover:bg-teal-100 hover:text-teal-700 transition-all duration-300 group"
            >
              <span className="mr-2 group-hover:animate-bounce">🎯</span>
              Hoạt động công ty
            </Link>
            <Link 
              href="/tin-tuc/noi-bo/tuyen-dung"
              className="flex items-center px-6 py-3 bg-gray-100 text-gray-700 rounded-full hover:bg-purple-100 hover:text-purple-700 transition-all duration-300 group"
            >
              <span className="mr-2 group-hover:animate-bounce">👥</span>
              Tuyển dụng
            </Link>
            <div className="flex items-center px-6 py-3 bg-indigo-100 text-indigo-700 rounded-full font-semibold">
              <span className="mr-2">📚</span>
              Kiến thức - Cẩm nang XNK
            </div>
          </div>
        </div>
      </section>

      {/* Featured Guides */}
      <section className="section-padding bg-gray-50">
        <div className="container-max">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Cẩm nang nổi bật</h2>
            <p className="text-xl text-gray-600">Những hướng dẫn được tải nhiều nhất trong tháng</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {featuredGuides.map((guide, index) => (
              <article 
                key={guide.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="p-6 text-center border-b border-gray-100">
                  <div className="text-5xl mb-3">{guide.image}</div>
                  <div className="flex justify-center gap-2 mb-3">
                    <span className="px-2 py-1 bg-indigo-100 text-indigo-700 text-xs font-semibold rounded">
                      {guide.level}
                    </span>
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded">
                      {guide.readTime}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500">{guide.date}</div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2">
                    {guide.title}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {guide.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {guide.tags.map((tag, idx) => (
                      <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                        #{tag}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center text-sm text-gray-500">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      {guide.downloads} lượt tải
                    </div>
                  </div>
                  
                  <button className="w-full btn-primary group">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Tải xuống miễn phí
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Knowledge Categories */}
      <section className="section-padding bg-white">
        <div className="container-max">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Chuyên mục kiến thức</h2>
            <p className="text-xl text-gray-600">Khám phá kho tàng kiến thức chuyên môn được phân loại chi tiết</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {knowledgeCategories.map((category, index) => (
              <div 
                key={category.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 fade-in border border-gray-100"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="p-6">
                  <div className={`w-16 h-16 bg-gradient-to-br ${category.color} rounded-full flex items-center justify-center mx-auto mb-4 hover:scale-110 transition-transform duration-300`}>
                    <span className="text-2xl text-white">{category.icon}</span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">
                    {category.title}
                  </h3>
                  <p className="text-gray-600 mb-6 text-center">
                    {category.description}
                  </p>
                  
                  <div className="space-y-3 mb-6">
                    {category.articles.map((article, idx) => (
                      <div key={idx} className="flex items-start">
                        <svg className="w-4 h-4 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
                        </svg>
                        <span className="text-sm text-gray-700">{article}</span>
                      </div>
                    ))}
                  </div>
                  
                  <button className="w-full btn-secondary group">
                    <span>Khám phá ngay</span>
                    <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Subscription */}
      <section className="section-padding bg-gradient-to-r from-indigo-600 to-blue-600">
        <div className="container-max text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-4">
              Đăng ký nhận cẩm nang mới nhất
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Cập nhật kiến thức chuyên môn và xu hướng mới nhất trong ngành xuất nhập khẩu
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input 
                type="email" 
                placeholder="Nhập email của bạn..."
                className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button className="px-6 py-3 bg-white text-indigo-600 font-semibold rounded-lg hover:bg-gray-50 transition-colors">
                Đăng ký
              </button>
            </div>
            
            <p className="text-blue-200 text-sm mt-4">
              Miễn phí - Không spam - Hủy đăng ký bất cứ lúc nào
            </p>
          </div>
        </div>
      </section>

      <Footer />
      <BackToTop />
      <MessengerButton />
    </main>
  )
}
