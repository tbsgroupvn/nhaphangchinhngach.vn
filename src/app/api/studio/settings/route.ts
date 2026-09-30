import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { getStudio, requireUser, SESSION_COOKIE } from '@/lib/studio/runtime'
import { assertSameOrigin, readJson } from '@/lib/studio/http'
import { studioJson, studioFailure } from '@/lib/studio/api'

export const dynamic = 'force-dynamic'
export async function GET() {
  try {
    requireUser('content.read')
    return studioJson(getStudio().siteSettings.get())
  } catch (error) {
    return studioFailure(error)
  }
}
export async function PUT(request: Request) {
  try {
    assertSameOrigin(request)
    requireUser('settings.write')
    const input = z
      .object({ version: z.number().int().nonnegative(), payload: z.unknown() })
      .strict()
      .parse(await readJson(request, 65536))
    const result = getStudio().siteSettings.apply(
      cookies().get(SESSION_COOKIE)!.value,
      input.version,
      input.payload,
    )
    revalidatePath('/', 'layout')
    return studioJson(result)
  } catch (error) {
    return studioFailure(error)
  }
}
