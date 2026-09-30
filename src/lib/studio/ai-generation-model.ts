import { z } from 'zod'
import { type ContentPayload, contentSchema } from './content-model'
import { fixedTemplate } from './fixed-page-registry'
import {
  aiInstructionsSchema,
  knowledgeBoundary,
  knowledgePayloadSchema,
} from './ai-knowledge-model'

export const aiTasks = {
  brief: 'Brief nội dung',
  outline: 'Dàn ý',
  draft: 'Soạn bản nháp',
  rewrite: 'Viết lại',
  seo: 'Metadata SEO',
  faq: 'Câu hỏi thường gặp',
  links: 'Liên kết nội bộ',
} as const
export const aiTaskSchema = z.enum([
  'brief',
  'outline',
  'draft',
  'rewrite',
  'seo',
  'faq',
  'links',
])
export type AiTask = z.infer<typeof aiTaskSchema>
export const advisoryTask = (task: AiTask) =>
  ['brief', 'outline', 'links'].includes(task)
const text = z.string().max(20000),
  short = z.string().max(2000)
const section = z
  .object({
    heading: z.string().min(1).max(240),
    body: z.array(text.min(1)).min(1).max(100),
  })
  .strict()
const faq = z.object({ q: text.min(1), a: text.min(1) }).strict()
export const aiValueSchema = z.union([
  text,
  z.array(text.min(1)).max(100),
  z.array(section).max(100),
  z.array(faq).max(50),
])
export type AiValue = z.infer<typeof aiValueSchema>
export const aiFieldSchema = z
  .object({
    key: z.string().min(1).max(240),
    label: z.string().max(300),
    type: z.enum(['text', 'list', 'sections', 'faqs']),
    value: aiValueSchema,
  })
  .strict()
