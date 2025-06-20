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