import { beforeEach, afterEach, test } from 'node:test'
import assert from 'node:assert/strict'
import { randomUUID } from 'node:crypto'
import { mkdtempSync, readFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve, sep, basename } from 'node:path'
import { StudioBackups } from '../../src/lib/studio/backups'
import { StudioError } from '../../src/lib/studio/errors'
import { openStudioDatabase } from '../../src/lib/studio/database'
import { StudioAuth } from '../../src/lib/studio/auth'
import { StudioContent } from '../../src/lib/studio/content'
import { StudioKnowledge } from '../../src/lib/studio/ai-knowledge'
import { StudioAiProvider } from '../../src/lib/studio/ai-provider'
import { StudioGenerations } from '../../src/lib/studio/ai-generation'
import type { AiRequest, AiTransport } from '../../src/lib/studio/ai-transport'
import { aiFields } from '../../src/lib/studio/ai-generation-model'
import Database from 'better-sqlite3'

let db: ReturnType<typeof openStudioDatabase>,
  auth: StudioAuth,
  content: StudioContent,
  knowledge: StudioKnowledge,
  provider: StudioAiProvider,
  generations: StudioGenerations,
  token: string,
  calls: AiRequest[],
  transport: AiTransport
const config = {
  provider: 'openai',
  model: 'test-model',
  maxOutputTokens: 4096,
  dailyTokenBudget: 1000000,
  dailyRequestLimit: 100,
  apiKey: 'sk-fixture-generation-never-real',
}
const result = (
  field = 'title',
  value: unknown = 'Bản đề xuất đã được kiểm tra',
) => ({
  summary: 'Đề xuất biên tập để người phụ trách xem xét.',
  notes: ['Cần đối chiếu thông tin thực tế trước khi xuất bản.'],
  outline: [],
  changes: [{ field, value, sourceIds: [], reason: 'Làm rõ chủ đề.' }],
  links: [],
})
beforeEach(async () => {
  db = openStudioDatabase(':memory:')
  auth = new StudioAuth(db)
  const secret = 'generation-bootstrap-at-least-32-characters'
  await auth.setupOwner(
    {
      name: 'Owner',
      email: 'generation@example.test',
      password: 'Generation-fixture-password-728!',
    },
    secret,
    secret,
  )
  token = (
    await auth.login(
      'generation@example.test',
      'Generation-fixture-password-728!',
      null,
    )
  ).token
  content = new StudioContent(db, auth)
  content.seedMarketing()
  knowledge = new StudioKnowledge(db, auth)
  calls = []
  transport = async (request) => ({
    value: result(),
    usage: { inputTokens: 20, outputTokens: 10, totalTokens: 30 },
  })
  provider = new StudioAiProvider(db, auth, {
    encryptionKey: () => Buffer.alloc(32, 9).toString('base64'),
    transport: async (request) => {
      calls.push(request)
      return transport(request)
    },
  })
  provider.save(token, 0, config)
  generations = new StudioGenerations(db, auth, content, provider, knowledge)
})
afterEach(() => db.close())
function request(task = 'rewrite', fields = ['title']) {
  const doc = content.get(
    content.list().find((item) => item.kind === 'article')!.id,
  )
  return {
    id: randomUUID(),
    documentId: doc.id,
    documentVersion: doc.version,
    providerVersion: provider.get(token).version,
    task,
    fields,
    prompt: 'Viết rõ ràng, đúng thông tin đã được cung cấp.',
    consent: true,
  }
}
test('generation records real context and usage without changing draft or publication until selected apply', async () => {
  const input = request(),
    before = content.get(input.documentId)
  const job = await generations.generate(token, input)
  assert.equal(job.status, 'completed')
  assert.equal(calls.length, 1)
  assert.equal(job.usage!.totalTokens, 30)
  assert.equal(job.context.title, before.draft.data.title)
  assert.deepEqual(content.get(input.documentId), before)
  const applied = generations.apply(token, job.id, {
    version: job.version,
    documentVersion: before.version,
    fields: ['title'],
    consent: true,
  })
  assert.equal(
    applied.document.draft.data.title,
    'Bản đề xuất đã được kiểm tra',
  )
  assert.deepEqual(applied.document.published, before.published)
  assert.deepEqual(generations.get(token, job.id).appliedFields, ['title'])
  assert.equal(provider.get(token).budget.requests, 1)
})
test('same generation ID never dispatches twice and changed input cannot reuse it', async () => {
  const input = request(),
    first = await generations.generate(token, input)
  assert.equal((await generations.generate(token, input)).id, first.id)
  assert.equal(calls.length, 1)
  await assert.rejects(
    generations.generate(token, {
      ...input,
      prompt: 'A different generation request entirely.',
    }),
    { code: 'IDEMPOTENCY_CONFLICT' },
  )
})

