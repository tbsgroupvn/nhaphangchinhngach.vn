import { NextRequest, NextResponse } from 'next/server'
import { authenticateUser, logActivity } from '@/lib/supabase/auth'
import { SignJWT } from 'jose'
import { cookies } from 'next/headers'
import bcrypt from 'bcryptjs'

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-secret-key-at-least-32-characters-long'
)

// Fallback admin credentials when Supabase is not configured
const FALLBACK_ADMIN = {
  id: 'fallback-admin-001',
  username: 'admin',
  email: 'admin@nhaphangchinhngach.vn',
  full_name: 'Administrator',
  role: 'super_admin' as const,
  avatar_url: null,
  status: 'active' as const,
  // Pre-hashed password for: Anhcanem2015@
  // Generated with: bcrypt.hash('Anhcanem2015@', 10)
  password_hash: '$2b$10$9HmBXfHtI1cPGKbKV4MTb.xWPz5I.jNWd79kAUHwcxCNbnJWNH/g6',
}

// Check if Supabase is properly configured
function isSupabaseConfigured(): boolean {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  return !!(
    supabaseUrl &&
    supabaseKey &&
    supabaseUrl !== 'https://placeholder.supabase.co' &&
    supabaseKey !== 'placeholder-key'
  )
}

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

    let user: any
    let authSuccess = false

    // Try Supabase authentication first if configured
    if (isSupabaseConfigured()) {
      try {
        const authResult = await authenticateUser({ username, password })

        if (authResult.success && authResult.user) {
          user = authResult.user
          authSuccess = true

          // Log activity if using Supabase
          await logActivity(user.id, 'login', {
            ip: request.ip || request.headers.get('x-forwarded-for'),
            userAgent: request.headers.get('user-agent'),
          })
        }
      } catch (error) {
        console.error('Supabase auth error, falling back to local auth:', error)
      }
    }

    // Fallback to local authentication if Supabase failed or not configured
    if (!authSuccess) {
      if (username === FALLBACK_ADMIN.username) {
        // Verify password using bcrypt
        const passwordMatch = await bcrypt.compare(password, FALLBACK_ADMIN.password_hash)

        if (passwordMatch) {
          user = FALLBACK_ADMIN
          authSuccess = true
          console.log('✅ Fallback admin login successful')
        }
      }
    }

    if (!authSuccess) {
      return NextResponse.json(
        {
          success: false,
          error: 'Tên đăng nhập hoặc mật khẩu không đúng',
        },
        { status: 401 }
      )
    }

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
