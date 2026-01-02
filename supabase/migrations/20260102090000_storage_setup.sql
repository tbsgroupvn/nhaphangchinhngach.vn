-- =====================================================
-- Migration: Storage Setup
-- Version: 20260102090000
-- Description: Configure Supabase Storage buckets and policies
-- Author: TBS Group Backend Team
-- =====================================================

-- =====================================================
-- CREATE STORAGE BUCKETS
-- =====================================================

-- Bucket for uploaded media files (images, videos, documents)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'media',
  'media',
  TRUE, -- Public bucket for website assets
  52428800, -- 50MB limit
  ARRAY[
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'image/svg+xml',
    'video/mp4',
    'video/webm',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ]
) ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Bucket for user avatars
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'avatars',
  'avatars',
  TRUE,
  2097152, -- 2MB limit
  ARRAY[
    'image/jpeg',
    'image/png',
    'image/webp'
  ]
) ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Bucket for private documents (invoices, contracts, etc.)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'documents',
  'documents',
  FALSE, -- Private bucket
  52428800, -- 50MB limit
  ARRAY[
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/zip'
  ]
) ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- =====================================================
-- STORAGE POLICIES - MEDIA BUCKET
-- =====================================================

-- Public read access for media files
CREATE POLICY "Public can view media files"
ON storage.objects FOR SELECT
USING (bucket_id = 'media');

-- Authenticated users can upload media
CREATE POLICY "Authenticated users can upload media"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'media'
  AND auth.role() = 'authenticated'
);

-- Users can update their own uploads
CREATE POLICY "Users can update their own media"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'media'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Users can delete their own uploads
CREATE POLICY "Users can delete their own media"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'media'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- =====================================================
-- STORAGE POLICIES - AVATARS BUCKET
-- =====================================================

-- Public read access for avatars
CREATE POLICY "Public can view avatars"
ON storage.objects FOR SELECT
USING (bucket_id = 'avatars');

-- Authenticated users can upload avatars
CREATE POLICY "Authenticated users can upload avatars"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'avatars'
  AND auth.role() = 'authenticated'
);

-- Users can update their own avatar
CREATE POLICY "Users can update their own avatar"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'avatars'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Users can delete their own avatar
CREATE POLICY "Users can delete their own avatar"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'avatars'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- =====================================================
-- STORAGE POLICIES - DOCUMENTS BUCKET (Private)
-- =====================================================

-- Authenticated users can view documents
CREATE POLICY "Authenticated users can view documents"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'documents'
  AND auth.role() = 'authenticated'
);

-- Authenticated users can upload documents
CREATE POLICY "Authenticated users can upload documents"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'documents'
  AND auth.role() = 'authenticated'
);

-- Users can update their own documents
CREATE POLICY "Users can update their own documents"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'documents'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Users can delete their own documents
CREATE POLICY "Users can delete their own documents"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'documents'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Success notification
DO $$
BEGIN
  RAISE NOTICE '✓ Storage buckets and policies configured';
  RAISE NOTICE '';
  RAISE NOTICE 'Created buckets:';
  RAISE NOTICE '  - media (public, 50MB limit)';
  RAISE NOTICE '  - avatars (public, 2MB limit)';
  RAISE NOTICE '  - documents (private, 50MB limit)';
  RAISE NOTICE '';
  RAISE NOTICE 'Storage policies:';
  RAISE NOTICE '  - Public read access for media and avatars';
  RAISE NOTICE '  - Authenticated upload/update/delete';
  RAISE NOTICE '  - User-level access control';
  RAISE NOTICE '';
  RAISE NOTICE 'File organization:';
  RAISE NOTICE '  - Use /{user_id}/{filename} structure';
  RAISE NOTICE '  - This enables automatic ownership checks';
END $$;
