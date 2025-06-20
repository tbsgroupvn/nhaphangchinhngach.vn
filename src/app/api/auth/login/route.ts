import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { SignJWT } from 'jose';

// Mock user database - thay thế bằng database thực tế
const users = [
  {
    id: '1',
    username: 'admin_tbs',
    email: 'admin@tbsgroup.vn',
    fullName: 'Admin TBS GROUP',
    passwordHash: '$2b$10$example_hashed_password', // Trong thực tế dùng bcrypt
    role: 'super_admin',
    status: 'active',
    permissions: ['*'],
    emailVerified: true,
    twoFactorEnabled: false
  },
  {
    id: '2',
    username: 'editor_logistics',
    email: 'editor@tbsgroup.vn',
    fullName: 'Nguyễn Văn Logistics',
    passwordHash: '$2b$10$example_hashed_password',
    role: 'editor',
    status: 'active',
    permissions: ['posts.create', 'posts.edit', 'services.edit', 'media.upload'],
    emailVerified: true,
    twoFactorEnabled: false
  }
];

export async function POST(request: Request) {
  try {
    const { username, password, rememberMe } = await request.json();

    // Validate input
    if (!username || !password) {
      return NextResponse.json(
        { success: false, message: 'Tên đăng nhập và mật khẩu không được để trống' },
        { status: 400 }
      );
    }

    // Find user
    const user = users.find(u => 
      (u.username === username || u.email === username) && u.status === 'active'
    );

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Tên đăng nhập hoặc mật khẩu không đúng' },
        { status: 401 }
      );
    }

    // In production, use bcrypt.compare(password, user.passwordHash)
    const isPasswordValid = password === 'admin123'; // Mock validation

    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, message: 'Tên đăng nhập hoặc mật khẩu không đúng' },
        { status: 401 }
      );
    }

    // Create JWT token
    const secret = new TextEncoder().encode(
      process.env.JWT_SECRET || 'tbs-group-secret-key-2024'
    );

    const expirationTime = rememberMe ? '30d' : '24h';
    
    const token = await new SignJWT({ 
      userId: user.id, 
      username: user.username,
      role: user.role,
      permissions: user.permissions 
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime(expirationTime)
      .sign(secret);

    // Set cookie
    const cookieStore = cookies();
    cookieStore.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: rememberMe ? 30 * 24 * 60 * 60 : 24 * 60 * 60, // 30 days or 24 hours
      path: '/'
    });

    // Update last login
    const now = new Date().toISOString();
    
    // Return user data without sensitive info
    return NextResponse.json({
      success: true,
      message: 'Đăng nhập thành công',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        permissions: user.permissions,
        lastLogin: now
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, message: 'Lỗi hệ thống, vui lòng thử lại sau' },
      { status: 500 }
    );
  }
} 