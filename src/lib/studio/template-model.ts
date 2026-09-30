import { z } from 'zod'
import { preparationBrief } from '../../data/marketing'
import { internalLinkSchema, mediaPathSchema } from './content-model'
import { copyCollection, type FixedField } from './fixed-page-registry'

export const templateSettingsKey = 'site.templates.v1'
export const templateDefaults = {
  journey: {
    eyebrow: 'HÀNH TRÌNH NHẬP HÀNG',
    title: 'Một hành trình.',
    accent: 'Rõ từng bước.',
    intro:
      'Từ khi hàng về kho đến lúc bàn giao.\nMỗi chặng đều có việc cần rõ.',
    origin: 'TRUNG QUỐC',
    destination: 'VIỆT NAM',
    illustration: 'Minh họa quy trình',
    image: '/images/marketing/containers.webp',
    imageAlt: 'Container hàng hóa tại khu vực kho vận',
    stages: [
      {
        name: 'Tiếp nhận',
        location: 'Kho nhận hàng',
        title: 'Hàng đến kho, hành trình bắt đầu',
        description:
          'Tiếp nhận hàng từ nhà cung cấp, xác nhận thông tin lô hàng và sắp xếp khu vực lưu kho phù hợp.',
        checks: ['Thông tin lô hàng', 'Xác nhận tiếp nhận'],
      },
      {
        name: 'Kiểm đếm',
        location: 'Khu kiểm đếm',
        title: 'Đối chiếu từng kiện hàng',
        description:
          'Đối chiếu số lượng, kiểm tra tình trạng đóng gói và ghi nhận sai lệch trước khi lên phương án vận chuyển.',
        checks: ['Số lượng & đóng gói', 'Ghi nhận tình trạng'],
      },
      {
        name: 'Thông quan',
        location: 'Cửa khẩu',
        title: 'Hoàn thiện hồ sơ thông quan',
        description:
          'Rà soát chứng từ, phối hợp khai báo và thực hiện thủ tục hải quan theo yêu cầu của từng lô hàng.',
        checks: ['Đối chiếu chứng từ', 'Thủ tục hải quan'],
      },
      {
        name: 'Giao hàng',
        location: 'Kho đích',
        title: 'Bàn giao đến điểm hẹn',
        description:
          'Thống nhất lịch giao, vận chuyển đến địa điểm đã hẹn và xác nhận bàn giao hàng cùng chứng từ liên quan.',
        checks: ['Lịch giao thống nhất', 'Xác nhận bàn giao'],
      },
    ],
  },
  sidebar: {
    heading: 'Trao đổi về lô hàng',
    body: 'Nêu mặt hàng, điểm nhận và điểm giao để xác định phần việc cần hỗ trợ.',
    link: 'Chi phí & chứng từ',
    href: '/chi-phi-chung-tu',
  },
  services: {
    eyebrow: 'Dịch vụ TBS',
    parent: 'Dịch vụ',
    cardLink: 'Phạm vi dịch vụ',
    audienceTitle: 'Phù hợp với nhu cầu nào?',
    scopeTitle: 'Phạm vi công việc',
    inputsTitle: 'Thông tin cần chuẩn bị',
    preparationLink: 'Xem hướng dẫn chuẩn bị',
    preparationHref: '/kien-thuc/chuan-bi-thong-tin-lo-hang',
    processTitle: 'Trình tự phối hợp',
    steps: [
      'Tiếp nhận đầu vào và làm rõ nhu cầu của doanh nghiệp.',
      'Kiểm tra dữ liệu, xác định phần việc và những điểm cần bổ sung.',
      'Thống nhất báo giá, trách nhiệm, điều kiện thực hiện và hồ sơ.',
      'Tổ chức công việc, cập nhật thay đổi và đối chiếu khi bàn giao.',
    ],
    processLink: 'Quy trình và trách nhiệm từng bước',
    processHref: '/quy-trinh',
    boundariesTitle: 'Điều kiện và giới hạn',
    boundariesBody:
      'Chi phí cần gắn với công việc đã nhận và thông tin thực tế. Bộ hồ sơ được xác định theo phương án giao dịch, không phải một bộ mặc định cho mọi dịch vụ.',
    costsLink: 'Đối chiếu chi phí và chứng từ',
    costsHref: '/chi-phi-chung-tu',
    faqTitle: 'Câu hỏi về dịch vụ',
    navigation: [
      'Nhu cầu phù hợp',
      'Phạm vi công việc',
      'Thông tin cần chuẩn bị',
      'Trình tự phối hợp',
      'Điều kiện & giới hạn',
      'Câu hỏi thường gặp',
    ],
    transport: {
      title: 'Xác nhận từng phần giao nhận',
      caption: 'Khung đối chiếu khi thống nhất phương án',
      columns: [
        'Hạng mục',
        'Điểm bắt đầu / kết thúc',
        'Bên phụ trách',
        'Điều kiện cần xác nhận',
      ],
      rows: [
        [
          'Nhận hàng',
          'Nơi nhà cung cấp bàn giao đến điểm tiếp nhận đã thống nhất',
          'Nhà cung cấp hoặc bên nhận vận chuyển theo thỏa thuận',
          'Ngày sẵn hàng, số kiện, bao bì và điều kiện xe vào',
        ],
        [
          'Vận chuyển',
          'Điểm tiếp nhận đến điểm giao trong phương án',
          'Đơn vị thực hiện ghi trong phương án',
          'Dữ liệu cân đo, hồ sơ và mốc cập nhật',
        ],
        [
          'Giao tại Việt Nam',
          'Điểm tập kết đến địa điểm nhận nếu có trong phạm vi',
          'Bên giao và đầu mối nhận hàng được chỉ định',
          'Phí giao, nâng hạ, vị trí và chứng cứ bàn giao',
        ],
      ],
    },
  },
  industry: {
    eyebrow: 'Thông tin theo ngành hàng',
    parent: 'Ngành hàng',
    detailsTitle: 'Những điểm cần làm rõ',
    inputsTitle: 'Thông tin cần chuẩn bị',
    checkTitle: 'Xác nhận theo đúng sản phẩm',
    checkBody:
      'Nhóm ngành hàng giúp định hướng cuộc trao đổi, không thay thế việc kiểm tra chính sách và hồ sơ của mặt hàng thực tế. Phạm vi tiếp nhận, yêu cầu đóng gói, chi phí và lịch dự kiến cần được xác nhận sau khi có dữ liệu cụ thể.',
    costsLink: 'Làm rõ phạm vi chi phí và hồ sơ',
    costsHref: '/chi-phi-chung-tu',
    relatedTitle: 'Phần việc liên quan',
    navigation: [
      'Đặc điểm cần làm rõ',
      'Thông tin cần chuẩn bị',
      'Kiểm tra theo sản phẩm',
    ],
  },
  article: {
    parent: 'Kiến thức',
    byline: 'Hướng dẫn chuẩn bị và trao đổi dịch vụ · TBS GROUP',
    briefTitle: 'Nội dung chuẩn bị cho cuộc trao đổi',
    brief: preparationBrief,
    relatedTitle: 'Tiếp tục tìm hiểu',
    costsLink: 'Chi phí và chứng từ theo phương án',
    costsHref: '/chi-phi-chung-tu',
  },
  sitemap: {
    eyebrow: 'Điều hướng',
    title: 'Sơ đồ website',
    description:
      'Các trang giới thiệu, dịch vụ và hướng dẫn nhập hàng của TBS GROUP.',
    seoTitle: 'Sơ đồ website TBS GROUP',
    seoDescription:
      'Danh sách trang dịch vụ, ngành hàng, kiến thức và thông tin liên hệ của TBS GROUP.',
  },
  notFound: {
    eyebrow: '404 / KHÔNG TÌM THẤY TRANG',
    title: 'Mình tìm một hướng khác nhé.',
    body: 'Nội dung này không còn ở địa chỉ hiện tại. TBS vẫn sẵn sàng trao đổi về lô hàng của anh chị.',
    link: 'Về trang chủ',
  },
  shared: {
    faqLink: 'Xem nội dung liên quan',
    transitionCaption: 'TRUNG QUỐC / VIỆT NAM',
    articleLink: 'Đọc bài viết',
    searchEmpty:
      'Chưa tìm thấy bài viết phù hợp. Hãy thử từ khóa khác hoặc chọn tất cả chủ đề.',
    policyEyebrow: 'Thông tin & chính sách',
    policyContactTitle: 'Đầu mối trao đổi',
    policyContactLink: 'Thông tin liên hệ TBS GROUP',
    policyContactHref: '/lien-he',
  },
}
export type TemplateCopy = typeof templateDefaults
const groups: Record<keyof TemplateCopy, string> = {
  journey: 'Hành trình nhập hàng',
  sidebar: 'Khối tư vấn',
  services: 'Mẫu dịch vụ',
  industry: 'Mẫu ngành hàng',
  article: 'Mẫu bài viết',
  sitemap: 'Sơ đồ website',
  notFound: 'Trang không tìm thấy',
  shared: 'Liên kết & trạng thái nội dung',
}
const labels: Record<string, string> = {
  policyEyebrow: 'Nhãn nhóm chính sách',
  policyContactTitle: 'Tiêu đề liên hệ chính sách',
  policyContactLink: 'Nhãn liên hệ chính sách',
  policyContactHref: 'Đường dẫn liên hệ chính sách',
  eyebrow: 'Nhãn đầu mục',
  title: 'Tiêu đề',
  accent: 'Tiêu đề nhấn',
  intro: 'Giới thiệu',
  origin: 'Điểm đi',
  destination: 'Điểm đến',
  illustration: 'Nhãn minh họa',
  image: 'Ảnh minh họa',
  imageAlt: 'Mô tả ảnh',
  stages: 'Chặng',
  name: 'Tên',
  location: 'Địa điểm',
  description: 'Mô tả',
  checks: 'Điểm xác nhận',
  heading: 'Tiêu đề',
  body: 'Nội dung',
  link: 'Nhãn liên kết',
  href: 'Đường dẫn',
  parent: 'Tên nhóm điều hướng',
  cardLink: 'Liên kết trong danh sách',
  audienceTitle: 'Tiêu đề nhu cầu',
  scopeTitle: 'Tiêu đề phạm vi',
  inputsTitle: 'Tiêu đề đầu vào',
  preparationLink: 'Nhãn hướng dẫn chuẩn bị',
  preparationHref: 'Đường dẫn hướng dẫn',
  processTitle: 'Tiêu đề quy trình',
  steps: 'Bước phối hợp',
  processLink: 'Nhãn liên kết quy trình',
  processHref: 'Đường dẫn quy trình',
  boundariesTitle: 'Tiêu đề giới hạn',
  boundariesBody: 'Nội dung giới hạn',
  costsLink: 'Nhãn liên kết chi phí',
  costsHref: 'Đường dẫn chi phí',
  faqTitle: 'Tiêu đề hỏi đáp',
  navigation: 'Mục lục',
  transport: 'Bảng giao nhận',
  caption: 'Chú thích bảng',
  columns: 'Cột',
  rows: 'Dòng',
  detailsTitle: 'Tiêu đề đặc điểm',
  checkTitle: 'Tiêu đề kiểm tra',
  checkBody: 'Nội dung kiểm tra',
  relatedTitle: 'Tiêu đề liên quan',
  byline: 'Dòng thông tin bài viết',
  briefTitle: 'Tiêu đề nội dung chuẩn bị',
  brief: 'Nội dung chuẩn bị',
  seoTitle: 'SEO title',
  seoDescription: 'Meta description',
  faqLink: 'Nhãn liên kết hỏi đáp',
  transitionCaption: 'Tên tuyến khi chuyển trang',
  articleLink: 'Nhãn đọc bài viết',
  searchEmpty: 'Thông báo không có kết quả',
}
function flatten(value: unknown, path: string[], result: FixedField[]) {
  if (typeof value === 'string') {
    const leaf = path.at(-1)!
    result.push({
      key: path.join('.'),
      group: groups[path[0] as keyof TemplateCopy],
      label: path
        .slice(1)
        .map((part) =>
          /^\d+$/.test(part) ? String(Number(part) + 1) : labels[part] || part,
        )
        .join(' · '),
      value,
      kind:
        leaf === 'image'
          ? 'image'
          : /href$/i.test(leaf)
            ? 'link'
            : value.length > 120 || value.includes('\n')
              ? 'longtext'
              : 'text',
    })
  } else if (value && typeof value === 'object')
    Object.entries(value).forEach(([key, item]) =>
      flatten(item, [...path, key], result),
    )
}
export const templateFields: FixedField[] = []
flatten(templateDefaults, [], templateFields)
export const defaultTemplateValues = Object.fromEntries(
  templateFields.map((field) => [field.key, field.value]),
)
export const templateValuesSchema = z
  .object(
    Object.fromEntries(
      templateFields.map((field) => [
        field.key,
        field.kind === 'image'
          ? mediaPathSchema
          : field.kind === 'link'
            ? internalLinkSchema.refine(
                (value) => value.startsWith('/'),
                'Dùng đường dẫn tuyệt đối trong website.',
              )
            : z
                .string()
                .trim()
                .min(1)
                .max(field.kind === 'longtext' ? 4000 : 300),
      ]),
    ),
  )
  .strict()
export type TemplateDocument = {
  version: number
  updatedAt: string | null
  values: Record<string, string>
}
export function templateCopy(values: Record<string, string>): TemplateCopy {
  return Object.fromEntries(
    Object.entries(templateDefaults).map(([key, value]) => [
      key,
      copyCollection(value, values, key),
    ]),
  ) as TemplateCopy
}
export const templateImages = (values: Record<string, string>) =>
  templateFields
    .filter((field) => field.kind === 'image')
    .map((field) => values[field.key])
