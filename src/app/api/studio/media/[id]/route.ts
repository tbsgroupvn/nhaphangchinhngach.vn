import { cookies } from 'next/headers'
import { z } from 'zod'
import { getStudio, requireUser, SESSION_COOKIE } from '@/lib/studio/runtime'
import { studioFailure, studioJson } from '@/lib/studio/api'
import { assertSameOrigin, readJson } from '@/lib/studio/http'

export const dynamic = 'force-dynamic'
type Context = { params: { id: string } }
export async function GET(_: Request, { params }: Context) {
  try {
    z.string().uuid().parse(params.id)
    const { item, data } = getStudio().media.read(
      params.id,
      cookies().get(SESSION_COOKIE)?.value,
    )
    return new Response(new Uint8Array(data), {
      headers: {
        'Content-Type': 'image/webp',
        'Content-Length': String(data.length),
        'Content-Disposition': `inline; filename="${item.id}.webp"`,
        'Cache-Control': 'private, no-store',
        'X-Content-Type-Options': 'nosniff',
        'Content-Security-Policy': "default-src 'none'; sandbox",
      },
    })
  } catch (error) {
    return studioFailure(error)
  }
}
export async function PATCH(request: Request, { params }: Context) {
  try {
    assertSameOrigin(request)
    requireUser('media.write')
    z.string().uuid().parse(params.id)
    const input = z
      .object({ version: z.number().int().positive(), payload: z.unknown() })
      .strict()
      .parse(await readJson(request, 5000))
    return studioJson({
      item: getStudio().media.update(
        cookies().get(SESSION_COOKIE)!.value,
        params.id,
        input.version,
        input.payload,
      ),
    })
  } catch (error) {
    return studioFailure(error)
  }
}
export async function DELETE(request: Request, { params }: Context) {
  try {
    assertSameOrigin(request)
    requireUser('media.write')
    z.string().uuid().parse(params.id)
    const input = z
      .object({ version: z.number().int().positive() })
      .strict()
      .parse(await readJson(request, 1024))
    getStudio().media.remove(
      cookies().get(SESSION_COOKIE)!.value,
      params.id,
      input.version,
    )
    return studioJson({ success: true })
  } catch (error) {
    return studioFailure(error)
  }
}
