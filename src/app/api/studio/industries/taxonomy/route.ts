import { cookies } from 'next/headers'
import { z } from 'zod'
import { studioFailure, studioJson } from '@/lib/studio/api'
import { assertSameOrigin, readJson } from '@/lib/studio/http'
import { getStudio, requireUser, SESSION_COOKIE } from '@/lib/studio/runtime'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    requireUser('content.read')
    return studioJson(getStudio().industryTaxonomy.read())
  } catch (error) {
    return studioFailure(error)
  }
}

export async function PATCH(request: Request) {
  try {
    assertSameOrigin(request)
    requireUser('content.write')
    const input = z
      .object({
        version: z.number().int().nonnegative(),
        traits: z.unknown(),
      })
      .strict()
      .parse(await readJson(request, 262144))
    const taxonomy = getStudio().industryTaxonomy.save(
      cookies().get(SESSION_COOKIE)!.value,
      input.version,
      { traits: input.traits },
    )
    return studioJson(taxonomy)
  } catch (error) {
    return studioFailure(error)
  }
}
