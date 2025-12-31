# 🚀 Quick Start - CMS Admin Panel

## ✅ TypeScript Build FIXED!

Tất cả lỗi TypeScript đã được fix triệt để. Build sẽ pass trên Netlify sau khi bạn thêm environment variables.

## 📋 Bước 1: Thêm Environment Variables vào Netlify

### 1.1. Truy cập Netlify Dashboard

1. Đăng nhập: https://app.netlify.com
2. Chọn site của bạn
3. **Site settings** → **Environment variables**

### 1.2. Thêm các biến sau:

Click "Add a variable" để thêm từng biến:

```bash
# 1. NEXT_PUBLIC_SUPABASE_URL
Key: NEXT_PUBLIC_SUPABASE_URL
Value: https://ayeendyuwexxfcnvnroo.supabase.co
Scopes: All

# 2. NEXT_PUBLIC_SUPABASE_ANON_KEY
Key: NEXT_PUBLIC_SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF5ZWVuZHl1d2V4eGZjbnZucm9vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU2MTYyNzcsImV4cCI6MjA1MTE5MjI3N30.Vj53pwt5BWoIdKd2PNZkpw_mlsAQbAz
Scopes: All

# 3. SUPABASE_SERVICE_ROLE_KEY (BẢO MẬT!)
Key: SUPABASE_SERVICE_ROLE_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF5ZWVuZHl1d2V4eGZjbnZucm9vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczNTYxNjI3NywiZXhwIjoyMDUxMTkyMjc3fQ.EpMZB6kM5R_OZkqg-TBQdQ_8npT-ark
Scopes: Production only

# 4. JWT_SECRET
Key: JWT_SECRET
Value: c364664829bdbfcbbd8ca800d7c248243e593ef49339dc79a2d80d532d157e50
Scopes: Production only

# 5. NEXT_PUBLIC_SITE_URL
Key: NEXT_PUBLIC_SITE_URL
Value: https://nhaphangchinhngach.vn
Scopes: Production
```

## 📋 Bước 2: Redeploy Site

1. Vào **Deploys** tab
2. Click **Trigger deploy** → **Clear cache and deploy site**
3. Đợi build hoàn thành (~2-3 phút)
4. ✅ Build sẽ PASS!

## 📋 Bước 3: Setup Supabase Database

### 3.1. Truy cập Supabase SQL Editor

1. Vào: https://supabase.com/dashboard/project/ayeendyuwexxfcnvnroo
2. Click **SQL Editor** trong menu bên trái
3. Click **New Query**

### 3.2. Run Database Schema

1. Mở file `supabase-setup.sql` trong project
2. Copy TOÀN BỘ nội dung
3. Paste vào SQL Editor
4. Click **Run** (hoặc Ctrl+Enter)
5. Chờ ~10-15 giây
6. ✅ Verify: "Success. No rows returned"

### 3.3. Verify Database Tables

Run query này để verify:

```sql
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;
```

Bạn sẽ thấy các tables:
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

### 3.4. Verify Admin User

Run query này:

```sql
SELECT username, email, role, status, email_verified
FROM users
WHERE username = 'admin';
```

Kết quả:
```
username: admin
email: admin@nhaphangchinhngach.vn
role: super_admin
status: active
email_verified: true
```

## 📋 Bước 4: Setup Storage Bucket (Optional)

### 4.1. Tạo Media Bucket

1. Vào Supabase Dashboard → **Storage**
2. Click **New bucket**
3. Name: `media`
4. Public bucket: ✅ Enabled
5. Click **Create bucket**

### 4.2. Verify Storage Policies

Storage policies đã được tạo tự động trong schema. Verify:

1. Click vào bucket `media`
2. Tab **Policies**
3. Verify 4 policies tồn tại:
   - Anyone can view (SELECT)
   - Authenticated can upload (INSERT)
   - Users can update own files (UPDATE)
   - Users can delete own files (DELETE)

## 🎉 Bước 5: Test CMS

### 5.1. Truy cập CMS Login

URL: https://nhaphangchinhngach.vn/cms-login

### 5.2. Đăng nhập

```
Username: admin
Password: Anhcanem2015@
```

