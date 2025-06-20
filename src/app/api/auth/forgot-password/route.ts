import { NextResponse } from 'next/server';
import { randomBytes } from 'crypto';

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

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    // Validate input
    if (!email) {
      return NextResponse.json(
        { success: false, message: 'Email không được để trống' },
        { status: 400 }
      );
    }

    // Find user by email
    const userIndex = users.findIndex(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (userIndex === -1) {
      // Don't reveal if email exists or not for security
      return NextResponse.json({
        success: true,
        message: 'Nếu email tồn tại trong hệ thống, bạn sẽ nhận được email hướng dẫn đặt lại mật khẩu trong vài phút.'
      });
    }

    const user = users[userIndex];

    // Check if account is active
    if (user.status !== 'active') {
      return NextResponse.json({
        success: true,
        message: 'Nếu email tồn tại trong hệ thống, bạn sẽ nhận được email hướng dẫn đặt lại mật khẩu trong vài phút.'
      });
    }

    // Generate reset token
    const resetToken = randomBytes(32).toString('hex');
    const resetExpires = new Date(Date.now() + 3600000); // 1 hour from now

    // Update user with reset token
    users[userIndex] = {
      ...user,
      passwordResetToken: resetToken,
      passwordResetExpires: resetExpires.toISOString()
    };

    // In production, send email here
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001'}/admin/reset-password?token=${resetToken}`;
    
    console.log('🔐 Password Reset Request:');
    console.log(`📧 Email: ${email}`);
    console.log(`🔗 Reset URL: ${resetUrl}`);
    console.log(`⏰ Expires: ${resetExpires.toLocaleString('vi-VN')}`);

    // Mock email sending
    await mockSendEmail({
      to: email,
      subject: 'Đặt lại mật khẩu - TBS GROUP Admin',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #dc2626, #b91c1c); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px;">TBS GROUP</h1>
            <p style="color: #fca5a5; margin: 10px 0 0 0;">Hệ thống quản lý</p>
          </div>
          
          <div style="padding: 30px; background: #f9fafb;">
            <h2 style="color: #374151; margin: 0 0 20px 0;">Đặt lại mật khẩu</h2>
            
            <p style="color: #6b7280; line-height: 1.6;">
              Chào <strong>${user.fullName}</strong>,
            </p>
            
            <p style="color: #6b7280; line-height: 1.6;">
              Bạn đã yêu cầu đặt lại mật khẩu cho tài khoản admin TBS GROUP. 
              Click vào nút bên dưới để tiếp tục:
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}" 
                 style="background: linear-gradient(135deg, #dc2626, #b91c1c); 
                        color: white; 
                        padding: 15px 30px; 
                        text-decoration: none; 
                        border-radius: 8px; 
                        font-weight: bold;
                        display: inline-block;">
                Đặt lại mật khẩu
              </a>
            </div>
            
            <p style="color: #9ca3af; font-size: 14px; line-height: 1.6;">
              Hoặc copy link sau vào trình duyệt:<br>
              <span style="background: #e5e7eb; padding: 5px; border-radius: 4px; word-break: break-all;">
                ${resetUrl}
              </span>
            </p>
            
            <div style="border-top: 1px solid #e5e7eb; margin: 30px 0; padding-top: 20px;">
              <p style="color: #ef4444; font-size: 14px; font-weight: bold;">
                ⚠️ Lưu ý bảo mật:
              </p>
              <ul style="color: #6b7280; font-size: 14px; line-height: 1.6;">
                <li>Link này chỉ có hiệu lực trong <strong>1 giờ</strong></li>
                <li>Nếu bạn không yêu cầu đặt lại mật khẩu, hãy bỏ qua email này</li>
                <li>Không chia sẻ link này với bất kỳ ai</li>
              </ul>
            </div>
          </div>
          
          <div style="background: #374151; padding: 20px; text-align: center;">
            <p style="color: #9ca3af; margin: 0; font-size: 12px;">
              © 2024 TBS GROUP. All rights reserved.<br>
              Email được gửi tự động, vui lòng không reply.
            </p>
          </div>
        </div>
      `
    });

    return NextResponse.json({
      success: true,
      message: 'Email hướng dẫn đặt lại mật khẩu đã được gửi. Vui lòng kiểm tra hộp thư của bạn.'
    });

  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { success: false, message: 'Lỗi hệ thống, vui lòng thử lại sau' },
      { status: 500 }
    );
  }
}

// Mock email sending function
async function mockSendEmail({ to, subject, html }: { to: string; subject: string; html: string }) {
  // In production, integrate with email service like:
  // - Nodemailer + SMTP
  // - SendGrid
  // - AWS SES
  // - Resend
  
  console.log('📧 Sending email (MOCK):', {
    to,
    subject,
    timestamp: new Date().toISOString()
  });

  // Simulate email sending delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return Promise.resolve();
} 