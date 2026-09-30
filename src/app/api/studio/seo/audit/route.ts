import { cookies } from 'next/headers'
import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { z } from 'zod'
import { getStudio, requireUser, SESSION_COOKIE } from '@/lib/studio/runtime'
import { assertSameOrigin, readJson } from '@/lib/studio/http'
import { studioFailure, studioJson } from '@/lib/studio/api'
import { StudioError } from '@/lib/studio/errors'
import { inspectHtml } from '@/lib/studio/seo-audit'
import { fetchAuditHtml } from '@/lib/studio/seo-fetch'
import type { HtmlAudit } from '@/lib/studio/seo-model'
import { uploadedMediaPath } from '@/lib/studio/media-model'

export const dynamic = 'force-dynamic'
const active = new Set<string>()
export async function POST(request: Request) {
  let claimed: string | undefined
  try {
    assertSameOrigin(request)
    requireUser('content.read')
    const { id } = z
      .object({ id: z.string().uuid() })
      .strict()
      .parse(await readJson(request, 1024))
    const { content, seo, technical, media } = getStudio(),
      token = cookies().get(SESSION_COOKIE)!.value
    seo.authorize(token)
    if (!process.env.STUDIO_ORIGIN)
      throw new StudioError(
        503,
        'Cần cấu hình STUDIO_ORIGIN để quét HTML.',
        'AUDIT_ORIGIN',
      )
    if (active.has(id) || active.size >= 3)
      throw new StudioError(
        429,
        'Đang có lượt quét. Vui lòng thử lại sau.',
        'AUDIT_BUSY',
      )
    const document = content.get(id)
    const publicationKey = seo.publicationKey()
    if (!document.publishedPath)
      throw new StudioError(409, 'Trang chưa được xuất bản.', 'NOT_PUBLISHED')
    active.add(id)
    claimed = id
    let report: HtmlAudit
    try {
      const html = await fetchAuditHtml(
        process.env.STUDIO_ORIGIN,
        document.publishedPath,
      )
      report = inspectHtml(html, {
        path: document.publishedPath,
        paths: content.publishedList().map((item) => item.path),
        redirectPaths: technical.redirects().map((item) => item.source),
        assetExists: (path) =>
          (uploadedMediaPath.test(path) &&
            media.isPublished(uploadedMediaPath.exec(path)![1])) ||
          (/^\/images\/marketing\/[a-zA-Z0-9_-]+\.(webp|png|jpe?g|avif)$/.test(
            path,
          ) &&
            existsSync(join(process.cwd(), 'public', path))),
      })
    } catch (error) {
      report = {
        status: 'failed',
        headings: 0,
        images: 0,
        links: 0,
        checkedAt: new Date().toISOString(),
        issues: [
          {
            code: 'crawl-failed',
            severity: 'error',
            field: 'html',
            message:
              error instanceof StudioError
                ? error.message
                : 'Không đọc được HTML trong thời gian cho phép.',
          },
        ],
      }
    }
    seo.saveAudit(token, id, document.version, report, publicationKey)
    return studioJson({ report })
  } catch (error) {
    return studioFailure(error)
  } finally {
    if (claimed) active.delete(claimed)
  }
}
