import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { getStudio, requireUser, SESSION_COOKIE } from '@/lib/studio/runtime'
import { assertSameOrigin, readJson } from '@/lib/studio/http'
import { studioJson, studioFailure } from '@/lib/studio/api'
import { technicalSeoData } from '@/lib/studio/technical-seo-data'

export const dynamic = 'force-dynamic'
export async function GET() {
  try {
    requireUser('content.read')
    return studioJson(technicalSeoData())
  } catch (error) {
    return studioFailure(error)
  }
}
export async function POST(request: Request) {
  try {
    assertSameOrigin(request)
    requireUser('settings.write')
    const input = z
      .discriminatedUnion('action', [
        z
          .object({
            action: z.literal('save-redirect'),
            id: z.string().uuid().nullable(),
            version: z.number().int().nonnegative(),
            payload: z.unknown(),
          })
          .strict(),
        z
          .object({
            action: z.literal('delete-redirect'),
            id: z.string().uuid(),
            version: z.number().int().positive(),
          })
          .strict(),
        z
          .object({
            action: z.literal('settings'),
            version: z.number().int().nonnegative(),
            payload: z.unknown(),
          })
          .strict(),
      ])
      .parse(await readJson(request, 12000))
    const { technical } = getStudio()
    const token = cookies().get(SESSION_COOKIE)!.value
    if (input.action === 'settings')
      technical.saveSettings(token, input.version, input.payload)
    else if (input.action === 'save-redirect')
      technical.saveRedirect(token, input.id, input.version, input.payload)
    else technical.deleteRedirect(token, input.id, input.version)
    revalidatePath('/', 'layout')
    return studioJson(technicalSeoData())
  } catch (error) {
    return studioFailure(error)
  }
}
