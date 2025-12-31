import { NextRequest, NextResponse } from 'next/server'
import { authenticateUser, logActivity } from '@/lib/supabase/auth'
import { SignJWT } from 'jose'
import { cookies } from 'next/headers'

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-secret-key-at-least-32-characters-long'
)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { username, password } = body

    if (!username || !password) {
      return NextResponse.json(
        {
          success: false,
          error: 'Vui lòng nhập tên đăng nhập và mật khẩu',
        },
        { status: 400 }
      )
    }

    // Authenticate user
    const authResult = await authenticateUser({ username, password })

    if (!authResult.success || !authResult.user) {
      return NextResponse.json(
        {
          success: false,
          error: authResult.error || 'Đăng nhập thất bại',
        },
        { status: 401 }
      )
    }

    const user = authResult.user

    // Create JWT token
    const token = await new SignJWT({
      userId: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('7d')
      .sign(JWT_SECRET)

    // Log activity
    await logActivity(user.id, 'login', {
      ip: request.ip || request.headers.get('x-forwarded-for'),
      userAgent: request.headers.get('user-agent'),
    })

    // Set cookie
    const cookieStore = await cookies()
    cookieStore.set('cms_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    })

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        full_name: user.full_name,
        role: user.role,
        avatar_url: user.avatar_url,
      },
    })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Đã xảy ra lỗi khi đăng nhập',
      },
      { status: 500 }
    )
  }
}
