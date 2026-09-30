import { cookies } from 'next/headers'
import { getStudio, requireUser, SESSION_COOKIE } from '@/lib/studio/runtime'
import { assertSameOrigin, readJson } from '@/lib/studio/http'
import { studioFailure, studioJson } from '@/lib/studio/api'

export const dynamic = 'force-dynamic'
export async function GET() {
  try {
    requireUser('content.read')
    return studioJson({ documents: getStudio().content.list() })
  } catch (error) {
    return studioFailure(error)
  }
}
export async function POST(request: Request) {
  try {
    assertSameOrigin(request)
    requireUser('content.write')
    const input = await readJson(request)
    return studioJson(
      {
        document: getStudio().content.create(
          cookies().get(SESSION_COOKIE)!.value,
          input,
        ),
      },
      201,
    )
  } catch (error) {
    return studioFailure(error)
  }
}
