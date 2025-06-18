'use client'

export default function GoogleMaps() {
  return (
    <section className="section-padding bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container-max">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            📍 Địa điểm văn phòng
          </h2>
          <p className="text-xl text-gray-600">
            TBS GROUP có mặt tại 2 thành phố lớn để phục vụ khách hàng tốt nhất
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Hanoi Office */}
          <div className="card">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2 flex items-center">
                <span className="text-2xl mr-3">🏢</span>
                Trụ sở chính - Hà Nội
              </h3>
              <div className="space-y-2 text-gray-600">
                <p className="flex items-center">
                  <span className="text-lg mr-2">📍</span>
                  Kim Nỗ, Đông Anh, Hà Nội
                </p>
                <p className="flex items-center">
                  <span className="text-lg mr-2">📞</span>
                  <a href="tel:0976005335" className="text-indigo-600 hover:text-indigo-800">
                    0976 005 335
                  </a>
                </p>
                <p className="flex items-center">
                  <span className="text-lg mr-2">✉️</span>
                  <a href="mailto:info@xuatnhapkhautbs.vn" className="text-indigo-600 hover:text-indigo-800">
                    info@xuatnhapkhautbs.vn
                  </a>
                </p>
              </div>
            </div>
            
            <div className="rounded-lg overflow-hidden shadow-lg">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3721.479400733039!2d105.78688117584339!3d21.133311684178278!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ab418198e1b3%3A0x24a5b4ce53bac300!2zVEJTIEdST1VQIEpTQyAtIEjhu5cgdHLhu6MgeHXhuqV0IG5o4bqtcCBraOG6qXUgVHJ1bmcgVmnhu4d0!5e0!3m2!1svi!2s!4v1750253490062!5m2!1svi!2s" 
                width="100%" 
                height="350" 
                style={{border: 0}} 
                allowFullScreen 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                title="TBS GROUP - Trụ sở Hà Nội"
              />
            </div>

            <div className="mt-4 p-4 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-2">🚗 Hướng dẫn đến văn phòng:</h4>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Từ trung tâm Hà Nội: Di chuyển theo đường Cổ Linh hướng Đông Anh</li>
                <li>• Xe bus: Tuyến 25, 77 đến Kim Nỗ</li>
                <li>• Có chỗ đỗ xe miễn phí cho khách hàng</li>
              </ul>
            </div>
          </div>

          {/* Ho Chi Minh Office */}
          <div className="card">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2 flex items-center">
                <span className="text-2xl mr-3">🏢</span>
                Chi nhánh - TP. Hồ Chí Minh
              </h3>
              <div className="space-y-2 text-gray-600">
                <p className="flex items-center">
                  <span className="text-lg mr-2">📍</span>
                  Xuân Thới Đông, Hóc Môn, TP.HCM
                </p>
                <p className="flex items-center">
                  <span className="text-lg mr-2">📞</span>
                  <a href="tel:0976005335" className="text-indigo-600 hover:text-indigo-800">
                    0976 005 335
                  </a>
                </p>
                <p className="flex items-center">
                  <span className="text-lg mr-2">✉️</span>
                  <a href="mailto:info@xuatnhapkhautbs.vn" className="text-indigo-600 hover:text-indigo-800">
                    info@xuatnhapkhautbs.vn
                  </a>
                </p>
              </div>
            </div>
            
            <div className="rounded-lg overflow-hidden shadow-lg">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3918.222570858064!2d106.59355737570404!3d10.870669057446943!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2c4bc4c132bf64d3%3A0x7283dab5d2624bf8!2zVEJTIEdyb3VwIC0gWHXhuqV0IG5o4bqtcCBraOG6qXUgVHJ1bmcgVmnhu4d0!5e0!3m2!1svi!2s!4v1750253554849!5m2!1svi!2s" 
                width="100%" 
                height="350" 
                style={{border: 0}} 
                allowFullScreen 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                title="TBS GROUP - Chi nhánh TP.HCM"
              />
            </div>

            <div className="mt-4 p-4 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-2">🚗 Hướng dẫn đến văn phòng:</h4>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Từ trung tâm TP.HCM: Đi theo QL22 hướng Hóc Môn</li>
                <li>• Xe bus: Tuyến 53, 86 đến Xuân Thới Đông</li>
                <li>• Gần cảng Cát Lái, thuận tiện giao nhận hàng biển</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Working Hours */}
        <div className="mt-12 card">
          <h3 className="text-xl font-bold text-gray-900 mb-6 text-center flex items-center justify-center">
            <span className="text-2xl mr-3">⏰</span>
            Giờ làm việc & Liên hệ nhanh
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🕐</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Giờ làm việc</h4>
              <div className="text-sm text-gray-600">
                <p>Thứ 2 - Thứ 6: 8:00 - 17:30</p>
                <p>Thứ 7: 8:00 - 12:00</p>
                <p>Chủ nhật: Nghỉ</p>
              </div>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📱</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Liên hệ 24/7</h4>
              <div className="text-sm text-gray-600 space-y-1">
                <p>
                  <a href="tel:0976005335" className="text-indigo-600 hover:text-indigo-800 font-medium">
                    📞 0976 005 335
                  </a>
                </p>
                <p>
                  <a href="https://zalo.me/0976005335" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 font-medium">
                    💬 Zalo: 0976 005 335
                  </a>
                </p>
                <p>
                  <a href="https://tiktok.com/@tbslogistics" target="_blank" rel="noopener noreferrer" className="text-pink-600 hover:text-pink-800 font-medium">
                    🎵 TikTok: @tbslogistics
                  </a>
                </p>
              </div>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🚚</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Dịch vụ nhanh</h4>
              <div className="text-sm text-gray-600">
                <p>Tư vấn miễn phí</p>
                <p>Báo giá trong 30 phút</p>
                <p>Hỗ trợ khẩn cấp 24/7</p>
              </div>
            </div>
          </div>
        </div>

        {/* Emergency Contact */}
        <div className="mt-8 bg-gradient-to-r from-red-50 to-orange-50 rounded-lg p-6 border-l-4 border-red-400">
          <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
            <span className="text-2xl mr-3">🚨</span>
            Liên hệ khẩn cấp ngoài giờ
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div>
              <h5 className="font-semibold text-gray-800 mb-2">📞 Hotline khẩn cấp:</h5>
              <p className="text-gray-700">
                <a href="tel:0976005335" className="text-red-600 hover:text-red-800 font-bold text-lg">
                  0976 005 335
                </a>
              </p>
              <p className="text-gray-600 text-xs mt-1">
                (Phí cuộc gọi theo phương thức, hỗ trợ 24/7)
              </p>
            </div>
            
            <div>
              <h5 className="font-semibold text-gray-800 mb-2">💬 Chat nhanh:</h5>
              <div className="space-y-1">
                <p>
                  <a href="https://zalo.me/0976005335" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                    Zalo: https://zalo.me/0976005335
                  </a>
                </p>
                <p>
                  <a href="mailto:info@xuatnhapkhautbs.vn" className="text-indigo-600 hover:text-indigo-800">  
                    Email: info@xuatnhapkhautbs.vn
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
