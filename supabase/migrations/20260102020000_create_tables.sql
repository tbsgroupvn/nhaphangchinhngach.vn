-- =====================================================
-- Migration: Create Database Tables
-- Version: 20260102020000
-- Description: Create all core tables for TBS Group CMS
-- Author: TBS Group Backend Team
-- =====================================================

-- =====================================================
-- 1. USERS TABLE
-- Manages system users with role-based access control
-- =====================================================
CREATE TABLE IF NOT EXISTS public.users (
  -- Primary identification
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  username VARCHAR(100) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,

  -- User profile
  full_name VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  avatar_url TEXT,

  -- Authentication
  password_hash TEXT NOT NULL,

  -- Authorization
  role VARCHAR(20) NOT NULL DEFAULT 'viewer'
    CHECK (role IN ('super_admin', 'admin', 'editor', 'viewer')),
  status VARCHAR(20) NOT NULL DEFAULT 'active'
    CHECK (status IN ('active', 'inactive', 'banned')),

  -- Email verification
  email_verified BOOLEAN NOT NULL DEFAULT FALSE,
  email_verification_token TEXT,
  email_verification_expires TIMESTAMP WITH TIME ZONE,

  -- Two-factor authentication
  two_factor_enabled BOOLEAN NOT NULL DEFAULT FALSE,
  two_factor_secret TEXT,

  -- Account security
  login_attempts INTEGER NOT NULL DEFAULT 0,
  locked_until TIMESTAMP WITH TIME ZONE,
  last_login TIMESTAMP WITH TIME ZONE,
  last_login_ip VARCHAR(45),

  -- Password reset
  password_reset_token TEXT,
  password_reset_expires TIMESTAMP WITH TIME ZONE,

  -- Audit fields
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  created_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
  deleted_at TIMESTAMP WITH TIME ZONE -- Soft delete
);

COMMENT ON TABLE public.users IS 'System users with RBAC (Role-Based Access Control)';
COMMENT ON COLUMN public.users.role IS 'User role: super_admin (full access), admin (management), editor (content), viewer (read-only)';
COMMENT ON COLUMN public.users.status IS 'Account status: active (normal), inactive (disabled), banned (blocked)';
COMMENT ON COLUMN public.users.login_attempts IS 'Failed login counter for security lockout';
COMMENT ON COLUMN public.users.deleted_at IS 'Soft delete timestamp (NULL = active)';

-- =====================================================
-- 2. POSTS TABLE
-- Blog posts, news articles, guides
-- =====================================================
CREATE TABLE IF NOT EXISTS public.posts (
  -- Primary identification
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(500) NOT NULL,
  slug VARCHAR(500) UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  featured_image TEXT,

  -- Categorization
  category VARCHAR(100),
  tags TEXT[] DEFAULT '{}',

  -- Publishing
  status VARCHAR(20) NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft', 'published', 'archived')),
  published_at TIMESTAMP WITH TIME ZONE,

  -- Analytics
  views INTEGER NOT NULL DEFAULT 0,

  -- SEO optimization
  seo_title VARCHAR(500),
  seo_description TEXT,
  seo_keywords TEXT[],

  -- Relationships
  author_id UUID REFERENCES public.users(id) ON DELETE SET NULL,

  -- Audit fields
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMP WITH TIME ZONE,

  -- Full-text search
  search_vector tsvector
);

COMMENT ON TABLE public.posts IS 'Blog posts and news articles';
COMMENT ON COLUMN public.posts.slug IS 'URL-friendly identifier (unique)';
COMMENT ON COLUMN public.posts.status IS 'Publication status: draft, published, archived';
COMMENT ON COLUMN public.posts.search_vector IS 'Full-text search vector (auto-generated)';

