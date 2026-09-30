import { cookies } from 'next/headers'
import { z } from 'zod'
import { getStudio, requireUser, SESSION_COOKIE } from '@/lib/studio/runtime'
import { assertSameOrigin, readJson } from '@/lib/studio/http'
import { studioFailure, studioJson } from '@/lib/studio/api'
export const dynamic = 'force-dynamic'
export async function GET(
  _request: Request,
  { params }: { params: { id: string } },
) {
  try {
    requireUser('ai.use')
    return studioJson(
      getStudio().knowledge.get(
        cookies().get(SESSION_COOKIE)!.value,
        params.id,
      ),
    )
  } catch (error) {
    return studioFailure(error)
  }
}
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    assertSameOrigin(request)
    requireUser('ai.use')
    const input = z
      .discriminatedUnion('action', [
        z
          .object({
            action: z.literal('save'),
            version: z.number().int().nonnegative(),
            payload: z.unknown(),
          })
          .strict(),
        z
          .object({
            action: z.enum(['approve', 'withdraw', 'archive', 'reactivate']),
            version: z.number().int().nonnegative(),
          })
          .strict(),
      ])
      .parse(await readJson(request, 131072))
    const repository = getStudio().knowledge,
      token = cookies().get(SESSION_COOKIE)!.value
    return studioJson(
      input.action === 'save'
        ? repository.save(token, params.id, input.version, input.payload)
        : repository.review(token, params.id, input.version, input.action),
    )
  } catch (error) {
    return studioFailure(error)
  }
}
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    assertSameOrigin(request)
    requireUser('settings.write')
    const { version } = z
      .object({ version: z.number().int().nonnegative() })
      .strict()
      .parse(await readJson(request, 1024))
    getStudio().knowledge.remove(
      cookies().get(SESSION_COOKIE)!.value,
      params.id,
      version,
    )
    return studioJson({ deleted: true })
  } catch (error) {
    return studioFailure(error)
  }
}
