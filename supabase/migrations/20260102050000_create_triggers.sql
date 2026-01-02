-- =====================================================
-- Migration: Create Database Triggers
-- Version: 20260102050000
-- Description: Automatic triggers for data integrity and audit
-- Author: TBS Group Backend Team
-- =====================================================

-- =====================================================
-- TIMESTAMP TRIGGERS
-- Automatically update updated_at column
-- =====================================================

-- Function for updating updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to all tables with updated_at column
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_posts_updated_at
  BEFORE UPDATE ON public.posts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_services_updated_at
  BEFORE UPDATE ON public.services
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_customer_stories_updated_at
  BEFORE UPDATE ON public.customer_stories
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_jobs_updated_at
  BEFORE UPDATE ON public.jobs
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_folders_updated_at
  BEFORE UPDATE ON public.folders
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_media_files_updated_at
  BEFORE UPDATE ON public.media_files
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_site_settings_updated_at
  BEFORE UPDATE ON public.site_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_contact_submissions_updated_at
  BEFORE UPDATE ON public.contact_submissions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- =====================================================
-- FULL-TEXT SEARCH TRIGGERS
-- Automatically update search_vector
-- =====================================================

CREATE TRIGGER update_posts_search_vector
  BEFORE INSERT OR UPDATE ON public.posts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_search_vector();

CREATE TRIGGER update_services_search_vector
  BEFORE INSERT OR UPDATE ON public.services
  FOR EACH ROW
  EXECUTE FUNCTION public.update_search_vector();

-- =====================================================
-- FOLDER MANAGEMENT TRIGGERS
-- =====================================================

-- Update folder path on insert/update
CREATE TRIGGER update_folder_path_trigger
  BEFORE INSERT OR UPDATE ON public.folders
  FOR EACH ROW
  EXECUTE FUNCTION public.update_folder_path();

-- Update folder item counts
CREATE TRIGGER update_folder_count_on_media_insert
  AFTER INSERT ON public.media_files
  FOR EACH ROW
  EXECUTE FUNCTION public.update_folder_item_count();

CREATE TRIGGER update_folder_count_on_media_update
  AFTER UPDATE ON public.media_files
  FOR EACH ROW
  EXECUTE FUNCTION public.update_folder_item_count();

CREATE TRIGGER update_folder_count_on_media_delete
  AFTER DELETE ON public.media_files
  FOR EACH ROW
  EXECUTE FUNCTION public.update_folder_item_count();

-- =====================================================
-- AUDIT TRIGGERS
-- Automatically log user activities
-- =====================================================

-- Function to log user activities
CREATE OR REPLACE FUNCTION public.log_user_activity()
RETURNS TRIGGER AS $$
DECLARE
  action_name TEXT;
  user_id_val UUID;
  target_name_val TEXT;
  changes_val JSONB;
BEGIN
  -- Determine action
  IF TG_OP = 'INSERT' THEN
    action_name := 'create';
  ELSIF TG_OP = 'UPDATE' THEN
    action_name := 'update';
  ELSIF TG_OP = 'DELETE' THEN
    action_name := 'delete';
  END IF;

  -- Get user_id from context (set by application)
  user_id_val := current_setting('app.current_user_id', TRUE)::UUID;

  -- Skip if no user context (system operations)
  IF user_id_val IS NULL THEN
    IF TG_OP = 'DELETE' THEN
      RETURN OLD;
    ELSE
      RETURN NEW;
    END IF;
  END IF;

  -- Get target name based on table
  IF TG_TABLE_NAME = 'posts' OR TG_TABLE_NAME = 'services' OR TG_TABLE_NAME = 'customer_stories' OR TG_TABLE_NAME = 'jobs' THEN
    IF TG_OP = 'DELETE' THEN
      target_name_val := OLD.title;
    ELSE
      target_name_val := NEW.title;
    END IF;
  ELSIF TG_TABLE_NAME = 'users' THEN
    IF TG_OP = 'DELETE' THEN
      target_name_val := OLD.full_name;
    ELSE
      target_name_val := NEW.full_name;
    END IF;
  ELSIF TG_TABLE_NAME = 'media_files' THEN
    IF TG_OP = 'DELETE' THEN
      target_name_val := OLD.name;
    ELSE
      target_name_val := NEW.name;
    END IF;
  END IF;

  -- Build changes JSON for updates
  IF TG_OP = 'UPDATE' THEN
    changes_val := jsonb_build_object(
      'before', to_jsonb(OLD),
      'after', to_jsonb(NEW)
    );
  END IF;

  -- Insert activity log
  INSERT INTO public.user_activities (
    user_id,
    action,
    target_type,
    target_id,
    target_name,
    changes,
    created_at
  ) VALUES (
    user_id_val,
    action_name,
    TG_TABLE_NAME,
    CASE WHEN TG_OP = 'DELETE' THEN OLD.id ELSE NEW.id END,
    target_name_val,
    changes_val,
    NOW()
  );

  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  ELSE
    RETURN NEW;
  END IF;
