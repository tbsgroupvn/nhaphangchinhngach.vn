import Image from 'next/image'
import NewsletterFooter from './NewsletterFooter'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container-max section-padding">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Thông tin công ty */}
          <div className="col-span-1 lg:col-span-2">
            <div className="flex items-center mb-4">
              <Image
                src="/images/tbs-logo.png"
                alt="TBS GROUP Logo"
                width={40}
                height={40}
                className="mr-3"
              />
              <div className="text-2xl font-bold text-primary-400">
                TBS GROUP
              </div>
            </div>
            <p className="text-gray-300 mb-4">
              Chuyên cung cấp dịch vụ nhập khẩu hàng hóa từ Trung Quốc chính ngạch, 
              minh bạch và uy tín. Cam kết bảo vệ quyền lợi tối đa cho khách hàng.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://zalo.me/0976005335" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-blue-400 transition-colors"
              >
                💬
              </a>
              <a 
                href="https://tiktok.com/@tbslogistics" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-pink-400 transition-colors"
              >
                🎵
              </a>
              <a 
                href="mailto:info@xuatnhapkhautbs.vn"
                className="text-gray-300 hover:text-green-400 transition-colors"
              >
                ✉️
              </a>
            </div>
          </div>

          {/* Dịch vụ */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <span className="text-xl mr-2">🏢</span>
              Dịch vụ
            </h3>
            <ul className="space-y-2 text-gray-300">
              <li><a href="#about" className="hover:text-primary-400 transition-colors flex items-center">
                <span className="mr-2">📋</span> Nhập khẩu chính ngạch
              </a></li>
              <li><a href="#pricing" className="hover:text-primary-400 transition-colors flex items-center">
                <span className="mr-2">🚛</span> Vận chuyển đường bộ
              </a></li>
              <li><a href="#pricing" className="hover:text-primary-400 transition-colors flex items-center">
                <span className="mr-2">🚢</span> Vận chuyển đường biển
              </a></li>
              <li><a href="#products" className="hover:text-primary-400 transition-colors flex items-center">
                <span className="mr-2">📦</span> Gom hàng tại nguồn
              </a></li>
              <li><a href="#contact" className="hover:text-primary-400 transition-colors flex items-center">
                <span className="mr-2">🎯</span> Tư vấn hải quan
              </a></li>
            </ul>
          </div>

          {/* Thông tin & Tuyển dụng */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <span className="text-xl mr-2">📰</span>
              Thông tin
            </h3>
            <ul className="space-y-2 text-gray-300">
              <li><a href="/tin-tuc" className="hover:text-primary-400 transition-colors flex items-center">
                <span className="mr-2">📰</span> Tin tức XNK
              </a></li>
              <li><a href="/tuyen-dung" className="hover:text-primary-400 transition-colors flex items-center">
                <span className="mr-2">💼</span> Tuyển dụng
              </a></li>
              <li><a href="/gioi-thieu" className="hover:text-primary-400 transition-colors flex items-center">
                <span className="mr-2">ℹ️</span> Giới thiệu công ty
              </a></li>
              <li><a href="/cau-chuyen-khach-hang" className="hover:text-primary-400 transition-colors flex items-center">
                <span className="mr-2">👥</span> Khách hàng
              </a></li>
              <li><a href="/lien-he" className="hover:text-primary-400 transition-colors flex items-center">
                <span className="mr-2">📞</span> Liên hệ hỗ trợ
              </a></li>
            </ul>
          </div>

          {/* Chính sách */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <span className="text-xl mr-2">📋</span>
              Chính sách
            </h3>
            <ul className="space-y-2 text-gray-300">
              <li><a href="/chinh-sach/van-chuyen" className="hover:text-primary-400 transition-colors flex items-center">
                <span className="mr-2">🚛</span> Vận chuyển
              </a></li>
              <li><a href="/chinh-sach/doi-tra" className="hover:text-primary-400 transition-colors flex items-center">
                <span className="mr-2">🔄</span> Đổi trả hàng
              </a></li>
              <li><a href="/chinh-sach/cookie" className="hover:text-primary-400 transition-colors flex items-center">
                <span className="mr-2">🍪</span> Cookie
              </a></li>
              <li><a href="/chinh-sach/dieu-khoan" className="hover:text-primary-400 transition-colors flex items-center">
                <span className="mr-2">📜</span> Điều khoản
              </a></li>
            </ul>
          </div>

          {/* Thông tin liên hệ */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Liên hệ</h4>
            <div className="space-y-2 text-sm text-gray-300">
              <p className="flex items-center">
                <span className="mr-2">📞</span>
                <a href="tel:0976005335" className="hover:text-white">0976 005 335</a>
              </p>
              <p className="flex items-center">
                <span className="mr-2">✉️</span>
                <a href="mailto:info@xuatnhapkhautbs.vn" className="hover:text-white">info@xuatnhapkhautbs.vn</a>
              </p>
              <p className="flex items-center">
                <span className="mr-2">💬</span>
                <a href="https://zalo.me/0976005335" target="_blank" rel="noopener noreferrer" className="hover:text-white">Zalo: 0976 005 335</a>
              </p>
              <p className="flex items-center">
                <span className="mr-2">🎵</span>
                <a href="https://tiktok.com/@tbslogistics" target="_blank" rel="noopener noreferrer" className="hover:text-white">TikTok: @tbslogistics</a>
              </p>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Văn phòng</h4>
            <div className="space-y-3 text-sm text-gray-300">
              <div>
                <p className="font-medium text-white">🏢 Trụ sở Hà Nội</p>
                <p>Kim Nỗ, Đông Anh, Hà Nội</p>
              </div>
              <div>
                <p className="font-medium text-white">🏢 Chi nhánh TP.HCM</p>
                <p>Xuân Thới Đông, Hóc Môn, TP.HCM</p>
              </div>
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <NewsletterFooter />
          </div>
        </div>

        {/* Ngành hàng ưu tiên */}
        <div className="border-t border-gray-700 mt-12 pt-8">
          <h3 className="text-lg font-semibold mb-4 text-center flex items-center justify-center">
            <span className="text-xl mr-2">🏭</span>
            Ngành hàng ưu tiên
          </h3>
          <div className="flex flex-wrap justify-center gap-3 text-sm">
            <span className="px-4 py-2 bg-gray-800 rounded-full text-gray-300 hover:bg-gray-700 transition-colors flex items-center">
              <span className="mr-2">🥄</span> Đồ gia dụng nhựa
            </span>
            <span className="px-4 py-2 bg-gray-800 rounded-full text-gray-300 hover:bg-gray-700 transition-colors flex items-center">
              <span className="mr-2">🔌</span> Gia dụng điện
            </span>
            <span className="px-4 py-2 bg-gray-800 rounded-full text-gray-300 hover:bg-gray-700 transition-colors flex items-center">
              <span className="mr-2">✏️</span> Văn phòng phẩm
            </span>
            <span className="px-4 py-2 bg-gray-800 rounded-full text-gray-300 hover:bg-gray-700 transition-colors flex items-center">
              <span className="mr-2">🪑</span> Nội thất
            </span>
            <span className="px-4 py-2 bg-gray-800 rounded-full text-gray-300 hover:bg-gray-700 transition-colors flex items-center">
              <span className="mr-2">📱</span> Đồ điện tử
            </span>
            <span className="px-4 py-2 bg-gray-800 rounded-full text-gray-300 hover:bg-gray-700 transition-colors flex items-center">
              <span className="mr-2">⚙️</span> Máy móc mới
            </span>
            <span className="px-4 py-2 bg-gray-800 rounded-full text-gray-300 hover:bg-gray-700 transition-colors flex items-center">
              <span className="mr-2">🧱</span> Nguyên vật liệu
            </span>
          </div>
        </div>

        {/* Stats */}
        <div className="border-t border-gray-700 mt-8 pt-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-2xl font-bold text-primary-400 mb-1">8</div>
              <div className="text-sm text-gray-400">Năm kinh nghiệm</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary-400 mb-1">8000+</div>
              <div className="text-sm text-gray-400">Khách hàng tin tưởng</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary-400 mb-1">200000</div>
              <div className="text-sm text-gray-400">Đơn nhập khẩu chính ngạch</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary-400 mb-1">24/7</div>
              <div className="text-sm text-gray-400">Hỗ trợ khách hàng</div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="text-sm text-gray-400 mb-4 md:mb-0 flex items-center">
            <span className="mr-2">©</span>
            2024 TBS GROUP. Tất cả quyền được bảo lưu.
          </div>
          <div className="text-sm text-gray-400 flex items-center">
            <span className="mr-2">🏆</span>
            <span className="mr-4">Dịch vụ nhập khẩu chính ngạch</span>
            <span className="mr-2">✨</span>
            <span>Minh bạch - Uy tín - Chất lượng</span>
          </div>
        </div>
      </div>
    </footer>
  )
} 