import nodemailer from 'nodemailer'

// Email configuration - có thể dùng Gmail, Outlook, hoặc SMTP của bạn
const EMAIL_CONFIG = {
  // Sử dụng Gmail SMTP (bạn có thể thay đổi thành SMTP khác)
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER || 'your-email@gmail.com', // Email của bạn
    pass: process.env.EMAIL_PASSWORD || 'your-app-password'  // App password của Gmail
  }
}

// Tạo transporter
const transporter = nodemailer.createTransport(EMAIL_CONFIG)

export interface EmailOptions {
  to: string
  name?: string
  subject?: string
  template?: 'welcome' | 'newsletter'
}

// Template email chào mừng
function getWelcomeEmailTemplate(name: string, email: string) {
  const displayName = name || 'Khách hàng thân mến'
  
  return {
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Chào mừng đến với TBS GROUP</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
          .button { display: inline-block; background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .highlight { background: #e3f2fd; padding: 15px; border-left: 4px solid #2196f3; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Chào mừng đến với TBS GROUP!</h1>
            <p>Cảm ơn bạn đã quan tâm đến dịch vụ của chúng tôi</p>
          </div>
          
          <div class="content">
            <p>Xin chào <strong>${displayName}</strong>,</p>
            
            <p>Chúng tôi rất vui mừng chào đón bạn đến với cộng đồng TBS GROUP! Bạn đã đăng ký thành công để nhận tin tức và cập nhật mới nhất từ chúng tôi.</p>
            
            <div class="highlight">
              <strong>✅ Email của bạn:</strong> ${email}<br>
              <strong>📅 Thời gian đăng ký:</strong> ${new Date().toLocaleString('vi-VN')}<br>
              <strong>📧 Tình trạng:</strong> Đã kích hoạt thành công
            </div>
            
            <h3>🌟 Bạn sẽ nhận được:</h3>
            <ul>
              <li>📈 Tin tức mới nhất về ngành xuất nhập khẩu</li>
              <li>💡 Xu hướng thị trường và cơ hội kinh doanh</li>
              <li>🎁 Ưu đãi đặc biệt dành riêng cho khách hàng</li>
              <li>📋 Hướng dẫn và tư vấn chuyên sâu</li>
              <li>🚀 Thông tin về dịch vụ mới của TBS GROUP</li>
            </ul>
            
            <div style="text-align: center;">
              <a href="https://xuatnhapkhautbs.vn" class="button">Khám phá dịch vụ của chúng tôi</a>
            </div>
            
            <h3>🤝 Về TBS GROUP</h3>
            <p>TBS GROUP là đơn vị hàng đầu trong lĩnh vực dịch vụ xuất nhập khẩu, vận tải và logistics tại Việt Nam. Với nhiều năm kinh nghiệm, chúng tôi cam kết mang đến cho khách hàng:</p>
            <ul>
              <li>Dịch vụ chuyên nghiệp và uy tín</li>
              <li>Giá cả cạnh tranh</li>
              <li>Hỗ trợ 24/7</li>
              <li>Mạng lưới toàn cầu</li>
            </ul>
            
            <p>Nếu bạn có bất kỳ câu hỏi nào, đừng ngần ngại liên hệ với chúng tôi:</p>
            <ul>
              <li>📞 <strong>Hotline:</strong> 1900-xxxx</li>
              <li>📧 <strong>Email:</strong> info@xuatnhapkhautbs.vn</li>
              <li>🌐 <strong>Website:</strong> https://xuatnhapkhautbs.vn</li>
              <li>📍 <strong>Địa chỉ:</strong> [Địa chỉ văn phòng]</li>
            </ul>
          </div>
          
          <div class="footer">
            <p>© 2025 TBS GROUP. All rights reserved.</p>
            <p>Email này được gửi đến ${email} vì bạn đã đăng ký nhận tin từ TBS GROUP.</p>
            <p style="font-size: 12px; color: #999;">
              Nếu bạn không muốn nhận email này nữa, vui lòng liên hệ với chúng tôi để hủy đăng ký.
            </p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
      Chào mừng đến với TBS GROUP!
      
      Xin chào ${displayName},
      
      Cảm ơn bạn đã đăng ký nhận tin tức từ TBS GROUP! 
      
      Email của bạn: ${email}
      Thời gian đăng ký: ${new Date().toLocaleString('vi-VN')}
      
      Bạn sẽ nhận được:
      - Tin tức mới nhất về ngành xuất nhập khẩu
      - Xu hướng thị trường và cơ hội kinh doanh  
      - Ưu đãi đặc biệt dành riêng cho khách hàng
      - Hướng dẫn và tư vấn chuyên sâu
      
      Liên hệ với chúng tôi:
      - Hotline: 1900-xxxx
      - Email: info@xuatnhapkhautbs.vn
      - Website: https://xuatnhapkhautbs.vn
      
      Trân trọng,
      TBS GROUP Team
    `
  }
}

// Hàm gửi email chào mừng
export async function sendWelcomeEmail({ to, name }: EmailOptions) {
  try {
    console.log('📧 Preparing welcome email for:', to)
    
    const { html, text } = getWelcomeEmailTemplate(name || '', to)
    
    const mailOptions = {
      from: {
        name: 'TBS GROUP',
        address: EMAIL_CONFIG.auth.user
      },
      to: to,
      subject: '🎉 Chào mừng bạn đến với TBS GROUP - Đăng ký thành công!',
      html: html,
      text: text
    }
    
    console.log('📧 Sending welcome email...')
    const result = await transporter.sendMail(mailOptions)
    
    console.log('✅ Welcome email sent successfully!')
    console.log('📧 Message ID:', result.messageId)
    
    return {
      success: true,
      messageId: result.messageId,
      recipient: to
    }
    
  } catch (error) {
    console.error('❌ Failed to send welcome email:', error)
    throw error
  }
}

// Hàm test email configuration
export async function testEmailConnection() {
  try {
    console.log('🔧 Testing email connection...')
    await transporter.verify()
    console.log('✅ Email connection test successful!')
    return true
  } catch (error) {
    console.error('❌ Email connection test failed:', error)
    throw error
  }
}

const emailService = {
  sendWelcomeEmail,
  testEmailConnection
}

export default emailService 