test('deleted generation history cannot reuse a paid request ID', async () => {
  const input = request(),
    job = await generations.generate(token, input)
  generations.remove(token, job.id, job.version)
  await assert.rejects(generations.generate(token, input), {
    code: 'AI_REQUEST_RETIRED',
  })
  assert.equal(calls.length, 1)
  assert.equal(provider.get(token).budget.requests, 1)
})

test('each provider dispatch owns a fresh lease even if a caller reuses its logical job ID', async () => {
  let now = Date.now()
  const releases: (() => void)[] = [],
    finished: string[] = []
  const isolated = new StudioAiProvider(db, auth, {
    now: () => now,
    encryptionKey: () => Buffer.alloc(32, 9).toString('base64'),
    transport: async () => {
      await new Promise<void>((resolve) => releases.push(resolve))
      return {
        value: result(),
        usage: { inputTokens: 20, outputTokens: 10, totalTokens: 30 },
      }
    },
  })
  const id = randomUUID(),
    hooks = (label: string) => ({
      id,
      request: { instructions: 'Test only.', input: 'Test only.', schema: {} },
      authorize: () => {},
      start: () => {},
      validate: (value: unknown) => value,
      finish: () => {
        finished.push(label)
      },
    })
  const first = isolated.generate(token, 1, hooks('old')),
    rejected = assert.rejects(first, { code: 'AI_INTERRUPTED' })
  now += 36000
  const second = isolated.generate(token, 1, hooks('new'))
  releases[0]()
  await rejected
  assert.deepEqual(finished, [])
  releases[1]()
  await second
  assert.deepEqual(finished, ['new'])
  assert.equal(isolated.get(token).budget.requests, 2)
  assert.ok(isolated.get(token).budget.tokens > 30)
})

test('reordering equal article paragraphs invalidates their original positional proposal', async () => {
  const input = request('rewrite', ['section:0:body:0']),
    original = content.get(input.documentId)
  if (original.draft.kind !== 'article') throw new Error('Expected article')
  const saved = content.save(token, original.id, original.version, {
    ...original.draft,
    data: {
      ...original.draft.data,
      sections: [
        { heading: 'Alpha', body: ['Identical placeholder.'] },
        { heading: 'Beta', body: ['Identical placeholder.'] },
      ],
    },
  })
  transport = async () => ({
    value: result('section:0:body:0', 'This proposal belongs to Alpha.'),
    usage: null,
  })
  const job = await generations.generate(token, {
    ...input,
    documentVersion: saved.version,
  })
  if (saved.draft.kind !== 'article') throw new Error('Expected article')
  const reordered = content.save(token, saved.id, saved.version, {
    ...saved.draft,
    data: {
      ...saved.draft.data,
      sections: [...saved.draft.data.sections].reverse(),
    },
  })
  assert.throws(
    () =>
      generations.apply(token, job.id, {
        version: job.version,
        documentVersion: reordered.version,
        fields: input.fields,
        consent: true,
      }),
    { code: 'AI_FIELD_CHANGED' },
  )
  assert.deepEqual(content.get(saved.id), reordered)
})

