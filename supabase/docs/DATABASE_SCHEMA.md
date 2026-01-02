# Database Schema Documentation

## Overview

This document provides a comprehensive overview of the TBS Group CMS database schema, designed for a professional import/export business website.

---

## Tables

### 1. `users`

**Description:** System users with role-based access control (RBAC)

**Columns:**
- `id` (UUID, PK): Unique user identifier
- `username` (VARCHAR): Unique username for login
- `email` (VARCHAR): Unique email address
- `full_name` (VARCHAR): User's full name
- `phone` (VARCHAR): Contact phone number
- `avatar_url` (TEXT): URL to user's avatar image
- `password_hash` (TEXT): Bcrypt hashed password
- `role` (VARCHAR): User role (super_admin, admin, editor, viewer)
- `status` (VARCHAR): Account status (active, inactive, banned)
- `email_verified` (BOOLEAN): Email verification status
- `two_factor_enabled` (BOOLEAN): 2FA enabled flag
- `two_factor_secret` (TEXT): TOTP secret for 2FA
- `login_attempts` (INTEGER): Failed login counter
- `locked_until` (TIMESTAMPTZ): Account lock expiration
- `last_login` (TIMESTAMPTZ): Last successful login
- `last_login_ip` (VARCHAR): IP address of last login
- `password_reset_token` (TEXT): Password reset token
- `password_reset_expires` (TIMESTAMPTZ): Token expiration
- `email_verification_token` (TEXT): Email verification token
- `email_verification_expires` (TIMESTAMPTZ): Token expiration
- `created_at` (TIMESTAMPTZ): Creation timestamp
- `updated_at` (TIMESTAMPTZ): Last update timestamp
- `created_by` (UUID, FK): User who created this record
- `deleted_at` (TIMESTAMPTZ): Soft delete timestamp

**Indexes:**
- `idx_users_username` on `username`
- `idx_users_email` on `email`
- `idx_users_role` on `role`
- `idx_users_status` on `status`
- `idx_users_login` composite on `(username, email, status)`

**Security:**
- Account lockout after 5 failed login attempts (30 minutes)
- Password reset with expiring tokens
- Email verification support
- Soft delete for data retention

---

### 2. `posts`

**Description:** Blog posts, news articles, and guides

**Columns:**
- `id` (UUID, PK): Unique post identifier
- `title` (VARCHAR): Post title
- `slug` (VARCHAR): URL-friendly identifier (unique)
- `excerpt` (TEXT): Short summary
- `content` (TEXT): Full post content (HTML/Markdown)
- `featured_image` (TEXT): Featured image URL
- `category` (VARCHAR): Post category
- `tags` (TEXT[]): Array of tags
- `status` (VARCHAR): Publication status (draft, published, archived)
- `published_at` (TIMESTAMPTZ): Publication date
- `views` (INTEGER): View counter
- `author_id` (UUID, FK → users): Author reference
- `seo_title` (VARCHAR): SEO optimized title
- `seo_description` (TEXT): SEO meta description
- `seo_keywords` (TEXT[]): SEO keywords
- `created_at` (TIMESTAMPTZ): Creation timestamp
- `updated_at` (TIMESTAMPTZ): Last update timestamp
- `deleted_at` (TIMESTAMPTZ): Soft delete timestamp
- `search_vector` (TSVECTOR): Full-text search index

**Indexes:**
- `idx_posts_slug` on `slug`
- `idx_posts_status` on `status`
- `idx_posts_category` on `category`
- `idx_posts_published` composite on `(status, published_at DESC)`
- `idx_posts_tags` GIN on `tags`
- `idx_posts_search` GIN on `search_vector`

**Features:**
- Automatic slug generation from title
- Full-text search across title, excerpt, content, tags
- SEO optimization fields
- Soft delete support

---

### 3. `services`

**Description:** Company services and product offerings

**Columns:**
- `id` (UUID, PK): Unique service identifier
- `title` (VARCHAR): Service name
- `slug` (VARCHAR): URL-friendly identifier
- `description` (TEXT): Short description
- `content` (TEXT): Full service details
- `icon` (VARCHAR): Icon identifier
- `featured_image` (TEXT): Featured image URL
- `price_text` (VARCHAR): Display price text
- `price_from` (NUMERIC): Starting price
- `price_to` (NUMERIC): Maximum price
- `features` (JSONB): Array of service features
- `order_index` (INTEGER): Display order (lower = higher priority)
- `status` (VARCHAR): Service status (active, inactive)
- `author_id` (UUID, FK → users): Creator reference
- `seo_title` (VARCHAR): SEO title
- `seo_description` (TEXT): SEO description
- `created_at` (TIMESTAMPTZ): Creation timestamp
- `updated_at` (TIMESTAMPTZ): Last update timestamp
- `deleted_at` (TIMESTAMPTZ): Soft delete timestamp
- `search_vector` (TSVECTOR): Full-text search index

