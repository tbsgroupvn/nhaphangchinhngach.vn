import type {
  Industry,
  IndustryCategory,
  IndustryReview,
} from '../lib/studio/content-model'
import type { IndustryTrait } from '../lib/studio/industry-taxonomy-model'

const legacyReview: IndustryReview = {
  status: 'legacy',
  reviewer: '',
  reviewedAt: '',
  nextReviewAt: '',
}

export const industryTraits: IndustryTrait[] = [
  {
    id: '10000000-0000-4000-8000-000000000001',
    slug: 'can-kiem-dem',
    label: 'Cần kiểm đếm',
    group: 'handling',
    description: 'Có nhiều đơn vị hoặc mã hàng cần thống nhất phạm vi kiểm đếm.',
    order: 10,
    active: true,
  },
  {
    id: '10000000-0000-4000-8000-000000000002',
    slug: 'nhieu-ma-hang',
    label: 'Nhiều mã hàng',
    group: 'supplier',
    description: 'Lô hàng có nhiều mã, màu hoặc bộ phụ kiện cần đối chiếu.',
    order: 20,
    active: true,
  },
  {
    id: '10000000-0000-4000-8000-000000000003',
    slug: 'cong-kenh',
    label: 'Cồng kềnh',
    group: 'transport',
    description: 'Kích thước đóng kiện và điều kiện tiếp cận ảnh hưởng phương án vận chuyển.',
    order: 30,
    active: true,
  },
  {
    id: '10000000-0000-4000-8000-000000000004',
    slug: 'can-nang-ha',
    label: 'Cần nâng hạ',
    group: 'handling',
    description: 'Cần xác nhận trọng lượng, trọng tâm, điểm nâng và thiết bị tại điểm giao nhận.',
    order: 40,
    active: true,
  },
  {
    id: '10000000-0000-4000-8000-000000000005',
    slug: 'can-catalogue',
    label: 'Cần catalogue',
    group: 'compliance',
    description: 'Cần catalogue hoặc dữ liệu kỹ thuật đúng model để chuyên môn rà soát.',
    order: 50,
    active: true,
  },
  {
    id: '10000000-0000-4000-8000-000000000006',
    slug: 'de-vo',
    label: 'Dễ vỡ',
    group: 'packing',
    description: 'Bao bì, lớp đệm và dấu hiệu nhận biết cần được thống nhất trước khi giao.',
    order: 60,
    active: true,
  },
]

export const industryCategories: IndustryCategory[] = [
  {
    slug: 'gia-dung-noi-that',
    title: 'Gia dụng và nội thất',
    summary:
      'Nhóm sản phẩm cần làm rõ vật liệu, công dụng, cấu tạo, quy cách đóng kiện và phạm vi kiểm đếm trước khi đặt hàng.',
    image: '/images/marketing/containers.webp',
    imageAlts: {
      '/images/marketing/containers.webp':
        'Hàng hóa được tổ chức theo kiện trong hoạt động logistics của TBS',
    },
    order: 10,
    featuredIndustryIds: ['gia-dung-khong-dien', 'noi-that-phu-kien'],
    review: legacyReview,
  },
  {
    slug: 'may-moc-day-chuyen',
    title: 'Máy móc và dây chuyền',
    summary:
      'Nhóm thiết bị cần catalogue, model, thông số, danh sách bộ phận đi kèm và dữ liệu nâng hạ để xây phương án phù hợp.',
    image: '/images/marketing/transport.webp',
    imageAlts: {
      '/images/marketing/transport.webp':
        'Phương tiện vận chuyển hàng hóa trong chuỗi logistics TBS',
    },
    order: 20,
    featuredIndustryIds: ['may-moc-moi'],
    review: legacyReview,
  },
]

