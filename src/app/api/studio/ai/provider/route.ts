import { cookies } from 'next/headers'
import { z } from 'zod'
import { getStudio, requireUser, SESSION_COOKIE } from '@/lib/studio/runtime'
import { assertSameOrigin, readJson } from '@/lib/studio/http'
import { studioFailure, studioJson } from '@/lib/studio/api'
export const dynamic = 'force-dynamic'
const versionSchema = z
  .object({ version: z.number().int().nonnegative() })
  .strict()
const token = () => cookies().get(SESSION_COOKIE)!.value

export async function GET() {
  try {
    requireUser('ai.use')
    return studioJson(getStudio().aiProvider.get(token()))
  } catch (error) {
    return studioFailure(error)
  }
}
export async function PUT(request: Request) {
  try {
    assertSameOrigin(request)
    requireUser('settings.write')
    const input = versionSchema
      .extend({ config: z.unknown() })
      .parse(await readJson(request, 8192))
    return studioJson(
      getStudio().aiProvider.save(token(), input.version, input.config),
    )
  } catch (error) {
    return studioFailure(error)
  }
}
export async function DELETE(request: Request) {
  try {
    assertSameOrigin(request)
    requireUser('settings.write')
    const input = versionSchema.parse(await readJson(request, 1024))
    return studioJson(getStudio().aiProvider.clear(token(), input.version))
  } catch (error) {
    return studioFailure(error)
  }
}
export async function POST(request: Request) {
  try {
    assertSameOrigin(request)
    requireUser('settings.write')
    const input = versionSchema
      .extend({ consent: z.literal(true) })
      .parse(await readJson(request, 1024))
    return studioJson(
      await getStudio().aiProvider.testConnection(token(), input.version),
    )
  } catch (error) {
    return studioFailure(error)
  }
}