export type AiField = z.infer<typeof aiFieldSchema>
export function aiFields(payload: ContentPayload): AiField[] {
  const fields: AiField[] = [
    { key: 'title', label: 'Tiêu đề', type: 'text', value: payload.data.title },
    {
      key: 'summary',
      label: 'Mô tả ngắn',
      type: 'text',
      value: payload.data.summary,
    },
    {
      key: 'seo.title',
      label: 'Tiêu đề SEO',
      type: 'text',
      value: payload.seo.title,
    },
    {
      key: 'seo.description',
      label: 'Mô tả SEO',
      type: 'text',
      value: payload.seo.description,
    },
  ]
  const add = (
    key: string,
    label: string,
    type: AiField['type'],
    value: AiValue,
  ) => fields.push({ key, label, type, value })
  if (payload.kind === 'page')
    for (const field of fixedTemplate(payload.data.slug)!.fields) {
      if (!['image', 'link'].includes(field.kind))
        add(
          `field:${field.key}`,
          `${field.group}: ${field.label}`,
          'text',
          payload.data.fields[field.key],
        )
    }
  if (payload.kind === 'article') {
    add('sections', 'Các mục bài viết', 'sections', payload.data.sections)
    payload.data.sections.forEach((item, index) => {
      add(
        `section:${index}:heading`,
        `Mục ${index + 1}: tiêu đề`,
        'text',
        item.heading,
      )
      item.body.forEach((body, n) =>
        add(
          `section:${index}:body:${n}`,
          `Mục ${index + 1}: đoạn ${n + 1}`,
          'text',
          body,
        ),
      )
    })
  }
  if (payload.kind === 'service') {
    add('shortTitle', 'Tên ngắn', 'text', payload.data.shortTitle)
    add('audience', 'Đối tượng khách hàng', 'text', payload.data.audience)
    for (const [key, label] of [
      ['scope', 'Phạm vi'],
      ['inputs', 'Thông tin cần có'],
      ['boundaries', 'Giới hạn'],
    ] as const) {
      add(key, label, 'list', payload.data[key])
      payload.data[key].forEach((value, n) =>
        add(`${key}:${n}`, `${label} ${n + 1}`, 'text', value),
      )
    }
    add('faqs', 'Các câu hỏi thường gặp', 'faqs', payload.data.faqs)
  }
  if (payload.kind === 'industry')
    for (const [key, label] of [
      ['details', 'Nội dung ngành hàng'],
      ['inputs', 'Thông tin cần có'],
    ] as const) {
      add(key, label, 'list', payload.data[key])
      payload.data[key].forEach((value, n) =>
        add(`${key}:${n}`, `${label} ${n + 1}`, 'text', value),
      )
    }
  return fields
}
export function aiPatch(
  payload: ContentPayload,
  changes: { field: string; value: AiValue }[],
) {
  const next = structuredClone(payload),
    fields = aiFields(payload)
  for (const change of changes) {
    const field = fields.find((item) => item.key === change.field)
    if (!field) throw new Error('Unknown AI field')
    const schema = {
      text,
      list: z.array(text.min(1)).max(100),
      sections: z.array(section).min(1).max(100),
      faqs: z.array(faq).max(50),
    }[field.type]
    const value = schema.parse(change.value),
      key = field.key
    if (key === 'seo.title' || key === 'seo.description')
      next.seo[key === 'seo.title' ? 'title' : 'description'] = value as string
    else if (key.startsWith('field:') && next.kind === 'page')
      next.data.fields[key.slice(6)] = value as string
    else if (key.startsWith('section:') && next.kind === 'article') {
      const parts = key.split(':'),
        item = next.data.sections[Number(parts[1])]
      if (parts[2] === 'heading') item.heading = value as string
      else item.body[Number(parts[3])] = value as string
    } else if (key.includes(':')) {
      const [name, index] = key.split(':')
      ;(next.data as unknown as Record<string, string[]>)[name][Number(index)] =
        value as string
    } else (next.data as unknown as Record<string, AiValue>)[key] = value
  }
  return contentSchema.parse(next)
}
export const generationRequestSchema = z
  .object({
    id: z.string().uuid(),
    documentId: z.string().uuid(),
    documentVersion: z.number().int().positive(),
    providerVersion: z.number().int().nonnegative(),
    task: aiTaskSchema,
    fields: z.array(z.string().min(1).max(240)).min(1).max(12),
    prompt: z.string().trim().min(5).max(2000),
    consent: z.literal(true),
  })
  .strict()
export const aiResultSchema = z
  .object({
    summary: short.min(1),
    notes: z.array(short).max(12),
    outline: z.array(short).max(30),
    changes: z
      .array(
        z
          .object({
            field: z.string().max(240),
            value: aiValueSchema,
            sourceIds: z.array(z.string().uuid()).max(6),
            reason: short,
          })
          .strict(),
      )
      .max(12),
    links: z
      .array(
        z
          .object({
            targetId: z.string().uuid(),
            anchor: z.string().min(1).max(240),
            reason: short,
          })
          .strict(),
      )
      .max(20),
  })
  .strict()
export type AiResult = z.infer<typeof aiResultSchema>
const object = (properties: Record<string, unknown>) => ({
  type: 'object',
  properties,
  required: Object.keys(properties),
  additionalProperties: false,
})
const string = { type: 'string' },
  strings = { type: 'array', items: string }
export function aiResultJsonSchema() {
  return object({
    summary: string,
    notes: strings,
    outline: strings,
    changes: {
      type: 'array',
      items: object({
        field: string,
        value: {
          anyOf: [
            string,
            strings,
            {
              type: 'array',
              items: object({ heading: string, body: strings }),
            },
            { type: 'array', items: object({ q: string, a: string }) },
          ],
        },
        sourceIds: strings,
        reason: string,
      }),
    },
    links: {
      type: 'array',
      items: object({ targetId: string, anchor: string, reason: string }),
    },
  })
}
const sourceSnapshot = knowledgePayloadSchema
  .pick({
    title: true,
    category: true,
    sourceName: true,
    sourceUrl: true,
    reviewDue: true,
  })
  .extend({
    id: z.string().uuid(),
    version: z.number().int().positive(),
    approvedAt: z.string().datetime(),
    digest: z.string().regex(/^[a-f0-9]{64}$/),
    excerpt: z.string().max(2800),
  })
  .strict()
