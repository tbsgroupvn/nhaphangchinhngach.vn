import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import { getUserById } from '@/lib/supabase/auth'

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-secret-key-at-least-32-characters-long'
)

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

    // Get fresh user data
    const user = await getUserById(payload.userId as string)

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
