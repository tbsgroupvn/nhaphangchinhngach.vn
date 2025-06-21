export interface Service {
  id: string
  title: string
  slug: string
  icon: string
  description: string
  shortDescription: string
  benefits: string[]
  process: string[]
  commitment: string[]
  features: string[]
  ctaText: string
  category: 'import' | 'logistics' | 'consulting' | 'support'
}

export const services: Service[] = [
  {
    id: '1',
    title: 'Nhập khẩu chính ngạch',
    slug: 'nhap-khau-chinh-ngach',
    icon: '🚢',
    description: 'Dịch vụ nhập khẩu chính ngạch chuyên nghiệp, đảm bảo 100% tuân thủ pháp luật. TBS GROUP cam kết khai báo đúng, hoàn thuế chính xác, tư vấn miễn phí lần đầu.',
    shortDescription: 'Nhập khẩu hàng hóa an toàn, hợp pháp với cam kết 100% khai báo đúng',
    benefits: [
      '🏛️ Bảo vệ pháp lý toàn diện - Tránh mọi rủi ro vi phạm pháp luật, đảm bảo doanh nghiệp hoạt động an toàn',
      '🧾 Xuất VAT đầy đủ - Được cấp hóa đơn VAT hợp lệ để khấu trừ thuế và báo cáo tài chính',
      '💰 Chi phí ổn định, minh bạch - Không có phát sinh bất ngờ, dễ dàng lập kế hoạch tài chính',
      '🎯 Tư vấn chuyên sâu - Đội ngũ chuyên gia 8+ năm kinh nghiệm hỗ trợ tối ưu hóa chi phí'
    ],
    process: [
      'Tư vấn & phân tích rủi ro: Đánh giá chi tiết hàng hóa, tư vấn mã HS chính xác, dự báo thuế suất và các yêu cầu pháp lý',
      'Chuẩn bị hồ sơ & kiểm tra hàng: Lập đầy đủ chứng từ, kiểm tra chất lượng hàng hóa tại nguồn, đảm bảo tuân thủ tiêu chuẩn',
      'Khai báo hải quan & giám sát: Thực hiện khai báo chính xác, phối hợp kiểm tra hải quan, xử lý các vướng mắc',
      'Thông quan & giao hàng tận nơi: Hoàn thành thủ tục nhanh chóng, vận chuyển an toàn đến địa chỉ khách hàng'
    ],
    commitment: [
      '✅ Cam kết khai báo đúng 100% - Không có sai sót trong thủ tục, tránh mọi rủi ro pháp lý',
      '💸 Hoàn thuế chính xác - Đảm bảo hoàn trả đúng số thuế theo quy định, không thất thoát',
      '🆓 Tư vấn miễn phí lần đầu - Phân tích chi tiết không tính phí để khách hàng đưa ra quyết định',
      '⏱️ Hỗ trợ 24/7 - Đội ngũ chuyên gia sẵn sàng giải đáp mọi thắc mắc bất cứ lúc nào'
    ],
    features: [
      '📊 Dự báo thuế suất chính xác - Công cụ tính toán hiện đại giúp dự báo chi phí nhập khẩu chính xác',
      '🔍 Tư vấn mã HS chuyên sâu - Xác định mã HS đúng để tối ưu thuế suất và thủ tục',
      '🔒 Bảo mật thông tin tuyệt đối - Cam kết không tiết lộ thông tin khách hàng và nhà cung cấp',
      '📋 Báo cáo chi tiết minh bạch - Cung cấp báo cáo đầy đủ về chi phí, thuế, và tiến độ thực hiện'
    ],
    ctaText: 'Tư vấn nhập khẩu miễn phí',
    category: 'import'
  },
  {
    id: '2',
    title: 'Gom hàng lẻ, ghép container',
    slug: 'gom-hang-le-ghep-container',
    icon: '📦',
    description: 'Dịch vụ gom hàng lẻ và ghép container giúp tối ưu chi phí vận chuyển cho khách hàng.',
    shortDescription: 'Tối ưu chi phí vận chuyển bằng cách ghép hàng',
    benefits: [
      'Giảm 30-50% chi phí vận chuyển',
      'Vận chuyển hàng nhỏ lẻ dễ dàng',
      'Đóng gói chuyên nghiệp',
      'Theo dõi hàng hóa realtime'
    ],
    process: [
      'Nhận thông tin hàng hóa',
      'Báo giá và xác nhận',
      'Thu gom hàng tại kho',
      'Đóng gói và vận chuyển'
    ],
    commitment: [
      'Bảo đảm hàng hóa nguyên vẹn',
      'Giao hàng đúng thời gian cam kết',
      'Bồi thường 100% nếu hư hỏng do lỗi đóng gói',
      'Theo dõi 24/7'
    ],
    features: ['Ghép container FCL/LCL', 'Gom hàng từ nhiều nhà cung cấp', 'Kho tập kết tại Trung Quốc', 'Bảo hiểm hàng hóa'],
    ctaText: 'Tính chi phí gom hàng',
    category: 'logistics'
  },
  {
    id: '3',
    title: 'Vận chuyển quốc tế',
    slug: 'van-chuyen-quoc-te',
    icon: '🌍',
    description: 'Dịch vụ vận chuyển quốc tế đa phương thức: đường biển, đường bộ, đường hàng không.',
    shortDescription: 'Vận chuyển hàng hóa toàn cầu đa phương thức',
    benefits: [
      'Mạng lưới vận chuyển toàn cầu',
      'Đa dạng phương thức vận chuyển',
      'Thời gian vận chuyển tối ưu',
      'Chi phí cạnh tranh nhất thị trường'
    ],
    process: [
      'Tư vấn phương thức vận chuyển',
      'Lên kế hoạch logistics',
      'Thực hiện vận chuyển',
      'Giao hàng và thanh lý'
    ],
    commitment: [
      'Giao hàng đúng thời gian cam kết',
      'Bảo đảm an toàn hàng hóa',
      'Hỗ trợ khách hàng 24/7',
      'Bồi thường theo quy định bảo hiểm'
    ],
    features: ['Vận chuyển biển', 'Vận chuyển hàng không', 'Vận chuyển đường bộ', 'Vận chuyển multimodal'],
    ctaText: 'Báo giá vận chuyển',
    category: 'logistics'
  },
  {
    id: '4',
    title: 'Ủy thác xuất nhập khẩu',
    slug: 'uy-thac-xuat-nhap-khau',
    icon: '📄',
    description: 'Dịch vụ ủy thác xuất nhập khẩu cho doanh nghiệp chưa có giấy phép xuất nhập khẩu.',
    shortDescription: 'Hỗ trợ xuất nhập khẩu cho doanh nghiệp chưa có giấy phép',
    benefits: [
      'Không cần giấy phép xuất nhập khẩu',
      'Tiết kiệm thời gian và chi phí',
      'Đảm bảo tuân thủ pháp luật',
      'Hỗ trợ toàn diện từ A-Z'
    ],
    process: [
      'Ký hợp đồng ủy thác',
      'Chuẩn bị hồ sơ xuất nhập khẩu',
      'Thực hiện thủ tục hải quan',
      'Bàn giao hàng hóa'
    ],
    commitment: [
      'Bảo mật thông tin tuyệt đối',
      'Tuân thủ 100% quy định pháp luật',
      'Hỗ trợ khách hàng tận tình',
      'Minh bạch trong thanh toán'
    ],
    features: ['Ủy thác nhập khẩu', 'Ủy thác xuất khẩu', 'Xử lý giấy tờ hải quan', 'Tư vấn pháp lý'],
    ctaText: 'Đăng ký ủy thác',
    category: 'consulting'
  },
  {
    id: '5',
    title: 'Tư vấn pháp lý & thuế XNK',
    slug: 'tu-van-phap-ly-thue-xnk',
    icon: '⚖️',
    description: 'Tư vấn chuyên sâu về pháp lý và thuế xuất nhập khẩu, giúp doanh nghiệp tuân thủ quy định.',
    shortDescription: 'Tư vấn chuyên sâu pháp lý và thuế xuất nhập khẩu',
    benefits: [
      'Tránh được rủi ro pháp lý',
      'Tối ưu thuế xuất nhập khẩu',
      'Cập nhật quy định mới nhất',
      'Đội ngũ luật sư chuyên nghiệp'
    ],
    process: [
      'Phân tích tình huống pháp lý',
      'Đưa ra giải pháp tối ưu',
      'Hỗ trợ thực hiện',
      'Theo dõi và cập nhật'
    ],
    commitment: [
      'Tư vấn chính xác 100%',
      'Cập nhật luật mới liên tục',
      'Bảo mật thông tin khách hàng',
      'Hỗ trợ xử lý sự cố'
    ],
    features: ['Tư vấn mã HS', 'Tư vấn thuế XNK', 'Giải quyết tranh chấp', 'Cập nhật chính sách'],
    ctaText: 'Tư vấn pháp lý',
    category: 'consulting'
  },
  {
    id: '6',
    title: 'Kiểm tra nhà cung cấp',
    slug: 'kiem-tra-nha-cung-cap',
    icon: '🔍',
    description: 'Dịch vụ kiểm tra, thẩm định uy tín và năng lực của nhà cung cấp tại Trung Quốc.',
    shortDescription: 'Thẩm định uy tín nhà cung cấp tại Trung Quốc',
    benefits: [
      'Tránh được nhà cung cấp kém uy tín',
      'Đảm bảo chất lượng hàng hóa',
      'Giảm thiểu rủi ro kinh doanh',
      'Báo cáo chi tiết và chính xác'
    ],
    process: [
      'Nhận yêu cầu kiểm tra',
      'Triển khai khảo sát thực địa',
      'Đánh giá và phân tích',
      'Báo cáo kết quả chi tiết'
    ],
    commitment: [
      'Báo cáo trung thực, khách quan',
      'Thông tin được bảo mật',
      'Thời gian thực hiện nhanh chóng',
      'Hỗ trợ sau kiểm tra'
    ],
    features: ['Kiểm tra nhà xưởng', 'Thẩm định giấy phép', 'Đánh giá năng lực sản xuất', 'Báo cáo chi tiết'],
    ctaText: 'Yêu cầu kiểm tra',
    category: 'support'
  },
  {
    id: '7',
    title: 'Thanh toán hộ Trung Quốc',
    slug: 'thanh-toan-ho-trung-quoc',
    icon: '💰',
    description: 'Dịch vụ thanh toán hộ cho nhà cung cấp Trung Quốc, giải quyết khó khăn về ngoại tệ.',
    shortDescription: 'Giải pháp thanh toán linh hoạt cho nhà cung cấp TQ',
    benefits: [
      'Không cần mở tài khoản ngoại tệ',
      'Tỷ giá cạnh tranh',
      'Thủ tục đơn giản, nhanh chóng',
      'Bảo mật giao dịch cao'
    ],
    process: [
      'Nhận yêu cầu thanh toán',
      'Xác minh thông tin giao dịch',
      'Thực hiện chuyển tiền',
      'Xác nhận hoàn thành'
    ],
    commitment: [
      'Bảo mật thông tin tài chính',
      'Thực hiện đúng thời gian',
      'Tỷ giá minh bạch',
      'Hỗ trợ giải quyết sự cố'
    ],
    features: ['Chuyển tiền nhanh', 'Tỷ giá ưu đãi', 'Bảo mật cao', 'Hỗ trợ 24/7'],
    ctaText: 'Tư vấn thanh toán',
    category: 'support'
  },
  {
    id: '8',
    title: 'Thông quan & chứng từ',
    slug: 'thong-quan-chung-tu',
    icon: '📋',
    description: 'Dịch vụ thông quan hải quan và xử lý chứng từ xuất nhập khẩu chuyên nghiệp.',
    shortDescription: 'Xử lý thủ tục hải quan và chứng từ chuyên nghiệp',
    benefits: [
      'Thông quan nhanh chóng',
      'Tránh được phạt vi phạm hải quan',
      'Đội ngũ chuyên gia giàu kinh nghiệm',
      'Xử lý các trường hợp phức tạp'
    ],
    process: [
      'Kiểm tra hồ sơ chứng từ',
      'Khai báo hải quan',
      'Phối hợp kiểm tra hàng hóa',
      'Hoàn thành thông quan'
    ],
    commitment: [
      'Thông quan thành công 99.9%',
      'Xử lý nhanh nhất thị trường',
      'Hỗ trợ giải quyết vướng mắc',
      'Đảm bảo tuân thủ quy định'
    ],
    features: ['Khai báo hải quan', 'Xử lý C/O', 'Giấy phép nhập khẩu', 'Chứng nhận chất lượng'],
    ctaText: 'Hỗ trợ thông quan',
    category: 'support'
  },
  {
    id: '9',
    title: 'Đóng gói & bảo hiểm hàng',
    slug: 'dong-goi-bao-hiem-hang',
    icon: '📦',
    description: 'Dịch vụ đóng gói chuyên nghiệp và bảo hiểm hàng hóa trong quá trình vận chuyển.',
    shortDescription: 'Bảo vệ hàng hóa bằng đóng gói và bảo hiểm chuyên nghiệp',
    benefits: [
      'Giảm thiểu hư hỏng hàng hóa',
      'Bảo hiểm toàn diện',
      'Đóng gói chuẩn quốc tế',
      'Chi phí hợp lý'
    ],
    process: [
      'Đánh giá tính chất hàng hóa',
      'Thiết kế phương án đóng gói',
      'Thực hiện đóng gói',
      'Mua bảo hiểm và vận chuyển'
    ],
    commitment: [
      'Đóng gói đảm bảo an toàn',
      'Bồi thường nhanh chóng khi có sự cố',
      'Sử dụng vật liệu chất lượng cao',
      'Giá cả minh bạch'
    ],
    features: ['Đóng gói xuất khẩu', 'Bảo hiểm hàng hóa', 'Đóng gói đặc biệt', 'Tư vấn packaging'],
    ctaText: 'Tư vấn đóng gói',
    category: 'logistics'
  },
  {
    id: '10',
    title: 'Kho bãi Trung – Việt',
    slug: 'kho-bai-trung-viet',
    icon: '🏭',
    description: 'Hệ thống kho bãi hiện đại tại Trung Quốc và Việt Nam, hỗ trợ lưu kho và phân phối.',
    shortDescription: 'Hệ thống kho bãi hiện đại hai bên biên giới',
    benefits: [
      'Tiết kiệm chi phí lưu kho',
      'Linh hoạt trong xuất nhập hàng',
      'Hệ thống quản lý hiện đại',
      'Bảo mật và an toàn cao'
    ],
    process: [
      'Tiếp nhận hàng hóa',
      'Quản lý kho bằng WMS',
      'Phân loại và sắp xếp',
      'Xuất kho theo yêu cầu'
    ],
    commitment: [
      'Bảo quản hàng hóa an toàn',
      'Hệ thống theo dõi 24/7',
      'Không thất thoát hàng hóa',
      'Hỗ trợ khách hàng liên tục'
    ],
    features: ['Kho tại Trung Quốc', 'Kho tại Việt Nam', 'Quản lý WMS', 'Dịch vụ fulfillment'],
    ctaText: 'Thuê kho ngay',
    category: 'logistics'
  },
  {
    id: '11',
    title: 'Cảnh báo rủi ro XNK',
    slug: 'canh-bao-rui-ro-xnk',
    icon: '⚠️',
    description: 'Dịch vụ cảnh báo và quản lý rủi ro trong hoạt động xuất nhập khẩu.',
    shortDescription: 'Quản lý và cảnh báo rủi ro trong xuất nhập khẩu',
    benefits: [
      'Phát hiện sớm rủi ro tiềm ẩn',
      'Giảm thiểu tổn thất kinh doanh',
      'Cập nhật thông tin thị trường',
      'Tư vấn giải pháp phòng ngừa'
    ],
    process: [
      'Phân tích thị trường và chính sách',
      'Đánh giá rủi ro của khách hàng',
      'Cảnh báo kịp thời',
      'Đưa ra giải pháp phòng ngừa'
    ],
    commitment: [
      'Thông tin cảnh báo chính xác',
      'Cập nhật liên tục 24/7',
      'Tư vấn miễn phí',
      'Hỗ trợ xử lý khủng hoảng'
    ],
    features: ['Cảnh báo chính sách', 'Phân tích thị trường', 'Đánh giá rủi ro', 'Tư vấn phòng ngừa'],
    ctaText: 'Đăng ký cảnh báo',
    category: 'consulting'
  }
]

export const serviceCategories = {
  import: {
    name: 'Nhập khẩu',
    icon: '🚢',
    color: 'blue'
  },
  logistics: {
    name: 'Logistics',
    icon: '🚛',
    color: 'green'
  },
  consulting: {
    name: 'Tư vấn',
    icon: '💼',
    color: 'purple'
  },
  support: {
    name: 'Hỗ trợ',
    icon: '🤝',
    color: 'orange'
  }
}

export function getServiceBySlug(slug: string): Service | undefined {
  return services.find(service => service.slug === slug)
}

export function getServicesByCategory(category: string): Service[] {
  return services.filter(service => service.category === category)
} 