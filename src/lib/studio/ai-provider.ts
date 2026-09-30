import { randomUUID } from 'node:crypto'
import { z } from 'zod'
import { StudioAuth, requireCapability, type Capability } from './auth'
import { audit, type StudioDatabase } from './database'
import { StudioError } from './errors'
import {
  aiEncryptionKey,
  decryptAiKey,
  encryptAiKey,
  type AiEnvelope,
} from './ai-crypto'
import {
  aiConfigSchema,
  aiErrorMessages,
  aiKeySchema,
  type AiConfig,
  type AiConnection,
  type AiProviderView,
  type AiUsage,
} from './ai-provider-model'
import { requestOpenAi, type AiTransport, type AiRequest } from './ai-transport'

export type GenerationHooks = {
  id: string
  request: Pick<AiRequest, 'instructions' | 'input' | 'schema'>
  authorize: () => void
  start: (value: { model: string; expiresAt: number }) => void
  validate: (value: unknown) => unknown
  finish: (value: {
    result: unknown
    usage: AiUsage | null
    errorCode: string | null
    latencyMs: number
    finishedAt: string
  }) => void
}

const configKey = 'ai.provider.v1',
  connectionKey = 'ops.ai.connection',
  lockKey = 'ops.ai.request.lock'
type StoredConfig = {
  version: number
  config: AiConfig | null
  encryptedKey: AiEnvelope | null
}
type StoredConnection = AiConnection & {
  id: string
  configVersion: number
  expiresAt: number
}
type Budget = { day: string; requests: number; tokens: number }
const probe = {
  instructions:
    'This is a connectivity test. Return exactly the structured object with ok set to true. Do not include any other content.',
  input: 'Confirm connection: ok=true.',
  maxOutputTokens: 128,
  schema: {
    type: 'object',
    properties: { ok: { type: 'boolean' } },
    required: ['ok'],
    additionalProperties: false,
  },
}

