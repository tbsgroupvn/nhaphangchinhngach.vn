import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import BackToTop from '@/components/BackToTop'
import MessengerButton from '@/components/MessengerButton'
import Link from 'next/link'
import { Metadata } from 'next'

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
      <section className="section-padding bg-gradient-to-br from-teal-50 via-white to-cyan-100 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 left-10 w-32 h-32 bg-teal-600 rounded-full animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-24 h-24 bg-cyan-400 rounded-full animate-bounce"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-teal-300 rounded-full opacity-20 animate-spin"></div>
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
              <div className="stat-card group hover:scale-110 transition-all duration-300 bg-teal-500">
                <div className="text-3xl font-bold text-white mb-2 group-hover:animate-bounce">50+</div>
                <div className="text-sm text-white/80">Sự kiện/năm</div>
              </div>
              <div className="stat-card group hover:scale-110 transition-all duration-300 bg-cyan-500" style={{ animationDelay: '100ms' }}>
                <div className="text-3xl font-bold text-white mb-2 group-hover:animate-bounce">100%</div>
                <div className="text-sm text-white/80">Tham gia tích cực</div>
              </div>
              <div className="stat-card group hover:scale-110 transition-all duration-300 bg-teal-600" style={{ animationDelay: '200ms' }}>
                <div className="text-3xl font-bold text-white mb-2 group-hover:animate-bounce">5★</div>
                <div className="text-sm text-white/80">Đánh giá văn hóa</div>
              </div>
              <div className="stat-card group hover:scale-110 transition-all duration-300 bg-cyan-600" style={{ animationDelay: '300ms' }}>
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
            <div className="flex items-center px-6 py-3 bg-teal-100 text-teal-700 rounded-full font-semibold">
              <span className="mr-2">🎯</span>
              Hoạt động công ty
            </div>
            <Link 
              href="/tin-tuc/noi-bo/tuyen-dung"
              className="flex items-center px-6 py-3 bg-gray-100 text-gray-700 rounded-full hover:bg-purple-100 hover:text-purple-700 transition-all duration-300 group"
            >
              <span className="mr-2 group-hover:animate-bounce">👥</span>
              Tuyển dụng
            </Link>
            <Link 
              href="/tin-tuc/cam-nang-xnk"
              className="flex items-center px-6 py-3 bg-gray-100 text-gray-700 rounded-full hover:bg-indigo-100 hover:text-indigo-700 transition-all duration-300 group"
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
                  
                  <button className="w-full btn-primary group">
                    <span>Xem chi tiết</span>
                    <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
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
              <div className="w-20 h-20 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <span className="text-3xl text-white">🤝</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Đoàn kết</h3>
              <p className="text-gray-600">Tinh thần hợp tác, hỗ trợ lẫn nhau để cùng thành công</p>
            </div>
            
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <span className="text-3xl text-white">🚀</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Sáng tạo</h3>
              <p className="text-gray-600">Khuyến khích đổi mới, sáng tạo trong mọi hoạt động</p>
            </div>
            
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <span className="text-3xl text-white">💎</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Chất lượng</h3>
              <p className="text-gray-600">Cam kết chất lượng cao trong từng sản phẩm, dịch vụ</p>
            </div>
            
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <span className="text-3xl text-white">🌱</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Phát triển</h3>
              <p className="text-gray-600">Học hỏi không ngừng, phát triển bản thân và tổ chức</p>
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