EXCEPTION
  WHEN OTHERS THEN
    -- Don't fail the main operation if logging fails
    RAISE WARNING 'Failed to log activity: %', SQLERRM;
    IF TG_OP = 'DELETE' THEN
      RETURN OLD;
    ELSE
      RETURN NEW;
    END IF;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION public.log_user_activity IS 'Automatically log user activities for audit trail';

-- Apply audit triggers to important tables
CREATE TRIGGER log_posts_activity
  AFTER INSERT OR UPDATE OR DELETE ON public.posts
  FOR EACH ROW
  EXECUTE FUNCTION public.log_user_activity();

CREATE TRIGGER log_services_activity
  AFTER INSERT OR UPDATE OR DELETE ON public.services
  FOR EACH ROW
  EXECUTE FUNCTION public.log_user_activity();

CREATE TRIGGER log_users_activity
  AFTER INSERT OR UPDATE OR DELETE ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION public.log_user_activity();

CREATE TRIGGER log_media_files_activity
  AFTER INSERT OR UPDATE OR DELETE ON public.media_files
  FOR EACH ROW
  EXECUTE FUNCTION public.log_user_activity();

-- =====================================================
-- SLUG GENERATION TRIGGERS
-- Automatically generate slugs if not provided
-- =====================================================

CREATE OR REPLACE FUNCTION public.auto_generate_slug()
RETURNS TRIGGER AS $$
BEGIN
  -- Generate slug from title if not provided
  IF NEW.slug IS NULL OR NEW.slug = '' THEN
    NEW.slug := public.generate_slug(NEW.title);

    -- Ensure uniqueness by appending counter if needed
    WHILE EXISTS (
      SELECT 1 FROM public.posts
      WHERE slug = NEW.slug AND id != COALESCE(NEW.id, '00000000-0000-0000-0000-000000000000'::UUID)
    ) OR EXISTS (
      SELECT 1 FROM public.services
      WHERE slug = NEW.slug AND id != COALESCE(NEW.id, '00000000-0000-0000-0000-000000000000'::UUID)
    ) OR EXISTS (
      SELECT 1 FROM public.customer_stories
      WHERE slug = NEW.slug AND id != COALESCE(NEW.id, '00000000-0000-0000-0000-000000000000'::UUID)
    ) OR EXISTS (
      SELECT 1 FROM public.jobs
      WHERE slug = NEW.slug AND id != COALESCE(NEW.id, '00000000-0000-0000-0000-000000000000'::UUID)
    ) LOOP
      NEW.slug := NEW.slug || '-' || floor(random() * 1000)::TEXT;
    END LOOP;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER auto_generate_posts_slug
  BEFORE INSERT OR UPDATE ON public.posts
  FOR EACH ROW
  EXECUTE FUNCTION public.auto_generate_slug();

CREATE TRIGGER auto_generate_services_slug
  BEFORE INSERT OR UPDATE ON public.services
  FOR EACH ROW
  EXECUTE FUNCTION public.auto_generate_slug();

