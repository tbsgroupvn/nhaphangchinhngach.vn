export interface CustomerStory {
  id: string
  slug: string
  title: string
  summary: string
  category: string
  customerName: string
  customerType: string
  industry: string
  location: string
  timeline: string
  orderValue: string
  productTypes: string[]
  challenge: {
    title: string
    description: string
    painPoints: string[]
  }
  solution: {
    title: string
    description: string
    approach: string[]
    keyServices: string[]
  }
  results: {
    title: string
    description: string
    achievements: string[]
    metrics: {
      label: string
      value: string
    }[]
  }
  testimonial: {
    quote: string
    author: string
    position: string
  }
  images: string[]
  tags: string[]
  publishedAt: string
  featured: boolean
}

export const customerStories: CustomerStory[] = [
  {
    id: "1",
    slug: "cua-hang-dien-tu-abc-mo-rong-san-pham",
    title: "Cửa hàng điện tử ABC - Từ 1 cửa hàng nhỏ đến chuỗi 5 chi nhánh",
    summary: "Làm thế nào TBS GROUP giúp cửa hàng điện tử ABC mở rộng từ 1 cửa hàng nhỏ thành chuỗi 5 chi nhánh với việc nhập khẩu phụ kiện điện tử chất lượng cao.",
    category: "Mở rộng kinh doanh",
    customerName: "Cửa hàng điện tử ABC",
    customerType: "Doanh nghiệp nhỏ",
    industry: "Điện tử - Phụ kiện",
    location: "TP.HCM",
    timeline: "18 tháng",
    orderValue: "2.5 tỷ VNĐ",
    productTypes: ["Ốp lưng điện thoại", "Cáp sạc", "Tai nghe", "Pin dự phòng", "Phụ kiện laptop"],
    challenge: {
      title: "Thách thức ban đầu",
      description: "Anh Minh - chủ cửa hàng điện tử ABC gặp khó khăn trong việc tìm nguồn hàng chất lượng với giá cạnh tranh để mở rộng kinh doanh.",
      painPoints: [
        "Nguồn hàng trong nước giá cao, lợi nhuận thấp",
        "Nhập khẩu tự túc rủi ro cao, thiếu kinh nghiệm",
        "Khó kiểm soát chất lượng hàng hóa từ xa",
        "Thủ tục hải quan phức tạp, tốn thời gian",
        "Vốn ít, cần tối ưu hóa đầu tư ban đầu"
      ]
    },
    solution: {
      title: "Giải pháp từ TBS GROUP",
      description: "TBS GROUP đã tư vấn và đồng hành cùng anh Minh xây dựng chiến lược nhập khẩu bền vững, từ việc tìm nguồn hàng đến giao hàng tận tay.",
      approach: [
        "Khảo sát nhu cầu thị trường và xu hướng tiêu dùng",
        "Tìm kiếm và thẩm định nhà cung cấp uy tín tại Trung Quốc",
        "Đàm phán giá cả và điều khoản hợp đồng có lợi",
        "Lên kế hoạch nhập hàng theo từng giai đoạn phù hợp với vốn",
        "Hỗ trợ toàn bộ thủ tục pháp lý và vận chuyển"
      ],
      keyServices: [
        "Tư vấn lựa chọn sản phẩm theo xu hướng",
        "Sourcing & đàm phán với nhà cung cấp",
        "Kiểm tra chất lượng tại nhà máy",
        "Vận chuyển đường biển tiết kiệm chi phí", 
        "Khai báo hải quan chính ngạch 100%",
        "Giao hàng tận kho khách hàng"
      ]
    },
    results: {
      title: "Kết quả đạt được",
      description: "Sau 18 tháng hợp tác, cửa hàng ABC đã tăng trưởng vượt bậc và trở thành một trong những cửa hàng phụ kiện điện tử uy tín tại TP.HCM.",
      achievements: [
        "Mở rộng từ 1 lên 5 cửa hàng tại các quận trung tâm",
        "Doanh thu tăng trưởng 400% so với trước khi hợp tác",
        "Xây dựng được thương hiệu uy tín với khách hàng",
        "Tỷ lệ hàng lỗi giảm xuống dưới 1%",
        "Thời gian nhập hàng ổn định 20-25 ngày",
        "Tiết kiệm được 35% chi phí so với nhập từ các đại lý"
      ],
      metrics: [
        { label: "Tăng trưởng doanh thu", value: "400%" },
        { label: "Số cửa hàng", value: "5 chi nhánh" },
        { label: "Tiết kiệm chi phí", value: "35%" },
        { label: "Tỷ lệ hàng lỗi", value: "<1%" }
      ]
    },
    testimonial: {
      quote: "TBS GROUP không chỉ là đối tác cung cấp hàng hóa mà còn là cố vấn chiến lược giúp tôi phát triển kinh doanh. Họ hiểu rõ thị trường, tư vấn sản phẩm phù hợp và luôn đảm bảo chất lượng. Nhờ có TBS GROUP, tôi đã tự tin mở rộng kinh doanh từ 1 lên 5 cửa hàng.",
      author: "Anh Nguyễn Văn Minh",
      position: "Chủ cửa hàng điện tử ABC"
    },
    images: ["/images/stories/abc-store-1.jpg", "/images/stories/abc-store-2.jpg"],
    tags: ["Điện tử", "Phụ kiện", "Mở rộng", "Doanh nghiệp nhỏ"],
    publishedAt: "2024-05-15",
    featured: true
  },
  {
    id: "2", 
    slug: "nha-may-san-xuat-do-gia-dung-xyz",
    title: "Nhà máy XYZ - Giảm 40% chi phí nguyên liệu sản xuất đồ gia dụng",
    summary: "TBS GROUP hỗ trợ nhà máy XYZ tối ưu hóa chuỗi cung ứng nguyên liệu nhựa từ Trung Quốc, giảm đáng kể chi phí sản xuất và nâng cao năng lực cạnh tranh.",
    category: "Tối ưu chi phí",
    customerName: "Nhà máy đồ gia dụng XYZ",
    customerType: "Doanh nghiệp vừa",
    industry: "Sản xuất - Đồ gia dụng",
    location: "Bình Dương",
    timeline: "12 tháng",
    orderValue: "5.8 tỷ VNĐ",
    productTypes: ["Nhựa PP", "Nhựa PE", "Nhựa ABS", "Phụ gia màu", "Chất phụ gia"],
    challenge: {
      title: "Thách thức về chi phí nguyên liệu",
      description: "Nhà máy XYZ gặp áp lực cạnh tranh gay gắt, cần giảm chi phí nguyên liệu để duy trì lợi nhuận và mở rộng thị phần.",
      painPoints: [
        "Giá nguyên liệu nhựa trong nước cao hơn 30-40% so với Trung Quốc",
        "Khó tìm nhà cung cấp đáng tin cậy với chất lượng ổn định",
        "Quy trình nhập khẩu phức tạp, ảnh hưởng đến kế hoạch sản xuất",
        "Thiếu kinh nghiệm thẩm định chất lượng nguyên liệu",
        "Lo ngại về rủi ro pháp lý khi tự nhập khẩu"
      ]
    },
    solution: {
      title: "Giải pháp chuỗi cung ứng tối ưu",
      description: "TBS GROUP đã thiết kế và triển khai giải pháp chuỗi cung ứng toàn diện, đảm bảo nguyên liệu chất lượng với chi phí tối ưu.",
      approach: [
        "Phân tích chi tiết nhu cầu nguyên liệu và quy trình sản xuất",
        "Khảo sát và lựa chọn nhà cung cấp hàng đầu tại Trung Quốc",
        "Đàm phán hợp đồng dài hạn với điều khoản có lợi",
        "Thiết lập quy trình kiểm tra chất lượng nghiêm ngặt",
        "Tối ưu hóa logistics và kế hoạch nhập hàng"
      ],
      keyServices: [
        "Tư vấn chuyên sâu về nguyên liệu nhựa",
        "Sourcing nhà cung cấp uy tín", 
        "Đàm phán hợp đồng dài hạn",
        "Kiểm tra chất lượng tại nhà máy và cảng",
        "Vận chuyển container FCL định kỳ",
        "Khai báo hải quan và giải phóng hàng nhanh chóng"
      ]
    },
    results: {
      title: "Thành tựu vượt trội",
      description: "Nhà máy XYZ đã đạt được mục tiêu giảm chi phí và nâng cao năng lực cạnh tranh một cách bền vững.",
      achievements: [
        "Giảm 40% chi phí nguyên liệu nhựa so với nguồn trong nước",
        "Nâng cao 25% năng suất sản xuất nhờ nguyên liệu chất lượng",
        "Mở rộng được 3 dòng sản phẩm mới với chi phí cạnh tranh",
        "Thiết lập được chuỗi cung ứng ổn định và đáng tin cậy",
        "Rút ngắn thời gian giao hàng cho khách hàng 30%",
        "Tăng 60% đơn hàng xuất khẩu nhờ giá thành cạnh tranh"
      ],
      metrics: [
        { label: "Giảm chi phí nguyên liệu", value: "40%" },
        { label: "Tăng năng suất", value: "25%" },
        { label: "Tăng đơn hàng xuất khẩu", value: "60%" },
        { label: "Rút ngắn thời gian giao hàng", value: "30%" }
      ]
    },
    testimonial: {
      quote: "Hợp tác với TBS GROUP là quyết định đúng đắn nhất của chúng tôi. Họ không chỉ giúp chúng tôi tiết kiệm chi phí mà còn đảm bảo chất lượng nguyên liệu luôn ổn định. Đặc biệt, đội ngũ TBS luôn sẵn sàng hỗ trợ 24/7 khi chúng tôi cần.",
      author: "Bà Trần Thị Lan",
      position: "Giám đốc Nhà máy XYZ"
    },
    images: ["/images/stories/xyz-factory-1.jpg", "/images/stories/xyz-factory-2.jpg"],
    tags: ["Sản xuất", "Nguyên liệu", "Chi phí", "Nhựa"],
    publishedAt: "2024-04-20",
    featured: true
  },
  {
    id: "3",
    slug: "cong-ty-van-phong-pham-def", 
    title: "Công ty văn phòng phẩm DEF - Vượt qua khủng hoảng Covid-19",
    summary: "Trong giai đoạn Covid-19, TBS GROUP đã giúp công ty văn phòng phẩm DEF chuyển đổi mô hình kinh doanh và duy trì hoạt động ổn định.",
    category: "Vượt qua khủng hoảng",
    customerName: "Công ty văn phóng phẩm DEF",
    customerType: "Doanh nghiệp vừa",
    industry: "Văn phòng phẩm",
    location: "Hà Nội",
    timeline: "8 tháng",
    orderValue: "1.2 tỷ VNĐ",
    productTypes: ["Khẩu trang y tế", "Nước rửa tay", "Bút viết", "Giấy A4", "Đồ dùng học tập"],
    challenge: {
      title: "Khủng hoảng Covid-19",
      description: "Doanh thu sụt giảm 70% do trường học và văn phòng đóng cửa, công ty DEF cần tìm sản phẩm mới để tồn tại.",
      painPoints: [
        "Doanh thu văn phòng phẩm truyền thống giảm mạnh",
        "Hàng tồn kho lớn, khó tiêu thụ",
        "Cần chuyển đổi sang sản phẩm phòng chống dịch",
        "Thiếu kinh nghiệm với sản phẩm y tế",
        "Áp lực về thời gian và chất lượng"
      ]
    },
    solution: {
      title: "Chuyển đổi linh hoạt",
      description: "TBS GROUP đã hỗ trợ DEF chuyển đổi nhanh chóng sang nhập khẩu đồ bảo hộ y tế với chất lượng đạt chuẩn.",
      approach: [
        "Tư vấn chuyển đổi danh mục sản phẩm phù hợp",
        "Tìm kiếm nhà cung cấp đồ bảo hộ có chứng nhận",
        "Hỗ trợ thủ tục nhập khẩu hàng y tế",
        "Đảm bảo chất lượng và nguồn gốc rõ ràng",
        "Giao hàng nhanh chóng trong mùa dịch"
      ],
      keyServices: [
        "Tư vấn chuyển đổi sản phẩm",
        "Sourcing đồ bảo hộ y tế chất lượng",
        "Kiểm tra chứng nhận và chất lượng",
        "Vận chuyển hàng không ưu tiên",
        "Khai báo hải quan đồ y tế",
        "Hỗ trợ phân phối nhanh chóng"
      ]
    },
    results: {
      title: "Vượt qua khủng hoảng",
      description: "Công ty DEF không chỉ vượt qua được khủng hoảng mà còn tăng trưởng mạnh mẽ với danh mục sản phẩm mới.",
      achievements: [
        "Phục hồi 95% doanh thu chỉ sau 3 tháng",
        "Mở rộng sang thị trường đồ bảo hộ y tế",
        "Trở thành nhà phân phối uy tín trong ngành",
        "Duy trì 100% việc làm cho nhân viên",
        "Xây dựng mối quan hệ với bệnh viện, phòng khám",
        "Tạo nền tảng cho tăng trưởng dài hạn"
      ],
      metrics: [
        { label: "Phục hồi doanh thu", value: "95%" },
        { label: "Thời gian chuyển đổi", value: "3 tháng" },
        { label: "Giữ việc làm", value: "100%" },
        { label: "Khách hàng mới", value: "200+" }
      ]
    },
    testimonial: {
      quote: "Khi dịch Covid-19 ập đến, chúng tôi thực sự hoang mang không biết làm gì. TBS GROUP đã như người bạn đồng hành, tư vấn và hỗ trợ chúng tôi chuyển đổi sang sản phẩm y tế một cách nhanh chóng và hiệu quả. Nhờ đó, công ty không chỉ vượt qua khó khăn mà còn phát triển mạnh hơn.",
      author: "Ông Lê Văn Đức",
      position: "Tổng Giám đốc Công ty DEF"
    },
    images: ["/images/stories/def-company-1.jpg", "/images/stories/def-company-2.jpg"],
    tags: ["Văn phòng phẩm", "Covid-19", "Chuyển đổi", "Y tế"],
    publishedAt: "2024-03-10",
    featured: false
  }
]

export function getStoryBySlug(slug: string): CustomerStory | undefined {
  return customerStories.find(story => story.slug === slug)
}

export function getFeaturedStories(): CustomerStory[] {
  return customerStories.filter(story => story.featured)
}

export function getStoriesByCategory(category: string): CustomerStory[] {
  return customerStories.filter(story => story.category === category)
}

export function getAllCategories(): string[] {
  return Array.from(new Set(customerStories.map(story => story.category)))
} 