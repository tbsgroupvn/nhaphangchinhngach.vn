-- =====================================================
-- Migration: Create Database Functions
-- Version: 20260102040000
-- Description: Reusable database functions for business logic
-- Author: TBS Group Backend Team
-- =====================================================

-- =====================================================
-- UTILITY FUNCTIONS
-- =====================================================

-- Function: Generate URL-friendly slug from Vietnamese text
CREATE OR REPLACE FUNCTION public.generate_slug(input_text TEXT)
RETURNS TEXT AS $$
DECLARE
  slug TEXT;
BEGIN
  -- Convert to lowercase
  slug := LOWER(input_text);

  -- Replace Vietnamese characters
  slug := TRANSLATE(slug,
    'áàảãạăắằẳẵặâấầẩẫậéèẻẽẹêếềểễệíìỉĩịóòỏõọôốồổỗộơớờởỡợúùủũụưứừửữựýỳỷỹỵđ',
    'aaaaaaaaaaaaaaaaaeeeeeeeeeeeiiiiiooooooooooooooooouuuuuuuuuuuyyyyyd'
  );

  -- Replace spaces and special characters with hyphens
  slug := REGEXP_REPLACE(slug, '[^a-z0-9]+', '-', 'g');

  -- Remove leading/trailing hyphens
  slug := TRIM(BOTH '-' FROM slug);

  RETURN slug;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

COMMENT ON FUNCTION public.generate_slug IS 'Generate URL-friendly slug from Vietnamese text';

-- Function: Update search vector for full-text search
CREATE OR REPLACE FUNCTION public.update_search_vector()
RETURNS TRIGGER AS $$
BEGIN
  -- For posts table
  IF TG_TABLE_NAME = 'posts' THEN
    NEW.search_vector :=
      setweight(to_tsvector('simple', COALESCE(NEW.title, '')), 'A') ||
      setweight(to_tsvector('simple', COALESCE(NEW.excerpt, '')), 'B') ||
      setweight(to_tsvector('simple', COALESCE(NEW.content, '')), 'C') ||
      setweight(to_tsvector('simple', COALESCE(array_to_string(NEW.tags, ' '), '')), 'B');
  END IF;

  -- For services table
  IF TG_TABLE_NAME = 'services' THEN
    NEW.search_vector :=
      setweight(to_tsvector('simple', COALESCE(NEW.title, '')), 'A') ||
      setweight(to_tsvector('simple', COALESCE(NEW.description, '')), 'B') ||
      setweight(to_tsvector('simple', COALESCE(NEW.content, '')), 'C');
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION public.update_search_vector IS 'Automatically update full-text search vector on insert/update';

-- Function: Increment view counter
CREATE OR REPLACE FUNCTION public.increment_views(
  table_name TEXT,
  record_id UUID
)
RETURNS VOID AS $$
BEGIN
  EXECUTE format(
    'UPDATE public.%I SET views = views + 1 WHERE id = $1',
    table_name
  ) USING record_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION public.increment_views IS 'Safely increment view counter for any table';

-- =====================================================
-- FOLDER MANAGEMENT FUNCTIONS
-- =====================================================

-- Function: Update folder path (materialized path pattern)
CREATE OR REPLACE FUNCTION public.update_folder_path()
RETURNS TRIGGER AS $$
DECLARE
  parent_path TEXT;
BEGIN
  IF NEW.parent_id IS NULL THEN
    -- Root folder
    NEW.path := '/' || NEW.id::TEXT;
    NEW.depth := 0;
  ELSE
    -- Get parent path
    SELECT path, depth INTO parent_path, NEW.depth
    FROM public.folders
    WHERE id = NEW.parent_id;

    -- Build path
    NEW.path := parent_path || '/' || NEW.id::TEXT;
    NEW.depth := NEW.depth + 1;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION public.update_folder_path IS 'Automatically update materialized path when folder is created/moved';

-- Function: Update folder item count
CREATE OR REPLACE FUNCTION public.update_folder_item_count()
RETURNS TRIGGER AS $$
BEGIN
  -- Increment on insert
  IF TG_OP = 'INSERT' AND NEW.folder_id IS NOT NULL THEN
    UPDATE public.folders
    SET item_count = item_count + 1
    WHERE id = NEW.folder_id;
  END IF;

  -- Decrement on delete
  IF TG_OP = 'DELETE' AND OLD.folder_id IS NOT NULL THEN
    UPDATE public.folders
    SET item_count = item_count - 1
    WHERE id = OLD.folder_id;
  END IF;

  -- Handle folder change
  IF TG_OP = 'UPDATE' AND OLD.folder_id IS DISTINCT FROM NEW.folder_id THEN
    -- Decrement old folder
    IF OLD.folder_id IS NOT NULL THEN
      UPDATE public.folders
      SET item_count = item_count - 1
      WHERE id = OLD.folder_id;
    END IF;

    -- Increment new folder
    IF NEW.folder_id IS NOT NULL THEN
      UPDATE public.folders
      SET item_count = item_count + 1
      WHERE id = NEW.folder_id;
    END IF;
  END IF;

  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  ELSE
    RETURN NEW;
  END IF;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION public.update_folder_item_count IS 'Automatically maintain folder item counts';

