import { NextResponse } from 'next/server';

// User interface
interface User {
  id: string;
  username: string;
  email: string;
  fullName: string;
  passwordHash: string;
  role: string;
  status: string;
  passwordResetToken: string | null;
  passwordResetExpires: string | null;
}

// Mock users database - replace with real database
let users: User[] = [
  {
    id: '1',
    username: 'admin_tbs',
    email: 'admin@tbsgroup.vn',
    fullName: 'Admin TBS GROUP',
    passwordHash: '$2b$10$example_hashed_password',
    role: 'super_admin',
    status: 'active',
    passwordResetToken: null,
    passwordResetExpires: null
  },
  {
    id: '2',
    username: 'editor_logistics',
    email: 'editor@tbsgroup.vn',
    fullName: 'Nguyễn Văn Logistics',
    passwordHash: '$2b$10$example_hashed_password',
    role: 'editor',
    status: 'active',
    passwordResetToken: null,
    passwordResetExpires: null
  }
];

// GET - Verify reset token
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Token không hợp lệ' },
        { status: 400 }
      );
    }

    // Find user with this reset token
    const user = users.find(u => 
      u.passwordResetToken === token && 
      u.passwordResetExpires && 
      new Date(u.passwordResetExpires) > new Date()
    );

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Token không hợp lệ hoặc đã hết hạn' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Token hợp lệ',
      user: {
        email: user.email,
        fullName: user.fullName
      }
    });

  } catch (error) {
    console.error('Verify reset token error:', error);
    return NextResponse.json(
      { success: false, message: 'Lỗi hệ thống' },
      { status: 500 }
    );
  }
}

// POST - Reset password
export async function POST(request: Request) {
  try {
    const { token, password, confirmPassword } = await request.json();

    // Validate input
    if (!token || !password || !confirmPassword) {
      return NextResponse.json(
        { success: false, message: 'Vui lòng điền đầy đủ thông tin' },
        { status: 400 }
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { success: false, message: 'Mật khẩu xác nhận không khớp' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, message: 'Mật khẩu phải có ít nhất 6 ký tự' },
        { status: 400 }
      );
    }

    // Find user with this reset token
    const userIndex = users.findIndex(u => 
      u.passwordResetToken === token && 
      u.passwordResetExpires && 
      new Date(u.passwordResetExpires) > new Date()
    );

    if (userIndex === -1) {
      return NextResponse.json(
        { success: false, message: 'Token không hợp lệ hoặc đã hết hạn' },
        { status: 400 }
      );
    }

    const user = users[userIndex];

    // Hash password (in production, use bcrypt)
    const newPasswordHash = `$2b$10$new_hashed_${password}`;

    // Update user password and clear reset token
    users[userIndex] = {
      ...user,
      passwordHash: newPasswordHash,
      passwordResetToken: null,
      passwordResetExpires: null
    };

    console.log('🔐 Password Reset Successful:');
    console.log(`👤 User: ${user.fullName} (${user.email})`);
    console.log(`⏰ Reset at: ${new Date().toLocaleString('vi-VN')}`);

    // Send confirmation email
    await mockSendConfirmationEmail({
      to: user.email,
      fullName: user.fullName
    });

    return NextResponse.json({
      success: true,
      message: 'Mật khẩu đã được đặt lại thành công. Bạn có thể đăng nhập bằng mật khẩu mới.'
    });

  } catch (error) {
    console.error('Reset password error:', error);
    return NextResponse.json(
      { success: false, message: 'Lỗi hệ thống, vui lòng thử lại sau' },
      { status: 500 }
    );
  }
}

// Mock confirmation email
async function mockSendConfirmationEmail({ to, fullName }: { to: string; fullName: string }) {
  console.log('📧 Sending password reset confirmation email (MOCK):', {
    to,
    subject: 'Mật khẩu đã được đặt lại thành công - TBS GROUP',
    timestamp: new Date().toISOString()
  });

  // In production, send actual confirmation email
  await new Promise(resolve => setTimeout(resolve, 500));
} 