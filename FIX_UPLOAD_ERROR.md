# 🔧 Fix Upload Error - RLS Policy Issue

## Error You're Seeing:
```
StorageApiError: new row violates row-level security policy
```

## Quick Fix (2 Steps):

### Step 1: Run This SQL in Supabase

Copy and paste this into Supabase SQL Editor:

```sql
-- Drop existing policies
DROP POLICY IF EXISTS "Public can view images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can upload images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can upload images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can update images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can delete images" ON storage.objects;

-- Create new simple policies
CREATE POLICY "Public can view images"
ON storage.objects FOR SELECT
USING (bucket_id = 'images');

CREATE POLICY "Anyone can upload images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'images');

CREATE POLICY "Anyone can update images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'images');

CREATE POLICY "Anyone can delete images"
ON storage.objects FOR DELETE
USING (bucket_id = 'images');

-- Ensure bucket exists and is public
INSERT INTO storage.buckets (id, name, public)
VALUES ('images', 'images', true)
ON CONFLICT (id) DO UPDATE SET public = true;
```

### Step 2: Test Upload

1. Go to `/x9k2m7p4q8w5n3j6/home-settings`
2. Try uploading an image
3. Should work now! ✅

## What This Does:

- ✅ Removes restrictive RLS policies
- ✅ Allows anyone to upload to 'images' bucket
- ✅ Makes bucket public for viewing
- ✅ Fixes the "row-level security policy" error

## ⚠️ Security Note:

This is a simplified setup for development/testing. For production, you should:
1. Restrict uploads to authenticated admins only
2. Add file size limits
3. Add file type validation

But for now, this will get your system working!

---

**After running this SQL, image uploads will work immediately!** 🎉