-- =====================================================
-- 3. SERVICES TABLE
-- Company services and products
-- =====================================================
CREATE TABLE IF NOT EXISTS public.services (
  -- Primary identification
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(500) NOT NULL,
  slug VARCHAR(500) UNIQUE NOT NULL,
  description TEXT,
  content TEXT NOT NULL,

  -- Visual
  icon VARCHAR(100),
  featured_image TEXT,

  -- Pricing
  price_text VARCHAR(200),
  price_from NUMERIC(15, 2),
  price_to NUMERIC(15, 2),

  -- Features list
  features JSONB DEFAULT '[]'::jsonb,

  -- Display order
  order_index INTEGER NOT NULL DEFAULT 0,

  -- Publishing
  status VARCHAR(20) NOT NULL DEFAULT 'active'
    CHECK (status IN ('active', 'inactive')),

  -- SEO optimization
  seo_title VARCHAR(500),
  seo_description TEXT,

  -- Relationships
  author_id UUID REFERENCES public.users(id) ON DELETE SET NULL,

  -- Audit fields
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMP WITH TIME ZONE,

  -- Full-text search
  search_vector tsvector
);

COMMENT ON TABLE public.services IS 'Company services and product offerings';
COMMENT ON COLUMN public.services.features IS 'JSON array of service features/benefits';
COMMENT ON COLUMN public.services.order_index IS 'Display order (lower number = higher priority)';

-- =====================================================
-- 4. CUSTOMER STORIES TABLE
-- Customer testimonials and case studies
-- =====================================================
CREATE TABLE IF NOT EXISTS public.customer_stories (
  -- Primary identification
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(500) NOT NULL,
  slug VARCHAR(500) UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,

  -- Customer information
  customer_name VARCHAR(255),
  customer_company VARCHAR(255),
  customer_avatar TEXT,
  featured_image TEXT,

  -- Categorization
  tags TEXT[] DEFAULT '{}',

  -- Publishing
  status VARCHAR(20) NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft', 'published', 'archived')),
  published_at TIMESTAMP WITH TIME ZONE,

  -- Analytics
  views INTEGER NOT NULL DEFAULT 0,

  -- Relationships
  author_id UUID REFERENCES public.users(id) ON DELETE SET NULL,

  -- Audit fields
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMP WITH TIME ZONE
);

COMMENT ON TABLE public.customer_stories IS 'Customer testimonials and success stories';
COMMENT ON COLUMN public.customer_stories.customer_company IS 'Customer company name for credibility';

-- =====================================================
-- 5. JOBS TABLE
-- Job postings and recruitment
-- =====================================================
CREATE TABLE IF NOT EXISTS public.jobs (
  -- Primary identification
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(500) NOT NULL,
  slug VARCHAR(500) UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,

  -- Job details
  location VARCHAR(255),
  job_type VARCHAR(50)
    CHECK (job_type IN ('full_time', 'part_time', 'contract', 'internship', 'remote')),
  salary_range VARCHAR(200),
  requirements TEXT[],
  benefits TEXT[],

  -- Publishing
  status VARCHAR(20) NOT NULL DEFAULT 'open'
    CHECK (status IN ('open', 'closed', 'draft')),
  published_at TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE,

  -- Analytics
  views INTEGER NOT NULL DEFAULT 0,
  applications_count INTEGER NOT NULL DEFAULT 0,

  -- Relationships
  author_id UUID REFERENCES public.users(id) ON DELETE SET NULL,

  -- Audit fields
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMP WITH TIME ZONE
);

COMMENT ON TABLE public.jobs IS 'Job postings and recruitment';
COMMENT ON COLUMN public.jobs.expires_at IS 'Job posting expiration date';
COMMENT ON COLUMN public.jobs.applications_count IS 'Number of applications received';

-- =====================================================
-- 6. FOLDERS TABLE
-- Hierarchical folder structure for media organization
-- =====================================================
CREATE TABLE IF NOT EXISTS public.folders (
  -- Primary identification
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,

  -- Hierarchy
  parent_id UUID REFERENCES public.folders(id) ON DELETE CASCADE,
  path TEXT, -- Materialized path for efficient queries (e.g., '/root/folder1/subfolder2')
  depth INTEGER NOT NULL DEFAULT 0,

  -- Metadata
  item_count INTEGER NOT NULL DEFAULT 0,
  description TEXT,

  -- Relationships
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,

  -- Audit fields
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMP WITH TIME ZONE,

  -- Constraints
  UNIQUE(parent_id, name) -- Unique names within same parent
);