**Indexes:**
- `idx_services_slug` on `slug`
- `idx_services_active` composite on `(status, order_index)`
- `idx_services_features` GIN on `features`
- `idx_services_search` GIN on `search_vector`

---

### 4. `customer_stories`

**Description:** Customer testimonials and case studies

**Columns:**
- `id` (UUID, PK): Story identifier
- `title` (VARCHAR): Story title
- `slug` (VARCHAR): URL slug
- `excerpt` (TEXT): Summary
- `content` (TEXT): Full story
- `customer_name` (VARCHAR): Customer name
- `customer_company` (VARCHAR): Company name
- `customer_avatar` (TEXT): Avatar URL
- `featured_image` (TEXT): Featured image
- `tags` (TEXT[]): Tags
- `status` (VARCHAR): Publication status
- `published_at` (TIMESTAMPTZ): Publication date
- `views` (INTEGER): View count
- `author_id` (UUID, FK → users): Author
- Standard audit fields

**Features:**
- Customer branding (name, company, avatar)
- Tag-based organization
- View tracking

---

### 5. `jobs`

**Description:** Job postings and recruitment

**Columns:**
- `id` (UUID, PK): Job identifier
- `title` (VARCHAR): Job title
- `slug` (VARCHAR): URL slug
- `location` (VARCHAR): Job location
- `job_type` (VARCHAR): Type (full_time, part_time, contract, internship, remote)
- `salary_range` (VARCHAR): Salary information
- `requirements` (TEXT[]): Job requirements
- `benefits` (TEXT[]): Job benefits
- `status` (VARCHAR): Status (open, closed, draft)
- `published_at` (TIMESTAMPTZ): Publication date
- `expires_at` (TIMESTAMPTZ): Expiration date
- `applications_count` (INTEGER): Number of applications
- Standard content and audit fields

**Features:**
- Automatic expiration handling
- Application tracking
- Structured requirements and benefits

---

### 6. `folders`

**Description:** Hierarchical folder structure for media organization

**Columns:**
- `id` (UUID, PK): Folder identifier
- `name` (VARCHAR): Folder name
- `parent_id` (UUID, FK → folders): Parent folder (NULL for root)
- `path` (TEXT): Materialized path (e.g., "/root/folder1/sub")
- `depth` (INTEGER): Nesting depth (0 = root)
- `item_count` (INTEGER): Number of items (auto-updated)
- `description` (TEXT): Folder description
- `user_id` (UUID, FK → users): Owner
- Standard audit fields

**Features:**
- Unlimited nesting with materialized path
- Automatic item count maintenance
- Fast tree queries

---

### 7. `media_files`

**Description:** Media library for images, videos, and documents

**Columns:**
- `id` (UUID, PK): File identifier
- `name` (VARCHAR): Display name
- `original_name` (VARCHAR): Original filename
- `type` (VARCHAR): File type (image, video, document, audio)
- `mime_type` (VARCHAR): MIME type
- `url` (TEXT): File URL
- `thumbnail_url` (TEXT): Thumbnail URL
- `size` (BIGINT): File size in bytes
- `dimensions` (JSONB): Width/height for images/videos
- `folder_id` (UUID, FK → folders): Folder location
- `tags` (TEXT[]): File tags
- `description` (TEXT): File description
- `alt_text` (TEXT): Alt text for SEO/accessibility
- `downloads` (INTEGER): Download counter
- `last_accessed_at` (TIMESTAMPTZ): Last access time
- `user_id` (UUID, FK → users): Uploader
- `uploaded_at` (TIMESTAMPTZ): Upload timestamp
- Standard audit fields

**Indexes:**
- `idx_media_files_folder_listing` on `(folder_id, uploaded_at DESC)`
- `idx_media_files_tags` GIN on `tags`
- `idx_media_files_dimensions` GIN on `dimensions`

---

### 8. `site_settings`

**Description:** Application-wide configuration

**Columns:**
- `id` (UUID, PK): Setting identifier
- `setting_key` (VARCHAR): Unique key
- `setting_value` (JSONB): Value (any JSON type)
- `description` (TEXT): Setting description
- `is_public` (BOOLEAN): Can be exposed to frontend
- `updated_by` (UUID, FK → users): Last modifier
- Standard audit fields

