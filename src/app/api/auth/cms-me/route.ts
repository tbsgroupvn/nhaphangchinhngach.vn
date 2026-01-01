import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import { getUserById } from '@/lib/supabase/auth'

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-secret-key-at-least-32-characters-long'
)

// Fallback admin user data (matches the one in cms-login)
const FALLBACK_ADMIN = {
  id: 'fallback-admin-001',
  username: 'admin',
  email: 'admin@nhaphangchinhngach.vn',
  full_name: 'Administrator',
  role: 'super_admin',
  avatar_url: null,
  status: 'active',
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

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('cms_token')?.value

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          error: 'Không tìm thấy token',
        },
        { status: 401 }
      )
    }

    // Verify JWT
    const { payload } = await jwtVerify(token, JWT_SECRET)
    const userId = payload.userId as string

    let user: any = null

    // Try to get user from Supabase if configured
    if (isSupabaseConfigured()) {
      try {
        user = await getUserById(userId)
      } catch (error) {
        console.error('Supabase getUserById error, checking fallback:', error)
      }
    }

    // Use fallback admin if Supabase user not found and this is the fallback admin
    if (!user && userId === FALLBACK_ADMIN.id) {
      user = FALLBACK_ADMIN
      console.log('✅ Using fallback admin for cms-me')
    }

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: 'Người dùng không tồn tại',
        },
        { status: 401 }
      )
    }

    // Check if user is active
    if (user.status !== 'active') {
      return NextResponse.json(
        {
          success: false,
          error: 'Tài khoản đã bị vô hiệu hóa',
        },
        { status: 403 }
      )
    }

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
    console.error('Get user error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Token không hợp lệ hoặc đã hết hạn',
      },
      { status: 401 }
    )
  }
}
