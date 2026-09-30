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
      getStudio().generations.get(
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
    return studioJson(
      getStudio().generations.apply(
        cookies().get(SESSION_COOKIE)!.value,
        params.id,
        await readJson(request, 8192),
      ),
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
      .object({ version: z.number().int().positive() })
      .strict()
      .parse(await readJson(request, 1024))
    getStudio().generations.remove(
      cookies().get(SESSION_COOKIE)!.value,
      params.id,
      version,
    )
    return studioJson({ deleted: true })
  } catch (error) {
    return studioFailure(error)
  }
}