test('partial indexed applications accept their own earlier changes but reject external collection edits', async () => {
  const input = request('rewrite', ['section:0:heading', 'section:0:body:0'])
  transport = async () => ({
    value: {
      ...result(),
      changes: [
        result(input.fields[0], 'Revised heading').changes[0],
        result(input.fields[1], 'Revised paragraph.').changes[0],
      ],
    },
    usage: null,
  })
  const job = await generations.generate(token, input)
  const first = generations.apply(token, job.id, {
    version: job.version,
    documentVersion: job.documentVersion,
    fields: [input.fields[0]],
    consent: true,
  })
  const second = generations.apply(token, job.id, {
    version: first.generation.version,
    documentVersion: first.document.version,
    fields: [input.fields[1]],
    consent: true,
  })
  assert.deepEqual(second.generation.appliedFields, input.fields)
  const next = await generations.generate(
    token,
    request('rewrite', input.fields),
  )
  const before = content.get(input.documentId)
  if (before.draft.kind !== 'article') throw new Error('Expected article')
  const remote = content.save(token, before.id, before.version, {
    ...before.draft,
    data: {
      ...before.draft.data,
      sections: [
        ...before.draft.data.sections,
        {
          heading: 'Another editor added this',
          body: ['Independent new section.'],
        },
      ],
    },
  })
  assert.throws(
    () =>
      generations.apply(token, next.id, {
        version: next.version,
        documentVersion: remote.version,
        fields: [input.fields[1]],
        consent: true,
      }),
    { code: 'AI_FIELD_CHANGED' },
  )
})

test('generation context, selected application and request receipts survive a fresh database connection', async () => {
  const dir = mkdtempSync(join(tmpdir(), 'tbs-generation-'))
  let reopened: ReturnType<typeof openStudioDatabase> | undefined
  try {
    const input = request(),
      job = await generations.generate(token, input)
    const applied = generations.apply(token, job.id, {
      version: job.version,
      documentVersion: job.documentVersion,
      fields: ['title'],
      consent: true,
    })
    const file = join(dir, 'studio.sqlite')
    await db.backup(file)
    reopened = openStudioDatabase(file)
    const nextAuth = new StudioAuth(reopened),
      nextContent = new StudioContent(reopened, nextAuth),
      nextKnowledge = new StudioKnowledge(reopened, nextAuth)
    nextContent.seedMarketing()
    const nextProvider = new StudioAiProvider(reopened, nextAuth, {
      encryptionKey: () => Buffer.alloc(32, 9).toString('base64'),
      transport: async () => {
        throw new Error('Reopen must not call provider')
      },
    })
    const nextGenerations = new StudioGenerations(
      reopened,
      nextAuth,
      nextContent,
      nextProvider,
      nextKnowledge,
    )
    assert.deepEqual(nextGenerations.get(token, job.id), applied.generation)
    assert.deepEqual(nextContent.get(job.documentId), applied.document)
    assert.equal(nextProvider.get(token).budget.requests, 1)
    nextGenerations.remove(token, job.id, applied.generation.version)
    await assert.rejects(nextGenerations.generate(token, input), {
      code: 'AI_REQUEST_RETIRED',
    })
  } finally {
    reopened?.close()
    if (
      !resolve(dir).startsWith(resolve(tmpdir()) + sep) ||
      !basename(dir).startsWith('tbs-generation-')
    )
      throw new Error('Unsafe cleanup')
    rmSync(dir, { recursive: true, force: true })
  }
})