-- =====================================================
-- USER MANAGEMENT FUNCTIONS
-- =====================================================

-- Function: Check if user has role
CREATE OR REPLACE FUNCTION public.user_has_role(
  user_id UUID,
  required_role TEXT
)
RETURNS BOOLEAN AS $$
DECLARE
  user_role TEXT;
  role_hierarchy TEXT[] := ARRAY['super_admin', 'admin', 'editor', 'viewer'];
  user_rank INT;
  required_rank INT;
BEGIN
  -- Get user's role
  SELECT role INTO user_role
  FROM public.users
  WHERE id = user_id AND deleted_at IS NULL;

  IF user_role IS NULL THEN
    RETURN FALSE;
  END IF;

  -- Get role ranks
  user_rank := array_position(role_hierarchy, user_role);
  required_rank := array_position(role_hierarchy, required_role);

  -- User has role if their rank is equal or higher (lower number)
  RETURN user_rank <= required_rank;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION public.user_has_role IS 'Check if user has specified role or higher';

-- Function: Handle failed login attempt
CREATE OR REPLACE FUNCTION public.handle_login_attempt(
  user_username TEXT,
  success BOOLEAN,
  client_ip VARCHAR(45) DEFAULT NULL
)
RETURNS JSON AS $$
DECLARE
  user_record RECORD;
  lock_duration INTERVAL := '30 minutes';
  max_attempts INT := 5;
  result JSON;
BEGIN
  -- Get user
  SELECT * INTO user_record
  FROM public.users
  WHERE username = user_username
    AND deleted_at IS NULL;

  IF user_record IS NULL THEN
    RETURN json_build_object('error', 'User not found');
  END IF;

  -- Check if account is locked
  IF user_record.locked_until IS NOT NULL AND user_record.locked_until > NOW() THEN
    RETURN json_build_object(
      'locked', TRUE,
      'locked_until', user_record.locked_until,
      'message', 'Account is temporarily locked'
    );
  END IF;

  IF success THEN
    -- Reset attempts on successful login
    UPDATE public.users
    SET
      login_attempts = 0,
      locked_until = NULL,
      last_login = NOW(),
      last_login_ip = client_ip
    WHERE id = user_record.id;

    result := json_build_object('success', TRUE);
  ELSE
    -- Increment failed attempts
    UPDATE public.users
    SET
      login_attempts = login_attempts + 1,
      locked_until = CASE
        WHEN login_attempts + 1 >= max_attempts
        THEN NOW() + lock_duration
        ELSE locked_until
      END
    WHERE id = user_record.id
    RETURNING login_attempts, locked_until INTO user_record;

    result := json_build_object(
      'success', FALSE,
      'attempts', user_record.login_attempts,
      'locked', user_record.locked_until IS NOT NULL,
      'locked_until', user_record.locked_until
    );
  END IF;

  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION public.handle_login_attempt IS 'Handle login attempts with account lockout';

-- =====================================================
-- CONTENT MANAGEMENT FUNCTIONS
-- =====================================================

-- Function: Get related posts
CREATE OR REPLACE FUNCTION public.get_related_posts(
  post_id UUID,
  limit_count INT DEFAULT 5
)
RETURNS TABLE (
  id UUID,
  title VARCHAR,
  slug VARCHAR,
  excerpt TEXT,
  featured_image TEXT,
  published_at TIMESTAMP WITH TIME ZONE,
  views INT
) AS $$
BEGIN
  RETURN QUERY
  WITH current_post AS (
    SELECT category, tags
    FROM public.posts
    WHERE public.posts.id = post_id
  )
  SELECT
    p.id,
    p.title,
    p.slug,
    p.excerpt,
    p.featured_image,
    p.published_at,
    p.views
  FROM public.posts p, current_post cp
  WHERE p.id != post_id
    AND p.status = 'published'
    AND p.deleted_at IS NULL
    AND (
      p.category = cp.category
      OR p.tags && cp.tags -- Array overlap operator
    )
  ORDER BY
    (p.category = cp.category)::INT DESC, -- Same category first
    cardinality(p.tags & cp.tags) DESC, -- More matching tags
    p.published_at DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql STABLE;

COMMENT ON FUNCTION public.get_related_posts IS 'Get related posts based on category and tags';

-- Function: Search content with full-text search
CREATE OR REPLACE FUNCTION public.search_content(
  search_query TEXT,
  content_types TEXT[] DEFAULT ARRAY['posts', 'services'],
  limit_count INT DEFAULT 20
)
RETURNS TABLE (
  id UUID,
  title VARCHAR,
  slug VARCHAR,
  excerpt TEXT,
  content_type TEXT,
  rank REAL
) AS $$
DECLARE
  ts_query tsquery;
