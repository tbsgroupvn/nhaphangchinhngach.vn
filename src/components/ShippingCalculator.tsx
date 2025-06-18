'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const schema = z.object({
  weight: z.number().min(0.1, 'Trọng lượng phải lớn hơn 0'),
  volume: z.number().min(0.01, 'Thể tích phải lớn hơn 0'),
  value: z.number().min(1000, 'Giá trị hàng hóa tối thiểu 1,000 VND'),
  route: z.string().min(1, 'Vui lòng chọn tuyến vận chuyển'),
  transport: z.string().min(1, 'Vui lòng chọn phương thức vận chuyển'),
  industry: z.string().min(1, 'Vui lòng chọn ngành hàng')
})

type FormData = z.infer<typeof schema>

export default function ShippingCalculator() {
  const [result, setResult] = useState<any>(null)
  
  const { register, handleSubmit, formState: { errors }, watch } = useForm<FormData>({
    resolver: zodResolver(schema)
  })

  const routes = [
    { value: 'pingxiang-hanoi', label: 'Bằng Tường - Hà Nội', pricePerKg: 5500, pricePerM3: 1200000 },
    { value: 'pingxiang-hcmc', label: 'Bằng Tường - TP.HCM', pricePerKg: 7500, pricePerM3: 1600000 },
    { value: 'zhejiang-hanoi', label: 'Chiết Giang - Hà Nội', pricePerKg: 6000, pricePerM3: 1400000 },  
    { value: 'zhejiang-hcmc', label: 'Chiết Giang - TP.HCM', pricePerKg: 8000, pricePerM3: 1800000 }
  ]

  const transportMethods = [
    { value: 'road', label: '🚛 Đường bộ', multiplier: 1.0, time: '5-14 ngày' },
    { value: 'sea', label: '🚢 Đường biển', multiplier: 0.75, time: '18-28 ngày' },
    { value: 'rail', label: '🚄 Đường sắt', multiplier: 0.85, time: '8-18 ngày' }
  ]

  const industries = [
    'Đồ gia dụng nhựa',
    'Gia dụng điện',
    'Văn phòng phẩm',
    'Nội thất',
    'Đồ điện tử',
    'Máy móc',
    'Nguyên vật liệu',
    'Khác'
  ]

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount)
  }

  const onSubmit = (data: FormData) => {
    const selectedRoute = routes.find(r => r.value === data.route)
    const selectedTransport = transportMethods.find(t => t.value === data.transport)
    
    if (!selectedRoute || !selectedTransport) return

    // Tính phí vận chuyển theo trọng lượng và thể tích
    const weightCost = data.weight * selectedRoute.pricePerKg * selectedTransport.multiplier
    const volumeCost = data.volume * selectedRoute.pricePerM3 * selectedTransport.multiplier
    const shippingCost = Math.max(weightCost, volumeCost) // Lấy giá cao hơn

    // Phí ủy thác 1.5%
    const commissionFee = data.value * 0.015

    // Ước tính thuế (VAT + thuế nhập khẩu tùy ngành)
    const getTaxRate = (industry: string) => {
      switch (industry) {
        case 'Đồ gia dụng nhựa': return 0.18 // 5% thuế NK + 10% VAT + 3% phí khác
        case 'Gia dụng điện': return 0.22 // 10% thuế NK + 10% VAT + 2% phí khác
        case 'Văn phòng phẩm': return 0.15 // 3% thuế NK + 10% VAT + 2% phí khác
        case 'Nội thất': return 0.20 // 8% thuế NK + 10% VAT + 2% phí khác
        case 'Đồ điện tử': return 0.28 // 15% thuế NK + 10% VAT + 3% phí khác
        case 'Máy móc': return 0.12 // 0% thuế NK + 10% VAT + 2% phí khác
        case 'Nguyên vật liệu': return 0.15 // 3% thuế NK + 10% VAT + 2% phí khác
        default: return 0.18 // Mặc định
      }
    }
    const estimatedTax = data.value * getTaxRate(data.industry)

    const total = shippingCost + commissionFee + estimatedTax

    setResult({
      route: selectedRoute.label,
      transport: selectedTransport.label,
      deliveryTime: selectedTransport.time,
      shippingCost,
      commissionFee,
      estimatedTax,
      total,
      details: {
        weightCost,
        volumeCost,
        selectedBy: weightCost > volumeCost ? 'Tính theo trọng lượng' : 'Tính theo thể tích'
      }
    })
  }

  const handleSendInquiry = () => {
    if (!result) return
    
    const message = `Yêu cầu báo giá chi tiết:
Tuyến: ${result.route}
Phương thức: ${result.transport}
Thời gian: ${result.deliveryTime}
Tổng ước tính: ${formatCurrency(result.total)}

Vui lòng liên hệ để xác nhận giá chính xác.`
    
    // Chuyển đến trang liên hệ với thông tin đã điền sẵn
    window.location.href = `/lien-he?message=${encodeURIComponent(message)}`
  }

  return (
    <section className="section-padding bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="container-max">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            🧮 Tính cước vận chuyển & Thuế tự động
          </h2>
          <p className="text-xl text-gray-600">
            Nhập thông tin hàng hóa để nhận ước tính chi phí minh bạch
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Form */}
          <div className="card">
            <h3 className="text-xl font-semibold mb-6">Thông tin hàng hóa</h3>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Trọng lượng (kg) *
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    {...register('weight', { valueAsNumber: true })}
                    className="input-field"
                    placeholder="VD: 100"
                  />
                  {errors.weight && (
                    <p className="text-red-500 text-sm mt-1">{errors.weight.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Thể tích (m³) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    {...register('volume', { valueAsNumber: true })}
                    className="input-field"
                    placeholder="VD: 2.5"
                  />
                  {errors.volume && (
                    <p className="text-red-500 text-sm mt-1">{errors.volume.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Giá trị hàng hóa (VND) *
                </label>
                <input
                  type="number"
                  {...register('value', { valueAsNumber: true })}
                  className="input-field"
                  placeholder="VD: 50000000"
                />
                {errors.value && (
                  <p className="text-red-500 text-sm mt-1">{errors.value.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tuyến vận chuyển *
                </label>
                <select {...register('route')} className="input-field">
                  <option value="">Chọn tuyến vận chuyển</option>
                  {routes.map(route => (
                    <option key={route.value} value={route.value}>
                      {route.label}
                    </option>
                  ))}
                </select>
                {errors.route && (
                  <p className="text-red-500 text-sm mt-1">{errors.route.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phương thức vận chuyển *
                </label>
                <select {...register('transport')} className="input-field">
                  <option value="">Chọn phương thức</option>
                  {transportMethods.map(method => (
                    <option key={method.value} value={method.value}>
                      {method.label} - {method.time}
                    </option>
                  ))}
                </select>
                {errors.transport && (
                  <p className="text-red-500 text-sm mt-1">{errors.transport.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ngành hàng *
                </label>
                <select {...register('industry')} className="input-field">
                  <option value="">Chọn ngành hàng</option>
                  {industries.map(industry => (
                    <option key={industry} value={industry}>
                      {industry}
                    </option>
                  ))}
                </select>
                {errors.industry && (
                  <p className="text-red-500 text-sm mt-1">{errors.industry.message}</p>
                )}
              </div>

              <button type="submit" className="btn-primary w-full">
                🧮 Tính toán chi phí
              </button>
            </form>
          </div>

          {/* Results */}
          <div className="card">
            <h3 className="text-xl font-semibold mb-6">Kết quả ước tính</h3>
            
            {result ? (
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-6">
                  <h4 className="font-semibold text-gray-900 mb-4">Thông tin vận chuyển</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Tuyến:</span>
                      <span className="font-medium">{result.route}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Phương thức:</span>
                      <span className="font-medium">{result.transport}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Thời gian dự kiến:</span>
                      <span className="font-medium text-green-600">{result.deliveryTime}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900">Chi tiết chi phí:</h4>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <span className="text-sm text-gray-600">Phí vận chuyển</span>
                        <div className="text-xs text-gray-500">
                          {result.details.selectedBy}
                        </div>
                      </div>
                      <span className="font-semibold text-indigo-600">
                        {formatCurrency(result.shippingCost)}
                      </span>
                    </div>

                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-600">Phí ủy thác (1.5%)</span>
                      <span className="font-semibold text-blue-600">
                        {formatCurrency(result.commissionFee)}
                      </span>
                    </div>

                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-600">Ước tính thuế</span>
                      <span className="font-semibold text-orange-600">
                        {formatCurrency(result.estimatedTax)}
                      </span>
                    </div>

                    <div className="flex justify-between items-center p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border-2 border-green-200">
                      <span className="font-semibold text-gray-900">Tổng ước tính:</span>
                      <span className="text-xl font-bold text-green-600">
                        {formatCurrency(result.total)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <button 
                    onClick={handleSendInquiry}
                    className="btn-primary w-full"
                  >
                    📨 Gửi yêu cầu báo giá chính xác
                  </button>
                </div>

                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
                  <h5 className="font-semibold text-gray-900 mb-2">⚠️ Lưu ý quan trọng:</h5>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Đây chỉ là ước tính, giá chính xác được báo sau khi thẩm định hàng</li>
                    <li>• Thuế phụ thuộc vào mã HS và chính sách hiện hành</li>
                    <li>• Phí có thể thay đổi theo biến động tỷ giá và giá nhiên liệu</li>
                    <li>• Liên hệ <span className="font-semibold text-indigo-600">0976 005 335</span> để được tư vấn chi tiết</li>
                  </ul>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-4xl mb-4">🧮</div>
                <p className="text-gray-500">
                  Nhập thông tin hàng hóa để nhận kết quả ước tính chi phí
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
} 