const digest = z.string().regex(/^[a-f0-9]{64}$/)
export const generationGuardsSchema = z
  .object({
    sections: digest.optional(),
    scope: digest.optional(),
    inputs: digest.optional(),
    boundaries: digest.optional(),
    details: digest.optional(),
  })
  .strict()
export const generationContextSchema = z
  .object({
    title: z.string().max(240),
    path: z.string().max(500),
    kind: z.enum(['page', 'article', 'service', 'industry']),
    fields: z.array(aiFieldSchema).min(1).max(12),
    structureGuards: generationGuardsSchema,
    knowledge: z
      .object({
        policy: z
          .object({
            version: z.number().int().nonnegative(),
            values: aiInstructionsSchema,
          })
          .strict(),
        boundary: z.literal(knowledgeBoundary),
        sources: z.array(sourceSnapshot).max(6),
      })
      .strict(),
    links: z
      .array(
        z
          .object({
            id: z.string().uuid(),
            title: z.string().max(240),
            path: z.string().max(500),
          })
          .strict(),
      )
      .max(20),
  })
  .strict()
export type GenerationContext = z.infer<typeof generationContextSchema>
const usageSchema = z
  .object({
    inputTokens: z.number().int().nonnegative(),
    outputTokens: z.number().int().nonnegative(),
    totalTokens: z.number().int().nonnegative(),
  })
  .strict()
export const generationPayloadSchema = z
  .object({
    task: aiTaskSchema,
    prompt: z.string().max(2000),
    documentVersion: z.number().int().positive(),
    documentDigest: z.string().regex(/^[a-f0-9]{64}$/),
    fingerprint: z.string().regex(/^[a-f0-9]{64}$/),
    actorId: z.string().uuid().nullable(),
    provider: z.literal('openai'),
    model: z.string().max(100),
    context: generationContextSchema,
    structureGuards: generationGuardsSchema,
    status: z.enum(['running', 'completed', 'failed']),
    errorCode: z.string().max(100).nullable(),
    expiresAt: z.number().int().positive(),
    finishedAt: z.string().datetime().nullable(),
    latencyMs: z.number().nonnegative().nullable(),
    usage: usageSchema.nullable(),
    result: aiResultSchema.nullable(),
    appliedFields: z.array(z.string().max(240)).max(12),
    restored: z.boolean(),
  })
  .strict()
  .superRefine((job, ctx) => {
    if (
      (job.status === 'completed') !== (job.result !== null) ||
      (job.status === 'failed') !== (job.errorCode !== null) ||
      (job.status === 'running') !== (job.finishedAt === null) ||
      new Set(job.appliedFields).size !== job.appliedFields.length ||
      job.appliedFields.some(
        (field) =>
          !job.result?.changes.some((change) => change.field === field),
      )
    )
      ctx.addIssue({ code: 'custom', message: 'Invalid generation state' })
  })
export type GenerationPayload = z.infer<typeof generationPayloadSchema>
export type Generation = GenerationPayload & {
  id: string
  documentId: string
  version: number
  createdAt: string
  updatedAt: string
}
export const generationRowSchema = z
  .object({
    id: z.string().uuid(),
    document_id: z.string().uuid(),
    version: z.number().int().positive().max(1000000000),
    payload: z.string().max(262144),
    created_at: z.string().datetime(),
    updated_at: z.string().datetime(),
  })
  .strict()
export const applyGenerationSchema = z
  .object({
    version: z.number().int().positive(),
    documentVersion: z.number().int().positive(),
    fields: z.array(z.string().min(1).max(240)).min(1).max(12),
    consent: z.literal(true),
  })
  .strict()
