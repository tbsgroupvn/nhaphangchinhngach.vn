'use client'

import { useState } from 'react'
import AdminHeader from '@/components/admin/AdminHeader'

interface ContentTemplate {
  type: 'service' | 'news' | 'policy' | 'popup'
  title: string
  description: string
  icon: string
  prompts: string[]
}

export default function AIAssistant() {
  const [selectedTemplate, setSelectedTemplate] = useState<ContentTemplate | null>(null)
  const [prompt, setPrompt] = useState('')
  const [generatedContent, setGeneratedContent] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [contentHistory, setContentHistory] = useState<any[]>([])

  const templates: ContentTemplate[] = [
    {
      type: 'service',
      title: 'Dịch vụ mới',
      description: 'Tạo nội dung mô tả dịch vụ xuất nhập khẩu',
      icon: '🏢',
      prompts: [
        'Viết mô tả dịch vụ vận chuyển hàng hóa từ Trung Quốc',
        'Tạo danh sách lợi ích của dịch vụ nhập khẩu chính ngạch',
        'Viết FAQ cho dịch vụ thông quan hải quan'
      ]
    },
    {
      type: 'news',
      title: 'Bài viết tin tức',
      description: 'Tạo bài viết về thị trường xuất nhập khẩu',
      icon: '📰',
      prompts: [
        'Viết bài về xu hướng nhập khẩu từ Trung Quốc năm 2025',
        'Tạo bài hướng dẫn thủ tục hải quan mới nhất',
        'Viết tin tức về quy định thuế nhập khẩu'
      ]
    },
    {
      type: 'policy',
      title: 'Chính sách',
      description: 'Tạo nội dung chính sách công ty',
      icon: '📜',
      prompts: [
        'Viết chính sách vận chuyển và giao hàng',
        'Tạo điều khoản sử dụng dịch vụ',
        'Viết chính sách đổi trả và hoàn tiền'
      ]
    },
    {
      type: 'popup',
      title: 'Popup thông báo',
      description: 'Tạo nội dung popup khuyến mãi, thông báo',
      icon: '🔔',
      prompts: [
        'Tạo popup khuyến mãi giảm phí vận chuyển',
        'Viết thông báo về dịch vụ mới',
        'Tạo popup thu thập email khách hàng'
      ]
    }
  ]

  const generateContent = async () => {
    if (!prompt.trim()) {
      alert('Vui lòng nhập yêu cầu tạo nội dung')
      return
    }

    setIsGenerating(true)
    
    try {
      // Simulate AI API call - trong thực tế sẽ gọi Gemini API
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const mockContent = generateMockContent(prompt, selectedTemplate?.type)
      setGeneratedContent(mockContent)
      
      // Add to history
      const newItem = {
        id: Date.now(),
        prompt,
        content: mockContent,
        type: selectedTemplate?.type || 'general',
        createdAt: new Date().toLocaleString('vi-VN')
      }
      setContentHistory(prev => [newItem, ...prev].slice(0, 10))
      
    } catch (error) {
      alert('Có lỗi xảy ra khi tạo nội dung. Vui lòng thử lại.')
    }
    
    setIsGenerating(false)
  }

  const generateMockContent = (prompt: string, type?: string) => {
    const templates = {
      service: `# Dịch vụ ${prompt}

## Mô tả dịch vụ
Chúng tôi cung cấp dịch vụ ${prompt} chuyên nghiệp, đảm bảo:
- Quy trình minh bạch và rõ ràng
- Thời gian xử lý nhanh chóng
- Chi phí cạnh tranh
- Hỗ trợ 24/7

## Lợi ích chính
1. **Tiết kiệm thời gian**: Rút ngắn thời gian xử lý từ 7-10 ngày
2. **An toàn**: Bảo hiểm hàng hóa 100% giá trị
3. **Minh bạch**: Theo dõi realtime qua hệ thống
4. **Chuyên nghiệp**: Đội ngũ 8+ năm kinh nghiệm

## Quy trình thực hiện
1. Tiếp nhận yêu cầu và tư vấn
2. Ký hợp đồng và đặt cọc
3. Thực hiện dịch vụ
4. Giao hàng và thanh toán

*Liên hệ ngay: 0976 005 335 để được tư vấn miễn phí!*`,

      news: `# ${prompt}

## Giới thiệu
Thị trường xuất nhập khẩu đang có những biến động quan trọng...

## Những điểm chính cần lưu ý
- **Quy định mới**: Cập nhật các quy định pháp lý mới nhất
- **Thủ tục**: Đơn giản hóa quy trình hành chính
- **Chi phí**: Tối ưu hóa chi phí vận chuyển

## Tác động đến doanh nghiệp
Những thay đổi này sẽ ảnh hưởng tích cực đến:
1. Thời gian thông quan
2. Chi phí logistics
3. Hiệu quả kinh doanh

## Khuyến nghị
TBS GROUP khuyến nghị doanh nghiệp nên:
- Cập nhật thông tin thường xuyên
- Tham khảo ý kiến chuyên gia
- Chuẩn bị hồ sơ đầy đủ

*Nguồn: TBS GROUP Research Team*`,

      policy: `# CHÍNH SÁCH ${prompt.toUpperCase()}

## 1. Phạm vi áp dụng
Chính sách này áp dụng cho tất cả khách hàng sử dụng dịch vụ của TBS GROUP.

## 2. Quy định chung
- Khách hàng cần tuân thủ đầy đủ các quy định
- Mọi thay đổi sẽ được thông báo trước 7 ngày
- Chính sách có hiệu lực từ ngày ký hợp đồng

## 3. Quyền và nghĩa vụ
### Quyền của khách hàng:
- Được tư vấn miễn phí
- Được bảo vệ thông tin cá nhân
- Được khiếu nại khi có vấn đề

### Nghĩa vụ của khách hàng:
- Cung cấp thông tin chính xác
- Thanh toán đúng hạn
- Tuân thủ quy định pháp luật

## 4. Xử lý khiếu nại
Mọi khiếu nại sẽ được xử lý trong vòng 24 giờ.
Hotline: 0363 212 334

*Chính sách có hiệu lực từ 01/01/2025*`,

      popup: `🎉 **${prompt}** 🎉

✨ **KHUYẾN MÃI ĐẶC BIỆT** ✨

🔥 Giảm ngay 30% phí vận chuyển
⚡ Miễn phí tư vấn 24/7
🛡️ Bảo hiểm hàng hóa 100%

📞 **Hotline: 0976 005 335**
💬 **Chat Zalo ngay để nhận ưu đãi!**

⏰ *Chương trình có hạn - Đừng bỏ lỡ!*`
    }

    return templates[type as keyof typeof templates] || `Nội dung được tạo cho: ${prompt}\n\nĐây là nội dung mẫu được tạo bởi AI Assistant. Trong thực tế, đây sẽ là nội dung chi tiết và phù hợp với yêu cầu cụ thể của bạn.`
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    alert('Đã sao chép nội dung!')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader 
        title="AI Content Assistant" 
        subtitle="Tạo nội dung tự động với trí tuệ nhân tạo"
      />
      
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Templates */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                📋 Mẫu nội dung
              </h3>
              
              <div className="space-y-3">
                {templates.map((template, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedTemplate(template)}
                    className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                      selectedTemplate?.type === template.type
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center mb-2">
                      <span className="text-xl mr-3">{template.icon}</span>
                      <h4 className="font-medium text-gray-900">{template.title}</h4>
                    </div>
                    <p className="text-sm text-gray-600">{template.description}</p>
                  </button>
                ))}
              </div>

              {/* Quick Prompts */}
              {selectedTemplate && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h4 className="font-medium text-gray-900 mb-3">Gợi ý nhanh:</h4>
                  <div className="space-y-2">
                    {selectedTemplate.prompts.map((promptText, index) => (
                      <button
                        key={index}
                        onClick={() => setPrompt(promptText)}
                        className="block w-full text-left text-sm text-primary-600 hover:text-primary-700 p-2 rounded hover:bg-primary-50 transition-colors"
                      >
                        • {promptText}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Input */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                🤖 Yêu cầu tạo nội dung
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mô tả chi tiết nội dung bạn muốn tạo:
                  </label>
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                    placeholder="Ví dụ: Viết mô tả dịch vụ vận chuyển hàng hóa từ Trung Quốc, bao gồm lợi ích, quy trình và giá cả..."
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    {selectedTemplate && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-primary-100 text-primary-700">
                        {selectedTemplate.icon} {selectedTemplate.title}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={generateContent}
                    disabled={isGenerating || !prompt.trim()}
                    className="bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center"
                  >
                    {isGenerating ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Đang tạo...
                      </>
                    ) : (
                      <>
                        ✨ Tạo nội dung
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Generated Content */}
            {generatedContent && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    📄 Nội dung được tạo
                  </h3>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => copyToClipboard(generatedContent)}
                      className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm hover:bg-blue-200 transition-colors"
                    >
                      📋 Sao chép
                    </button>
                    <button
                      onClick={() => setGeneratedContent('')}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 transition-colors"
                    >
                      🗑️ Xóa
                    </button>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4">
                  <pre className="text-sm text-gray-800 whitespace-pre-wrap font-sans">
                    {generatedContent}
                  </pre>
                </div>
              </div>
            )}

            {/* History */}
            {contentHistory.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  🕒 Lịch sử tạo nội dung
                </h3>
                
                <div className="space-y-4">
                  {contentHistory.map((item) => (
                    <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full capitalize">
                            {item.type}
                          </span>
                          <span className="text-xs text-gray-500 ml-2">{item.createdAt}</span>
                        </div>
                        <button
                          onClick={() => copyToClipboard(item.content)}
                          className="text-xs text-primary-600 hover:text-primary-700"
                        >
                          📋 Sao chép
                        </button>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        <strong>Yêu cầu:</strong> {item.prompt}
                      </p>
                      <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded truncate">
                        {item.content.substring(0, 150)}...
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 