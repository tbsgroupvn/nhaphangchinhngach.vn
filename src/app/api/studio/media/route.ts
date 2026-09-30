import { cookies } from 'next/headers'
import { z } from 'zod'
import { getStudio, requireUser, SESSION_COOKIE } from '@/lib/studio/runtime'
import { studioFailure, studioJson } from '@/lib/studio/api'
import { assertSameOrigin } from '@/lib/studio/http'
import { readUploadBytes } from '@/lib/studio/media-upload'
import { StudioError } from '@/lib/studio/errors'

export const dynamic = 'force-dynamic'
let activeUploads = 0
export async function GET(request: Request) {
  try {
    requireUser('content.read')
    const { media } = getStudio()
    const id = new URL(request.url).searchParams.get('id')
    if (id) {
      z.string().uuid().parse(id)
      return studioJson({ item: media.get(id), usage: media.usage(id) })
    }
    return studioJson({ items: media.list() })
  } catch (error) {
    return studioFailure(error)
  }
}
export async function POST(request: Request) {
  let claimed = false
  try {
    assertSameOrigin(request)
    requireUser('media.write')
    if (activeUploads >= 2)
      throw new StudioError(
        429,
        'Đang tải ảnh khác. Vui lòng thử lại.',
        'UPLOAD_BUSY',
      )
    let filename: string
    try {
      filename = decodeURIComponent(request.headers.get('x-file-name') || '')
    } catch {
      throw new StudioError(400, 'Tên tệp không hợp lệ.', 'UPLOAD_NAME')
    }
    activeUploads += 1
    claimed = true
    const input = await readUploadBytes(request)
    return studioJson(
      {
        item: await getStudio().media.upload(
          cookies().get(SESSION_COOKIE)!.value,
          input,
          request.headers.get('content-type') || '',
          filename,
        ),
      },
      201,
    )
  } catch (error) {
    return studioFailure(error)
  } finally {
    if (claimed) activeUploads -= 1
  }
}
