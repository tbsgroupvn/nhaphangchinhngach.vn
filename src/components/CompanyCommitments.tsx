import React from 'react'

const CompanyCommitments = () => {
  const commitments = [
    {
      title: "Chính ngạch – khai báo chuẩn số lượng, giá trị",
      description: "Cam kết minh bạch trong mọi giao dịch"
    },
    {
      title: "Không phí ẩn, không phát sinh sau khi ký",
      description: "Giá cả rõ ràng từ đầu đến cuối"
    },
    {
      title: "Chịu trách nhiệm A-Z, giải quyết khiếu nại",
      description: "Đồng hành cùng khách hàng trong mọi tình huống"
    },
    {
      title: "Tư vấn pháp lý & thuế vụ đầy đủ",
      description: "Hỗ trợ chuyên sâu về mặt pháp lý"
    },
    {
      title: "Bảo vệ quyền lợi khách hàng tối đa",
      description: "Ưu tiên lợi ích khách hàng trên hết"
    },
    {
      title: "Ưu tiên quan hệ lâu dài, phát triển bền vững",
      description: "Xây dựng niềm tin qua từng dự án"
    }
  ]

  return (
    <section className="section-padding bg-white">
      <div className="container-max">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Cam kết của TBS GROUP
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Những cam kết thiết thực để mang đến dịch vụ tốt nhất cho khách hàng
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {commitments.map((commitment, index) => (
            <div 
              key={index}
              className="bg-gradient-to-br from-blue-50 to-white rounded-xl p-6 border border-blue-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group"
            >
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
                <div className="flex-grow">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 leading-tight">
                    {commitment.title}
                  </h3>
                  <p className="text-gray-600 font-medium text-sm">
                    {commitment.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <div className="bg-blue-600 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">
              Sẵn sàng trải nghiệm dịch vụ chuyên nghiệp?
            </h3>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              Liên hệ ngay để được tư vấn miễn phí và nhận báo giá tốt nhất cho dự án của bạn
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="/lien-he" 
                className="bg-white text-blue-600 hover:bg-gray-100 font-medium py-3 px-6 rounded-lg transition-colors inline-flex items-center justify-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                Tư vấn miễn phí
              </a>
              <a 
                href="tel:0976005335" 
                className="border-2 border-white text-white hover:bg-white hover:text-blue-600 font-medium py-3 px-6 rounded-lg transition-colors inline-flex items-center justify-center"
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

export default CompanyCommitments 