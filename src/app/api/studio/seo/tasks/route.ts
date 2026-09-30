import { cookies } from 'next/headers'
import { z } from 'zod'
import { getStudio, requireUser, SESSION_COOKIE } from '@/lib/studio/runtime'
import { assertSameOrigin, readJson } from '@/lib/studio/http'
import { studioFailure, studioJson } from '@/lib/studio/api'
import { StudioError } from '@/lib/studio/errors'

export const dynamic = 'force-dynamic'
export async function GET(request: Request) {
  try {
    requireUser('content.read')
    const id = z
      .string()
      .uuid()
      .parse(new URL(request.url).searchParams.get('id'))
    const task = getStudio()
      .seo.tasks()
      .find((item) => item.id === id)
    if (!task) throw new StudioError(404, 'Công việc đã được xóa.', 'NOT_FOUND')
    return studioJson({ task })
  } catch (error) {
    return studioFailure(error)
  }
}
export async function POST(request: Request) {
  try {
    assertSameOrigin(request)
    requireUser('content.read')
    const input = z
      .discriminatedUnion('action', [
        z
          .object({
            action: z.literal('save'),
            id: z.string().uuid().nullable(),
            version: z.number().int().nonnegative(),
            payload: z.unknown(),
          })
          .strict(),
        z
          .object({
            action: z.literal('delete'),
            id: z.string().uuid(),
            version: z.number().int().positive(),
          })
          .strict(),
      ])
      .parse(await readJson(request, 16000))
    const { seo } = getStudio(),
      token = cookies().get(SESSION_COOKIE)!.value
    if (input.action === 'delete') {
      seo.deleteTask(token, input.id, input.version)
      return studioJson({ success: true })
    }
    return studioJson({
      task: seo.saveTask(token, input.id, input.version, input.payload),
    })
  } catch (error) {
    return studioFailure(error)
  }
}
