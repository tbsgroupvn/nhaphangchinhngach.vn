# 🚀 Hướng dẫn Setup CMS với Supabase Backend

Hệ thống CMS quản lý website nhaphangchinhngach.vn với Supabase làm backend database.

## 📋 Tổng quan

- **Frontend**: Next.js 14 + TypeScript + TailwindCSS
- **Backend**: Supabase (PostgreSQL)
- **Authentication**: JWT + bcrypt
- **Session**: HTTP-only cookies

## 🎯 Tính năng CMS

✅ **Quản lý người dùng**
- Phân quyền: Super Admin, Admin, Editor, Viewer
- Authentication với JWT
- Activity logging
- Session management

✅ **Quản lý nội dung**
- Posts (Bài viết)
- Services (Dịch vụ)
- Media Files (Ảnh, video, documents)
- Site Settings

✅ **Dashboard & Analytics**
- Thống kê real-time
- Google Analytics integration
- Content metrics

## 🔧 Bước 1: Tạo Supabase Project

### 1.1. Đăng ký Supabase

1. Truy cập: https://supabase.com
2. Đăng ký/Đăng nhập tài khoản
3. Tạo project mới: "TBS Group CMS"
4. Chọn region gần nhất (Singapore)
5. Tạo password cho database

### 1.2. Lấy API Keys

1. Vào project Settings → API
2. Copy các thông tin sau:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public key**: Dùng cho client-side
   - **service_role key**: Dùng cho server-side (BẢO MẬT!)

## 🗄️ Bước 2: Setup Database Schema

### 2.1. Run SQL Schema

1. Vào Supabase Dashboard
2. Click **SQL Editor** (menu bên trái)
3. Tạo New Query
4. Copy toàn bộ nội dung file `supabase-setup.sql` vào editor
5. Click **Run** để execute

File này sẽ tạo:
- ✅ All tables (users, posts, services, media_files, etc.)
- ✅ Indexes for performance
- ✅ Row Level Security (RLS) policies
- ✅ Triggers for auto-update timestamps
- ✅ Default admin user (username: admin, password: Anhcanem2015@)
- ✅ Default roles and permissions
- ✅ Storage bucket for media files

### 2.2. Verify Database

Kiểm tra các tables đã được tạo:
```sql
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public';
```

Bạn sẽ thấy:
- users
- roles
- permissions
- role_permissions
- user_sessions
- user_activities
- posts
- services
- media_files
- folders
- site_settings

## 🔐 Bước 3: Configure Environment Variables

### 3.1. Tạo file `.env.local`

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# JWT Secret (generate a random 32+ character string)
JWT_SECRET=your-very-secure-random-string-at-least-32-characters

