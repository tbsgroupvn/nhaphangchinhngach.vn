import { cookies } from 'next/headers'
import { z } from 'zod'
import { getStudio, requireUser, SESSION_COOKIE } from '@/lib/studio/runtime'
import { assertSameOrigin, readJson } from '@/lib/studio/http'
import { studioFailure, studioJson } from '@/lib/studio/api'
export const dynamic = 'force-dynamic'
export async function GET() {
  try {
    requireUser('ai.use')
    return studioJson({
      sources: getStudio().knowledge.list(cookies().get(SESSION_COOKIE)!.value),
    })
  } catch (error) {
    return studioFailure(error)
  }
}
export async function POST(request: Request) {
  try {
    assertSameOrigin(request)
    requireUser('ai.use')
    const { payload } = z
      .object({ payload: z.unknown() })
      .strict()
      .parse(await readJson(request, 131072))
    return studioJson(
      getStudio().knowledge.save(
        cookies().get(SESSION_COOKIE)!.value,
        null,
        0,
        payload,
      ),
      201,
    )
  } catch (error) {
    return studioFailure(error)
  }
}
