'use client'

import { useState, useEffect } from 'react'

export default function Testimonials() {
  const [currentSlide, setCurrentSlide] = useState(0)

  const testimonials = [
    {
      id: '1',
      name: 'Nguyễn Văn An',
      company: 'Cửa hàng An Phát',
      industry: 'Đồ gia dụng nhựa',
      avatar: '👨‍💼',
      feedback: 'Làm việc với TBS GROUP được 2 năm rồi, dịch vụ rất chuyên nghiệp. Hàng hóa luôn đúng chất lượng, thời gian giao hàng chính xác.',
      rating: 5,
      orderValue: '500 triệu/tháng'
    },
    {
      id: '2',
      name: 'Trần Thị Bình',
      company: 'Công ty TNHH Bình Minh',
      industry: 'Gia dụng điện',
      avatar: '👩‍💼',
      feedback: 'Giá cả minh bạch, không phát sinh chi phí. Quy trình chính ngạch nên rất an tâm về mặt pháp lý.',
      rating: 5,
      orderValue: '1.2 tỷ/tháng'
    }
  ]

  return (
    <section className="section-padding bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="container-max">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            💬 Khách hàng nói về chúng tôi
          </h2>
          <p className="text-xl text-gray-600">
            Hơn 1000+ khách hàng tin tưởng và đồng hành cùng TBS GROUP
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="card hover:shadow-xl transition-all duration-300">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center text-2xl">
                  {testimonial.avatar}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{testimonial.name}</h3>
                  <p className="text-purple-600 text-sm font-medium">{testimonial.company}</p>
                  <p className="text-gray-500 text-xs">{testimonial.industry}</p>
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed italic mb-4">
                &ldquo;{testimonial.feedback}&rdquo;
              </p>
              <div className="text-center pt-4 border-t border-gray-100">
                <p className="text-sm font-semibold text-purple-600">{testimonial.orderValue}</p>
                <p className="text-xs text-gray-500">Đơn hàng/tháng</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
