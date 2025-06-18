'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const contactSchema = z.object({
  fullName: z.string().min(2, 'Họ tên phải có ít nhất 2 ký tự'),
  phone: z.string().regex(/^[0-9]{10,11}$/, 'Số điện thoại không hợp lệ'),
  email: z.string().email('Email không hợp lệ'),
  industry: z.string().min(1, 'Vui lòng chọn ngành hàng'),
  productDetails: z.string().min(10, 'Vui lòng mô tả chi tiết hàng hóa (ít nhất 10 ký tự)'),
})

type ContactFormData = z.infer<typeof contactSchema>

export default function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  })

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true)
    setSubmitMessage('')

    try {
      // Giả lập gửi email
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        setSubmitMessage('Cảm ơn bạn! Chúng tôi sẽ liên hệ lại trong vòng 24h.')
        reset()
      } else {
        throw new Error('Có lỗi xảy ra')
      }
    } catch (error) {
      setSubmitMessage('Có lỗi xảy ra. Vui lòng thử lại hoặc liên hệ trực tiếp qua số hotline.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const industries = [
    'Đồ gia dụng nhựa',
    'Gia dụng điện',
    'Văn phòng phẩm',
    'Nội thất',
    'Đồ điện tử',
    'Máy móc mới',
    'Nguyên vật liệu sản xuất',
    'Khác (ghi rõ trong mô tả)',
  ]

  return (
    <section id="contact" className="section-padding bg-white">
      <div className="container-max max-w-4xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Đăng ký tư vấn miễn phí
          </h2>
          <p className="text-xl text-gray-600">
            Để lại thông tin, chúng tôi sẽ báo giá chính xác và tư vấn chi tiết
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Thông tin liên hệ */}
          <div className="lg:col-span-1">
            <div className="card h-fit">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Thông tin liên hệ</h3>
              
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-primary-600 text-lg">📞</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Hotline 24/7</h4>
                    <p className="text-gray-600">
                      <a href="tel:0976005335" className="text-primary-600 hover:text-primary-700">
                        0976 005 335
                      </a>
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-primary-600 text-lg">✉️</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Email</h4>
                    <p className="text-gray-600">
                      <a href="mailto:info@xuatnhapkhautbs.vn" className="text-primary-600 hover:text-primary-700">
                        info@xuatnhapkhautbs.vn
                      </a>
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-primary-600 text-lg">💬</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Chat Zalo</h4>
                    <p className="text-gray-600">
                      <a href="https://zalo.me/0976005335" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:text-primary-700">
                        zalo.me/0976005335
                      </a>
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-primary-600 text-lg">🏢</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Công ty</h4>
                    <p className="text-gray-600 text-sm">
                      <strong>Tiếng Việt:</strong> Công ty Cổ phần TBS GROUP<br/>
                      <strong>English:</strong> TBS GROUP JSC
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-primary-600 text-lg">📍</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Địa chỉ</h4>
                    <p className="text-gray-600 text-sm">
                      <strong>Trụ sở công ty:</strong> Kim Nỗ, Đông Anh, Hà Nội<br/>
                      <strong>Chi nhánh miền Nam:</strong> Xuân Thới Đông, Hóc Môn, TP.HCM
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-primary-600 text-lg">🎵</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">TikTok</h4>
                    <p className="text-gray-600">
                      <a href="https://tiktok.com/@tbslogistics" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:text-primary-700">
                        @tbslogistics
                      </a>
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-600">
                  <strong>Cam kết:</strong> Bảo mật thông tin khách hàng tuyệt đối. 
                  Chỉ sử dụng thông tin để tư vấn dịch vụ.
                </p>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit(onSubmit)} className="card">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Họ tên */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Họ và tên <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    {...register('fullName')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Nhập họ và tên"
                  />
                  {errors.fullName && (
                    <p className="mt-1 text-sm text-red-600">{errors.fullName.message}</p>
                  )}
                </div>

                {/* Số điện thoại */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Số điện thoại <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    {...register('phone')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="0976 005 335"
                  />
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    {...register('email')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="example@email.com"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                  )}
                </div>

                {/* Ngành hàng */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ngành hàng <span className="text-red-500">*</span>
                  </label>
                  <select
                    {...register('industry')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">Chọn ngành hàng</option>
                    {industries.map((industry) => (
                      <option key={industry} value={industry}>
                        {industry}
                      </option>
                    ))}
                  </select>
                  {errors.industry && (
                    <p className="mt-1 text-sm text-red-600">{errors.industry.message}</p>
                  )}
                </div>
              </div>

              {/* Thông tin hàng hóa chi tiết */}
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Thông tin hàng hóa chi tiết <span className="text-red-500">*</span>
                </label>
                <textarea
                  {...register('productDetails')}
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Vui lòng mô tả chi tiết:&#10;- Thương hiệu, tên sản phẩm&#10;- Số lượng dự kiến&#10;- Kích thước, cân nặng ước tính&#10;- Chất liệu, công dụng&#10;- Yêu cầu đặc biệt (nếu có)"
                />
                {errors.productDetails && (
                  <p className="mt-1 text-sm text-red-600">{errors.productDetails.message}</p>
                )}
              </div>

              {/* Submit button */}
              <div className="mt-8">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full btn-primary py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Đang gửi...' : 'Gửi yêu cầu tư vấn'}
                </button>
              </div>

              {/* Submit message */}
              {submitMessage && (
                <div className={`mt-4 p-4 rounded-md ${
                  submitMessage.includes('Cảm ơn') 
                    ? 'bg-green-50 text-green-800 border border-green-200' 
                    : 'bg-red-50 text-red-800 border border-red-200'
                }`}>
                  {submitMessage}
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}