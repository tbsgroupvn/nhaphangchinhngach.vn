export interface Testimonial {
  content: string
  author: string
  role: string
}

export interface QuickQuoteFormField {
  name: string
  label: string
  type: 'text' | 'tel' | 'email' | 'select'
  required: boolean
  options?: string[]
}

export interface QuickQuoteForm {
  title: string
  fields: QuickQuoteFormField[]
  submitText: string
  note: string
}

export interface Tooltip {
  term: string
  definition: string
}

export interface HelpResource {
  title: string
  url: string
  type: 'guide' | 'video' | 'faq'
}

export interface CustomsProcess {
  step: number
  tbsTask: string
  tbsDetail: string
  customerBenefit: string
  icon: string
}

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
  testimonials?: Testimonial[]
  quickQuoteForm?: QuickQuoteForm
  tooltips?: Tooltip[]
  helpResources?: HelpResource[]
  warehouseLocations?: WarehouseLocation[]
  customsProcess?: CustomsProcess[]
}

export interface WarehouseLocation {
  country: string
  locations: Location[]
}

export interface Location {
  name: string
  address: string
  area: string
  capacity: string
  specialties: string[]
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
    description: 'Giải pháp gom hàng lẻ thông minh cho doanh nghiệp nhỏ. Tiết kiệm 30-50% chi phí vận chuyển so với thuê nguyên container. Không cần tồn kho lớn, giảm rủi ro ứ đọng hàng hóa.',
    shortDescription: 'Giải pháp thông minh cho hàng lẻ - Tiết kiệm 30-50% chi phí vận chuyển',
    benefits: [
      '💰 Tiết kiệm 30-50% chi phí so với thuê nguyên container FCL - Tối ưu cho khách hàng nhỏ, đơn hàng không đủ lớn',
      '🎯 Không bị ép mua dư - Chỉ vận chuyển đúng số lượng cần thiết, linh hoạt theo nhu cầu thực tế',
      '📦 Không cần tồn kho lớn tại VN - Giảm rủi ro hàng ứ đọng, tiết kiệm chi phí thuê kho và bảo quản',
      '🚀 Vận chuyển hàng nhỏ lẻ dễ dàng - Từ 1 thùng đến vài pallet đều được hỗ trợ tận tình'
    ],
    process: [
      'Khách gửi thông tin hàng hóa: TBS kiểm tra & tư vấn lịch chạy gần nhất, thời gian dự kiến về VN',
      'Báo giá trọn gói & xác nhận: Báo giá chi tiết từng khoản phí, xác nhận lịch xuất kho tại Trung Quốc',
      'Thu gom & đóng kiện an toàn: Nhân viên TBS thu gom trực tiếp, đóng kiện chuyên nghiệp, gửi ảnh thực tế',
      'Giao hàng tận nơi & thanh toán linh hoạt: Vận chuyển đến địa chỉ chỉ định, thanh toán COD hoặc chuyển khoản'
    ],
    commitment: [
      '🛡️ Bảo đảm hàng hóa nguyên vẹn 100% - Đền bù toàn bộ nếu hàng hóa mất mát, hư hỏng do vận chuyển',
      '⏰ Giao hàng đúng cam kết - Trễ hẹn hoàn lại 10% phí vận chuyển (cam kết mạnh mẽ)',
      '📸 Kiểm tra video/ảnh thực tế - Khách hàng xem được quá trình đóng kiện trước khi xuất kho',
      '🆓 Tư vấn miễn phí mọi thủ tục - Không dùng dịch vụ cũng không sao, tư vấn tận tình!'
    ],
    features: [
      '📋 Ghép container FCL/LCL linh hoạt - FCL: Full Container Load | LCL: Less than Container Load (gom lẻ nhiều chủ hàng)',
      '🏭 Kho tập kết tại TQ có kiểm đếm thực tế - Video/ảnh minh chứng quá trình đóng kiện, khách yên tâm 100%',
      '🛡️ Bảo hiểm hàng hóa toàn diện - Đền 100% nếu hàng mất, hỏng do vận chuyển, quy trình bồi thường nhanh',
      '📱 Theo dõi real-time qua Zalo/Email - Cập nhật liên tục tiến độ vận chuyển, hình ảnh hàng hóa'
    ],
    ctaText: 'Tính chi phí gom hàng ngay',
    category: 'logistics'
  },
  {
    id: '3',
    title: 'Vận chuyển quốc tế',
    slug: 'van-chuyen-quoc-te',
    icon: '🌍',
    description: 'Dịch vụ vận chuyển quốc tế đa phương thức chuyên nghiệp với mạng lưới đối tác toàn cầu. TBS GROUP hợp tác với các hãng tàu, hãng bay hàng đầu thế giới, cam kết giá ổn định và dịch vụ tận tâm.',
    shortDescription: 'Vận chuyển hàng hóa toàn cầu đa phương thức với đối tác quốc tế uy tín',
    benefits: [
      '💰 Giá tuyến ổn định, không lo sốc giá mùa cao điểm - Hợp đồng dài hạn với các hãng tàu lớn đảm bảo giá cước ổn định',
      '🌐 Đội ngũ tư vấn đa ngôn ngữ, kinh nghiệm quốc tế - Giao tiếp trực tiếp với đối tác nước ngoài, xử lý mọi vấn đề',
      '🏢 Văn phòng đại diện tại Trung Quốc, Việt Nam - Hỗ trợ trực tiếp tại nguồn và đích, theo dõi hàng hóa 24/7',
      '🛡️ Bảo hiểm hàng hóa toàn diện, xử lý sự cố cực nhanh - Đối tác bảo hiểm quốc tế, bồi thường nhanh trong 48h'
    ],
    process: [
      'Tư vấn lựa chọn tuyến & phương thức tối ưu: Phân tích hàng hóa, ngân sách, thời gian để đề xuất phương thức vận chuyển phù hợp (biển, bộ, hàng không)',
      'Báo giá trọn gói – lên kế hoạch logistics chi tiết: Báo giá minh bạch tất cả chi phí, lập timeline vận chuyển, chuẩn bị chứng từ cần thiết',
      'Tiến hành vận chuyển – cập nhật tracking liên tục: Theo dõi hàng hóa real-time, thông báo tiến độ qua Zalo/Email, xử lý sự cố kịp thời',
      'Giao hàng tận nơi, hỗ trợ kiểm tra chất lượng: Vận chuyển đến địa chỉ chỉ định, hỗ trợ kiểm tra hàng hóa, hoàn thiện thủ tục giao nhận'
    ],
    commitment: [
      '⏰ Giao hàng đúng thời gian cam kết - Hoàn tiền 100% nếu không giao hàng đúng hợp đồng',
      '🛡️ Bảo đảm an toàn hàng hóa 100% - Bảo hiểm toàn diện với quy trình bồi thường nhanh chóng',
      '📞 Hỗ trợ khách hàng 24/7 đa ngôn ngữ - Đội ngũ customer care Việt-Anh-Trung sẵn sàng hỗ trợ',
      '📋 Hỗ trợ làm chứng từ quốc tế đầy đủ - Bill of lading, vận đơn, giấy tờ hải quan cho mọi tuyến vận chuyển'
    ],
    features: [
      '🌊 Vận chuyển biển (Sea Freight) - Tối ưu chi phí cho hàng hóa khối lượng lớn, thời gian linh hoạt',
      '✈️ Vận chuyển hàng không (Air Freight) - Nhanh chóng cho hàng urgent, hàng có giá trị cao',
      '🚚 Vận chuyển đường bộ (Road Freight) - Linh hoạt cho các tuyến nội địa và cross-border',
      '🔄 Vận chuyển đa phương thức (Multimodal) - Kết hợp biển-bộ-hàng không để tối ưu thời gian và chi phí'
    ],
    ctaText: 'Nhận báo giá chỉ trong 1 tiếng',
    category: 'logistics'
  },
  {
    id: '4',
    title: 'Ủy thác xuất nhập khẩu',
    slug: 'uy-thac-xuat-nhap-khau',
    icon: '📄',
    description: 'Tối ưu cho doanh nghiệp chưa có giấy phép xuất nhập khẩu, chưa đủ điều kiện pháp lý – TBS GROUP sẽ đứng tên hợp pháp, đảm bảo toàn bộ quy trình chuẩn luật, tiết kiệm tối đa thời gian, chi phí. Chúng tôi tuyệt đối bảo mật thông tin, hồ sơ và tài liệu liên quan.',
    shortDescription: 'Giải pháp ủy thác chuyên nghiệp cho doanh nghiệp chưa có giấy phép XNK',
    benefits: [
      '🚫 Tránh rủi ro bị phạt truy thu, ách tắc hàng do không đủ điều kiện pháp lý - TBS đại diện pháp lý hoàn toàn',
      '🚀 Giúp doanh nghiệp nhỏ vừa thử nghiệm thị trường XNK mà không cần lập công ty/đăng ký mã ngành phức tạp',
      '💰 Tiết kiệm thời gian và chi phí so với việc tự xin giấy phép - Không cần đầu tư ban đầu lớn',
      '📋 Mở rộng thêm dịch vụ hỗ trợ đăng ký mã số thuế XNK, lập hồ sơ pháp lý nếu khách muốn tự chủ lâu dài'
    ],
    process: [
      'Ký hợp đồng ủy thác – nhận thông tin lô hàng: Khách cung cấp thông tin chi tiết về hàng hóa, TBS đánh giá khả thi và ký hợp đồng ủy thác chính thức',
      'Chuẩn bị bộ chứng từ pháp lý – kiểm tra mã HS, chính sách mặt hàng: TBS lập đầy đủ hồ sơ, kiểm tra quy định nhập khẩu, đảm bảo tuân thủ pháp luật',
      'Thực hiện thủ tục hải quan – đại diện khách khai báo, đóng thuế, nhận hàng: TBS chịu trách nhiệm toàn bộ quy trình hải quan, khách chỉ theo dõi tiến độ',
      'Bàn giao hàng hóa cho doanh nghiệp, hoàn thiện thanh toán: Giao hàng tận nơi, thanh lý hồ sơ, hướng dẫn khách sử dụng hàng hóa hợp pháp'
    ],
    commitment: [
      '⚖️ Cam kết chịu trách nhiệm toàn diện trước pháp luật về toàn bộ lô hàng ủy thác, doanh nghiệp hoàn toàn yên tâm',
      '🔒 Bảo mật thông tin, hồ sơ doanh nghiệp tuyệt đối - Ký cam kết bảo mật với từng khách hàng',
      '📞 Tư vấn miễn phí mọi vấn đề pháp lý liên quan đến XNK cho doanh nghiệp mới - Hỗ trợ 24/7',
      '💯 Tuân thủ 100% quy định pháp luật, minh bạch trong mọi giao dịch - Không phát sinh chi phí ẩn'
    ],
    features: [
      '📋 Ủy thác nhập khẩu toàn diện - Đứng tên nhập khẩu hợp pháp cho mọi loại hàng hóa',
      '📤 Ủy thác xuất khẩu chuyên nghiệp - Hỗ trợ doanh nghiệp mở rộng thị trường quốc tế',
      '🏛️ Hỗ trợ lập chứng từ xuất xứ CO, CQ, kiểm dịch, hun trùng nếu cần - Đối tác uy tín các cơ quan',
      '⚖️ Tư vấn xử lý vướng mắc, khiếu nại, giải quyết tranh chấp với cơ quan nhà nước - Đội ngũ luật sư chuyên nghiệp'
    ],
    ctaText: 'Gửi yêu cầu tư vấn miễn phí',
    category: 'consulting'
  },
  {
    id: '5',
    title: 'Tư vấn pháp lý & thuế XNK',
    slug: 'tu-van-phap-ly-thue-xnk',
    icon: '⚖️',
    description: 'Đội ngũ chuyên gia pháp lý XNK giàu kinh nghiệm, đã xử lý hơn 1.000+ ca thực tế về kiểm tra HS code, khiếu nại thuế, cập nhật nghị định mới. Tư vấn trực tiếp với luật sư/nguyên cán bộ XNK, không qua trung gian. Cam kết chỉ nhận tư vấn nếu chắc chắn đúng luật, không dẫn khách vào rủi ro.',
    shortDescription: 'Tư vấn pháp lý XNK chuyên sâu - Đội ngũ chuyên gia 1000+ ca thực tế',
    benefits: [
      '🔍 Phát hiện, cảnh báo rủi ro về thuế/pháp lý trước khi xuất-nhập hàng - Tránh sai lầm tốn kém về sau',
      '🎯 Tư vấn cá thể hóa – xử lý tận gốc từng trường hợp cụ thể, không tư vấn chung chung như các công ty khác',
      '🤝 Đồng hành giải quyết tranh chấp – không bỏ mặc sau khi tư vấn, hỗ trợ đến khi hoàn thành',
      '📚 Cập nhật liện tục chính sách XNK mới nhất - Đội ngũ nghiên cứu chuyên biệt theo dõi 24/7'
    ],
    process: [
      'Tiếp nhận & phân tích tình huống pháp lý/thuế: Chuyên gia XNK tiếp nhận trực tiếp, phân tích chi tiết từng khía cạnh pháp lý, thuế, rủi ro tiềm ẩn',
      'Đề xuất giải pháp riêng cho từng ca: Soạn văn bản, chuẩn bị hồ sơ, dự báo rủi ro cụ thể cho từng tình huống',
      'Hỗ trợ triển khai thực tế: Liên hệ trực tiếp hải quan, giải trình, tư vấn đối đáp với cơ quan chức năng',
      'Theo dõi, cập nhật & hỗ trợ khiếu nại nếu cần: Luôn theo sát từng bước, hỗ trợ đến khi vụ việc/kiểm tra hoàn tất'
    ],
    commitment: [
      '⚖️ Chỉ nhận tư vấn nếu chắc chắn đúng luật, không dẫn khách vào rủi ro - Uy tín đặt lên hàng đầu',
      '🆓 Miễn phí 1 lần kiểm tra hồ sơ pháp lý/thuế cho khách đầu tiên mỗi tháng - Cam kết hỗ trợ cộng đồng',
      '🔒 Cam kết đồng hành đến khi giải quyết xong – không phát sinh phí ẩn, minh bạch 100%',
      '📋 Mọi thông tin tư vấn hoàn toàn bảo mật – cam kết không chia sẻ cho bên thứ ba'
    ],
    features: [
      '🆓 Tư vấn HS code miễn phí cho khách hàng mới & các case khó - Chuyên gia phân tích trực tiếp',
      '👨‍💼 Tư vấn trực tiếp với luật sư/nguyên cán bộ XNK - Không qua trung gian sale, đảm bảo chất lượng',
      '🎓 Hỗ trợ "đào tạo ngắn hạn" cho doanh nghiệp về chính sách mới/thuế/pháp luật XNK',
      '⚡ Xử lý khẩn cấp các tình huống "vướng mắc" hải quan, khiếu nại, tranh chấp 24/7'
    ],
    ctaText: 'Gửi tình huống tư vấn miễn phí',
    category: 'consulting'
  },
  {
    id: '6',
    title: 'Kiểm tra nhà cung cấp',
    slug: 'kiem-tra-nha-cung-cap',
    icon: '🔍',
    description: '90% rủi ro mua hàng Trung Quốc đến từ việc chọn sai nhà cung cấp – mất tiền cọc, nhận hàng kém chất lượng, không thể kiện tụng. Đừng để doanh nghiệp của bạn thành "nạn nhân" tiếp theo. TBS GROUP đã giúp hơn 300 doanh nghiệp tránh được đối tác lừa đảo, tiết kiệm hàng tỷ đồng nhờ kiểm tra trực tiếp trước khi ký hợp đồng.',
    shortDescription: 'Kiểm tra nhà cung cấp TQ chuyên sâu - Tránh 90% rủi ro lừa đảo',
    benefits: [
      '🚨 Phát hiện sớm nhà máy "ma", giấy tờ giả, doanh nghiệp không tồn tại thật - Tránh mất tiền cọc và thời gian',
      '💰 Giúp thương lượng lại hợp đồng, giá cả dựa trên đánh giá thực tế tại xưởng - Tiết kiệm 15-30% chi phí',
      '⚖️ Tăng sức mạnh pháp lý khi xảy ra tranh chấp – có đủ hồ sơ kiểm tra độc lập làm bằng chứng',
      '🎯 Đảm bảo chất lượng hàng hóa đúng cam kết - Tránh nhận hàng không đạt tiêu chuẩn'
    ],
    process: [
      'Tiếp nhận yêu cầu kiểm tra, phân tích mục tiêu của khách: Kiểm tra giấy phép, chất lượng, năng lực sản xuất hay uy tín tài chính',
      'Liên hệ nhà cung cấp, đặt lịch kiểm tra: Trực tiếp/online, chuẩn bị checklist kiểm tra theo yêu cầu riêng của từng khách hàng',
      'Thực hiện kiểm tra tại xưởng: Ảnh/video thực tế, thu thập giấy tờ pháp lý, kiểm tra máy móc, năng lực sản xuất thật',
      'Lập báo cáo chi tiết, tư vấn thương lượng: Gửi hồ sơ xác thực cho khách - Khách được xem toàn bộ ảnh/video, báo cáo độc lập minh bạch 100%'
    ],
    commitment: [
      '🔒 Bảo mật tuyệt đối thông tin doanh nghiệp, không chia sẻ cho bên thứ ba - Ký cam kết bảo mật pháp lý',
      '📋 Chịu trách nhiệm trước pháp luật về tính trung thực của báo cáo kiểm tra - Đảm bảo thông tin 100% chính xác',
      '💸 Hoàn phí kiểm tra nếu phát hiện sai sót/làm việc không minh bạch - Cam kết chất lượng dịch vụ',
      '🤝 Hỗ trợ thương lượng, xử lý khiếu nại với nhà cung cấp nếu có tranh chấp - Đồng hành đến cùng'
    ],
    features: [
      '🏭 Kiểm tra nhà xưởng thực tế - Ảnh/video thực tế tại nhà máy, không chỉ dựa vào catalog',
      '📜 Thẩm định giấy phép đầy đủ - Kiểm tra GPKD, chứng nhận xuất xứ, các giấy kiểm định chuyên ngành',
      '⚙️ Đánh giá năng lực sản xuất - Check dây chuyền, số lượng nhân sự, lịch sử giao dịch, phản hồi đối tác',
      '📊 Báo cáo chi tiết chuyên nghiệp - Mẫu báo cáo có ảnh/video, checklist, nhận xét từ chuyên gia TBS GROUP'
    ],
    ctaText: 'Đăng ký kiểm tra miễn phí đánh giá',
    category: 'support'
  },
  {
    id: '7',
    title: 'Thanh toán hộ Trung Quốc',
    slug: 'thanh-toan-ho-trung-quoc',
    icon: '💰',
    description: 'Chỉ cần một sai sót nhỏ, khách có thể mất trắng tiền thanh toán sang Trung Quốc! Dùng dịch vụ của TBS GROUP – 100% giao dịch minh bạch, an toàn tuyệt đối, bảo vệ doanh nghiệp trước mọi rủi ro lừa đảo. Không cần mở tài khoản ngoại tệ, xác nhận chuyển khoản trong 1-2 tiếng.',
    shortDescription: 'Thanh toán an toàn, minh bạch với bảo vệ 100% trước rủi ro lừa đảo',
    benefits: [
      '🏦 Không cần mở tài khoản ngoại tệ, không phải làm thủ tục ngân hàng phức tạp - Tiết kiệm thời gian và công sức',
      '⚡ Nhận thông báo chuyển khoản & xác nhận từ nhà cung cấp trong 1–2 tiếng - Tốc độ xử lý thực tế nhanh chóng',
      '💎 Giá minh bạch, báo trước tỷ giá từng lần chuyển – không phí ẩn, không ép giá lén lút - 100% trong suốt',
      '🔒 Được bảo mật 2 lớp, lưu lại toàn bộ chứng từ chuyển tiền, đối chiếu minh bạch khi cần - An toàn tuyệt đối'
    ],
    process: [
      'Nhận yêu cầu thanh toán – kiểm tra chứng từ, hợp đồng/đơn hàng, xác minh NCC: Thẩm định kỹ lưỡng mọi thông tin để đảm bảo an toàn',
      'Xác nhận phương án giao dịch (WeChat/Alipay/chuyển khoản ngân hàng), báo tỷ giá trước cho khách: Minh bạch 100% chi phí',
      'Thực hiện chuyển tiền, gửi ảnh/chứng từ xác nhận cho khách: Có bằng chứng cụ thể cho mọi giao dịch',
      'Khách hàng và NCC xác nhận đã nhận tiền – kết thúc giao dịch: Tất cả có lịch sử chuyển khoản để đối chiếu dễ dàng'
    ],
    commitment: [
      '🛡️ TBS GROUP cam kết chịu trách nhiệm 100% nếu giao dịch có lỗi do TBS gây ra - Bảo vệ toàn diện khách hàng',
      '🎯 Tư vấn, xử lý khiếu nại miễn phí, hỗ trợ tranh chấp nếu NCC không xác nhận nhận tiền - Đồng hành cùng khách',
      '💰 Hoàn tiền ngay nếu giao dịch lỗi hoặc phát sinh bất kỳ vấn đề gì từ phía TBS - Cam kết mạnh mẽ nhất',
      '📱 Hỗ trợ 24/7 qua Hotline và Zalo, phản hồi trong vòng 30 phút - Luôn sẵn sàng hỗ trợ khách hàng'
    ],
    features: [
      '💳 Chuyển tiền đa kênh: WeChat Pay, Alipay, Bank transfer - Linh hoạt theo yêu cầu nhà cung cấp',
      '🔐 Bảo mật tối đa: Không lưu thông tin nhạy cảm trên cloud nước ngoài, hệ thống lưu trữ nội bộ an toàn',
      '📈 Tỷ giá ưu đãi theo số lượng – càng chuyển nhiều, càng rẻ - Tiết kiệm tối đa cho khách hàng thân thiết',
      '🕐 Có thể chuyển trong ngày cuối tuần, ngoài giờ hành chính - Linh hoạt theo nhu cầu khẩn cấp'
    ],
    ctaText: 'Tư vấn thanh toán ngay',
    category: 'support',
    testimonials: [
      {
        content: "Đã dùng dịch vụ thanh toán hộ 20 lần, chuyển xong nhận xác nhận trong 15 phút, tỷ giá rõ ràng, không bị ép phí như nhiều nơi khác. TBS thật sự uy tín!",
        author: "Anh Nam - Giám đốc công ty điện tử",
        role: "Khách hàng thân thiết 2 năm"
      },
      {
        content: "Lần đầu dùng lo lắm, nhưng TBS hướng dẫn từng bước, gửi ảnh chứng từ rõ ràng. NCC xác nhận nhận tiền đúng số, đúng thời gian. Sẽ tiếp tục sử dụng!",
        author: "Chị Linh - Chủ shop thời trang",
        role: "Khách hàng mới"
      }
    ],
    quickQuoteForm: {
      title: "Chỉ cần gửi link đơn hàng hoặc tài khoản WeChat/Alipay, chuyên viên sẽ tư vấn tỷ giá & báo phí ngay trong 10 phút.",
      fields: [
        { name: 'orderLink', label: 'Link đơn hàng / Thông tin giao dịch', type: 'text', required: true },
        { name: 'amount', label: 'Số tiền (CNY)', type: 'text', required: true },
        { name: 'recipientAccount', label: 'Tài khoản nhận tiền (WeChat/Alipay/Bank)', type: 'text', required: true },
        { name: 'customerName', label: 'Họ tên', type: 'text', required: true },
        { name: 'phone', label: 'Số điện thoại/Zalo nhận xác nhận', type: 'tel', required: true }
      ],
      submitText: 'Nhận tư vấn tỷ giá & báo phí ngay',
      note: 'Chuyên gia thanh toán sẽ gọi lại trong 10 phút'
    },
    tooltips: [
      {
        term: 'Có lấy hóa đơn dịch vụ được không?',
        definition: 'Có. TBS GROUP xuất hóa đơn VAT đầy đủ cho dịch vụ thanh toán hộ, phục vụ kế toán doanh nghiệp'
      },
      {
        term: 'Tỷ giá tính như thế nào?',
        definition: 'Tỷ giá được báo trước từng lần chuyển, dựa trên tỷ giá ngân hàng + phí dịch vụ cố định'
      },
      {
        term: 'Nếu NCC không nhận được tiền thì sao?',
        definition: 'TBS có trách nhiệm xử lý và hỗ trợ tranh chấp. Nếu lỗi từ TBS sẽ hoàn tiền 100%'
      },
      {
        term: 'Có kiểm tra uy tín NCC trước khi chuyển không?',
        definition: 'Có. TBS sẽ xác minh thông tin cơ bản của NCC và cảnh báo nếu phát hiện dấu hiệu bất thường'
      }
    ],
    helpResources: [
      {
        title: 'Cách phân biệt lừa đảo thanh toán hộ Trung Quốc',
        url: '/tai-lieu/tranh-lua-dao-thanh-toan',
        type: 'guide'
      },
      {
        title: 'Quy trình xử lý khiếu nại thanh toán hộ',
        url: '/tai-lieu/xu-ly-khieu-nai-thanh-toan',
        type: 'guide'
      },
      {
        title: 'Video hướng dẫn sử dụng dịch vụ thanh toán hộ',
        url: '/video/huong-dan-thanh-toan-ho',
        type: 'video'
      }
    ]
  },
  {
    id: '8',
    title: 'Thông quan & chứng từ',
    slug: 'thong-quan-chung-tu',
    icon: '📋',
    description: 'Một sai sót nhỏ trong tờ khai có thể khiến lô hàng chậm 5–10 ngày, chịu lưu bãi, thậm chí bị phạt truy thu. TBS GROUP giúp bạn thông quan êm, đúng chuẩn, 99,9% hồ sơ "đi một lần là đậu". Đội ngũ cựu cán bộ hải quan xử lý case phức tạp, kiểm hóa, trị giá tính thuế chuyên nghiệp.',
    shortDescription: 'Thông quan chuyên nghiệp 99,9% đậu lần đầu - Đội ngũ cựu cán bộ hải quan',
    benefits: [
      '⚡ Thông quan nhanh ≤ 24h với hàng thường, đủ giấy tờ - Không phải chờ đợi, tiết kiệm thời gian quý báu',
      '🎯 Giảm tới 100% nguy cơ phạt nhờ khai chuẩn HS, thuế, CQ/CO - Đội ngũ chuyên gia giàu kinh nghiệm',
      '💰 Tư vấn khung thuế & phí trước khi mở tờ khai - Không bị "sốc" chi phí, dễ dàng lập kế hoạch tài chính',
      '👨‍💼 Đội ngũ cựu cán bộ hải quan xử lý case phức tạp, kiểm hóa, trị giá tính thuế - Kinh nghiệm thực chiến 15+ năm'
    ],
    process: [
      'Thu thập & kiểm tra chứng từ: Soát lỗi HS code, CO, bill, invoice - Phát hiện sai sót trước khi mở tờ khai, tránh trễ hạn',
      'Khai báo hải quan điện tử: Khai VNACCS, nộp thuế điện tử 24/7 - Khách không cần tài khoản ECUS phức tạp',
      'Phối hợp kiểm hóa: Cử cán bộ trực cổng/kho - Giảm rủi ro nứt/vỡ, đứt niêm',
      'Hoàn tất & bàn giao: Xuất kho, giao chứng từ đầy đủ - Hồ sơ lưu trữ sẵn, dễ quyết toán',
    ],
    commitment: [
      '📊 Tỷ lệ đậu tờ khai ngay lần đầu ≥ 99% - Cam kết chất lượng dựa trên kinh nghiệm thực tế',
      '💸 Chịu mọi phí lưu kho nếu trễ do lỗi của TBS - Đặt uy tín và trách nhiệm lên hàng đầu',
      '🤝 Hỗ trợ khiếu nại/phúc tra miễn phí đến khi xong việc - Đồng hành cùng khách hàng đến cùng',
      '🔒 Bảo mật tuyệt đối dữ liệu HS code & giá nhập của khách - Cam kết không chia sẻ thông tin cho bên thứ ba'
    ],
    features: [
      '🕐 Khai báo điện tử 24/7 - Lô hàng tới cổng bất kỳ giờ nào cũng mở tờ khai ngay, không chờ đợi',
      '📋 Xử lý CO, CQ, kiểm dịch, kiểm tra chuyên ngành trọn gói - Một điểm tiếp xúc cho mọi thủ tục',
      '⚖️ Giải quyết vướng mắc trị giá tính thuế & tự vệ thương mại - Chuyên gia pháp lý hỗ trợ',
      '🔴 Tư vấn "lối thoát" cho lô hàng màu đỏ - Kinh nghiệm thực chiến xử lý các case khó'
    ],
    ctaText: 'Nhận báo giá & khung thuế ngay',
    category: 'support',
    testimonials: [
      {
        content: "Nhờ TBS, lô linh kiện điện tử 2 tỷ VNĐ của chúng tôi chuyển chế độ kiểm hóa đỏ sang vàng trong 4 giờ, tiết kiệm hơn 60 triệu phí lưu bãi.",
        author: "Anh Minh - Giám đốc Công nghệ",
        role: "CEO Công ty TNHH Điện tử ABC"
      },
      {
        content: "Lần đầu nhập khẩu, không hiểu gì về thủ tục. TBS hướng dẫn từ A-Z, tờ khai đậu ngay lần đầu, không phát sinh chi phí. Rất hài lòng!",
        author: "Chị Lan - Chủ shop thời trang",
        role: "Doanh nghiệp nhỏ"
      }
    ],
    quickQuoteForm: {
      title: "Miễn phí rà soát HS code cho lô hàng đầu tiên. Nhận báo giá & khung thuế trong 15 phút.",
      fields: [
        { name: 'goodsType', label: 'Loại hàng hóa', type: 'text', required: true },
        { name: 'port', label: 'Cảng nhập', type: 'select', options: ['Cảng Hải Phòng', 'Cảng TP.HCM', 'Cảng Đà Nẵng', 'Cảng Quy Nhon', 'Khác'], required: true },
        { name: 'estimatedValue', label: 'Trị giá ước tính (USD)', type: 'text', required: true },
        { name: 'customerName', label: 'Họ tên', type: 'text', required: true },
        { name: 'phone', label: 'Số điện thoại', type: 'tel', required: true }
      ],
      submitText: 'Nhận báo giá & khung thuế trong 15 phút',
      note: 'Chuyên gia hải quan sẽ gọi lại ngay'
    },
    tooltips: [
      {
        term: 'HS code',
        definition: 'Mã số hàng hóa theo hệ thống phân loại quốc tế - Quyết định thuế suất nhập khẩu'
      },
      {
        term: 'Hàng luồng đỏ',
        definition: 'Hàng hóa bị kiểm tra kỹ bởi hải quan - Cần chuẩn bị hồ sơ đầy đủ'
      },
      {
        term: 'CO/CQ',
        definition: 'Certificate of Origin - Giấy chứng nhận xuất xứ hàng hóa'
      },
      {
        term: 'VNACCS',
        definition: 'Hệ thống khai báo hải quan điện tử của Việt Nam'
      }
    ],
    helpResources: [
      {
        title: 'Bảng tra HS code nhanh theo nhóm hàng',
        url: '/tai-lieu/bang-tra-hs-code',
        type: 'guide'
      },
      {
        title: 'Hàng luồng đỏ cần chuẩn bị gì?',
        url: '/blog/hang-luong-do-chuan-bi-gi',
        type: 'guide'
      },
      {
        title: 'Video hướng dẫn đọc tờ khai hải quan',
        url: '/video/doc-to-khai-hai-quan',
        type: 'video'
      }
    ],
    customsProcess: [
      {
        step: 1,
        tbsTask: 'Thu thập & kiểm tra chứng từ',
        tbsDetail: 'Soát lỗi HS code, CO, bill, invoice',
        customerBenefit: 'Phát hiện sai sót trước khi mở tờ khai',
        icon: '📋'
      },
      {
        step: 2,
        tbsTask: 'Khai báo hải quan',
        tbsDetail: 'Khai VNACCS, nộp thuế điện tử',
        customerBenefit: 'Khách không cần tài khoản ECUS',
        icon: '💻'
      },
      {
        step: 3,
        tbsTask: 'Phối hợp kiểm hóa',
        tbsDetail: 'Cử cán bộ trực cổng/kho',
        customerBenefit: 'Giảm rủi ro nứt/vỡ, đứt niêm',
        icon: '🔍'
      },
      {
        step: 4,
        tbsTask: 'Hoàn tất & bàn giao',
        tbsDetail: 'Xuất kho, giao chứng từ đầy đủ',
        customerBenefit: 'Hồ sơ lưu trữ sẵn, dễ quyết toán',
        icon: '✅'
      }
    ]
  },
  {
    id: '9',
    title: 'Đóng gói & bảo hiểm hàng',
    slug: 'dong-goi-bao-hiem-hang',
    icon: '📦',
    description: '80% thiệt hại hàng nhập khẩu đến từ khâu đóng gói kém hoặc không mua bảo hiểm. Đừng để một lỗi nhỏ khiến đơn hàng lớn của bạn thất thoát không thể đòi bồi thường. TBS GROUP chuyên gia đóng gói và bảo hiểm, giảm 95% rủi ro vỡ, méo, ẩm mốc cho mọi loại hàng hóa.',
    shortDescription: 'Chuyên gia đóng gói & bảo hiểm - Giảm 95% rủi ro thiệt hại',
    benefits: [
      '📉 Giảm thiểu tới 95% rủi ro vỡ, méo, ẩm mốc, thất lạc hàng hóa - Quy trình đóng gói chuẩn quốc tế',
      '💰 Dễ dàng khiếu nại & nhận bồi thường khi có sự cố - Thủ tục đơn giản, chi trả nhanh trong 48h',
      '🎯 Được tư vấn đóng gói chuẩn loại hàng đặc thù: máy móc, đồ dễ vỡ, thực phẩm, hóa chất - Kinh nghiệm 8+ năm',
      '📸 Video/ảnh xác minh thực tế trước khi xuất kho - Khách hàng kiểm tra từng bước đóng gói'
    ],
    process: [
      'Đánh giá chi tiết loại hàng, lộ trình vận chuyển, điều kiện đặc thù: Phân tích tính chất vật lý, yêu cầu bảo quản, rủi ro tiềm ẩn của từng mặt hàng',
      'Thiết kế phương án đóng gói tối ưu cho từng mặt hàng: Lựa chọn vật liệu, kỹ thuật đóng gói phù hợp, tính toán kích thước container',
      'Đóng gói tại xưởng/kho tập kết có thể kiểm tra ảnh/video thực tế: Thực hiện đóng gói chuyên nghiệp, gửi ảnh/video từng khâu cho khách',
      'Mua bảo hiểm và vận chuyển, gửi đầy đủ giấy chứng nhận cho khách: Hoàn thiện hồ sơ bảo hiểm, theo dõi vận chuyển và hỗ trợ khiếu nại nếu cần'
    ],
    commitment: [
      '🚛 Đền bù nhanh, minh bạch khi xảy ra sự cố - Hỗ trợ làm việc với hãng vận chuyển và công ty bảo hiểm cho khách',
      '💎 Chỉ tính phí bảo hiểm, đóng gói trên giá trị thực tế - Không phụ thu ẩn, không phát sinh bất ngờ, minh bạch 100%',
      '🔍 Hỗ trợ khách kiểm tra từng kiện hàng trước khi xuất kho - Được xem video/ảnh thực tế quy trình đóng gói',
      '⏰ Trễ giao hàng hoàn lại 10% phí vận chuyển - Cam kết mạnh mẽ về thời gian, đặt uy tín lên hàng đầu'
    ],
    features: [
      '📋 Đóng gói xuất khẩu theo chuẩn quốc tế - Đáp ứng yêu cầu từng thị trường, tối ưu không gian container',
      '🛡️ Đóng gói đặc biệt: hút chân không, đóng thùng gỗ, chống ẩm, chống sốc - Phù hợp từng loại hàng đặc thù',
      '💼 Tư vấn packaging chuyên sâu với mẫu minh họa - Hướng dẫn lựa chọn phương án tối ưu nhất',
      '🏥 Bảo hiểm hàng hóa toàn diện 100% - Hỗ trợ lựa chọn mức bảo hiểm, thủ tục đơn giản, chi phí tối ưu theo giá trị lô hàng'
    ],
    ctaText: 'Gửi yêu cầu tư vấn đóng gói & bảo hiểm',
    category: 'logistics',
    testimonials: [
      {
        content: "Lô hàng 2 tấn máy móc bị nước vào, TBS GROUP đã hướng dẫn đầy đủ thủ tục bồi thường – nhận lại tiền bảo hiểm chỉ sau 10 ngày.",
        author: "Anh Minh - Công ty TNHH Thiết bị Công nghiệp",
        role: "Giám đốc"
      },
      {
        content: "Đóng gói chuyên nghiệp, có ảnh video từng bước. Lần đầu mua hàng Trung Quốc nhưng rất yên tâm với dịch vụ của TBS.",
        author: "Chị Lan - Cửa hàng nội thất",
        role: "Chủ cửa hàng"
      }
    ],
    quickQuoteForm: {
      title: "Chỉ cần để lại loại hàng, số kiện – chuyên gia đóng gói sẽ gọi lại trong 15 phút, tư vấn phương án an toàn & báo giá minh bạch.",
      fields: [
        { name: 'goodsType', label: 'Loại hàng hóa', type: 'text', required: true },
        { name: 'quantity', label: 'Số kiện/trọng lượng', type: 'text', required: true },
        { name: 'shippingMethod', label: 'Hình thức vận chuyển', type: 'select', options: ['Đường biển', 'Đường bộ', 'Đường sắt', 'Hàng không'], required: true },
        { name: 'customerName', label: 'Họ tên', type: 'text', required: true },
        { name: 'phone', label: 'Số điện thoại', type: 'tel', required: true }
      ],
      submitText: 'Gửi yêu cầu báo giá (Miễn phí)',
      note: 'Chuyên gia sẽ gọi lại trong 15 phút'
    },
    tooltips: [
      {
        term: 'FCL',
        definition: 'Full Container Load - Thuê nguyên container'
      },
      {
        term: 'LCL', 
        definition: 'Less than Container Load - Gom hàng lẻ'
      },
      {
        term: 'Bảo hiểm toàn diện',
        definition: '100% bảo vệ - Đền bù thiệt hại do vận chuyển, thiên tai, va đập'
      },
      {
        term: 'Đóng gói xuất khẩu',
        definition: 'Đạt chuẩn quốc tế - Chống ẩm, chống va đập, tối ưu kích thước'
      }
    ],
    helpResources: [
      {
        title: 'Quy trình xử lý bồi thường bảo hiểm xuất nhập khẩu',
        url: '/tai-lieu/quy-trinh-boi-thuong-bao-hiem',
        type: 'guide'
      },
      {
        title: 'Video hướng dẫn kiểm tra hàng hóa trước khi đóng gói',
        url: '/video/kiem-tra-hang-hoa',
        type: 'video'
      },
      {
        title: 'Các trường hợp KHÔNG được bảo hiểm?',
        url: '/faq/bao-hiem-han-che',
        type: 'faq'
      }
    ]
  },
  {
    id: '10',
    title: 'Kho bãi Trung – Việt',
    slug: 'kho-bai-trung-viet',
    icon: '🏭',
    description: 'Kho không chỉ là chỗ gửi hàng, mà là mắt xích quyết định tốc độ, an toàn và tối ưu chi phí. Hệ thống kho bãi hiện đại song song hai đầu Trung Quốc – Việt Nam, chủ động lưu trữ, kiểm soát, phân phối, giảm thiểu thất thoát, tối ưu dòng tiền & giải phóng hàng nhanh chóng.',
    shortDescription: 'Hệ thống kho bãi hiện đại hai bên biên giới với công nghệ WMS',
    benefits: [
      '💰 Tiết kiệm 30-50% chi phí kho so với thuê kho riêng từng nơi - Tối ưu hóa chi phí vận hành tổng thể',
      '🎯 Linh hoạt gom hàng từ nhiều NCC, quản lý theo từng kiện/lô, không lo lẫn hàng - Hệ thống mã vạch hiện đại',
      '📊 Chủ động kiểm soát số lượng, tình trạng hàng hóa - Cập nhật tồn kho realtime qua WMS',
      '📱 Khách hàng được cấp tài khoản truy cập hệ thống quản lý kho, tra cứu realtime, nhận báo cáo tự động'
    ],
    process: [
      'Nhận thông tin hàng, phân loại lô/kiện từ NCC: Ghi rõ nguồn gốc từ Trung Quốc hay Việt Nam, phân loại theo đặc tính hàng hóa',
      'Quản lý bằng hệ thống WMS – tạo mã vạch, dán tem, quản lý online: Khách hàng có thể tra cứu tồn kho trên app/web',
      'Phân loại & sắp xếp tối ưu theo đơn, tuyến, ngày xuất: Tối ưu hóa không gian kho và quy trình xuất hàng',
      'Xuất kho, đối chiếu tồn, giao nhận có thể chụp ảnh gửi khách: Minh bạch 100% quy trình xuất nhập'
    ],
    commitment: [
      '🛡️ Bảo quản hàng hóa an toàn, đền bù 100% nếu mất mát/thất thoát do lỗi kho - Bảo hiểm toàn diện',
      '💎 Không phát sinh phí ẩn, rõ ràng từng khoản chi - Minh bạch 100% cấu trúc chi phí',
      '⏰ Hỗ trợ xử lý đơn gấp, xuất hàng ngoài giờ nếu cần - Linh hoạt theo nhu cầu khách hàng',
      '📸 Cập nhật hình ảnh thực tế, tracking online 24/7 - Theo dõi hàng hóa mọi lúc mọi nơi'
    ],
    features: [
      '🏭 Kho tại Trung Quốc: Địa chỉ Quảng Châu & Nghĩa Ô, diện tích 2000m², khả năng gom hàng từ toàn quốc TQ',
      '🏢 Kho tại Việt Nam: Vị trí chiến lược gần cảng Cát Lái & Hải Phòng, giao nội địa toàn quốc nhanh chóng',
      '💻 Quản lý WMS hiện đại: Cho phép khách xem tồn kho, nhập/xuất, lịch sử dịch chuyển, tracking từ xa',
      '📦 Dịch vụ fulfillment chuyên nghiệp: Đóng gói, dán tem, chia lô, phối hàng xuất cho từng đơn nhỏ'
    ],
    ctaText: 'Nhận tư vấn & báo giá ngay',
    category: 'logistics',
    testimonials: [
      {
        content: "Nhờ kho bãi của TBS GROUP, tôi gom hàng từ 8 NCC, kiểm đếm từng kiện không thất lạc, xuất nhanh đúng hạn mùa sale. Hệ thống WMS rất tiện lợi!",
        author: "Anh Đức - Chủ shop thời trang online",
        role: "Giám đốc kinh doanh"
      },
      {
        content: "Kho TBS ở Quảng Châu giúp tôi tập trung hàng từ nhiều nhà máy, tiết kiệm 40% chi phí so với thuê kho riêng. Dashboard theo dõi tồn kho rất trực quan.",
        author: "Chị Mai - Công ty xuất nhập khẩu",
        role: "Trưởng phòng logistics"
      }
    ],
    quickQuoteForm: {
      title: "Gửi yêu cầu thuê kho, chuyên gia sẽ tư vấn phương án lưu trữ và báo giá phù hợp trong 15 phút.",
      fields: [
        { name: 'goodsType', label: 'Loại hàng hóa', type: 'text', required: true },
        { name: 'quantity', label: 'Số lượng kiện/lô', type: 'text', required: true },
        { name: 'storageTime', label: 'Dự kiến thời gian lưu kho', type: 'select', options: ['Dưới 1 tháng', '1-3 tháng', '3-6 tháng', 'Trên 6 tháng'], required: true },
        { name: 'customerName', label: 'Họ tên', type: 'text', required: true },
        { name: 'phone', label: 'Số điện thoại', type: 'tel', required: true }
      ],
      submitText: 'Nhận tư vấn & báo giá ngay',
      note: 'Chuyên gia kho bãi sẽ liên hệ trong 15 phút'
    },
    tooltips: [
      {
        term: 'WMS là gì?',
        definition: 'Warehouse Management System - Hệ thống quản lý kho hiện đại, theo dõi nhập/xuất/tồn realtime'
      },
      {
        term: 'Lưu kho bao lâu thì tính phí?',
        definition: 'Miễn phí 7 ngày đầu, sau đó tính theo ngày thực tế. Có ưu đãi cho hàng lưu dài hạn'
      },
      {
        term: 'Chia nhỏ lô xuất nhiều lần?',
        definition: 'Hoàn toàn có thể. Hệ thống WMS hỗ trợ xuất từng phần theo yêu cầu'
      },
      {
        term: 'Fulfillment',
        definition: 'Dịch vụ hoàn thiện đơn hàng: từ nhận đơn → đóng gói → giao hàng cho khách cuối'
      }
    ],
    helpResources: [
      {
        title: 'Tải mẫu hợp đồng thuê kho bãi',
        url: '/tai-lieu/hop-dong-thue-kho',
        type: 'guide'
      },
      {
        title: 'Hướng dẫn sử dụng phần mềm quản lý kho WMS',
        url: '/video/huong-dan-wms',
        type: 'video'
      },
      {
        title: 'Bảng giá chi tiết dịch vụ kho bãi và fulfillment',
        url: '/bang-gia/kho-bai-fulfillment',
        type: 'guide'
      }
    ],
    warehouseLocations: [
      {
        country: 'Trung Quốc',
        locations: [
          {
            name: 'Kho Quảng Châu',
            address: 'Khu công nghiệp Huangpu, Quảng Châu',
            area: '1,200m²',
            capacity: '5,000 kiện',
            specialties: ['Thời trang', 'Điện tử', 'Gia dụng']
          },
          {
            name: 'Kho Nghĩa Ô',
            address: 'Thị trường Quốc tế Nghĩa Ô, Chiết Giang',
            area: '800m²',
            capacity: '3,000 kiện',
            specialties: ['Phụ kiện', 'Đồ chơi', 'Văn phòng phẩm']
          }
        ]
      },
      {
        country: 'Việt Nam',
        locations: [
          {
            name: 'Kho TP.HCM',
            address: 'Gần cảng Cát Lái, Quận 2, TP.HCM',
            area: '1,500m²',
            capacity: '8,000 kiện',
            specialties: ['Kho lạnh', 'Hàng khô', 'Fulfillment']
          },
          {
            name: 'Kho Hải Phòng',
            address: 'Gần cảng Hải Phòng, Lê Chân, Hải Phòng',
            area: '1,000m²',
            capacity: '5,000 kiện',
            specialties: ['Hàng nặng', 'Máy móc', 'Nguyên liệu']
          }
        ]
      }
    ]
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