test('selective applications preserve unrelated edits and are atomic with their audit and history', async () => {
  transport = async () => ({
    value: {
      ...result(),
      changes: [
        result().changes[0],
        result('summary', 'Proposed summary only.').changes[0],
      ],
    },
    usage: null,
  })
  const input = request('rewrite', ['title', 'summary']),
    job = await generations.generate(token, input)
  const first = generations.apply(token, job.id, {
    version: job.version,
    documentVersion: input.documentVersion,
    fields: ['title'],
    consent: true,
  })
  const unrelated = content.save(
    token,
    first.document.id,
    first.document.version,
    {
      ...first.document.draft,
      seo: {
        ...first.document.draft.seo,
        description: 'Edited independently after generation.',
      },
    },
  )
  const beforeRevisions = content.revisions(unrelated.id)
  db.exec(
    "CREATE TRIGGER reject_ai_apply BEFORE INSERT ON studio_audit WHEN NEW.action='ai.generation.applied' BEGIN SELECT RAISE(ABORT,'audit unavailable'); END",
  )
  const apply = () =>
    generations.apply(token, job.id, {
      version: first.generation.version,
      documentVersion: unrelated.version,
      fields: ['summary'],
      consent: true,
    })
  assert.throws(apply, /audit unavailable/)
  assert.deepEqual(content.get(unrelated.id), unrelated)
  assert.deepEqual(content.revisions(unrelated.id), beforeRevisions)
  assert.deepEqual(generations.get(token, job.id), first.generation)
  db.exec('DROP TRIGGER reject_ai_apply')
  const second = apply()
  assert.equal(second.document.draft.data.summary, 'Proposed summary only.')
  assert.equal(
    second.document.draft.seo.description,
    unrelated.draft.seo.description,
  )
  assert.deepEqual(second.document.published, unrelated.published)
  assert.deepEqual(second.generation.appliedFields, ['title', 'summary'])
  assert.throws(apply, { code: 'VERSION_CONFLICT' })
})

test('typed proposals support fixed copy, article paragraphs, collections and FAQs without changing sibling fields', async () => {
  for (const [kind, key, value] of [
    ['article', 'section:0:body:0', 'Updated first paragraph only.'],
    ['service', 'inputs:0', 'Updated first input only.'],
    [
      'industry',
      'details',
      ['First proposed detail.', 'Second proposed detail.'],
    ],
    [
      'service',
      'faqs',
      [{ q: 'What is verified?', a: 'Only the supplied source.' }],
    ],
    ['page', null, 'Updated fixed copy field.'],
  ] as const) {
    const doc = content.get(
      content.list().find((item) => item.kind === kind)!.id,
    )
    const field =
      key ||
      aiFields(doc.draft).find((item) => item.key.startsWith('field:'))!.key
    transport = async () => ({ value: result(field, value), usage: null })
    const job = await generations.generate(token, {
      ...request(),
      documentId: doc.id,
      documentVersion: doc.version,
      fields: [field],
    })
    assert.equal(job.status, 'completed', `${kind}:${field}`)
    const applied = generations.apply(token, job.id, {
      version: job.version,
      documentVersion: doc.version,
      fields: [field],
      consent: true,
    })
    assert.deepEqual(
      aiFields(applied.document.draft).find((item) => item.key === field)!
        .value,
      value,
    )
    assert.deepEqual(applied.document.draft.seo, doc.draft.seo)
    assert.deepEqual(applied.document.published, doc.published)
  }
  const input = request('rewrite', ['sections', 'section:0:body:0']),
    before = calls.length
  await assert.rejects(generations.generate(token, input), {
    code: 'AI_FIELDS',
  })
  for (const key of ['__proto__', 'constructor', 'seo.noindex', 'image'])
    await assert.rejects(
      generations.generate(token, { ...request(), fields: [key] }),
      { code: 'AI_FIELDS' },
    )
  assert.equal(calls.length, before)
})

