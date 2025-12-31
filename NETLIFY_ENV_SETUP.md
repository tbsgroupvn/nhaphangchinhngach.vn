# Netlify Deployment Guide - Environment Variables

## ⚠️ QUAN TRỌNG: Environment Variables cho Netlify

Để deploy CMS lên Netlify, bạn cần cấu hình environment variables trong Netlify Dashboard.

### Bước 1: Truy cập Netlify Environment Variables

1. Đăng nhập vào Netlify Dashboard
2. Chọn site của bạn
3. Vào **Site settings** → **Environment variables**
4. Click **Add a variable** để thêm từng biến

### Bước 2: Thêm Supabase Environment Variables

Dựa trên Supabase credentials bạn đã cung cấp, thêm các biến sau:

#### NEXT_PUBLIC_SUPABASE_URL
```
Key: NEXT_PUBLIC_SUPABASE_URL
Value: https://ayeendyuwexxfcnvnroo.supabase.co
Scopes: All (Production, Deploy previews, Branch deploys)
```

#### NEXT_PUBLIC_SUPABASE_ANON_KEY
```
Key: NEXT_PUBLIC_SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF5ZWVuZHl1d2V4eGZjbnZucm9vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU2MTYyNzcsImV4cCI6MjA1MTE5MjI3N30.Vj53pwt5BWoIdKd2PNZkpw_mlsAQbAz
Scopes: All
```

#### SUPABASE_SERVICE_ROLE_KEY
```
Key: SUPABASE_SERVICE_ROLE_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF5ZWVuZHl1d2V4eGZjbnZucm9vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczNTYxNjI3NywiZXhwIjoyMDUxMTkyMjc3fQ.EpMZB6kM5R_OZkqg-TBQdQ_8npT-ark
Scopes: Production only (BẢO MẬT!)
```

#### JWT_SECRET
```
Key: JWT_SECRET
Value: c364664829bdbfcbbd8ca800d7c248243e593ef49339dc79a2d80d532d157e50
Scopes: Production only
```

#### NEXT_PUBLIC_SITE_URL
```
Key: NEXT_PUBLIC_SITE_URL
Value: https://nhaphangchinhngach.vn
Scopes: Production
```

Hoặc cho deploy preview:
```
Value: https://deploy-preview-[number]--your-site.netlify.app
Scopes: Deploy previews
```

### Bước 3: Redeploy Site

Sau khi thêm environment variables:

1. Vào **Deploys** tab
2. Click **Trigger deploy** → **Clear cache and deploy site**
3. Đợi build hoàn thành

### Bước 4: Verify Deployment

1. Truy cập site của bạn
2. Vào `/cms-login`
3. Test đăng nhập với:
   - Username: `admin`
   - Password: `Anhcanem2015@`

## 🔒 Security Notes

### ⚠️ CẢNH BÁO BẢO MẬT QUAN TRỌNG!

**KHÔNG BAO GIỜ** commit các giá trị sau vào Git:
- ❌ `SUPABASE_SERVICE_ROLE_KEY` - Đây là key có toàn quyền trên database!
- ❌ `JWT_SECRET` - Key để tạo authentication tokens
- ❌ `.env.local` hoặc `.env` files

**Bạn đã public service role key trong chat** - Điều này rất nguy hiểm!

### Khắc phục ngay:

1. **Regenerate Supabase Service Role Key:**
   ```
   - Vào Supabase Dashboard
   - Settings → API
   - Click "Reset" service_role key
   - Update key mới vào Netlify
   ```

2. **Regenerate JWT Secret:**
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

3. **Kiểm tra Git history:**
   - Đảm bảo không có secret keys trong git commits
   - Nếu có, cần rewrite git history hoặc rotate keys

### Best Practices

✅ **DOs:**
- Sử dụng Netlify Environment Variables cho secrets
- Rotate keys định kỳ (3-6 tháng)
- Separate keys cho dev/staging/production
- Enable Supabase database backups
- Monitor Supabase logs cho unusual activity

❌ **DON'Ts:**
- Commit `.env` files vào Git
- Share service_role key qua email/chat
- Use same keys across environments
- Hardcode secrets trong code

## 🛠️ Troubleshooting

### Build Error: "Type error: Property 'locked_until' does not exist"

**Fixed!** Đã fix lỗi TypeScript trong commit mới nhất.

### Error: "Missing Supabase environment variables"

**Solution:** Verify tất cả environment variables đã được add vào Netlify.

### Error: "Failed to authenticate"

**Solutions:**
1. Check database schema đã run trong Supabase SQL Editor
2. Verify admin user tồn tại:
   ```sql
   SELECT * FROM users WHERE username = 'admin';
   ```
3. Check password hash đúng trong database

### 403 Error khi login

**Solution:**
- Clear browser cookies
- Check JWT_SECRET đã được set
- Verify middleware configuration

## 📊 Monitoring

### Check Supabase Logs

1. Vào Supabase Dashboard
2. **Logs** → **Query Logs**
3. Monitor authentication attempts
4. Check for errors

### Check Netlify Function Logs

1. Netlify Dashboard → **Functions** tab
2. View API route logs
3. Debug authentication issues

## 🔄 Updates

Khi update code:

1. Push code lên GitHub
2. Netlify sẽ auto-deploy
3. Environment variables được giữ nguyên
4. No need to reconfigure (unless adding new vars)

---

**Version:** 1.0
**Last Updated:** 2024-12-31
**Important:** Always keep secrets secure! Never share service_role keys.
