# Supabase Backend Setup Guide

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Initial Setup](#initial-setup)
3. [Running Migrations](#running-migrations)
4. [Environment Configuration](#environment-configuration)
5. [Authentication Setup](#authentication-setup)
6. [Storage Configuration](#storage-configuration)
7. [Testing the Setup](#testing-the-setup)
8. [Production Deployment](#production-deployment)
9. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before you begin, ensure you have:

- ✅ Node.js 18+ installed
- ✅ npm or yarn package manager
- ✅ Supabase account (free tier is sufficient)
- ✅ Git for version control
- ✅ Basic understanding of PostgreSQL

---

## Initial Setup

### 1. Create Supabase Project

1. Go to [Supabase Dashboard](https://app.supabase.com/)
2. Click "New Project"
3. Fill in project details:
   - **Project Name**: TBS Group CMS
   - **Database Password**: Generate a strong password (save it!)
   - **Region**: Choose closest to your users
4. Wait for project initialization (~2 minutes)

### 2. Get Project Credentials

From your Supabase project dashboard:

1. Go to **Settings → API**
2. Copy the following values:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon/public key**: Your public API key
   - **service_role key**: Your admin API key (keep secret!)

3. Go to **Settings → Database**
4. Copy **Connection string** (you'll need this for migrations)

### 3. Install Supabase CLI (Optional but Recommended)

```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref your-project-ref
```

---

## Running Migrations

### Method 1: Using Supabase Dashboard (Easiest)

1. Go to **SQL Editor** in your Supabase dashboard
2. Open each migration file in order:
   - `supabase/migrations/20260102010000_enable_extensions.sql`
   - `supabase/migrations/20260102020000_create_tables.sql`
   - `supabase/migrations/20260102030000_create_indexes.sql`
   - `supabase/migrations/20260102040000_create_functions.sql`
   - `supabase/migrations/20260102050000_create_triggers.sql`
   - `supabase/migrations/20260102060000_create_rls_policies.sql`
   - `supabase/migrations/20260102070000_create_views.sql`
   - `supabase/migrations/20260102080000_seed_initial_data.sql`
   - `supabase/migrations/20260102090000_storage_setup.sql`

3. Copy and paste each file's content into the SQL Editor
4. Click "Run" for each migration
5. Verify success messages in console

### Method 2: Using Supabase CLI

```bash
# Apply all migrations
supabase db push

# Or apply migrations individually
supabase db execute -f supabase/migrations/20260102010000_enable_extensions.sql
supabase db execute -f supabase/migrations/20260102020000_create_tables.sql
# ... continue for all migrations
```

### Method 3: Using PostgreSQL Client

```bash
# Connect to database
psql "postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"

# Run migrations
\i supabase/migrations/20260102010000_enable_extensions.sql
\i supabase/migrations/20260102020000_create_tables.sql
# ... continue for all migrations
```

---

## Environment Configuration

### 1. Update .env File

Create or update `.env.local`:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...your-anon-key
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...your-service-role-key

# Database Direct Connection (for migrations)
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres

# JWT Secret (from Supabase Settings → API)
SUPABASE_JWT_SECRET=your-jwt-secret

# Application Settings
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

### 2. Update Site Settings in Database

After running migrations, update default settings:

```sql
-- Update company information
UPDATE public.site_settings
SET setting_value = '"Your Company Name"'
WHERE setting_key = 'company_name';

UPDATE public.site_settings
SET setting_value = '"Your actual address"'
WHERE setting_key = 'company_address';

UPDATE public.site_settings
SET setting_value = '"your-email@company.com"'
WHERE setting_key = 'company_email';

-- Add your Google Analytics ID
UPDATE public.site_settings
SET setting_value = '"G-XXXXXXXXXX"'
WHERE setting_key = 'google_analytics_id';
```

---

## Authentication Setup

### 1. Create Default Admin User

The seed data creates a default admin, but you need to generate the password hash:

```javascript
// Run this in Node.js or browser console
const bcrypt = require('bcryptjs');
const password = 'YourSecurePassword123!';
const hash = bcrypt.hashSync(password, 10);
console.log(hash);
```

Then update the user:

```sql
UPDATE public.users
SET password_hash = '$2a$10$YourGeneratedHashHere'
WHERE username = 'admin';
```

### 2. Configure JWT Settings

In Supabase Dashboard → **Authentication → Settings**:

1. **JWT Expiry**: 604800 (7 days)
2. **Enable Sign Ups**: OFF (we use admin-created users)
3. **Email Confirmations**: ON (if using email verification)

### 3. Set RLS Context in Application

When making requests from your Next.js app:

```typescript
// Set user context for RLS
await supabaseAdmin.rpc('exec_sql', {
  query: `
    SET LOCAL app.current_user_id = '${userId}';
    SET LOCAL app.current_user_role = '${userRole}';
  `
});
```

Or use the service role key to bypass RLS:

```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!, // Service role bypasses RLS
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);
```

---

## Storage Configuration

### 1. Verify Storage Buckets

Check that storage buckets were created:

```sql
SELECT * FROM storage.buckets;
```

You should see:
- `media` (public)
- `avatars` (public)
- `documents` (private)

### 2. Test File Upload

```typescript
// Upload to media bucket
const { data, error } = await supabase
  .storage
  .from('media')
  .upload(`${userId}/test-image.jpg`, file);

if (error) {
  console.error('Upload failed:', error);
} else {
  console.log('Upload success:', data);
}
```

### 3. Get Public URL

```typescript
const { data } = supabase
  .storage
  .from('media')
  .getPublicUrl('path/to/file.jpg');

console.log(data.publicUrl);
```

---

## Testing the Setup

### 1. Verify Tables

```sql
-- Check all tables exist
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;

-- Check sample data
SELECT * FROM public.site_settings;
SELECT * FROM public.users;
SELECT * FROM public.services;
```

### 2. Test Database Functions

```sql
-- Test slug generation
SELECT public.generate_slug('Nhập khẩu hàng hóa chính ngạch');

-- Test search
SELECT * FROM public.search_content('nhập khẩu', ARRAY['posts', 'services'], 10);

-- Test related posts (if you have posts)
SELECT * FROM public.get_related_posts('post-uuid-here', 5);
```

### 3. Test RLS Policies

```sql
-- As anonymous user (should see published content only)
SET ROLE anon;
SELECT COUNT(*) FROM public.posts; -- Should only see published

-- As authenticated user
SET ROLE authenticated;
SELECT COUNT(*) FROM public.posts; -- Should see all
```

### 4. Test Views

```sql
SELECT * FROM public.published_posts LIMIT 5;
SELECT * FROM public.active_services;
SELECT * FROM public.content_stats;
```

---

## Production Deployment

### 1. Production Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-production-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-production-service-role-key
NEXT_PUBLIC_APP_URL=https://yourdomain.com
NODE_ENV=production
```

### 2. Enable Point-in-Time Recovery

In Supabase Dashboard → **Database → Backups**:
- Enable PITR (Point-in-Time Recovery)
- Set retention period (7 days recommended)

### 3. Set Up Connection Pooling

For production, use connection pooling:

```typescript
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    db: {
      schema: 'public',
    },
    global: {
      headers: {
        'x-connection-mode': 'transaction' // Use transaction mode for pooling
      }
    }
  }
);
```

### 4. Monitor Performance

- Go to **Database → Query Performance**
- Identify slow queries
- Add indexes as needed

### 5. Security Checklist

- ✅ Change default admin password
- ✅ Rotate JWT secret regularly
- ✅ Enable 2FA for admin accounts
- ✅ Review and test all RLS policies
- ✅ Restrict service role key to backend only
- ✅ Enable database backups
- ✅ Set up monitoring and alerts
- ✅ Use HTTPS only in production
- ✅ Implement rate limiting
- ✅ Regular security audits

---

## Troubleshooting

### Problem: Migrations fail with "relation already exists"

**Solution**: Use the safe migration files that include `IF NOT EXISTS` or manually drop existing tables:

```sql
DROP TABLE IF EXISTS public.posts CASCADE;
-- Then rerun migrations
```

### Problem: RLS blocks all queries

**Solution**: Make sure you're using the service role key for backend operations:

```typescript
// Wrong - uses anon key
const supabase = createClient(url, anonKey);

// Correct - uses service role (bypasses RLS)
const supabaseAdmin = createClient(url, serviceRoleKey);
```

### Problem: User context not working in RLS

**Solution**: Set session variables before queries:

```sql
SET app.current_user_id = 'user-uuid';
SET app.current_user_role = 'admin';
```

Or use Row Level Security policies that work with JWT claims.

### Problem: Full-text search not working

**Solution**: Rebuild search vectors:

```sql
UPDATE public.posts SET updated_at = NOW(); -- Triggers search vector update
UPDATE public.services SET updated_at = NOW();
```

### Problem: Slow queries

**Solution**: Check missing indexes:

```sql
-- Find slow queries
SELECT query, calls, total_time, mean_time
FROM pg_stat_statements
ORDER BY mean_time DESC
LIMIT 10;

-- Add indexes as needed
CREATE INDEX idx_custom ON public.table_name(column_name);
```

### Problem: Storage upload fails

**Solution**: Check bucket policies:

```sql
-- Verify bucket exists
SELECT * FROM storage.buckets WHERE name = 'media';

-- Check storage policies
SELECT * FROM storage.policies WHERE bucket_id = 'media';
```

---

## Next Steps

1. ✅ Complete this setup guide
2. 📖 Read [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md) for schema details
3. 🔌 Review [API_REFERENCE.md](./API_REFERENCE.md) for API usage
4. 🚀 Start building your application!

---

## Support

For issues or questions:

1. Check [Supabase Documentation](https://supabase.com/docs)
2. Review migration files for comments
3. Check database logs in Supabase Dashboard
4. Contact your development team

---

**Last Updated:** January 2, 2026
**Version:** 1.0.0
