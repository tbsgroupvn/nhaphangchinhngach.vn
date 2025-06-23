import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import BackToTop from '@/components/BackToTop'
import MessengerButton from '@/components/MessengerButton'
import Link from 'next/link'
import { Metadata } from 'next'
import { services, serviceCategories } from '@/data/services'

export const metadata: Metadata = {
  title: 'Dịch vụ TBS GROUP - 11 Dịch vụ nhập khẩu Trung Quốc chuyên nghiệp',
  description: 'TBS GROUP cung cấp 11 dịch vụ chuyên nghiệp: Nhập khẩu chính ngạch, vận chuyển quốc tế, gom hàng lẻ, tư vấn pháp lý, kho bãi và nhiều dịch vụ khác.',
  keywords: 'dịch vụ nhập khẩu, nhập khẩu chính ngạch, vận chuyển quốc tế, gom hàng lẻ, TBS GROUP, xuất nhập khẩu, logistics'
}

export default function ServicesPage() {
  const servicesByCategory = services.reduce((acc, service) => {
    const category = service.category
    if (!acc[category]) {
      acc[category] = []
    }
    acc[category].push(service)
    return acc
  }, {} as Record<string, typeof services>)

  const categoryColors = {
    import: 'from-blue-500 to-blue-600',
    logistics: 'from-green-500 to-green-600',
    consulting: 'from-purple-500 to-purple-600', 
    support: 'from-orange-500 to-orange-600'
  }

  const categoryHoverColors = {
    import: 'hover:from-blue-600 hover:to-blue-700',
    logistics: 'hover:from-green-600 hover:to-green-700',
    consulting: 'hover:from-purple-600 hover:to-purple-700', 
    support: 'hover:from-orange-600 hover:to-orange-700'
  }

  return (
    <main className="min-h-screen">
      <Navbar />
      
      {/* Hero Banner Section */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.6)), url('https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')`
          }}
        ></div>

        {/* Animated Background Elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-20 w-32 h-32 bg-sky-400 rounded-full animate-pulse"></div>
          <div className="absolute bottom-32 right-32 w-24 h-24 bg-slate-300 rounded-full animate-bounce"></div>
          <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-sky-300 rounded-full animate-ping"></div>
          <div className="absolute bottom-20 left-1/3 w-20 h-20 bg-slate-400 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        {/* Content */}
        <div className="container-max relative z-10 text-center text-white">
          <div className="max-w-5xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center px-6 py-3 bg-sky-500/90 backdrop-blur-sm rounded-full text-white font-semibold mb-8 shadow-xl hover:bg-sky-600/90 transition-all duration-300">
              <span className="text-xl mr-2">🚢</span>
              Dịch vụ logistics chuyên nghiệp từ Trung Quốc
            </div>

            {/* Main Title */}
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              <span className="block">Dịch vụ</span>
              <span className="block bg-gradient-to-r from-sky-400 to-slate-200 bg-clip-text text-transparent">
                TBS GROUP
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto mb-8 leading-relaxed">
              <strong>11 dịch vụ chuyên nghiệp</strong> giúp doanh nghiệp nhập khẩu từ Trung Quốc 
              <span className="text-sky-300"> hiệu quả, an toàn và tiết kiệm chi phí</span>
            </p>

            {/* Value Proposition */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 mb-10 border border-white/20">
              <h2 className="text-2xl font-bold mb-3 text-sky-300">
                &ldquo;Chúng tôi không chỉ vận chuyển hàng hóa, mà bảo vệ toàn bộ lợi ích của bạn&rdquo;
              </h2>
              <p className="text-lg text-gray-200">
                Từ khâu tìm nhà cung cấp đến khi hàng về tay - TBS chịu trách nhiệm hoàn toàn
              </p>
            </div>

            {/* Benefits */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300">
                <div className="text-3xl mb-3">💰</div>
                <h3 className="font-bold text-lg mb-2">Tiết kiệm 30% chi phí</h3>
                <p className="text-sm text-gray-300">So với nhập khẩu truyền thống</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300">
                <div className="text-3xl mb-3">⚡</div>
                <h3 className="font-bold text-lg mb-2">Nhanh hơn 50% thời gian</h3>
                <p className="text-sm text-gray-300">Quy trình tối ưu hóa</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300">
                <div className="text-3xl mb-3">🛡️</div>
                <h3 className="font-bold text-lg mb-2">An toàn 100%</h3>
                <p className="text-sm text-gray-300">Bảo hiểm toàn diện</p>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="tel:+84976005335" 
                className="inline-flex items-center justify-center px-8 py-4 bg-sky-500 hover:bg-sky-600 text-white font-bold rounded-full transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl text-lg group"
              >
                <svg className="w-6 h-6 mr-2 group-hover:animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                Hotline: 0976 005 335
              </a>
              <Link 
                href="/lien-he" 
                className="inline-flex items-center justify-center px-8 py-4 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white font-bold rounded-full border border-white/40 transition-all duration-300 transform hover:scale-105 text-lg group"
              >
                <svg className="w-6 h-6 mr-2 group-hover:animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                Tư vấn miễn phí
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll Down Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white animate-bounce">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* Services by Category */}
      {Object.entries(servicesByCategory).map(([category, categoryServices], categoryIndex) => {
        const bgColors = [
          'bg-gradient-to-br from-blue-50 to-indigo-50',
          'bg-gradient-to-br from-green-50 to-emerald-50', 
          'bg-gradient-to-br from-purple-50 to-pink-50',
          'bg-gradient-to-br from-orange-50 to-red-50'
        ];
        return (
        <section key={category} className={`py-12 md:py-14 ${bgColors[categoryIndex % bgColors.length]}`}>
          <div className="container-max">
            <div className="text-center mb-12">
              <div className={`inline-block px-8 py-3 bg-gradient-to-r ${categoryColors[category as keyof typeof categoryColors]} ${categoryHoverColors[category as keyof typeof categoryHoverColors]} text-white rounded-full text-base font-semibold mb-6 hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-xl`}>
                <span className="mr-2 text-xl">{serviceCategories[category as keyof typeof serviceCategories].icon}</span>
                Dịch vụ {serviceCategories[category as keyof typeof serviceCategories].name}
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                {serviceCategories[category as keyof typeof serviceCategories].name}
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Giải pháp {serviceCategories[category as keyof typeof serviceCategories].name.toLowerCase()} chuyên nghiệp cho doanh nghiệp
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {categoryServices.map((service, index) => (
                <div 
                  key={service.slug} 
                  className="service-card group"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Service Icon & Title */}
                  <div className="flex items-start mb-6">
                    <div className="w-16 h-16 bg-gradient-to-r from-primary-100 to-primary-200 rounded-2xl flex items-center justify-center mr-4 group-hover:from-primary-200 group-hover:to-primary-300 transition-all duration-300 group-hover:scale-110 group-hover:rotate-6 shadow-lg">
                      <span className="text-3xl group-hover:animate-bounce">{service.icon}</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors duration-300 mb-2">
                        {service.title}
                      </h3>
                      <div className="w-12 h-1 bg-gradient-to-r from-primary-600 to-primary-400 rounded-full group-hover:w-20 transition-all duration-300"></div>
                    </div>
                  </div>
                  
                  {/* Description */}
                  <p className="text-gray-600 mb-6 leading-relaxed line-clamp-2 group-hover:text-gray-700 transition-colors">
                    {service.description}
                  </p>
                  
                  {/* Benefits */}
                  <div className="mb-8">
                    <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                      <svg className="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Lợi ích chính
                    </h4>
                    <ul className="space-y-3">
                      {service.benefits.slice(0, 3).map((benefit, benefitIndex) => (
                        <li key={benefitIndex} className="flex items-start text-sm text-gray-600 group-hover:text-gray-700 transition-colors">
                          <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mr-3 mt-0.5 group-hover:bg-green-200 transition-colors">
                            <svg className="w-3 h-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <span className="leading-relaxed">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  {/* CTA Button */}
                  <div className="mt-auto">
                    <Link 
                      href={`/dich-vu/${service.slug}`}
                      className="btn-primary w-full text-center group-hover:shadow-xl transition-all duration-300 relative overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                      <span className="relative z-10 flex items-center justify-center">
                        <svg className="w-4 h-4 mr-2 group-hover:animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                        {service.ctaText}
                      </span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        );
      })}

      {/* Quy trình thực hiện chi tiết */}
      <section className="py-14 md:py-16 bg-gradient-to-br from-slate-50 to-blue-50">
                  <div className="container-max">
            <div className="text-center mb-10">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                📋 Quy trình thực hiện chi tiết
              </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Phân chia trách nhiệm rõ ràng giữa TBS GROUP và khách hàng - Minh bạch từng bước
            </p>
            <div className="bg-yellow-100 border border-yellow-300 rounded-lg p-4 max-w-2xl mx-auto">
              <div className="flex items-center justify-center">
                <span className="text-2xl mr-2">⏱️</span>
                <span className="font-semibold text-gray-800">Tổng thời gian: 7-21 ngày (tùy phương thức vận chuyển)</span>
              </div>
            </div>
          </div>

          <div className="max-w-6xl mx-auto">
            <div className="space-y-6">
              {[
                {
                  step: '01',
                  title: 'Tư vấn & Báo giá',
                  time: 'Ngày 0-1',
                  tbsResponsibility: [
                    'Tiếp nhận yêu cầu từ khách hàng 24/7',
                    'Phân tích nhu cầu và tư vấn giải pháp tối ưu',
                    'Báo giá chi tiết từng khoản phí (vận chuyển, thuế, phí ủy thác)',
                    'Tư ván chọn nhà cung cấp uy tín nếu cần',
                    'Lập timeline cụ thể cho từng đơn hàng'
                  ],
                  customerResponsibility: [
                    'Cung cấp thông tin chi tiết về hàng hóa',
                    'Gửi link sản phẩm hoặc hình ảnh mẫu',
                    'Thông báo số lượng, thời gian cần hàng',
                    'Xác nhận địa chỉ giao hàng tại Việt Nam'
                  ],
                  icon: '💬',
                  color: 'blue'
                },
                {
                  step: '02',
                  title: 'Ký hợp đồng & Đặt cọc',
                  time: 'Ngày 1-2',
                  tbsResponsibility: [
                    'Soạn thảo hợp đồng song ngữ chi tiết',
                    'Giải thích rõ ràng các điều khoản',
                    'Cung cấp thông tin tài khoản nhận tiền',
                    'Xác nhận nhận được tiền cọc',
                    'Bắt đầu liên hệ nhà cung cấp tại Trung Quốc'
                  ],
                  customerResponsibility: [
                    'Đọc kỹ và ký xác nhận hợp đồng',
                    'Chuyển khoản tiền cọc 70-80% giá trị hợp đồng',
                    'Cung cấp giấy tờ pháp nhân (nếu là doanh nghiệp)',
                    'Xác nhận thông tin xuất hóa đơn'
                  ],
                  icon: '📝',
                  color: 'green'
                },
                {
                  step: '03',
                  title: 'Đặt hàng & Theo dõi sản xuất',
                  time: 'Ngày 3-7',
                  tbsResponsibility: [
                    'Liên hệ và đàm phán với nhà cung cấp',
                    'Theo dõi tiến độ sản xuất hàng ngày',
                    'Kiểm tra chất lượng sản phẩm mẫu',
                    'Cập nhật tình hình cho khách hàng',
                    'Sắp xếp lịch trình vận chuyển'
                  ],
                  customerResponsibility: [
                    'Phối hợp xác nhận mẫu sản phẩm nếu cần',
                    'Thông báo kịp thời nếu có thay đổi yêu cầu',
                    'Chuẩn bị hồ sơ giấy phép (nếu hàng cần GP)',
                    'Thanh toán đợt 2 theo tiến độ thỏa thuận'
                  ],
                  icon: '🏭',
                  color: 'purple'
                },
                {
                  step: '04',
                  title: 'Vận chuyển về Việt Nam',
                  time: 'Ngày 7-18',
                  tbsResponsibility: [
                    'Sắp xếp đóng gói chuyên nghiệp theo chuẩn xuất khẩu',
                    'Làm thủ tục xuất khẩu tại Trung Quốc',
                    'Theo dõi GPS và cập nhật vị trí hàng hóa realtime',
                    'Mua bảo hiểm vận chuyển cho toàn bộ lô hàng',
                    'Xử lý mọi sự cố phát sinh trong quá trình vận chuyển'
                  ],
                  customerResponsibility: [
                    'Theo dõi thông tin cập nhật từ TBS',
                    'Chuẩn bị sẵn sàng các thủ tục nhập khẩu',
                    'Thông báo trước nếu có thay đổi địa chỉ nhận hàng',
                    'Sẵn sàng thanh toán phần thuế khi hàng về cảng/cửa khẩu VN'
                  ],
                  icon: '🚛',
                  color: 'orange'
                },
                {
                  step: '05',
                  title: 'Thông quan hải quan',
                  time: 'Ngày 18-20',
                  tbsResponsibility: [
                    'Chuẩn bị đầy đủ hồ sơ thông quan',
                    'Khai báo hải quan điện tử chính xác',
                    'Phối hợp với cơ quan hải quan để xử lý nhanh chóng',
                    'Tính toán và thông báo chính xác số thuế phải nộp',
                    'Xử lý mọi vướng mắc với hải quan (nếu có)'
                  ],
                  customerResponsibility: [
                    'Thanh toán thuế nhập khẩu theo thông báo của TBS',
                    'Cung cấp thêm giấy tờ nếu hải quan yêu cầu',
                    'Phối hợp với TBS nếu có kiểm tra đột xuất',
                    'Thanh toán phần còn lại của hợp đồng'
                  ],
                  icon: '🏛️',
                  color: 'indigo'
                },
                {
                  step: '06',
                  title: 'Giao hàng & Hoàn tất',
                  time: 'Ngày 20-21',
                  tbsResponsibility: [
                    'Vận chuyển hàng từ cảng/cửa khẩu đến địa chỉ khách hàng',
                    'Hỗ trợ bốc xếp hàng hóa tại kho khách hàng',
                    'Bàn giao đầy đủ chứng từ gốc (hóa đơn, vận đơn, CO...)',
                    'Hướng dẫn khách hàng kiểm tra và bảo quản hàng hóa',
                    'Hỗ trợ sau bán hàng và giải đáp thắc mắc'
                  ],
                  customerResponsibility: [
                    'Chuẩn bị địa điểm và nhân lực để nhận hàng',
                    'Kiểm tra số lượng và chất lượng hàng hóa',
                    'Ký xác nhận biên bản bàn giao',
                    'Lưu trữ cẩn thận các chứng từ để phục vụ khai thuế',
                    'Đánh giá dịch vụ và để lại feedback cho TBS'
                  ],
                  icon: '🎯',
                  color: 'red'
                }
              ].map((phase, index) => (
                <div key={index} className="relative">
                  {/* Timeline line */}
                  {index < 5 && (
                    <div className="absolute left-6 md:left-16 top-20 w-0.5 h-16 bg-gray-300 z-0"></div>
                  )}
                  
                  <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 hover:shadow-2xl transition-all duration-300">
                    <div className="flex flex-col lg:flex-row items-start gap-6">
                      {/* Step number and icon */}
                      <div className="flex items-center gap-4 lg:flex-col lg:items-center lg:gap-2">
                        <div className={`w-12 h-12 md:w-16 md:h-16 bg-gradient-to-r from-${phase.color}-500 to-${phase.color}-600 rounded-full flex items-center justify-center text-white font-bold text-lg md:text-xl shadow-lg`}>
                          {phase.step}
                        </div>
                        <div className="text-3xl md:text-4xl">{phase.icon}</div>
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                          <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2 md:mb-0">
                            {phase.title}
                          </h3>
                          <div className={`inline-block px-3 py-1 bg-${phase.color}-100 text-${phase.color}-800 rounded-full text-sm font-semibold`}>
                            {phase.time}
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          {/* TBS Responsibility */}
                          <div className="bg-gradient-to-r from-primary-50 to-blue-50 rounded-xl p-4">
                            <h4 className="font-bold text-primary-800 mb-3 flex items-center">
                              <span className="w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center text-white text-xs mr-2">T</span>
                              TBS GROUP chịu trách nhiệm:
                            </h4>
                            <ul className="space-y-2">
                              {phase.tbsResponsibility.map((item, i) => (
                                <li key={i} className="flex items-start text-sm text-gray-700">
                                  <div className="w-1.5 h-1.5 bg-primary-600 rounded-full mt-2 mr-2 flex-shrink-0"></div>
                                  <span>{item}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                          
                          {/* Customer Responsibility */}
                          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4">
                            <h4 className="font-bold text-green-800 mb-3 flex items-center">
                              <span className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center text-white text-xs mr-2">K</span>
                              Khách hàng cần chuẩn bị:
                            </h4>
                            <ul className="space-y-2">
                              {phase.customerResponsibility.map((item, i) => (
                                <li key={i} className="flex items-start text-sm text-gray-700">
                                  <div className="w-1.5 h-1.5 bg-green-600 rounded-full mt-2 mr-2 flex-shrink-0"></div>
                                  <span>{item}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Cam kết của TBS GROUP */}
      <section className="py-14 md:py-16 bg-gradient-to-r from-red-600 via-pink-600 to-purple-600 relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 bg-black bg-opacity-10"></div>
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-10 left-10 w-32 h-32 bg-white bg-opacity-10 rounded-full animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-24 h-24 bg-white bg-opacity-10 rounded-full animate-bounce"></div>
          <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-white bg-opacity-5 rounded-full animate-ping"></div>
        </div>
        
        <div className="container-max relative z-10">
          <div className="text-center mb-10">
            <div className="inline-block px-8 py-4 bg-white/20 backdrop-blur-sm rounded-full text-white font-bold text-lg mb-6 shadow-xl">
              🛡️ CAM KẾT CỦA TBS GROUP
            </div>
            <h2 className="text-3xl lg:text-5xl font-bold text-white mb-6">
              Chúng tôi chịu trách nhiệm<br/>
              <span className="text-yellow-300">100% với từng lô hàng</span>
            </h2>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              Không chỉ là nhà cung cấp dịch vụ, TBS GROUP là đối tác đồng hành bảo vệ toàn bộ lợi ích của bạn
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* Cam kết chính sách */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300">
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                <span className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center text-2xl mr-4">📋</span>
                Chính sách bảo vệ khách hàng
              </h3>
              <div className="space-y-4">
                {[
                  {
                    title: 'Hoàn tiền 100%',
                    desc: 'Nếu không thể thông quan do lỗi của TBS GROUP',
                    icon: '💰'
                  },
                  {
                    title: 'Bồi thường thiệt hại',
                    desc: 'Toàn bộ tổn thất do sai sót trong quá trình vận chuyển',
                    icon: '🛡️'
                  },
                  {
                    title: 'Bảo hiểm hàng hóa',
                    desc: 'Mua bảo hiểm cho 100% giá trị hàng hóa vận chuyển',
                    icon: '🔒'
                  },
                  {
                    title: 'Minh bạch chi phí',
                    desc: 'Không phát sinh phí ẩn, báo giá chi tiết từng khoản',
                    icon: '💎'
                  }
                ].map((item, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <span className="text-2xl">{item.icon}</span>
                    <div>
                      <h4 className="font-bold text-white">{item.title}</h4>
                      <p className="text-white/80 text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quy trình xử lý sự cố */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300">
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                <span className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center text-2xl mr-4">🚨</span>
                Quy trình xử lý sự cố
              </h3>
              <div className="space-y-4">
                {[
                  {
                    time: '0-2 giờ',
                    action: 'Tiếp nhận và xác nhận sự cố từ khách hàng',
                    responsible: 'Hotline 24/7 - Team leader trực tiếp xử lý'
                  },
                  {
                    time: '2-6 giờ',
                    action: 'Điều tra nguyên nhân và đưa ra phương án khắc phục',
                    responsible: 'Đội ngũ chuyên gia phối hợp với đối tác TQ/VN'
                  },
                  {
                    time: '6-24 giờ',
                    action: 'Triển khai giải pháp và cập nhật tiến độ',
                    responsible: 'TBS chịu toàn bộ chi phí khắc phục'
                  },
                  {
                    time: '1-3 ngày',
                    action: 'Hoàn tất xử lý và báo cáo kết quả chi tiết',
                    responsible: 'Bồi thường thiệt hại (nếu có) trong 7 ngày'
                  }
                ].map((step, index) => (
                  <div key={index} className="border-l-4 border-yellow-400 pl-4">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="bg-yellow-400 text-black px-2 py-1 rounded text-xs font-bold">
                        {step.time}
                      </span>
                      <span className="text-white font-semibold">{step.action}</span>
                    </div>
                    <p className="text-white/70 text-sm">{step.responsible}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Số liệu cam kết */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
            <h3 className="text-2xl font-bold text-white text-center mb-8">
              📊 Cam kết bằng số liệu thực tế
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { number: '99.8%', label: 'Tỷ lệ thành công', icon: '🎯' },
                { number: '< 2h', label: 'Thời gian phản hồi', icon: '⚡' },
                { number: '0 VND', label: 'Chi phí phát sinh', icon: '💰' },
                { number: '24/7', label: 'Hỗ trợ khách hàng', icon: '📞' }
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl mb-2">{stat.icon}</div>
                  <div className="text-3xl font-bold text-yellow-300 mb-1">{stat.number}</div>
                  <div className="text-white/80 text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="text-center mt-12">
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-8 max-w-2xl mx-auto">
              <h4 className="text-2xl font-bold text-white mb-4">
                Bạn có thắc mắc về cam kết của chúng tôi?
              </h4>
              <p className="text-white/90 mb-6">
                Hãy liên hệ ngay để được tư vấn chi tiết về chính sách bảo vệ khách hàng
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a 
                  href="tel:+84976005335" 
                  className="bg-white text-purple-600 hover:bg-gray-100 font-bold py-3 px-6 rounded-lg transition-colors inline-flex items-center justify-center"
                >
                  📞 Gọi ngay: 0976 005 335
                </a>
                <Link 
                  href="/lien-he" 
                  className="bg-yellow-500 text-black hover:bg-yellow-400 font-bold py-3 px-6 rounded-lg transition-colors inline-flex items-center justify-center"
                >
                  💬 Chat tư vấn miễn phí
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>



      {/* CTA Section với Why Choose Us */}
      <section className="py-14 md:py-16 bg-gradient-to-br from-gray-50 to-slate-100">
        <div className="container-max">
          <div className="max-w-6xl mx-auto">
            {/* Why Choose Us - Compact Version */}
            <div className="text-center mb-10">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                Tại sao chọn TBS GROUP?
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                {[
                  { icon: '🏆', title: '8+ năm kinh nghiệm', desc: 'Chuyên gia giàu kinh nghiệm' },
                  { icon: '⚡', title: 'Thủ tục nhanh chóng', desc: 'Quy trình tối ưu' },
                  { icon: '🛡️', title: 'Tuân thủ pháp luật', desc: '100% đúng quy định' },
                  { icon: '💎', title: 'Dịch vụ toàn diện', desc: 'Giải pháp từ A-Z' }
                ].map((item, index) => (
                  <div key={index} className="text-center">
                    <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3 hover:bg-primary-200 transition-colors">
                      <span className="text-2xl">{item.icon}</span>
                    </div>
                    <h3 className="font-bold text-gray-900 mb-1">{item.title}</h3>
                    <p className="text-sm text-gray-600">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Main CTA */}
            <div className="bg-white p-8 lg:p-10 rounded-2xl shadow-xl hover:shadow-2xl transition-shadow duration-300">
              <div className="text-center mb-8">
                <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
                  Cần tư vấn dịch vụ phù hợp?
                </h3>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                  Đội ngũ chuyên gia TBS GROUP sẵn sàng <strong>tư vấn miễn phí</strong> giải pháp nhập khẩu tối ưu cho doanh nghiệp bạn
                </p>
              </div>
              
              {/* Contact Methods */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="text-center group">
                  <div className="w-14 h-14 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-primary-200 transition-colors">
                    <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-1">Hotline 24/7</h4>
                  <p className="text-primary-600 font-medium">0976 005 335</p>
                </div>
                <div className="text-center group">
                  <div className="w-14 h-14 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-primary-200 transition-colors">
                    <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-1">Email</h4>
                  <p className="text-primary-600 font-medium">info@xuatnhapkhautbs.vn</p>
                </div>
                <div className="text-center group">
                  <div className="w-14 h-14 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-primary-200 transition-colors">
                    <span className="text-xl">💬</span>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-1">Zalo</h4>
                  <p className="text-primary-600 font-medium">Chat trực tiếp</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a 
                  href="tel:+84976005335" 
                  className="btn-primary text-lg px-8 py-4 group"
                >
                  <svg className="w-5 h-5 mr-2 group-hover:animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  Gọi ngay: 0976 005 335
                </a>
                <Link 
                  href="/lien-he" 
                  className="btn-secondary text-lg px-8 py-4 group"
                >
                  <svg className="w-5 h-5 mr-2 group-hover:animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  Tư vấn miễn phí
                </Link>
                <a 
                  href="https://zalo.me/0976005335" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn-outline text-lg px-8 py-4 group"
                >
                  <span className="mr-2 group-hover:animate-bounce">💬</span>
                  Chat Zalo
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <BackToTop />
      <MessengerButton />
    </main>
  )
} 