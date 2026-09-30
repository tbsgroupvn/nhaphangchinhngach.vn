import { cookies } from 'next/headers'
import { z } from 'zod'
import {
  currentUser,
  getStudio,
  SESSION_COOKIE,
  bootstrapToken,
} from '@/lib/studio/runtime'
import { assertSameOrigin, readJson } from '@/lib/studio/http'
import { setSessionCookie, studioFailure, studioJson } from '@/lib/studio/api'

export const dynamic = 'force-dynamic'
export async function GET() {
  try {
    return studioJson({
      user: currentUser(),
      setupRequired: getStudio().auth.needsSetup(),
      setupConfigured: bootstrapToken().length >= 32,
    })
  } catch (error) {
    return studioFailure(error)
  }
}
export async function POST(request: Request) {
  try {
    assertSameOrigin(request)
    const input = z
      .object({
        email: z.string().email().max(254),
        password: z.string().min(1).max(256),
        remember: z.boolean().default(false),
      })
      .parse(await readJson(request, 4096))
    // No shared "client" bucket: request forwarding headers are untrusted here.
    // Per-account limits and bounded password hashing apply; ingress owns per-IP limits.
    const login = await getStudio().auth.login(
      input.email,
      input.password,
      null,
      input.remember,
    )
    const response = studioJson({ user: login.user })
    setSessionCookie(response, request, login.token, login.maxAge)
    return response
  } catch (error) {
    return studioFailure(error)
  }
}
export async function DELETE(request: Request) {
  try {
    assertSameOrigin(request)
    getStudio().auth.logout(cookies().get(SESSION_COOKIE)?.value)
    const response = studioJson({ success: true })
    setSessionCookie(response, request, '', 0)
    return response
  } catch (error) {
    return studioFailure(error)
  }
}