export const industries: Industry[] = [
  {
    slug: 'gia-dung-khong-dien',
    categorySlug: 'gia-dung-noi-that',
    title: 'Gia dụng không điện',
    shortTitle: 'Gia dụng không điện',
    summary:
      'Bắt đầu từ vật liệu và mục đích sử dụng để trao đổi hồ sơ, kiểm đếm và phương án bảo vệ sản phẩm.',
    image: '/images/marketing/containers.webp',
    aliases: ['đồ gia dụng không điện'],
    searchTerms: ['đồ dùng gia đình', 'hàng gia dụng'],
    models: [],
    uses: ['Sử dụng trong gia đình hoặc hoạt động phục vụ đời sống.'],
    materials: ['kim loại', 'nhựa', 'gốm', 'vật liệu kết hợp'],
    traits: ['nhieu-ma-hang', 'can-kiem-dem'],
    details: [
      'Cùng là đồ gia dụng nhưng sản phẩm bằng kim loại, nhựa, gốm hoặc vật liệu kết hợp cần thông tin nhận diện khác nhau. Ghi rõ công dụng, cấu tạo và nhóm người sử dụng dự kiến.',
      'Nếu sản phẩm tiếp xúc thực phẩm hoặc có công dụng đặc thù, cần nêu rõ từ đầu để bộ phận chuyên môn kiểm tra yêu cầu liên quan theo từng sản phẩm.',
      'Đối chiếu số sản phẩm mỗi kiện, mã hàng, màu và bộ phụ kiện. Với hàng dễ vỡ, trao đổi lớp đệm, khoảng trống và cách đánh dấu kiện trước khi giao.',
      'Phạm vi kiểm đếm cần ghi rõ kiểm theo kiện hay từng sản phẩm. Kiểm số lượng và quan sát bao bì không thay thế thử nghiệm vật liệu hoặc chất lượng.',
    ],
    inputs: [
      'Ảnh, đường dẫn và thông số từng mã sản phẩm.',
      'Vật liệu, công dụng và thông tin tiếp xúc thực phẩm nếu có.',
      'Số lượng, số sản phẩm mỗi kiện, kích thước và trọng lượng.',
      'Yêu cầu nhãn, đóng gói, kiểm đếm và hồ sơ cần đối chiếu.',
    ],
    preparationItems: [
      'Xác nhận vật liệu, công dụng và nhóm người sử dụng dự kiến.',
      'Đề nghị nhà cung cấp thống nhất mã hàng, màu và số sản phẩm mỗi kiện.',
    ],
    technicalInputs: [
      'Ảnh, đường dẫn và thông số từng mã sản phẩm.',
      'Vật liệu, công dụng, kích thước, trọng lượng và số lượng.',
    ],
    packingNotes: [
      'Hàng dễ vỡ cần thống nhất lớp đệm, khoảng trống và cách đánh dấu kiện.',
    ],
    verificationPoints: [
      'Sản phẩm tiếp xúc thực phẩm hoặc có công dụng đặc thù cần chuyên môn xác minh theo mặt hàng cụ thể.',
    ],
    proofItems: [],
    serviceSlugs: ['gom-hang-kiem-dem', 'nhap-khau-chinh-ngach'],
    articleSlugs: [],
    faqs: [],
    saleBriefItems: [
      'Ảnh/link sản phẩm và vật liệu chính',
      'Công dụng, số lượng và quy cách đóng gói',
      'Điểm nhận, điểm giao và thời điểm dự kiến',
    ],
    review: legacyReview,
  },
  {
    slug: 'noi-that-phu-kien',
    categorySlug: 'gia-dung-noi-that',
    title: 'Nội thất và phụ kiện',
    shortTitle: 'Nội thất và phụ kiện',
    summary:
      'Làm rõ vật liệu, kích thước, cách lắp ráp và bộ phụ kiện để chuẩn bị giao nhận và đối chiếu hàng.',
    image: '/images/marketing/containers.webp',
    aliases: ['đồ nội thất', 'phụ kiện nội thất'],
    searchTerms: ['bàn ghế', 'tủ kệ', 'đồ rời lắp ráp'],
    models: [],
    uses: ['Trang bị không gian ở, làm việc hoặc kinh doanh.'],
    materials: ['gỗ', 'kim loại', 'kính', 'vật liệu kết hợp'],
    traits: ['cong-kenh', 'can-nang-ha', 'can-kiem-dem'],
    details: [
      'Phân biệt hàng hoàn thiện với hàng tháo rời; cung cấp vật liệu chính, lớp bề mặt và công dụng. Bộ sản phẩm nên có danh sách chi tiết để đối chiếu.',
      'Kích thước đóng kiện khác kích thước sử dụng. Cần đo cả bao bì, chân đế hoặc khung bảo vệ để trao đổi thể tích và điều kiện xếp dỡ.',
      'Góc cạnh, mặt kính, bề mặt sơn và chi tiết dễ trầy cần phương án bảo vệ phù hợp. Ghi nhận ảnh trước đóng kiện giúp đối chiếu hiện trạng khi bàn giao.',
      'Phụ kiện lắp ráp nên được đánh mã theo bộ và gắn với kiện chính. Điểm giao cần nêu khả năng xe tiếp cận, yêu cầu nâng hạ và phạm vi đưa hàng vào trong.',
    ],
    inputs: [
      'Ảnh sản phẩm, vật liệu chính và cấu tạo bề mặt.',
      'Kích thước sử dụng, kích thước đóng kiện và trọng lượng.',
      'Danh sách phụ kiện, số bộ và hướng dẫn lắp ráp nếu có.',
      'Yêu cầu bảo vệ bề mặt và điều kiện giao nhận tại địa chỉ đến.',
    ],
    preparationItems: [
      'Phân biệt hàng hoàn thiện và hàng tháo rời; lập danh sách chi tiết theo bộ.',
      'Xác nhận vật liệu, lớp bề mặt và hướng dẫn lắp ráp với nhà cung cấp.',
    ],
    technicalInputs: [
      'Kích thước sử dụng, kích thước đóng kiện, trọng lượng và số kiện.',
      'Danh sách phụ kiện, số bộ và hướng dẫn lắp ráp nếu có.',
    ],
    packingNotes: [
      'Góc cạnh, mặt kính và bề mặt dễ trầy cần lớp bảo vệ phù hợp.',
      'Phụ kiện nên được đánh mã theo bộ và gắn với kiện chính.',
    ],
    verificationPoints: [
      'Điều kiện xe tiếp cận, nâng hạ và vị trí bàn giao cần được xác nhận trước.',
    ],
    proofItems: [],
    serviceSlugs: ['van-chuyen-trung-viet', 'gom-hang-kiem-dem'],
    articleSlugs: [],
    faqs: [],
    saleBriefItems: [
      'Ảnh, vật liệu và tình trạng lắp ráp',
      'Kích thước kiện, trọng lượng và danh sách phụ kiện',
      'Điều kiện xe vào và nâng hạ tại điểm giao',
    ],
    review: legacyReview,
  },
  {
    slug: 'may-moc-moi',
    categorySlug: 'may-moc-day-chuyen',
    title: 'Máy móc mới',
    shortTitle: 'Máy móc mới',
    summary:
      'Chuẩn bị model, catalogue và dữ liệu kỹ thuật để kiểm tra phương án nhập, đóng kiện và nâng hạ thiết bị.',
    image: '/images/marketing/transport.webp',
    aliases: ['máy công nghiệp mới', 'thiết bị sản xuất mới'],
    searchTerms: ['máy sản xuất', 'dây chuyền máy móc'],
    models: [],
    uses: ['Sản xuất, gia công hoặc phục vụ vận hành doanh nghiệp.'],
    materials: ['kim loại', 'linh kiện điện', 'cụm điều khiển'],
    traits: ['cong-kenh', 'can-nang-ha', 'can-catalogue'],
    details: [
      'Xác nhận tên thiết bị, model, công dụng, công suất và tình trạng mới. Không suy ra yêu cầu nhập khẩu chỉ từ tên gọi chung như máy sản xuất hoặc máy công nghiệp.',
      'Catalogue và ảnh nhãn cần khớp với máy được đặt mua. Nếu máy đi kèm cụm điều khiển, phụ tùng hoặc dụng cụ, hãy lập danh sách tách biệt theo bộ.',
      'Cung cấp kích thước và trọng lượng sau đóng gói, trọng tâm, điểm nâng và hướng đặt theo hướng dẫn của nhà cung cấp. Những thông tin này ảnh hưởng phương án vận chuyển.',
      'Điểm nhận và giao cần làm rõ điều kiện xe vào, thiết bị nâng hạ và vị trí bàn giao. Lắp đặt, chạy thử hoặc đào tạo sử dụng chỉ thuộc phạm vi khi có thỏa thuận riêng.',
    ],
    inputs: [
      'Catalogue, model, ảnh nhãn và thông số kỹ thuật.',
      'Xác nhận tình trạng mới, danh sách thiết bị và phụ tùng đi kèm.',
      'Trọng lượng, kích thước kiện, trọng tâm và chỉ dẫn nâng hạ.',
      'Điểm nhận, điểm giao, hạn cần hàng và nhu cầu hồ sơ.',
    ],
    preparationItems: [
      'Xác nhận tên thiết bị, model, công dụng, công suất và tình trạng mới.',
      'Đối chiếu catalogue, ảnh nhãn và danh sách phụ tùng đi kèm.',
    ],
    technicalInputs: [
      'Catalogue, model, ảnh nhãn, công suất và thông số kỹ thuật.',
      'Trọng lượng, kích thước kiện, trọng tâm và chỉ dẫn nâng hạ.',
    ],
    packingNotes: [
      'Nhà cung cấp cần nêu điểm nâng, hướng đặt và phương án bảo vệ cụm điều khiển.',
    ],
    verificationPoints: [
      'Yêu cầu hồ sơ cần được kiểm tra từ dữ liệu kỹ thuật của đúng thiết bị, không chỉ từ tên thương mại.',
    ],
    proofItems: [],
    serviceSlugs: ['thu-tuc-hai-quan', 'van-chuyen-trung-viet'],
    articleSlugs: [],
    faqs: [],
    saleBriefItems: [
      'Catalogue, model, công suất và ảnh nhãn',
      'Kích thước kiện, trọng lượng, trọng tâm và điểm nâng',
      'Danh sách phụ tùng, điểm nhận và điểm giao',
    ],
    review: legacyReview,
  },
]
