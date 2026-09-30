import { NextResponse, type NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const headers = new Headers(request.headers)
  headers.set('x-studio-path', request.nextUrl.pathname)
  headers.delete('x-user-id')
  headers.delete('x-user-role')
  headers.delete('x-user-permissions')
  const response = NextResponse.next({ request: { headers } })
  if (
    request.nextUrl.pathname.startsWith('/admin') ||
    request.nextUrl.pathname.startsWith('/studio-preview/')
  ) {
    response.headers.set('X-Robots-Tag', 'noindex, nofollow')
    response.headers.set('Cache-Control', 'private, no-store')
    response.headers.set('X-Frame-Options', 'DENY')
  }
  return response
}

export const config = {
  matcher: ['/admin/:path*', '/api/:path*', '/studio-preview/:path*'],
}
