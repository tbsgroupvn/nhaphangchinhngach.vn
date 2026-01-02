-- =====================================================
-- Migration: Fix Posts Author Reference
-- Version: 20260102130000
-- Description: Update posts.author_id to reference auth.users instead of public.users
-- Author: TBS Group Backend Team
-- =====================================================

-- Drop old constraint if exists
ALTER TABLE IF EXISTS public.posts
  DROP CONSTRAINT IF EXISTS posts_author_id_fkey;

-- Add new constraint referencing auth.users
ALTER TABLE public.posts
  ADD CONSTRAINT posts_author_id_fkey
  FOREIGN KEY (author_id)
  REFERENCES auth.users(id)
  ON DELETE SET NULL;

-- Same fix for services table
ALTER TABLE IF EXISTS public.services
  DROP CONSTRAINT IF EXISTS services_author_id_fkey;

ALTER TABLE public.services
  ADD CONSTRAINT services_author_id_fkey
  FOREIGN KEY (author_id)
  REFERENCES auth.users(id)
  ON DELETE SET NULL;

-- Same fix for customer_stories table
ALTER TABLE IF EXISTS public.customer_stories
  DROP CONSTRAINT IF EXISTS customer_stories_author_id_fkey;

ALTER TABLE public.customer_stories
  ADD CONSTRAINT customer_stories_author_id_fkey
  FOREIGN KEY (author_id)
  REFERENCES auth.users(id)
  ON DELETE SET NULL;

-- Same fix for jobs table
ALTER TABLE IF EXISTS public.jobs
  DROP CONSTRAINT IF EXISTS jobs_author_id_fkey;

ALTER TABLE public.jobs
  ADD CONSTRAINT jobs_author_id_fkey
  FOREIGN KEY (author_id)
  REFERENCES auth.users(id)
  ON DELETE SET NULL;

-- Success notification
DO $$
BEGIN
  RAISE NOTICE '✓ Fixed author_id foreign key references';
  RAISE NOTICE '  - posts.author_id -> auth.users(id)';
  RAISE NOTICE '  - services.author_id -> auth.users(id)';
  RAISE NOTICE '  - customer_stories.author_id -> auth.users(id)';
  RAISE NOTICE '  - jobs.author_id -> auth.users(id)';
END $$;