test('new writing instructions invalidate old proposals without losing the stored source snapshot', async () => {
  const job = await generations.generate(token, request()),
    instructions = knowledge.instructions(token)
  knowledge.saveInstructions(token, instructions.version, {
    ...instructions.values,
    tone: 'Use a different reviewed company tone.',
  })
  assert.throws(
    () =>
      generations.apply(token, job.id, {
        version: job.version,
        documentVersion: job.documentVersion,
        fields: ['title'],
        consent: true,
      }),
    { code: 'AI_SOURCE_CHANGED' },
  )
  assert.deepEqual(
    generations.get(token, job.id).context.knowledge.policy,
    instructions,
  )
})
test('approved provenance is immutable in history and withdrawn sources prevent applying old proposals', async () => {
  const source = knowledge.save(token, null, 0, {
    title: 'TBS editorial source',
    category: 'company',
    sourceName: 'TBS fixture',
    sourceUrl: 'https://example.test/source',
    body: 'Only use statements explicitly supplied by the company and verified by a human.',
    tags: [],
    reviewDue: '',
  })
  const approved = knowledge.review(token, source.id, source.version, 'approve')
  transport = async () => ({
    value: {
      ...result(),
      changes: [{ ...result().changes[0], sourceIds: [source.id] }],
    },
    usage: null,
  })
  const input = request(),
    job = await generations.generate(token, input)
  assert.equal(
    job.context.knowledge.sources[0].version,
    approved.approvedVersion,
  )
  assert.equal(
    job.context.knowledge.sources[0].sourceUrl,
    'https://example.test/source',
  )
  knowledge.review(token, source.id, approved.version, 'withdraw')
  assert.equal(
    generations.get(token, job.id).context.knowledge.sources.length,
    1,
  )
  assert.throws(
    () =>
      generations.apply(token, job.id, {
        version: job.version,
        documentVersion: input.documentVersion,
        fields: ['title'],
        consent: true,
      }),
    { code: 'AI_SOURCE_CHANGED' },
  )
})
test('invalid fields, invented provenance and incomplete output remain failed jobs with no draft mutation', async () => {
  for (const value of [
    result('slug', 'unsafe-slug'),
    { ...result(), publish: true },
    {
      ...result(),
      changes: [{ ...result().changes[0], sourceIds: [randomUUID()] }],
    },
  ]) {
    transport = async () => ({ value, usage: null })
    const input = request(),
      before = content.get(input.documentId)
    const job = await generations.generate(token, input)
    assert.equal(job.status, 'failed')
    assert.equal(job.errorCode, 'AI_INVALID_OUTPUT')
    assert.equal(job.result, null)
    assert.deepEqual(content.get(input.documentId), before)
  }
})
test('all seven contextual task types have a genuine structured result and only editing tasks can propose patches', async () => {
  for (const task of [
    'brief',
    'outline',
    'draft',
    'rewrite',
    'seo',
    'faq',
    'links',
  ]) {
    const input = request(task, task === 'seo' ? ['seo.title'] : ['title'])
    transport = async () => ({
      value: ['brief', 'outline', 'links'].includes(task)
        ? { ...result(), changes: [], outline: ['Chuẩn bị nội dung'] }
        : result(input.fields[0]),
      usage: null,
    })
    const job = await generations.generate(token, input)
    assert.equal(job.status, 'completed', task)
    assert.equal(job.task, task)
  }
})