**Features:**
- Flexible JSON values
- Public/private separation
- Centralized configuration

---

### 9. `user_sessions`

**Description:** Active user sessions for JWT token management

**Columns:**
- `id` (UUID, PK): Session identifier
- `user_id` (UUID, FK → users): User reference
- `session_token` (TEXT): JWT token (hashed)
- `refresh_token` (TEXT): Refresh token
- `ip_address` (VARCHAR): Client IP
- `user_agent` (TEXT): Browser user agent
- `device_info` (JSONB): Parsed device information
- `expires_at` (TIMESTAMPTZ): Expiration time
- `is_active` (BOOLEAN): Active flag
- `last_activity` (TIMESTAMPTZ): Last activity timestamp
- `created_at` (TIMESTAMPTZ): Creation timestamp

**Features:**
- Session tracking per device
- Automatic cleanup of expired sessions
- Support for multiple concurrent sessions

---

### 10. `user_activities`

**Description:** Comprehensive audit log

**Columns:**
- `id` (UUID, PK): Activity identifier
- `user_id` (UUID, FK → users): Actor
- `action` (VARCHAR): Action type (create, update, delete, login, etc.)
- `target_type` (VARCHAR): Target table name
- `target_id` (UUID): Target record ID
- `target_name` (VARCHAR): Human-readable target name
- `details` (JSONB): Additional context
- `changes` (JSONB): Before/after values
- `ip_address` (VARCHAR): Client IP
- `user_agent` (TEXT): Browser info
- `created_at` (TIMESTAMPTZ): Activity timestamp

**Features:**
- Automatic logging via triggers
- Change tracking (before/after)
- IP and user agent tracking

---

### 11. `page_views`

**Description:** Analytics and visitor tracking

**Columns:**
- `id` (UUID, PK): View identifier
- `page_path` (VARCHAR): URL path
- `page_title` (VARCHAR): Page title
- `content_type` (VARCHAR): Content type
- `content_id` (UUID): Related content ID
- `visitor_id` (TEXT): Anonymous visitor UUID
- `session_id` (TEXT): Session identifier
- `ip_address` (VARCHAR): Client IP
- `country` (VARCHAR): Country
- `city` (VARCHAR): City
- `device_type` (VARCHAR): Device type
- `browser` (VARCHAR): Browser name
- `os` (VARCHAR): Operating system
- `referrer` (TEXT): Referrer URL
- `utm_source` (VARCHAR): UTM source
- `utm_medium` (VARCHAR): UTM medium
- `utm_campaign` (VARCHAR): UTM campaign
- `created_at` (TIMESTAMPTZ): View timestamp

**Features:**
- Anonymous visitor tracking
- UTM campaign tracking
- Device and location analytics

---

### 12. `contact_submissions`

**Description:** Contact form submissions

**Columns:**
- `id` (UUID, PK): Submission identifier
- `full_name` (VARCHAR): Contact name
- `email` (VARCHAR): Contact email
- `phone` (VARCHAR): Contact phone
- `company` (VARCHAR): Company name
- `industry` (VARCHAR): Industry type
- `service` (VARCHAR): Service interest
- `product_details` (TEXT): Product details
- `message` (TEXT): Message content
- `status` (VARCHAR): Status (new, in_progress, resolved, spam)
- `assigned_to` (UUID, FK → users): Assigned staff
- `notes` (TEXT): Internal notes
- `ip_address` (VARCHAR): Submission IP
- `user_agent` (TEXT): Browser info
- `created_at` (TIMESTAMPTZ): Submission time
- `updated_at` (TIMESTAMPTZ): Last update
- `resolved_at` (TIMESTAMPTZ): Resolution time

---

### 13. `newsletter_subscribers`

**Description:** Newsletter subscription management

**Columns:**
- `id` (UUID, PK): Subscriber identifier
- `email` (VARCHAR): Subscriber email (unique)
- `full_name` (VARCHAR): Subscriber name
- `status` (VARCHAR): Status (active, unsubscribed, bounced)
- `confirmed` (BOOLEAN): Email confirmed
- `confirmation_token` (TEXT): Confirmation token
- `unsubscribe_token` (TEXT): Unsubscribe token (unique)
- `source` (VARCHAR): Signup source
- `tags` (TEXT[]): Subscriber tags
- `subscribed_at` (TIMESTAMPTZ): Subscription date
- `confirmed_at` (TIMESTAMPTZ): Confirmation date
- `unsubscribed_at` (TIMESTAMPTZ): Unsubscribe date
- `ip_address` (VARCHAR): Signup IP
- `user_agent` (TEXT): Browser info

