import { cookies } from 'next/headers'
import { getStudio, requireUser, SESSION_COOKIE } from '@/lib/studio/runtime'
import { assertSameOrigin, readJson } from '@/lib/studio/http'
import { studioFailure, studioJson } from '@/lib/studio/api'
export const dynamic = 'force-dynamic'
export async function GET(request: Request) {
  try {
    requireUser('ai.use')
    return studioJson({
      generations: getStudio().generations.list(
        cookies().get(SESSION_COOKIE)!.value,
        new URL(request.url).searchParams.get('documentId') || undefined,
      ),
    })
  } catch (error) {
    return studioFailure(error)
  }
}
export async function POST(request: Request) {
  try {
    assertSameOrigin(request)
    requireUser('ai.use')
    return studioJson(
      await getStudio().generations.generate(
        cookies().get(SESSION_COOKIE)!.value,
        await readJson(request, 32768),
      ),
    )
  } catch (error) {
    return studioFailure(error)
  }
}
