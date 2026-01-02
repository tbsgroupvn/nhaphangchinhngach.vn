-- =====================================================
-- Migration: Create Database Views
-- Version: 20260102070000
-- Description: Create helpful views for common queries
-- Author: TBS Group Backend Team
-- =====================================================

-- =====================================================
-- CONTENT VIEWS
-- =====================================================

-- View: Published posts with author information
CREATE OR REPLACE VIEW public.published_posts AS
SELECT
  p.id,
  p.title,
  p.slug,
  p.excerpt,
  p.content,
  p.featured_image,
  p.category,
  p.tags,
  p.published_at,
  p.views,
  p.seo_title,
  p.seo_description,
  p.seo_keywords,
  p.created_at,
  p.updated_at,
  -- Author information
  u.id as author_id,
  u.full_name as author_name,
  u.avatar_url as author_avatar
FROM public.posts p
LEFT JOIN public.users u ON p.author_id = u.id
WHERE p.status = 'published'
  AND p.deleted_at IS NULL
ORDER BY p.published_at DESC;

COMMENT ON VIEW public.published_posts IS 'Published posts with author details for public display';

-- View: Active services
CREATE OR REPLACE VIEW public.active_services AS
SELECT
  s.id,
  s.title,
  s.slug,
  s.description,
  s.content,
  s.icon,
  s.featured_image,
  s.price_text,
  s.price_from,
  s.price_to,
  s.features,
  s.order_index,
  s.seo_title,
  s.seo_description,
  s.created_at
FROM public.services s
WHERE s.status = 'active'
  AND s.deleted_at IS NULL
ORDER BY s.order_index ASC;

COMMENT ON VIEW public.active_services IS 'Active services ordered by display priority';

-- View: Published customer stories
CREATE OR REPLACE VIEW public.published_customer_stories AS
SELECT
  cs.id,
  cs.title,
  cs.slug,
  cs.excerpt,
  cs.content,
  cs.customer_name,
  cs.customer_company,
  cs.customer_avatar,
  cs.featured_image,
  cs.tags,
  cs.published_at,
  cs.views
FROM public.customer_stories cs
WHERE cs.status = 'published'
  AND cs.deleted_at IS NULL
ORDER BY cs.published_at DESC;

COMMENT ON VIEW public.published_customer_stories IS 'Published customer testimonials';

-- View: Open jobs
CREATE OR REPLACE VIEW public.open_jobs AS
SELECT
  j.id,
  j.title,
  j.slug,
  j.excerpt,
  j.content,
  j.location,
  j.job_type,
  j.salary_range,
  j.requirements,
  j.benefits,
  j.published_at,
  j.expires_at,
  j.views,
  j.applications_count
FROM public.jobs j
WHERE j.status = 'open'
  AND j.deleted_at IS NULL
  AND (j.expires_at IS NULL OR j.expires_at > NOW())
ORDER BY j.published_at DESC;

COMMENT ON VIEW public.open_jobs IS 'Currently open job postings';

-- =====================================================
-- ADMIN VIEWS
-- =====================================================

-- View: Content statistics
CREATE OR REPLACE VIEW public.content_stats AS
SELECT
  'posts' as content_type,
  COUNT(*) FILTER (WHERE status = 'published' AND deleted_at IS NULL) as published_count,
  COUNT(*) FILTER (WHERE status = 'draft' AND deleted_at IS NULL) as draft_count,
  COUNT(*) FILTER (WHERE deleted_at IS NOT NULL) as deleted_count,
  SUM(views) as total_views
FROM public.posts
UNION ALL
SELECT
  'services' as content_type,
  COUNT(*) FILTER (WHERE status = 'active' AND deleted_at IS NULL) as published_count,
  COUNT(*) FILTER (WHERE status = 'inactive' AND deleted_at IS NULL) as draft_count,
  COUNT(*) FILTER (WHERE deleted_at IS NOT NULL) as deleted_count,
  0 as total_views