# Site Configuration
NEXT_PUBLIC_SITE_URL=https://nhaphangchinhngach.vn
```

### 3.2. Generate JWT Secret

Tạo JWT secret ngẫu nhiên:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## 📦 Bước 4: Install Dependencies

```bash
npm install
```

Packages đã được cài:
- `@supabase/supabase-js`: Supabase client
- `bcryptjs`: Password hashing
- `jose`: JWT handling

## 🎨 Bước 5: Setup Storage Bucket

### 5.1. Tạo Storage Bucket

1. Vào Supabase Dashboard → **Storage**
2. Click **Create bucket**
3. Bucket name: `media`
4. Public bucket: ✅ Enable
5. Click Create

### 5.2. Configure Storage Policies

SQL policies đã được tạo tự động trong schema, nhưng bạn có thể verify:

1. Click vào bucket `media`
2. Vào **Policies** tab
3. Verify các policies:
   - Anyone can view (SELECT)
   - Authenticated users can upload (INSERT)
   - Users can update their own files (UPDATE)
   - Users can delete their own files (DELETE)

## 🚀 Bước 6: Chạy Application

### 6.1. Development Mode

```bash
npm run dev
```

### 6.2. Truy cập CMS

- **Login page**: http://localhost:3000/cms-login
- **Admin dashboard**: http://localhost:3000/admin/dashboard

### 6.3. Đăng nhập lần đầu

**Thông tin đăng nhập mặc định:**
- Username: `admin`
- Password: `Anhcanem2015@`

⚠️ **QUAN TRỌNG**: Đổi password ngay sau khi đăng nhập lần đầu!

## 📱 Bước 7: Testing

### 7.1. Test Authentication

1. Truy cập `/cms-login`
2. Đăng nhập với credentials mặc định
3. Verify redirect to `/admin/dashboard`
4. Test logout functionality

### 7.2. Test Database Connection

Kiểm tra logs trong browser console:
- Token được set trong cookies
- User data được load
- API calls thành công

### 7.3. Test Permissions

1. Tạo user mới với role khác nhau
2. Test access control
3. Verify RLS policies hoạt động

## 🔒 Bước 8: Security Checklist

### Production Security

- [ ] Đổi admin password mặc định
- [ ] Enable Row Level Security trên tất cả tables
- [ ] Set strong JWT_SECRET (32+ characters)
- [ ] Enable HTTPS cho production
- [ ] Restrict CORS settings
- [ ] Enable rate limiting trên API routes
- [ ] Regular backup database
- [ ] Monitor authentication logs
- [ ] Set up 2FA cho admin accounts (optional)

### Environment Variables

- [ ] Không commit `.env.local` vào git
- [ ] Sử dụng environment variables trên hosting platform
- [ ] Rotate keys định kỳ
- [ ] Separate dev/staging/production keys

## 📚 Cấu trúc Dự án

```
src/
├── app/
│   ├── admin/              # Admin pages
│   │   ├── dashboard/
│   │   ├── posts/
│   │   ├── services/
│   │   ├── media/
│   │   └── ...
│   ├── cms-login/          # CMS login page
│   └── api/
│       └── auth/           # Auth API routes
│           ├── cms-login/
│           ├── cms-logout/
│           └── cms-me/
├── lib/
│   └── supabase/           # Supabase utilities
│       ├── client.ts       # Client-side client
│       ├── server.ts       # Server-side client
│       ├── auth.ts         # Auth helpers
│       └── types.ts        # TypeScript types
├── contexts/
│   └── AuthContext.tsx     # Auth state management
└── middleware.ts           # Route protection
```

## 🎯 API Routes

### Authentication APIs

**POST** `/api/auth/cms-login`
```json
{
  "username": "admin",
  "password": "Anhcanem2015@"
}
```

**POST** `/api/auth/cms-logout`
- No body required
- Clears cookies

**GET** `/api/auth/cms-me`
- Returns current user info
- Requires valid JWT token

## 🛠️ Troubleshooting

### Issue: "Missing Supabase environment variables"

**Solution**:
- Kiểm tra file `.env.local` đã tạo
- Restart dev server sau khi thêm env vars

### Issue: "Authentication failed"

**Solution**:
- Verify database schema đã run thành công
- Check admin user đã được tạo:
  ```sql
  SELECT * FROM users WHERE username = 'admin';
  ```
- Verify password hash trong database

### Issue: "Permission denied for table users"

**Solution**:
- Enable RLS trên tables
- Verify policies đã được tạo
- Check service role key đang dùng đúng

### Issue: "Storage upload failed"

**Solution**:
- Verify bucket `media` đã tạo
- Check storage policies
- Verify user authenticated

## 📞 Support

### Useful Commands

**Check database connection:**
```bash
node -e "const { createClient } = require('@supabase/supabase-js'); const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY); supabase.from('users').select('count').then(console.log)"
```

**Generate new password hash:**
```bash
node scripts/generate-password-hash.js
```

### Supabase Dashboard

- **Tables**: Xem và edit data
- **SQL Editor**: Run queries
- **Logs**: Xem database logs
- **Storage**: Quản lý files
- **Authentication**: User management (nếu dùng Supabase Auth)

## 🎉 Hoàn thành!

CMS đã sẵn sàng sử dụng! Bạn có thể:

✅ Đăng nhập vào CMS
✅ Quản lý users và permissions
✅ Tạo và edit posts
✅ Quản lý services
✅ Upload và organize media files
✅ Configure site settings
✅ View analytics dashboard

## 📖 Next Steps

1. **Customize roles và permissions** theo nhu cầu
2. **Create more content types** nếu cần
3. **Setup automated backups** cho database
4. **Configure email notifications** (optional)
5. **Add more admin features** theo roadmap

## 🔄 Updates & Maintenance

### Update Admin Password

```sql
-- Generate new hash using bcrypt with rounds=10
-- Then update:
UPDATE users
SET password_hash = '$2b$10$new_hash_here'
WHERE username = 'admin';
```

### Add New Admin User

```sql
INSERT INTO users (username, email, full_name, password_hash, role, status, email_verified)
VALUES (
  'new_admin',
  'admin2@nhaphangchinhngach.vn',
  'Admin 2',
  '$2b$10$your_bcrypt_hash',
  'admin',
  'active',
  TRUE
);
```

### Backup Database

Sử dụng Supabase Dashboard:
1. Settings → Database
2. Click "Download backup"
3. Hoặc setup automated backups

---

**Version**: 1.0
**Last Updated**: 2024-12-31
**Author**: TBS GROUP Development Team
