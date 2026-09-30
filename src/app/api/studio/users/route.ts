import { z } from 'zod'
import { cookies } from 'next/headers'
import { getStudio, requireUser, SESSION_COOKIE } from '@/lib/studio/runtime'
import { assertSameOrigin, readJson } from '@/lib/studio/http'
import { studioFailure, studioJson } from '@/lib/studio/api'

export const dynamic = 'force-dynamic'
export async function GET() {
  try {
    return studioJson({
      users: getStudio().auth.listUsers(requireUser('users.manage')),
    })
  } catch (error) {
    return studioFailure(error)
  }
}
export async function POST(request: Request) {
  try {
    assertSameOrigin(request)
    const actor = requireUser('users.manage')
    return studioJson(
      {
        user: await getStudio().auth.createUser(
          actor,
          await readJson(request, 4096),
          cookies().get(SESSION_COOKIE)!.value,
        ),
      },
      201,
    )
  } catch (error) {
    return studioFailure(error)
  }
}
export async function PATCH(request: Request) {
  try {
    assertSameOrigin(request)
    const actor = requireUser('users.manage')
    const { id, revision, changes } = z
      .object({
        id: z.string().uuid(),
        revision: z.string().datetime(),
        changes: z.unknown(),
      })
      .strict()
      .parse(await readJson(request, 4096))
    return studioJson({
      user: getStudio().auth.updateUser(
        actor,
        id,
        changes,
        revision,
        cookies().get(SESSION_COOKIE)!.value,
      ),
    })
  } catch (error) {
    return studioFailure(error)
  }
}
