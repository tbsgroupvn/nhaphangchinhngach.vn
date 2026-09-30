import Database from 'better-sqlite3'
import { existsSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { isDeepStrictEqual } from 'node:util'
import sharp from 'sharp'
import { z } from 'zod'
import { openStudioDatabase, type StudioDatabase } from './database'
import { StudioAuth } from './auth'
import { StudioContent } from './content'
import {
  contentPath,
  contentSchema,
  industryPublicationSchema,
  type ContentPayload,
} from './content-model'
import { contentImages } from './media-references'
import { mediaMetadataSchema, uploadedMediaPath } from './media-model'
import { siteSettingsSchema, siteSettingImages } from './site-settings-model'
import { templateImages, templateValuesSchema } from './template-model'
import { technicalSettingsSchema, redirectSchema } from './technical-seo-model'
import { reservedRedirectPath } from './technical-seo'
import { seoTaskSchema } from './seo-model'
import { knowledgeRowSchema } from './ai-knowledge'
import {
  generationPayloadSchema,
  generationRowSchema,
} from './ai-generation-model'
import { validateGenerationResult } from './ai-generation'
import {
  aiInstructionsSchema,
  knowledgePayloadSchema,
} from './ai-knowledge-model'
import { legacyServiceAliases } from '../../data/marketing'
import { StudioError } from './errors'
import {
  backupApplicationId,
  backupLimit,
  backupManifestKey,
  backupManifestSchema,
  backupSettingKeys,
} from './backup-model'
import { backupColumns, backupSummary } from './backup-data'
import { industryTaxonomySchema } from './industry-taxonomy-model'

const version = z.number().int().min(1).max(1_000_000_000)
const settingVersion = z.number().int().min(0).max(1_000_000_000)
const stamp = z.string().datetime()
const uuid = z.string().uuid()
const nullableId = uuid.nullable()
const documentSchema = z
  .object({
    id: uuid,
    kind: z.enum([
      'page',
      'article',
      'industryCategory',
      'industry',
      'service',
    ]),
    path: z.string().max(500),
    draft: z.string(),
    published: z.string().nullable(),
    published_path: z.string().max(500).nullable(),
    version,
    updated_by: nullableId,
    updated_at: stamp,
    published_at: stamp.nullable(),
    archived_at: stamp.nullable(),
  })
  .strict()
const revisionSchema = z
  .object({
    id: z.number().int().positive().safe(),
    document_id: uuid,
    version,
    snapshot: z.string(),
    action: z.enum([
      'seeded',
      'created',
      'saved',
      'seo-saved',
      'published',
      'unpublished',
      'restored',
      'backup-restored',
      'industry-atlas-migrated',
      'industry-atlas-seeded',
      'archived',
      'reactivated',
    ]),
    actor_id: nullableId,
    created_at: stamp,
  })
  .strict()
const mediaSchema = mediaMetadataSchema
  .extend({
    id: uuid,
    filename: z
      .string()
      .min(1)
      .max(180)
      .regex(/^[^/\\\u0000-\u001f\u007f]+$/),
    width: z.number().int().min(1).max(2400),
    height: z.number().int().min(1).max(2400),
    bytes: z
      .number()
      .int()
      .min(1)
      .max(32 * 1024 * 1024),
    version,
    created_at: stamp,
    updated_at: stamp,
  })
  .strict()

export const invalidBackup = () =>
  new StudioError(
    400,
    'Bản sao không hợp lệ hoặc không tương thích. Chỉ dùng tệp xuất từ phiên bản TBS Studio này.',
    'INVALID_BACKUP',
  )
const ensure = (condition: unknown) => {
  if (!condition) throw invalidBackup()
}

let trustedSchema: unknown
let seedPaths: Map<string, string>
function schemaOf(db: StudioDatabase) {
  return db
    .prepare('SELECT type,name,tbl_name,sql FROM sqlite_schema ORDER BY name')
    .all()
}
function trustedStructure() {
  if (!trustedSchema) {
    const db = openStudioDatabase(':memory:')
    try {
      trustedSchema = schemaOf(db)
      const content = new StudioContent(db, new StudioAuth(db))
      content.seedMarketing()
      seedPaths = new Map(content.list().map((item) => [item.path, item.kind]))
    } finally {
      db.close()
    }
  }
}
function parsed<T extends z.ZodTypeAny>(schema: T, input: string): z.output<T> {
  const raw = JSON.parse(input)
  const value = schema.parse(raw)
  ensure(isDeepStrictEqual(raw, value))
  return value
}

export async function validateBackup(path: string) {
  let db: StudioDatabase | undefined
  const started = Date.now()
  const checkTime = () => {
    if (Date.now() - started > 120_000) throw invalidBackup()
  }
  try {
    ensure(statSync(path).size > 0 && statSync(path).size <= backupLimit)
    trustedStructure()
    db = new Database(path, { readonly: true, fileMustExist: true })
    db.pragma('trusted_schema = OFF')
    db.pragma('query_only = ON')
    db.pragma('cache_size = -4096')
    db.pragma('mmap_size = 0')
    ensure(
      db.pragma('application_id', { simple: true }) === backupApplicationId,
    )
    ensure(db.pragma('user_version', { simple: true }) === 7)
    ensure(
      (
        db.prepare('SELECT count(*) n FROM sqlite_schema').get() as {
          n: number
        }
      ).n <= 40,
    )
    ensure(
      !db
        .prepare(
          'SELECT 1 FROM sqlite_schema WHERE length(sql) > 65536 LIMIT 1',
        )
        .get(),
    )
    // Reject views, triggers, virtual tables and altered constraints before reading any business row.
    ensure(isDeepStrictEqual(schemaOf(db), trustedSchema))
    ensure(db.pragma('quick_check', { simple: true }) === 'ok')
    for (const table of [
      'studio_users',
      'studio_sessions',
      'studio_rate_limits',
      'studio_audit',
      'studio_seo_audits',
    ])
      ensure(
        (db.prepare(`SELECT count(*) n FROM ${table}`).get() as { n: number })
          .n === 0,
      )
    ensure(
      (
        db.prepare('SELECT count(*) n FROM studio_settings').get() as {
          n: number
        }
      ).n ===
        backupSettingKeys.length + 1,
    )
    const summary = backupSummary(db)
    ensure(summary.revisions + summary.documents <= 100000)
    ensure((db.pragma('foreign_key_check') as unknown[]).length === 0)
    // Check storage classes and lengths in SQLite before pulling untrusted JSON/blobs into JS.
    for (const [table, columns] of Object.entries(backupColumns)) {
      for (const column of columns.split(',')) {
        const bound = column === 'data' ? 32 * 1024 * 1024 : 1024 * 1024
        ensure(
          !db
            .prepare(
              `SELECT 1 FROM ${table} WHERE length(CAST(${column} AS BLOB)) > ? LIMIT 1`,
            )
            .get(bound),
        )
      }
    }
    ensure(
      !db
        .prepare(
          'SELECT 1 FROM studio_settings WHERE length(CAST(value AS BLOB)) > 524288 OR length(key) > 100 LIMIT 1',
        )
        .get(),
    )
    const settings = new Map<string, string>()
    for (const row of db.prepare('SELECT * FROM studio_settings').all() as {
      key: string
      value: string
      updated_at: string
    }[]) {
      ensure(
        row.key === backupManifestKey ||
          (backupSettingKeys as readonly string[]).includes(row.key),
      )
      stamp.parse(row.updated_at)
      settings.set(row.key, row.value)
    }
    const manifest = parsed(
      backupManifestSchema,
      settings.get(backupManifestKey)!,
    )
    ensure(isDeepStrictEqual(summary, manifest.summary))
    ensure(
      settings.get('content.seed.v1') === 'true' &&
        settings.get('content.fixed.seed.v1') === 'true',
    )
    const site = parsed(
      z
        .object({ version: settingVersion, payload: siteSettingsSchema })
        .strict(),
      settings.get('site.public.v1')!,
    )
    const templates = parsed(
      z
        .object({ version: settingVersion, values: templateValuesSchema })
        .strict(),
      settings.get('site.templates.v1')!,
    )
    parsed(
      technicalSettingsSchema.extend({ version: settingVersion }).strict(),
      settings.get('seo.technical.v1')!,
    )
    const taxonomy = parsed(
      industryTaxonomySchema,
      settings.get('industries.taxonomy.v1')!,
    )
    const traitSlugs = new Set(taxonomy.traits.map((trait) => trait.slug))
    const mediaIds = new Set<string>()
    parsed(
      z
        .object({ version: settingVersion, values: aiInstructionsSchema })
        .strict(),
      settings.get('ai.instructions.v1')!,
    )
    let knowledgeBytes = 0
    for (const raw of db.prepare('SELECT * FROM studio_knowledge').iterate()) {
      checkTime()
      const row = knowledgeRowSchema.parse(raw)
      parsed(knowledgePayloadSchema, row.draft)
      if (row.approved !== null) parsed(knowledgePayloadSchema, row.approved)
      knowledgeBytes +=
        Buffer.byteLength(row.draft) + Buffer.byteLength(row.approved || '')
      ensure(knowledgeBytes <= 16777216)
    }
    const mediaRows = db
      .prepare(
        `SELECT ${backupColumns.studio_media
          .split(',')
          .filter((c) => c !== 'data')
          .join(',')} FROM studio_media`,
      )
      .all()
    let generationBytes = 0
    for (const raw of db
      .prepare('SELECT * FROM studio_ai_generations')
      .iterate()) {
      checkTime()
      const row = generationRowSchema.parse(raw),
        job = parsed(generationPayloadSchema, row.payload),
        bytes = Buffer.byteLength(row.payload)
      generationBytes += bytes
      ensure(bytes <= 262144 && generationBytes <= 134217728)
      ensure(
        !!db
          .prepare('SELECT 1 FROM studio_documents WHERE id=?')
          .get(row.document_id),
      )
      if (job.result)
        validateGenerationResult(job.context, job.task, job.result)
    }
    for (const raw of mediaRows) {
      const row = mediaSchema.parse(raw)
      ensure(isDeepStrictEqual(row, raw))
      mediaIds.add(row.id)
      ensure(
        !db
          .prepare(
            "SELECT 1 FROM studio_media WHERE id=? AND (typeof(data) != 'blob' OR length(data) != bytes)",
          )
          .get(row.id),
      )
    }
    const imageExists = (image: string, historical = false) => {
      const id = uploadedMediaPath.exec(image)?.[1]
      ensure(
        id
          ? mediaIds.has(id)
          : /^\/images\/marketing\/[a-zA-Z0-9_-]+\.(webp|png|jpe?g|avif)$/.test(
              image,
            ) &&
              (historical || existsSync(join(process.cwd(), 'public', image))),
      )
    }
    const checkImages = (payload: ContentPayload, historical = false) =>
      contentImages(payload).forEach((image) => imageExists(image, historical))
    siteSettingImages(site.payload).forEach((image) => imageExists(image))
    templateImages(templates.values).forEach((image) => imageExists(image))
    const documents = new Map<string, z.infer<typeof documentSchema>>()
    const documentPayloads = new Map<
      string,
      { draft: ContentPayload; published: ContentPayload | null }
    >()
    const paths = new Map<string, string>()
    const seeded = new Set<string>()
    for (const raw of db
      .prepare(`SELECT ${backupColumns.studio_documents} FROM studio_documents`)
      .iterate()) {
      checkTime()
      const row = documentSchema.parse(raw)
      const draft = parsed(contentSchema, row.draft)
      ensure(draft.kind === row.kind && contentPath(draft) === row.path)
      checkImages(draft)
      ensure(
        !row.archived_at ||
          ((row.kind === 'industry' || row.kind === 'industryCategory') &&
            row.published === null &&
            row.published_path === null &&
            row.published_at === null),
      )
      ensure((row.published === null) === (row.published_path === null))
      ensure((row.published === null) === (row.published_at === null))
      let published: ContentPayload | null = null
      if (row.published !== null) {
        const live = parsed(contentSchema, row.published)
        published = live
        ensure(
          live.kind === row.kind && contentPath(live) === row.published_path,
        )
        checkImages(live)
        if (live.kind === 'industry')
          ensure(
            industryPublicationSchema.safeParse(live.data).success ||
              (live.data.review.status === 'legacy' &&
                live.data.proofItems.length === 0),
          )
      }
      for (const route of [row.path, row.published_path].filter(
        Boolean,
      ) as string[]) {
        ensure(
          !Object.keys(legacyServiceAliases).some(
            (slug) => route === `/dich-vu/${slug}`,
          ),
        )
        ensure(!paths.has(route) || paths.get(route) === row.id)
        paths.set(route, row.id)
      }
      documents.set(row.id, row)
      documentPayloads.set(row.id, { draft, published })
    }
    const categories = new Map<
      string,
      { row: z.infer<typeof documentSchema>; publishedSlug: string | null }
    >()
    for (const [id, payloads] of documentPayloads) {
      if (payloads.draft.kind !== 'industryCategory') continue
      const row = documents.get(id)!
      ensure(!categories.has(payloads.draft.data.slug))
      categories.set(payloads.draft.data.slug, {
        row,
        publishedSlug:
          payloads.published?.kind === 'industryCategory'
            ? payloads.published.data.slug
            : null,
      })
    }
    for (const [id, payloads] of documentPayloads) {
      if (payloads.draft.kind !== 'industry') continue
      const row = documents.get(id)!
      const category = categories.get(payloads.draft.data.categorySlug)
      ensure(category && (!category.row.archived_at || !!row.archived_at))
      ensure(payloads.draft.data.traits.every((slug) => traitSlugs.has(slug)))
      if (payloads.published?.kind === 'industry') {
        const publishedCategory = categories.get(
          payloads.published.data.categorySlug,
        )
        ensure(
          publishedCategory &&
            !publishedCategory.row.archived_at &&
            publishedCategory.publishedSlug ===
              payloads.published.data.categorySlug,
        )
        ensure(
          payloads.published.data.traits.every((slug) =>
            traitSlugs.has(slug),
          ),
        )
      }
    }
    for (const raw of db
      .prepare(`SELECT ${backupColumns.studio_revisions} FROM studio_revisions`)
      .iterate()) {
      checkTime()
      const row = revisionSchema.parse(raw)
      const doc = documents.get(row.document_id)
      ensure(doc && row.version <= doc.version)
      const payload = parsed(contentSchema, row.snapshot)
      ensure(payload.kind === doc!.kind)
      // Preserve legacy history; the content writer checks assets before restoring it.
      checkImages(payload, true)
      if (row.action === 'seeded' || row.action === 'industry-atlas-seeded') {
        const route = contentPath(payload)
        ensure(
          row.version === 1 &&
            seedPaths.get(route) === payload.kind,
        )
        ensure(!seeded.has(route))
        seeded.add(route)
      }
    }
    ensure(seeded.size === seedPaths.size)
    for (const raw of db.prepare('SELECT * FROM studio_seo_tasks').iterate()) {
      const row = z
        .object({ id: uuid, payload: z.string(), version, updated_at: stamp })
        .strict()
        .parse(raw)
      const payload = parsed(seoTaskSchema, row.payload)
      ensure(!payload.documentId || documents.has(payload.documentId))
    }
    for (const raw of db.prepare('SELECT * FROM studio_redirects').iterate()) {
      const row = z
        .object({
          id: uuid,
          source: z.string(),
          target_id: uuid,
          status: z.number(),
          version,
          updated_at: stamp,
        })
        .strict()
        .parse(raw)
      const redirect = redirectSchema.parse({
        source: row.source,
        targetId: row.target_id,
        status: row.status,
      })
      ensure(
        redirect.source === row.source &&
          !reservedRedirectPath.test(row.source),
      )
      ensure(
        !paths.has(row.source) &&
          !Object.keys(legacyServiceAliases).some(
            (slug) => row.source === `/dich-vu/${slug}`,
          ),
      )
      ensure(documents.get(row.target_id)?.published)
    }
    // Decode one bounded image at a time, without retaining the library's blobs in memory.
    for (const row of mediaRows as z.infer<typeof mediaSchema>[]) {
      checkTime()
      const { data } = db
        .prepare('SELECT data FROM studio_media WHERE id=?')
        .get(row.id) as { data: Buffer }
      const decoder = sharp(data, {
        failOn: 'warning',
        limitInputPixels: 5_760_000,
      }).timeout({ seconds: 5 })
      const metadata = await decoder.metadata()
      ensure(
        metadata.format === 'webp' &&
          (metadata.pages || 1) === 1 &&
          metadata.width === row.width &&
          metadata.height === row.height,
      )
      ensure(!metadata.exif && !metadata.icc && !metadata.xmp && !metadata.iptc)
      await decoder.raw().toBuffer()
    }
    return manifest
  } catch {
    throw invalidBackup()
  } finally {
    db?.close()
  }
}
