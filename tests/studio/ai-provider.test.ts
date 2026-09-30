import { afterEach, beforeEach, test } from 'node:test'
import assert from 'node:assert/strict'
import { mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { basename, join, resolve, sep } from 'node:path'
import { StudioAuth } from '../../src/lib/studio/auth'
import { openStudioDatabase } from '../../src/lib/studio/database'
import { StudioAiProvider } from '../../src/lib/studio/ai-provider'
import { requestOpenAi } from '../../src/lib/studio/ai-transport'

const masterKey = Buffer.alloc(32, 29).toString('base64')
const apiKey = 'sk-fixture-not-a-real-provider-key-123456'
const config = {
  provider: 'openai',
  model: 'fixture-model',
  maxOutputTokens: 2048,
  dailyTokenBudget: 100000,
  dailyRequestLimit: 50,
}
let db: ReturnType<typeof openStudioDatabase>, auth: StudioAuth, token: string
beforeEach(async () => {
  db = openStudioDatabase(':memory:')
  auth = new StudioAuth(db)
  const bootstrap = 'ai-fixture-bootstrap-at-least-32-characters'
  await auth.setupOwner(
    {
      name: 'Owner',
      email: 'ai@example.test',
      password: 'Ai-test-password-738!',
    },
    bootstrap,
    bootstrap,
  )
  token = (await auth.login('ai@example.test', 'Ai-test-password-738!', null))
    .token
})
afterEach(() => db.close())
const success = async () => ({
  value: { ok: true },
  usage: { inputTokens: 20, outputTokens: 5, totalTokens: 25 },
})
const provider = (key = masterKey, transport = success) =>
  new StudioAiProvider(db, auth, { encryptionKey: () => key, transport })

test('provider keys are encrypted with authenticated randomized envelopes, never returned or audited', () => {
  const ai = provider()
  assert.equal(ai.get(token).hasKey, false)
  const saved = ai.save(token, 0, { ...config, apiKey })
  assert.equal(saved.version, 1)
  assert.equal(saved.hasKey, true)
  assert.equal(saved.credentialsReadable, true)
  const first = (
    db
      .prepare("SELECT value FROM studio_settings WHERE key='ai.provider.v1'")
      .get() as { value: string }
  ).value
  assert.ok(!first.includes(apiKey))
  assert.ok(!JSON.stringify(saved).includes(apiKey))
  ai.save(token, 1, { ...config, apiKey })
  const second = (
    db
      .prepare("SELECT value FROM studio_settings WHERE key='ai.provider.v1'")
      .get() as { value: string }
  ).value
  assert.notDeepEqual(
    JSON.parse(first).encryptedKey,
    JSON.parse(second).encryptedKey,
  )
  assert.ok(
    !JSON.stringify(db.prepare('SELECT * FROM studio_audit').all()).includes(
      apiKey,
    ),
  )
  assert.equal(provider().get(token).credentialsReadable, true)
  assert.equal(
    provider(Buffer.alloc(32, 7).toString('base64')).get(token)
      .credentialsReadable,
    false,
  )
  const tampered = JSON.parse(second)
  tampered.encryptedKey.value = Buffer.from('invalid').toString('base64')
  db.prepare(
    "UPDATE studio_settings SET value=? WHERE key='ai.provider.v1'",
  ).run(JSON.stringify(tampered))
  assert.equal(ai.get(token).credentialsReadable, false)
})

test('encrypted configuration, connection and budget survive a fresh database connection', async () => {
  const directory = mkdtempSync(join(tmpdir(), 'tbs-ai-provider-'))
  const path = join(directory, 'studio.sqlite')
  try {
    const ai = provider()
    ai.save(token, 0, { ...config, apiKey })
    await ai.testConnection(token, 1)
    await db.backup(path)
    const reopened = openStudioDatabase(path)
    try {
      const result = new StudioAiProvider(reopened, new StudioAuth(reopened), {
        encryptionKey: () => masterKey,
      }).get(token)
      assert.equal(result.credentialsReadable, true)
      assert.equal(result.connection.status, 'connected')
      assert.equal(result.budget.tokens, 25)
    } finally {
      reopened.close()
    }
  } finally {
    if (
      !resolve(directory).startsWith(resolve(tmpdir()) + sep) ||
      !basename(directory).startsWith('tbs-ai-provider-')
    )
      throw new Error('Unsafe fixture cleanup')
    rmSync(directory, { recursive: true, force: true })
  }
})

test('expired probes recover explicitly and audit failure rolls back saves and request reservations', async () => {
  const ai = provider()
  ai.save(token, 0, { ...config, apiKey })
  const now = Date.now()
  db.prepare('INSERT INTO studio_settings VALUES(?,?,?)').run(
    'ops.ai.connection',
    JSON.stringify({
      id: 'expired',
      configVersion: 1,
      status: 'running',
      expiresAt: now - 1,
      testedAt: new Date(now - 36000).toISOString(),
    }),
    new Date(now).toISOString(),
  )
  db.prepare('INSERT INTO studio_settings VALUES(?,?,?)').run(
    'ops.ai.request.lock',
    JSON.stringify({ id: 'expired', expiresAt: now - 1 }),
    new Date(now).toISOString(),
  )
  assert.equal(ai.get(token).connection.errorCode, 'AI_INTERRUPTED')
  assert.equal(
    (await ai.testConnection(token, 1)).connection.status,
    'connected',
  )
  db.exec(
    "CREATE TRIGGER ai_audit_abort BEFORE INSERT ON studio_audit BEGIN SELECT RAISE(ABORT, 'fixture'); END",
  )
  assert.throws(() => ai.save(token, 1, { ...config, model: 'changed' }))
  assert.equal(ai.get(token).config!.model, config.model)
  await assert.rejects(ai.testConnection(token, 1))
  assert.equal(ai.get(token).budget.requests, 1)
  assert.equal(ai.get(token).connection.status, 'connected')
  assert.equal(
    db
      .prepare(
        "SELECT value FROM studio_settings WHERE key='ops.ai.request.lock'",
      )
      .get(),
    undefined,
  )
})

test('missing master key, version conflicts, validation and clear never silently replace credentials', async () => {
  assert.throws(() => provider('').save(token, 0, { ...config, apiKey }), {
    code: 'AI_ENCRYPTION_UNAVAILABLE',
  })
  const ai = provider()
  assert.throws(() => ai.save(token, 0, config), { code: 'AI_KEY_REQUIRED' })
  ai.save(token, 0, { ...config, apiKey })
  assert.throws(() => ai.save(token, 0, config), { code: 'VERSION_CONFLICT' })
  assert.throws(() => ai.save(token, 1, { ...config, model: '../../evil' }))
  ai.save(token, 1, { ...config, model: 'next-model' })
  assert.equal(ai.get(token).hasKey, true)
  assert.equal(provider('').clear(token, 2).version, 3)
  assert.equal(ai.get(token).hasKey, false)
  assert.throws(() => ai.save(token, 0, { ...config, apiKey }), {
    code: 'VERSION_CONFLICT',
  })
  await assert.rejects(ai.testConnection(token, 3), {
    code: 'AI_NOT_CONFIGURED',
  })
})

test('connection test records usage, survives repository recreation and invalidates on configuration change', async () => {
  let calls = 0
  const ai = provider(masterKey, async (request?: unknown) => {
    calls++
    assert.ok(JSON.stringify(request).includes(apiKey))
    return success()
  })
  ai.save(token, 0, { ...config, apiKey })
  const result = await ai.testConnection(token, 1)
  assert.equal(calls, 1)
  assert.equal(result.connection.status, 'connected')
  assert.equal(result.connection.usage?.totalTokens, 25)
  assert.equal(result.budget.requests, 1)
  assert.equal(result.budget.tokens, 25)
  assert.equal(provider().get(token).connection.status, 'connected')
  ai.save(token, 1, { ...config, model: 'another-model' })
  assert.equal(ai.get(token).connection.status, 'untested')
})

test('failed or malformed probes remain failures with safe errors and conservative budget accounting', async () => {
  const ai = provider(masterKey, async () => {
    throw new Error(`leaked ${apiKey}`)
  })
  ai.save(token, 0, { ...config, apiKey })
  const result = await ai.testConnection(token, 1)
  assert.equal(result.connection.status, 'failed')
  assert.equal(result.connection.errorCode, 'AI_PROVIDER_UNAVAILABLE')
  assert.ok(result.budget.tokens > 25)
  assert.ok(!JSON.stringify(result).includes(apiKey))
  const malformed = provider(masterKey, async () => ({
    value: { ok: false },
    usage: { inputTokens: 20, outputTokens: 5, totalTokens: 25 },
  }))
  assert.equal(
    (await malformed.testConnection(token, 1)).connection.errorCode,
    'AI_INVALID_OUTPUT',
  )
})

test('concurrent tests, exhausted budgets and configuration changes cannot produce stale success', async () => {
  let release!: () => void
  const gate = new Promise<void>((resolve) => {
    release = resolve
  })
  const ai = provider(masterKey, async () => {
    await gate
    return success()
  })
  ai.save(token, 0, { ...config, apiKey, dailyRequestLimit: 1 })
  const pending = ai.testConnection(token, 1)
  assert.equal(ai.get(token).connection.status, 'running')
  await assert.rejects(ai.testConnection(token, 1), { code: 'AI_BUSY' })
  ai.save(token, 1, { ...config, apiKey, dailyRequestLimit: 1 })
  await assert.rejects(ai.testConnection(token, 2), { code: 'AI_BUSY' })
  release()
  await assert.rejects(pending, { code: 'VERSION_CONFLICT' })
  assert.equal(ai.get(token).connection.status, 'untested')
  await assert.rejects(ai.testConnection(token, 2), {
    code: 'AI_BUDGET_EXCEEDED',
  })
})

test('provider mutations require current admin authorization including after an asynchronous request', async () => {
  const owner = auth.session(token)!
  const editor = await auth.createUser(
    owner,
    {
      name: 'Editor',
      email: 'ai-editor@example.test',
      password: 'Ai-editor-password-738!',
      role: 'editor',
    },
    token,
  )
  const editorToken = (
    await auth.login(editor.email, 'Ai-editor-password-738!', null)
  ).token
  const ai = provider()
  assert.throws(() => ai.save(editorToken, 0, { ...config, apiKey }), {
    status: 403,
  })
  await assert.rejects(ai.testConnection(editorToken, 0), { status: 403 })
  ai.save(token, 0, { ...config, apiKey })
  assert.equal(ai.get(editorToken).hasKey, true)
  const revoked = provider(masterKey, async () => {
    auth.logout(token)
    return success()
  })
  await assert.rejects(revoked.testConnection(token, 1), { status: 401 })
  assert.notEqual(ai.get(editorToken).connection.status, 'connected')
})

test('token limits remain enforced through clear/reconfigure and accounting settles on the dispatch UTC day', async () => {
  let now = Date.parse('2026-09-26T23:59:59Z')
  const ai = new StudioAiProvider(db, auth, {
    encryptionKey: () => masterKey,
    now: () => now,
    transport: async () => {
      now += 2000
      return success()
    },
  })
  ai.save(token, 0, { ...config, apiKey })
  const result = await ai.testConnection(token, 1)
  assert.equal(result.budget.day, '2026-09-27')
  assert.equal(result.budget.requests, 0)
  const oldBudget = JSON.parse(
    (
      db
        .prepare(
          "SELECT value FROM studio_settings WHERE key='ops.ai.budget.2026-09-26'",
        )
        .get() as { value: string }
    ).value,
  )
  assert.equal(oldBudget.tokens, 25)
  assert.equal(oldBudget.requests, 1)
  db.prepare('INSERT INTO studio_settings VALUES(?,?,?)').run(
    'ops.ai.budget.2026-09-27',
    JSON.stringify({ day: '2026-09-27', requests: 0, tokens: 99999 }),
    new Date(now).toISOString(),
  )
  await assert.rejects(ai.testConnection(token, 1), {
    code: 'AI_BUDGET_EXCEEDED',
  })
  ai.clear(token, 1)
  ai.save(token, 2, { ...config, apiKey })
  await assert.rejects(ai.testConnection(token, 3), {
    code: 'AI_BUDGET_EXCEEDED',
  })
  assert.equal(ai.get(token).budget.tokens, 99999)
})

test('late expired completions cannot overwrite a replacement probe or refund uncertain usage', async () => {
  let now = Date.now(),
    calls = 0,
    release!: () => void
  const gate = new Promise<void>((resolve) => {
    release = resolve
  })
  const ai = new StudioAiProvider(db, auth, {
    encryptionKey: () => masterKey,
    now: () => now,
    transport: async () => {
      if (++calls === 1) await gate
      return success()
    },
  })
  ai.save(token, 0, { ...config, apiKey })
  const old = ai.testConnection(token, 1)
  const reserved = ai.get(token).budget.tokens
  now += 36000
  await ai.testConnection(token, 1)
  const current = ai.get(token)
  release()
  await assert.rejects(old, { code: 'AI_INTERRUPTED' })
  assert.deepEqual(ai.get(token).connection, current.connection)
  assert.equal(ai.get(token).budget.tokens, reserved + 25)
})

test('completion audit failure retains the running reservation and never reports a successful test', async () => {
  const ai = provider(masterKey, async () => {
    db.exec(
      "CREATE TRIGGER completion_abort BEFORE INSERT ON studio_audit BEGIN SELECT RAISE(ABORT, 'fixture'); END",
    )
    return success()
  })
  ai.save(token, 0, { ...config, apiKey })
  await assert.rejects(ai.testConnection(token, 1))
  assert.equal(ai.get(token).connection.status, 'running')
  assert.ok(ai.get(token).budget.tokens > 25)
  assert.ok(
    db
      .prepare(
        "SELECT value FROM studio_settings WHERE key='ops.ai.request.lock'",
      )
      .get(),
  )
})

const request = {
  apiKey,
  model: 'fixture-model',
  instructions: 'Return a connection probe.',
  input: 'Return ok=true.',
  maxOutputTokens: 128,
  schema: {
    type: 'object',
    properties: { ok: { type: 'boolean' } },
    required: ['ok'],
    additionalProperties: false,
  },
}
const responseBody = {
  status: 'completed',
  output: [
    {
      type: 'message',
      content: [{ type: 'output_text', text: '{"ok":true}' }],
    },
  ],
  usage: { input_tokens: 20, output_tokens: 5, total_tokens: 25 },
}

test('OpenAI adapter uses a fixed endpoint, strict schema, explicit limits and nonstored Responses', async () => {
  const result = await requestOpenAi(request, {
    fetch: async (url, init) => {
      assert.equal(url, 'https://api.openai.com/v1/responses')
      assert.equal(init?.redirect, 'error')
      assert.equal(
        new Headers(init?.headers).get('authorization'),
        `Bearer ${apiKey}`,
      )
      const body = JSON.parse(init?.body as string)
      assert.equal(body.store, false)
      assert.equal(body.max_output_tokens, 128)
      assert.equal(body.text.format.strict, true)
      assert.deepEqual(body.text.format.schema, request.schema)
      assert.equal(body.tools, undefined)
      assert.ok(!JSON.stringify(body).includes(apiKey))
      return Response.json(responseBody)
    },
  })
  assert.deepEqual(result.value, { ok: true })
  assert.equal(result.usage?.totalTokens, 25)
})

test('adapter rejects authorization, rate limit, refusals, truncation, invalid JSON, secret echoes and oversized bodies', async () => {
  const cases: [Response, string][] = [
    [new Response(apiKey, { status: 401 }), 'AI_PROVIDER_AUTH'],
    [new Response(apiKey, { status: 429 }), 'AI_PROVIDER_LIMIT'],
    [
      Response.json({ ...responseBody, status: 'incomplete' }),
      'AI_OUTPUT_INCOMPLETE',
    ],
    [
      Response.json({
        ...responseBody,
        output: [
          { type: 'message', content: [{ type: 'refusal', refusal: 'no' }] },
        ],
      }),
      'AI_REFUSED',
    ],
    [
      Response.json({
        ...responseBody,
        output: [
          {
            type: 'message',
            content: [{ type: 'output_text', text: 'not json' }],
          },
        ],
      }),
      'AI_INVALID_OUTPUT',
    ],
    [Response.json({ ...responseBody, secret: apiKey }), 'AI_INVALID_OUTPUT'],
    [new Response('x'.repeat(1048577)), 'AI_RESPONSE_TOO_LARGE'],
  ]
  for (const [response, code] of cases) {
    await assert.rejects(
      requestOpenAi(request, { fetch: async () => response }),
      (error: any) => error.code === code && !error.message.includes(apiKey),
    )
  }
})

test('adapter timeout covers stalled headers and response streams without exposing network errors', async () => {
  await assert.rejects(
    requestOpenAi(request, {
      timeoutMs: 15,
      fetch: () => new Promise(() => {}),
    }),
    { code: 'AI_TIMEOUT' },
  )
  await assert.rejects(
    requestOpenAi(request, {
      timeoutMs: 15,
      fetch: async () => new Response(new ReadableStream({ start() {} })),
    }),
    { code: 'AI_TIMEOUT' },
  )
  await assert.rejects(
    requestOpenAi(request, {
      fetch: async () => {
        throw new Error(apiKey)
      },
    }),
    { code: 'AI_PROVIDER_UNAVAILABLE' },
  )
})
