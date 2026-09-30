import { createHash, randomUUID } from 'node:crypto'
import { z } from 'zod'
import { StudioAuth, requireCapability, type Capability } from './auth'
import { audit, type StudioDatabase } from './database'
import { StudioError } from './errors'
import { rememberVersion } from './version-floor'
import {
  aiInstructionsKey,
  aiInstructionsSchema,
  defaultAiInstructions,
  knowledgeBoundary,
  knowledgePayloadSchema,
  normalizeKnowledgeText,
  type AiInstructionsDocument,
  type KnowledgeContext,
  type KnowledgeDocument,
  type KnowledgePayload,
  type KnowledgeSummary,
} from './ai-knowledge-model'

export const knowledgeRowSchema = z
  .object({
    id: z.string().uuid(),
    draft: z.string(),
    approved: z.string().nullable(),
    approved_version: z.number().int().positive().max(1000000000).nullable(),
    version: z.number().int().positive().max(1000000000),
    archived: z.union([z.literal(0), z.literal(1)]),
    created_at: z.string().datetime(),
    updated_at: z.string().datetime(),
    approved_at: z.string().datetime().nullable(),
    approved_by: z.string().uuid().nullable(),
  })
  .strict()
  .refine((row) =>
    row.approved === null
      ? row.approved_version === null &&
        row.approved_at === null &&
        row.approved_by === null
      : row.approved_version !== null &&
        row.approved_at !== null &&
        row.approved_version <= row.version,
  )
type KnowledgeRow = z.infer<typeof knowledgeRowSchema>
export function readAiInstructions(db: StudioDatabase): AiInstructionsDocument {
  const row = db
    .prepare('SELECT value FROM studio_settings WHERE key=?')
    .get(aiInstructionsKey) as { value: string } | undefined
  if (!row) return { version: 0, values: { ...defaultAiInstructions } }
  return z
    .object({
      version: z.number().int().nonnegative().max(1000000000),
      values: aiInstructionsSchema,
    })
    .strict()
    .parse(JSON.parse(row.value))
}
const expired = (payload: KnowledgePayload, today: string) =>
  !!payload.reviewDue && payload.reviewDue < today
function document(row: KnowledgeRow, today: string): KnowledgeDocument {
  const draft = knowledgePayloadSchema.parse(JSON.parse(row.draft)),
    approved = row.approved
      ? knowledgePayloadSchema.parse(JSON.parse(row.approved))
      : null
  return {
    id: row.id,
    version: row.version,
    draft,
    approved,
    approvedVersion: row.approved_version,
    approvedAt: row.approved_at,
    approvedBy: row.approved_by,
    archived: !!row.archived,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    status: row.archived
      ? 'archived'
      : !approved
        ? 'draft'
        : expired(approved, today)
          ? 'expired'
          : JSON.stringify(approved) === JSON.stringify(draft)
            ? 'approved'
            : 'changes',
  }
}
const stopWords = new Set([
  'cua',
  'cho',
  'cac',
  'voi',
  'trong',
  'nhung',
  'mot',
  'den',
  'tai',
  'khi',
  'theo',
  'tbs',
  'group',
  'can',
  'duoc',
  'hay',
  'la',
  'va',
])
const terms = (value: string) =>
  new Set(
    normalizeKnowledgeText(value)
      .split(/[^a-z0-9]+/)
      .filter((word) => word.length > 2 && !stopWords.has(word)),
  )
const score = (value: string, query: Set<string>) =>
  Array.from(terms(value)).filter((word) => query.has(word)).length
