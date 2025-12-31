# 🔧 CMS Login 404 Error - Troubleshooting

## Vấn đề: Truy cập `/cms-login` bị 404

### ✅ Giải pháp nhanh:

#### 1. **Kiểm tra URL đúng:**

```
❌ WRONG: https://nhaphangchinhngach.vn/cms-login/  (có dấu / cuối)
✅ RIGHT: https://nhaphangchinhngach.vn/cms-login   (không có dấu / cuối)
```

#### 2. **Test page debug:**

Truy cập: https://nhaphangchinhngach.vn/test-cms

- Nếu test page hiển thị → App Router working, vấn đề chỉ ở `/cms-login`
- Nếu test page cũng 404 → Vấn đề với deployment

#### 3. **Clear cache:**

```bash
# Browser cache
Ctrl + Shift + R (Windows/Linux)
Cmd + Shift + R (Mac)

# Hoặc thử incognito mode
```

#### 4. **Trigger redeploy:**

1. Vào Netlify Dashboard
2. **Deploys** tab
3. **Trigger deploy** → **Clear cache and deploy site**
4. Đợi build xong (2-3 phút)
5. Test lại

### 🔍 Debug Steps:

#### A. Check Netlify Deploy Logs:

1. Netlify Dashboard → **Deploys**
2. Click vào deploy mới nhất
3. Xem **Deploy log**
4. Tìm errors:

```
❌ Build failed
❌ Missing files
❌ TypeScript errors
```

#### B. Verify Files Deployed:

Check trong deploy log xem có thấy:
```
✅ Route (app) /cms-login
✅ Route (app) /test-cms
✅ Route (app) /admin/dashboard
```

#### C. Check Netlify Functions:

1. Netlify Dashboard → **Functions**
2. Verify API routes tồn tại:
   - `POST /api/auth/cms-login`
   - `POST /api/auth/cms-logout`
   - `GET /api/auth/cms-me`

### 🛠️ Advanced Troubleshooting:

#### 1. Check Build Output:

Trong Netlify deploy log, tìm section:

```
Route (app)                             Size
┌ ○ /                                   X kB
├ ○ /cms-login                          X kB   <-- Phải có dòng này!
├ ○ /test-cms                           X kB
└ ● /admin/dashboard                    X kB
```

#### 2. Verify Environment Variables:

Netlify Dashboard → Site settings → Environment variables

Phải có:
```
✅ NEXT_PUBLIC_SUPABASE_URL
✅ NEXT_PUBLIC_SUPABASE_ANON_KEY
✅ SUPABASE_SERVICE_ROLE_KEY
✅ JWT_SECRET
✅ NEXT_PUBLIC_SITE_URL
```

#### 3. Check Middleware:

Middleware config trong `src/middleware.ts`:

```typescript
export const config = {
  matcher: [
    '/admin/:path*',
    '/cms-login'  // <-- Phải có này
  ],
}
```

#### 4. Test Local Build:

```bash
# Local test
npm run build
npm run start

# Truy cập: http://localhost:3000/cms-login
```

### 🚨 Common Issues:

#### Issue 1: "Page Not Found" hoặc 404

**Nguyên nhân:**
- File chưa được deploy
- Build bị skip page
- Middleware blocking

**Giải pháp:**
```bash
# 1. Clear .next cache
rm -rf .next

# 2. Rebuild
npm run build

# 3. Check output
npm run start
```

#### Issue 2: Netlify Deploy Failed

**Nguyên nhân:**
- TypeScript errors
- Missing env vars
- Build timeout

**Giải pháp:**
1. Check deploy logs
2. Fix TypeScript errors
3. Add missing env vars
4. Increase build timeout (if needed)

#### Issue 3: Redirects Not Working

**Nguyên nhân:**
- Netlify config not updated
- Cache not cleared

**Giải pháp:**
```toml
# netlify.toml
[[redirects]]
  from = "/cms-login/"
  to = "/cms-login"
  status = 301
```

### ✅ Verification Checklist:

Before contacting support:

- [ ] Tried URL without trailing slash: `/cms-login`
- [ ] Tested debug page: `/test-cms`
- [ ] Cleared browser cache
- [ ] Tried incognito mode
- [ ] Checked Netlify deploy logs
- [ ] Verified environment variables
- [ ] Triggered new deploy
- [ ] Waited for deploy to complete (2-3 min)

### 🎯 Alternative Access Methods:

If `/cms-login` still doesn't work, you can:

#### Option 1: Use Admin Login
```
URL: /admin
Middleware will redirect unauthenticated users to /cms-login
```

#### Option 2: Direct API Test
```javascript
// Browser console
fetch('/api/auth/cms-login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    username: 'admin',
    password: 'Anhcanem2015@'
  })
})
.then(r => r.json())
.then(console.log)
```

#### Option 3: Create Alternative Login Route

Create `/login` page:
```typescript
// src/app/login/page.tsx
import { redirect } from 'next/navigation'
export default function LoginRedirect() {
  redirect('/cms-login')
}
```

### 📞 Still Not Working?

#### Collect This Info:

1. **Deploy URL:**
   ```
   https://nhaphangchinhngach.vn
   ```

2. **Deploy ID:**
   ```
   Found in: Netlify Dashboard → Deploys → [Latest Deploy ID]
   ```

3. **Error Message:**
   ```
   Screenshot of 404 page
   Browser console errors (F12 → Console)
   ```

4. **Test Results:**
   ```
   /cms-login → 404
   /test-cms → ?
   /admin → ?
   /api/auth/cms-login → ?
   ```

5. **Deploy Log:**
   ```
   Copy relevant errors from Netlify deploy log
   ```

### 🔄 Last Resort:

If nothing works, redeploy from scratch:

```bash
# 1. Delete .next and node_modules
rm -rf .next node_modules

# 2. Fresh install
npm install

# 3. Build locally
npm run build

# 4. Test locally
npm run start

# 5. If local works, push to trigger Netlify redeploy
git commit --allow-empty -m "Trigger redeploy"
git push
```

---

**Quick Links:**
- Test page: https://nhaphangchinhngach.vn/test-cms
- Login page: https://nhaphangchinhngach.vn/cms-login
- Netlify Dashboard: https://app.netlify.com
- Supabase Dashboard: https://supabase.com/dashboard

**Updated:** 2024-12-31
