import { z } from 'zod'
import type { ContentPayload } from './content-model'

export const normalizePublicPath = (path: string) =>
  path.replace(/\/$/, '') || '/'
export const redirectSchema = z
  .object({
    source: z
      .string()
      .trim()
      .max(500)
      .regex(
        /^\/(?:[a-z0-9]+(?:-[a-z0-9]+)*\/)*[a-z0-9]+(?:-[a-z0-9]+)*\/?$/,
        'Đường dẫn cần bắt đầu bằng /, chỉ gồm chữ thường, số, dấu gạch ngang và phân đoạn /; không chứa tham số.',
      )
      .transform(normalizePublicPath),
    targetId: z.string().uuid(),
    status: z.union([z.literal(307), z.literal(308)]),
  })
  .strict()
export type RedirectInput = z.infer<typeof redirectSchema>
export type RedirectRule = RedirectInput & {
  id: string
  version: number
  updatedAt: string
  targetPath: string
  targetTitle: string
}
export const technicalSettingsSchema = z
  .object({
    googleVerification: z
      .array(
        z
          .string()
          .trim()
          .min(10)
          .max(256)
          .regex(
            /^[A-Za-z0-9_-]+$/,
            'Chỉ nhập mã xác minh, không nhập thẻ HTML.',
          ),
      )
      .max(10)
      .refine(
        (items) => new Set(items).size === items.length,
        'Mã xác minh không được trùng nhau.',
      ),
    blockIndexing: z.boolean(),
  })
  .strict()
export type TechnicalSettingsInput = z.infer<typeof technicalSettingsSchema>
export type TechnicalSettings = TechnicalSettingsInput & { version: number }
export type TechnicalSeoData = {
  redirects: RedirectRule[]
  settings: TechnicalSettings
  targets: { id: string; path: string; title: string }[]
  releaseApproved: boolean
  indexable: boolean
  sitemapPaths: string[]
}
export const indexingAllowed = (releaseApproved: boolean, blocked: boolean) =>
  releaseApproved && !blocked

export function sitemapEntries(
  publications: { path: string; payload: ContentPayload; updatedAt: string }[],
  indexable: boolean,
) {
  if (!indexable) return []
  // Industry Atlas: nhóm rỗng và ngành hàng mồ côi không được vào sitemap.
  const publishedCategories = new Set(
    publications.flatMap(({ payload }) =>
      payload.kind === 'industryCategory' ? [payload.data.slug] : [],
    ),
  )
  const populatedCategories = new Set(
    publications.flatMap(({ payload }) =>
      payload.kind === 'industry' &&
      publishedCategories.has(payload.data.categorySlug)
        ? [payload.data.categorySlug]
        : [],
    ),
  )
  return publications
    .filter(
      ({ path, payload }) =>
        (payload.kind !== 'industryCategory' ||
          populatedCategories.has(payload.data.slug)) &&
        (payload.kind !== 'industry' ||
          publishedCategories.has(payload.data.categorySlug)) &&
        !payload.seo.noindex &&
        (!payload.seo.canonical ||
          normalizePublicPath(payload.seo.canonical) === path),
    )
    .map(({ path, updatedAt }) => ({ path, updatedAt }))
}
