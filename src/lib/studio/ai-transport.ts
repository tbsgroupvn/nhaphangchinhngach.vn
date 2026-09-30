import { z } from 'zod'
import { aiErrorMessages, aiKeySchema, type AiUsage } from './ai-provider-model'
import { StudioError } from './errors'

export type AiRequest = {
  apiKey: string
  model: string
  instructions: string
  input: string
  maxOutputTokens: number
  schema: Record<string, unknown>
}
export type AiResponse = { value: unknown; usage: AiUsage | null }
export type AiTransport = (request: AiRequest) => Promise<AiResponse>
const usageSchema = z
  .object({
    input_tokens: z.number().int().nonnegative().max(2000000),
    output_tokens: z.number().int().nonnegative().max(2000000),
    total_tokens: z.number().int().nonnegative().max(4000000),
  })
  .refine(
    (value) => value.total_tokens === value.input_tokens + value.output_tokens,
  )
const responseSchema = z.object({
  status: z.string(),
  output: z
    .array(
      z.object({
        type: z.string(),
        content: z
          .array(z.object({ type: z.string(), text: z.string().optional() }))
          .optional(),
      }),
    )
    .max(100),
  usage: z.unknown().optional(),
})
const fail = (code: string) => new StudioError(502, aiErrorMessages[code], code)

export async function requestOpenAi(
  request: AiRequest,
  options: { fetch?: typeof fetch; timeoutMs?: number } = {},
): Promise<AiResponse> {
  const abort = new AbortController()
  let timer: ReturnType<typeof setTimeout> | undefined
  const work = async () => {
    aiKeySchema.parse(request.apiKey)
    if (
      !/^[a-zA-Z0-9][a-zA-Z0-9._-]{0,99}$/.test(request.model) ||
      !Number.isInteger(request.maxOutputTokens) ||
      request.maxOutputTokens < 128 ||
      request.maxOutputTokens > 8192
    )
      throw fail('AI_PROVIDER_REQUEST')
    const body = JSON.stringify({
      model: request.model,
      instructions: request.instructions,
      input: request.input,
      max_output_tokens: request.maxOutputTokens,
      store: false,
      text: {
        format: {
          type: 'json_schema',
          name: 'studio_result',
          strict: true,
          schema: request.schema,
        },
      },
    })
    if (Buffer.byteLength(body) > 65536) throw fail('AI_PROVIDER_REQUEST')
    const response = await (options.fetch || fetch)(
      'https://api.openai.com/v1/responses',
      {
        method: 'POST',
        redirect: 'error',
        signal: abort.signal,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${request.apiKey}`,
        },
        body,
      },
    )
    if (!response.ok) {
      void response.body?.cancel().catch(() => {})
      throw fail(
        response.status === 401 || response.status === 403
          ? 'AI_PROVIDER_AUTH'
          : response.status === 429
            ? 'AI_PROVIDER_LIMIT'
            : response.status >= 400 && response.status < 500
              ? 'AI_PROVIDER_REQUEST'
              : 'AI_PROVIDER_UNAVAILABLE',
      )
    }
    if (!response.body) throw fail('AI_INVALID_OUTPUT')
    const reader = response.body.getReader(),
      chunks: Uint8Array[] = []
    let bytes = 0
    try {
      for (;;) {
        const part = await reader.read()
        if (part.done) break
        bytes += part.value.byteLength
        if (bytes > 1048576) throw fail('AI_RESPONSE_TOO_LARGE')
        chunks.push(part.value)
      }
    } finally {
      void reader.cancel().catch(() => {})
      reader.releaseLock()
    }
    const raw = Buffer.concat(chunks).toString('utf8')
    if (raw.includes(request.apiKey)) throw fail('AI_INVALID_OUTPUT')
    let parsed: z.infer<typeof responseSchema>
    try {
      parsed = responseSchema.parse(JSON.parse(raw))
    } catch {
      throw fail('AI_INVALID_OUTPUT')
    }
    if (parsed.status !== 'completed') throw fail('AI_OUTPUT_INCOMPLETE')
    const content = parsed.output
      .filter((item) => item.type === 'message')
      .flatMap((item) => item.content || [])
    if (content.some((item) => item.type === 'refusal'))
      throw fail('AI_REFUSED')
    const text = content
      .filter((item) => item.type === 'output_text')
      .map((item) => item.text || '')
      .join('')
    let value: unknown
    try {
      value = JSON.parse(text)
    } catch {
      throw fail('AI_INVALID_OUTPUT')
    }
    const usage = usageSchema.safeParse(parsed.usage)
    return {
      value,
      usage: usage.success
        ? {
            inputTokens: usage.data.input_tokens,
            outputTokens: usage.data.output_tokens,
            totalTokens: usage.data.total_tokens,
          }
        : null,
    }
  }
  try {
    return await Promise.race([
      work(),
      new Promise<never>((_, reject) => {
        timer = setTimeout(() => {
          abort.abort()
          reject(fail('AI_TIMEOUT'))
        }, options.timeoutMs ?? 20000)
      }),
    ])
  } catch (error) {
    if (error instanceof StudioError) throw error
    throw fail(abort.signal.aborted ? 'AI_TIMEOUT' : 'AI_PROVIDER_UNAVAILABLE')
  } finally {
    clearTimeout(timer)
    abort.abort()
  }
}
