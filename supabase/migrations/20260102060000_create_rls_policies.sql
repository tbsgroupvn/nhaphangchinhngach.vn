-- =====================================================
-- Migration: Create Row Level Security Policies
-- Version: 20260102060000
-- Description: Comprehensive RLS policies for data security
-- Author: TBS Group Backend Team
-- =====================================================

-- =====================================================
-- HELPER FUNCTIONS FOR RLS
-- =====================================================

-- Function to get current user ID from JWT claims or session variable
CREATE OR REPLACE FUNCTION public.get_current_user_id()
RETURNS UUID AS $$
BEGIN
  -- Try to get from session variable (set by application)
  BEGIN
    RETURN current_setting('app.current_user_id', TRUE)::UUID;
  EXCEPTION
    WHEN OTHERS THEN
      -- Try to get from Supabase auth
      RETURN auth.uid();
  END;
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- Function to get current user role
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT AS $$
DECLARE
  user_role TEXT;
BEGIN
  -- Try to get from session variable
  BEGIN
    user_role := current_setting('app.current_user_role', TRUE);
    IF user_role IS NOT NULL THEN
      RETURN user_role;
    END IF;
  EXCEPTION
    WHEN OTHERS THEN
      NULL;
  END;

  -- Fallback: lookup from users table
  SELECT role INTO user_role
  FROM public.users
  WHERE id = public.get_current_user_id()
    AND deleted_at IS NULL
    AND status = 'active';

  RETURN COALESCE(user_role, 'viewer');
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- Function to check if current user is authenticated
CREATE OR REPLACE FUNCTION public.is_authenticated()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN public.get_current_user_id() IS NOT NULL;
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- Function to check if current user is admin or above
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
DECLARE
  user_role TEXT;
BEGIN
  user_role := public.get_current_user_role();
  RETURN user_role IN ('super_admin', 'admin');
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- Function to check if current user is super admin
CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN public.get_current_user_role() = 'super_admin';
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- =====================================================
-- ENABLE ROW LEVEL SECURITY
-- =====================================================

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.folders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.page_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- USERS TABLE POLICIES
-- =====================================================

-- Public: No read access to users (privacy)
-- Authenticated: Can read all users (for admin purposes)
CREATE POLICY "Authenticated users can view all users"
  ON public.users FOR SELECT
  USING (public.is_authenticated());

-- Authenticated: Users can update their own profile
CREATE POLICY "Users can update their own profile"
  ON public.users FOR UPDATE
  USING (id = public.get_current_user_id())
  WITH CHECK (id = public.get_current_user_id());

-- Admin: Can create new users
CREATE POLICY "Admins can create users"
  ON public.users FOR INSERT
  WITH CHECK (public.is_admin());

-- Admin: Can update any user
CREATE POLICY "Admins can update any user"
  ON public.users FOR UPDATE
  USING (public.is_admin());

-- Super Admin: Can delete users (soft delete)
CREATE POLICY "Super admins can delete users"
  ON public.users FOR DELETE
  USING (public.is_super_admin());

-- =====================================================
-- POSTS TABLE POLICIES
-- =====================================================

-- Public: Can view published posts
CREATE POLICY "Public can view published posts"
  ON public.posts FOR SELECT
  USING (status = 'published' AND deleted_at IS NULL);

-- Authenticated: Can view all posts (including drafts)
CREATE POLICY "Authenticated users can view all posts"
  ON public.posts FOR SELECT
  USING (public.is_authenticated());

-- Editor+: Can create posts
CREATE POLICY "Editors can create posts"
  ON public.posts FOR INSERT
  WITH CHECK (
    public.get_current_user_role() IN ('super_admin', 'admin', 'editor')
  );

-- Author: Can update their own posts
CREATE POLICY "Authors can update their own posts"
  ON public.posts FOR UPDATE
  USING (author_id = public.get_current_user_id())
  WITH CHECK (author_id = public.get_current_user_id());

-- Admin: Can update any post
CREATE POLICY "Admins can update any post"
  ON public.posts FOR UPDATE
  USING (public.is_admin());

-- Admin: Can delete posts
CREATE POLICY "Admins can delete posts"
  ON public.posts FOR DELETE
  USING (public.is_admin());

-- =====================================================
-- SERVICES TABLE POLICIES
-- =====================================================

-- Public: Can view active services
CREATE POLICY "Public can view active services"
  ON public.services FOR SELECT
  USING (status = 'active' AND deleted_at IS NULL);

-- Authenticated: Can view all services
CREATE POLICY "Authenticated users can view all services"
  ON public.services FOR SELECT
  USING (public.is_authenticated());

-- Editor+: Can create services
CREATE POLICY "Editors can create services"
  ON public.services FOR INSERT
  WITH CHECK (
    public.get_current_user_role() IN ('super_admin', 'admin', 'editor')
  );