---

## Database Functions

### Utility Functions

- `generate_slug(text)`: Generate URL-friendly slug from Vietnamese text
- `update_search_vector()`: Update full-text search vector
- `increment_views(table_name, record_id)`: Increment view counter

### Folder Management

- `update_folder_path()`: Maintain materialized path
- `update_folder_item_count()`: Auto-update item counts

### User Management

- `user_has_role(user_id, role)`: Check user role with hierarchy
- `handle_login_attempt(username, success, ip)`: Handle login with lockout

### Content Management

- `get_related_posts(post_id, limit)`: Get related posts by category/tags
- `search_content(query, types, limit)`: Full-text search across content

### Analytics

- `get_page_stats(start_date, end_date)`: Page view statistics
- `get_popular_content(type, days, limit)`: Most popular content

### Soft Delete

- `soft_delete(table_name, record_id)`: Soft delete record
- `restore_deleted(table_name, record_id)`: Restore deleted record

---

## Triggers

### Automatic Timestamps
- Auto-update `updated_at` on all tables

### Full-Text Search
- Auto-update search vectors for posts and services

### Folder Management
- Auto-maintain folder paths and item counts

### Audit Logging
- Auto-log user activities on important tables

### Slug Generation
- Auto-generate slugs from titles if not provided

### Validation
- Email format validation
- Auto-set published_at on status change

### Cleanup
- Auto-cleanup expired sessions

---

## Views

### Public Views
- `published_posts`: Published posts with author info
- `active_services`: Active services ordered by priority
- `published_customer_stories`: Published testimonials
- `open_jobs`: Current job openings

### Admin Views
- `content_stats`: Content statistics across types
- `user_stats`: User statistics by role
- `media_stats`: Media library statistics
- `recent_activity`: Recent user activities

### Analytics Views
- `daily_page_views`: Daily view statistics
- `popular_pages`: Most viewed pages
- `traffic_sources`: Traffic source analysis
- `device_stats`: Device and browser statistics

---

## Security (RLS Policies)

### Public Access
- Published posts, services, stories, jobs
- Page view analytics insertion
- Contact form submission
- Newsletter subscription

### Authenticated Access
- All content (including drafts)
- Media upload
- User profile management

### Role-Based Access
- **Editor**: Create/update content
- **Admin**: Full content management, user management
- **Super Admin**: All permissions including user deletion

### Ownership
- Users can update their own records
- Admins can override with full access

---

## Storage Buckets

### `media` (Public)
- Max size: 50MB
- Types: images, videos, documents
- Public read, authenticated write

### `avatars` (Public)
- Max size: 2MB
- Types: images only
- Public read, authenticated write

### `documents` (Private)
- Max size: 50MB
- Types: documents only
- Authenticated access only

---

## Migration Strategy

Migrations are organized in chronological order:

1. `20260102010000_enable_extensions.sql` - PostgreSQL extensions
2. `20260102020000_create_tables.sql` - All database tables
3. `20260102030000_create_indexes.sql` - Performance indexes
4. `20260102040000_create_functions.sql` - Database functions
5. `20260102050000_create_triggers.sql` - Automatic triggers
6. `20260102060000_create_rls_policies.sql` - Security policies
7. `20260102070000_create_views.sql` - Helper views
8. `20260102080000_seed_initial_data.sql` - Default data
9. `20260102090000_storage_setup.sql` - Storage configuration

---

## Best Practices

1. **Always use transactions** for multi-step operations
2. **Use soft deletes** for important data (deleted_at)
3. **Leverage RLS** for security at database level
4. **Use views** for complex or frequently used queries
5. **Index frequently queried columns**
6. **Use JSONB** for flexible, structured data
7. **Set app context** for RLS: `SET app.current_user_id = 'uuid'`
8. **Use service_role key** for backend operations bypassing RLS
9. **Monitor slow queries** and add indexes as needed
10. **Regular backups** and point-in-time recovery setup

---

## Performance Tips

- Use `published_posts` view instead of querying `posts` directly
- Leverage GIN indexes for array and JSONB queries
- Use materialized views for complex analytics (if needed)
- Partition large tables like `page_views` by date
- Use connection pooling (pgBouncer)
- Enable query caching for frequently accessed data