test('AI history survives portable restore as non-applicable historical evidence', async () => {
  const dir = mkdtempSync(join(tmpdir(), 'tbs-generation-'))
  try {
    const job = await generations.generate(token, request()),
      backups = new StudioBackups(db, auth, dir)
    const exported = await backups.export(token)
    assert.equal(exported.summary.generations, 1)
    const archive = new Database(backups.file(token, exported.id).path, {
      readonly: true,
    })
    assert.deepEqual(
      archive
        .prepare("SELECT key FROM studio_settings WHERE key GLOB 'ops.ai.*'")
        .all(),
      [],
    )
    archive.close()
    const bytes = readFileSync(backups.file(token, exported.id).path)
    const staged = await backups.stage(
      token,
      new ReadableStream({
        start(controller) {
          controller.enqueue(bytes)
          controller.close()
        },
      }),
    )
    await backups.restore(
      token,
      staged.id,
      staged.fingerprint,
      'KHOI PHUC WEBSITE',
    )
    const recovered = generations.get(token, job.id)
    assert.equal(recovered.restored, true)
    assert.equal(recovered.actorId, null)
    assert.deepEqual(recovered.context, job.context)
    assert.deepEqual(recovered.result, job.result)
    assert.ok(recovered.version > job.version)
    assert.ok(
      db
        .prepare('SELECT 1 FROM studio_settings WHERE key=?')
        .get('ops.ai.generation.receipt.' + job.id),
    )
    assert.throws(
      () =>
        generations.apply(token, job.id, {
          version: recovered.version,
          documentVersion: content.get(job.documentId).version,
          fields: ['title'],
          consent: true,
        }),
      { code: 'AI_NOT_APPLICABLE' },
    )
  } finally {
    if (
      !resolve(dir).startsWith(resolve(tmpdir()) + sep) ||
      !basename(dir).startsWith('tbs-generation-')
    )
      throw new Error('Unsafe cleanup')
    rmSync(dir, { recursive: true, force: true })
  }
})

test('restoring a running generation interrupts its history and rejects the late response without reusing its receipt', async () => {
  const dir = mkdtempSync(join(tmpdir(), 'tbs-generation-'))
  let release!: () => void
  try {
    transport = async () => {
      await new Promise<void>((resolve) => {
        release = resolve
      })
      return { value: result(), usage: null }
    }
    const input = request(),
      pending = generations.generate(token, input),
      backups = new StudioBackups(db, auth, dir)
    const exported = await backups.export(token),
      bytes = readFileSync(backups.file(token, exported.id).path)
    const staged = await backups.stage(
      token,
      new ReadableStream({
        start(controller) {
          controller.enqueue(bytes)
          controller.close()
        },
      }),
    )
    await backups.restore(
      token,
      staged.id,
      staged.fingerprint,
      'KHOI PHUC WEBSITE',
    )
    const recovered = generations.get(token, input.id)
    assert.equal(recovered.restored, true)
    assert.equal(recovered.status, 'failed')
    assert.equal(recovered.errorCode, 'AI_INTERRUPTED')
    const rejected = assert.rejects(pending, { code: 'AI_INTERRUPTED' })
    release()
    await rejected
    assert.deepEqual(generations.get(token, input.id), recovered)
    generations.remove(token, recovered.id, recovered.version)
    await assert.rejects(generations.generate(token, input), {
      code: 'AI_REQUEST_RETIRED',
    })
    assert.equal(calls.length, 1)
  } finally {
    release?.()
    if (
      !resolve(dir).startsWith(resolve(tmpdir()) + sep) ||
      !basename(dir).startsWith('tbs-generation-')
    )
      throw new Error('Unsafe cleanup')
    rmSync(dir, { recursive: true, force: true })
  }
})

