import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import BackToTop from '@/components/BackToTop'
import MessengerButton from '@/components/MessengerButton'
import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Site Map - TBS GROUP | Bản đồ website',
  description: 'Bản đồ website TBS GROUP - Tìm kiếm nhanh chóng tất cả các trang và dịch vụ trên website của chúng tôi.',
  keywords: 'sitemap, site map, TBS GROUP, bản đồ website, điều hướng website'
}

export default function SitemapPage() {
  const sitemapData = {
    'Trang chính': [
      { title: 'Trang chủ', url: '/', description: 'Trang chủ chính của TBS GROUP' },
      { title: 'Giới thiệu', url: '/gioi-thieu', description: 'Thông tin về công ty TBS GROUP' },
      { title: 'Liên hệ', url: '/lien-he', description: 'Thông tin liên hệ và form tư vấn' }
    ],
    'Dịch vụ': [
      { title: 'Tất cả dịch vụ', url: '/dich-vu', description: 'Tổng quan 11 dịch vụ chuyên nghiệp' },
      { title: 'Nhập khẩu chính ngạch', url: '/dich-vu/nhap-khau-chinh-ngach', description: 'Dịch vụ nhập khẩu hàng hóa chính ngạch từ Trung Quốc' },
      { title: 'Vận chuyển đường bộ', url: '/dich-vu/van-chuyen-duong-bo', description: 'Vận chuyển hàng hóa bằng xe tải qua cửa khẩu' },
      { title: 'Vận chuyển đường biển', url: '/dich-vu/van-chuyen-duong-bien', description: 'Vận chuyển container qua đường biển' },
      { title: 'Gom hàng tại nguồn', url: '/dich-vu/gom-hang-tai-nguon', description: 'Thu gom và tập kết hàng hóa tại Trung Quốc' },
      { title: 'Tư vấn hải quan', url: '/dich-vu/tu-van-hai-quan', description: 'Tư vấn thủ tục hải quan và pháp lý' },
      { title: 'Kho bãi', url: '/dich-vu/kho-bai', description: 'Dịch vụ lưu kho và bảo quản hàng hóa' },
      { title: 'Bảo hiểm hàng hóa', url: '/dich-vu/bao-hiem-hang-hoa', description: 'Bảo hiểm vận chuyển hàng hóa' },
      { title: 'Tìm nhà cung cấp', url: '/dich-vu/tim-nha-cung-cap', description: 'Hỗ trợ tìm kiếm nhà cung cấp uy tín' },
      { title: 'Kiểm tra chất lượng', url: '/dich-vu/kiem-tra-chat-luong', description: 'Kiểm tra chất lượng hàng hóa trước khi vận chuyển' },
      { title: 'Thanh toán quốc tế', url: '/dich-vu/thanh-toan-quoc-te', description: 'Hỗ trợ thanh toán tiền hàng quốc tế' }
    ],
    'Tin tức': [
      { title: 'Tất cả tin tức', url: '/tin-tuc', description: 'Tin tức ngành và hoạt động công ty' },
      { title: 'Tin tức ngành', url: '/tin-tuc/nganh', description: 'Cập nhật thông tin thị trường xuất nhập khẩu' },
      { title: 'Tin nội bộ', url: '/tin-tuc/noi-bo', description: 'Hoạt động và tin tức nội bộ công ty' },
      { title: 'Hoạt động công ty', url: '/tin-tuc/noi-bo/hoat-dong-cong-ty', description: 'Các hoạt động và sự kiện của TBS GROUP' },
      { title: 'Tuyển dụng', url: '/tin-tuc/noi-bo/tuyen-dung', description: 'Thông tin tuyển dụng nhân sự' },
      { title: 'Kiến thức XNK', url: '/tin-tuc/cam-nang-xnk', description: 'Cẩm nang và kiến thức xuất nhập khẩu' }
    ],
    'Khách hàng': [
      { title: 'Câu chuyện khách hàng', url: '/cau-chuyen-khach-hang', description: 'Chia sẻ từ khách hàng đã sử dụng dịch vụ' },
      { title: 'Tuyển dụng', url: '/tuyen-dung', description: 'Cơ hội nghề nghiệp tại TBS GROUP' }
    ],
    'Chính sách': [
      { title: 'Tổng quan chính sách', url: '/chinh-sach', description: 'Tổng quan các chính sách của công ty' },
      { title: 'Điều khoản sử dụng', url: '/chinh-sach/dieu-khoan', description: 'Điều khoản và điều kiện sử dụng dịch vụ' },
      { title: 'Chính sách Cookie', url: '/chinh-sach/cookie', description: 'Chính sách sử dụng Cookie trên website' },
      { title: 'Chính sách vận chuyển', url: '/chinh-sach/van-chuyen', description: 'Quy định về vận chuyển và giao hàng' },
      { title: 'Chính sách đổi trả', url: '/chinh-sach/doi-tra', description: 'Quy định về đổi trả và hoàn tiền' }
    ]
  }

  return (
    <main className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="py-12 md:py-16 bg-gradient-to-br from-primary-50 via-white to-blue-50">
        <div className="container-max">
          <div className="text-center mb-10">
            <div className="inline-block px-6 py-3 bg-gradient-to-r from-primary-600 to-blue-600 text-white rounded-full text-sm font-semibold mb-6 shadow-lg">
              🗺️ SITE MAP
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Bản đồ website TBS GROUP
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Tìm kiếm nhanh chóng tất cả các trang và dịch vụ trên website của chúng tôi
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto mb-12">
            <div className="text-center bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-shadow">
              <div className="text-2xl font-bold text-primary-600 mb-1">30+</div>
              <div className="text-sm text-gray-600">Trang web</div>
            </div>
            <div className="text-center bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-shadow">
              <div className="text-2xl font-bold text-green-600 mb-1">11</div>
              <div className="text-sm text-gray-600">Dịch vụ</div>
            </div>
            <div className="text-center bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-shadow">
              <div className="text-2xl font-bold text-blue-600 mb-1">6</div>
              <div className="text-sm text-gray-600">Danh mục</div>
            </div>
            <div className="text-center bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-shadow">
              <div className="text-2xl font-bold text-purple-600 mb-1">24/7</div>
              <div className="text-sm text-gray-600">Hỗ trợ</div>
            </div>
          </div>
        </div>
      </section>

      {/* Sitemap Content */}
      <section className="py-12 md:py-16">
        <div className="container-max">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {Object.entries(sitemapData).map(([category, links], categoryIndex) => {
              const categoryColors = [
                'from-blue-500 to-blue-600',
                'from-green-500 to-green-600', 
                'from-purple-500 to-purple-600',
                'from-orange-500 to-orange-600',
                'from-red-500 to-red-600',
                'from-indigo-500 to-indigo-600'
              ]
              
              const categoryIcons = ['🏠', '🏢', '📰', '👥', '📜', '🔧']
              
              return (
                <div key={category} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6">
                  <div className="mb-6">
                    <div className={`inline-flex items-center px-4 py-2 bg-gradient-to-r ${categoryColors[categoryIndex % categoryColors.length]} text-white rounded-full text-sm font-semibold mb-4`}>
                      <span className="mr-2 text-lg">{categoryIcons[categoryIndex % categoryIcons.length]}</span>
                      {category}
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">
                      {category} ({links.length} trang)
                    </h2>
                  </div>
                  
                  <div className="space-y-3">
                    {links.map((link, index) => (
                      <Link
                        key={index}
                        href={link.url}
                        className="block p-4 rounded-xl bg-gray-50 hover:bg-primary-50 border border-gray-100 hover:border-primary-200 transition-all duration-300 group"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 group-hover:text-primary-700 transition-colors mb-1">
                              {link.title}
                            </h3>
                            <p className="text-sm text-gray-600 group-hover:text-gray-700 transition-colors">
                              {link.description}
                            </p>
                            <div className="text-xs text-primary-600 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              {link.url}
                            </div>
                          </div>
                          <div className="ml-4 opacity-0 group-hover:opacity-100 transform translate-x-0 group-hover:translate-x-1 transition-all duration-300">
                            <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Quick Access */}
      <section className="py-12 bg-gradient-to-r from-gray-50 to-blue-50">
        <div className="container-max">
          <div className="text-center mb-8">
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
              Truy cập nhanh
            </h2>
            <p className="text-gray-600">Các trang được truy cập nhiều nhất</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { title: 'Dịch vụ', url: '/dich-vu', icon: '🏢', color: 'bg-blue-500' },
              { title: 'Liên hệ', url: '/lien-he', icon: '📞', color: 'bg-green-500' },
              { title: 'Tin tức', url: '/tin-tuc', icon: '📰', color: 'bg-purple-500' },
              { title: 'Tuyển dụng', url: '/tuyen-dung', icon: '💼', color: 'bg-orange-500' }
            ].map((item, index) => (
              <Link
                key={index}
                href={item.url}
                className="group bg-white rounded-xl p-6 text-center shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <div className={`w-16 h-16 ${item.color} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                  <span className="text-2xl text-white">{item.icon}</span>
                </div>
                <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                  {item.title}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Help Section */}
      <section className="py-12">
        <div className="container-max">
          <div className="bg-gradient-to-r from-primary-600 to-blue-600 rounded-2xl p-8 text-white text-center">
            <h2 className="text-2xl lg:text-3xl font-bold mb-4">
              Không tìm thấy trang bạn cần?
            </h2>
            <p className="text-lg text-primary-100 mb-6 max-w-2xl mx-auto">
              Hãy liên hệ với chúng tôi để được hỗ trợ tìm kiếm hoặc tư vấn dịch vụ phù hợp
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="tel:+84976005335" 
                className="bg-white text-primary-600 hover:bg-primary-50 font-bold py-3 px-6 rounded-lg transition-colors inline-flex items-center justify-center"
              >
                📞 Gọi ngay: 0976 005 335
              </a>
              <Link 
                href="/lien-he" 
                className="bg-primary-700 hover:bg-primary-800 font-bold py-3 px-6 rounded-lg transition-colors inline-flex items-center justify-center"
              >
                💬 Liên hệ tư vấn
              </Link>
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