export class StudioAiProvider {
  constructor(
    private db: StudioDatabase,
    private auth: StudioAuth,
    private options: {
      encryptionKey?: () => string | undefined
      transport?: AiTransport
      now?: () => number
    } = {},
  ) {}
  private now() {
    return this.options.now?.() ?? Date.now()
  }
  private key() {
    return aiEncryptionKey(
      this.options.encryptionKey
        ? this.options.encryptionKey()
        : process.env.STUDIO_AI_ENCRYPTION_KEY,
    )
  }
  private read<T>(key: string, fallback: T): T {
    const row = this.db
      .prepare('SELECT value FROM studio_settings WHERE key=?')
      .get(key) as { value: string } | undefined
    return row ? JSON.parse(row.value) : fallback
  }
  private write(key: string, value: unknown) {
    this.db
      .prepare(
        'INSERT INTO studio_settings(key,value,updated_at) VALUES(?,?,?) ON CONFLICT(key) DO UPDATE SET value=excluded.value,updated_at=excluded.updated_at',
      )
      .run(key, JSON.stringify(value), new Date(this.now()).toISOString())
  }
  private authorize(token: string, capability: Capability) {
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
  private stored() {
    return this.read<StoredConfig>(configKey, {
      version: 0,
      config: null,
      encryptedKey: null,
    })
  }
  private checkVersion(expected: number, value: StoredConfig) {
    if (!Number.isSafeInteger(expected) || expected !== value.version)
      throw new StudioError(
        409,
        'Cấu hình AI đã thay đổi. Đối chiếu bản mới trước khi tiếp tục.',
        'VERSION_CONFLICT',
      )
  }
  private budget(day = new Date(this.now()).toISOString().slice(0, 10)) {
    return this.read<Budget>(`ops.ai.budget.${day}`, {
      day,
      requests: 0,
      tokens: 0,
    })
  }
  private view(): AiProviderView {
    const stored = this.stored(),
      key = this.key()
    let credentialsReadable = false
    if (stored.encryptedKey) {
      try {
        aiKeySchema.parse(decryptAiKey(stored.encryptedKey, key))
        credentialsReadable = true
      } catch {}
    }
    const saved = this.read<StoredConnection | null>(connectionKey, null)
    let connection: AiConnection = { status: 'untested' }
    if (saved?.configVersion === stored.version) {
      connection = {
        status: saved.status,
        testedAt: saved.testedAt,
        errorCode: saved.errorCode,
        latencyMs: saved.latencyMs,
        usage: saved.usage,
      }
      if (connection.status === 'running' && saved.expiresAt <= this.now())
        connection = {
          status: 'failed',
          testedAt: saved.testedAt,
          errorCode: 'AI_INTERRUPTED',
        }
      if (connection.status === 'connected' && !credentialsReadable)
        connection = { status: 'untested' }
    }
    return {
      version: stored.version,
      config: stored.config,
      hasKey: !!stored.encryptedKey,
      encryptionReady: !!key,
      credentialsReadable,
      connection,
      budget: this.budget(),
    }
  }
  get(token: string) {
    this.authorize(token, 'ai.use')
    return this.view()
  }
  save(token: string, expected: number, input: unknown) {
    return this.db
      .transaction(() => {
        const user = this.authorize(token, 'settings.write'),
          stored = this.stored()
        this.checkVersion(expected, stored)
        const parsed = z
          .object({
            provider: z.unknown(),
            model: z.unknown(),
            maxOutputTokens: z.unknown(),
            dailyTokenBudget: z.unknown(),
            dailyRequestLimit: z.unknown(),
            apiKey: aiKeySchema.optional(),
          })
          .strict()
          .parse(input)
        const { apiKey, ...fields } = parsed,
          config = aiConfigSchema.parse(fields)
        if (!stored.encryptedKey && !apiKey)
          throw new StudioError(
            400,
            'Cần nhập khóa API để cấu hình nhà cung cấp.',
            'AI_KEY_REQUIRED',
          )
        const encryptedKey = apiKey
          ? encryptAiKey(apiKey, this.key())
          : stored.encryptedKey
        if (!apiKey) decryptAiKey(encryptedKey!, this.key())
        this.write(configKey, { version: expected + 1, config, encryptedKey })
        audit(this.db, user.id, 'ai.provider.saved', configKey, {
          version: expected + 1,
          provider: config.provider,
          model: config.model,
          keyReplaced: !!apiKey,
        })
        return this.view()
      })
      .immediate()
  }
  clear(token: string, expected: number) {
    return this.db
      .transaction(() => {
        const user = this.authorize(token, 'settings.write')
        this.checkVersion(expected, this.stored())
        this.write(configKey, {
          version: expected + 1,
          config: null,
          encryptedKey: null,
        })
        audit(this.db, user.id, 'ai.provider.cleared', configKey, {
          version: expected + 1,
        })
        return this.view()
      })
      .immediate()
  }
  testConnection(token: string, expected: number) {
    return this.request(token, expected)
  }
  generate(token: string, expected: number, job: GenerationHooks) {
    return this.request(token, expected, job)
  }
  private async request(
    token: string,
    expected: number,
    job?: GenerationHooks,
  ): Promise<AiProviderView> {
    const reservation = this.db
      .transaction(() => {
        const user = this.authorize(token, job ? 'ai.use' : 'settings.write'),
          stored = this.stored()
        job?.authorize()
        this.checkVersion(expected, stored)
        if (!stored.config || !stored.encryptedKey)
          throw new StudioError(
            409,
            'AI chưa được cấu hình.',
            'AI_NOT_CONFIGURED',
          )
        const apiKey = aiKeySchema.parse(
          decryptAiKey(stored.encryptedKey, this.key()),
        )
        const lock = this.read<{ id: string; expiresAt: number } | null>(
          lockKey,
          null,
        )
        if (lock && lock.expiresAt > this.now())
          throw new StudioError(
            409,
            'Một yêu cầu AI đang chạy. Vui lòng chờ kết quả.',
            'AI_BUSY',
          )
        const budget = this.budget()
        const request = job
          ? { ...job.request, maxOutputTokens: stored.config.maxOutputTokens }
          : probe
        if (Buffer.byteLength(JSON.stringify(request)) + 1024 > 65536)
          throw new StudioError(
            400,
            'Ngữ cảnh quá lớn. Chọn ít trường hoặc từng đoạn nhỏ hơn.',
            'AI_CONTEXT_TOO_LARGE',
          )
        // UTF-8 byte count plus protocol allowance deliberately over-reserves input tokens.
        const reservedTokens =
          Buffer.byteLength(JSON.stringify(request)) +
          1024 +
          request.maxOutputTokens
        if (
          budget.requests >= stored.config.dailyRequestLimit ||
          budget.tokens + reservedTokens > stored.config.dailyTokenBudget
        )
          throw new StudioError(
            429,
            'Đã chạm ngân sách AI của ngày UTC hiện tại.',
            'AI_BUDGET_EXCEEDED',
          )
        const id = randomUUID(),
          expiresAt = this.now() + 35000,
          startedAt = this.now()
        this.write(`ops.ai.budget.${budget.day}`, {
          ...budget,
          requests: budget.requests + 1,
          tokens: budget.tokens + reservedTokens,
        })
        this.write(lockKey, { id, expiresAt })
        if (job) job.start({ model: stored.config.model, expiresAt })
        else
          this.write(connectionKey, {
            id,
            expiresAt,
            configVersion: expected,
            status: 'running',
            testedAt: new Date(startedAt).toISOString(),
          })
        audit(
          this.db,
          user.id,
          job ? 'ai.generation.started' : 'ai.connection.started',
          job?.id || id,
          {
            provider: stored.config.provider,
            model: stored.config.model,
            configVersion: expected,
          },
        )
        return {
          id,
          expiresAt,
          startedAt,
          apiKey,
          config: stored.config,
          day: budget.day,
          reservedTokens,
          request,
        }
      })
      .immediate()
    let errorCode: string | undefined,
      usage: AiUsage | null = null
    let output: unknown = null
    try {
      const result = await (this.options.transport || requestOpenAi)({
        ...reservation.request,
        model: reservation.config.model,
        apiKey: reservation.apiKey,
      })
      usage = result.usage
      if (job) {
        try {
          output = job.validate(result.value)
        } catch {
          errorCode = 'AI_INVALID_OUTPUT'
        }
      } else if (
        !z
          .object({ ok: z.literal(true) })
          .strict()
          .safeParse(result.value).success
      )
        errorCode = 'AI_INVALID_OUTPUT'
    } catch (error) {
      errorCode =
        error instanceof StudioError &&
        Object.prototype.hasOwnProperty.call(aiErrorMessages, error.code)
          ? error.code
          : 'AI_PROVIDER_UNAVAILABLE'
    }
    let authorizationError: unknown
    const result = this.db
      .transaction(() => {
        const lock = this.read<{ id: string; expiresAt: number } | null>(
          lockKey,
          null,
        )
        if (lock?.id !== reservation.id || lock.expiresAt <= this.now())
          throw new StudioError(
            409,
            'Phép thử đã hết hạn. Tải lại trạng thái trước khi thử tiếp.',
            'AI_INTERRUPTED',
          )
        this.db.prepare('DELETE FROM studio_settings WHERE key=?').run(lockKey)
        const budget = this.budget(reservation.day)
        this.write(`ops.ai.budget.${budget.day}`, {
          ...budget,
          tokens:
            budget.tokens -
            reservation.reservedTokens +
            (usage?.totalTokens ?? reservation.reservedTokens),
        })
        let user
        try {
          user = this.authorize(token, job ? 'ai.use' : 'settings.write')
          job?.authorize()
        } catch (error) {
          authorizationError = error
          errorCode = 'AI_AUTH_CHANGED'
        }
        const connection: StoredConnection = {
          id: reservation.id,
          expiresAt: reservation.expiresAt,
          configVersion: expected,
          status: errorCode ? 'failed' : 'connected',
          errorCode,
          usage,
          latencyMs: Math.max(0, this.now() - reservation.startedAt),
          testedAt: new Date(this.now()).toISOString(),
        }
        if (job) {
          if (this.stored().version !== expected)
            errorCode = 'AI_CONFIG_CHANGED'
          job.finish({
            result: errorCode ? null : output,
            errorCode: errorCode || null,
            usage,
            latencyMs: connection.latencyMs!,
            finishedAt: connection.testedAt!,
          })
        } else this.write(connectionKey, connection)
        audit(
          this.db,
          user?.id ?? null,
          job ? 'ai.generation.finished' : 'ai.connection.finished',
          job?.id || reservation.id,
          {
            configVersion: expected,
            status: job
              ? errorCode
                ? 'failed'
                : 'completed'
              : connection.status,
            errorCode,
            usage,
          },
        )
        return this.view()
      })
      .immediate()
    if (authorizationError) throw authorizationError
    if (!job) this.checkVersion(expected, this.stored())
    return result
  }
}
