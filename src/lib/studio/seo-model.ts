import { z } from 'zod'
import type { ContentPayload } from './content-model'

export function searchTitle(payload: ContentPayload, brand = 'TBS GROUP') {
  return payload.kind === 'page' && payload.data.slug === 'home'
    ? payload.seo.title
    : `${payload.seo.title} | ${brand}`
}

export const taskStatuses = ['planned', 'writing', 'review', 'done'] as const
export const taskStatusLabels = {
  planned: 'Đã lên kế hoạch',
  writing: 'Đang viết',
  review: 'Chờ duyệt',
  done: 'Hoàn thành',
}
export const seoTaskSchema = z
  .object({
    keyword: z.string().trim().min(1).max(200),
    title: z.string().trim().min(1).max(240),
    documentId: z.string().uuid().nullable(),
    assigneeId: z.string().uuid().nullable(),
    dueDate: z
      .string()
      .refine(
        (value) =>
          value === '' ||
          (/^\d{4}-\d{2}-\d{2}$/.test(value) &&
            !Number.isNaN(Date.parse(value)) &&
            new Date(value).toISOString().slice(0, 10) === value),
        'Ngày không hợp lệ.',
      ),
    status: z.enum(taskStatuses),
    notes: z.string().trim().max(5000),
  })
  .strict()
export type SeoTaskInput = z.infer<typeof seoTaskSchema>
export type SeoTask = SeoTaskInput & {
  id: string
  version: number
  updatedAt: string
}
export type SeoIssue = {
  code: string
  severity: 'error' | 'warning' | 'info'
  message: string
  field: string
  detail?: string
}
export type HtmlAudit = {
  issues: SeoIssue[]
  headings: number
  images: number
  links: number
  checkedAt: string
  status: 'checked' | 'failed'
}
export type SeoRow = {
  id: string
  path: string
  title: string
  version: number
  published: boolean
  issues: SeoIssue[]
  live: (HtmlAudit & { version: number; stale: boolean }) | null
}
export type LinkSuggestion = {
  id: string
  path: string
  title: string
  terms: string[]
}
