import { NextRequest, NextResponse } from 'next/server'

// For now, use enhanced knowledge base with intelligent responses
// We can add real Gemini API later when we have better error handling

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { message, history = [] } = body

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Vui lòng nhập tin nhắn hợp lệ' },
        { status: 400 }
      )
    }

    // Use enhanced AI-like responses based on patterns
    const response = await generateEnhancedResponse(message, history)
    
    return NextResponse.json({
      response,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Xin lỗi, tôi đang gặp sự cố. Vui lòng liên hệ hotline 0976 005 335 để được hỗ trợ.' },
      { status: 500 }
    )
  }
}

async function generateEnhancedResponse(userMessage: string, history: any[]): Promise<string> {
  const lowerMessage = userMessage.toLowerCase()
  
  // Enhanced knowledge base with intelligent pattern matching
  const responses = [
    {
      patterns: ['chính ngạch', 'chinh ngach', 'hàng chính ngạch', 'legal', 'pháp lý'],
      response: `🏛️ **Hàng chính ngạch TBS GROUP:**

🎯 **Cam kết 100% chính ngạch:**
• Hóa đơn xuất khẩu VAT Invoice từ Trung Quốc
• Hợp đồng mua bán song ngữ chính thức  
• Khai báo hải quan đầy đủ, minh bạch
• Giấy phép nhập khẩu cho từng lô hàng

✅ **Lợi ích vượt trội:**
• An toàn pháp lý tuyệt đối
• Bảo hành, bảo hiểm đầy đủ
• Có thể kiện cáo khi tranh chấp
• Ngân hàng chấp nhận làm tài sản đảm bảo
• Thuận tiện cho tái xuất khẩu

💰 **Chi phí minh bạch:**
• Phí ủy thác: 1.5% - 3% tùy giá trị lô hàng
• Không phát sinh chi phí ẩn
• Báo giá chi tiết từng khoản

📞 **Tư vấn miễn phí:** 0976 005 335`
    },
    {
      patterns: ['giá', 'cost', 'chi phí', 'phí', 'tính toán', 'calculator'],
      response: `💰 **Cách tính chi phí nhập khẩu TBS GROUP:**

🧮 **Công thức chuẩn:**
**Tổng chi phí = CIF + Thuế NK + VAT + Phí ủy thác**

📊 **Ví dụ thực tế:** (Đồ gia dụng nhựa 1 tấn)
• **Giá FOB:** 8,000 USD
• **Vận chuyển:** 800 USD (đường bộ)
• **Bảo hiểm:** 44 USD (0.5%)
• **CIF:** 8,844 USD = 221 triệu VND

• **Thuế NK (18%):** 39.78 triệu VND
• **VAT (10%):** 26.08 triệu VND  
• **Phí ủy thác (2.5%):** 5.53 triệu VND

🎯 **Tổng cuối:** 292.39 triệu VND

📱 **Báo giá chi tiết cho hàng của bạn:**
📞 Hotline: 0976 005 335
✉️ Email: info@xuatnhapkhautbs.vn`
    },
    {
      patterns: ['thời gian', 'time', 'bao lâu', 'delivery', 'giao hàng'],
      response: `⏰ **Thời gian nhập khẩu TBS GROUP:**

🚛 **Đường bộ qua Bằng Tường:**
• **7-12 ngày** từ kho TQ đến kho VN
• Phù hợp: Hàng gấp, giá trị >50k/kg
• Chi phí: 35-45 yuan/kg
• **Ưu điểm:** Nhanh, ít rủi ro hư hỏng

🚢 **Đường biển Container:**
• **15-20 ngày** cảng TQ → cảng VN
• Phù hợp: Hàng >3m³, không gấp
• Chi phí: 8-15 yuan/kg
• **Ưu điểm:** Rẻ nhất, an toàn cao

✈️ **Đường hàng không:**
• **3-5 ngày** siêu tốc
• Phù hợp: Hàng nhẹ, giá trị >200k/kg
• Chi phí: 150-300 yuan/kg
• **Ưu điểm:** Nhanh tuyệt đối

📋 **Thời gian thông quan:** 1-3 ngày
• TBS có team chuyên nghiệp xử lý 24/7

💡 **Tư vấn tuyến đường tối ưu:** 0976 005 335`
    },
    {
      patterns: ['hs code', 'mã hs', 'classification', 'thuế', 'tax'],
      response: `🔢 **Mã HS Code & Thuế nhập khẩu 2024:**

📚 **Các mã HS phổ biến:**
• **3924.10.00** - Đồ gia dụng nhựa: **18%**
• **8516.60.00** - Thiết bị sưởi gia đình: **22%**
• **9609.10.00** - Bút chì, bút bi: **15%**
• **9403.30.00** - Nội thất văn phòng: **20%**
• **8517.62.00** - Phụ kiện điện thoại: **28%**
• **8479.89.00** - Máy móc chuyên dụng: **12%**
• **3901.10.00** - Nhựa nguyên liệu: **15%**

🎯 **Công thức tính thuế:**
• **Thuế NK:** CIF × % thuế suất
• **VAT:** (CIF + Thuế NK) × 10%
• **Tổng thuế:** Thuế NK + VAT

⚠️ **Lưu ý quan trọng:**
• Chọn sai mã HS → thuế cao hơn 5-15%
• TBS hỗ trợ tra cứu mã HS chính xác
• Tận dụng ưu đãi EVFTA, CPTPP

🔍 **Tra cứu mã HS miễn phí:** 0976 005 335`
    },
    {
      patterns: ['quy trình', 'process', 'thủ tục', 'procedure', 'how', 'làm sao'],
      response: `📋 **Quy trình nhập khẩu 7 bước với TBS:**

1️⃣ **Gửi thông tin hàng hóa**
• Khách hàng gửi: Link sản phẩm/hình ảnh
• TBS báo giá chi tiết trong 2h

2️⃣ **Ký hợp đồng & đặt cọc**  
• Hợp đồng song ngữ rõ ràng
• Đặt cọc 70-80% giá trị hợp đồng để bắt đầu

3️⃣ **TBS đặt hàng & theo dõi**
• Đàm phán giá, kiểm tra chất lượng
• Cập nhật tiến độ sản xuất

4️⃣ **Vận chuyển về Việt Nam**
• Lựa chọn tuyến đường tối ưu
• Theo dõi realtime, thông báo vị trí

5️⃣ **Khai báo hải quan**
• TBS làm tất cả thủ tục
• Khách hàng chỉ cần thanh toán thuế

6️⃣ **Thông quan & nộp thuế**
• Xử lý trong 1-3 ngày
• Minh bạch từng khoản phí

7️⃣ **Giao hàng tận nơi**
• Vận chuyển đến kho khách hàng
• Hỗ trợ bốc xếp, kiểm đếm

🎯 **Khách hàng chỉ việc:** Gửi thông tin → Chờ nhận hàng!
📞 **Bắt đầu ngay:** 0976 005 335`
    },
    {
      patterns: ['rủi ro', 'risk', 'safe', 'an toàn', 'bảo hiểm', 'insurance'],
      response: `🛡️ **Quản lý rủi ro toàn diện TBS GROUP:**

⚠️ **Rủi ro thường gặp khi nhập khẩu:**
• Nhà cung cấp lừa đảo, hàng fake
• Chất lượng không đúng mô tả
• Vận chuyển thất thoát, hư hỏng
• Tăng thuế đột xuất, thay đổi chính sách

✅ **TBS bảo vệ khách hàng 360°:**

🔍 **Thẩm định nhà cung cấp:**
• Kiểm tra giấy phép kinh doanh
• Đánh giá uy tín qua 8 năm kinh nghiệm
• Blacklist những nhà cung cấp kém chất lượng

📋 **Kiểm tra chất lượng:**
• Inspect hàng tại kho TQ trước khi gửi
• Chụp ảnh, video chi tiết gửi khách hàng
• Đổi trả nếu không đúng yêu cầu

🚛 **Bảo hiểm vận chuyển:**
• 100% hàng hóa được bảo hiểm
• Bồi thường thiệt hại do vận chuyển
• Theo dõi GPS realtime

💰 **Dịch vụ "Mua hàng an toàn":**
• TBS thanh toán thay khách hàng
• Chỉ nhận tiền khi hàng về VN an toàn
• **Giảm 95% rủi ro lừa đảo**

📞 **Hotline hỗ trợ 24/7:** 0976 005 335`
    },
    {
      patterns: ['bằng tường', 'pingxiang', 'đường bộ', 'truck', 'container', 'đường biển'],
      response: `🚛🚢 **So sánh tuyến vận chuyển TBS GROUP:**

🎯 **Đường bộ - Cửa khẩu Bằng Tường:**
• **Thời gian:** 7-12 ngày
• **Chi phí:** 35-45 yuan/kg
• **Phù hợp:** Hàng gấp, <20 tấn, giá trị cao
• **Ưu điểm:** Nhanh, linh hoạt, ít hư hỏng
• **TBS có kho riêng tại Bằng Tường**

⚓ **Đường biển - Container:**
• **Thời gian:** 15-20 ngày
• **Chi phí:** 8-15 yuan/kg
• **Phù hợp:** Hàng >3m³, không gấp
• **Ưu điểm:** Rẻ nhất, an toàn, khối lượng lớn

📦 **Loại container:**
• **20ft:** ~28m³, tải 18 tấn
• **40ft:** ~58m³, tải 26 tấn  
• **40HQ:** ~68m³, tải 26 tấn

🎯 **Gợi ý lựa chọn:**
• **Hàng <500kg:** Đường bộ
• **Hàng 0.5-3 tấn:** Tùy độ gấp
• **Hàng >3 tấn:** Đường biển
• **Hàng electronics:** Đường bộ (ít rung)

💡 **Tư vấn tuyến đường phù hợp:** 0976 005 335`
    }
  ]

  // Find best matching response
  for (const item of responses) {
    if (item.patterns.some(pattern => lowerMessage.includes(pattern))) {
      return item.response
    }
  }

  // Context-aware responses based on question type
  if (lowerMessage.includes('tôi muốn') || lowerMessage.includes('làm sao') || lowerMessage.includes('how')) {
    return `🤖 **TBS Bot sẵn sàng hỗ trợ bạn!**

🎯 **Tôi có thể giúp bạn:**
• **Tính toán chi phí** nhập khẩu chi tiết
• **Tư vấn quy trình** từng bước cụ thể  
• **Chọn tuyến vận chuyển** phù hợp nhất
• **Tra cứu mã HS** và thuế nhập khẩu
• **Quản lý rủi ro** an toàn tuyệt đối

💭 **Hãy cho tôi biết:**
• Bạn muốn nhập khẩu mặt hàng gì?
• Số lượng/khối lượng ước tính?
• Độ gấp của đơn hàng?

📞 **Hoặc gọi trực tiếp:** 0976 005 335
✉️ **Email chi tiết:** info@xuatnhapkhautbs.vn

Hãy hỏi tôi một câu hỏi cụ thể về nhập khẩu nhé! 😊`
  }

  if (lowerMessage.includes('xin chào') || lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
    return `👋 **Xin chào! Tôi là TBS Bot AI thông minh!**

🏢 **TBS GROUP - Chuyên gia nhập khẩu Trung Quốc:**
• ✅ **8 năm** kinh nghiệm vững vàng
• ✅ **8000+** khách hàng tin tưởng  
• ✅ **200000** đơn hàng chính ngạch thành công
• ✅ **Phí ủy thác 1.5% - 3%** - minh bạch tuyệt đối

🤖 **Tôi có thể hỗ trợ bạn:**
• Tính toán chi phí nhập khẩu chính xác
• Tư vấn quy trình thông quan
• So sánh tuyến vận chuyển
• Tra cứu mã HS và thuế suất
• Quản lý rủi ro an toàn

💬 **Hãy hỏi tôi về:**
"Tôi muốn nhập khẩu [tên hàng], chi phí bao nhiêu?"
"Thời gian vận chuyển từ TQ về VN?"
"Mã HS và thuế của [sản phẩm]?"

📞 **Liên hệ trực tiếp:** 0976 005 335`
  }

  // Default intelligent response
  return `🤖 **TBS Bot AI - Chuyên gia tư vấn nhập khẩu!**

🎯 **Bạn đang quan tâm đến nhập khẩu từ Trung Quốc?**

📚 **Tôi có thể tư vấn chi tiết về:**
• **Chi phí nhập khẩu:** Tính toán chính xác đến từng đồng
• **Thời gian vận chuyển:** Đường bộ vs đường biển
• **Mã HS & Thuế:** 7 ngành hàng ưu tiên
• **Quy trình thông quan:** 7 bước đơn giản
• **Quản lý rủi ro:** Bảo vệ 360 độ

💡 **Ví dụ câu hỏi hay:**
• "Chi phí nhập khẩu 1 tấn đồ gia dụng nhựa?"
• "Thời gian vận chuyển điện tử từ Quảng Châu?"
• "Mã HS của máy móc sản xuất?"

🎁 **Ưu đại đặc biệt:**
• **Phí ủy thác 1.5% - 3%** - cạnh tranh nhất thị trường
• **Tư vấn miễn phí 24/7**
• **Bảo hiểm toàn bộ hàng hóa**

📞 **Hotline:** 0976 005 335
✉️ **Email:** info@xuatnhapkhautbs.vn

Hãy hỏi tôi một câu hỏi cụ thể để được hỗ trợ tốt nhất! 😊`
} 