import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { getStudio, requireUser, SESSION_COOKIE } from '@/lib/studio/runtime'
import { assertSameOrigin, readJson } from '@/lib/studio/http'
import { studioFailure, studioJson } from '@/lib/studio/api'
export const dynamic = 'force-dynamic'
export async function GET() {
  try {
    requireUser('content.read')
    return studioJson(getStudio().templates.get())
  } catch (error) {
    return studioFailure(error)
  }
}
export async function PUT(request: Request) {
  try {
    assertSameOrigin(request)
    requireUser('settings.write')
    const input = z
      .object({ version: z.number().int().nonnegative(), values: z.unknown() })
      .strict()
      .parse(await readJson(request, 524288))
    const result = getStudio().templates.apply(
      cookies().get(SESSION_COOKIE)!.value,
      input.version,
      input.values,
    )
    revalidatePath('/', 'layout')
    return studioJson(result)
  } catch (error) {
    return studioFailure(error)
  }
}
