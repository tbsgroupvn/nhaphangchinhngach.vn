# TBS Group - Supabase Backend

Professional backend infrastructure for TBS Group CMS built on Supabase.

---

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Set up environment variables
cp .env.example .env.local
# Edit .env.local with your Supabase credentials

# 3. Run migrations (in Supabase SQL Editor)
# Execute migrations in order from supabase/migrations/

# 4. Generate admin password
node scripts/generate-admin-password.js

# 5. Start development
npm run dev
```

---

## 📁 Project Structure

```
supabase/
├── config.toml                    # Supabase configuration
├── migrations/                    # Database migrations (run in order)
│   ├── 20260102010000_enable_extensions.sql
│   ├── 20260102020000_create_tables.sql
│   ├── 20260102030000_create_indexes.sql
│   ├── 20260102040000_create_functions.sql
│   ├── 20260102050000_create_triggers.sql
│   ├── 20260102060000_create_rls_policies.sql
│   ├── 20260102070000_create_views.sql
│   ├── 20260102080000_seed_initial_data.sql
│   └── 20260102090000_storage_setup.sql
├── docs/                          # Documentation
│   ├── DATABASE_SCHEMA.md        # Complete schema documentation
│   ├── SETUP_GUIDE.md            # Step-by-step setup instructions
│   └── API_REFERENCE.md          # API usage examples
└── README.md                      # This file
```

---

## 🗄️ Database Schema

### Core Tables (13)

1. **users** - User accounts with RBAC
2. **posts** - Blog posts and articles
3. **services** - Company services
4. **customer_stories** - Testimonials
5. **jobs** - Job postings
6. **folders** - Media organization
7. **media_files** - File library
8. **site_settings** - Configuration
9. **user_sessions** - Session management
10. **user_activities** - Audit log
11. **page_views** - Analytics
12. **contact_submissions** - Contact forms
13. **newsletter_subscribers** - Newsletter

### Features

✅ **Security**
- Row Level Security (RLS) on all tables
- Role-based access control (super_admin, admin, editor, viewer)
- JWT authentication
- Account lockout protection
- Audit logging

✅ **Performance**
- Comprehensive indexing (B-tree, GIN)
- Full-text search with Vietnamese support
- Materialized paths for folder hierarchy
- Query optimization

✅ **Data Integrity**
- Foreign key constraints
- Check constraints
- Triggers for auto-updates
- Soft deletes

✅ **Developer Experience**
- TypeScript types
- Helper functions
- Convenient views
- Clear documentation

---

## 🔑 Authentication

The system uses **custom JWT authentication** (not Supabase Auth):

```typescript
// Login example
const { user, token } = await loginUser(username, password);

