'use client'

import { useState, useRef, useEffect } from 'react'
import { 
  FaRobot, FaPaperPlane, FaMagic, FaImage, FaSearch, FaEdit,
  FaCopy, FaDownload, FaSave, FaHistory, FaTrash, FaBulb,
  FaNewspaper, FaTags, FaGlobe, FaChartLine, FaMicrophone
} from 'react-icons/fa'
import AdminHeader from '../../../components/admin/AdminHeader'

interface Message {
  id: string
  type: 'user' | 'assistant'
  content: string
  timestamp: Date
  suggestions?: string[]
}

interface AITemplate {
  id: string
  name: string
  description: string
  category: 'content' | 'seo' | 'social' | 'email'
  icon: React.ComponentType
  prompt: string
  fields: {
    name: string
    label: string
    type: 'text' | 'textarea' | 'select'
    options?: string[]
    required: boolean
  }[]
}

export default function AIAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: 'Chào bạn! 👋 Tôi là AI Assistant của TBS GROUP. Tôi có thể giúp bạn:\n\n• Viết nội dung bài viết chuyên nghiệp\n• Tối ưu SEO cho website\n• Tạo tiêu đề hấp dẫn\n• Dịch thuật tiếng Anh - Việt\n• Phân tích từ khóa\n• Tạo mô tả sản phẩm\n\nBạn cần hỗ trợ gì hôm nay?',
      timestamp: new Date(),
      suggestions: [
        'Viết bài về xu hướng logistics 2024',
        'Tối ưu SEO cho trang dịch vụ',
        'Tạo tiêu đề cho bài viết mới',
        'Phân tích từ khóa nhập khẩu'
      ]
    }
  ])
  
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<'chat' | 'templates' | 'history'>('chat')
  const [selectedTemplate, setSelectedTemplate] = useState<AITemplate | null>(null)
  const [templateData, setTemplateData] = useState<Record<string, string>>({})
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const templates: AITemplate[] = [
    {
      id: 'blog-post',
      name: 'Viết bài blog',
      description: 'Tạo bài viết blog chuyên nghiệp về logistics và xuất nhập khẩu',
      category: 'content',
      icon: FaNewspaper,
      prompt: 'Viết một bài blog về {topic} với độ dài khoảng {length} từ, tập trung vào {audience}. Bao gồm: giới thiệu, nội dung chính, và kết luận.',
      fields: [
        { name: 'topic', label: 'Chủ đề', type: 'text', required: true },
        { name: 'length', label: 'Độ dài', type: 'select', options: ['500-800', '800-1200', '1200-2000'], required: true },
        { name: 'audience', label: 'Đối tượng', type: 'select', options: ['Doanh nghiệp', 'Cá nhân', 'Chuyên gia'], required: true }
      ]
    },
    {
      id: 'seo-optimize',
      name: 'Tối ưu SEO',
      description: 'Tạo title, description và từ khóa SEO hiệu quả',
      category: 'seo',
      icon: FaSearch,
      prompt: 'Tối ưu SEO cho trang web về {topic}. Tạo meta title (50-60 ký tự), meta description (150-160 ký tự), và gợi ý 10 từ khóa liên quan.',
      fields: [
        { name: 'topic', label: 'Chủ đề trang', type: 'text', required: true },
        { name: 'keywords', label: 'Từ khóa chính', type: 'text', required: true }
      ]
    },
    {
      id: 'product-description',
      name: 'Mô tả dịch vụ',
      description: 'Viết mô tả dịch vụ logistics hấp dẫn và chuyên nghiệp',
      category: 'content',
      icon: FaEdit,
      prompt: 'Viết mô tả cho dịch vụ {service} của TBS GROUP. Làm nổi bật {benefits} và phù hợp với khách hàng {target}.',
      fields: [
        { name: 'service', label: 'Tên dịch vụ', type: 'text', required: true },
        { name: 'benefits', label: 'Lợi ích chính', type: 'textarea', required: true },
        { name: 'target', label: 'Khách hàng mục tiêu', type: 'text', required: true }
      ]
    },
    {
      id: 'social-post',
      name: 'Bài viết social',
      description: 'Tạo nội dung cho Facebook, Instagram, LinkedIn',
      category: 'social',
      icon: FaGlobe,
      prompt: 'Tạo bài viết cho {platform} về {topic}. Phong cách {tone}, độ dài phù hợp, có hashtag và call-to-action.',
      fields: [
        { name: 'platform', label: 'Nền tảng', type: 'select', options: ['Facebook', 'Instagram', 'LinkedIn'], required: true },
        { name: 'topic', label: 'Chủ đề', type: 'text', required: true },
        { name: 'tone', label: 'Phong cách', type: 'select', options: ['Chuyên nghiệp', 'Thân thiện', 'Hài hước'], required: true }
      ]
    },
    {
      id: 'email-template',
      name: 'Email marketing',
      description: 'Tạo email chăm sóc khách hàng và marketing',
      category: 'email',
      icon: FaPaperPlane,
      prompt: 'Viết email {type} cho khách hàng về {subject}. Phong cách {tone}, có subject line hấp dẫn và CTA rõ ràng.',
      fields: [
        { name: 'type', label: 'Loại email', type: 'select', options: ['Chào mừng', 'Khuyến mãi', 'Thông báo', 'Chăm sóc'], required: true },
        { name: 'subject', label: 'Nội dung chính', type: 'text', required: true },
        { name: 'tone', label: 'Phong cách', type: 'select', options: ['Trang trọng', 'Thân thiện', 'Cấp bách'], required: true }
      ]
    }
  ]

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const sendMessage = async (content: string) => {
    if (!content.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: content.trim(),
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsLoading(true)

    // Simulate AI response
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: generateAIResponse(content),
        timestamp: new Date(),
        suggestions: generateSuggestions(content)
      }

      setMessages(prev => [...prev, assistantMessage])
      setIsLoading(false)
    }, 2000 + Math.random() * 1000)
  }

  const generateAIResponse = (userInput: string): string => {
    const input = userInput.toLowerCase()
    
    if (input.includes('bài viết') || input.includes('blog')) {
      return `# Bài viết: ${userInput.replace(/viết|bài viết về|blog về/gi, '').trim()}

## Giới thiệu
Trong bối cảnh thương mại quốc tế ngày càng phát triển, việc nắm vững các xu hướng mới trong ngành logistics trở nên quan trọng hơn bao giờ hết.

## Nội dung chính

### 1. Phân tích thị trường hiện tại
- Tình hình xuất nhập khẩu Việt Nam - Trung Quốc
- Các thách thức và cơ hội trong năm 2024
- Tác động của công nghệ số đến ngành logistics

### 2. Giải pháp từ TBS GROUP
- Dịch vụ vận chuyển đa phương thức
- Hệ thống theo dõi thời gian thực
- Tư vấn thủ tục hải quan chuyên nghiệp

### 3. Lợi ích cho doanh nghiệp
- Tiết kiệm chi phí vận chuyển lên đến 30%
- Rút ngắn thời gian giao hàng
- Đảm bảo an toàn hàng hóa

## Kết luận
TBS GROUP cam kết đồng hành cùng doanh nghiệp Việt trong hành trình phát triển thương mại quốc tế. Liên hệ ngay để được tư vấn miễn phí!

**Call-to-action:** Liên hệ hotline: 0123 456 789 hoặc email: info@tbsgroup.vn`;
    }
    
    if (input.includes('seo') || input.includes('từ khóa')) {
      return `## Tối ưu SEO cho "${userInput}"

### Meta Title (58 ký tự):
TBS GROUP - Dịch vụ nhập khẩu chính ngạch từ Trung Quốc

### Meta Description (156 ký tự):
Chuyên cung cấp dịch vụ xuất nhập khẩu, vận chuyển chuyên nghiệp từ Trung Quốc về Việt Nam. Tiết kiệm chi phí, nhanh chóng, an toàn. Tư vấn miễn phí 24/7.

### Từ khóa chính:
1. **nhập khẩu từ trung quốc** (500-1K searches/month)
2. **dịch vụ logistics** (1K-10K searches/month)
3. **vận chuyển hàng hóa** (1K-10K searches/month)
4. **xuất nhập khẩu** (10K-100K searches/month)
5. **thủ tục hải quan** (100-1K searches/month)

### Từ khóa dài:
- "cách nhập khẩu hàng từ trung quốc"
- "thủ tục xuất nhập khẩu 2024"
- "chi phí vận chuyển từ trung quốc về việt nam"
- "dịch vụ làm thủ tục hải quan"

### Gợi ý nội dung:
- Tạo landing page cho từng dịch vụ chính
- Viết blog hướng dẫn thủ tục chi tiết
- Tối ưu hình ảnh với alt text
- Xây dựng internal linking strategy`;
    }

    if (input.includes('tiêu đề')) {
      return `## Gợi ý tiêu đề hấp dẫn:

### Tiêu đề SEO (50-60 ký tự):
1. "Nhập khẩu từ Trung Quốc - TBS GROUP uy tín #1"
2. "Dịch vụ logistics chuyên nghiệp | TBS GROUP"
3. "Vận chuyển hàng TQ-VN nhanh chóng, an toàn"

### Tiêu đề Facebook (Dưới 25 từ):
1. "🚚 Nhập hàng Trung Quốc giá rẻ - Giao tận tay!"
2. "💰 Tiết kiệm 30% chi phí vận chuyển cùng TBS"
3. "⚡ Express từ TQ về VN chỉ trong 3-5 ngày"

### Tiêu đề blog:
1. "Cẩm nang xuất nhập khẩu 2024: Từ A-Z cho người mới"
2. "5 bí quyết tiết kiệm chi phí khi nhập hàng từ Trung Quốc"
3. "Xu hướng logistics thông minh: Cách mạng hóa chuỗi cung ứng"

**Mẹo:** Sử dụng số liệu, emoji phù hợp và từ khóa chính trong tiêu đề để tăng tỷ lệ click!`;
    }

    // Default response
    return `Cảm ơn bạn đã sử dụng AI Assistant! 

Tôi hiểu bạn muốn hỗ trợ về: "${userInput}"

Để tôi có thể giúp bạn tốt hất, hãy thử:

1. **Sử dụng các template có sẵn** - Click tab "Templates" để chọn mẫu phù hợp
2. **Cung cấp thêm chi tiết** - Càng nhiều thông tin, kết quả càng chính xác
3. **Sử dụng từ khóa cụ thể** như: "viết bài về...", "tối ưu SEO cho...", "tạo tiêu đề..."

Một số ví dụ bạn có thể thử:
- "Viết bài blog về xu hướng logistics 2024"
- "Tối ưu SEO cho trang dịch vụ nhập khẩu"
- "Tạo mô tả cho dịch vụ vận chuyển express"`;
  }

  const generateSuggestions = (userInput: string): string[] => {
    const suggestions = [
      'Tối ưu thêm từ khóa cho bài này',
      'Tạo tiêu đề social media',
      'Viết email marketing',
      'Phân tích đối thủ cạnh tranh'
    ]
    return suggestions.slice(0, 3)
  }

  const handleTemplateSubmit = () => {
    let prompt = selectedTemplate!.prompt
    
    // Replace placeholders with actual data
    selectedTemplate!.fields.forEach(field => {
      const value = templateData[field.name] || ''
      prompt = prompt.replace(`{${field.name}}`, value)
    })

    sendMessage(prompt)
    setSelectedTemplate(null)
    setTemplateData({})
    setActiveTab('chat')
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    alert('Đã copy vào clipboard!')
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage(inputValue)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader 
        title="AI Content Assistant" 
        subtitle="Tạo nội dung tự động với trí tuệ nhân tạo"
      />
      
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* Templates */}
          <div className="lg:col-span-3">
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
                      selectedTemplate?.id === template.id
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center mb-2">
                      <span className="text-xl mr-3">{React.createElement(template.icon)}</span>
                      <h4 className="font-medium text-gray-900">{template.name}</h4>
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
                    {selectedTemplate.fields.map((field, index) => (
                      <button
                        key={index}
                        onClick={() => setInputValue(field.prompt)}
                        className="block w-full text-left text-sm text-primary-600 hover:text-primary-700 p-2 rounded hover:bg-primary-50 transition-colors"
                      >
                        • {field.prompt}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-1 space-y-6">
            
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
                    ref={textareaRef}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ví dụ: Viết mô tả dịch vụ vận chuyển hàng hóa từ Trung Quốc, bao gồm lợi ích, quy trình và giá cả..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                    rows={4}
                    disabled={isLoading}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    {selectedTemplate && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-primary-100 text-primary-700">
                        {React.createElement(selectedTemplate.icon)} {selectedTemplate.name}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => sendMessage(inputValue)}
                    disabled={isLoading || !inputValue.trim()}
                    className="bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center"
                  >
                    {isLoading ? (
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
            {messages.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    📄 Nội dung được tạo
                  </h3>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => copyToClipboard(messages[messages.length - 1].content)}
                      className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm hover:bg-blue-200 transition-colors"
                    >
                      📋 Sao chép
                    </button>
                    <button
                      onClick={() => setMessages(messages.slice(0, messages.length - 1))}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 transition-colors"
                    >
                      🗑️ Xóa
                    </button>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4">
                  <pre className="text-sm text-gray-800 whitespace-pre-wrap font-sans">
                    {messages[messages.length - 1].content}
                  </pre>
                </div>
              </div>
            )}

            {/* History */}
            {messages.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  🕒 Lịch sử tạo nội dung
                </h3>
                
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div key={message.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full capitalize">
                            {message.type === 'user' ? 'Người dùng' : 'AI'}
                          </span>
                          <span className="text-xs text-gray-500 ml-2">{message.timestamp.toLocaleString('vi-VN')}</span>
                        </div>
                        <button
                          onClick={() => copyToClipboard(message.content)}
                          className="text-xs text-primary-600 hover:text-primary-700"
                        >
                          📋 Sao chép
                        </button>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        <strong>Yêu cầu:</strong> {message.content}
                      </p>
                      <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded truncate">
                        {message.content.substring(0, 150)}...
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