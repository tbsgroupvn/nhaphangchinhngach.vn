# TBS GROUP - Hướng dẫn Setup Netlify CMS

## ✅ Đã Fix và Hoàn thành

### 1. **Cấu trúc Content đã được tạo**
```
content/
├── customer-stories/     # Câu chuyện khách hàng
├── jobs/                 # Tuyển dụng  
├── news/                 # Tin tức
├── pages/                # Trang tĩnh (Homepage, About, Contact)
├── policies/             # Chính sách
├── services/             # Dịch vụ
└── settings/             # Cài đặt site
    ├── general.json      # Cài đặt chung
    ├── navigation.json   # Menu điều hướng
    └── footer.json       # Footer
```

### 2. **Cấu hình CMS đã được tối ưu**
- ✅ Fixed `config.yml` với collections đầy đủ
- ✅ Cập nhật URLs cho domain mới
- ✅ Disabled local_backend cho production
- ✅ Cấu hình Git Gateway authentication
- ✅ Thêm preview mode
- ✅ Tối ưu field validations

### 3. **Sample Content đã tạo**
- ✅ Homepage content
- ✅ About page  
- ✅ Contact page
- ✅ Sample service (Nhập khẩu chính ngạch)
- ✅ Sample job posting
- ✅ Navigation settings
- ✅ Footer settings

## 🚀 Bước Setup trên Netlify

### Step 1: Enable Identity
1. Vào Netlify Dashboard > Site settings
2. Go to **Identity** tab
3. Click **Enable Identity**
4. Set **Registration preferences** to "Invite only" 
5. Enable **Git Gateway**

### Step 2: Configure Identity Settings
```
Registration: Invite only
External providers: GitHub (optional)
Git Gateway: Enabled
Roles: admin, editor
```

### Step 3: Invite Users
1. Go to Identity tab
2. Click **Invite users**
3. Add email addresses for admin users
4. Users will receive invitation emails

### Step 4: Access CMS
- CMS URL: `https://nhaphangchinhngach.vn/admin`
- Login with invited user credentials
- Start managing content!

## 📋 CMS Collections Available

### 📝 **Content Collections**
1. **Dịch vụ** (`/content/services/`)
   - Quản lý các dịch vụ xuất nhập khẩu
   - Fields: title, description, image, pricing, etc.

2. **Tin tức** (`/content/news/`)
   - Quản lý bài viết tin tức
   - Categories: cam-nang-xnk, nganh, tuyen-dung, hoat-dong-cong-ty

3. **Tuyển dụng** (`/content/jobs/`)
   - Đăng tin tuyển dụng
   - Fields: position, salary, requirements, benefits

4. **Câu chuyện khách hàng** (`/content/customer-stories/`)
   - Case studies và testimonials
   - Fields: customer info, rating, story content

5. **Chính sách** (`/content/policies/`)
   - Các chính sách công ty
   - Types: privacy, terms, shipping, return

### 🛠️ **Site Settings**
1. **Trang** (Pages)
   - Homepage settings
   - About page content
   - Contact information

2. **Cài đặt chung** (General Settings)
   - Site name, description, URLs
   - SEO settings
   - Brand colors

3. **Menu điều hướng** (Navigation)
   - Main menu configuration
   - Dropdown submenus

4. **Footer**
   - Footer content and links
   - Social media links

## 🎯 Các tính năng CMS

### ✅ **Editor Features**
- Rich text editor với Markdown
- Image upload và management
- Live preview
- Draft/Published status
- SEO fields tích hợp

### ✅ **Media Management**
- Upload images to `/public/images/`
- Automatic optimization
- Organized folder structure

### ✅ **Workflow**
- Draft → Review → Publish
- Version control với Git
- Automatic backups

### ✅ **Vietnamese Interface**
- Hoàn toàn bằng tiếng Việt
- Custom field labels
- Intuitive navigation

## 🔧 Troubleshooting

### Authentication Issues
```bash
# Check if Identity is enabled
- Go to Netlify Dashboard > Identity
- Ensure Git Gateway is enabled
- Check user invitation status
```

### Content Not Showing
```bash
# Verify file structure
- Check content folders exist
- Verify frontmatter format
- Check file permissions
```

### Local Development
```bash
# Run CMS locally
npm run dev
# Visit: http://localhost:3000/admin
# Local backend will be enabled automatically
```

## 📞 Support

### CMS Access
- **URL**: https://nhaphangchinhngach.vn/admin
- **Authentication**: Netlify Identity
- **Backup**: Auto-saved to Git

### Technical Support
- Check Netlify logs for errors
- Verify configuration in `public/admin/config.yml`
- Test authentication flow

## 🎉 Ready to Use!

TBS GROUP Netlify CMS is now fully configured with:
- ✅ Complete content management
- ✅ Vietnamese interface
- ✅ Secure authentication
- ✅ Media management
- ✅ SEO optimization
- ✅ Mobile responsive admin
- ✅ Git-based workflow

**Start managing your content at**: `/admin` 

# 🔧 Hướng dẫn Cài đặt Netlify CMS với Auth0

## 📋 Tổng quan

Netlify CMS hiện đã được cập nhật để sử dụng Auth0 cho authentication. Hướng dẫn này sẽ giúp bạn cài đặt và cấu hình CMS cho website TBS GROUP.

## 🚀 Bước 1: Cấu hình Netlify Identity với Auth0

