'use client'

import { useState } from 'react'

interface Route {
  id: string
  name: string
  origin: string
  destination: string
  methods: {
    road?: {
      pricePerKg: number
      pricePerM3: number
      timeMin: number
      timeMax: number
      advantages: string[]
    }
    sea?: {
      pricePerKg: number
      pricePerM3: number
      timeMin: number
      timeMax: number
      advantages: string[]
    }
    rail?: {
      pricePerKg: number
      pricePerM3: number
      timeMin: number
      timeMax: number
      advantages: string[]
    }
  }
}

export default function TransportRoutes() {
  const [activeRoute, setActiveRoute] = useState<string>('zhejiang-hanoi')
  const [activeMethod, setActiveMethod] = useState<string>('road')

  const routes: Route[] = [
    {
      id: 'zhejiang-hanoi',
      name: 'Chiết Giang - Hà Nội',
      origin: 'Chiết Giang (Zhejiang)',
      destination: 'Hà Nội',
      methods: {
        road: {
          pricePerKg: 6000,
          pricePerM3: 1400000,
          timeMin: 7,
          timeMax: 10,
          advantages: ['Linh hoạt thời gian', 'Giao hàng nhanh', 'Kiểm soát tiến độ tốt', 'Door-to-door service']
        },
        sea: {
          pricePerKg: 4500,
          pricePerM3: 900000,
          timeMin: 18,
          timeMax: 25,
          advantages: ['Tiết kiệm chi phí lô lớn', 'Giá ổn định', 'Phù hợp hàng cồng kềnh', 'An toàn cao']
        },
        rail: {
          pricePerKg: 5200,
          pricePerM3: 1100000,
          timeMin: 12,
          timeMax: 16,
          advantages: ['Ổn định thời gian', 'Nhanh hơn đường biển', 'Tiết kiệm hơn đường bộ', 'Ít ảnh hưởng thời tiết']
        }
      }
    },
    {
      id: 'zhejiang-hcmc',
      name: 'Chiết Giang - TP.HCM',
      origin: 'Chiết Giang (Zhejiang)',
      destination: 'TP. Hồ Chí Minh',
      methods: {
        road: {
          pricePerKg: 8000,
          pricePerM3: 1800000,
          timeMin: 10,
          timeMax: 14,
          advantages: ['Linh hoạt thời gian', 'Giao hàng nhanh', 'Kiểm soát tiến độ tốt', 'Phù hợp hàng gấp']
        },
        sea: {
          pricePerKg: 5000,
          pricePerM3: 1000000,
          timeMin: 20,
          timeMax: 28,
          advantages: ['Tiết kiệm chi phí lô lớn', 'Giá ổn định', 'Cảng lớn tiện lợi', 'Thủ tục đơn giản']
        },
        rail: {
          pricePerKg: 5800,
          pricePerM3: 1250000,
          timeMin: 14,
          timeMax: 18,
          advantages: ['Ổn định thời gian', 'Nhanh hơn đường biển', 'Chi phí hợp lý', 'Ít rủi ro thời tiết']
        }
      }
    },
    {
      id: 'pingxiang-hanoi',
      name: 'Bằng Tường - Hà Nội',
      origin: 'Bằng Tường (Pingxiang)',
      destination: 'Hà Nội',
      methods: {
        road: {
          pricePerKg: 5500,
          pricePerM3: 1200000,
          timeMin: 5,
          timeMax: 8,
          advantages: ['Cự ly ngắn nhất', 'Thời gian nhanh', 'Thủ tục đơn giản', 'Chi phí hợp lý']
        },
        rail: {
          pricePerKg: 4800,
          pricePerM3: 1000000,
          timeMin: 8,
          timeMax: 12,
          advantages: ['Giá tốt nhất', 'An toàn cao', 'Ổn định', 'Không tắc đường']
        }
      }
    },
    {
      id: 'pingxiang-hcmc',
      name: 'Bằng Tường - TP.HCM',
      origin: 'Bằng Tường (Pingxiang)',
      destination: 'TP. Hồ Chí Minh',
      methods: {
        road: {
          pricePerKg: 7500,
          pricePerM3: 1600000,
          timeMin: 8,
          timeMax: 12,
          advantages: ['Linh hoạt thời gian', 'Kiểm soát tốt', 'Giao tận nơi', 'Thủ tục nhanh']
        },
        rail: {
          pricePerKg: 6200,
          pricePerM3: 1300000,
          timeMin: 12,
          timeMax: 16,
          advantages: ['Chi phí hợp lý', 'Ổn định thời gian', 'An toàn cao', 'Ít ảnh hưởng thời tiết']
        }
      }
    }
  ]

  const currentRoute = routes.find(route => route.id === activeRoute)
  const methodIcons = {
    road: '🚛',
    sea: '🚢',
    rail: '🚄'
  }

  const methodNames = {
    road: 'Đường bộ',
    sea: 'Đường biển',
    rail: 'Đường sắt'
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount)
  }

  const priorityGoods = [
    { name: 'Đồ gia dụng nhựa', icon: '🥄' },
    { name: 'Gia dụng điện', icon: '🔌' },
    { name: 'Văn phòng phẩm', icon: '✏️' },
    { name: 'Nội thất', icon: '🪑' },
    { name: 'Đồ điện tử', icon: '📱' },
    { name: 'Máy móc mới', icon: '⚙️' },
    { name: 'Nguyên vật liệu sản xuất', icon: '🧱' }
  ]

  return (
    <section className="section-padding bg-gradient-to-br from-indigo-50 to-purple-50">
      <div className="container-max">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            🚛 Module vận chuyển đa tuyến
          </h2>
          <p className="text-xl text-gray-600">
            Lựa chọn tuyến đường và phương thức vận chuyển phù hợp với nhu cầu của bạn
          </p>
        </div>

        {/* Route Selection */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">Chọn tuyến vận chuyển:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {routes.map(route => (
              <button
                key={route.id}
                onClick={() => setActiveRoute(route.id)}
                className={`p-4 rounded-lg border-2 transition-all duration-300 ${
                  activeRoute === route.id
                    ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                    : 'border-gray-200 bg-white hover:border-indigo-300'
                }`}
              >
                <div className="text-sm font-medium">{route.name}</div>
                <div className="text-xs text-gray-500 mt-1">
                  {route.origin} → {route.destination}
                </div>
              </button>
            ))}
          </div>
        </div>

        {currentRoute && (
          <>
            {/* Method Selection */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">Phương thức vận chuyển:</h3>
              <div className="flex flex-wrap justify-center gap-4">
                {Object.keys(currentRoute.methods).map(method => (
                  <button
                    key={method}
                    onClick={() => setActiveMethod(method)}
                    className={`px-6 py-3 rounded-lg border-2 transition-all duration-300 flex items-center space-x-2 ${
                      activeMethod === method
                        ? 'border-indigo-500 bg-indigo-500 text-white'
                        : 'border-gray-200 bg-white hover:border-indigo-300'
                    }`}
                  >
                    <span className="text-xl">{methodIcons[method as keyof typeof methodIcons]}</span>
                    <span className="font-medium">{methodNames[method as keyof typeof methodNames]}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Pricing Table */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
              {/* Pricing Info */}
              <div className="card">
                <h4 className="text-xl font-semibold mb-6 flex items-center">
                  <span className="text-2xl mr-3">{methodIcons[activeMethod as keyof typeof methodIcons]}</span>
                  Bảng giá {methodNames[activeMethod as keyof typeof methodNames]}
                </h4>
                
                {currentRoute.methods[activeMethod as keyof typeof currentRoute.methods] && (
                  <div className="space-y-4">
                    <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-6">
                      <h5 className="font-semibold text-gray-900 mb-4">Tuyến: {currentRoute.name}</h5>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="bg-white rounded-lg p-4">
                          <div className="text-sm text-gray-600">Giá theo trọng lượng</div>
                          <div className="text-xl font-bold text-indigo-600">
                            {formatCurrency(currentRoute.methods[activeMethod as keyof typeof currentRoute.methods]?.pricePerKg || 0)}/kg
                          </div>
                        </div>
                        
                        <div className="bg-white rounded-lg p-4">
                          <div className="text-sm text-gray-600">Giá theo thể tích</div>
                          <div className="text-xl font-bold text-indigo-600">
                            {formatCurrency(currentRoute.methods[activeMethod as keyof typeof currentRoute.methods]?.pricePerM3 || 0)}/m³
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-white rounded-lg p-4">
                        <div className="text-sm text-gray-600">Thời gian vận chuyển</div>
                        <div className="text-lg font-semibold text-green-600">
                          {currentRoute.methods[activeMethod as keyof typeof currentRoute.methods]?.timeMin}-
                          {currentRoute.methods[activeMethod as keyof typeof currentRoute.methods]?.timeMax} ngày
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Advantages */}
              <div className="card">
                <h4 className="text-xl font-semibold mb-6 flex items-center">
                  <span className="text-2xl mr-3">✨</span>
                  Lợi ích vượt trội
                </h4>
                
                {currentRoute.methods[activeMethod as keyof typeof currentRoute.methods] && (
                  <div className="space-y-3">
                    {currentRoute.methods[activeMethod as keyof typeof currentRoute.methods]?.advantages.map((advantage, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        </div>
                        <span className="text-gray-700">{advantage}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Priority Goods */}
            <div className="card mb-8">
              <h4 className="text-xl font-semibold mb-6 flex items-center">
                <span className="text-2xl mr-3">📦</span>
                Ngành hàng ưu tiên
              </h4>
              
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                {priorityGoods.map((good, index) => (
                  <div key={index} className="text-center p-3 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg hover:from-blue-100 hover:to-indigo-100 transition-colors">
                    <div className="text-2xl mb-2">{good.icon}</div>
                    <div className="text-xs font-medium text-gray-700">{good.name}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Important Notes */}
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-6 border-l-4 border-yellow-400">
              <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                <span className="text-2xl mr-3">⚠️</span>
                Chính sách minh bạch & Lưu ý quan trọng
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                <div>
                  <h5 className="font-semibold text-gray-800 mb-2">📋 Bao gồm trong giá:</h5>
                  <ul className="space-y-1 text-gray-700">
                    <li>• Vận chuyển từ kho TQ đến kho VN</li>
                    <li>• Phí ủy thác 1.5% - 3% (tùy giá trị lô hàng)</li>
                    <li>• Khai báo hải quan cơ bản</li>
                    <li>• Bảo hiểm hàng hóa</li>
                  </ul>
                </div>
                
                <div>
                  <h5 className="font-semibold text-gray-800 mb-2">💰 Chưa bao gồm:</h5>
                  <ul className="space-y-1 text-gray-700">
                    <li>• Thuế nhập khẩu (tùy mặt hàng)</li>
                    <li>• VAT 10%</li>
                    <li>• Phí giao hàng tận nơi</li>
                    <li>• Phí lưu kho quá hạn</li>
                  </ul>
                </div>
              </div>
              
              <div className="mt-4 p-4 bg-white rounded-lg">
                <p className="text-sm text-gray-700">
                  <strong>Cam kết minh bạch:</strong> Tất cả chi phí được báo trước, không phát sinh. 
                  Giá có thể thay đổi theo biến động tỷ giá và giá nhiên liệu. 
                  Liên hệ <strong className="text-indigo-600">0976 005 335</strong> để được báo giá chính xác nhất.
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  )
}
