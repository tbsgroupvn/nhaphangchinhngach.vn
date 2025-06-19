'use client'

import { useState } from 'react'

export default function ResourceCenter() {
  const [activeCategory, setActiveCategory] = useState<string>('all')
  const [openFAQ, setOpenFAQ] = useState<string | null>(null)

  const documents = [
    {
      id: 1,
      title: 'Hướng dẫn nhập khẩu chính ngạch từ Trung Quốc',
      description: 'Quy trình chi tiết từ A-Z, thủ tục hải quan, giấy tờ cần thiết',
      type: 'PDF',
      category: 'guide',
      size: '2.5 MB',
      downloadUrl: 'https://drive.google.com/file/d/1ABCdef123456/view?usp=sharing',
      downloadDirect: 'https://drive.google.com/uc?export=download&id=1ABCdef123456'
    },
    {
      id: 2,
      title: 'Mẫu hợp đồng mua bán hàng hóa TQ-VN',
      description: 'Template hợp đồng chuẩn, bảo vệ quyền lợi người mua',
      type: 'DOCX',
      category: 'template',
      size: '156 KB',
      downloadUrl: 'https://drive.google.com/file/d/2XYZabc789012/view?usp=sharing',
      downloadDirect: 'https://drive.google.com/uc?export=download&id=2XYZabc789012'
    },
    {
      id: 3,
      title: 'Bảng thuế suất nhập khẩu mới nhất 2024',
      description: 'Cập nhật thuế NK theo mã HS, có hiệu lực từ 01/01/2024',
      type: 'XLSX',
      category: 'tax',
      size: '890 KB',
      downloadUrl: 'https://drive.google.com/file/d/3PQRstu345678/view?usp=sharing',
      downloadDirect: 'https://drive.google.com/uc?export=download&id=3PQRstu345678'
    },
    {
      id: 4,
      title: 'Checklist kiểm tra chất lượng hàng TQ',
      description: '25 tiêu chí đánh giá sản phẩm trước khi nhập về VN',
      type: 'PDF',
      category: 'guide',
      size: '1.2 MB',
      downloadUrl: 'https://drive.google.com/file/d/4HIJklm901234/view?usp=sharing',
      downloadDirect: 'https://drive.google.com/uc?export=download&id=4HIJklm901234'
    },
    {
      id: 5,
      title: 'Danh sách mã HS Code phổ biến',
      description: 'Top 500 mã HS cho hàng tiêu dùng, điện tử, gia dụng',
      type: 'PDF',
      category: 'reference',
      size: '3.1 MB',
      downloadUrl: 'https://drive.google.com/file/d/5NOPqrs567890/view?usp=sharing',
      downloadDirect: 'https://drive.google.com/uc?export=download&id=5NOPqrs567890'
    },
    {
      id: 6,
      title: 'Mẫu phiếu đặt hàng và thanh toán',
      description: 'Template đặt hàng chuyên nghiệp, quản lý đơn hàng hiệu quả',
      type: 'DOCX',
      category: 'template',
      size: '245 KB',
      downloadUrl: 'https://drive.google.com/file/d/6TUVwxy123456/view?usp=sharing',
      downloadDirect: 'https://drive.google.com/uc?export=download&id=6TUVwxy123456'
    }
  ]

  const faqs = [
    {
      id: '1',
      question: 'Sự khác biệt giữa hàng chính ngạch và tiểu ngạch?',
      answer: 'Hàng chính ngạch là hàng có đầy đủ hóa đơn, hợp đồng xuất khẩu từ Trung Quốc và khai báo nhập khẩu đầy đủ tại Việt Nam. Tiểu ngạch là hàng không có đầy đủ giấy tờ. TBS GROUP chỉ làm hàng chính ngạch để đảm bảo an toàn pháp lý.',
      category: 'general'
    },
    {
      id: '2',
      question: 'Thời gian vận chuyển từ Trung Quốc về Việt Nam mất bao lâu?',
      answer: 'Đường bộ Bằng Tường-Hà Nội: 7-12 ngày, Bằng Tường-TP.HCM: 9-15 ngày, Đường biển: 18-25 ngày. Thời gian này bao gồm cả thủ tục hải quan.',
      category: 'shipping'
    },
    {
      id: '3',
      question: 'Phí ủy thác được tính như thế nào?',
      answer: 'Phí ủy thác từ 1.5% - 3% tùy giá trị lô hàng: Lô >= 2 tỷ VND: 1.5%, >= 1 tỷ VND: 2.0%, >= 500M VND: 2.5%, < 500M VND: 3.0%. Hoàn toàn minh bạch, không có phí ẩn.',
      category: 'payment'
    },
    {
      id: '4',
      question: 'Những loại hàng nào TBS GROUP không nhận?',
      answer: 'Chúng tôi không nhận: khoáng sản, hàng cấm, thực phẩm tươi sống, hóa chất nguy hiểm, động vật sống, hàng không có giấy phép nhập khẩu.',
      category: 'general'
    },
    {
      id: '5',
      question: 'TBS GROUP có những cam kết gì để bảo vệ khách hàng?',
      answer: 'Chúng tôi cam kết: (1) Hoàn tiền 100% nếu không thể thông quan, (2) Bồi thường thiệt hại do lỗi của TBS, (3) Bảo hiểm toàn bộ hàng hóa trong quá trình vận chuyển, (4) Không thu phí ẩn, minh bạch mọi khoản chi phí, (5) Hỗ trợ khách hàng 24/7 kể cả ngày lễ.',
      category: 'general'
    },
    {
      id: '6',
      question: 'Tại sao nên chọn TBS GROUP thay vì các đơn vị khác?',
      answer: 'TBS GROUP vượt trội với: (1) 8+ năm kinh nghiệm trong ngành, (2) Hơn 8000 khách hàng tin tưởng, (3) Tỷ lệ thành công 99.8%, (4) Có văn phòng tại cả Trung Quốc và Việt Nam, (5) Đội ngũ 50+ chuyên viên giàu kinh nghiệm, (6) Giá cả cạnh tranh nhất thị trường, (7) Quy trình chuẩn hóa ISO.',
      category: 'general'
    },
    {
      id: '7',
      question: 'Nếu hàng hóa bị hư hỏng hoặc thất lạc thì sao?',
      answer: 'TBS cam kết bảo vệ 100% quyền lợi khách hàng: (1) Mua bảo hiểm hàng hóa cho toàn bộ lô hàng, (2) Kiểm tra kỹ càng trước khi gửi và khi nhận, (3) Đóng gói chuyên nghiệp theo tiêu chuẩn xuất khẩu, (4) Theo dõi GPS realtime, (5) Bồi thường 100% giá trị nếu có sự cố, (6) Quy trình xử lý khiếu nại nhanh chóng trong 24h.',
      category: 'shipping'
    },
    {
      id: '8',
      question: 'TBS GROUP có minh bạch về giá cả không?',
      answer: 'Chúng tôi cam kết minh bạch tuyệt đối: (1) Báo giá chi tiết từng khoản phí, (2) Không có phí ẩn phát sinh, (3) Hợp đồng ghi rõ mọi điều khoản, (4) Khách hàng được biết tỷ giá USD/VND thực tế, (5) So sánh giá với thị trường để đảm bảo cạnh tranh, (6) Hoàn lại tiền thừa nếu chi phí thực tế thấp hơn dự kiến.',
      category: 'payment'
    },
    {
      id: '9',
      question: 'Làm thế nào để tôi theo dõi đơn hàng của mình?',
      answer: 'TBS cung cấp hệ thống theo dõi đầy đủ: (1) Cập nhật tiến độ qua Zalo/WhatsApp hàng ngày, (2) Gửi ảnh/video hàng hóa tại từng điểm trung chuyển, (3) Tracking GPS realtime khi vận chuyển, (4) Thông báo trước mọi thủ tục cần khách hàng phối hợp, (5) Hotline 24/7 để giải đáp thắc mắc, (6) Báo cáo chi tiết sau khi hoàn thành.',
      category: 'shipping'
    },
    {
      id: '10',
      question: 'TBS GROUP có hỗ trợ tìm nhà cung cấp uy tín không?',
      answer: 'Đây là thế mạnh của TBS với 8 năm kinh nghiệm: (1) Cơ sở dữ liệu 1000+ nhà cung cấp uy tín đã thẩm định, (2) Blacklist những nhà cung cấp không đáng tin, (3) Đàm phán giá tốt nhất nhờ mối quan hệ lâu dài, (4) Kiểm tra chất lượng trước khi đặt hàng lớn, (5) Tư vấn chọn sản phẩm phù hợp thị trường Việt Nam, (6) Hỗ trợ phát triển sản phẩm riêng (OEM).',
      category: 'general'
    },
    {
      id: '11',
      question: 'Làm thế nào để tránh bị kiểm tra hải quan đột xuất?',
      answer: 'TBS GROUP giúp giảm thiểu rủi ro bằng cách: (1) Khai báo chính xác 100% thông tin hàng hóa, (2) Chuẩn bị đầy đủ chứng từ gốc theo yêu cầu, (3) Phân loại mã HS chính xác với sự hỗ trợ của chuyên gia, (4) Duy trì lịch sử thông quan tốt với cơ quan hải quan, (5) Tư vấn lựa chọn cửa khẩu và thời điểm phù hợp, (6) Hỗ trợ 24/7 nếu có vấn đề phát sinh.',
      category: 'customs'
    },
    {
      id: '12',
      question: 'Những giấy tờ nào cần thiết cho thông quan hải quan?',
      answer: 'Hồ sơ thông quan chuẩn bao gồm: (1) Hóa đơn thương mại (Commercial Invoice), (2) Vận đơn (B/L hoặc AWB), (3) Danh sách đóng gói (Packing List), (4) Giấy phép nhập khẩu (nếu hàng thuộc diện cần GP), (5) Chứng nhận xuất xứ (C/O), (6) Các chứng nhận chất lượng, an toàn theo yêu cầu từng mặt hàng, (7) Hợp đồng mua bán (nếu cần). TBS sẽ hướng dẫn và chuẩn bị đầy đủ.',
      category: 'customs'
    },
    {
      id: '13',
      question: 'Mã HS Code sai có ảnh hưởng gì và cách khắc phục?',
      answer: 'Mã HS sai có thể dẫn đến: (1) Thuế suất cao hơn thực tế 10-30%, (2) Bị kiểm tra, tạm giữ hàng, (3) Phạt tiền và chậm trễ giao hàng, (4) Ảnh hưởng uy tín với hải quan. TBS khắc phục bằng cách: (1) Đội ngũ chuyên gia phân loại HS 10+ năm kinh nghiệm, (2) Cơ sở dữ liệu 5000+ mã HS thường dùng, (3) Tham khảo ý kiến chính thức từ cơ quan thuế, (4) Bảo hiểm rủi ro thuế suất.',
      category: 'customs'
    },
    {
      id: '14',
      question: 'Tại sao hàng bị tạm giữ tại hải quan và cách xử lý?',
      answer: 'Nguyên nhân thường gặp: (1) Thiếu/sai chứng từ, (2) Mã HS không chính xác, (3) Nghi ngờ giá trị khai báo, (4) Hàng thuộc diện kiểm tra chuyên ngành, (5) Sai thông tin người nhận/gửi. TBS xử lý: (1) Phối hợp trực tiếp với cán bộ hải quan, (2) Bổ sung chứng từ thiếu trong 24h, (3) Làm rõ thông tin theo yêu cầu, (4) Tư vấn điều chỉnh khai báo nếu cần, (5) Theo dõi sát sao đến khi thông quan.',
      category: 'customs'
    },
    {
      id: '15',
      question: 'Có thể thay đổi thông tin khai báo sau khi đã nộp hồ sơ không?',
      answer: 'Có thể thay đổi nhưng phụ thuộc vào giai đoạn: (1) Trước khi hải quan tiếp nhận: Có thể hủy/sửa tự do, (2) Sau khi tiếp nhận nhưng chưa thông quan: Cần làm đơn xin sửa đổi với lý do cụ thể, (3) Sau khi thông quan: Phải làm thủ tục điều chỉnh/bổ sung với các chứng từ đầy đủ. TBS có đội ngũ chuyên xử lý các trường hợp đặc biệt, tỷ lệ thành công 98%.',
      category: 'customs'
    },
    {
      id: '16',
      question: 'Làm sao biết hàng hóa có cần giấy phép nhập khẩu không?',
      answer: 'TBS sẽ kiểm tra và tư vấn dựa trên: (1) Mã HS của sản phẩm theo AHTN 2022, (2) Danh mục hàng hóa cấm/hạn chế nhập khẩu mới nhất, (3) Quy định của các bộ, ngành quản lý chuyên ngành, (4) Kinh nghiệm thực tế với từng loại hàng. Các hàng thường cần GP: thực phẩm, mỹ phẩm, thiết bị y tế, hóa chất, viễn thông, ô tô. Chúng tôi hỗ trợ làm GP hoặc tư vấn cách thay thế hợp pháp.',
      category: 'customs'
    }
  ]

  const categories = {
    all: 'Tất cả',
    guide: 'Hướng dẫn',
    template: 'Mẫu biểu',
    tax: 'Thuế & HS Code',
    reference: 'Tài liệu tham khảo'
  }

  const faqCategories = {
    all: 'Tất cả',
    general: 'Tổng quan',
    shipping: 'Vận chuyển',
    payment: 'Thanh toán',
    customs: 'Hải quan'
  }

  const [activeFAQCategory, setActiveFAQCategory] = useState<string>('all')

  const filteredDocuments = activeCategory === 'all' 
    ? documents 
    : documents.filter(doc => doc.category === activeCategory)

  const filteredFAQs = activeFAQCategory === 'all' 
    ? faqs 
    : faqs.filter(faq => faq.category === activeFAQCategory)

  return (
    <section className="section-padding bg-gradient-to-br from-green-50 to-teal-50">
      <div className="container-max">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            📚 Trung tâm tài liệu & Hỏi đáp
          </h2>
          <p className="text-xl text-gray-600">
            Tài liệu hữu ích và câu trả lời cho những thắc mắc phổ biến về nhập khẩu
          </p>
        </div>

        {/* Document Section */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            📁 Thư viện tài liệu
          </h3>
          
          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {Object.entries(categories).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setActiveCategory(key)}
                className={`px-4 py-2 rounded-full transition-colors ${
                  activeCategory === key
                    ? 'bg-primary-600 text-white'
                    : 'bg-white text-gray-600 hover:bg-primary-50'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Documents Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDocuments.map(doc => (
              <div key={doc.id} className="card hover:shadow-xl transition-all duration-300 group">
                <div className="text-center">
                  <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">
                    {doc.type === 'PDF' ? '📄' : doc.type === 'DOCX' ? '📝' : '📊'}
                  </div>
                  
                  <div className="mb-4">
                    <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                      doc.type === 'PDF' ? 'bg-red-100 text-red-800' :
                      doc.type === 'DOCX' ? 'bg-blue-100 text-blue-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {doc.type} • {doc.size}
                    </span>
                  </div>
                  
                  <h4 className="font-semibold text-gray-900 mb-3 text-sm">
                    {doc.title}
                  </h4>
                  
                  <p className="text-gray-600 text-xs mb-4">
                    {doc.description}
                  </p>
                  
                  <a 
                    href={doc.downloadDirect}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full btn-primary text-sm inline-block text-center"
                  >
                    📥 Tải xuống
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div>
          <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">
            ❓ Câu hỏi thường gặp (FAQ)
          </h3>
          <p className="text-center text-gray-600 mb-8">
            Những thắc mắc phổ biến và câu trả lời chi tiết để bảo vệ quyền lợi khách hàng
          </p>
          
          {/* FAQ Category Filter */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {Object.entries(faqCategories).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setActiveFAQCategory(key)}
                className={`px-4 py-2 rounded-full text-sm transition-all duration-300 ${
                  activeFAQCategory === key
                    ? 'bg-green-600 text-white shadow-lg scale-105'
                    : 'bg-white text-gray-600 hover:bg-green-50 hover:text-green-600 border border-gray-200'
                }`}
              >
                {key === 'general' ? '💡' : 
                 key === 'shipping' ? '🚛' : 
                 key === 'payment' ? '💳' : 
                 key === 'customs' ? '🏛️' : '📋'} {label}
              </button>
            ))}
          </div>
          
          <div className="max-w-4xl mx-auto space-y-4">
            {filteredFAQs.map(faq => (
              <div key={faq.id} className="card">
                <button
                  onClick={() => setOpenFAQ(openFAQ === faq.id ? null : faq.id)}
                  className="w-full text-left flex items-center justify-between p-4"
                >
                  <span className="font-medium text-gray-900 flex items-center">
                    <span className="mr-3">
                      {faq.category === 'general' ? '💡' : 
                       faq.category === 'shipping' ? '🚛' : 
                       faq.category === 'customs' ? '🏛️' : '💳'}
                    </span>
                    {faq.question}
                  </span>
                  <svg
                    className={`w-5 h-5 text-gray-400 transition-transform ${
                      openFAQ === faq.id ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {openFAQ === faq.id && (
                  <div className="px-4 pb-4">
                    <div className="pt-4 border-t border-gray-100">
                      <p className="text-gray-600 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Enhanced CTA */}
        <div className="text-center mt-12">
          <div className="bg-gradient-to-r from-green-600 to-teal-600 rounded-2xl p-8 shadow-2xl max-w-4xl mx-auto text-white">
            <div className="mb-6">
              <h4 className="text-2xl font-bold mb-4">
                🛡️ TBS GROUP - Bảo vệ quyền lợi khách hàng là ưu tiên số 1
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center justify-center space-x-2">
                  <span className="text-2xl">✅</span>
                  <span>Cam kết hoàn tiền 100%</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <span className="text-2xl">🛡️</span>
                  <span>Bảo hiểm toàn bộ hàng hóa</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <span className="text-2xl">📞</span>
                  <span>Hỗ trợ 24/7 kể cả lễ</span>
                </div>
              </div>
            </div>
            
            <p className="text-green-100 mb-6 text-lg">
              Còn thắc mắc? Đội ngũ chuyên gia 8+ năm kinh nghiệm sẵn sàng tư vấn miễn phí!
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/lien-he" className="bg-white text-green-600 px-6 py-3 rounded-lg font-semibold hover:bg-green-50 transition-colors">
                💬 Đặt câu hỏi miễn phí
              </a>
              <a href="tel:0976005335" className="bg-green-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-800 transition-colors">
                📞 Gọi ngay: 0976 005 335
              </a>
            </div>
            
            <div className="mt-6 text-green-200 text-sm">
              ⭐ Tỷ lệ thành công 99.8% • Hơn 8000 khách hàng tin tưởng • Minh bạch 100% chi phí
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
