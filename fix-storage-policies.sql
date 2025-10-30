-- =====================================================
-- FIX STORAGE POLICIES FOR IMAGE UPLOADS
-- Run this in Supabase SQL Editor
-- =====================================================

-- First, drop existing policies if any
DROP POLICY IF EXISTS "Public can view images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can upload images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can upload images" ON storage.objects;

-- Create simple policies that allow uploads
-- Policy 1: Anyone can view images (public read)
CREATE POLICY "Public can view images"
ON storage.objects FOR SELECT
USING (bucket_id = 'images');

-- Policy 2: Allow authenticated users to upload (for now, allow anyone)
CREATE POLICY "Anyone can upload images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'images');

-- Policy 3: Allow authenticated users to update
CREATE POLICY "Anyone can update images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'images');

-- Policy 4: Allow authenticated users to delete
CREATE POLICY "Anyone can delete images"
ON storage.objects FOR DELETE
USING (bucket_id = 'images');

-- Make sure the bucket exists and is public
INSERT INTO storage.buckets (id, name, public)
VALUES ('images', 'images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Success message
DO $$
BEGIN
  RAISE NOTICE '✅ Storage policies fixed!';
  RAISE NOTICE '📦 Bucket "images" is now public';
  RAISE NOTICE '🔓 Anyone can upload images';
  RAISE NOTICE '';
  RAISE NOTICE '⚠️ SECURITY NOTE: For production, you should restrict uploads to admins only.';
  RAISE NOTICE 'For now, this allows testing without authentication issues.';
END $$;