-- Editor+: Can update services
CREATE POLICY "Editors can update services"
  ON public.services FOR UPDATE
  USING (
    public.get_current_user_role() IN ('super_admin', 'admin', 'editor')
  );

-- Admin: Can delete services
CREATE POLICY "Admins can delete services"
  ON public.services FOR DELETE
  USING (public.is_admin());

-- =====================================================
-- CUSTOMER STORIES TABLE POLICIES
-- =====================================================

-- Public: Can view published stories
CREATE POLICY "Public can view published customer stories"
  ON public.customer_stories FOR SELECT
  USING (status = 'published' AND deleted_at IS NULL);

-- Authenticated: Can view all stories
CREATE POLICY "Authenticated users can view all stories"
  ON public.customer_stories FOR SELECT
  USING (public.is_authenticated());

-- Editor+: Can create stories
CREATE POLICY "Editors can create customer stories"
  ON public.customer_stories FOR INSERT
  WITH CHECK (
    public.get_current_user_role() IN ('super_admin', 'admin', 'editor')
  );

-- Author: Can update their own stories
CREATE POLICY "Authors can update their own stories"
  ON public.customer_stories FOR UPDATE
  USING (author_id = public.get_current_user_id());

-- Admin: Can update any story
CREATE POLICY "Admins can update any story"
  ON public.customer_stories FOR UPDATE
  USING (public.is_admin());

-- Admin: Can delete stories
CREATE POLICY "Admins can delete stories"
  ON public.customer_stories FOR DELETE
  USING (public.is_admin());

-- =====================================================
-- JOBS TABLE POLICIES
-- =====================================================

-- Public: Can view open jobs
CREATE POLICY "Public can view open jobs"
  ON public.jobs FOR SELECT
  USING (status = 'open' AND deleted_at IS NULL);

-- Authenticated: Can view all jobs
CREATE POLICY "Authenticated users can view all jobs"
  ON public.jobs FOR SELECT
  USING (public.is_authenticated());

-- Editor+: Can manage jobs
CREATE POLICY "Editors can create jobs"
  ON public.jobs FOR INSERT
  WITH CHECK (
    public.get_current_user_role() IN ('super_admin', 'admin', 'editor')
  );

CREATE POLICY "Editors can update jobs"
  ON public.jobs FOR UPDATE
  USING (
    public.get_current_user_role() IN ('super_admin', 'admin', 'editor')
  );

-- Admin: Can delete jobs
CREATE POLICY "Admins can delete jobs"
  ON public.jobs FOR DELETE
  USING (public.is_admin());

-- =====================================================
-- FOLDERS TABLE POLICIES
-- =====================================================

-- Authenticated: Can view all folders
CREATE POLICY "Authenticated users can view folders"
  ON public.folders FOR SELECT
  USING (public.is_authenticated());

-- Authenticated: Can create folders
CREATE POLICY "Authenticated users can create folders"
  ON public.folders FOR INSERT
  WITH CHECK (public.is_authenticated());

-- Owner: Can update their own folders
CREATE POLICY "Users can update their own folders"
  ON public.folders FOR UPDATE
  USING (user_id = public.get_current_user_id());

-- Admin: Can update any folder
CREATE POLICY "Admins can update any folder"
  ON public.folders FOR UPDATE
  USING (public.is_admin());

-- Owner or Admin: Can delete folders
CREATE POLICY "Users can delete their own folders"
  ON public.folders FOR DELETE
  USING (
    user_id = public.get_current_user_id() OR public.is_admin()
  );

-- =====================================================
-- MEDIA FILES TABLE POLICIES
-- =====================================================

-- Public: Can view media files (for public content)
CREATE POLICY "Public can view media files"
  ON public.media_files FOR SELECT
  USING (deleted_at IS NULL);

-- Authenticated: Can upload media files
CREATE POLICY "Authenticated users can upload media"
  ON public.media_files FOR INSERT
  WITH CHECK (public.is_authenticated());

-- Owner: Can update their own files
CREATE POLICY "Users can update their own media files"
  ON public.media_files FOR UPDATE
  USING (user_id = public.get_current_user_id());

-- Admin: Can update any file
CREATE POLICY "Admins can update any media file"
  ON public.media_files FOR UPDATE
  USING (public.is_admin());

-- Owner or Admin: Can delete files
CREATE POLICY "Users can delete their own media files"
  ON public.media_files FOR DELETE
  USING (
    user_id = public.get_current_user_id() OR public.is_admin()
  );

-- =====================================================
-- SITE SETTINGS TABLE POLICIES
-- =====================================================

-- Public: Can view public settings
CREATE POLICY "Public can view public settings"
  ON public.site_settings FOR SELECT
  USING (is_public = TRUE);

-- Authenticated: Can view all settings
CREATE POLICY "Authenticated users can view all settings"
  ON public.site_settings FOR SELECT
  USING (public.is_authenticated());

