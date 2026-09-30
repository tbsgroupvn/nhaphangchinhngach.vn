import { createCipheriv, createDecipheriv, randomBytes } from 'node:crypto'
import { StudioError } from './errors'

export type AiEnvelope = {
  version: 1
  nonce: string
  tag: string
  value: string
}
const aad = Buffer.from('tbs-studio:ai.provider.v1:openai')
export function aiEncryptionKey(value: string | undefined) {
  if (!value || !/^[A-Za-z0-9+/]{43}=$/.test(value)) return null
  const key = Buffer.from(value, 'base64')
  return key.length === 32 && key.toString('base64') === value ? key : null
}
export function encryptAiKey(value: string, key: Buffer | null): AiEnvelope {
  if (!key)
    throw new StudioError(
      503,
      'Máy chủ chưa cấu hình khóa mã hóa AI hợp lệ.',
      'AI_ENCRYPTION_UNAVAILABLE',
    )
  const nonce = randomBytes(12)
  const cipher = createCipheriv('aes-256-gcm', key, nonce)
  cipher.setAAD(aad)
  const encrypted = Buffer.concat([
    cipher.update(value, 'utf8'),
    cipher.final(),
  ])
  return {
    version: 1,
    nonce: nonce.toString('base64'),
    tag: cipher.getAuthTag().toString('base64'),
    value: encrypted.toString('base64'),
  }
}
export function decryptAiKey(value: AiEnvelope, key: Buffer | null) {
  try {
    if (!key || value.version !== 1) throw new Error('Unavailable')
    const nonce = Buffer.from(value.nonce, 'base64'),
      tag = Buffer.from(value.tag, 'base64')
    if (nonce.length !== 12 || tag.length !== 16)
      throw new Error('Invalid envelope')
    const decipher = createDecipheriv('aes-256-gcm', key, nonce)
    decipher.setAAD(aad)
    decipher.setAuthTag(tag)
    return Buffer.concat([
      decipher.update(Buffer.from(value.value, 'base64')),
      decipher.final(),
    ]).toString('utf8')
  } catch {
    throw new StudioError(
      503,
      'Máy chủ không đọc được khóa AI đã lưu. Kiểm tra khóa mã hóa hoặc nhập khóa API mới.',
      'AI_ENCRYPTION_UNAVAILABLE',
    )
  }
}