FROM public.services
UNION ALL
SELECT
  'customer_stories' as content_type,
  COUNT(*) FILTER (WHERE status = 'published' AND deleted_at IS NULL) as published_count,
  COUNT(*) FILTER (WHERE status = 'draft' AND deleted_at IS NULL) as draft_count,
  COUNT(*) FILTER (WHERE deleted_at IS NOT NULL) as deleted_count,
  SUM(views) as total_views
FROM public.customer_stories
UNION ALL
SELECT
  'jobs' as content_type,
  COUNT(*) FILTER (WHERE status = 'open' AND deleted_at IS NULL) as published_count,
  COUNT(*) FILTER (WHERE status IN ('closed', 'draft') AND deleted_at IS NULL) as draft_count,
  COUNT(*) FILTER (WHERE deleted_at IS NOT NULL) as deleted_count,
  SUM(views) as total_views
FROM public.jobs;

COMMENT ON VIEW public.content_stats IS 'Content statistics across all types';

-- View: User statistics
CREATE OR REPLACE VIEW public.user_stats AS
SELECT
  role,
  COUNT(*) as total_users,
  COUNT(*) FILTER (WHERE status = 'active') as active_users,
  COUNT(*) FILTER (WHERE status = 'inactive') as inactive_users,
  COUNT(*) FILTER (WHERE status = 'banned') as banned_users,
  COUNT(*) FILTER (WHERE email_verified = TRUE) as verified_users,
  COUNT(*) FILTER (WHERE two_factor_enabled = TRUE) as two_factor_users,
  COUNT(*) FILTER (WHERE deleted_at IS NOT NULL) as deleted_users
FROM public.users
GROUP BY role
ORDER BY
  CASE role
    WHEN 'super_admin' THEN 1
    WHEN 'admin' THEN 2
    WHEN 'editor' THEN 3
    WHEN 'viewer' THEN 4
  END;

COMMENT ON VIEW public.user_stats IS 'User statistics by role and status';

-- View: Media library statistics
CREATE OR REPLACE VIEW public.media_stats AS
SELECT
  type,
  COUNT(*) as file_count,
  SUM(size) as total_size,
  AVG(size) as avg_size,
  MAX(size) as max_size,
  SUM(downloads) as total_downloads
FROM public.media_files
WHERE deleted_at IS NULL
GROUP BY type;

COMMENT ON VIEW public.media_stats IS 'Media library statistics by file type';

-- View: Recent activity (last 30 days)
CREATE OR REPLACE VIEW public.recent_activity AS
SELECT
  ua.id,
  ua.user_id,
  u.full_name as user_name,
  u.avatar_url as user_avatar,
  ua.action,
  ua.target_type,
  ua.target_id,
  ua.target_name,
  ua.created_at
FROM public.user_activities ua
LEFT JOIN public.users u ON ua.user_id = u.id
WHERE ua.created_at > NOW() - INTERVAL '30 days'
ORDER BY ua.created_at DESC
LIMIT 100;

COMMENT ON VIEW public.recent_activity IS 'Recent user activities (last 30 days)';

-- =====================================================
-- ANALYTICS VIEWS
-- =====================================================

-- View: Daily page views (last 30 days)
CREATE OR REPLACE VIEW public.daily_page_views AS
SELECT
  DATE(created_at) as view_date,
  COUNT(*) as total_views,
  COUNT(DISTINCT visitor_id) as unique_visitors,
  COUNT(DISTINCT session_id) as sessions
FROM public.page_views
WHERE created_at > NOW() - INTERVAL '30 days'
GROUP BY DATE(created_at)
ORDER BY view_date DESC;

COMMENT ON VIEW public.daily_page_views IS 'Daily page view statistics (last 30 days)';

-- View: Popular pages (last 7 days)
CREATE OR REPLACE VIEW public.popular_pages AS
SELECT
  page_path,
  page_title,
  COUNT(*) as views,
  COUNT(DISTINCT visitor_id) as unique_visitors
FROM public.page_views
WHERE created_at > NOW() - INTERVAL '7 days'
GROUP BY page_path, page_title
ORDER BY views DESC
LIMIT 20;

