export default function PricingSection() {
  return (
    <section id="pricing" className="section-padding bg-gray-50">
      <div className="container-max">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Bảng giá vận chuyển minh bạch
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Giá cước cạnh tranh, không phí ẩn. Cam kết minh bạch từng khoản chi phí
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {/* Bằng Tường - Hà Nội */}
          <div className="card hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Bằng Tường - Hà Nội</h3>
                <p className="text-sm text-gray-600">Đường bộ & Đường biển</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                <span className="font-medium text-gray-700">Theo thể tích (m³)</span>
                <span className="text-lg font-bold text-primary-600">1.2 triệu VNĐ</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                <span className="font-medium text-gray-700">Theo khối lượng (kg)</span>
                <span className="text-lg font-bold text-primary-600">5.500 VNĐ</span>
              </div>
              <div className="text-sm text-gray-600">
                <p><strong>Thời gian:</strong> 7-10 ngày (đường bộ)</p>
                <p><strong>Thời gian:</strong> 15-20 ngày (đường biển)</p>
              </div>
            </div>
          </div>

          {/* Bằng Tường - HCM */}
          <div className="card hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-accent-100 rounded-lg flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-accent-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Bằng Tường - TP.HCM</h3>
                <p className="text-sm text-gray-600">Đường bộ</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                <span className="font-medium text-gray-700">Theo thể tích (m³)</span>
                <span className="text-lg font-bold text-accent-600">1.6 triệu VNĐ</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                <span className="font-medium text-gray-700">Theo khối lượng (kg)</span>
                <span className="text-lg font-bold text-accent-600">7.500 VNĐ</span>
              </div>
              <div className="text-sm text-gray-600">
                <p><strong>Thời gian:</strong> 8-12 ngày</p>
                <p><strong>Ưu điểm:</strong> Phù hợp hàng cồng kềnh</p>
              </div>
            </div>
          </div>

          {/* Đường biển Hà Nội */}
          <div className="card hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Đường biển - Hà Nội</h3>
                <p className="text-sm text-gray-600">Tiết kiệm chi phí</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                <span className="font-medium text-gray-700">Theo khối lượng (kg)</span>
                <span className="text-lg font-bold text-blue-600">5.500 VNĐ</span>
              </div>
              <div className="p-3 bg-yellow-50 rounded-lg">
                <p className="text-sm font-medium text-yellow-800">Tùy chọn tối ưu cho hàng không gấp</p>
              </div>
              <div className="text-sm text-gray-600">
                <p><strong>Thời gian:</strong> 18-25 ngày</p>
                <p><strong>Ưu điểm:</strong> Giá tốt nhất thị trường</p>
              </div>
            </div>
          </div>
        </div>

        {/* Chú thích quan trọng */}
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-r-lg">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="w-5 h-5 text-yellow-400 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-medium text-yellow-800 mb-2">
                Thông tin quan trọng về giá cước
              </h3>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• <strong>Giá trên chưa bao gồm:</strong> Thuế hàng hóa (tùy theo loại hàng)</li>
                <li>• <strong>Phí ủy thác:</strong> 1.5% trên tổng giá trị hàng hóa</li>
                <li>• <strong>Cam kết:</strong> Minh bạch mọi khoản phí, không có chi phí phát sinh</li>
                <li>• <strong>Thanh toán:</strong> Linh hoạt theo từng đợt hàng</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Call to action */}
        <div className="text-center mt-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Cần tư vấn chi tiết?
          </h3>
          <p className="text-gray-600 mb-6">
            Liên hệ ngay để được báo giá chính xác cho từng loại hàng hóa
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#contact" className="btn-primary">
              Tư vấn miễn phí
            </a>
            <a href="tel:+84888888888" className="btn-secondary">
              Gọi ngay: 0888 888 888
            </a>
          </div>
        </div>
      </div>
    </section>
  )
} 