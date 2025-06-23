import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import BackToTop from '@/components/BackToTop'
import MessengerButton from '@/components/MessengerButton'
import Link from 'next/link'
import { Metadata } from 'next'
import Script from 'next/script'

export const metadata: Metadata = {
  title: 'Hoạt động công ty - TBS GROUP | Tin tức nội bộ',
  description: 'Cập nhật các hoạt động nội bộ, sự kiện, và văn hóa công ty TBS GROUP. Khám phá những khoảnh khắc ý nghĩa trong hành trình phát triển.',
  keywords: 'hoạt động công ty TBS GROUP, văn hóa doanh nghiệp, sự kiện nội bộ, team building, tin tức nội bộ'
}

export default function CompanyActivitiesPage() {
  const activities = [
    {
      id: 1,
      title: "Team Building Quý 4/2024 - Hành trình gắn kết",
      date: "15/12/2024",
      image: "🏔️",
      category: "Team Building",
      description: "Chuyến team building đầy ý nghĩa với các hoạt động ngoài trời, xây dựng tinh thần đoàn kết và gắn kết giữa các thành viên trong đội ngũ TBS GROUP.",
      highlights: ["Tham gia: 120+ nhân viên", "Địa điểm: Đà Lạt", "Thời gian: 3 ngày 2 đêm"]
    },
    {
      id: 2,
      title: "Lễ tuyên dương nhân viên xuất sắc năm 2024",
      date: "20/11/2024",
      image: "🏆",
      category: "Vinh danh",
      description: "Chương trình tôn vinh những cá nhân và tập thể có thành tích xuất sắc trong năm 2024, góp phần vào sự phát triển vượt bậc của TBS GROUP.",
      highlights: ["15 cá nhân được vinh danh", "5 tập thể xuất sắc", "Tổng giá trị thưởng: 500 triệu đồng"]
    },
    {
      id: 3,
      title: "Chương trình đào tạo Digital Transformation",
      date: "10/11/2024", 
      image: "💻",
      category: "Đào tạo",
      description: "Khóa đào tạo chuyển đổi số toàn diện cho toàn thể nhân viên, nâng cao năng lực ứng dụng công nghệ trong công việc hàng ngày.",
      highlights: ["200+ nhân viên tham gia", "20 giờ đào tạo", "Chứng chỉ quốc tế"]
    },
    {
      id: 4,
      title: "Ngày hội sức khỏe TBS Family Health Day",
      date: "25/10/2024",
      image: "🏃‍♂️",
      category: "Sức khỏe",
      description: "Sự kiện chăm sóc sức khỏe toàn diện dành cho nhân viên và gia đình, bao gồm khám sức khỏe định kỳ và các hoạt động thể thao.",
      highlights: ["Khám sức khỏe miễn phí", "Tư vấn dinh dưỡng", "Giải chạy marathon"]
    },
    {
      id: 5,
      title: "Khánh thành văn phòng mới tại TP.HCM",
      date: "15/10/2024",
      image: "🏢",
      category: "Mở rộng",
      description: "Lễ khánh thành văn phòng mới tại trung tâm TP.HCM với diện tích 2000m², hiện đại và sang trọng, đáp ứng nhu cầu phát triển của công ty.",
      highlights: ["Diện tích: 2000m²", "Sức chứa: 300 nhân viên", "Đầu tư: 15 tỷ đồng"]
    },
    {
      id: 6,
      title: "Chương trình từ thiện 'Chia sẻ yêu thương'",
      date: "01/10/2024",
      image: "❤️",
      category: "Từ thiện",
      description: "Hoạt động ý nghĩa hỗ trợ các gia đình khó khăn và trẻ em vùng cao, thể hiện tinh thần trách nhiệm xã hội của TBS GROUP.",
      highlights: ["500 suất quà tặng", "10 tỷ đồng ủng hộ", "3 tỉnh miền núi"]
    }
  ]

  // Real TikTok videos from the provided URLs
  const tiktokVideos = [
    {
      id: 1,
      videoId: "7518588465693396242",
      url: "https://www.tiktok.com/@tbslogistics/video/7518588465693396242",
      title: "Quy trình nhập khẩu chuyên nghiệp",
      description: "Khám phá quy trình nhập khẩu hàng hóa từ Trung Quốc của TBS Logistics",
      category: "Quy trình",
      date: "2 ngày trước"
    },
    {
      id: 2,
      videoId: "7518406873301650706",
      url: "https://www.tiktok.com/@tbslogistics/video/7518406873301650706",
      title: "Kho bãi hiện đại tại cảng",
      description: "Tham quan hệ thống kho bãi hiện đại với công nghệ quản lý tiên tiến",
      category: "Kho bãi",
      date: "3 ngày trước"
    },
    {
      id: 3,
      videoId: "7518304580547906823",
      url: "https://www.tiktok.com/@tbslogistics/video/7518304580547906823",
      title: "Đội ngũ chuyên nghiệp",
      description: "Gặp gỡ đội ngũ chuyên gia logistics giàu kinh nghiệm của TBS",
      category: "Đội ngũ",
      date: "4 ngày trước"
    },
    {
      id: 4,
      videoId: "7517941699293891858",
      url: "https://www.tiktok.com/@tbslogistics/video/7517941699293891858",
      title: "Vận chuyển container",
      description: "Quy trình vận chuyển container an toàn và hiệu quả",
      category: "Vận chuyển",
      date: "5 ngày trước"
    },
    {
      id: 5,
      videoId: "7517522910261677330",
      url: "https://www.tiktok.com/@tbslogistics/video/7517522910261677330",
      title: "Kiểm tra chất lượng",
      description: "Quy trình kiểm tra chất lượng hàng hóa nghiêm ngặt",
      category: "Chất lượng",
      date: "6 ngày trước"
    },
    {
      id: 6,
      videoId: "7517519459557379335",
      url: "https://www.tiktok.com/@tbslogistics/video/7517519459557379335",
      title: "Dịch vụ tư vấn",
      description: "Tư vấn chuyên nghiệp về thủ tục nhập khẩu",
      category: "Tư vấn",
      date: "1 tuần trước"
    }
  ]

  return (
    <main className="min-h-screen">
      {/* TikTok Embed Script */}
      <Script 
        src="https://www.tiktok.com/embed.js" 
        strategy="lazyOnload"
      />
      
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
            <Link href="/tin-tuc/noi-bo" className="text-gray-500 hover:text-primary-600 transition-colors">
              Tin nội bộ
            </Link>
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-gray-900 font-medium">Hoạt động công ty</span>
          </nav>
        </div>
      </section>

      {/* Hero Section */}
      <section className="section-padding bg-gradient-to-br from-sky-50 via-white to-slate-100 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 left-10 w-32 h-32 bg-sky-600 rounded-full animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-24 h-24 bg-slate-400 rounded-full animate-bounce"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-sky-300 rounded-full opacity-20 animate-spin"></div>
        </div>
        
        <div className="container-max text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            <div className="inline-block p-4 bg-white rounded-2xl shadow-xl mb-6 hover:shadow-2xl transition-shadow duration-300">
              <span className="text-5xl">🎯</span>
            </div>
            <h1 className="text-responsive-4xl font-bold text-gray-900 mb-6 fade-in">
              Hoạt động Công ty
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-12 leading-relaxed slide-in-left">
              Khám phá những hoạt động nội bộ, sự kiện và <strong>văn hóa doanh nghiệp</strong> tại TBS GROUP - nơi mỗi thành viên đều là một phần quan trọng trong hành trình <strong>phát triển bền vững</strong>
            </p>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto mb-12">
              <div className="stat-card group hover:scale-110 transition-all duration-300 bg-sky-500">
                <div className="text-3xl font-bold text-white mb-2 group-hover:animate-bounce">50+</div>
                <div className="text-sm text-white/80">Sự kiện/năm</div>
              </div>
              <div className="stat-card group hover:scale-110 transition-all duration-300 bg-slate-500" style={{ animationDelay: '100ms' }}>
                <div className="text-3xl font-bold text-white mb-2 group-hover:animate-bounce">100%</div>
                <div className="text-sm text-white/80">Tham gia tích cực</div>
              </div>
              <div className="stat-card group hover:scale-110 transition-all duration-300 bg-sky-600" style={{ animationDelay: '200ms' }}>
                <div className="text-3xl font-bold text-white mb-2 group-hover:animate-bounce">5★</div>
                <div className="text-sm text-white/80">Đánh giá văn hóa</div>
              </div>
              <div className="stat-card group hover:scale-110 transition-all duration-300 bg-slate-600" style={{ animationDelay: '300ms' }}>
                <div className="text-3xl font-bold text-white mb-2 group-hover:animate-bounce">24/7</div>
                <div className="text-sm text-white/80">Hỗ trợ nhân viên</div>
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
              className="flex items-center px-6 py-3 bg-gray-100 text-gray-700 rounded-full hover:bg-sky-100 hover:text-sky-700 transition-all duration-300 group"
            >
              <span className="mr-2 group-hover:animate-bounce">💼</span>
              Câu chuyện khách hàng
            </Link>
            <Link 
              href="/tin-tuc/nganh"
              className="flex items-center px-6 py-3 bg-gray-100 text-gray-700 rounded-full hover:bg-sky-100 hover:text-sky-700 transition-all duration-300 group"
            >
              <span className="mr-2 group-hover:animate-bounce">📈</span>
              Tin tức ngành
            </Link>
            <Link 
              href="/tin-tuc/noi-bo"
              className="flex items-center px-6 py-3 bg-gray-100 text-gray-700 rounded-full hover:bg-sky-100 hover:text-sky-700 transition-all duration-300 group"
            >
              <span className="mr-2 group-hover:animate-bounce">🏢</span>
              Tin nội bộ
            </Link>
            <div className="flex items-center px-6 py-3 bg-sky-100 text-sky-700 rounded-full font-semibold">
              <span className="mr-2">🎯</span>
              Hoạt động công ty
            </div>
            <Link 
              href="/tin-tuc/noi-bo/tuyen-dung"
              className="flex items-center px-6 py-3 bg-gray-100 text-gray-700 rounded-full hover:bg-slate-100 hover:text-slate-700 transition-all duration-300 group"
            >
              <span className="mr-2 group-hover:animate-bounce">👥</span>
              Tuyển dụng
            </Link>
            <Link 
              href="/tin-tuc/cam-nang-xnk"
              className="flex items-center px-6 py-3 bg-gray-100 text-gray-700 rounded-full hover:bg-slate-100 hover:text-slate-700 transition-all duration-300 group"
            >
              <span className="mr-2 group-hover:animate-bounce">📚</span>
              Kiến thức - Cẩm nang XNK
            </Link>
          </div>
        </div>
      </section>

      {/* Activities Grid */}
      <section className="section-padding bg-gray-50">
        <div className="container-max">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {activities.map((activity, index) => (
              <article 
                key={activity.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="p-6 text-center border-b border-gray-100">
                  <div className="text-6xl mb-4 animate-bounce">{activity.image}</div>
                  <div className="inline-block px-3 py-1 bg-teal-100 text-teal-700 text-xs font-semibold rounded-full mb-2">
                    {activity.category}
                  </div>
                  <div className="text-sm text-gray-500">{activity.date}</div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                    {activity.title}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {activity.description}
                  </p>
                  
                  <div className="space-y-2 mb-6">
                    {activity.highlights.map((highlight, idx) => (
                      <div key={idx} className="flex items-center text-sm text-gray-700">
                        <svg className="w-4 h-4 text-teal-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {highlight}
                      </div>
                    ))}
                  </div>
                  
                  <div className="w-full btn-primary group cursor-pointer text-center flex items-center justify-center">
                    <span>Xem chi tiết</span>
                    <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Company Culture Section */}
      <section className="section-padding bg-white">
        <div className="container-max">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Văn hóa TBS GROUP</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Môi trường làm việc chuyên nghiệp, năng động và đầy sáng tạo
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-sky-400 to-sky-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <span className="text-3xl text-white">🤝</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Đoàn kết</h3>
              <p className="text-gray-600">Tinh thần hợp tác, hỗ trợ lẫn nhau để cùng thành công</p>
            </div>
            
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-slate-400 to-slate-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <span className="text-3xl text-white">🚀</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Sáng tạo</h3>
              <p className="text-gray-600">Khuyến khích đổi mới, sáng tạo trong mọi hoạt động</p>
            </div>
            
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-sky-500 to-sky-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <span className="text-3xl text-white">💎</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Chất lượng</h3>
              <p className="text-gray-600">Cam kết chất lượng cao trong từng sản phẩm, dịch vụ</p>
            </div>
            
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-slate-500 to-slate-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <span className="text-3xl text-white">🌱</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Phát triển</h3>
              <p className="text-gray-600">Học hỏi không ngừng, phát triển bản thân và tổ chức</p>
            </div>
          </div>
        </div>
      </section>

      {/* TikTok Videos Section */}
      <section className="section-padding bg-gradient-to-br from-pink-50 via-white to-purple-50">
        <div className="container-max">
          <div className="text-center mb-12">
            <div className="inline-block p-4 bg-white rounded-2xl shadow-xl mb-6 hover:shadow-2xl transition-shadow duration-300">
              <span className="text-5xl">📱</span>
            </div>
            <h2 className="text-responsive-4xl font-bold text-gray-900 mb-4">
              Video hoạt động trên TikTok
            </h2>
            <p className="text-responsive-xl text-gray-600 max-w-3xl mx-auto">
              Khám phá những khoảnh khắc thực tế trong hoạt động logistics của TBS GROUP qua các video TikTok
            </p>
          </div>

          {/* TikTok Videos Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
            {tiktokVideos.map((video, index) => (
              <div key={video.id} className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="relative">
                  {/* TikTok Embed */}
                  <div className="aspect-[9/16] bg-gray-100 relative overflow-hidden rounded-t-2xl">
                    <blockquote 
                      className="tiktok-embed w-full h-full" 
                      cite={video.url}
                      data-video-id={video.videoId}
                      style={{ maxWidth: '100%', minWidth: '100%' }}
                    >
                      <section>
                        <a 
                          target="_blank" 
                          title={`@tbslogistics ${video.title}`}
                          href={video.url}
                          rel="noopener noreferrer"
                        >
                          <div className="flex items-center justify-center h-full bg-gradient-to-br from-pink-500 to-purple-600 text-white">
                            <div className="text-center">
                              <div className="text-4xl mb-4">🎬</div>
                              <div className="text-lg font-semibold mb-2">{video.title}</div>
                              <div className="text-sm opacity-90">Nhấn để xem video</div>
                            </div>
                          </div>
                        </a>
                      </section>
                    </blockquote>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="inline-block px-3 py-1 bg-pink-100 text-pink-700 text-xs font-semibold rounded-full">
                      {video.category}
                    </span>
                    <span className="text-sm text-gray-500">{video.date}</span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    {video.title}
                  </h3>
                  <p className="text-gray-600 mb-4 text-sm">
                    {video.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-gray-500 space-x-4">
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                        </svg>
                        <span className="animate-pulse">...</span>
                      </span>
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M21 6h-2l-1.27-1.27c-.13-.13-.3-.2-.48-.2H15c-.17 0-.34.07-.47.2L13.27 6H12c-.55 0-1 .45-1 1s.45 1 1 1h9c.55 0 1-.45 1-1s-.45-1-1-1zM21 19c0 1.1-.9 2-2 2H5c-1.1 0-2-.9-2-2V9c0-1.1.9-2 2-2h3.17l1.83-2h4l1.83 2H19c1.1 0 2 .9 2 2v10z"/>
                        </svg>
                        <span className="animate-pulse">...</span>
                      </span>
                    </div>
                    <a 
                      href={video.url}
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white text-sm font-semibold rounded-full hover:from-pink-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
                    >
                      Xem TikTok
                      <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Show More Videos Button */}
          <div className="text-center mb-8">
            <a 
              href="https://www.tiktok.com/@tbslogistics"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold rounded-full hover:from-pink-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Xem thêm video ({tiktokVideos.length + 28} video khác)
            </a>
          </div>

          {/* TikTok Channel Info */}
          <div className="bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 rounded-2xl p-8 text-white text-center">
            <div className="max-w-3xl mx-auto">
              <div className="flex items-center justify-center mb-6">
                <div className="w-16 h-16 bg-white bg-opacity-20 backdrop-blur-sm rounded-full flex items-center justify-center mr-4">
                  <svg className="w-10 h-10 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-.88-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                  </svg>
                </div>
                <div className="text-left">
                  <h3 className="text-2xl font-bold">@tbslogistics</h3>
                  <p className="text-lg opacity-90">TBS Logistics Official</p>
                </div>
              </div>
              
              <p className="text-xl mb-6 opacity-90">
                🚢 Nhập khẩu chính ngạch từ Trung Quốc<br/>
                📦 Logistics chuyên nghiệp<br/>
                🎥 Chia sẻ kiến thức xuất nhập khẩu<br/>
                💼 Dịch vụ tư vấn miễn phí
              </p>

              <div className="grid grid-cols-3 gap-6 mb-8">
                <div className="text-center">
                  <div className="text-3xl font-bold mb-1">25K+</div>
                  <div className="text-sm opacity-80">Followers</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold mb-1">{tiktokVideos.length + 28}+</div>
                  <div className="text-sm opacity-80">Videos</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold mb-1">2.5M+</div>
                  <div className="text-sm opacity-80">Likes</div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a 
                  href="https://www.tiktok.com/@tbslogistics" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-8 py-3 bg-white text-gray-900 font-bold rounded-full hover:bg-gray-100 transition-all duration-300 transform hover:scale-105"
                >
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-.88-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                  </svg>
                  Theo dõi TikTok
                </a>
                <a 
                  href="https://www.tiktok.com/@tbslogistics" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-8 py-3 bg-white bg-opacity-20 backdrop-blur-sm text-white font-bold rounded-full border border-white border-opacity-30 hover:bg-opacity-30 transition-all duration-300 transform hover:scale-105"
                >
                  Xem tất cả video
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
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
