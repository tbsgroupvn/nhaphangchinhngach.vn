# Hướng dẫn Setup Supabase Backend

Tài liệu này hướng dẫn bạn cách thiết lập backend Supabase cho trang web nhaphangchinhngach.vn.

## 📋 Mục lục

1. [Tạo dự án Supabase](#1-tạo-dự-án-supabase)
2. [Cấu hình Database](#2-cấu-hình-database)
3. [Thiết lập biến môi trường](#3-thiết-lập-biến-môi-trường)
4. [Migrate dữ liệu](#4-migrate-dữ-liệu)
5. [Kiểm tra kết nối](#5-kiểm-tra-kết-nối)
6. [Sử dụng CMS Admin](#6-sử-dụng-cms-admin)

---

## 1. Tạo dự án Supabase

### Bước 1.1: Đăng ký tài khoản Supabase

1. Truy cập https://supabase.com
2. Đăng ký/Đăng nhập với GitHub, Google, hoặc email
3. Tài khoản miễn phí cho phép:
   - 500MB database storage
   - 1GB file storage
   - 2GB bandwidth/tháng
   - Unlimited API requests

### Bước 1.2: Tạo project mới

1. Nhấn nút **"New Project"**
2. Điền thông tin:
   - **Name**: `nhaphangchinhngach` (hoặc tên bạn muốn)
   - **Database Password**: Tạo mật khẩu mạnh (lưu lại để sau này dùng)
   - **Region**: Chọn `Southeast Asia (Singapore)` cho tốc độ tốt nhất tại VN
   - **Pricing Plan**: Free (hoặc Pro nếu cần)
3. Nhấn **"Create new project"**
4. Đợi 1-2 phút để Supabase khởi tạo database

---

## 2. Cấu hình Database

### Bước 2.1: Chạy SQL Migration

1. Trong Supabase Dashboard, vào **SQL Editor** (icon ở sidebar bên trái)
2. Nhấn **"New query"**
3. Copy toàn bộ nội dung file `supabase/migrations/20260101000000_initial_schema.sql`
4. Paste vào SQL Editor
5. Nhấn **"Run"** (hoặc Ctrl/Cmd + Enter)
6. Kiểm tra output, đảm bảo không có lỗi

### Bước 2.2: Kiểm tra Tables

1. Vào **Table Editor** (icon ở sidebar)
2. Bạn sẽ thấy các bảng sau đã được tạo:
   - ✅ `users` - Quản lý người dùng
   - ✅ `posts` - Bài viết/tin tức
   - ✅ `services` - Dịch vụ
   - ✅ `customer_stories` - Câu chuyện khách hàng
   - ✅ `jobs` - Tuyển dụng
   - ✅ `media_files` - File media
   - ✅ `folders` - Thư mục
   - ✅ `site_settings` - Cài đặt website
   - ✅ `user_sessions` - Phiên đăng nhập
   - ✅ `user_activities` - Lịch sử hoạt động
   - ✅ `page_views` - Analytics tracking

---

## 3. Thiết lập biến môi trường

### Bước 3.1: Lấy thông tin Supabase

1. Trong Supabase Dashboard, vào **Settings** → **API**
2. Copy các thông tin sau:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon/public key**: `eyJhbGc...` (key dài)
   - **service_role key**: `eyJhbGc...` (key dài khác) - **⚠️ BẢO MẬT**

### Bước 3.2: Tạo file .env.local

1. Tại thư mục gốc của dự án, tạo file `.env.local`:

```bash
cp .env.example .env.local
```

2. Mở file `.env.local` và cập nhật:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...your_anon_key
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOi...your_service_role_key

# JWT Secret (generate random 32+ characters)
JWT_SECRET=your_random_jwt_secret_at_least_32_characters_long

# Site Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

⚠️ **LƯU Ý**:
- **KHÔNG** commit file `.env.local` lên Git
- `service_role` key có quyền admin, giữ bảo mật tuyệt đối
- Trên production (Netlify), thêm các biến này vào **Environment Variables**

---

## 4. Migrate dữ liệu

### Bước 4.1: Cài đặt dependencies

```bash
npm install dotenv ts-node @types/node
```

### Bước 4.2: Chạy migration script

```bash
npx ts-node scripts/migrate-to-supabase.ts
```

Script sẽ:
1. ✅ Tạo tài khoản admin mặc định
2. ✅ Migrate tất cả services từ markdown
3. ✅ Migrate tất cả posts/news
4. ✅ Migrate customer stories
5. ✅ Migrate jobs
6. ✅ Migrate site settings

### Bước 4.3: Kiểm tra dữ liệu

Vào **Table Editor** trong Supabase và kiểm tra:
- Bảng `users` có 1 user admin
- Bảng `services` có danh sách dịch vụ
- Bảng `posts` có các bài viết
- Các bảng khác có dữ liệu tương ứng

---

## 5. Kiểm tra kết nối

### Bước 5.1: Khởi động dev server

```bash
npm run dev
```

### Bước 5.2: Truy cập Admin Dashboard

1. Mở trình duyệt: http://localhost:3000/admin
2. Đăng nhập với:
   - **Username**: `admin`
   - **Password**: `Anhcanem2015@`
3. Vào Dashboard, bạn sẽ thấy:
   - ✅ Dữ liệu thực từ Supabase (không còn mock data)
   - ✅ Real-time view counts
   - ✅ Statistics chính xác

---

## 6. Sử dụng CMS Admin

### 6.1. Quản lý Services

- **Xem tất cả**: `/admin/services`
- **Thêm mới**: Nhấn nút "Add Service"
- **Chỉnh sửa**: Click vào service → Edit
- **Xóa**: Click Delete (có xác nhận)

### 6.2. Quản lý Posts/News

- **Xem tất cả**: `/admin/posts`
- **Tạo bài viết**: Nhấn "New Post"
- **Editor**: WYSIWYG editor (React Quill)
- **SEO**: Tự động tạo SEO fields

### 6.3. Analytics Dashboard

Dashboard tự động hiển thị:
- 📊 **Real-time visitors**: Số người đang online
- 📈 **Page views**: Lượt xem theo ngày (7 ngày gần nhất)
- 👥 **Unique visitors**: Số visitors duy nhất
- 🔥 **Popular content**: Nội dung được xem nhiều nhất

### 6.4. View Tracking

Tự động track khi user truy cập:
- Trang chủ
- Chi tiết services
- Chi tiết posts
- Các trang khác

Data được lưu vào bảng `page_views` trong Supabase.

---

## 📊 Database Schema Overview

```
users
├── id (UUID)
├── username
├── email
├── role (super_admin, admin, editor, viewer)
└── password_hash

posts
├── id (UUID)
├── title, slug, content
├── status (draft, published, archived)
├── views (tracked)
└── author_id → users

services
├── id (UUID)
├── title, slug, content
├── features (JSON)
└── order_index

page_views (Analytics)
├── page_path
├── visitor_id
├── ip_address
└── created_at
```

---

## 🚀 Production Deployment

### Netlify Environment Variables

Trong Netlify Dashboard → **Site settings** → **Environment variables**, thêm:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
JWT_SECRET=your_production_jwt_secret
NEXT_PUBLIC_SITE_URL=https://nhaphangchinhngach.vn
```

### Supabase Production Settings

1. **Row Level Security (RLS)**: Đã được enable cho tất cả bảng
2. **API Rate Limiting**: Mặc định là unlimited cho Free tier
3. **Backups**: Supabase tự động backup hàng ngày (Pro plan)

---

## 🔧 Troubleshooting

### Lỗi: "Missing Supabase environment variables"

**Giải pháp**: Kiểm tra file `.env.local` có đúng format và đã restart dev server

### Lỗi: "Failed to fetch statistics"

**Giải pháp**:
1. Kiểm tra Supabase project có đang active
2. Kiểm tra API keys đúng
3. Xem Console logs để debug

### Lỗi: "Row Level Security policy violation"

**Giải pháp**: RLS policies đã được thiết lập. Nếu gặp lỗi, tạm thời disable RLS:

```sql
ALTER TABLE public.posts DISABLE ROW LEVEL SECURITY;
```

### Migration script lỗi

**Giải pháp**:
1. Kiểm tra `.env.local` có `SUPABASE_SERVICE_ROLE_KEY`
2. Đảm bảo đã chạy SQL migration trước
3. Check logs để xem bảng nào bị lỗi

---

## 📞 Hỗ trợ

Nếu gặp vấn đề:

1. **Check logs**: Console browser + Terminal
2. **Supabase Dashboard**: Xem Table Editor, SQL Editor logs
3. **GitHub Issues**: Tạo issue tại repo dự án

---

## ✅ Checklist Setup Hoàn tất

- [ ] Tạo Supabase project
- [ ] Chạy SQL migration thành công
- [ ] Thiết lập `.env.local` với đúng keys
- [ ] Chạy migration script migrate dữ liệu
- [ ] Test login admin dashboard
- [ ] Kiểm tra data hiển thị đúng (không còn mock)
- [ ] Test tạo/sửa/xóa content
- [ ] Kiểm tra analytics tracking hoạt động
- [ ] Deploy lên production với environment variables

---

**Chúc mừng! 🎉** Backend Supabase của bạn đã sẵn sàng!