COMMENT ON TABLE public.folders IS 'Hierarchical folder structure for media organization';
COMMENT ON COLUMN public.folders.path IS 'Materialized path for efficient tree queries';
COMMENT ON COLUMN public.folders.depth IS 'Folder depth level (0 = root)';

-- =====================================================
-- 7. MEDIA FILES TABLE
-- Media library: images, videos, documents
-- =====================================================
CREATE TABLE IF NOT EXISTS public.media_files (
  -- Primary identification
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(500) NOT NULL,
  original_name VARCHAR(500),

  -- File metadata
  type VARCHAR(50) NOT NULL
    CHECK (type IN ('image', 'video', 'document', 'audio')),
  mime_type VARCHAR(100),
  url TEXT NOT NULL,
  thumbnail_url TEXT,
  size BIGINT NOT NULL,
  dimensions JSONB, -- { width: 1920, height: 1080 }

  -- Organization
  folder_id UUID REFERENCES public.folders(id) ON DELETE SET NULL,
  tags TEXT[] DEFAULT '{}',
  description TEXT,
  alt_text TEXT, -- For accessibility

  -- Usage tracking
  downloads INTEGER NOT NULL DEFAULT 0,
  last_accessed_at TIMESTAMP WITH TIME ZONE,

  -- Relationships
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,

  -- Audit fields
  uploaded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMP WITH TIME ZONE
);

COMMENT ON TABLE public.media_files IS 'Media library for images, videos, and documents';
COMMENT ON COLUMN public.media_files.dimensions IS 'JSON object with width/height for images/videos';
COMMENT ON COLUMN public.media_files.alt_text IS 'Alternative text for accessibility (SEO)';

