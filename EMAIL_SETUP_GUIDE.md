# 📧 Hướng dẫn cấu hình Email Service cho TBS GROUP Website

## 🎯 Mục đích
Gửi email chào mừng tự động cho khách hàng khi họ đăng ký newsletter.

## 🛠️ Cấu hình Email

### 1. Tạo file `.env.local`
Tạo file `.env.local` trong thư mục root của project và thêm các biến môi trường:

```bash
# Email Configuration
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password

# Company Information (optional)
COMPANY_NAME=TBS GROUP
COMPANY_EMAIL=info@xuatnhapkhautbs.vn
COMPANY_WEBSITE=https://xuatnhapkhautbs.vn
COMPANY_HOTLINE=1900-xxxx
COMPANY_ADDRESS=Địa chỉ văn phòng của bạn
```

### 2. Cấu hình Gmail (Khuyến nghị)

#### Bước 1: Bật 2-Factor Authentication
1. Đăng nhập vào Gmail
2. Vào [Google Account Security](https://myaccount.google.com/security)
3. Bật "2-Step Verification"

#### Bước 2: Tạo App Password
1. Vào [App Passwords](https://myaccount.google.com/apppasswords)
2. Chọn "Mail" và thiết bị của bạn
3. Copy password được tạo ra
4. Dán vào `EMAIL_PASSWORD` trong file `.env.local`

### 3. Các nhà cung cấp email khác

#### Microsoft Outlook/Hotmail
```bash
EMAIL_USER=your-email@outlook.com
EMAIL_PASSWORD=your-password
EMAIL_HOST=smtp-mail.outlook.com
EMAIL_PORT=587
```

#### Yahoo Mail
```bash
EMAIL_USER=your-email@yahoo.com
EMAIL_PASSWORD=your-app-password
EMAIL_HOST=smtp.mail.yahoo.com
EMAIL_PORT=587
```

#### Custom SMTP Server
```bash
EMAIL_USER=your-email@yourdomain.com
EMAIL_PASSWORD=your-password
EMAIL_HOST=smtp.yourdomain.com
EMAIL_PORT=587
```

## 🚀 Test Email Service

### Tạo script test email
Tạo file `test-email.js`:

```javascript
const { sendWelcomeEmail, testEmailConnection } = require('./src/services/emailService.ts')

async function testEmail() {
  try {
    // Test connection
    console.log('Testing email connection...')
    await testEmailConnection()
    
    // Send test email
    console.log('Sending test email...')
    await sendWelcomeEmail({
      to: 'test@example.com', // Thay bằng email thật để test
      name: 'Test User'
    })
    
    console.log('✅ Email test successful!')
  } catch (error) {
    console.error('❌ Email test failed:', error)
  }
}

testEmail()
```

Chạy test:
```bash
node test-email.js
```

## 📋 Template Email

Email chào mừng bao gồm:
- 🎉 Lời chào mừng cá nhân hóa
- ✅ Xác nhận thông tin đăng ký
- 🌟 Danh sách lợi ích sẽ nhận được
- 🤝 Thông tin về TBS GROUP
- 📞 Thông tin liên hệ
- 🔗 Link đến website

## 🔧 Troubleshooting

### Lỗi phổ biến:

#### "Invalid login"
- Kiểm tra EMAIL_USER và EMAIL_PASSWORD
- Đảm bảo đã bật 2FA và tạo App Password (Gmail)
- Kiểm tra "Less secure app access" (nếu cần)

#### "Connection timeout"
- Kiểm tra EMAIL_HOST và EMAIL_PORT
- Đảm bảo firewall không block SMTP

#### "Authentication failed"
- Gmail: Sử dụng App Password thay vì password thường
- Outlook: Bật "Modern authentication"

## 📊 Monitoring

Email logs sẽ xuất hiện trong console của Next.js:
- ✅ Email sent successfully
- ❌ Failed to send email
- 📧 Message ID cho tracking

## 🔒 Bảo mật

- **KHÔNG** commit file `.env.local` vào Git
- Sử dụng App Passwords thay vì password chính
- Giới hạn quyền truy cập SMTP nếu có thể
- Monitor email logs để phát hiện lạm dụng

## 🎯 Tích hợp hoàn tất

Sau khi cấu hình xong:
1. Khách hàng đăng ký newsletter → Email được lưu vào Larksuite Base
2. Hệ thống tự động gửi email chào mừng
3. Response API sẽ có thông tin `emailSent: true/false`

### Response API mẫu:
```json
{
  "success": true,
  "message": "Đăng ký nhận tin thành công! Email chào mừng đã được gửi!",
  "recordId": "recXXXXXX",
  "email": "customer@example.com",
  "source": "larksuite",
  "emailSent": true
}
```

## 📞 Hỗ trợ

Nếu gặp vấn đề, vui lòng:
1. Kiểm tra logs trong terminal
2. Verify email credentials
3. Test với email cá nhân trước
4. Liên hệ team support nếu cần thiết 