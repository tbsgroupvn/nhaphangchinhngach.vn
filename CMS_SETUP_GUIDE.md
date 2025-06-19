# Hướng dẫn Netlify CMS - TBS GROUP Website

## 🎯 Tổng quan

Netlify CMS đã được tích hợp vào website TBS GROUP với giao diện tiếng Việt, giúp admin quản lý nội dung dễ dàng không cần biết code.

## 📁 File Structure

```
tbs-group-website/
├── public/admin/
│   ├── index.html      # Giao diện Netlify CMS
│   └── config.yml      # Cấu hình CMS
├── content/            # Nội dung website
├── src/app/admin/cms/  # Trang CMS tích hợp
└── next.config.js      # Cấu hình rewrite
```

## 🚀 Cách truy cập CMS

### Local Development
```bash
# Chạy dev server
npm run dev

# Truy cập CMS
http://localhost:3000/admin/cms
http://localhost:3000/admin/index.html
```

### Production
```
https://tbs-group.netlify.app/admin/
```

## 🧪 Test CMS Local

### Cách 1: Development Server
```bash
npm run dev
# Vào: http://localhost:3000/admin/cms
```

### Cách 2: Static Build + Live Server
```bash
# Build static
npm run build
npm run export

# Chạy live-server
npx live-server out
# Vào: http://127.0.0.1:8080/admin/
```

### Cách 3: Static Build + Python Server
```bash
npm run build && npm run export
cd out
python -m http.server 8000
# Vào: http://localhost:8000/admin/
```

## 🔧 Troubleshooting

### ❌ Lỗi 404 khi vào /admin/

**Nguyên nhân**: File static không được serve đúng

**Giải pháp**:
1. Kiểm tra file exists:
   ```bash
   ls -la public/admin/
   ```

2. Test truy cập trực tiếp:
   ```
   http://localhost:3000/admin/index.html
   ```

3. Kiểm tra cấu hình Next.js:
   ```javascript
   // next.config.js
   async rewrites() {
     return [
       {
         source: '/admin/cms',
         destination: '/admin/index.html'
       }
     ]
   }
   ```

### ❌ CMS không load

**Nguyên nhân**: 
- Config file lỗi syntax
- Network issue
- CSP headers

**Giải pháp**:
1. Validate config YAML:
   ```bash
   cat public/admin/config.yml
   ```

2. Check browser console errors

3. Try direct access: `/admin/index.html`

### ❌ Iframe không hiển thị

**Nguyên nhân**: X-Frame-Options header

**Giải pháp**:
1. Cập nhật next.config.js:
   ```javascript
   async headers() {
     return [
       {
         source: '/admin/(.*)',
         headers: [
           {
             key: 'X-Frame-Options',
             value: 'SAMEORIGIN'
           }
         ]
       }
     ]
   }
   ```

2. Thử mở tab mới: `/admin/index.html`

## 🎛️ Tính năng CMS

### 1. Quản lý Dịch vụ
- ✅ Tạo/sửa/xóa dịch vụ
- ✅ Upload hình ảnh
- ✅ Phân loại danh mục
- ✅ Cấu hình giá/thời gian

### 2. Quản lý Tin tức
- ✅ Viết bài markdown
- ✅ Phân loại category
- ✅ Quản lý tags
- ✅ Lập lịch publish

### 3. Quản lý Tuyển dụng
- ✅ Đăng tin tuyển dụng
- ✅ Thiết lập deadline
- ✅ Quản lý salary/requirements

### 4. Cài đặt Website
- ✅ Thông tin chung
- ✅ Menu navigation
- ✅ Footer settings
- ✅ SEO config

## 🌐 Deploy lên Netlify

### 1. Netlify Identity Setup
```bash
# Trong Netlify Dashboard:
# 1. Site Settings > Identity
# 2. Enable Identity service
# 3. Set Registration > Invite only
# 4. Enable Git Gateway
```

### 2. Build Settings
```toml
# netlify.toml
[build]
  command = "npm run build && npm run export"
  publish = "out"

[[headers]]
  for = "/admin/*"
  [headers.values]
    X-Frame-Options = "SAMEORIGIN"
```

### 3. Environment Variables
```bash
# Netlify Dashboard > Site Settings > Environment Variables
NETLIFY_SITE_ID = "your-site-id"
```

## 🔐 Authentication

### Local (Development)
- Không cần authentication
- File được lưu trực tiếp

### Production (Netlify)
- Cần setup Netlify Identity
- Login qua GitHub OAuth
- Content được commit vào Git

## 💡 Best Practices

### Content Management
- ✅ Dùng slug SEO-friendly
- ✅ Optimize images trước upload
- ✅ Backup content thường xuyên
- ✅ Preview trước khi publish

### Performance
- ✅ Compress images < 1MB
- ✅ Dùng WebP format
- ✅ Tối ưu markdown content
- ✅ Monitor loading speed

### Security
- ✅ Limit user access
- ✅ Regular backup
- ✅ Monitor change logs
- ✅ Secure credentials

## 📝 Workflow

### 1. Tạo nội dung mới
1. Vào CMS: `/admin/cms`
2. Chọn Collection
3. Click "New [Item]"
4. Điền form
5. Save Draft/Publish

### 2. Chỉnh sửa content
1. Vào Collection
2. Click item cần sửa
3. Edit content
4. Save changes

### 3. Upload media
1. Vào Media Library
2. Upload files
3. Copy URL
4. Use in content

## 🆘 Support

### Documentation
- [Netlify CMS Docs](https://www.netlifycms.org/docs/)
- [Widget Reference](https://www.netlifycms.org/docs/widgets/)

### TBS GROUP Support
- 📧 Email: tech@tbs-group.vn
- 📞 Phone: 0363 212 333
- 🔗 Help: `/admin/help`

### Common Issues
- **404 Error**: Check file paths and rewrite config
- **Config Error**: Validate YAML syntax
- **Load Error**: Check network and console logs
- **Auth Error**: Setup Netlify Identity properly

---

**💡 Tip**: Luôn test local trước khi deploy production! 