-- =====================================================
-- 8. SITE SETTINGS TABLE
-- Application-wide configuration
-- =====================================================
CREATE TABLE IF NOT EXISTS public.site_settings (
  -- Primary identification
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  setting_key VARCHAR(255) UNIQUE NOT NULL,
  setting_value JSONB NOT NULL,

  -- Metadata
  description TEXT,
  is_public BOOLEAN NOT NULL DEFAULT FALSE, -- Can be exposed to frontend

  -- Relationships
  updated_by UUID REFERENCES public.users(id) ON DELETE SET NULL,

  -- Audit fields
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.site_settings IS 'Application-wide configuration settings';
COMMENT ON COLUMN public.site_settings.is_public IS 'Whether setting can be exposed to public API';

-- =====================================================
-- 9. USER SESSIONS TABLE
-- Active user sessions and JWT tokens
-- =====================================================
CREATE TABLE IF NOT EXISTS public.user_sessions (
  -- Primary identification
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Session data
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  session_token TEXT UNIQUE NOT NULL,
  refresh_token TEXT,

  -- Client information
  ip_address VARCHAR(45),
  user_agent TEXT,
  device_info JSONB, -- { device: 'desktop', os: 'Windows', browser: 'Chrome' }

  -- Session status
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  last_activity TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Audit fields
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.user_sessions IS 'Active user sessions for JWT token management';
COMMENT ON COLUMN public.user_sessions.device_info IS 'Parsed device/browser information';

-- =====================================================
-- 10. USER ACTIVITIES TABLE
-- Audit log for all user actions
-- =====================================================
CREATE TABLE IF NOT EXISTS public.user_activities (
  -- Primary identification
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Actor
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,

  -- Action
  action VARCHAR(255) NOT NULL, -- 'create', 'update', 'delete', 'login', etc.
  target_type VARCHAR(100), -- 'post', 'service', 'user', etc.
  target_id UUID,
  target_name VARCHAR(500),

  -- Details
  details JSONB, -- Additional context
  changes JSONB, -- Before/after values for updates

  -- Client information
  ip_address VARCHAR(45),
  user_agent TEXT,

  -- Timestamp
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.user_activities IS 'Comprehensive audit log for all user actions';
COMMENT ON COLUMN public.user_activities.changes IS 'Before/after values for data modifications';

-- =====================================================
-- 11. PAGE VIEWS TABLE
-- Analytics and visitor tracking
-- =====================================================
CREATE TABLE IF NOT EXISTS public.page_views (
  -- Primary identification
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Page information
  page_path VARCHAR(500) NOT NULL,
  page_title VARCHAR(500),
  content_type VARCHAR(50), -- 'post', 'service', 'page'
  content_id UUID,

  -- Visitor tracking
  visitor_id TEXT, -- Anonymous visitor identifier
  session_id TEXT,

  -- Location data
  ip_address VARCHAR(45),
  country VARCHAR(100),
  city VARCHAR(100),

  -- Device information
  user_agent TEXT,
  device_type VARCHAR(50) CHECK (device_type IN ('desktop', 'mobile', 'tablet')),
  browser VARCHAR(100),
  os VARCHAR(100),

  -- Referrer
  referrer TEXT,
  utm_source VARCHAR(255),
  utm_medium VARCHAR(255),
  utm_campaign VARCHAR(255),

  -- Timestamp
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.page_views IS 'Page view analytics and visitor tracking';
COMMENT ON COLUMN public.page_views.visitor_id IS 'Anonymous visitor UUID (cookie-based)';

-- =====================================================
-- 12. CONTACT SUBMISSIONS TABLE
-- Contact form submissions
-- =====================================================
CREATE TABLE IF NOT EXISTS public.contact_submissions (
  -- Primary identification
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Contact information
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(20) NOT NULL,
  company VARCHAR(255),

  -- Inquiry details
  industry VARCHAR(100),
  service VARCHAR(100),
  product_details TEXT,
  message TEXT,

  -- Status
  status VARCHAR(20) NOT NULL DEFAULT 'new'
    CHECK (status IN ('new', 'in_progress', 'resolved', 'spam')),

  -- Assignment
  assigned_to UUID REFERENCES public.users(id) ON DELETE SET NULL,
  notes TEXT,

  -- Client information
  ip_address VARCHAR(45),
  user_agent TEXT,

  -- Audit fields
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  resolved_at TIMESTAMP WITH TIME ZONE
);

COMMENT ON TABLE public.contact_submissions IS 'Contact form submissions and inquiries';
COMMENT ON COLUMN public.contact_submissions.status IS 'Processing status: new, in_progress, resolved, spam';

-- =====================================================
-- 13. NEWSLETTER SUBSCRIBERS TABLE
-- Newsletter subscription management
-- =====================================================
CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
  -- Primary identification
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,

  -- Subscriber information
  full_name VARCHAR(255),

  -- Status
  status VARCHAR(20) NOT NULL DEFAULT 'active'
    CHECK (status IN ('active', 'unsubscribed', 'bounced')),
  confirmed BOOLEAN NOT NULL DEFAULT FALSE,

  -- Tokens
  confirmation_token TEXT,
  unsubscribe_token TEXT UNIQUE,

  -- Metadata
  source VARCHAR(100), -- 'website', 'landing_page', 'manual'
  tags TEXT[],

  -- Audit fields
  subscribed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  confirmed_at TIMESTAMP WITH TIME ZONE,
  unsubscribed_at TIMESTAMP WITH TIME ZONE,

  -- Client information
  ip_address VARCHAR(45),
  user_agent TEXT
);

COMMENT ON TABLE public.newsletter_subscribers IS 'Newsletter subscription management';
COMMENT ON COLUMN public.newsletter_subscribers.unsubscribe_token IS 'Unique token for one-click unsubscribe';

-- Success notification
DO $$
BEGIN
  RAISE NOTICE '✓ All tables created successfully';
  RAISE NOTICE '  - Users & Authentication';
  RAISE NOTICE '  - Content Management (Posts, Services, Stories, Jobs)';
  RAISE NOTICE '  - Media Library (Files, Folders)';
  RAISE NOTICE '  - Site Configuration';
  RAISE NOTICE '  - Analytics & Tracking';
  RAISE NOTICE '  - Contact & Newsletter';
END $$;