BEGIN
  -- Parse search query
  ts_query := plainto_tsquery('simple', search_query);

  RETURN QUERY
  -- Search posts
  SELECT
    p.id,
    p.title,
    p.slug,
    p.excerpt,
    'post'::TEXT as content_type,
    ts_rank(p.search_vector, ts_query) as rank
  FROM public.posts p
  WHERE 'posts' = ANY(content_types)
    AND p.search_vector @@ ts_query
    AND p.status = 'published'
    AND p.deleted_at IS NULL

  UNION ALL

  -- Search services
  SELECT
    s.id,
    s.title,
    s.slug,
    s.description as excerpt,
    'service'::TEXT as content_type,
    ts_rank(s.search_vector, ts_query) as rank
  FROM public.services s
  WHERE 'services' = ANY(content_types)
    AND s.search_vector @@ ts_query
    AND s.status = 'active'
    AND s.deleted_at IS NULL

  ORDER BY rank DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql STABLE;

COMMENT ON FUNCTION public.search_content IS 'Full-text search across multiple content types';

-- =====================================================
-- ANALYTICS FUNCTIONS
-- =====================================================

-- Function: Get page view statistics
CREATE OR REPLACE FUNCTION public.get_page_stats(
  start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW() - INTERVAL '30 days',
  end_date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
)
RETURNS TABLE (
  page_path VARCHAR,
  total_views BIGINT,
  unique_visitors BIGINT,
  avg_time_on_page INTERVAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    pv.page_path,
    COUNT(*)::BIGINT as total_views,
    COUNT(DISTINCT pv.visitor_id)::BIGINT as unique_visitors,
    AVG(INTERVAL '1 minute') as avg_time_on_page -- Placeholder, needs session tracking
  FROM public.page_views pv
  WHERE pv.created_at BETWEEN start_date AND end_date
  GROUP BY pv.page_path
  ORDER BY total_views DESC;
END;
$$ LANGUAGE plpgsql STABLE;

COMMENT ON FUNCTION public.get_page_stats IS 'Get page view statistics for date range';

-- Function: Get popular content
CREATE OR REPLACE FUNCTION public.get_popular_content(
  content_type TEXT,
  days INT DEFAULT 7,
  limit_count INT DEFAULT 10
)
RETURNS TABLE (
  id UUID,
  title VARCHAR,
  slug VARCHAR,
  views BIGINT,
  unique_visitors BIGINT
) AS $$
BEGIN
  IF content_type = 'posts' THEN
    RETURN QUERY
    SELECT
      p.id,
      p.title,
      p.slug,
      COUNT(pv.id)::BIGINT as views,
      COUNT(DISTINCT pv.visitor_id)::BIGINT as unique_visitors
    FROM public.posts p
    LEFT JOIN public.page_views pv
      ON pv.content_id = p.id
      AND pv.created_at > NOW() - (days || ' days')::INTERVAL
    WHERE p.status = 'published'
      AND p.deleted_at IS NULL
    GROUP BY p.id, p.title, p.slug
    ORDER BY views DESC, unique_visitors DESC
    LIMIT limit_count;

  ELSIF content_type = 'services' THEN
    RETURN QUERY
    SELECT
      s.id,
      s.title,
      s.slug,
      COUNT(pv.id)::BIGINT as views,
      COUNT(DISTINCT pv.visitor_id)::BIGINT as unique_visitors
    FROM public.services s
    LEFT JOIN public.page_views pv
      ON pv.content_id = s.id
      AND pv.created_at > NOW() - (days || ' days')::INTERVAL
    WHERE s.status = 'active'
      AND s.deleted_at IS NULL
    GROUP BY s.id, s.title, s.slug
    ORDER BY views DESC, unique_visitors DESC
    LIMIT limit_count;
  END IF;
END;
$$ LANGUAGE plpgsql STABLE;

COMMENT ON FUNCTION public.get_popular_content IS 'Get most popular content by type and time period';

-- =====================================================
-- SOFT DELETE FUNCTIONS
-- =====================================================

-- Function: Soft delete record
CREATE OR REPLACE FUNCTION public.soft_delete(
  table_name TEXT,
  record_id UUID
)
RETURNS BOOLEAN AS $$
BEGIN
  EXECUTE format(
    'UPDATE public.%I SET deleted_at = NOW() WHERE id = $1 AND deleted_at IS NULL',
    table_name
  ) USING record_id;

  RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION public.soft_delete IS 'Soft delete a record by setting deleted_at timestamp';

-- Function: Restore soft deleted record
CREATE OR REPLACE FUNCTION public.restore_deleted(
  table_name TEXT,
  record_id UUID
)
RETURNS BOOLEAN AS $$
BEGIN
  EXECUTE format(
    'UPDATE public.%I SET deleted_at = NULL WHERE id = $1 AND deleted_at IS NOT NULL',
    table_name
  ) USING record_id;

  RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION public.restore_deleted IS 'Restore a soft deleted record';

-- Success notification
DO $$
BEGIN
  RAISE NOTICE '✓ Database functions created successfully';
  RAISE NOTICE '  - Utility functions (slug generation, search)';
  RAISE NOTICE '  - Folder management (paths, counts)';
  RAISE NOTICE '  - User management (roles, login attempts)';
  RAISE NOTICE '  - Content management (related posts, search)';
  RAISE NOTICE '  - Analytics (stats, popular content)';
  RAISE NOTICE '  - Soft delete/restore';
END $$;