test('portable archives reject fabricated generation references and inconsistent history states', async () => {
  const dir = mkdtempSync(join(tmpdir(), 'tbs-generation-'))
  try {
    const job = await generations.generate(token, request()),
      backups = new StudioBackups(db, auth, dir),
      exported = await backups.export(token)
    const file = backups.file(token, exported.id).path,
      archive = new Database(file)
    try {
      const row = archive
        .prepare('SELECT payload FROM studio_ai_generations WHERE id=?')
        .get(job.id) as { payload: string }
      const original = JSON.parse(row.payload)
      for (const patch of [
        {
          result: {
            ...original.result,
            changes: [result('slug', 'unsafe').changes[0]],
          },
        },
        {
          result: {
            ...original.result,
            changes: [
              { ...original.result.changes[0], sourceIds: [randomUUID()] },
            ],
          },
        },
        { status: 'running' },
        { appliedFields: ['slug'] },
      ]) {
        archive
          .prepare('UPDATE studio_ai_generations SET payload=? WHERE id=?')
          .run(JSON.stringify({ ...original, ...patch }), job.id)
        const bytes = readFileSync(file)
        await assert.rejects(
          backups.stage(
            token,
            new ReadableStream({
              start(controller) {
                controller.enqueue(bytes)
                controller.close()
              },
            }),
          ),
        )
      }
    } finally {
      archive.close()
    }
  } finally {
    if (
      !resolve(dir).startsWith(resolve(tmpdir()) + sep) ||
      !basename(dir).startsWith('tbs-generation-')
    )
      throw new Error('Unsafe cleanup')
    rmSync(dir, { recursive: true, force: true })
  }
})
test('generation uses shared request lease and revocation during transport records failure without applying', async () => {
  let release!: () => void
  transport = async () => {
    await new Promise<void>((resolve) => {
      release = resolve
    })
    return { value: result(), usage: null }
  }
  const input = request(),
    pending = generations.generate(token, input)
  assert.equal(generations.get(token, input.id).status, 'running')
  await assert.rejects(provider.testConnection(token, 1), { code: 'AI_BUSY' })
  await assert.rejects(generations.generate(token, request()), {
    code: 'AI_BUSY',
  })
  auth.logout(token)
  release()
  await assert.rejects(pending, { code: 'UNAUTHENTICATED' })
  token = (
    await auth.login(
      'generation@example.test',
      'Generation-fixture-password-728!',
      null,
    )
  ).token
  assert.equal(generations.get(token, input.id).errorCode, 'AI_AUTH_CHANGED')
})
test('AI output failures retain honest history and budgets while forged consent and changed fields cannot save', async () => {
  const input = request(),
    before = content.get(input.documentId)
  await assert.rejects(
    generations.generate(token, { ...input, consent: false }),
  )
  assert.equal(calls.length, 0)
  transport = async () => {
    throw new StudioError(502, 'private upstream detail', 'AI_TIMEOUT')
  }
  const failed = await generations.generate(token, input)
  assert.equal(failed.status, 'failed')
  assert.equal(failed.errorCode, 'AI_TIMEOUT')
  assert.ok(provider.get(token).budget.tokens > 1000)
  transport = async () => ({ value: result(), usage: null })
  const job = await generations.generate(token, request())
  const changed = content.save(token, before.id, before.version, {
    ...before.draft,
    data: { ...before.draft.data, title: 'Title changed independently' },
  })
  assert.throws(
    () =>
      generations.apply(token, job.id, {
        version: job.version,
        documentVersion: before.version,
        fields: ['title'],
        consent: true,
      }),
    { code: 'VERSION_CONFLICT' },
  )
  assert.throws(
    () =>
      generations.apply(token, job.id, {
        version: job.version,
        documentVersion: changed.version,
        fields: ['title'],
        consent: true,
      }),
    { code: 'AI_FIELD_CHANGED' },
  )
  assert.equal(
    content.get(before.id).draft.data.title,
    'Title changed independently',
  )
})

test('oversized selected context and full history refuse dispatch without reserving another paid request', async () => {
  const input = request('rewrite', ['sections']),
    doc = content.get(input.documentId)
  if (doc.draft.kind !== 'article') throw new Error('Expected article')
  const large = content.save(token, doc.id, doc.version, {
    ...doc.draft,
    data: {
      ...doc.draft.data,
      sections: [
        {
          heading: 'Large section',
          body: ['a'.repeat(14000), 'b'.repeat(14000)],
        },
      ],
    },
  })
  await assert.rejects(
    generations.generate(token, { ...input, documentVersion: large.version }),
    { code: 'AI_CONTEXT_TOO_LARGE' },
  )
  assert.equal(calls.length, 0)
  assert.equal(provider.get(token).budget.requests, 0)
  const job = await generations.generate(token, request())
  db.transaction(() => {
    const copy = db.prepare(
      'INSERT INTO studio_ai_generations SELECT ?,document_id,version,payload,created_at,updated_at FROM studio_ai_generations WHERE id=?',
    )
    for (let index = 1; index < 500; index++) copy.run(randomUUID(), job.id)
  })()
  await assert.rejects(generations.generate(token, request()), {
    code: 'AI_HISTORY_CAPACITY',
  })
  assert.equal(calls.length, 1)
  assert.equal(provider.get(token).budget.requests, 1)
  generations.remove(token, job.id, job.version)
  assert.equal(
    (await generations.generate(token, request())).status,
    'completed',
  )
})

