-- =====================================================
-- Migration: Create Performance Indexes
-- Version: 20260102030000
-- Description: Create indexes for query optimization
-- Author: TBS Group Backend Team
-- =====================================================

-- =====================================================
-- USERS TABLE INDEXES
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_users_username ON public.users(username);
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);
CREATE INDEX IF NOT EXISTS idx_users_status ON public.users(status);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON public.users(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_users_deleted_at ON public.users(deleted_at) WHERE deleted_at IS NULL; -- Partial index for active users

-- Composite index for login queries
CREATE INDEX IF NOT EXISTS idx_users_login ON public.users(username, email, status) WHERE deleted_at IS NULL;

-- =====================================================
-- POSTS TABLE INDEXES
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_posts_slug ON public.posts(slug);
CREATE INDEX IF NOT EXISTS idx_posts_status ON public.posts(status);
CREATE INDEX IF NOT EXISTS idx_posts_category ON public.posts(category);
CREATE INDEX IF NOT EXISTS idx_posts_author ON public.posts(author_id);
CREATE INDEX IF NOT EXISTS idx_posts_published_at ON public.posts(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON public.posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_views ON public.posts(views DESC);
CREATE INDEX IF NOT EXISTS idx_posts_deleted_at ON public.posts(deleted_at) WHERE deleted_at IS NULL;

-- Composite index for published posts listing
CREATE INDEX IF NOT EXISTS idx_posts_published ON public.posts(status, published_at DESC)
  WHERE status = 'published' AND deleted_at IS NULL;

-- Composite index for category + status
CREATE INDEX IF NOT EXISTS idx_posts_category_status ON public.posts(category, status, published_at DESC)
  WHERE deleted_at IS NULL;

-- GIN index for array columns
CREATE INDEX IF NOT EXISTS idx_posts_tags ON public.posts USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_posts_keywords ON public.posts USING GIN(seo_keywords);

-- Full-text search index
CREATE INDEX IF NOT EXISTS idx_posts_search ON public.posts USING GIN(search_vector);

-- =====================================================
-- SERVICES TABLE INDEXES
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_services_slug ON public.services(slug);
CREATE INDEX IF NOT EXISTS idx_services_status ON public.services(status);
CREATE INDEX IF NOT EXISTS idx_services_order ON public.services(order_index ASC);
CREATE INDEX IF NOT EXISTS idx_services_author ON public.services(author_id);
CREATE INDEX IF NOT EXISTS idx_services_created_at ON public.services(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_services_deleted_at ON public.services(deleted_at) WHERE deleted_at IS NULL;

-- Composite index for active services
CREATE INDEX IF NOT EXISTS idx_services_active ON public.services(status, order_index ASC)
  WHERE status = 'active' AND deleted_at IS NULL;

-- GIN index for JSONB features
CREATE INDEX IF NOT EXISTS idx_services_features ON public.services USING GIN(features);

-- Full-text search index
CREATE INDEX IF NOT EXISTS idx_services_search ON public.services USING GIN(search_vector);

-- =====================================================
-- CUSTOMER STORIES TABLE INDEXES
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_customer_stories_slug ON public.customer_stories(slug);
CREATE INDEX IF NOT EXISTS idx_customer_stories_status ON public.customer_stories(status);
CREATE INDEX IF NOT EXISTS idx_customer_stories_published_at ON public.customer_stories(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_customer_stories_author ON public.customer_stories(author_id);
CREATE INDEX IF NOT EXISTS idx_customer_stories_deleted_at ON public.customer_stories(deleted_at) WHERE deleted_at IS NULL;

-- Composite index for published stories
CREATE INDEX IF NOT EXISTS idx_customer_stories_published ON public.customer_stories(status, published_at DESC)
  WHERE status = 'published' AND deleted_at IS NULL;

-- GIN index for tags
CREATE INDEX IF NOT EXISTS idx_customer_stories_tags ON public.customer_stories USING GIN(tags);

-- =====================================================
-- JOBS TABLE INDEXES
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_jobs_slug ON public.jobs(slug);
CREATE INDEX IF NOT EXISTS idx_jobs_status ON public.jobs(status);
CREATE INDEX IF NOT EXISTS idx_jobs_location ON public.jobs(location);
CREATE INDEX IF NOT EXISTS idx_jobs_job_type ON public.jobs(job_type);
CREATE INDEX IF NOT EXISTS idx_jobs_published_at ON public.jobs(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_jobs_expires_at ON public.jobs(expires_at);
CREATE INDEX IF NOT EXISTS idx_jobs_deleted_at ON public.jobs(deleted_at) WHERE deleted_at IS NULL;

-- Composite index for active jobs
CREATE INDEX IF NOT EXISTS idx_jobs_active ON public.jobs(status, published_at DESC)
  WHERE status = 'open' AND deleted_at IS NULL;

-- GIN indexes for arrays
CREATE INDEX IF NOT EXISTS idx_jobs_requirements ON public.jobs USING GIN(requirements);
CREATE INDEX IF NOT EXISTS idx_jobs_benefits ON public.jobs USING GIN(benefits);

-- =====================================================
-- FOLDERS TABLE INDEXES
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_folders_parent ON public.folders(parent_id);
CREATE INDEX IF NOT EXISTS idx_folders_path ON public.folders(path);
CREATE INDEX IF NOT EXISTS idx_folders_user ON public.folders(user_id);
CREATE INDEX IF NOT EXISTS idx_folders_deleted_at ON public.folders(deleted_at) WHERE deleted_at IS NULL;

-- Composite index for folder hierarchy
CREATE INDEX IF NOT EXISTS idx_folders_hierarchy ON public.folders(parent_id, name)
  WHERE deleted_at IS NULL;

-- =====================================================
-- MEDIA FILES TABLE INDEXES
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_media_files_name ON public.media_files(name);
CREATE INDEX IF NOT EXISTS idx_media_files_type ON public.media_files(type);
CREATE INDEX IF NOT EXISTS idx_media_files_folder ON public.media_files(folder_id);
CREATE INDEX IF NOT EXISTS idx_media_files_user ON public.media_files(user_id);
CREATE INDEX IF NOT EXISTS idx_media_files_uploaded_at ON public.media_files(uploaded_at DESC);
CREATE INDEX IF NOT EXISTS idx_media_files_size ON public.media_files(size);
CREATE INDEX IF NOT EXISTS idx_media_files_deleted_at ON public.media_files(deleted_at) WHERE deleted_at IS NULL;

-- Composite index for folder listing
CREATE INDEX IF NOT EXISTS idx_media_files_folder_listing ON public.media_files(folder_id, uploaded_at DESC)
  WHERE deleted_at IS NULL;

-- GIN index for tags
CREATE INDEX IF NOT EXISTS idx_media_files_tags ON public.media_files USING GIN(tags);

-- GIN index for JSONB dimensions
CREATE INDEX IF NOT EXISTS idx_media_files_dimensions ON public.media_files USING GIN(dimensions);

-- =====================================================
-- SITE SETTINGS TABLE INDEXES
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_site_settings_key ON public.site_settings(setting_key);
CREATE INDEX IF NOT EXISTS idx_site_settings_public ON public.site_settings(is_public);

-- =====================================================
-- USER SESSIONS TABLE INDEXES
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_user_sessions_user ON public.user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_token ON public.user_sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_user_sessions_expires ON public.user_sessions(expires_at);
CREATE INDEX IF NOT EXISTS idx_user_sessions_active ON public.user_sessions(is_active, expires_at);
CREATE INDEX IF NOT EXISTS idx_user_sessions_last_activity ON public.user_sessions(last_activity DESC);

-- Composite index for active sessions
CREATE INDEX IF NOT EXISTS idx_user_sessions_valid ON public.user_sessions(user_id, is_active, expires_at)
  WHERE is_active = TRUE;

-- =====================================================
-- USER ACTIVITIES TABLE INDEXES
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_user_activities_user ON public.user_activities(user_id);
CREATE INDEX IF NOT EXISTS idx_user_activities_action ON public.user_activities(action);
CREATE INDEX IF NOT EXISTS idx_user_activities_target ON public.user_activities(target_type, target_id);
CREATE INDEX IF NOT EXISTS idx_user_activities_created_at ON public.user_activities(created_at DESC);

-- Composite index for user activity log
CREATE INDEX IF NOT EXISTS idx_user_activities_log ON public.user_activities(user_id, created_at DESC);

-- GIN index for JSONB details
CREATE INDEX IF NOT EXISTS idx_user_activities_details ON public.user_activities USING GIN(details);

-- =====================================================
-- PAGE VIEWS TABLE INDEXES
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_page_views_path ON public.page_views(page_path);
CREATE INDEX IF NOT EXISTS idx_page_views_content ON public.page_views(content_type, content_id);
CREATE INDEX IF NOT EXISTS idx_page_views_visitor ON public.page_views(visitor_id);
CREATE INDEX IF NOT EXISTS idx_page_views_session ON public.page_views(session_id);
CREATE INDEX IF NOT EXISTS idx_page_views_created_at ON public.page_views(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_page_views_device ON public.page_views(device_type);

-- Composite index for analytics queries
CREATE INDEX IF NOT EXISTS idx_page_views_analytics ON public.page_views(page_path, created_at DESC);

-- Composite index for content analytics
CREATE INDEX IF NOT EXISTS idx_page_views_content_analytics ON public.page_views(content_type, content_id, created_at DESC);

-- Index for UTM tracking
CREATE INDEX IF NOT EXISTS idx_page_views_utm ON public.page_views(utm_source, utm_medium, utm_campaign)
  WHERE utm_source IS NOT NULL;

-- =====================================================
-- CONTACT SUBMISSIONS TABLE INDEXES
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_contact_submissions_email ON public.contact_submissions(email);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_phone ON public.contact_submissions(phone);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_status ON public.contact_submissions(status);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_assigned ON public.contact_submissions(assigned_to);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_created_at ON public.contact_submissions(created_at DESC);

-- Composite index for inbox queries
CREATE INDEX IF NOT EXISTS idx_contact_submissions_inbox ON public.contact_submissions(status, created_at DESC);

-- =====================================================
-- NEWSLETTER SUBSCRIBERS TABLE INDEXES
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_email ON public.newsletter_subscribers(email);
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_status ON public.newsletter_subscribers(status);
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_confirmed ON public.newsletter_subscribers(confirmed);
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_token ON public.newsletter_subscribers(unsubscribe_token);
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_subscribed_at ON public.newsletter_subscribers(subscribed_at DESC);

-- Composite index for active subscribers
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_active ON public.newsletter_subscribers(status, confirmed)
  WHERE status = 'active' AND confirmed = TRUE;

-- GIN index for tags
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_tags ON public.newsletter_subscribers USING GIN(tags);

-- Success notification
DO $$
BEGIN
  RAISE NOTICE '✓ Performance indexes created successfully';
  RAISE NOTICE '  - B-tree indexes for fast lookups';
  RAISE NOTICE '  - GIN indexes for full-text search and arrays';
  RAISE NOTICE '  - Partial indexes for common filters';
  RAISE NOTICE '  - Composite indexes for complex queries';
END $$;
