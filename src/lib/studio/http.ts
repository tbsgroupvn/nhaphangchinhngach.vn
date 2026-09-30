import { StudioError } from './errors'

export function assertSameOrigin(request: Request) {
  const origin = request.headers.get('origin')
  const expected = process.env.STUDIO_ORIGIN || new URL(request.url).origin
  if (!origin || origin === 'null' || origin !== new URL(expected).origin)
    throw new StudioError(403, 'Nguồn yêu cầu không hợp lệ.', 'INVALID_ORIGIN')
}

export async function readJson(
  request: Request,
  maximumBytes = 1024 * 1024,
): Promise<unknown> {
  if (
    !request.headers
      .get('content-type')
      ?.toLowerCase()
      .startsWith('application/json')
  )
    throw new StudioError(415, 'Yêu cầu cần sử dụng JSON.', 'CONTENT_TYPE')
  if (!request.body)
    throw new StudioError(400, 'Nội dung JSON không hợp lệ.', 'INVALID_JSON')
  const reader = request.body.getReader()
  const chunks: Uint8Array[] = []
  let size = 0
  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      size += value.byteLength
      if (size > maximumBytes) {
        await reader.cancel()
        throw new StudioError(
          413,
          'Nội dung yêu cầu quá lớn.',
          'BODY_TOO_LARGE',
        )
      }
      chunks.push(value)
    }
  } finally {
    reader.releaseLock()
  }
  try {
    return JSON.parse(Buffer.concat(chunks).toString('utf8'))
  } catch {
    throw new StudioError(400, 'Nội dung JSON không hợp lệ.', 'INVALID_JSON')
  }
}