test('configuration changes during a generation discard its result while accounting for actual provider usage', async () => {
  let release!: () => void
  transport = async () => {
    await new Promise<void>((resolve) => {
      release = resolve
    })
    return {
      value: result(),
      usage: { inputTokens: 20, outputTokens: 10, totalTokens: 30 },
    }
  }
  const input = request(),
    before = content.get(input.documentId),
    pending = generations.generate(token, input)
  provider.save(token, provider.get(token).version, {
    ...config,
    model: 'changed-model',
  })
  release()
  const failed = await pending
  assert.equal(failed.status, 'failed')
  assert.equal(failed.errorCode, 'AI_CONFIG_CHANGED')
  assert.equal(failed.result, null)
  assert.equal(provider.get(token).budget.tokens, 30)
  assert.deepEqual(content.get(input.documentId), before)
})

test('source expiry after generation prevents applying the old proposal', async () => {
  let now = Date.now()
  knowledge = new StudioKnowledge(db, auth, () => new Date(now))
  generations = new StudioGenerations(
    db,
    auth,
    content,
    provider,
    knowledge,
    () => now,
  )
  const source = knowledge.save(token, null, 0, {
    title: 'Company review deadline',
    category: 'company',
    sourceName: 'TBS fixture',
    sourceUrl: '',
    body: 'Only verified company information may support this proposal.',
    tags: [],
    reviewDue: new Date(now).toISOString().slice(0, 10),
  })
  knowledge.review(token, source.id, source.version, 'approve')
  const job = await generations.generate(token, request())
  assert.equal(job.context.knowledge.sources.length, 1)
  now += 86400000
  assert.throws(
    () =>
      generations.apply(token, job.id, {
        version: job.version,
        documentVersion: job.documentVersion,
        fields: ['title'],
        consent: true,
      }),
    { code: 'AI_SOURCE_CHANGED' },
  )
})
test('SEO generation and application cannot escalate into body editing and viewers have no AI access', async () => {
  const bodyJob = await generations.generate(token, request()),
    userId = auth.session(token)!.id
  db.prepare("UPDATE studio_users SET role='seo' WHERE id=?").run(userId)
  await assert.rejects(generations.generate(token, request()), {
    code: 'FORBIDDEN',
  })
  assert.throws(
    () =>
      generations.apply(token, bodyJob.id, {
        version: bodyJob.version,
        documentVersion: bodyJob.documentVersion,
        fields: ['title'],
        consent: true,
      }),
    { code: 'FORBIDDEN' },
  )
  transport = async () => ({
    value: result('seo.title', 'New SEO proposal'),
    usage: null,
  })
  const input = request('seo', ['seo.title']),
    before = content.get(input.documentId),
    seoJob = await generations.generate(token, input)
  const applied = generations.apply(token, seoJob.id, {
    version: seoJob.version,
    documentVersion: before.version,
    fields: ['seo.title'],
    consent: true,
  })
  assert.deepEqual(applied.document.draft.data, before.draft.data)
  assert.equal(applied.document.draft.seo.title, 'New SEO proposal')
  db.prepare("UPDATE studio_users SET role='viewer' WHERE id=?").run(userId)
  assert.throws(() => generations.list(token), { code: 'FORBIDDEN' })
  await assert.rejects(generations.generate(token, input), {
    code: 'FORBIDDEN',
  })
})
