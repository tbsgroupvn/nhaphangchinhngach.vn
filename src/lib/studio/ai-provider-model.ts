import { z } from 'zod'

export const aiConfigSchema = z
  .object({
    provider: z.literal('openai'),
    model: z
      .string()
      .trim()
      .min(1)
      .max(100)
      .regex(/^[a-zA-Z0-9][a-zA-Z0-9._-]*$/),
    maxOutputTokens: z.number().int().min(128).max(8192),
    dailyTokenBudget: z.number().int().min(4096).max(2000000),
    dailyRequestLimit: z.number().int().min(1).max(500),
  })
  .strict()
  .refine((value) => value.dailyTokenBudget >= value.maxOutputTokens + 2048, {
    message: 'Ngân sách ngày phải lớn hơn giới hạn đầu ra ít nhất 2.048 token.',
    path: ['dailyTokenBudget'],
  })
export const aiKeySchema = z
  .string()
  .min(16)
  .max(512)
  .regex(/^[\x21-\x7e]+$/)
export type AiConfig = z.infer<typeof aiConfigSchema>
export type AiUsage = {
  inputTokens: number
  outputTokens: number
  totalTokens: number
}
export type AiConnection = {
  status: 'untested' | 'running' | 'connected' | 'failed'
  testedAt?: string
  latencyMs?: number
  errorCode?: string
  usage?: AiUsage | null
}
export type AiProviderView = {
  version: number
  config: AiConfig | null
  hasKey: boolean
  encryptionReady: boolean
  credentialsReadable: boolean
  connection: AiConnection
  budget: { day: string; requests: number; tokens: number }
}

export const aiErrorMessages: Record<string, string> = {
  AI_PROVIDER_AUTH: 'Nhà cung cấp từ chối khóa hoặc quyền truy cập model.',
  AI_PROVIDER_LIMIT:
    'Nhà cung cấp báo hết hạn mức hoặc đang giới hạn lượt gọi.',
  AI_PROVIDER_REQUEST:
    'Nhà cung cấp không hỗ trợ cấu hình model hoặc yêu cầu này.',
  AI_PROVIDER_UNAVAILABLE: 'Chưa thể kết nối tới nhà cung cấp.',
  AI_TIMEOUT: 'Nhà cung cấp không trả lời trong thời gian cho phép.',
  AI_INVALID_OUTPUT: 'Phản hồi không đúng cấu trúc được yêu cầu.',
  AI_OUTPUT_INCOMPLETE: 'Nhà cung cấp chưa trả về kết quả hoàn chỉnh.',
  AI_REFUSED: 'Nhà cung cấp từ chối yêu cầu.',
  AI_RESPONSE_TOO_LARGE: 'Phản hồi vượt giới hạn dung lượng.',
  AI_INTERRUPTED: 'Phép thử đã bị gián đoạn. Cần thử lại.',
  AI_AUTH_CHANGED: 'Phiên đăng nhập hoặc quyền đã thay đổi trong lúc thử.',
  AI_CONFIG_CHANGED: 'Cấu hình AI đã thay đổi trong lúc tạo đề xuất.',
}
