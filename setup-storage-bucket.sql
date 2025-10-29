-- =====================================================
-- Setup Storage Bucket for Message Images
-- =====================================================

-- Create storage bucket for uploads
INSERT INTO storage.buckets (id, name, public)
VALUES ('uploads', 'uploads', true)
ON CONFLICT (id) DO NOTHING;

-- Set up storage policies for public access
CREATE POLICY "Public can view uploads"
ON storage.objects FOR SELECT
USING (bucket_id = 'uploads');

CREATE POLICY "Anyone can upload files"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'uploads');

CREATE POLICY "Anyone can update their uploads"
ON storage.objects FOR UPDATE
USING (bucket_id = 'uploads');

CREATE POLICY "Anyone can delete their uploads"
ON storage.objects FOR DELETE
USING (bucket_id = 'uploads');

-- =====================================================
-- COMPLETED!
-- =====================================================
-- Run this script in your Supabase SQL Editor
-- This will create a public storage bucket for message images
-- =====================================================
