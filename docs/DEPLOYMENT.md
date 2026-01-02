# 🚀 Deployment Guide - TBS Group CMS

Complete guide to deploy the Next.js CMS with Supabase backend.

---

## 📋 Prerequisites

- [Supabase](https://supabase.com) account
- [Netlify](https://netlify.com) account (or Vercel)
- Node.js 18+ installed
- Git repository access

---

## 1️⃣ SUPABASE SETUP

### Step 1: Create Supabase Project

1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Click **New Project**
3. Fill in:
   - **Name**: `tbs-cms` (or your choice)
   - **Database Password**: Generate strong password (save it!)
   - **Region**: Select closest to your users
4. Wait for project initialization (~2 minutes)

### Step 2: Get API Credentials

1. Go to **Settings** → **API**
2. Copy these values:
   ```
   Project URL: https://xxxxx.supabase.co
   anon public key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   service_role key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

⚠️ **IMPORTANT**: Never expose `service_role` key to frontend!

### Step 3: Run Database Migrations

**Option A: Using Supabase CLI (Recommended)**

```bash
# Install Supabase CLI
npm install -g supabase

# Login
supabase login

# Link to your project
cd /path/to/project
supabase link --project-ref xxxxx

# Run migrations
supabase db push
```

**Option B: Manual via SQL Editor**

1. Go to **SQL Editor** in Supabase Dashboard
2. Run each migration file in order:
   ```
   supabase/migrations/20260102020000_create_tables.sql
   supabase/migrations/20260102100000_add_rbac_tables.sql
   supabase/migrations/20260102110000_create_rbac_functions.sql
   supabase/migrations/20260102120000_seed_rbac_data.sql
   supabase/migrations/20260102130000_fix_posts_author_reference.sql
   supabase/migrations/20260102140000_setup_storage.sql
   ```

### Step 4: Verify Database

Check tables exist:
```sql
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;
```

Expected tables:
- `users_profile`
- `roles`, `permissions`, `role_permissions`, `user_roles`
- `posts`, `services`, `media_files`
- `audit_logs`

### Step 5: Setup Storage Bucket

1. Go to **Storage** in Supabase Dashboard
2. Verify bucket `cms-media` exists
3. Check settings:
   - **Public**: ✅ Yes
   - **File size limit**: 50 MB
   - **Allowed MIME types**: images, videos, documents

---

## 2️⃣ CREATE SUPER ADMIN

### Step 1: Create User in Supabase Auth

1. Go to **Authentication** → **Users**
2. Click **Add user**
3. Fill in:
   - **Email**: `admin@yourdomain.com`
   - **Password**: Generate strong password
   - **Auto Confirm Email**: ✅ Yes
4. Click **Create user**
5. **Copy the User ID** (UUID format: `abc123-def456-...`)

### Step 2: Assign Super Admin Role

**Option A: Using SQL Editor**

```sql
-- Replace <USER_ID> with the UUID you copied
SELECT assign_role_to_user(
  '<USER_ID>'::uuid,
  'super_admin',
  '<USER_ID>'::uuid
);
```

**Option B: Using Script (Local)**

```bash
# Install dependencies
npm install

# Run script
npx tsx scripts/create-super-admin.ts <USER_ID>
```

### Step 3: Verify

```sql
-- Check user roles
SELECT
  up.email,
  r.code as role_code,
  r.name as role_name
FROM users_profile up
JOIN user_roles ur ON up.id = ur.user_id
JOIN roles r ON ur.role_id = r.id
WHERE up.email = 'admin@yourdomain.com';
```

---

## 3️⃣ NETLIFY DEPLOYMENT

### Step 1: Connect Repository

1. Go to [https://app.netlify.com](https://app.netlify.com)
2. Click **Add new site** → **Import an existing project**
3. Choose **GitHub** and authorize
4. Select repository: `tbsgroupvn/nhaphangchinhngach.vn`
5. Configure build settings:
   - **Branch**: `main` (or your branch)
   - **Build command**: `npm run build`
   - **Publish directory**: `.next`

### Step 2: Configure Environment Variables

Go to **Site settings** → **Environment variables**, add:

```bash
# Supabase (Public - safe for client)
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Supabase (Secret - server only!)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Site Configuration
NEXT_PUBLIC_SITE_URL=https://your-site.netlify.app

# Optional: JWT Secret (if using custom auth)
JWT_SECRET=your-random-secret-32-chars-minimum
```

⚠️ **CRITICAL**:
- ✅ `NEXT_PUBLIC_*` variables are exposed to browser (public data only)
- ❌ `SUPABASE_SERVICE_ROLE_KEY` must NEVER have `NEXT_PUBLIC_` prefix!

### Step 3: Deploy

1. Click **Deploy site**
2. Wait for build (~3-5 minutes)
3. Check deployment logs for errors
4. Visit your site URL

### Step 4: Configure Custom Domain (Optional)

1. Go to **Domain settings**
2. Click **Add custom domain**
3. Follow DNS configuration instructions

---

## 4️⃣ VERIFY DEPLOYMENT

### Test Checklist

- [ ] **Public Website**
  - Visit: `https://your-site.netlify.app`
  - Should load without errors

- [ ] **Admin Login**
  - Visit: `https://your-site.netlify.app/admin`
  - Login with super admin email/password
  - Should see dashboard

- [ ] **RBAC**
  - Go to **Roles** page
  - Should see 4 roles: super_admin, admin, editor, viewer

- [ ] **Users**
  - Go to **Users** page
  - Should see your super admin user

- [ ] **Create Test Post**
  - Go to **Posts** → **Create**
  - Fill in title, slug, content
  - Save as draft
  - Publish
  - Check public site: `https://your-site.netlify.app/posts/<slug>`

- [ ] **Upload Media**
  - Go to **Media Library**
  - Upload an image
  - Should see in list
  - Copy URL and check it loads

- [ ] **API Endpoints**
  - Test: `https://your-site.netlify.app/api/public/posts`
  - Should return JSON with published posts

---

## 5️⃣ TROUBLESHOOTING

### Build Fails on Netlify

**Error**: `Module not found: '@supabase/supabase-js'`

**Solution**:
```bash
npm install @supabase/supabase-js @supabase/ssr
git commit -am "fix: add missing dependencies"
git push
```

### API Routes Return 500

**Check**:
1. Environment variables are set correctly
2. `SUPABASE_SERVICE_ROLE_KEY` does NOT have `NEXT_PUBLIC_` prefix
3. Netlify function logs: **Functions** → Select endpoint → View logs

### Login Fails

**Check**:
1. User exists in Supabase Auth
2. Email is confirmed
3. User has role assigned
4. Browser console for errors

### Media Upload Fails

**Check**:
1. Storage bucket `cms-media` exists
2. Bucket is public
3. RLS policies are enabled
4. File size < 50MB
5. File type is allowed

### Permission Denied Errors

**Check**:
```sql
-- Verify user has permissions
SELECT p.code, p.description
FROM user_roles ur
JOIN role_permissions rp ON ur.role_id = rp.role_id
JOIN permissions p ON rp.permission_id = p.id
WHERE ur.user_id = '<USER_ID>';
```

---

## 6️⃣ MAINTENANCE

### Update Migrations

```bash
# Create new migration
supabase migration new add_feature_x

# Edit the generated SQL file
# Then push
supabase db push
```

### Backup Database

1. Go to **Database** → **Backups**
2. Click **Create backup**
3. Download SQL dump

### Monitor Usage

- **Supabase Dashboard** → **Usage**
- Check: Database size, API requests, Storage usage
- Free tier limits: 500MB DB, 1GB storage, 50,000 monthly active users

---

## 7️⃣ PRODUCTION CHECKLIST

Before going live:

- [ ] Custom domain configured
- [ ] SSL certificate active (auto via Netlify)
- [ ] All environment variables set
- [ ] Super admin created and tested
- [ ] At least 1 test user per role (admin, editor, viewer)
- [ ] Sample content created (posts, services)
- [ ] Media uploads working
- [ ] Public pages rendering correctly
- [ ] SEO meta tags verified
- [ ] Error tracking setup (Sentry recommended)
- [ ] Analytics setup (Google Analytics optional)
- [ ] Database backups scheduled
- [ ] Team access configured (Supabase + Netlify)

---

## 📞 SUPPORT

- **Supabase Docs**: https://supabase.com/docs
- **Netlify Docs**: https://docs.netlify.com
- **Next.js Docs**: https://nextjs.org/docs
- **Issues**: https://github.com/tbsgroupvn/nhaphangchinhngach.vn/issues

---

**Last Updated**: 2026-01-02
**Version**: 1.0.0