CREATE TRIGGER auto_generate_customer_stories_slug
  BEFORE INSERT OR UPDATE ON public.customer_stories
  FOR EACH ROW
  EXECUTE FUNCTION public.auto_generate_slug();

CREATE TRIGGER auto_generate_jobs_slug
  BEFORE INSERT OR UPDATE ON public.jobs
  FOR EACH ROW
  EXECUTE FUNCTION public.auto_generate_slug();

-- =====================================================
-- CLEANUP TRIGGERS
-- Automatically clean up related data
-- =====================================================

-- Clean up expired sessions
CREATE OR REPLACE FUNCTION public.cleanup_expired_sessions()
RETURNS TRIGGER AS $$
BEGIN
  DELETE FROM public.user_sessions
  WHERE expires_at < NOW() - INTERVAL '7 days'
    AND is_active = FALSE;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Run cleanup when new session is created
CREATE TRIGGER cleanup_sessions_on_insert
  AFTER INSERT ON public.user_sessions
  FOR EACH STATEMENT
  EXECUTE FUNCTION public.cleanup_expired_sessions();

-- =====================================================
-- VALIDATION TRIGGERS
-- Data validation before insert/update
-- =====================================================

CREATE OR REPLACE FUNCTION public.validate_email()
RETURNS TRIGGER AS $$
BEGIN
  -- Simple email validation
  IF NEW.email IS NOT NULL AND NEW.email !~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$' THEN
    RAISE EXCEPTION 'Invalid email format: %', NEW.email;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply email validation
CREATE TRIGGER validate_users_email
  BEFORE INSERT OR UPDATE ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION public.validate_email();

CREATE TRIGGER validate_contact_submissions_email
  BEFORE INSERT OR UPDATE ON public.contact_submissions
  FOR EACH ROW
  EXECUTE FUNCTION public.validate_email();

CREATE TRIGGER validate_newsletter_subscribers_email
  BEFORE INSERT OR UPDATE ON public.newsletter_subscribers
  FOR EACH ROW
  EXECUTE FUNCTION public.validate_email();

-- =====================================================
-- PUBLISHED DATE TRIGGER
-- Auto-set published_at when status changes to published
-- =====================================================

CREATE OR REPLACE FUNCTION public.set_published_at()
RETURNS TRIGGER AS $$
BEGIN
  -- Set published_at when status changes to published
  IF NEW.status = 'published' AND (OLD IS NULL OR OLD.status != 'published') THEN
    IF NEW.published_at IS NULL THEN
      NEW.published_at := NOW();
    END IF;
  END IF;

  -- Clear published_at when unpublished
  IF NEW.status != 'published' AND (OLD IS NOT NULL AND OLD.status = 'published') THEN
    -- Optionally keep the old published_at or clear it
    -- NEW.published_at := NULL;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_posts_published_at
  BEFORE INSERT OR UPDATE ON public.posts
  FOR EACH ROW
  EXECUTE FUNCTION public.set_published_at();

CREATE TRIGGER set_customer_stories_published_at
  BEFORE INSERT OR UPDATE ON public.customer_stories
  FOR EACH ROW
  EXECUTE FUNCTION public.set_published_at();

CREATE TRIGGER set_jobs_published_at
  BEFORE INSERT OR UPDATE ON public.jobs
  FOR EACH ROW
  EXECUTE FUNCTION public.set_published_at();

-- Success notification
DO $$
BEGIN
  RAISE NOTICE '✓ Database triggers created successfully';
  RAISE NOTICE '  - Auto-update timestamps (updated_at)';
  RAISE NOTICE '  - Full-text search vectors';
  RAISE NOTICE '  - Folder path maintenance';
  RAISE NOTICE '  - User activity audit logging';
  RAISE NOTICE '  - Automatic slug generation';
  RAISE NOTICE '  - Session cleanup';
  RAISE NOTICE '  - Email validation';
  RAISE NOTICE '  - Published date auto-set';
END $$;
