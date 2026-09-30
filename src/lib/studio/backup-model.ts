import { z } from 'zod'

export const backupLimit = 1024 * 1024 * 1024
export const backupRetention = 2 * 60 * 60 * 1000
export const backupConfirmation = 'KHOI PHUC WEBSITE'
export const backupApplicationId = 0x54425331
export const backupManifestKey = 'backup.manifest.v1'
export const backupSettingKeys = [
  'content.seed.v1',
  'content.fixed.seed.v1',
  'site.public.v1',
  'site.templates.v1',
  'seo.technical.v1',
  'ai.instructions.v1',
  'industries.taxonomy.v1',
] as const

export const backupSummarySchema = z
  .object({
    documents: z.number().int().min(26).max(10000),
    publications: z.number().int().min(0).max(10000),
    revisions: z.number().int().min(26).max(100000),
    media: z.number().int().min(0).max(2000),
    mediaBytes: z
      .number()
      .int()
      .min(0)
      .max(512 * 1024 * 1024),
    tasks: z.number().int().min(0).max(10000),
    redirects: z.number().int().min(0).max(10000),
    knowledge: z.number().int().min(0).max(500).default(0),
    generations: z.number().int().min(0).max(500).default(0),
  })
  .strict()
export type BackupSummary = z.infer<typeof backupSummarySchema>
export const backupManifestSchema = z
  .object({
    format: z.literal('tbs-studio'),
    version: z.literal(4),
    schemaVersion: z.literal(7),
    createdAt: z.string().datetime(),
    summary: backupSummarySchema,
  })
  .strict()
export const backupJobSchema = z
  .object({
    id: z.string().uuid(),
    kind: z.enum(['export', 'review', 'restored']),
    actorId: z.string().uuid(),
    createdAt: z.string().datetime(),
    expiresAt: z.string().datetime(),
    sourceCreatedAt: z.string().datetime(),
    bytes: z.number().int().min(1).max(backupLimit),
    summary: backupSummarySchema,
    fingerprint: z.string().regex(/^[a-f0-9]{64}$/),
    digest: z.string().regex(/^[a-f0-9]{64}$/),
    rollbackId: z.string().uuid().optional(),
    completedAt: z.string().datetime().optional(),
  })
  .strict()
export type BackupJob = z.infer<typeof backupJobSchema>
export const backupCommandSchema = z.discriminatedUnion('action', [
  z.object({ action: z.literal('export') }).strict(),
  z
    .object({
      action: z.literal('restore'),
      id: z.string().uuid(),
      fingerprint: z.string().regex(/^[a-f0-9]{64}$/),
      confirmation: z.literal(backupConfirmation),
    })
    .strict(),
])