// Use token in requests
const response = await fetch('/api/endpoint', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

### Default Admin Credentials

After running migrations, create admin user with:

```bash
node scripts/generate-admin-password.js
```

Then update the database with the generated hash.

---

## 🛠️ Migrations

### Running Migrations

**Option 1: Supabase Dashboard (Recommended)**

1. Go to SQL Editor in Supabase Dashboard
2. Copy each migration file content
3. Execute in order (by timestamp)

**Option 2: Supabase CLI**

```bash
supabase db push
```

**Option 3: PostgreSQL Client**

```bash
psql "your-connection-string" -f supabase/migrations/20260102010000_enable_extensions.sql
# ... continue for all migrations
```

### Migration Order

⚠️ **Important**: Migrations must run in chronological order:

1. Extensions (pg_trgm, unaccent, uuid-ossp)
2. Tables (schema definition)
3. Indexes (performance)
4. Functions (business logic)
5. Triggers (automation)
6. RLS Policies (security)
7. Views (convenience)
8. Seed Data (initial data)
9. Storage (file buckets)

---

## 📊 Key Features

### Full-Text Search

```sql
-- Search across posts and services
SELECT * FROM public.search_content(
  'nhập khẩu',
  ARRAY['posts', 'services'],
  20
);
```

### Analytics

```sql
-- Get page statistics
SELECT * FROM public.get_page_stats(
  NOW() - INTERVAL '30 days',
  NOW()
);

-- Popular content
SELECT * FROM public.get_popular_content('posts', 7, 10);
```

### Folder Hierarchy

```sql
-- View folder tree
SELECT * FROM public.folder_tree;
```

### User Roles

- **super_admin**: Full system access
- **admin**: User & content management
- **editor**: Content creation
- **viewer**: Read-only access

---

## 🔐 Security

### Row Level Security (RLS)

All tables have RLS enabled with policies for:
- Public read access (published content)
- Authenticated user access
- Role-based permissions
- Owner-based access

### Setting User Context

For RLS to work with custom JWT:

```typescript
// Set session variables
await supabaseAdmin.rpc('exec_sql', {
  query: `
    SET LOCAL app.current_user_id = '${userId}';
    SET LOCAL app.current_user_role = '${userRole}';
  `
});
```

Or use **service_role key** to bypass RLS (backend only):

```typescript
const supabaseAdmin = createClient(url, serviceRoleKey);
```

---

## 📦 Storage Buckets

### Media (Public)
- Size limit: 50MB
- Types: images, videos, documents
- Usage: Website content

### Avatars (Public)
- Size limit: 2MB
- Types: images only
- Usage: User avatars

### Documents (Private)
- Size limit: 50MB
- Types: documents only
- Usage: Private files

---

## 🧪 Testing

### Verify Tables

```sql
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;
```

### Test Functions

```sql
-- Test slug generation
SELECT public.generate_slug('Nhập khẩu hàng hóa');

-- Test search
SELECT * FROM public.search_content('test', ARRAY['posts'], 10);
```

### Check RLS

```sql
-- As public user
SET ROLE anon;
SELECT COUNT(*) FROM public.posts; -- Should only see published

-- As authenticated
SET ROLE authenticated;
SELECT COUNT(*) FROM public.posts; -- Should see all
```

---

## 📚 Documentation

### Complete Guides

1. **[DATABASE_SCHEMA.md](./docs/DATABASE_SCHEMA.md)**
   - Complete schema documentation
   - All tables, columns, indexes
   - Functions and triggers reference

2. **[SETUP_GUIDE.md](./docs/SETUP_GUIDE.md)**
   - Step-by-step setup instructions
   - Environment configuration
   - Troubleshooting guide

3. **[API_REFERENCE.md](./docs/API_REFERENCE.md)**
   - API usage examples
   - TypeScript code samples
   - Best practices

---

## 🚀 Production Checklist

Before deploying to production:

- [ ] Change default admin password
- [ ] Update site settings with real data
- [ ] Configure SMTP for emails
- [ ] Add Google Analytics ID
- [ ] Enable database backups (PITR)
- [ ] Set up monitoring
- [ ] Review all RLS policies
- [ ] Test all critical queries
- [ ] Set up connection pooling
- [ ] Configure rate limiting
- [ ] Enable SSL/HTTPS only
- [ ] Rotate JWT secret
- [ ] Set up error tracking

---

## 🛟 Support

### Getting Help

1. Check [SETUP_GUIDE.md](./docs/SETUP_GUIDE.md) for common issues
2. Review [DATABASE_SCHEMA.md](./docs/DATABASE_SCHEMA.md) for schema details
3. See [API_REFERENCE.md](./docs/API_REFERENCE.md) for usage examples
4. Check [Supabase Docs](https://supabase.com/docs)

### Common Issues

**Problem**: RLS blocks all queries
**Solution**: Use service_role key for backend operations

**Problem**: Migration fails
**Solution**: Run migrations in order, check for existing tables

**Problem**: Full-text search not working
**Solution**: Trigger search vector update by updating records

---

## 📈 Performance Tips

1. Use connection pooling in production
2. Leverage indexes for complex queries
3. Use views for frequently accessed data
4. Enable query caching
5. Monitor slow queries
6. Partition large tables if needed

---

## 🔄 Maintenance

### Regular Tasks

- Monitor database size
- Review slow queries
- Clean up old sessions
- Archive old analytics data
- Update user activity retention
- Backup verification
- Security audit

---

## 📝 License

Proprietary - TBS Group © 2026

---

## 👥 Team

Backend architecture designed and implemented by professional developers with 20 years of experience.

**Tech Stack:**
- Supabase (PostgreSQL 15)
- Next.js 14
- TypeScript 5
- Row Level Security
- Full-text search
- Real-time subscriptions

---

**Last Updated:** January 2, 2026
**Version:** 1.0.0
**Status:** Production Ready ✅
