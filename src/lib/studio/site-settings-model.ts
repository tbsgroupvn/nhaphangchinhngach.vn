import { z } from 'zod'
import { site } from '../../data/marketing'
import { internalLinkSchema, mediaPathSchema } from './content-model'

export const siteSettingsKey = 'site.public.v1'
const text = (max: number) => z.string().trim().min(1).max(max)
const linkSchema = z
  .object({ label: text(40), href: internalLinkSchema })
  .strict()
const linksSchema = z
  .array(linkSchema)
  .min(1)
  .max(6)
  .refine(
    (links) => new Set(links.map((link) => link.href)).size === links.length,
    'Liên kết bị trùng trong cùng danh sách.',
  )
export const siteSettingsSchema = z
  .object({
    identity: z
      .object({
        name: text(60).refine(
          (value) => !value.includes('%s'),
          'Tên không được chứa %s.',
        ),
        phone: z
          .string()
          .regex(
            /^\+[1-9][0-9]{7,14}$/,
            'Số gọi cần mã quốc gia, ví dụ +84976005335.',
          ),
        phoneDisplay: text(24).regex(
          /^[+()0-9 .-]+$/,
          'Số hiển thị chỉ gồm số và ký tự định dạng điện thoại.',
        ),
        email: z.string().trim().email().max(254),
        zalo: z
          .string()
          .regex(
            /^https:\/\/zalo\.me\/[a-zA-Z0-9_-]{3,80}$/,
            'Dùng liên kết https://zalo.me/ của doanh nghiệp.',
          ),
        logo: mediaPathSchema,
        footerLogo: mediaPathSchema,
        defaultTitle: text(240),
        description: text(1000),
        shareImage: mediaPathSchema,
        shareImageAlt: text(500),
      })
      .strict()
      .superRefine((identity, context) => {
        const digits = identity.phoneDisplay
          .replace(/\D/g, '')
          .replace(/^0/, '84')
        if (digits !== identity.phone.slice(1))
          context.addIssue({
            code: 'custom',
            path: ['phoneDisplay'],
            message: 'Số hiển thị phải khớp với số được gọi.',
          })
      }),
    navigation: linksSchema.refine(
      (links) => links.every((link) => link.label.length <= 24),
      'Tên mục menu tối đa 24 ký tự.',
    ),
    contactLabel: text(32),
    mobileContactHeading: text(100),
    footer: z
      .object({
        eyebrow: text(120),
        headline: text(180),
        body: text(400),
        tagline: text(240),
        routeLabel: text(80),
        columns: z
          .array(z.object({ title: text(60), links: linksSchema }).strict())
          .length(3),
        legalLinks: z.array(linkSchema).min(1).max(4),
      })
      .strict(),
  })
  .strict()
export type SiteSettings = z.infer<typeof siteSettingsSchema>
export type SiteSettingsDocument = {
  version: number
  updatedAt: string | null
  payload: SiteSettings
}

export const defaultSiteSettings: SiteSettings = {
  identity: {
    name: site.name,
    phone: site.phone,
    phoneDisplay: site.phoneDisplay,
    email: site.email,
    zalo: site.zalo,
    logo: '/images/marketing/logo-color.png',
    footerLogo: '/images/marketing/logo-white-trim.png',
    defaultTitle: 'TBS GROUP | Nhập khẩu chính ngạch',
    description:
      'Giải pháp nhập khẩu chính ngạch Trung Quốc - Việt Nam. TBS GROUP đồng hành từ thông tin hàng hóa, phương án vận chuyển đến chứng từ và bàn giao.',
    shareImage: '/images/marketing/containers.webp',
    shareImageAlt: 'TBS GROUP - Minh họa logistics',
  },
  navigation: [
    { label: 'Về TBS', href: '/gioi-thieu/' },
    { label: 'Dịch vụ', href: '/dich-vu/' },
    { label: 'Ngành hàng', href: '/nganh-hang/' },
    { label: 'Kiến thức', href: '/kien-thuc/' },
    { label: 'Liên hệ', href: '/lien-he/' },
  ],
  contactLabel: 'Trao đổi qua Zalo',
  mobileContactHeading: 'Trao đổi trực tiếp với TBS',
  footer: {
    eyebrow: 'CÙNG TBS, RÕ TỪ BƯỚC ĐẦU',
    headline: 'Bắt đầu từ\nlô hàng của anh chị.',
    body: 'Thông tin đúng. Phương án rõ.\nTrao đổi trực tiếp với đội ngũ TBS.',
    tagline: 'Nhập khẩu chính ngạch\nTrung Quốc - Việt Nam.',
    routeLabel: 'Trung Quốc ↔ Việt Nam',
    columns: [
      {
        title: 'TBS GROUP',
        links: [
          { label: 'Về chúng tôi', href: '/gioi-thieu/' },
          { label: 'Năng lực vận hành', href: '/nang-luc-van-hanh/' },
          { label: 'Quy trình phối hợp', href: '/quy-trinh/' },
          { label: 'Liên hệ', href: '/lien-he/' },
        ],
      },
      {
        title: 'Giải pháp nhập khẩu',
        links: [
          {
            label: 'Nhập khẩu chính ngạch',
            href: '/dich-vu/nhap-khau-chinh-ngach/',
          },
          { label: 'Ủy thác nhập khẩu', href: '/dich-vu/uy-thac-nhap-khau/' },
          {
            label: 'Vận chuyển Trung - Việt',
            href: '/dich-vu/van-chuyen-trung-viet/',
          },
          { label: 'Thủ tục hải quan', href: '/dich-vu/thu-tuc-hai-quan/' },
        ],
      },
      {
        title: 'Thông tin hữu ích',
        links: [
          { label: 'Chi phí & chứng từ', href: '/chi-phi-chung-tu/' },
          { label: 'Kiến thức nhập khẩu', href: '/kien-thuc/' },
          { label: 'Câu hỏi thường gặp', href: '/hoi-dap/' },
          { label: 'Chính sách dịch vụ', href: '/chinh-sach/dich-vu/' },
        ],
      },
    ],
    legalLinks: [
      { label: 'Bảo mật', href: '/chinh-sach/bao-mat/' },
      { label: 'Điều khoản', href: '/chinh-sach/dieu-khoan/' },
    ],
  },
}
export function siteSettingImages(payload: SiteSettings) {
  return Array.from(
    new Set([
      payload.identity.logo,
      payload.identity.footerLogo,
      payload.identity.shareImage,
    ]),
  )
}
