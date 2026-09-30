import { cookies } from 'next/headers'
import { z } from 'zod'
import { getStudio, requireUser, SESSION_COOKIE } from '@/lib/studio/runtime'
import { assertSameOrigin, readJson } from '@/lib/studio/http'
import { studioFailure, studioJson } from '@/lib/studio/api'
export const dynamic = 'force-dynamic'
export async function GET() {
  try {
    requireUser('ai.use')
    return studioJson(
      getStudio().knowledge.instructions(cookies().get(SESSION_COOKIE)!.value),
    )
  } catch (error) {
    return studioFailure(error)
  }
}
export async function PUT(request: Request) {
  try {
    assertSameOrigin(request)
    requireUser('settings.write')
    const { version, values } = z
      .object({ version: z.number().int().nonnegative(), values: z.unknown() })
      .strict()
      .parse(await readJson(request, 32768))
    return studioJson(
      getStudio().knowledge.saveInstructions(
        cookies().get(SESSION_COOKIE)!.value,
        version,
        values,
      ),
    )
  } catch (error) {
    return studioFailure(error)
  }
}