### 1.1. Truy cập Netlify Dashboard
1. Đăng nhập vào [Netlify Dashboard](https://app.netlify.com)
2. Chọn site `nhaphangchinhngach.vn`
3. Vào **Site settings** → **Identity**

### 1.2. Enable Identity
1. Click **Enable Identity**
2. Chọn **Registration preferences** → **Invite only** (Chỉ mời)
3. Trong **External providers**, enable **GitHub** và **Google** (nếu cần)

### 1.3. Cấu hình Auth0 (Mới)
1. Trong **Identity settings**, scroll xuống **Auth0 Integration**
2. Nếu có sẵn option Auth0, click **Enable Auth0**
3. Hoặc sử dụng **Git Gateway** (recommended) - click **Enable Git Gateway**

### 1.4. Services Settings
1. **Git Gateway**: Enable để kết nối với GitHub
2. **Form notifications**: Có thể enable để nhận email khi có form submit

## 🎯 Bước 2: Invite Admin Users

### 2.1. Mời người dùng
1. Trong **Identity** tab, click **Invite users**
2. Nhập email của admin: `admin@nhaphangchinhngach.vn`
3. Chọn role nếu có (hoặc để trống)
4. Click **Send invite**

### 2.2. Chấp nhận lời mời
1. Kiểm tra email (có thể trong spam)
2. Email sẽ có dạng từ Netlify hoặc Auth0
3. Click link trong email
4. Đăng ký và tạo password

## 🔒 Bước 3: Truy cập CMS

### 3.1. Đăng nhập CMS
1. Truy cập: `https://nhaphangchinhngach.vn/admin/`
2. Nếu chưa đăng nhập, click **🚀 Đăng nhập vào CMS**
3. Sử dụng tài khoản đã được invite

### 3.2. Troubleshooting Authentication
Nếu gặp vấn đề đăng nhập:

1. **Kiểm tra trang test**: `https://nhaphangchinhngach.vn/admin/test.html`
2. **Clear browser cache** và thử lại
3. **Kiểm tra console** (F12) để xem lỗi
4. **Thử incognito mode**

## 📊 Bước 4: Quản lý Nội dung

### 4.1. Các Collection có sẵn
- **Dịch vụ**: Quản lý các dịch vụ logistics
- **Tin tức**: Bài viết và tin tức công ty
- **Tuyển dụng**: Đăng tin tuyển dụng
- **Câu chuyện khách hàng**: Testimonials
- **Chính sách**: Điều khoản, chính sách
- **Trang**: Homepage, About, Contact
- **Cài đặt**: Cấu hình site

### 4.2. Thêm nội dung mới
1. Chọn collection từ sidebar
2. Click **New [Collection]**
3. Điền thông tin
4. **Save** hoặc **Publish**

### 4.3. Edit nội dung
1. Click vào item muốn edit
2. Chỉnh sửa trong editor
3. **Save** để lưu draft
4. **Publish** để xuất bản

## 🛠️ Bước 5: Auth0 Configuration (Nâng cao)

### 5.1. Nếu cần custom Auth0
```yaml
# public/admin/config.yml
backend:
  name: github
  repo: your-username/your-repo
  branch: main
  base_url: https://api.netlify.com
  auth_endpoint: auth
  
# Auth0 specific settings
auth:
  providers:
    - name: auth0
      domain: your-domain.auth0.com
      client_id: your-client-id
```

### 5.2. Environment Variables
Trong Netlify Dashboard → Site settings → Environment variables:

```bash
AUTH0_DOMAIN=your-domain.auth0.com
AUTH0_CLIENT_ID=your-client-id
AUTH0_CLIENT_SECRET=your-client-secret
```

## 🔍 Debug và Troubleshooting

### Debug Authentication
1. Mở **Developer Tools** (F12)
2. Vào **Console** tab
3. Refresh trang `/admin/`
4. Xem logs:
   - ✅ User authenticated
   - ❌ User not authenticated
   - 🔧 Debug information

### Common Issues

#### 1. Email không nhận được invitation
- Kiểm tra spam folder
- Thử invite lại với email khác
- Kiểm tra Netlify Identity có enabled không

#### 2. "Failed to authenticate" error
- Clear browser cache
- Disable browser extensions
- Thử incognito mode
- Kiểm tra Git Gateway enabled

#### 3. CMS không load
- Kiểm tra `config.yml` syntax
- Xem console errors
- Thử trang test: `/admin/test.html`

#### 4. Cannot save content
- Kiểm tra Git Gateway connection
- Verify GitHub permissions
- Check repository access

## 📝 Workflow Làm việc

### 1. Content Creation Workflow
1. **Draft** → Write content, save as draft
2. **Review** → Preview và check
3. **Publish** → Xuất bản lên site

### 2. Collaboration
- Multiple admins có thể work simultaneously
- Git-based workflow with commit history
- Automatic backups via GitHub

### 3. Content Types
- **Markdown**: Cho long-form content
- **JSON**: Cho structured data
- **Images**: Upload qua media library

## 🎨 Customization

### UI Language
CMS đã được cấu hình tiếng Việt:
```javascript
CMS.registerLocale('vi', {
  // Vietnamese translations
});
```

### Custom Styling
CSS custom trong `public/admin/index.html`:
- TBS GROUP branding
- Modern gradient design
- Responsive layout

## 📱 Mobile Support
- CMS responsive trên mobile
- Touch-friendly interface
- Mobile-optimized editor

## 🔐 Security Best Practices

1. **Invite Only**: Chỉ invite trusted users
2. **Regular Audits**: Check user access periodically  
3. **Two-Factor Auth**: Enable nếu Auth0 support
4. **Strong Passwords**: Require complex passwords
5. **Session Management**: Regular logout/login

## 📞 Support

Nếu gặp vấn đề:
1. Check console logs
2. Try test page: `/admin/test.html`
3. Clear cache và thử lại
4. Contact admin nếu cần thiết

---

**✅ CMS Setup Complete!**
Website: `https://nhanhangchinhngach.vn/admin/`
Test: `https://nhaphangchinhngach.vn/admin/test.html` 