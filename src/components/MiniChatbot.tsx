'use client'

import { useState } from 'react'

interface ChatMessage {
  id: string
  text: string
  isBot: boolean
  timestamp: Date
}

export default function MiniChatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      text: 'Xin chào! 👋 Tôi là TBS Bot AI thông minh. Tôi có thể trả lời chi tiết về thuật ngữ nhập khẩu, tính toán chi phí, quy trình thông quan từ Trung Quốc. Hãy hỏi tôi bất kỳ câu hỏi nào về XNK!',
      isBot: true,
      timestamp: new Date()
    }
  ])
  const [inputText, setInputText] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSendMessage = async () => {
    if (!inputText.trim() || isLoading) return

    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: inputText,
      isBot: false,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setIsLoading(true)
    const currentInput = inputText
    setInputText('')

    try {
      console.log('Sending message to API:', currentInput) // Debug log

      // Call the AI API
      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: currentInput,
          history: messages.slice(-10) // Send last 10 messages for context
        }),
      })

      console.log('API Response status:', response.status) // Debug log

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      console.log('API Response data:', data) // Debug log

      if (data.response) {
        // Add AI response
        setMessages(prev => [...prev, {
          id: (Date.now() + 1).toString(),
          text: data.response,
          isBot: true,
          timestamp: new Date()
        }])
      } else {
        // Error from API
        setMessages(prev => [...prev, {
          id: (Date.now() + 1).toString(),
          text: data.error || 'Xin lỗi, tôi gặp sự cố. Vui lòng liên hệ hotline 0976 005 335 để được hỗ trợ.',
          isBot: true,
          timestamp: new Date()
        }])
      }
    } catch (error) {
      console.error('Chat error:', error) // Debug log
      // Network or other errors
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        text: `🔄 **Lỗi kết nối!** Vui lòng thử lại hoặc liên hệ:

📞 **Hotline:** 0976 005 335
✉️ **Email:** info@xuatnhapkhautbs.vn
💬 **Zalo:** https://zalo.me/0976005335
🎵 **TikTok:** @tbslogistics

Chúng tôi sẽ hỗ trợ bạn ngay lập tức!`,
        isBot: true,
        timestamp: new Date()
      }])
    } finally {
      setIsLoading(false)
    }
  }

  const handleQuickQuestion = (question: string) => {
    setInputText(question)
    // Use timeout to ensure input is set before sending
    setTimeout(() => {
      handleSendMessage()
    }, 100)
  }

  const formatBotMessage = (text: string) => {
    return text.split('\n').map((line, index) => (
      <div key={index} className={line.startsWith('•') ? 'ml-4' : ''}>
        {line.includes('**') ? (
          <span dangerouslySetInnerHTML={{ 
            __html: line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') 
          }} />
        ) : line}
      </div>
    ))
  }

  return (
    <>
      {/* Floating Chat Button */}
      <div className="fixed bottom-6 left-6 z-50">
        <button
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group"
          title="TBS Bot - Trợ lý ảo thông minh"
        >
          <div className="relative">
            <span className="text-2xl">🤖</span>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
          </div>
        </button>
        
        {/* Tooltip */}
        <div className="absolute bottom-16 left-0 bg-gray-900 text-white text-sm px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
          TBS Bot - AI Hỏi đáp XNK
          <div className="absolute top-full left-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
        </div>
      </div>

      {/* Chat Modal */}
      {isOpen && (
        <div className="fixed bottom-6 left-6 z-[60] w-96 h-[500px] bg-white rounded-2xl shadow-2xl flex flex-col">
          {/* Header */}
          <div className="bg-green-500 text-white p-4 rounded-t-2xl flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-400 rounded-full flex items-center justify-center">
                <span className="text-xl">🤖</span>
              </div>
              <div>
                <h3 className="font-semibold">TBS Bot AI</h3>
                <p className="text-xs text-green-100">Trợ lý ảo thông minh</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-green-400 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4">
            {messages.map(message => (
              <div key={message.id} className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}>
                <div className={`max-w-xs p-3 rounded-lg text-sm ${
                  message.isBot 
                    ? 'bg-gray-100 text-gray-800' 
                    : 'bg-green-500 text-white'
                }`}>
                  {message.isBot ? formatBotMessage(message.text) : message.text}
                </div>
              </div>
            ))}
            
            {/* Loading indicator */}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-800 p-3 rounded-lg text-sm flex items-center space-x-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce delay-100"></div>
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce delay-200"></div>
                  </div>
                  <span className="text-xs text-gray-500">TBS Bot đang suy nghĩ...</span>
                </div>
              </div>
            )}
          </div>

          {/* Quick Questions */}
          <div className="p-4 border-t border-gray-100">
            <p className="text-xs text-gray-500 mb-2">Câu hỏi phổ biến:</p>
            <div className="flex flex-wrap gap-2">
              {[
                'Chi phí nhập khẩu là gì?', 
                'Thời gian vận chuyển',
                'Hàng chính ngạch',
                'Mã HS Code',
                'Đường biển vs đường bộ'
              ].map(question => (
                <button
                  key={question}
                  onClick={() => handleQuickQuestion(question)}
                  disabled={isLoading}
                  className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded-full hover:bg-green-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-100">
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSendMessage()}
                placeholder={isLoading ? "Đang xử lý..." : "Hỏi về XNK, thuế, vận chuyển..."}
                disabled={isLoading}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputText.trim() || isLoading}
                className="w-10 h-10 bg-green-500 text-white rounded-lg flex items-center justify-center hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}