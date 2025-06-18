'use client'

import { useState } from 'react'
import Image from 'next/image'

export default function ZaloQR() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Floating Zalo Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group animate-pulse"
          title="Chat với Zalo"
        >
          <div className="relative">
            <span className="text-2xl">💬</span>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping"></div>
          </div>
        </button>
        
        {/* Tooltip */}
        <div className="absolute bottom-16 right-0 bg-gray-900 text-white text-sm px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
          Chat Zalo ngay
          <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
        </div>
      </div>

      {/* QR Code Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          ></div>
          
          {/* Modal Content */}
          <div className="relative bg-white rounded-2xl p-8 max-w-sm mx-4 shadow-2xl transform transition-all duration-300 scale-100">
            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
            >
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Header */}
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">📱</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Chat Zalo với TBS GROUP
              </h3>
              <p className="text-gray-600 text-sm">
                Quét mã QR để chat trực tiếp với chuyên viên tư vấn
              </p>
            </div>

            {/* QR Code - Real Image */}
            <div className="bg-gray-100 rounded-xl p-6 mb-6">
              <div className="w-48 h-48 mx-auto bg-white rounded-lg flex items-center justify-center border-2 border-gray-200 overflow-hidden">
                <Image
                  src="/images/zalo-qr.png"
                  alt="QR Code Zalo TBS GROUP"
                  width={192}
                  height={192}
                  className="object-contain"
                  priority
                  onError={(e) => {
                    // Fallback nếu không load được ảnh
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const parent = target.parentElement;
                    if (parent) {
                      parent.innerHTML = `
                        <div class="text-center">
                          <div class="text-4xl mb-2">📱</div>
                          <p class="text-gray-500 text-sm font-medium">Mã QR Zalo</p>
                          <p class="text-gray-400 text-xs mt-1">0888 888 888</p>
                        </div>
                      `;
                    }
                  }}
                />
              </div>
            </div>

            {/* Instructions */}
            <div className="space-y-3 mb-6">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-blue-600">1</span>
                </div>
                <p className="text-sm text-gray-600">Mở ứng dụng Zalo trên điện thoại</p>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-blue-600">2</span>
                </div>
                <p className="text-sm text-gray-600">Chọn biểu tượng quét mã QR</p>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-blue-600">3</span>
                </div>
                <p className="text-sm text-gray-600">Quét mã QR phía trên để bắt đầu chat</p>
              </div>
            </div>

            {/* Alternative Contact */}
            <div className="border-t border-gray-100 pt-6">
              <p className="text-sm text-gray-500 text-center mb-4">
                Hoặc liên hệ trực tiếp qua:
              </p>
              <div className="grid grid-cols-2 gap-3">
                <a
                  href="tel:+84888888888"
                  className="flex items-center justify-center space-x-2 bg-green-50 hover:bg-green-100 text-green-700 px-4 py-2 rounded-lg transition-colors"
                >
                  <span className="text-lg">📞</span>
                  <span className="text-sm font-medium">Gọi ngay</span>
                </a>
                
                <a
                  href="https://zalo.me/0976005335"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary w-full text-center"
                >
                  💬 Mở Zalo ngay
                </a>
              </div>
            </div>

            {/* Benefits */}
            <div className="mt-6 bg-yellow-50 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-lg">⚡</span>
                <h4 className="font-semibold text-yellow-800">Lợi ích khi chat Zalo:</h4>
              </div>
              <ul className="space-y-1 text-sm text-yellow-700">
                <li>• Phản hồi nhanh trong 5 phút</li>
                <li>• Tư vấn miễn phí 24/7</li>
                <li>• Báo giá chính xác ngay lập tức</li>
                <li>• Theo dõi đơn hàng realtime</li>
              </ul>
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                💬 Liên hệ qua Zalo
              </h3>
              <p className="text-gray-600 mb-4">
                Kết nối với TBS GROUP qua Zalo để được tư vấn nhanh chóng và miễn phí
              </p>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">📱</span>
                  <div>
                    <p className="font-medium">Hotline: 0976 005 335</p>
                    <p className="text-sm text-gray-500">Hỗ trợ 24/7</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">✉️</span>
                  <div>
                    <p className="font-medium">Email: info@xuatnhapkhautbs.vn</p>
                    <p className="text-sm text-gray-500">Phản hồi trong 1 giờ</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
