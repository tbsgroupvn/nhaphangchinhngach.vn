'use client'

import { useState, useEffect } from 'react'

export default function Testimonials() {
  const [currentSlide, setCurrentSlide] = useState(0)

  const testimonials = [
    {
      id: '1',
      name: 'Nguyễn Văn An',
      company: 'Cửa hàng An Phát Electronics',
      industry: 'Đồ gia dụng điện tử',
      avatar: '👨‍💼',
      feedback: 'Làm việc với TBS GROUP được 3 năm rồi, dịch vụ rất chuyên nghiệp. Hàng hóa luôn đúng chất lượng, giá cả minh bạch không có phí phát sinh. Đặc biệt team support 24/7 rất nhiệt tình.',
      rating: 5,
      orderValue: '800 triệu/tháng',
      location: 'Hà Nội'
    },
    {
      id: '2',
      name: 'Trần Thị Bình',
      company: 'Công ty TNHH Bình Minh',
      industry: 'Gia dụng nhà bếp',
      avatar: '👩‍💼',
      feedback: 'Quy trình chính ngạch hoàn toàn minh bạch, không lo về mặt pháp lý. TBS luôn cập nhật chính sách mới nhất, tư vấn rất chi tiết và chính xác.',
      rating: 5,
      orderValue: '1.5 tỷ/tháng',
      location: 'TP.HCM'
    },
    {
      id: '3',
      name: 'Lê Văn Cường',
      company: 'Siêu thị Cường Phát',
      industry: 'Đồ chơi trẻ em',
      avatar: '👨‍🔧',
      feedback: 'Đã từng gặp khó khăn với nhà cung cấp khác, nhưng từ khi làm việc với TBS thì mọi thứ rất thuận lợi. Thời gian giao hàng đúng hẹn, chất lượng sản phẩm tuyệt vời.',
      rating: 5,
      orderValue: '600 triệu/tháng',
      location: 'Đà Nẵng'
    },
    {
      id: '4',
      name: 'Phạm Thị Diệu',
      company: 'Chuỗi cửa hàng Diệu Linh',
      industry: 'Mỹ phẩm và làm đẹp',
      avatar: '👩‍💼',
      feedback: 'Dịch vụ tuyệt vời! TBS không chỉ vận chuyển mà còn hỗ trợ tìm nhà cung cấp uy tín. Đã tiết kiệm được rất nhiều chi phí và thời gian cho cửa hàng.',
      rating: 5,
      orderValue: '400 triệu/tháng',
      location: 'Hải Phòng'
    },
    {
      id: '5',
      name: 'Hoàng Minh Tuấn',
      company: 'Công ty Tuấn Anh Trading',
      industry: 'Máy móc công nghiệp',
      avatar: '👨‍🏭',
      feedback: 'Những máy móc công nghiệp cần độ chính xác cao. TBS đã đóng gói và vận chuyển rất cẩn thận, không một thiết bị nào bị hư hỏng. Đội ngũ rất chuyên nghiệp.',
      rating: 5,
      orderValue: '2.8 tỷ/tháng',
      location: 'Bình Dương'
    },
    {
      id: '6',
      name: 'Ngô Thị Thu Hà',
      company: 'Fashion Store Thu Hà',
      industry: 'Thời trang & phụ kiện',
      avatar: '👩‍💻',
      feedback: 'TBS đã giúp tôi tìm được những nhà cung cấp thời trang chất lượng với giá tốt nhất. Dịch vụ kiểm tra hàng hóa trước khi xuất rất đáng tin cậy.',
      rating: 5,
      orderValue: '350 triệu/tháng',
      location: 'Cần Thơ'
    }
  ]

  // Auto slide effect
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % testimonials.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [testimonials.length])

  return (
    <section className="section-padding bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 overflow-hidden">
      <div className="container-max">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            💬 Hơn 8000+ khách hàng đồng hành
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Những phản hồi chân thực từ khách hàng tin tưởng TBS GROUP
          </p>
          
          {/* Sliding stats */}
          <div className="flex items-center justify-center gap-8 sm:gap-12 mb-8">
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-primary-600">8000+</div>
              <div className="text-sm text-gray-600">Khách hàng</div>
            </div>
            <div className="h-8 w-px bg-gray-300"></div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-green-600">98%</div>
              <div className="text-sm text-gray-600">Hài lòng</div>
            </div>
            <div className="h-8 w-px bg-gray-300"></div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-purple-600">5 ⭐</div>
              <div className="text-sm text-gray-600">Đánh giá</div>
            </div>
          </div>
        </div>

        {/* Carousel testimonials */}
        <div className="relative max-w-4xl mx-auto">
          <div className="overflow-hidden rounded-2xl">
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {testimonials.map((testimonial, index) => (
                <div key={testimonial.id} className="w-full flex-shrink-0 px-4">
                  <div className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300 border border-gray-100">
                    <div className="flex items-center space-x-4 mb-6">
                      <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center text-2xl">
                        {testimonial.avatar}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900 text-lg">{testimonial.name}</h3>
                        <p className="text-primary-600 text-sm font-semibold">{testimonial.company}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-gray-500 text-xs">{testimonial.industry}</span>
                          <span className="text-gray-300">•</span>
                          <span className="text-gray-500 text-xs">{testimonial.location}</span>
                        </div>
                      </div>
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className="text-yellow-400 text-lg">⭐</span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="mb-6">
                      <p className="text-gray-700 leading-relaxed text-lg italic relative">
                        <span className="text-4xl text-primary-300 absolute -top-2 -left-2">&ldquo;</span>
                        <span className="relative z-10">{testimonial.feedback}</span>
                        <span className="text-4xl text-primary-300 absolute -bottom-4 -right-2">&rdquo;</span>
                      </p>
                    </div>
                    
                    <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                      <div className="text-center">
                        <p className="text-lg font-bold text-green-600">{testimonial.orderValue}</p>
                        <p className="text-xs text-gray-500">Đơn hàng/tháng</p>
                      </div>
                      <div className="text-primary-600 text-sm font-medium">
                        Khách hàng từ {new Date().getFullYear() - 2} ✓
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Navigation dots */}
          <div className="flex justify-center mt-8 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentSlide 
                    ? 'bg-primary-600 scale-125' 
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
          
          {/* Navigation arrows */}
          <button
            onClick={() => setCurrentSlide((prev) => (prev - 1 + testimonials.length) % testimonials.length)}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
          >
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={() => setCurrentSlide((prev) => (prev + 1) % testimonials.length)}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
          >
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Scrolling text banner */}
        <div className="mt-12 relative overflow-hidden bg-gradient-to-r from-primary-600 to-blue-600 rounded-2xl py-4">
          <div className="animate-scroll whitespace-nowrap">
            <span className="text-white font-medium text-lg mx-8">
              ⭐ Nguyễn Văn An: &quot;Dịch vụ tuyệt vời, tôi rất hài lòng!&quot; 
            </span>
            <span className="text-white font-medium text-lg mx-8">
              ⭐ Trần Thị Bình: &quot;Quy trình minh bạch, an tâm hoàn toàn!&quot;
            </span>
            <span className="text-white font-medium text-lg mx-8">
              ⭐ Lê Văn Cường: &quot;TBS đã giúp kinh doanh của tôi phát triển!&quot;
            </span>
            <span className="text-white font-medium text-lg mx-8">
              ⭐ Phạm Thị Diệu: &quot;Tiết kiệm chi phí, chất lượng cao!&quot;
            </span>
            <span className="text-white font-medium text-lg mx-8">
              ⭐ Hoàng Minh Tuấn: &quot;Đóng gói cẩn thận, vận chuyển an toàn!&quot;
            </span>
            <span className="text-white font-medium text-lg mx-8">
              ⭐ Ngô Thị Thu Hà: &quot;Tìm nhà cung cấp uy tín, giá tốt nhất!&quot;
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