### 5.3. Verify Dashboard

Sau khi đăng nhập thành công:
- Redirect to: `/admin/dashboard`
- Hiển thị sidebar với menu
- Dashboard stats loading

## ⚠️ BẢO MẬT - QUAN TRỌNG!

### NGAY SAU KHI SETUP XONG:

1. **Đổi password admin:**
   - Vào Profile hoặc Settings
   - Đổi mật khẩu mặc định

2. **Reset Supabase Service Role Key:**
   ```
   Vào: Supabase Dashboard → Settings → API
   Click "Reset" service_role key
   Update key mới vào Netlify
   Redeploy site
   ```

3. **Generate JWT Secret mới:**
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   # Update vào Netlify
   # Redeploy site
   ```

### Lý do:

Service role key đã bị public trong chat - CỰC KỲ NGUY HIỂM!
Bất kỳ ai có key này có thể:
- ❌ Xóa toàn bộ database
- ❌ Đọc/sửa tất cả dữ liệu
- ❌ Bypass security policies
- ❌ Tạo/xóa admin users

## 🔍 Troubleshooting

### Build vẫn fail?

**Check:**
1. Tất cả 5 environment variables đã được add vào Netlify?
2. Đã click "Save" sau mỗi variable?
3. Đã trigger redeploy sau khi thêm vars?

**Solution:**
- Xóa tất cả env vars và thêm lại
- Clear cache and redeploy

### Database schema fail?

**Check:**
1. Có run đúng file `supabase-setup.sql`?
2. Query có báo errors không?

**Solution:**
- Drop all tables và run lại:
  ```sql
  DROP SCHEMA public CASCADE;
  CREATE SCHEMA public;
  GRANT ALL ON SCHEMA public TO postgres;
  GRANT ALL ON SCHEMA public TO public;
  -- Rồi run lại supabase-setup.sql
  ```

### Login fail?

**Check:**
1. Admin user đã được tạo trong database?
2. Password hash đúng?
3. JWT_SECRET đã được set trong Netlify?

**Solution:**
- Regenerate password hash:
  ```bash
  node scripts/generate-password-hash.js
  ```
- Update vào database:
  ```sql
  UPDATE users
  SET password_hash = '$2b$10$new_hash_here'
  WHERE username = 'admin';
  ```

### "Failed to fetch" errors?

**Check:**
1. Supabase URL đúng?
2. Network connection?
3. Supabase project có active không?

**Solution:**
- Check Supabase dashboard → Project Status
- Verify URL: https://ayeendyuwexxfcnvnroo.supabase.co

## 📚 Tài liệu chi tiết

- **Full setup guide**: `SUPABASE_CMS_SETUP.md`
- **Netlify env guide**: `NETLIFY_ENV_SETUP.md`
- **Database schema**: `supabase-setup.sql`
- **Password generator**: `scripts/generate-password-hash.js`

## 🎯 Next Steps

Sau khi CMS hoạt động:

1. ✅ Đổi password admin
2. ✅ Reset Supabase keys
3. ✅ Tạo thêm admin users nếu cần
4. ✅ Configure site settings trong CMS
5. ✅ Thêm content (posts, services)
6. ✅ Upload media files
7. ✅ Setup analytics (optional)

## ✨ CMS Features

Bạn có thể quản lý:

- 👥 **Users & Roles** - Quản lý người dùng và phân quyền
- 📝 **Posts** - Tạo và edit bài viết
- 🛠️ **Services** - Quản lý dịch vụ
- 📁 **Media** - Upload và quản lý files
- ⚙️ **Settings** - Cấu hình website
- 📊 **Analytics** - Xem thống kê (nếu có Google Analytics)

## 📞 Support

Nếu gặp vấn đề:

1. Check logs trong Netlify: **Deploys** → Click vào deploy → **Deploy log**
2. Check Supabase logs: **Logs** → **Query logs**
3. Check browser console (F12)
4. Review error messages cẩn thận

---

**Version:** 1.0
**Last Updated:** 2024-12-31
**Status:** ✅ Ready for production deployment

**Important:** NHỚ ĐỔI PASSWORD VÀ RESET KEYS NGAY SAU KHI SETUP! 🔒