COMMENT ON VIEW public.popular_pages IS 'Most popular pages (last 7 days)';

-- View: Traffic sources (last 7 days)
CREATE OR REPLACE VIEW public.traffic_sources AS
SELECT
  COALESCE(utm_source, 'Direct') as source,
  COALESCE(utm_medium, 'none') as medium,
  COALESCE(utm_campaign, 'none') as campaign,
  COUNT(*) as visits,
  COUNT(DISTINCT visitor_id) as unique_visitors
FROM public.page_views
WHERE created_at > NOW() - INTERVAL '7 days'
GROUP BY utm_source, utm_medium, utm_campaign
ORDER BY visits DESC;

COMMENT ON VIEW public.traffic_sources IS 'Traffic sources and UTM tracking (last 7 days)';

-- View: Device statistics (last 7 days)
CREATE OR REPLACE VIEW public.device_stats AS
SELECT
  device_type,
  browser,
  os,
  COUNT(*) as sessions,
  COUNT(DISTINCT visitor_id) as unique_visitors
FROM public.page_views
WHERE created_at > NOW() - INTERVAL '7 days'
GROUP BY device_type, browser, os
ORDER BY sessions DESC;

COMMENT ON VIEW public.device_stats IS 'Device and browser statistics (last 7 days)';

-- =====================================================
-- CONTACT & NEWSLETTER VIEWS
-- =====================================================

-- View: Active newsletter subscribers
CREATE OR REPLACE VIEW public.active_newsletter_subscribers AS
SELECT
  id,
  email,
  full_name,
  source,
  tags,
  subscribed_at,
  confirmed_at
FROM public.newsletter_subscribers
WHERE status = 'active'
  AND confirmed = TRUE
ORDER BY subscribed_at DESC;

COMMENT ON VIEW public.active_newsletter_subscribers IS 'Active and confirmed newsletter subscribers';

-- View: Pending contact submissions
CREATE OR REPLACE VIEW public.pending_contact_submissions AS
SELECT
  cs.id,
  cs.full_name,
  cs.email,
  cs.phone,
  cs.company,
  cs.industry,
  cs.service,
  cs.product_details,
  cs.message,
  cs.status,
  cs.created_at,
  u.full_name as assigned_to_name
FROM public.contact_submissions cs
LEFT JOIN public.users u ON cs.assigned_to = u.id
WHERE cs.status IN ('new', 'in_progress')
ORDER BY cs.created_at DESC;

COMMENT ON VIEW public.pending_contact_submissions IS 'New and in-progress contact form submissions';

-- =====================================================
-- FOLDER HIERARCHY VIEW
-- =====================================================

-- View: Folder tree structure
CREATE OR REPLACE VIEW public.folder_tree AS
WITH RECURSIVE folder_hierarchy AS (
  -- Root folders
  SELECT
    id,
    name,
    parent_id,
    path,
    depth,
    item_count,
    name::TEXT as full_path
  FROM public.folders
  WHERE parent_id IS NULL AND deleted_at IS NULL

  UNION ALL

  -- Child folders
  SELECT
    f.id,
    f.name,
    f.parent_id,
    f.path,
    f.depth,
    f.item_count,
    fh.full_path || ' / ' || f.name
  FROM public.folders f
  INNER JOIN folder_hierarchy fh ON f.parent_id = fh.id
  WHERE f.deleted_at IS NULL
)
SELECT * FROM folder_hierarchy
ORDER BY full_path;

COMMENT ON VIEW public.folder_tree IS 'Hierarchical folder structure with full paths';

-- Success notification
DO $$
BEGIN
  RAISE NOTICE '✓ Database views created successfully';
  RAISE NOTICE '  - Content views (published posts, services, stories, jobs)';
  RAISE NOTICE '  - Admin views (statistics, activity)';
  RAISE NOTICE '  - Analytics views (page views, traffic sources)';
  RAISE NOTICE '  - Contact & newsletter views';
  RAISE NOTICE '  - Folder hierarchy view';
END $$;
