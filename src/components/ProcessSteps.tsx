export default function ProcessSteps() {
  const steps = [
    {
      number: 1,
      title: "Gửi yêu cầu / Tư vấn",
      description: "Liên hệ với chúng tôi qua hotline, email hoặc form tư vấn. Đội ngũ chuyên gia sẽ tư vấn miễn phí về sản phẩm và quy trình.",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      )
    },
    {
      number: 2,
      title: "Báo giá & Ký hợp đồng",
      description: "Nhận báo giá chi tiết và ký hợp đồng rõ ràng. Cam kết minh bạch về giá cả và điều khoản dịch vụ.",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    },
    {
      number: 3,
      title: "Thanh toán / Đặt cọc",
      description: "Thanh toán theo hợp đồng đã ký. Hỗ trợ nhiều hình thức thanh toán an toàn và thuận tiện.",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
      )
    },
    {
      number: 4,
      title: "Đặt hàng & Kiểm hàng",
      description: "Tiến hành đặt hàng tại Trung Quốc. Kiểm tra chất lượng hàng hóa trước khi vận chuyển về Việt Nam.",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      )
    },
    {
      number: 5,
      title: "Vận chuyển, thông quan",
      description: "Vận chuyển hàng hóa về Việt Nam và làm thủ tục thông quan. Theo dõi lộ trình thời gian thực.",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
        </svg>
      )
    },
    {
      number: 6,
      title: "Giao hàng & Xuất hóa đơn",
      description: "Giao hàng tận nơi theo yêu cầu. Xuất hóa đơn đầy đủ, hợp lệ để khách hàng hoàn tất thủ tục.",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8a2 2 0 012-2h10a2 2 0 012 2v10a2 2 0 01-2 2H7a2 2 0 01-2-2V8z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
        </svg>
      )
    }
  ]

  return (
    <section className="section-padding bg-gradient-to-b from-gray-50 to-white">
      <div className="container-max">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Quy trình mua hàng tại TBS GROUP
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            6 bước đơn giản để nhập khẩu hàng hóa từ Trung Quốc một cách chuyên nghiệp và minh bạch
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div 
              key={step.number}
              className="relative group"
            >
              {/* Connector Line - chỉ hiển thị trên desktop và không phải step cuối */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-16 left-full w-8 h-0.5 bg-gradient-to-r from-primary-300 to-transparent z-0"></div>
              )}
              
              <div className="card hover:shadow-xl transition-all duration-300 group-hover:scale-105 relative z-10 h-full">
                {/* Step Number */}
                <div className="flex items-center justify-center w-12 h-12 bg-primary-600 text-white rounded-full font-bold text-lg mb-6 mx-auto group-hover:bg-primary-700 transition-colors">
                  {step.number}
                </div>

                {/* Icon */}
                <div className="flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full text-primary-600 mb-6 mx-auto group-hover:bg-primary-200 transition-colors">
                  {step.icon}
                </div>

                {/* Content */}
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Hover Effect Border */}
                <div className="absolute inset-0 border-2 border-transparent group-hover:border-primary-200 rounded-lg transition-colors"></div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-primary-600 to-blue-600 rounded-2xl p-8 lg:p-12 text-white">
            <h3 className="text-2xl lg:text-3xl font-bold mb-4">
              Sẵn sàng bắt đầu quy trình nhập khẩu?
            </h3>
            <p className="text-lg text-primary-100 mb-8 max-w-2xl mx-auto">
              Liên hệ ngay với chúng tôi để được tư vấn miễn phí và bắt đầu hành trình nhập khẩu thành công
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="/lien-he" 
                className="bg-white text-primary-600 hover:bg-gray-100 font-semibold py-3 px-8 rounded-lg transition-colors inline-flex items-center justify-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                Tư vấn miễn phí
              </a>
              <a 
                href="tel:+84976005335" 
                className="border-2 border-white text-white hover:bg-white hover:text-primary-600 font-semibold py-3 px-8 rounded-lg transition-colors inline-flex items-center justify-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                Gọi ngay: 0976 005 335
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
} 