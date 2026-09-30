import { NextResponse } from 'next/server'
import { ZodError } from 'zod'
import { StudioError } from './errors'
import { SESSION_COOKIE } from './runtime'

export function studioJson(value: unknown, status = 200) {
  return NextResponse.json(value, {
    status,
    headers: {
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff',
    },
  })
}
export function studioFailure(error: unknown) {
  if (error instanceof StudioError)
    return studioJson({ error: error.message, code: error.code }, error.status)
  if (error instanceof ZodError)
    return studioJson(
      {
        error: 'Thông tin chưa hợp lệ. Vui lòng kiểm tra các trường.',
        fields: error.flatten().fieldErrors,
        code: 'VALIDATION',
      },
      400,
    )
  console.error(
    'Studio request failed',
    error instanceof Error ? error.name : 'unknown',
  )
  return studioJson(
    {
      error: 'Không thể hoàn thành thao tác. Vui lòng thử lại.',
      code: 'INTERNAL',
    },
    500,
  )
}
export function setSessionCookie(
  response: NextResponse,
  request: Request,
  token: string,
  maxAge: number,
) {
  const origin = process.env.STUDIO_ORIGIN || request.url
  response.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: new URL(origin).protocol === 'https:',
    sameSite: 'strict',
    path: '/',
    maxAge,
  })
}
