import Image from 'next/image'
import NewsletterFooter from './NewsletterFooter'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      {/* Đường dây nóng khiếu nại - Nổi bật */}
      <div className="bg-gradient-to-r from-red-600 via-orange-500 to-yellow-500 py-4">
        <div className="container-max">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-center">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center animate-pulse">
                <span className="text-2xl">📞</span>
              </div>
              <div className="text-white">
                <h4 className="font-bold text-lg sm:text-xl">ĐƯỜNG DÂY NÓNG KHIẾU NẠI</h4>
                <p className="text-sm text-white/90">Phản ánh chất lượng dịch vụ - Tiếp nhận 24/7</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <a 
                href="tel:0363212334" 
                className="bg-white text-red-600 hover:bg-red-50 font-bold text-xl sm:text-2xl px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center gap-2"
              >
                <span className="animate-bounce">🔥</span>
                <span>0363 212 334</span>
              </a>
              <div className="hidden sm:block text-white/80 text-sm max-w-xs">
                <p>• Khiếu nại dịch vụ</p>
                <p>• Góp ý cải thiện</p>
                <p>• Báo cáo sự cố</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="container-max section-padding">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {/* Thông tin công ty */}
          <div className="col-span-1 lg:col-span-1">
            <div className="flex items-center mb-4 group">
              <Image
                src="/images/tbs-logo.png"
                alt="TBS GROUP Logo"
                width={40}
                height={40}
                className="mr-3 w-8 h-8 sm:w-12 sm:h-12 group-hover:scale-110 transition-transform duration-300 rounded-lg"
              />
              <div className="text-xl sm:text-2xl font-bold text-primary-400 group-hover:text-primary-300 transition-colors duration-300">
                TBS GROUP
              </div>
            </div>
            <p className="text-sm sm:text-base text-gray-300 mb-4 leading-relaxed">
              Chuyên cung cấp dịch vụ nhập khẩu hàng hóa từ Trung Quốc chính ngạch, 
              minh bạch và uy tín.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://zalo.me/0976005335" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-blue-400 transition-colors touch-target"
                aria-label="Chat Zalo"
              >
                💬
              </a>
              <a 
                href="https://tiktok.com/@tbslogistics" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-pink-400 transition-colors touch-target"
                aria-label="TikTok"
              >
                🎵
              </a>
              <a 
                href="mailto:info@xuatnhapkhautbs.vn"
                className="text-gray-300 hover:text-green-400 transition-colors touch-target"
                aria-label="Email"
              >
                ✉️
              </a>
            </div>
          </div>

          {/* Dịch vụ */}
          <div className="col-span-1">
            <h3 className="text-base sm:text-lg font-semibold mb-4 flex items-center">
              <span className="text-lg sm:text-xl mr-2">🏢</span>
              Dịch vụ
            </h3>
            <ul className="space-y-2 text-sm sm:text-base text-gray-300">
              <li><a href="/dich-vu" className="hover:text-primary-400 transition-colors flex items-center py-1">
                <span className="mr-2">📋</span> Nhập khẩu chính ngạch
              </a></li>
              <li><a href="/dich-vu" className="hover:text-primary-400 transition-colors flex items-center py-1">
                <span className="mr-2">🚛</span> Vận chuyển đường bộ
              </a></li>
              <li><a href="/dich-vu" className="hover:text-primary-400 transition-colors flex items-center py-1">
                <span className="mr-2">🚢</span> Vận chuyển đường biển
              </a></li>
              <li><a href="/gioi-thieu" className="hover:text-primary-400 transition-colors flex items-center py-1">
                <span className="mr-2">📦</span> Gom hàng tại nguồn
              </a></li>
              <li><a href="/lien-he" className="hover:text-primary-400 transition-colors flex items-center py-1">
                <span className="mr-2">🎯</span> Tư vấn hải quan
              </a></li>
            </ul>
          </div>

          {/* Thông tin & Liên kết */}
          <div className="col-span-1">
            <h3 className="text-base sm:text-lg font-semibold mb-4 flex items-center">
              <span className="text-lg sm:text-xl mr-2">📰</span>
              Thông tin
            </h3>
            <ul className="space-y-2 text-sm sm:text-base text-gray-300">
              <li><a href="/tin-tuc" className="hover:text-primary-400 transition-colors flex items-center py-1">
                <span className="mr-2">📰</span> Tin tức XNK
              </a></li>
              <li><a href="/tuyen-dung" className="hover:text-primary-400 transition-colors flex items-center py-1">
                <span className="mr-2">💼</span> Tuyển dụng
              </a></li>
              <li><a href="/gioi-thieu" className="hover:text-primary-400 transition-colors flex items-center py-1">
                <span className="mr-2">ℹ️</span> Giới thiệu công ty
              </a></li>
              <li><a href="/cau-chuyen-khach-hang" className="hover:text-primary-400 transition-colors flex items-center py-1">
                <span className="mr-2">👥</span> Khách hàng
              </a></li>
              <li><a href="/chinh-sach" className="hover:text-primary-400 transition-colors flex items-center py-1">
                <span className="mr-2">📜</span> Chính sách
              </a></li>
            </ul>
          </div>

          {/* Liên hệ */}
          <div className="col-span-1">
            <h4 className="text-base sm:text-lg font-semibold text-white mb-4">Liên hệ</h4>
            <div className="space-y-3 text-xs sm:text-sm text-gray-300">
              <div>
                <p className="font-medium text-white mb-1">🏢 Trụ sở Hà Nội</p>
                <p className="text-gray-300">Kim Nỗ, Đông Anh, Hà Nội</p>
              </div>
              <div>
                <p className="font-medium text-white mb-1">🏢 Chi nhánh TP.HCM</p>
                <p className="text-gray-300">Xuân Thới Đông, Hóc Môn, TP.HCM</p>
              </div>
              <div className="pt-2 border-t border-gray-700">
                <p className="flex items-center py-1">
                  <span className="mr-2">📞</span>
                  <a href="tel:0976005335" className="hover:text-white transition-colors">0976 005 335</a>
                  <span className="ml-2 text-xs text-green-400">(Hotline)</span>
                </p>
                <p className="flex items-center py-1">
                  <span className="mr-2">🔥</span>
                  <a href="tel:0363212334" className="hover:text-yellow-400 transition-colors font-semibold">0363 212 334</a>
                  <span className="ml-2 text-xs text-orange-400">(Khiếu nại)</span>
                </p>
                <p className="flex items-center py-1">
                  <span className="mr-2">✉️</span>
                  <a href="mailto:info@xuatnhapkhautbs.vn" className="hover:text-white transition-colors break-all">info@xuatnhapkhautbs.vn</a>
                </p>
              </div>
            </div>
          </div>
        </div>



        {/* Copyright & DMCA */}
        <div className="border-t border-gray-700 mt-6 sm:mt-8 pt-6 sm:pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-xs sm:text-sm text-gray-400 text-center sm:text-left flex items-center">
              <span className="mr-2">©</span>
              2025 by TBS GROUP JSC. All rights reserved.
            </div>
            
            {/* DMCA Protection */}
            <div className="flex items-center gap-4">
              <div className="flex items-center text-xs text-gray-400">
                <span className="mr-2">🛡️</span>
                <span>DMCA Protected</span>
              </div>
              <div className="text-xs sm:text-sm text-gray-400 flex items-center gap-2">
                <span className="flex items-center">
                  <span className="mr-1">🏆</span>
                  <span>Dịch vụ chính ngạch</span>
                </span>
                <span className="hidden sm:inline">•</span>
                <span className="flex items-center">
                  <span className="mr-1">✨</span>
                  <span>Minh bạch - Uy tín</span>
                </span>
              </div>
            </div>
          </div>
          
          {/* Additional Legal Links */}
          <div className="flex flex-wrap justify-center sm:justify-start gap-4 mt-4 text-xs text-gray-500">
            <a href="/sitemap" className="hover:text-primary-400 transition-colors flex items-center font-medium">
              <span className="mr-1">🗺️</span>
              Site Map
            </a>
            <span>•</span>
            <a href="/chinh-sach/dieu-khoan" className="hover:text-primary-400 transition-colors">Điều khoản sử dụng</a>
            <span>•</span>
            <a href="/chinh-sach/cookie" className="hover:text-primary-400 transition-colors">Chính sách Cookie</a>
            <span>•</span>
            <a href="/chinh-sach/van-chuyen" className="hover:text-primary-400 transition-colors">Chính sách vận chuyển</a>
            <span>•</span>
            <a href="/chinh-sach/doi-tra" className="hover:text-primary-400 transition-colors">Chính sách đổi trả</a>
          </div>
        </div>
      </div>
    </footer>
  )
} 