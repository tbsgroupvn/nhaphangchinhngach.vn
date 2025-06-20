# 🚀 Google Drive Integration Setup Guide

## Tổng quan
Hệ thống admin TBS GROUP đã được tích hợp với Google Drive để lưu trữ media files một cách hiệu quả và miễn phí.

## ✅ Tính năng Google Drive Integration

### 🎯 Chức năng chính
- **Tự động sync**: Files được upload tự động lưu trên Google Drive
- **Folder structure**: Tự động tạo cấu trúc thư mục TBS GROUP
- **Real-time sync**: Đồng bộ files giữa admin interface và Google Drive
- **Unlimited storage**: Sử dụng không gian lưu trữ Google Drive (15GB miễn phí)
- **Drag & drop upload**: Kéo thả files trực tiếp vào interface
- **File management**: Xem, tìm kiếm, quản lý files từ admin panel

### 📁 Cấu trúc thư mục tự động
```
TBS GROUP Media/
├── Hình ảnh/
├── Banner & Slides/
├── Logo & Branding/
├── Ảnh dịch vụ/
├── Tài liệu/
├── Video/
└── Uploads/
```

## 🛠️ Cài đặt Google Drive API

### Bước 1: Tạo Google Cloud Project
1. Truy cập [Google Cloud Console](https://console.cloud.google.com/)
2. Tạo project mới hoặc chọn project hiện tại
3. Đặt tên project: "TBS GROUP Media Manager"

### Bước 2: Enable Google Drive API
1. Vào **APIs & Services** > **Library**
2. Tìm kiếm "Google Drive API" 
3. Click **Enable**

### Bước 3: Tạo Credentials
1. Vào **APIs & Services** > **Credentials**
2. Click **+ CREATE CREDENTIALS** > **API Key**
3. Copy API Key và lưu lại
4. Click **+ CREATE CREDENTIALS** > **OAuth 2.0 Client IDs**
5. Chọn **Web application**
6. Thêm **Authorized JavaScript origins**:
   ```
   http://localhost:3000
   https://yourdomain.com
   ```
7. Copy Client ID và lưu lại

### Bước 4: Cấu hình Environment Variables
Tạo file `.env.local` trong root directory:

```env
# Google Drive API Configuration
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id_here
NEXT_PUBLIC_GOOGLE_API_KEY=your_google_api_key_here
```

## 🔧 Sử dụng Google Drive Integration

### Đăng nhập Google Drive
1. Vào trang **Admin** > **Media**
2. Click **"Kết nối Google Drive"**
3. Đăng nhập tài khoản Google
4. Cấp quyền truy cập Google Drive
5. Hệ thống sẽ tự động tạo folder structure

### Upload Files
1. Click **"Upload Files"** hoặc drag & drop
2. Chọn files từ máy tính
3. Files sẽ tự động upload lên Google Drive
4. Hiển thị ngay trong Media Manager

### Sync & Quản lý
- **Auto Sync**: Files tự động đồng bộ khi upload
- **Manual Sync**: Click nút "Sync Drive" để đồng bộ thủ công
- **View Files**: Xem files dạng grid hoặc list
- **Search**: Tìm kiếm files theo tên hoặc tags
- **Filter**: Lọc theo loại file và folder

## 🔐 Bảo mật & Quyền truy cập

### Scope Permissions
```javascript
scope: 'https://www.googleapis.com/auth/drive.file'
```
- **drive.file**: Chỉ truy cập files được tạo bởi ứng dụng
- **Không truy cập**: Files cá nhân khác trong Google Drive

### OAuth 2.0 Flow
1. User authentication thông qua Google
2. Secure token exchange
3. Limited scope access
4. Automatic token refresh

## 📊 Storage & Performance

### Lưu trữ
- **Google Drive**: 15GB miễn phí cho mỗi tài khoản
- **Upgrade**: Google One plans cho thêm storage
- **File types**: Hỗ trợ tất cả định dạng (images, videos, documents)

### Performance
- **CDN**: Google Drive tự động optimize delivery
- **Thumbnails**: Tự động generate thumbnails cho images
- **Streaming**: Support video streaming
- **Caching**: Browser caching cho faster load times

## 🚀 Production Deployment

### Vercel/Netlify Configuration
```toml
# netlify.toml
[build.environment]
  NEXT_PUBLIC_GOOGLE_CLIENT_ID = "your_client_id"
  NEXT_PUBLIC_GOOGLE_API_KEY = "your_api_key"
```

### Domain Authorization
Thêm production domain vào Google Cloud Console:
```
https://nhaphangchinhngach.vercel.app
https://nhaphangchinhngach.netlify.app
```

## 🔧 Troubleshooting

### Common Issues

#### 1. "API Key not valid" Error
```javascript
// Kiểm tra API key trong .env.local
NEXT_PUBLIC_GOOGLE_API_KEY=your_actual_api_key
```

#### 2. "Origin not allowed" Error
- Thêm domain vào Authorized JavaScript origins
- Restart development server sau khi thay đổi env

#### 3. "Sign in failed" Error
```javascript
// Kiểm tra Client ID
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_actual_client_id
```

#### 4. Upload fails
- Kiểm tra internet connection
- Verify Google Drive permissions
- Check file size limits (5TB max per file)

### Debug Mode
Enable debug logging:
```javascript
// In browser console
localStorage.setItem('debug', 'google-drive:*')
```

## 📱 Mobile Support

### Responsive Design
- Touch-friendly drag & drop
- Mobile-optimized upload interface
- Adaptive grid layouts

### PWA Features
- Offline file caching
- Background sync
- Push notifications for upload status

## 🎯 Best Practices

### File Organization
```
📁 Logo & Branding/
  ├── logo-main.png
  ├── logo-white.png
  └── favicon.ico

📁 Banner & Slides/
  ├── homepage-banner.jpg
  ├── service-banner.jpg
  └── contact-banner.jpg

📁 Ảnh dịch vụ/
  ├── import-service.jpg
  ├── export-service.jpg
  └── logistics-service.jpg
```

### File Naming Convention
- **Descriptive names**: `tbs-logo-main.png` thay vì `image1.png`
- **No spaces**: Sử dụng `-` thay vì spaces
- **Lowercase**: Tất cả filename lowercase
- **Date prefix**: `2024-12-20-news-image.jpg` cho content có thời gian

### Performance Optimization
- **Image compression**: Optimize images trước khi upload
- **Consistent sizing**: Sử dụng standard sizes (1920x1080, 800x600, etc.)
- **WebP format**: Sử dụng WebP cho web images
- **Alt text**: Luôn có description cho accessibility

## 🔄 Backup & Recovery

### Automatic Backup
- Files được lưu trên Google Drive = automatic backup
- Google Drive có version history
- Trash recovery trong 30 ngày

### Export Options
```javascript
// Export all files metadata
const exportData = {
  files: mediaFiles,
  folders: folderStructure,
  exportDate: new Date().toISOString()
}
```

## 📈 Analytics & Monitoring

### Usage Tracking
- Upload success/failure rates
- Storage usage monitoring
- Popular file types
- User access patterns

### Performance Metrics
- Upload speed
- Sync latency
- Error rates
- User satisfaction

## 🎉 Conclusion

Google Drive integration mang lại:
- ✅ **Free storage**: 15GB miễn phí
- ✅ **Reliability**: 99.9% uptime guarantee
- ✅ **Security**: Enterprise-grade security
- ✅ **Scalability**: Dễ dàng scale up storage
- ✅ **Integration**: Seamless với existing workflow
- ✅ **Backup**: Automatic backup và recovery

**Kết quả**: Media management system professional, cost-effective và scalable cho TBS GROUP! 