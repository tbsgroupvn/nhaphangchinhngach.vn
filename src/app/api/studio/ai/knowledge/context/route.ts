import { cookies } from 'next/headers'
import { z } from 'zod'
import { getStudio, requireUser, SESSION_COOKIE } from '@/lib/studio/runtime'
import { assertSameOrigin, readJson } from '@/lib/studio/http'
import { studioFailure, studioJson } from '@/lib/studio/api'
export const dynamic = 'force-dynamic'
export async function POST(request: Request) {
  try {
    assertSameOrigin(request)
    requireUser('ai.use')
    const { query } = z
      .object({ query: z.string().trim().min(2).max(4000) })
      .strict()
      .parse(await readJson(request, 32768))
    return studioJson(
      getStudio().knowledge.context(
        cookies().get(SESSION_COOKIE)!.value,
        query,
      ),
    )
  } catch (error) {
    return studioFailure(error)
  }
}
