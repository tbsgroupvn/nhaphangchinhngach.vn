import { StudioError } from './errors'
import { uploadLimit } from './media-model'

export async function readUploadBytes(
  request: Request,
  limit = uploadLimit,
  timeoutMs = 15000,
) {
  if (!request.body)
    throw new StudioError(400, 'Chưa có dữ liệu ảnh.', 'UPLOAD_EMPTY')
  const reader = request.body.getReader()
  let timer: ReturnType<typeof setTimeout> | undefined
  const consume = async () => {
    const chunks: Uint8Array[] = []
    let size = 0
    while (true) {
      const { done, value } = await reader.read()
      if (done) return Buffer.concat(chunks)
      size += value.byteLength
      if (size > limit)
        throw new StudioError(413, 'Ảnh vượt giới hạn 8 MB.', 'UPLOAD_SIZE')
      chunks.push(value)
    }
  }
  try {
    return await Promise.race([
      consume(),
      new Promise<never>((_, reject) => {
        timer = setTimeout(
          () =>
            reject(
              new StudioError(
                408,
                'Tải ảnh quá thời gian cho phép. Vui lòng thử lại.',
                'UPLOAD_TIMEOUT',
              ),
            ),
          timeoutMs,
        )
      }),
    ])
  } finally {
    clearTimeout(timer)
    void reader.cancel().catch(() => undefined)
    reader.releaseLock()
  }
}
