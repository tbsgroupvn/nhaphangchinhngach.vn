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
      question: 'Phí ủy thác 1.5% được tính như thế nào?',
      answer: 'Phí ủy thác 1.5% được tính trên giá trị CIF của lô hàng. Đây là phí dịch vụ cho việc làm thủ tục hải quan và hỗ trợ khách hàng.',
      category: 'payment'
    },
    {
      id: '4',
      question: 'Những loại hàng nào TBS GROUP không nhận?',
      answer: 'Chúng tôi không nhận: khoáng sản, hàng cấm, thực phẩm tươi sống, hóa chất nguy hiểm, động vật sống, hàng không có giấy phép nhập khẩu.',
      category: 'general'
    }
  ]

  const categories = {
    all: 'Tất cả',
    guide: 'Hướng dẫn',
    template: 'Mẫu biểu',
    tax: 'Thuế & HS Code',
    reference: 'Tài liệu tham khảo'
  }

  const filteredDocuments = activeCategory === 'all' 
    ? documents 
    : documents.filter(doc => doc.category === activeCategory)

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
          <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            ❓ Câu hỏi thường gặp (FAQ)
          </h3>
          
          <div className="max-w-4xl mx-auto space-y-4">
            {faqs.map(faq => (
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

        {/* CTA */}
        <div className="text-center mt-12">
          <div className="bg-white rounded-lg p-8 shadow-lg max-w-2xl mx-auto">
            <h4 className="text-xl font-semibold text-gray-900 mb-4">
              Không tìm thấy câu trả lời?
            </h4>
            <p className="text-gray-600 mb-6">
              Đội ngũ chuyên gia của chúng tôi luôn sẵn sàng giải đáp mọi thắc mắc của bạn
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/lien-he" className="btn-primary">
                💬 Đặt câu hỏi
              </a>
              <a href="tel:0976005335" className="btn-secondary">
                📞 Gọi ngay: 0976 005 335
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
