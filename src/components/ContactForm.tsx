'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const contactSchema = z.object({
  fullName: z.string().min(2, 'Họ tên phải có ít nhất 2 ký tự'),
  phone: z.string().regex(/^[0-9]{10,11}$/, 'Số điện thoại không hợp lệ'),
  email: z.string().optional(),
  industry: z.string().min(1, 'Vui lòng chọn ngành hàng'),
  service: z.string().min(1, 'Vui lòng chọn dịch vụ'),
  productDetails: z.string().optional(),
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
      // Gửi email với dữ liệu form
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          email: data.email || '', // Xử lý email optional
          productDetails: data.productDetails || '' // Xử lý productDetails optional
        }),
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

  const services = [
    'Nhập khẩu chính ngạch',
    'Gom hàng lẻ, ghép container',
    'Vận chuyển quốc tế',
    'Ủy thác xuất nhập khẩu',
    'Tư vấn pháp lý & thuế XNK',
    'Kiểm tra nhà cung cấp',
    'Thanh toán hộ Trung Quốc',
    'Thông quan & chứng từ',
    'Đóng gói & bảo hiểm hàng',
    'Kho bãi Trung – Việt',
    'Cảnh báo rủi ro XNK',
    'Tư vấn tổng thể'
  ]

  return (
    <section id="contact" className="section-padding bg-white">
      <div className="container-max max-w-4xl">


        <div className="max-w-2xl mx-auto">
          {/* Form */}
          <div>
            <form onSubmit={handleSubmit(onSubmit)} className="card">
              <div className="space-y-6">
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                      Email
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
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

                  {/* Dịch vụ */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Dịch vụ quan tâm <span className="text-red-500">*</span>
                    </label>
                    <select
                      {...register('service')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="">Chọn dịch vụ</option>
                      {services.map((service) => (
                        <option key={service} value={service}>
                          {service}
                        </option>
                      ))}
                    </select>
                    {errors.service && (
                      <p className="mt-1 text-sm text-red-600">{errors.service.message}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Thông tin hàng hóa chi tiết */}
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Thông tin hàng hóa chi tiết
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