const excerpt = (value: string, query: Set<string>) => {
  const paragraphs = value
    .split(/\n+/)
    .map((part, index) => ({ part, index, score: score(part, query) }))
    .sort((a, b) => b.score - a.score || a.index - b.index)
  const selected = paragraphs[0]?.part || value
  // Match original tokens so collapsed whitespace and decomposed accents cannot shift offsets.
  const match = Array.from(
    selected.matchAll(new RegExp('[\\p{L}\\p{M}\\p{N}]+', 'gu')),
  ).find((token) => Array.from(terms(token[0])).some((term) => query.has(term)))
  let start = Math.max(0, (match?.index || 0) - 240)
  if (start > 0 && /[\uDC00-\uDFFF]/.test(selected[start])) start--
  return new TextDecoder().decode(
    Buffer.from(selected.slice(start)).subarray(0, 2800),
    { stream: true },
  )
}
export class StudioKnowledge {
  constructor(
    private db: StudioDatabase,
    private auth: StudioAuth,
    private now: () => Date = () => new Date(),
  ) {}
  private authorize(token: string, capability: Capability = 'ai.use') {
    const user = this.auth.session(token)
    if (!user)
      throw new StudioError(
        401,
        'Phiên đăng nhập không còn hợp lệ.',
        'UNAUTHENTICATED',
      )
    requireCapability(user, capability)
    return user
  }
  private row(id: string) {
    z.string().uuid().parse(id)
    const row = this.db
      .prepare('SELECT * FROM studio_knowledge WHERE id=?')
      .get(id) as KnowledgeRow | undefined
    if (!row)
      throw new StudioError(404, 'Nguồn kiến thức không tồn tại.', 'NOT_FOUND')
    return row
  }
  private version(expected: number, actual: number) {
    if (!Number.isSafeInteger(expected) || expected !== actual)
      throw new StudioError(
        409,
        'Dữ liệu đã thay đổi. Đối chiếu bản mới trước khi tiếp tục.',
        'VERSION_CONFLICT',
      )
    if (actual >= 1000000000)
      throw new StudioError(
        409,
        'Đã đạt giới hạn phiên bản.',
        'VERSION_CAPACITY',
      )
  }
  get(token: string, id: string) {
    this.authorize(token)
    return document(this.row(id), this.now().toISOString().slice(0, 10))
  }
  list(token: string): KnowledgeSummary[] {
    this.authorize(token)
    return (
      this.db
        .prepare('SELECT * FROM studio_knowledge ORDER BY updated_at DESC,id')
        .all() as KnowledgeRow[]
    ).map((row) => {
      const item = document(row, this.now().toISOString().slice(0, 10))
      return {
        id: item.id,
        version: item.version,
        status: item.status,
        updatedAt: item.updatedAt,
        title: item.draft.title,
        category: item.draft.category,
        sourceName: item.draft.sourceName,
        tags: item.draft.tags,
      }
    })
  }
  save(token: string, id: string | null, expected: number, input: unknown) {
    const payload = knowledgePayloadSchema.parse(input),
      serialized = JSON.stringify(payload)
    return this.db
      .transaction(() => {
        const user = this.authorize(token),
          current = id ? this.row(id) : null
        this.version(expected, current?.version || 0)
        if (current?.archived)
          throw new StudioError(
            409,
            'Khôi phục nguồn đã lưu trữ trước khi sửa.',
            'KNOWLEDGE_ARCHIVED',
          )
        const totals = this.db
          .prepare(
            'SELECT count(*) count,coalesce(sum(length(CAST(draft AS BLOB))+coalesce(length(CAST(approved AS BLOB)),0)),0) bytes FROM studio_knowledge',
          )
          .get() as { count: number; bytes: number }
        if (
          (!id && totals.count >= 500) ||
          totals.bytes -
            (current ? Buffer.byteLength(current.draft) : 0) +
            Buffer.byteLength(serialized) >
            16777216
        )
          throw new StudioError(
            409,
            'Kho kiến thức đạt giới hạn 500 nguồn hoặc 16 MiB.',
            'KNOWLEDGE_CAPACITY',
          )
        const target = id || randomUUID(),
          now = this.now().toISOString()
        if (id)
          this.db
            .prepare(
              'UPDATE studio_knowledge SET draft=?,version=?,updated_at=? WHERE id=?',
            )
            .run(serialized, expected + 1, now, id)
        else
          this.db
            .prepare(
              'INSERT INTO studio_knowledge(id,draft,approved,approved_version,version,archived,created_at,updated_at,approved_at,approved_by) VALUES(?,?,NULL,NULL,1,0,?,?,NULL,NULL)',
            )
            .run(target, serialized, now, now)
        audit(
          this.db,
          user.id,
          id ? 'ai.knowledge.saved' : 'ai.knowledge.created',
          target,
          { version: expected + 1 },
        )
        return this.get(token, target)
      })
      .immediate()
  }
  review(
    token: string,
    id: string,
    expected: number,
    action: 'approve' | 'withdraw' | 'archive' | 'reactivate',
  ) {
    z.enum(['approve', 'withdraw', 'archive', 'reactivate']).parse(action)
    return this.db
      .transaction(() => {
        const user = this.authorize(token, 'settings.write'),
          row = this.row(id),
          now = this.now().toISOString()
        this.version(expected, row.version)
        if (action === 'approve') {
          if (row.archived)
            throw new StudioError(
              409,
              'Khôi phục nguồn trước khi duyệt.',
              'KNOWLEDGE_ARCHIVED',
            )
          if (
            expired(
              knowledgePayloadSchema.parse(JSON.parse(row.draft)),
              now.slice(0, 10),
            )
          )
            throw new StudioError(
              409,
              'Nguồn đã quá hạn rà soát. Cập nhật tài liệu và hạn trước khi duyệt.',
              'KNOWLEDGE_EXPIRED',
            )
          const total = (
            this.db
              .prepare(
                'SELECT coalesce(sum(length(CAST(draft AS BLOB))+coalesce(length(CAST(approved AS BLOB)),0)),0) n FROM studio_knowledge',
              )
              .get() as { n: number }
          ).n
          if (
            total -
              Buffer.byteLength(row.approved || '') +
              Buffer.byteLength(row.draft) >
            16777216
          )
            throw new StudioError(
              409,
              'Kho kiến thức vượt 16 MiB.',
              'KNOWLEDGE_CAPACITY',
            )
          this.db
            .prepare(
              'UPDATE studio_knowledge SET approved=draft,approved_version=?,approved_at=?,approved_by=? WHERE id=?',
            )
            .run(expected + 1, now, user.id, id)
        } else if (action === 'withdraw')
          this.db
            .prepare(
              'UPDATE studio_knowledge SET approved=NULL,approved_version=NULL,approved_at=NULL,approved_by=NULL WHERE id=?',
            )
            .run(id)
        else
          this.db
            .prepare('UPDATE studio_knowledge SET archived=? WHERE id=?')
            .run(action === 'archive' ? 1 : 0, id)
        this.db
          .prepare(
            'UPDATE studio_knowledge SET version=?,updated_at=? WHERE id=?',
          )
          .run(expected + 1, now, id)
        audit(this.db, user.id, `ai.knowledge.${action}`, id, {
          version: expected + 1,
        })
        return this.get(token, id)
      })
      .immediate()
  }
  remove(token: string, id: string, expected: number) {
    this.db
      .transaction(() => {
        const user = this.authorize(token, 'settings.write'),
          row = this.row(id)
        this.version(expected, row.version)
        if (row.approved && !row.archived)
          throw new StudioError(
            409,
            'Rút duyệt hoặc lưu trữ nguồn trước khi xóa.',
            'KNOWLEDGE_IN_USE',
          )
        rememberVersion(this.db, row.version)
        this.db.prepare('DELETE FROM studio_knowledge WHERE id=?').run(id)
        audit(this.db, user.id, 'ai.knowledge.deleted', id, {
          version: row.version,
        })
      })
      .immediate()
  }
  instructions(token: string) {
    this.authorize(token)
    return readAiInstructions(this.db)
  }
  saveInstructions(token: string, expected: number, input: unknown) {
    const values = aiInstructionsSchema.parse(input)
    return this.db
      .transaction(() => {
        const user = this.authorize(token, 'settings.write')
        this.version(expected, readAiInstructions(this.db).version)
        this.db
          .prepare(
            'INSERT INTO studio_settings VALUES(?,?,?) ON CONFLICT(key) DO UPDATE SET value=excluded.value,updated_at=excluded.updated_at',
          )
          .run(
            aiInstructionsKey,
            JSON.stringify({ version: expected + 1, values }),
            this.now().toISOString(),
          )
        audit(this.db, user.id, 'ai.instructions.saved', aiInstructionsKey, {
          version: expected + 1,
        })
        return readAiInstructions(this.db)
      })
      .immediate()
  }
  context(token: string, query: string): KnowledgeContext {
    this.authorize(token)
    z.string().trim().min(2).max(4000).parse(query)
    const queryTerms = terms(query),
      today = this.now().toISOString().slice(0, 10)
    const ranked = (
      this.db
        .prepare(
          'SELECT * FROM studio_knowledge WHERE archived=0 AND approved IS NOT NULL',
        )
        .all() as KnowledgeRow[]
    )
      .map((row) => {
        const payload = knowledgePayloadSchema.parse(JSON.parse(row.approved!))
        return {
          row,
          payload,
          score:
            3 *
              score(`${payload.title} ${payload.tags.join(' ')}`, queryTerms) +
            score(payload.body, queryTerms),
        }
      })
      .filter(
        (item) =>
          !expired(item.payload, today) &&
          (item.score > 0 || item.payload.category === 'company'),
      )
      .sort((a, b) => b.score - a.score || a.row.id.localeCompare(b.row.id))
    const sources: KnowledgeContext['sources'] = []
    let bytes = 2
    for (const { row, payload } of ranked) {
      const item = {
        id: row.id,
        version: row.approved_version!,
        title: payload.title,
        category: payload.category,
        sourceName: payload.sourceName,
        sourceUrl: payload.sourceUrl,
        reviewDue: payload.reviewDue,
        approvedAt: row.approved_at!,
        digest: createHash('sha256').update(row.approved!).digest('hex'),
        excerpt: excerpt(payload.body, queryTerms),
      }
      const size = Buffer.byteLength(JSON.stringify(item)) + 1
      if (bytes + size > 20000) continue
      sources.push(item)
      bytes += size
      if (sources.length === 6) break
    }
    return {
      policy: readAiInstructions(this.db),
      boundary: knowledgeBoundary,
      sources,
    }
  }
}
