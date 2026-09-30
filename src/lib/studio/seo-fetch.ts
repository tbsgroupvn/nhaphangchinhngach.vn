import { StudioError } from './errors'

export async function fetchAuditHtml(
  origin: string,
  path: string,
  timeoutMs = 8000,
) {
  let base: URL
  try {
    base = new URL(origin)
  } catch {
    throw new StudioError(
      503,
      'Cần cấu hình STUDIO_ORIGIN để quét HTML.',
      'AUDIT_ORIGIN',
    )
  }
  if (
    !['http:', 'https:'].includes(base.protocol) ||
    base.username ||
    base.password ||
    base.search ||
    base.hash ||
    base.pathname !== '/'
  )
    throw new StudioError(
      503,
      'STUDIO_ORIGIN cần là origin của website.',
      'AUDIT_ORIGIN',
    )
  if (
    !/^\/(?:[a-z0-9]+(?:-[a-z0-9]+)*(?:\/[a-z0-9]+(?:-[a-z0-9]+)*)*)?$/.test(
      path,
    ) ||
    /^\/(?:admin|api|studio-preview)(?:\/|$)/.test(path)
  )
    throw new StudioError(400, 'URL quét không hợp lệ.', 'AUDIT_PATH')
  const response = await fetch(new URL(path === '/' ? '/' : `${path}/`, base), {
    redirect: 'manual',
    cache: 'no-store',
    headers: { Accept: 'text/html' },
    signal: AbortSignal.timeout(timeoutMs),
  })
  if (response.status !== 200) {
    await response.body?.cancel()
    throw new StudioError(
      502,
      `Trang trả về HTTP ${response.status}.`,
      'AUDIT_HTTP',
    )
  }
  if (
    !response.headers
      .get('content-type')
      ?.toLowerCase()
      .includes('text/html') ||
    !response.body
  ) {
    await response.body?.cancel()
    throw new StudioError(502, 'Trang không trả về HTML.', 'AUDIT_HTML')
  }
  const reader = response.body.getReader(),
    chunks: Uint8Array[] = []
  let bytes = 0
  try {
    while (true) {
      const chunk = await reader.read()
      if (chunk.done) break
      bytes += chunk.value.byteLength
      if (bytes > 2 * 1024 * 1024) {
        await reader.cancel()
        throw new StudioError(502, 'HTML quá lớn để kiểm tra.', 'AUDIT_SIZE')
      }
      chunks.push(chunk.value)
    }
  } finally {
    reader.releaseLock()
  }
  return Buffer.concat(chunks).toString('utf8')
}
