import { z } from 'zod'
import { fixedTemplate } from './fixed-page-registry'

const text = z.string().trim().min(1).max(20000)
export const slugSchema = z
  .string()
  .max(120)
  .regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    'Đường dẫn chỉ dùng chữ thường không dấu, số và dấu gạch ngang.',
  )
export const mediaPathSchema = z
  .string()
  .max(300)
  .regex(
    /^\/(?:images\/marketing\/[a-zA-Z0-9_-]+\.(?:webp|png|jpe?g|avif)|api\/studio\/media\/[a-f0-9-]+\/)$/,
    'Chọn ảnh trong thư viện website.',
  )
const paragraphs = z.array(text).min(1).max(100)
const optionalReviewText = z.string().trim().max(500).default('')
const optionalDateTime = z
  .union([z.string().datetime({ offset: true }), z.literal('')])
  .default('')
const base = z.object({
  slug: slugSchema,
  title: z.string().trim().min(1).max(240),
  summary: text,
  image: mediaPathSchema,
  imageAlts: z.record(mediaPathSchema, z.string().max(500)).optional(),
})
export const seoSchema = z
  .object({
    title: z.string().trim().min(1).max(240),
    description: z.string().trim().max(1000),
    canonical: z
      .string()
      .max(300)
      .refine(
        (value) =>
          value === '' ||
          /^\/(?:[a-z0-9]+(?:-[a-z0-9]+)*(?:\/[a-z0-9]+(?:-[a-z0-9]+)*)*)?\/?$/.test(
            value,
          ),
        'Canonical phải là đường dẫn nội bộ.',
      ),
    noindex: z.boolean(),
    image: z.union([mediaPathSchema, z.literal('')]),
  })
  .strict()
export const articleSchema = base
  .extend({
    category: z.string().trim().min(1).max(100),
    categorySlug: slugSchema,
    sections: z
      .array(
        z
          .object({
            heading: z.string().trim().min(1).max(240),
            body: paragraphs,
          })
          .strict(),
      )
      .min(1)
      .max(100),
  })
  .strict()
export const serviceSchema = base
  .extend({
    shortTitle: z.string().trim().min(1).max(100),
    audience: text,
    scope: paragraphs,
    inputs: paragraphs,
    boundaries: paragraphs,
    faqs: z.array(z.object({ q: text, a: text }).strict()).max(50),
  })
  .strict()
export const industryReviewSchema = z
  .object({
    status: z.enum(['pending', 'approved', 'legacy']),
    reviewer: optionalReviewText,
    reviewedAt: optionalDateTime,
    nextReviewAt: optionalDateTime,
  })
  .strict()
export const industryProofItemSchema = z
  .object({
    id: slugSchema,
    mediaId: z.string().uuid(),
    title: z.string().trim().min(1).max(240),
    caption: text,
    sourceRef: z.string().trim().min(1).max(500),
    sourceDate: z.string().date(),
    scopeNote: text,
    rightsStatus: z.enum(['pending', 'approved', 'rejected']),
    reviewer: optionalReviewText,
    reviewedAt: optionalDateTime,
  })
  .strict()
export const industryCategorySchema = base
  .extend({
    order: z.number().int().min(0).max(10000),
    featuredIndustryIds: z.array(slugSchema).max(12),
    review: industryReviewSchema,
  })
  .strict()
export const industrySchema = base
  .extend({
    categorySlug: slugSchema,
    shortTitle: z.string().trim().min(1).max(100),
    aliases: z.array(z.string().trim().min(1).max(240)).max(50),
    searchTerms: z.array(z.string().trim().min(1).max(240)).max(50),
    models: z.array(z.string().trim().min(1).max(240)).max(50),
    uses: z.array(z.string().trim().min(1).max(500)).max(50),
    materials: z.array(z.string().trim().min(1).max(240)).max(50),
    traits: z.array(slugSchema).max(30),
    details: paragraphs,
    inputs: paragraphs,
    preparationItems: z.array(text).max(100),
    technicalInputs: z.array(text).max(100),
    packingNotes: z.array(text).max(100),
    verificationPoints: z.array(text).max(100),
    proofItems: z.array(industryProofItemSchema).max(20),
    serviceSlugs: z.array(slugSchema).max(30),
    articleSlugs: z.array(slugSchema).max(30),
    faqs: z.array(z.object({ q: text, a: text }).strict()).max(50),
    saleBriefItems: z.array(text).max(50),
    review: industryReviewSchema,
  })
  .strict()
