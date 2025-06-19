export default function HeroSection() {
  return (
    <section id="about" className="section-padding bg-gradient-to-br from-primary-50 to-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="absolute top-20 right-20 w-64 h-64 bg-primary-200 rounded-full opacity-10 blur-3xl"></div>
      <div className="absolute bottom-20 left-20 w-48 h-48 bg-blue-200 rounded-full opacity-10 blur-3xl"></div>
      
      <div className="container-max relative z-10">
        <div className="lg:grid lg:grid-cols-2 lg:gap-12 lg:items-center">
          <div className="mb-12 lg:mb-0">
            <div className="flex items-center mb-6">
              <div className="flex items-center space-x-2">
                <span className="text-2xl animate-bounce">🚢</span>
                <span className="text-2xl animate-pulse">🏭</span>
                <span className="text-2xl animate-bounce delay-100">🚛</span>
              </div>
            </div>
            
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Dịch vụ nhập hàng Trung Quốc
              <span className="text-primary-600"> chính ngạch</span> uy tín
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              TBS GROUP cam kết mang đến dịch vụ nhập khẩu minh bạch, chính ngạch với hóa đơn và hợp đồng đầy đủ, 
              bảo vệ quyền lợi tối đa cho khách hàng doanh nghiệp và cá nhân.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a href="#contact" className="btn-primary text-center flex items-center justify-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                Tư vấn miễn phí
              </a>
              <a href="#pricing" className="btn-secondary text-center flex items-center justify-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                Xem bảng giá
              </a>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="card hover:shadow-xl transition-all duration-300 group">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.582-3.756z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2 group-hover:text-primary-600 transition-colors">Chính ngạch 100%</h3>
              <p className="text-gray-600">Đầy đủ hóa đơn, hợp đồng, cam kết minh bạch không phí ẩn</p>
            </div>
            
            <div className="card hover:shadow-xl transition-all duration-300 group">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2 group-hover:text-primary-600 transition-colors">Gom hàng tại nguồn</h3>
              <p className="text-gray-600">Chiết Giang, Hà Bắc - trung tâm sản xuất lớn nhất Trung Quốc</p>
            </div>
            
            <div className="card hover:shadow-xl transition-all duration-300 group">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2 group-hover:text-primary-600 transition-colors">Giá cước cạnh tranh</h3>
              <p className="text-gray-600">Ưu đãi đặc biệt cho hàng dễ ghép, tiết kiệm tối đa chi phí</p>
            </div>
            
            <div className="card hover:shadow-xl transition-all duration-300 group">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2 group-hover:text-primary-600 transition-colors">Hỗ trợ 24/7</h3>
              <p className="text-gray-600">Đội ngũ tư vấn chuyên nghiệp, hỗ trợ khai báo hải quan</p>
            </div>
          </div>
        </div>
        
        {/* Visual showcase with industry images */}
        <div className="mt-16">
          <div className="bg-white rounded-xl shadow-lg p-8 relative">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-4 flex items-center justify-center">
                <span className="text-3xl mr-3">🏭</span>
                Ưu tiên nhận các loại hàng dễ ghép
                <span className="text-3xl ml-3">📦</span>
              </h2>
              <p className="text-gray-600">Chuyên gia gom hàng với kinh nghiệm 10+ năm tại các khu công nghiệp lớn</p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
              <div className="group p-4 rounded-lg bg-gradient-to-br from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 transition-all duration-300 cursor-pointer">
                <div className="text-center">
                  <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">🥄</div>
                  <span className="text-sm font-medium text-green-700">Đồ gia dụng nhựa</span>
                </div>
              </div>
              
              <div className="group p-4 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 transition-all duration-300 cursor-pointer">
                <div className="text-center">
                  <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">🔌</div>
                  <span className="text-sm font-medium text-blue-700">Gia dụng điện</span>
                </div>
              </div>
              
              <div className="group p-4 rounded-lg bg-gradient-to-br from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 transition-all duration-300 cursor-pointer">
                <div className="text-center">
                  <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">✏️</div>
                  <span className="text-sm font-medium text-purple-700">Văn phòng phẩm</span>
                </div>
              </div>
              
              <div className="group p-4 rounded-lg bg-gradient-to-br from-yellow-50 to-yellow-100 hover:from-yellow-100 hover:to-yellow-200 transition-all duration-300 cursor-pointer">
                <div className="text-center">
                  <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">🪑</div>
                  <span className="text-sm font-medium text-yellow-700">Nội thất</span>
                </div>
              </div>
              
              <div className="group p-4 rounded-lg bg-gradient-to-br from-red-50 to-red-100 hover:from-red-100 hover:to-red-200 transition-all duration-300 cursor-pointer">
                <div className="text-center">
                  <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">📱</div>
                  <span className="text-sm font-medium text-red-700">Đồ điện tử</span>
                </div>
              </div>
              
              <div className="group p-4 rounded-lg bg-gradient-to-br from-indigo-50 to-indigo-100 hover:from-indigo-100 hover:to-indigo-200 transition-all duration-300 cursor-pointer">
                <div className="text-center">
                  <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">⚙️</div>
                  <span className="text-sm font-medium text-indigo-700">Máy móc mới</span>
                </div>
              </div>
              
              <div className="group p-4 rounded-lg bg-gradient-to-br from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 transition-all duration-300 cursor-pointer">
                <div className="text-center">
                  <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">🧱</div>
                  <span className="text-sm font-medium text-gray-700">Nguyên vật liệu</span>
                </div>
              </div>
            </div>
            
            <div className="mt-8 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-6 border-l-4 border-yellow-400">
              <div className="flex items-center">
                <div className="text-2xl mr-3">⚠️</div>
                <div>
                  <p className="font-semibold text-gray-900 mb-1">Lưu ý quan trọng:</p>
                  <p className="text-gray-700 text-sm">
                    Chúng tôi <strong>KHÔNG</strong> nhận các mặt hàng: khoáng sản, hàng cấm, thực phẩm tươi sống, 
                    hóa chất nguy hiểm và các mặt hàng khó vận chuyển khác.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Process overview */}
        <div className="mt-16">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center justify-center">
              <span className="text-3xl mr-3">🔄</span>
              Quy trình làm việc chuyên nghiệp
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center group">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary-200 transition-colors">
                <span className="text-2xl">📞</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">1. Tư vấn</h3>
              <p className="text-sm text-gray-600">Tư vấn chi tiết về sản phẩm, giá cả và quy trình</p>
            </div>
            
            <div className="text-center group">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary-200 transition-colors">
                <span className="text-2xl">🛒</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">2. Gom hàng</h3>
              <p className="text-sm text-gray-600">Đặt hàng và gom hàng tại Chiết Giang, Hà Bắc</p>
            </div>
            
            <div className="text-center group">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary-200 transition-colors">
                <span className="text-2xl">🚛</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">3. Vận chuyển</h3>
              <p className="text-sm text-gray-600">Vận chuyển an toàn qua đường bộ hoặc đường biển</p>
            </div>
            
            <div className="text-center group">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary-200 transition-colors">
                <span className="text-2xl">📋</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">4. Khai báo</h3>
              <p className="text-sm text-gray-600">Hoàn tất thủ tục hải quan và giao hàng</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
} 