# 🚀 Google Drive Quick Setup - TBS GROUP

## ✅ Client ID đã có!
Bạn đã có Google OAuth Client ID: `70358246843-rrmoltblkeen4d8e1ldo2oi8omatuprv.apps.googleusercontent.com`

## 🔧 Cấu hình ngay

### Bước 1: Tạo file `.env.local`
Tạo file `.env.local` trong thư mục gốc project:

```env
# Google Drive API Configuration
NEXT_PUBLIC_GOOGLE_CLIENT_ID=70358246843-rrmoltblkeen4d8e1ldo2oi8omatuprv.apps.googleusercontent.com
NEXT_PUBLIC_GOOGLE_API_KEY=your_google_api_key_here
```

### Bước 2: Lấy Google API Key
1. Truy cập [Google Cloud Console](https://console.cloud.google.com/)
2. Chọn project đã tạo Google OAuth Client ID
3. Vào **APIs & Services** > **Credentials**
4. Click **+ CREATE CREDENTIALS** > **API Key**
5. Copy API Key và thay vào `your_google_api_key_here`

### Bước 3: Cấu hình Domain Authorization
Trong Google Cloud Console:
1. Vào **APIs & Services** > **Credentials**
2. Click vào OAuth 2.0 Client ID của bạn
3. Thêm **Authorized JavaScript origins**:
   ```
   http://localhost:3000
   http://localhost:3001
   https://nhaphangchinhngach.vn
   https://nhaphangchinhngach.vercel.app
   https://nhaphangchinhngach.netlify.app
   ```

### Bước 4: Enable Google Drive API
1. Vào **APIs & Services** > **Library**
2. Tìm kiếm "Google Drive API"
3. Click **Enable**

### Bước 5: Test Integration
```bash
# Start development server
npm run dev

# Navigate to admin media page
# http://localhost:3000/admin/media

# Click "Kết nối Google Drive"
# Should open Google OAuth login
```

## 🎯 Kết quả

Sau khi setup xong, bạn sẽ có:
- ✅ Google Drive authentication
- ✅ Automatic folder creation
- ✅ File upload to Google Drive
- ✅ Real-time sync
- ✅ 15GB free storage

## 🔒 Bảo mật

Client ID này chỉ được phép:
- Truy cập files do app tạo ra
- Không thể đọc files cá nhân
- Scope giới hạn: `https://www.googleapis.com/auth/drive.file`

## 🚨 Lưu ý quan trọng

1. **Không public** Client ID này trên GitHub
2. **Chỉ sử dụng** cho TBS GROUP project
3. **Backup** credentials này ở nơi an toàn
4. **Monitor** usage trong Google Cloud Console

## 📞 Hỗ trợ

Nếu gặp lỗi:
1. Kiểm tra API key có đúng không
2. Verify domain authorization
3. Check browser console errors
4. Restart development server

**Ready to go! 🚀** 