export const industryPublicationSchema = industrySchema.superRefine(
  (data, context) => {
    if (data.review.status !== 'approved')
      context.addIssue({
        code: 'custom',
        path: ['review', 'status'],
        message: 'Ngành hàng cần được duyệt trước khi xuất bản.',
      })
    if (!data.review.reviewer)
      context.addIssue({
        code: 'custom',
        path: ['review', 'reviewer'],
        message: 'Cần ghi nhận người duyệt nghiệp vụ.',
      })
    if (!data.review.reviewedAt)
      context.addIssue({
        code: 'custom',
        path: ['review', 'reviewedAt'],
        message: 'Cần ghi nhận thời điểm duyệt nghiệp vụ.',
      })
    data.proofItems.forEach((proof, index) => {
      if (proof.rightsStatus !== 'approved')
        context.addIssue({
          code: 'custom',
          path: ['proofItems', index, 'rightsStatus'],
          message: 'Bằng chứng cần được duyệt quyền sử dụng.',
        })
      if (!proof.reviewer)
        context.addIssue({
          code: 'custom',
          path: ['proofItems', index, 'reviewer'],
          message: 'Cần ghi nhận người duyệt bằng chứng.',
        })
      if (!proof.reviewedAt)
        context.addIssue({
          code: 'custom',
          path: ['proofItems', index, 'reviewedAt'],
          message: 'Cần ghi nhận thời điểm duyệt bằng chứng.',
        })
    })
  },
)
export const internalLinkSchema = z
  .string()
  .max(500)
  .regex(
    /^(?:\/(?:[a-z0-9-]+\/)*[a-z0-9-]*\/?(?:#[a-z0-9-]+)?|#[a-z0-9-]+)$/,
    'Liên kết phải là đường dẫn nội bộ hoặc mục trong trang.',
  )
export const fixedPageSchema = base
  .extend({
    image: z.union([mediaPathSchema, z.literal('')]),
    fields: z.record(z.string().min(1).max(20000)),
  })
  .strict()
  .superRefine((data, context) => {
    if (data.slug === 'home' && !data.image)
      context.addIssue({
        code: 'custom',
        path: ['image'],
        message: 'Trang chủ cần ảnh chính.',
      })
    const template = fixedTemplate(data.slug)
    if (!template) {
      context.addIssue({
        code: 'custom',
        path: ['slug'],
        message: 'Mẫu trang không tồn tại.',
      })
      return
    }
    const keys = new Set(template.fields.map((field) => field.key))
    for (const field of template.fields) {
      const value = data.fields[field.key]
      if (typeof value !== 'string' || !value.trim())
        context.addIssue({
          code: 'custom',
          path: ['fields', field.key],
          message: 'Nội dung không được để trống.',
        })
      else if (
        field.kind === 'image' &&
        !mediaPathSchema.safeParse(value).success
      )
        context.addIssue({
          code: 'custom',
          path: ['fields', field.key],
          message: 'Đường dẫn ảnh không hợp lệ.',
        })
      else if (
        field.kind === 'link' &&
        !internalLinkSchema.safeParse(value).success
      )
        context.addIssue({
          code: 'custom',
          path: ['fields', field.key],
          message: 'Liên kết không hợp lệ.',
        })
    }
    if (Object.keys(data.fields).some((key) => !keys.has(key)))
      context.addIssue({
        code: 'custom',
        path: ['fields'],
        message: 'Trường nội dung không thuộc mẫu trang.',
      })
  })
export const contentSchema = z.discriminatedUnion('kind', [
  z
    .object({ kind: z.literal('page'), data: fixedPageSchema, seo: seoSchema })
    .strict(),
  z
    .object({ kind: z.literal('article'), data: articleSchema, seo: seoSchema })
    .strict(),
  z
    .object({ kind: z.literal('service'), data: serviceSchema, seo: seoSchema })
    .strict(),
  z
    .object({
      kind: z.literal('industryCategory'),
      data: industryCategorySchema,
      seo: seoSchema,
    })
    .strict(),
  z
    .object({
      kind: z.literal('industry'),
      data: industrySchema,
      seo: seoSchema,
    })
    .strict(),
])
export type ContentPayload = z.infer<typeof contentSchema>
export type FixedPagePayload = Extract<ContentPayload, { kind: 'page' }>
export type ContentKind = ContentPayload['kind']
export type IndustryCategory = z.infer<typeof industryCategorySchema>
export type Industry = z.infer<typeof industrySchema>
export type IndustryReview = z.infer<typeof industryReviewSchema>
export type IndustryProofItem = z.infer<typeof industryProofItemSchema>
export type ContentDocument = {
  id: string
  kind: ContentKind
  path: string
  draft: ContentPayload
  published: ContentPayload | null
  publishedPath: string | null
  version: number
  updatedAt: string
  publishedAt: string | null
  archivedAt: string | null
}
export type ContentSummary = Omit<ContentDocument, 'draft' | 'published'> & {
  title: string
  status: 'draft' | 'published' | 'changed' | 'archived'
}
export function contentPath(value: ContentPayload) {
  if (value.kind === 'page') return fixedTemplate(value.data.slug)!.path
  if (value.kind === 'industryCategory')
    return `/nganh-hang/${value.data.slug}`
  if (value.kind === 'industry')
    return `/nganh-hang/${value.data.categorySlug}/${value.data.slug}`
  const prefix = {
    article: 'kien-thuc',
    service: 'dich-vu',
  }
  return `/${prefix[value.kind]}/${value.data.slug}`
}
