import { z } from 'zod'
import { getStudio, bootstrapToken } from '@/lib/studio/runtime'
import { assertSameOrigin, readJson } from '@/lib/studio/http'
import { studioFailure, studioJson } from '@/lib/studio/api'

export const dynamic = 'force-dynamic'
export async function POST(request: Request) {
  try {
    assertSameOrigin(request)
    const { auth } = getStudio()
    auth.consumeLimit('owner-setup', 10)
    const input = z
      .object({
        token: z.string().min(1).max(256),
        email: z.string(),
        name: z.string(),
        password: z.string().max(256),
      })
      .parse(await readJson(request, 4096))
    const user = await auth.setupOwner(input, input.token, bootstrapToken())
    return studioJson({ user }, 201)
  } catch (error) {
    return studioFailure(error)
  }
}
