import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { getStudio, requireUser, SESSION_COOKIE } from '@/lib/studio/runtime'
import { assertSameOrigin, readJson } from '@/lib/studio/http'
import { studioFailure, studioJson } from '@/lib/studio/api'

export const dynamic = 'force-dynamic'
type Context = { params: { id: string } }
export async function GET(_: Request, { params }: Context) {
  try {
    requireUser('content.read')
    const { content } = getStudio()
    return studioJson({
      document: content.get(params.id),
      revisions: content.revisions(params.id),
    })
  } catch (error) {
    return studioFailure(error)
  }
}
export async function PATCH(request: Request, { params }: Context) {
  try {
    assertSameOrigin(request)
    requireUser('content.read')
    const input = z
      .discriminatedUnion('action', [
        z
          .object({
            action: z.literal('save-seo'),
            version: z.number().int().positive(),
            seo: z.unknown(),
          })
          .strict(),
        z
          .object({
            action: z.literal('save'),
            version: z.number().int().positive(),
            payload: z.unknown(),
          })
          .strict(),
        z
          .object({
            action: z.literal('publish'),
            version: z.number().int().positive(),
          })
          .strict(),
        z
          .object({
            action: z.literal('unpublish'),
            version: z.number().int().positive(),
          })
          .strict(),
        z
          .object({
            action: z.literal('archive'),
            version: z.number().int().positive(),
          })
          .strict(),
        z
          .object({
            action: z.literal('reactivate'),
            version: z.number().int().positive(),
          })
          .strict(),
        z
          .object({
            action: z.literal('restore'),
            version: z.number().int().positive(),
            revision: z.number().int().positive(),
          })
          .strict(),
      ])
      .parse(await readJson(request))
    const { content } = getStudio(),
      token = cookies().get(SESSION_COOKIE)!.value
    const document =
      input.action === 'save-seo'
        ? content.saveSeo(token, params.id, input.version, input.seo)
        : input.action === 'save'
          ? content.save(token, params.id, input.version, input.payload)
          : input.action === 'restore'
            ? content.restore(token, params.id, input.version, input.revision)
            : input.action === 'publish'
              ? content.publish(token, params.id, input.version)
              : input.action === 'unpublish'
                ? content.unpublish(token, params.id, input.version)
                : input.action === 'archive'
                  ? content.archive(token, params.id, input.version)
                  : content.reactivate(token, params.id, input.version)
    if (
      input.action === 'publish' ||
      input.action === 'unpublish' ||
      input.action === 'archive' ||
      input.action === 'reactivate'
    )
      revalidatePath('/', 'layout')
    return studioJson({ document, revisions: content.revisions(params.id) })
  } catch (error) {
    return studioFailure(error)
  }
}
