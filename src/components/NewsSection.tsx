'use client'

import { useState } from 'react'

export default function NewsSection() {
  const [expandedArticle, setExpandedArticle] = useState<number | null>(null)

  const newsData = [
    {
      id: 1,
      title: "Chính sách mới về thuế nhập khẩu hàng hóa từ Trung Quốc 2024",
      excerpt: "Bộ Tài chính vừa ban hành thông tư mới điều chỉnh thuế suất nhập khẩu đối với một số mặt hàng từ Trung Quốc, có hiệu lực từ tháng 7/2024...",
      fullContent: `
        <h3>🏛️ Thông tư mới về thuế nhập khẩu</h3>
        <p>Bộ Tài chính vừa ban hành Thông tư 45/2024/TT-BTC điều chỉnh thuế suất nhập khẩu đối với một số mặt hàng từ Trung Quốc, có hiệu lực từ ngày 15/07/2024.</p>
        
        <h4>📋 Những thay đổi chính:</h4>
        <ul>
          <li><strong>Hàng gia dụng nhựa:</strong> Giảm từ 8% xuống 5%</li>
          <li><strong>Đồ điện tử tiêu dùng:</strong> Tăng từ 12% lên 15%</li>
          <li><strong>Nguyên vật liệu sản xuất:</strong> Giữ nguyên 3%</li>
          <li><strong>Máy móc thiết bị:</strong> Miễn thuế đến hết 2024</li>
        </ul>
        
        <h4>💰 Tác động đến doanh nghiệp:</h4>
        <p>Việc điều chỉnh thuế suất này nhằm:</p>
        <ul>
          <li>Hỗ trợ doanh nghiệp sản xuất trong nước</li>
          <li>Cân bằng thương mại song phương</li>
          <li>Khuyến khích chuyển giao công nghệ</li>
        </ul>
        
        <p><strong>Khuyến nghị:</strong> Doanh nghiệp nên rà soát lại kế hoạch nhập khẩu và cập nhật mã HS code để tối ưu chi phí.</p>
      `,
      image: "🏛️",
      date: "15/06/2024",
      category: "Chính sách",
      readTime: "5 phút đọc"
    },
    {
      id: 2,
      title: "Cập nhật quy trình khai báo hải quan điện tử mới nhất",
      excerpt: "Tổng cục Hải quan triển khai hệ thống khai báo điện tử thế hệ mới với nhiều tính năng ưu việt, giúp doanh nghiệp tiết kiệm thời gian...",
      fullContent: `
        <h3>📋 Hệ thống VNACCS/VCIS mới</h3>
        <p>Từ ngày 01/07/2024, Tổng cục Hải quan chính thức triển khai hệ thống khai báo hải quan điện tử thế hệ mới VNACCS/VCIS 2.0.</p>
        
        <h4>🚀 Tính năng mới nổi bật:</h4>
        <ul>
          <li><strong>Khai báo trực tuyến 24/7:</strong> Không cần đến cơ quan hải quan</li>
          <li><strong>Xử lý tự động:</strong> 80% hồ sơ được duyệt tự động</li>
          <li><strong>Tra cứu thời gian thực:</strong> Theo dõi tiến độ xử lý trực tuyến</li>
          <li><strong>Tích hợp thanh toán:</strong> Nộp thuế trực tuyến qua ngân hàng</li>
        </ul>
        
        <h4>📱 Hướng dẫn sử dụng:</h4>
        <ol>
          <li>Đăng ký tài khoản tại portal.customs.gov.vn</li>
          <li>Cập nhật chữ ký số doanh nghiệp</li>
          <li>Tham gia tập huấn online (miễn phí)</li>
          <li>Thử nghiệm với giao dịch nhỏ</li>
        </ol>
        
        <p><strong>Lợi ích:</strong> Tiết kiệm 60% thời gian và 40% chi phí so với phương pháp truyền thống.</p>
      `,
      image: "📋",
      date: "12/06/2024",
      category: "Quy trình",
      readTime: "4 phút đọc"
    },
    {
      id: 3,
      title: "Xu hướng nhập khẩu hàng gia dụng điện từ Trung Quốc",
      excerpt: "Thị trường hàng gia dụng điện nhập khẩu từ Trung Quốc tiếp tục tăng trưởng mạnh, với nhiều sản phẩm mới được ưa chuộng...",
      fullContent: `
        <h3>🏠 Báo cáo thị trường Q2/2024</h3>
        <p>Theo số liệu từ Tổng cục Hải quan, nhập khẩu hàng gia dụng điện từ Trung Quốc tăng 28% so với cùng kỳ năm trước.</p>
        
        <h4>📊 Top sản phẩm nhập khẩu nhiều nhất:</h4>
        <ol>
          <li><strong>Quạt điện (45%):</strong> 2.3 triệu chiếc</li>
          <li><strong>Nồi cơm điện (23%):</strong> 1.1 triệu chiếc</li>
          <li><strong>Máy xay sinh tố (15%):</strong> 680,000 chiếc</li>
          <li><strong>Bàn là (12%):</strong> 520,000 chiếc</li>
          <li><strong>Khác (5%):</strong> Lò vi sóng, máy hút bụi...</li>
        </ol>
        
        <h4>💡 Xu hướng 2024:</h4>
        <ul>
          <li><strong>Smart Home:</strong> Sản phẩm thông minh, kết nối IoT</li>
          <li><strong>Tiết kiệm năng lượng:</strong> Inverter, công nghệ eco</li>
          <li><strong>Design hiện đại:</strong> Màu sắc trendy, form factor nhỏ gọn</li>
          <li><strong>Giá phải chăng:</strong> Phân khúc 500k-2 triệu đồng</li>
        </ul>
        
        <h4>⚠️ Lưu ý pháp lý:</h4>
        <p>Tất cả sản phẩm điện phải có:</p>
        <ul>
          <li>Giấy chứng nhận CR (Conformity Report)</li>
          <li>Nhãn năng lượng tiếng Việt</li>
          <li>Bảo hành tối thiểu 12 tháng</li>
        </ul>
      `,
      image: "🏠",
      date: "10/06/2024",
      category: "Thị trường",
      readTime: "6 phút đọc"
    },
    {
      id: 4,
      title: "Hướng dẫn xử lý hàng hóa bị tạm giữ tại cửa khẩu",
      excerpt: "Tổng hợp các trường hợp hàng hóa bị tạm giữ phổ biến và cách thức xử lý nhanh chóng, hiệu quả để giảm thiểu chi phí...",
      fullContent: `
        <h3>⚠️ Nguyên nhân hàng hóa bị tạm giữ</h3>
        <p>Theo thống kê của Tổng cục Hải quan, có 5 nguyên nhân chính dẫn đến việc hàng hóa bị tạm giữ tại cửa khẩu:</p>
        
        <h4>📋 Top 5 nguyên nhân phổ biến:</h4>
        <ol>
          <li><strong>Hồ sơ không đầy đủ (35%):</strong> Thiếu giấy tờ chứng nhận</li>
          <li><strong>Mã HS không chính xác (25%):</strong> Khai báo sai mã hàng hóa</li>
          <li><strong>Giá trị khai báo thấp (20%):</strong> Dưới giá tham chiếu</li>
          <li><strong>Hàng hóa cấm/hạn chế (15%):</strong> Không có phép nhập</li>
          <li><strong>Chất lượng không đạt (5%):</strong> Không đúng tiêu chuẩn</li>
        </ol>
        
        <h4>🔧 Cách xử lý nhanh chóng:</h4>
        <ul>
          <li>Liên hệ ngay với cơ quan hải quan để biết lý do cụ thể</li>
          <li>Chuẩn bị bổ sung hồ sơ theo yêu cầu</li>
          <li>Thanh toán phí lưu kho để tránh tăng chi phí</li>
          <li>Thuê đại lý có kinh nghiệm xử lý</li>
        </ul>
        
        <p><strong>Lưu ý:</strong> Thời gian xử lý trung bình 3-5 ngày làm việc. Chi phí lưu kho tăng theo từng ngày trễ.</p>
      `,
      image: "⚠️",
      date: "08/06/2024",
      category: "Hướng dẫn",
      readTime: "7 phút đọc"
    },
    {
      id: 5,
      title: "Danh sách hàng cấm và hạn chế nhập khẩu cập nhật",
      excerpt: "Cập nhật danh sách hàng hóa cấm và hạn chế nhập khẩu theo quyết định mới nhất của Bộ Công Thương và Bộ Y tế...",
      fullContent: `
        <h3>🚫 Danh mục hàng cấm và hạn chế</h3>
        <p>Theo Nghị định 15/2024/NĐ-CP, danh sách hàng hóa cấm và hạn chế nhập khẩu được cập nhật với một số thay đổi quan trọng:</p>
        
        <h4>⛔ Hàng hóa cấm nhập khẩu tuyệt đối:</h4>
        <ul>
          <li>Vũ khí, đạn dược, chất nổ</li>
          <li>Ma túy các loại</li>
          <li>Hàng hóa có hại đến môi trường</li>
          <li>Sách báo, tài liệu tuyên truyền xấu</li>
          <li>Đồ chơi độc hại</li>
        </ul>
        
        <h4>⚠️ Hàng hóa hạn chế (cần giấy phép):</h4>
        <ul>
          <li><strong>Thiết bị viễn thông:</strong> Cần giấy phép từ Bộ TT&TT</li>
          <li><strong>Hóa chất:</strong> Giấy phép từ Bộ Công Thương</li>
          <li><strong>Dược phẩm:</strong> Cần phép từ Bộ Y tế</li>
          <li><strong>Thực phẩm bảo vệ sức khỏe:</strong> Giấy xác nhận ATTP</li>
        </ul>
        
        <h4>📋 Thay đổi mới 2024:</h4>
        <p>Một số mặt hàng được chuyển từ cấm sang hạn chế:</p>
        <ul>
          <li>Xe máy điện công suất cao</li>
          <li>Pin lithium dung lượng lớn</li>
          <li>Thiết bị định vị GPS</li>
        </ul>
      `,
      image: "🚫",
      date: "05/06/2024",
      category: "Danh mục",
      readTime: "3 phút đọc"
    },
    {
      id: 6,
      title: "Cơ hội kinh doanh: Nhập khẩu máy móc thiết bị từ Trung Quốc",
      excerpt: "Phân tích cơ hội và thách thức khi nhập khẩu máy móc thiết bị từ Trung Quốc, những điều cần lưu ý về chứng nhận chất lượng...",
      fullContent: `
        <h3>⚙️ Cơ hội đầu tư máy móc từ Trung Quốc</h3>
        <p>Với chi phí thấp hơn 30-50% so với các nước khác, máy móc từ Trung Quốc đang trở thành lựa chọn phổ biến của doanh nghiệp Việt Nam.</p>
        
        <h4>💰 Ưu điểm nổi bật:</h4>
        <ul>
          <li><strong>Giá cả cạnh tranh:</strong> Tiết kiệm 30-50% chi phí</li>
          <li><strong>Đa dạng sản phẩm:</strong> Từ cơ bản đến cao cấp</li>
          <li><strong>Giao hàng nhanh:</strong> 7-15 ngày</li>
          <li><strong>Hỗ trợ tốt:</strong> Nhiều nhà cung cấp tại Việt Nam</li>
        </ul>
        
        <h4>⚠️ Những điều cần lưu ý:</h4>
        <ul>
          <li><strong>Chứng nhận CE:</strong> Bắt buộc với máy móc châu Âu</li>
          <li><strong>Tiêu chuẩn an toàn:</strong> Phải có giấy chứng nhận từ nhà sản xuất</li>
          <li><strong>Bảo hành:</strong> Tối thiểu 12 tháng</li>
          <li><strong>Đào tạo sử dụng:</strong> Cần có hướng dẫn tiếng Việt</li>
        </ul>
        
        <h4>📋 Quy trình nhập khẩu:</h4>
        <ol>
          <li>Khảo sát nhà cung cấp và sản phẩm</li>
          <li>Đàm phán hợp đồng và điều khoản</li>
          <li>Xin giấy phép nhập khẩu (nếu cần)</li>
          <li>Vận chuyển và làm thủ tục hải quan</li>
          <li>Kiểm tra, lắp đặt và đào tạo</li>
        </ol>
        
        <p><strong>Khuyến cáo:</strong> Nên thuê dịch vụ khảo sát nhà cung cấp trước khi ký hợp đồng lớn.</p>
      `,
      image: "⚙️",
      date: "02/06/2024",
      category: "Cơ hội",
      readTime: "8 phút đọc"
    }
  ]

  const toggleArticle = (id: number) => {
    setExpandedArticle(expandedArticle === id ? null : id)
  }

  return (
    <section id="news" className="section-padding bg-gray-50">
      <div className="container-max">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mr-4">
              <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-900">
              Tin tức Xuất Nhập Khẩu
            </h2>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Đọc toàn bộ bài viết chuyên sâu về chính sách, quy trình và xu hướng thị trường XNK
          </p>
        </div>

        <div className="space-y-8 max-w-4xl mx-auto">
          {newsData.map((article) => (
            <div key={article.id} className="card hover:shadow-xl transition-all duration-300">
              <div className="flex items-center mb-6">
                <div className="text-4xl mr-4">
                  {article.image}
                </div>
                <div>
                  <span className="inline-block px-3 py-1 text-xs font-semibold bg-primary-100 text-primary-800 rounded-full mb-2">
                    {article.category}
                  </span>
                  <div className="flex items-center text-sm text-gray-500">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {article.date}
                    <span className="mx-2">•</span>
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {article.readTime}
                  </div>
                </div>
              </div>
              
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                {article.title}
              </h3>
              
              {expandedArticle === article.id ? (
                <div className="prose prose-lg max-w-none">
                  <div dangerouslySetInnerHTML={{ __html: article.fullContent || article.excerpt || '' }} />
                </div>
              ) : (
                <p className="text-gray-600 mb-4 text-lg">
                  {article.excerpt}
                </p>
              )}
              
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <button 
                  onClick={() => toggleArticle(article.id)}
                  className="text-primary-600 hover:text-primary-700 font-medium flex items-center group"
                >
                  {expandedArticle === article.id ? 'Thu gọn' : 'Đọc toàn bộ bài viết'}
                  <svg className={`w-4 h-4 ml-1 transition-transform ${expandedArticle === article.id ? 'rotate-180' : 'group-hover:translate-x-1'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={expandedArticle === article.id ? "M19 9l-7 7-7-7" : "M9 5l7 7-7 7"} />
                  </svg>
                </button>
                
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">Chia sẻ:</span>
                  <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors" title="Chia sẻ Facebook">
                    📘
                  </button>
                  <button className="p-2 text-gray-400 hover:text-green-600 transition-colors" title="Chia sẻ Zalo">
                    💬
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Newsletter subscription */}
        <div className="mt-16 text-center">
          <div className="bg-primary-50 rounded-2xl p-8 max-w-2xl mx-auto">
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Đăng ký nhận tin</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Nhận tin tức mới nhất về chính sách XNK và xu hướng thị trường qua email
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Nhập email của bạn"
                className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <button className="btn-primary whitespace-nowrap">
                Đăng ký ngay
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-3">
              Chúng tôi tôn trọng quyền riêng tư của bạn. Liên hệ{' '}
              <a href="tel:0976005335" className="text-primary-600 hover:text-primary-700">0976 005 335</a> để hỗ trợ.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
} 