-- Admin: Can manage settings
CREATE POLICY "Admins can create settings"
  ON public.site_settings FOR INSERT
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update settings"
  ON public.site_settings FOR UPDATE
  USING (public.is_admin());

CREATE POLICY "Admins can delete settings"
  ON public.site_settings FOR DELETE
  USING (public.is_admin());

-- =====================================================
-- USER SESSIONS TABLE POLICIES
-- =====================================================

-- Users: Can view their own sessions
CREATE POLICY "Users can view their own sessions"
  ON public.user_sessions FOR SELECT
  USING (user_id = public.get_current_user_id());

-- System: Can create sessions (used by auth API)
CREATE POLICY "System can create sessions"
  ON public.user_sessions FOR INSERT
  WITH CHECK (TRUE); -- Controlled by application layer

-- Users: Can delete their own sessions (logout)
CREATE POLICY "Users can delete their own sessions"
  ON public.user_sessions FOR DELETE
  USING (user_id = public.get_current_user_id());

-- Admin: Can view and delete any session
CREATE POLICY "Admins can view all sessions"
  ON public.user_sessions FOR SELECT
  USING (public.is_admin());

CREATE POLICY "Admins can delete any session"
  ON public.user_sessions FOR DELETE
  USING (public.is_admin());

-- =====================================================
-- USER ACTIVITIES TABLE POLICIES
-- =====================================================

-- Users: Can view their own activity
CREATE POLICY "Users can view their own activity"
  ON public.user_activities FOR SELECT
  USING (user_id = public.get_current_user_id());

-- Admin: Can view all activity
CREATE POLICY "Admins can view all activity"
  ON public.user_activities FOR SELECT
  USING (public.is_admin());

-- System: Can insert activity logs
CREATE POLICY "System can insert activity logs"
  ON public.user_activities FOR INSERT
  WITH CHECK (TRUE); -- Controlled by triggers

-- =====================================================
-- PAGE VIEWS TABLE POLICIES
-- =====================================================

-- Public: Can insert page views (analytics)
CREATE POLICY "Public can insert page views"
  ON public.page_views FOR INSERT
  WITH CHECK (TRUE);

-- Admin: Can view analytics
CREATE POLICY "Admins can view page views"
  ON public.page_views FOR SELECT
  USING (public.is_admin());

-- =====================================================
-- CONTACT SUBMISSIONS TABLE POLICIES
-- =====================================================

-- Public: Can submit contact forms
CREATE POLICY "Public can submit contact forms"
  ON public.contact_submissions FOR INSERT
  WITH CHECK (TRUE);

-- Authenticated: Can view contact submissions
CREATE POLICY "Authenticated users can view submissions"
  ON public.contact_submissions FOR SELECT
  USING (public.is_authenticated());

-- Authenticated: Can update submissions (status, notes)
CREATE POLICY "Authenticated users can update submissions"
  ON public.contact_submissions FOR UPDATE
  USING (public.is_authenticated());

-- Admin: Can delete submissions
CREATE POLICY "Admins can delete submissions"
  ON public.contact_submissions FOR DELETE
  USING (public.is_admin());

-- =====================================================
-- NEWSLETTER SUBSCRIBERS TABLE POLICIES
-- =====================================================

-- Public: Can subscribe to newsletter
CREATE POLICY "Public can subscribe to newsletter"
  ON public.newsletter_subscribers FOR INSERT
  WITH CHECK (TRUE);

-- Public: Can unsubscribe with token
CREATE POLICY "Public can unsubscribe"
  ON public.newsletter_subscribers FOR UPDATE
  USING (TRUE) -- Token validation in application layer
  WITH CHECK (TRUE);

-- Authenticated: Can view subscribers
CREATE POLICY "Authenticated users can view subscribers"
  ON public.newsletter_subscribers FOR SELECT
  USING (public.is_authenticated());

-- Admin: Can manage subscribers
CREATE POLICY "Admins can delete subscribers"
  ON public.newsletter_subscribers FOR DELETE
  USING (public.is_admin());

-- Success notification
DO $$
BEGIN
  RAISE NOTICE '✓ Row Level Security policies created successfully';
  RAISE NOTICE '  - Public access for published content';
  RAISE NOTICE '  - Role-based access control (RBAC)';
  RAISE NOTICE '  - User ownership policies';
  RAISE NOTICE '  - Admin override capabilities';
  RAISE NOTICE '  - Secure session management';
  RAISE NOTICE '  - Audit trail protection';
  RAISE NOTICE '';
  RAISE NOTICE 'Security Note:';
  RAISE NOTICE '  - All tables have RLS enabled';
  RAISE NOTICE '  - Use service_role key to bypass RLS in trusted backend';
  RAISE NOTICE '  - Set app.current_user_id and app.current_user_role for context';
END $$;
