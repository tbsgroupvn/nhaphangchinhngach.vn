-- =====================================================
-- Migration: Setup Supabase Storage for Media
-- Version: 20260102140000
-- Description: Create storage bucket and RLS policies for media files
-- Author: TBS Group Backend Team
-- =====================================================

-- Fix media_files.user_id to reference auth.users
ALTER TABLE IF EXISTS public.media_files
  DROP CONSTRAINT IF EXISTS media_files_user_id_fkey;

ALTER TABLE public.media_files
  ADD CONSTRAINT media_files_user_id_fkey
  FOREIGN KEY (user_id)
  REFERENCES auth.users(id)
  ON DELETE SET NULL;

-- =====================================================
-- STORAGE BUCKET SETUP
-- =====================================================

-- Create bucket for CMS media (public access)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'cms-media',
  'cms-media',
  true,
  52428800, -- 50MB limit
  ARRAY[
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp',
    'image/svg+xml',
    'video/mp4',
    'video/webm',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ]
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 52428800;

-- =====================================================
-- STORAGE POLICIES
-- =====================================================

-- Policy: Authenticated users can upload
DROP POLICY IF EXISTS "Authenticated users can upload" ON storage.objects;
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'cms-media'
);

-- Policy: Authenticated users can update their own files
DROP POLICY IF EXISTS "Users can update own files" ON storage.objects;
CREATE POLICY "Users can update own files"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'cms-media' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Policy: Authenticated users can delete their own files
DROP POLICY IF EXISTS "Users can delete own files" ON storage.objects;
CREATE POLICY "Users can delete own files"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'cms-media' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Policy: Public read access
DROP POLICY IF EXISTS "Public read access" ON storage.objects;
CREATE POLICY "Public read access"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'cms-media');

-- =====================================================
-- HELPER FUNCTION: Get file type from mime type
-- =====================================================
CREATE OR REPLACE FUNCTION public.get_media_type(mime_type TEXT)
RETURNS VARCHAR(50) AS $$
BEGIN
  IF mime_type LIKE 'image/%' THEN
    RETURN 'image';
  ELSIF mime_type LIKE 'video/%' THEN
    RETURN 'video';
  ELSIF mime_type LIKE 'audio/%' THEN
    RETURN 'audio';
  ELSE
    RETURN 'document';
  END IF;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

COMMENT ON FUNCTION public.get_media_type(TEXT) IS 'Determine media file type from MIME type';

-- Success notification
DO $$
BEGIN
  RAISE NOTICE '✓ Supabase Storage configured successfully';
  RAISE NOTICE '  - Bucket: cms-media (public, 50MB limit)';
  RAISE NOTICE '  - Policies: authenticated upload, public read';
  RAISE NOTICE '  - Allowed: images, videos, PDF, Word docs';
  RAISE NOTICE '  - Fixed: media_files.user_id -> auth.users(id)';
END $$;
