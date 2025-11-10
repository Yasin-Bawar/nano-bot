# 🚀 Home Page Settings - Installation Steps

## Prerequisites
- ✅ Supabase project set up
- ✅ Admin system configured
- ✅ Next.js app running

## Step-by-Step Installation

### Step 1: Execute SQL Schema ⚡

1. Open your Supabase Dashboard
2. Go to **SQL Editor**
3. Click **New Query**
4. Copy the entire content from `home-settings-schema.sql`
5. Paste into the SQL Editor
6. Click **Run** or press `Ctrl+Enter`

**Expected Output:**
```
✅ Home Page Settings Schema Created Successfully!
📋 Tables created:
   - home_hero_settings
   - home_features
   - home_section_settings
   - home_settings_audit_log
🔒 RLS policies configured
📦 Storage bucket "home-images" configured
✨ Default data inserted
```

### Step 2: Verify Installation ✓

Run this query to verify tables were created:

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name LIKE 'home_%'
ORDER BY table_name;
```

**Expected Result:**
```
home_features
home_hero_settings
home_section_settings
home_settings_audit_log
```

### Step 3: Check Default Data 📊

Verify default data was inserted:

```sql
-- Check hero settings
SELECT * FROM home_hero_settings;

-- Check features
SELECT * FROM home_features ORDER BY order_index;

-- Check section settings
SELECT * FROM home_section_settings;
```

### Step 4: Verify Storage Bucket 🗂️

1. Go to **Storage** in Supabase Dashboard
2. Look for bucket named `home-images`
3. Verify it's set to **Public**

If bucket doesn't exist, create it manually:
```sql
INSERT INTO storage.buckets (id, name, public)
VALUES ('home-images', 'home-images', true)
ON CONFLICT (id) DO NOTHING;
```

### Step 5: Test Admin Access 🔐

1. Start your Next.js development server:
```bash
npm run dev
```

2. Login to admin panel:
```
http://localhost:3000/admin
```

3. Navigate to Home Settings:
```
http://localhost:3000/x9k2m7p4q8w5n3j6/home-settings
```

### Step 6: Test Functionality ✨

#### Test 1: Load Settings
- Page should load without errors
- Default data should appear in forms
- All tabs should be accessible

#### Test 2: Edit Hero Section
1. Go to **Hero Section** tab
2. Change tagline text
3. Click **Save Changes**
4. Should see success toast notification

#### Test 3: Upload Image
1. Click **Choose File** under Hero Image
2. Select an image (JPG, PNG, WebP)
3. Wait for upload to complete
4. Image preview should appear

#### Test 4: Add Feature
1. Go to **Features** tab
2. Click **Add Feature**
3. Fill in all fields
4. Click **Save Changes**
5. Feature should be added

#### Test 5: Toggle Visibility
1. Go to **Visibility** tab
2. Toggle any section off
3. Click **Save Changes**
4. Visit home page - section should be hidden

### Step 7: Verify Home Page Integration 🏠

1. Open home page:
```
http://localhost:3000/
```

2. Check that:
   - Hero section displays your content
   - Features section shows your features
   - Products section appears (if enabled)
   - All text is in correct language

3. Test language switching:
   - Switch between Dari and Pashto
   - Content should update accordingly

### Step 8: Test Image Upload 📸

1. Prepare a test image (1920x1080px recommended)
2. Go to admin home settings
3. Upload image in Hero Section
4. Check Supabase Storage:
   - Go to Storage → home-images
   - Your image should be there
5. Refresh home page
6. New image should appear in hero section

## 🐛 Troubleshooting

### Issue: SQL Execution Fails

**Error:** `relation "admin_users" does not exist`

**Solution:** Make sure admin system is set up first. Run `admin-schema.sql` before this schema.

---

**Error:** `bucket "home-images" already exists`

**Solution:** This is fine! The bucket already exists. Continue with installation.

---

**Error:** `permission denied for table`

**Solution:** Make sure you're running SQL as the database owner or with sufficient privileges.

### Issue: Admin Page Shows 404

**Solution:** 
1. Check file exists: `app/x9k2m7p4q8w5n3j6/home-settings/page.tsx`
2. Restart Next.js dev server
3. Clear `.next` cache: `rm -rf .next`

### Issue: Images Not Uploading

**Solution:**
1. Check storage bucket exists and is public
2. Verify RLS policies on `storage.objects`
3. Check file size (keep under 5MB)
4. Try different image format (JPG, PNG, WebP)

### Issue: Changes Not Appearing on Home Page

**Solution:**
1. Hard refresh browser (Ctrl+Shift+R)
2. Clear browser cache
3. Check browser console for errors
4. Verify settings saved in database:
```sql
SELECT * FROM home_hero_settings;
```

### Issue: Features Not Displaying

**Solution:**
1. Check features exist:
```sql
SELECT * FROM home_features;
```
2. Verify `show_features_section` is true:
```sql
SELECT show_features_section FROM home_section_settings;
```
3. Check browser console for errors

### Issue: RLS Policy Errors

**Solution:**
Run this to check policies:
```sql
SELECT schemaname, tablename, policyname 
FROM pg_policies 
WHERE tablename LIKE 'home_%';
```

If policies are missing, re-run the RLS section from schema file.

## ✅ Installation Checklist

- [ ] SQL schema executed successfully
- [ ] All 4 tables created
- [ ] Default data inserted
- [ ] Storage bucket created
- [ ] RLS policies configured
- [ ] Admin page accessible
- [ ] Can load settings
- [ ] Can save changes
- [ ] Can upload images
- [ ] Can add/remove features
- [ ] Changes appear on home page
- [ ] Language switching works
- [ ] Mobile responsive
- [ ] No console errors

## 🎉 Success!

If all checks pass, your home page settings system is fully installed and working!

## 📚 Next Steps

1. **Customize Content**
   - Update hero taglines
   - Add your features
   - Upload your images

2. **Test Thoroughly**
   - Test on mobile devices
   - Test all languages
   - Test image uploads

3. **Train Your Team**
   - Show them the admin panel
   - Explain how to edit content
   - Share the user guide

4. **Monitor Performance**
   - Check page load times
   - Optimize images
   - Monitor database queries

## 📞 Support

If you encounter issues:
1. Check troubleshooting section above
2. Review `HOME_PAGE_EDITOR_GUIDE.md`
3. Check browser console for errors
4. Verify database tables and data
5. Check Supabase logs

## 🔄 Rollback (If Needed)

To remove everything:

```sql
-- Drop tables
DROP TABLE IF EXISTS home_settings_audit_log CASCADE;
DROP TABLE IF EXISTS home_features CASCADE;
DROP TABLE IF EXISTS home_section_settings CASCADE;
DROP TABLE IF EXISTS home_hero_settings CASCADE;

-- Drop view
DROP VIEW IF EXISTS home_page_config;

-- Drop function
DROP FUNCTION IF EXISTS update_home_settings_updated_at();

-- Delete storage bucket (optional)
DELETE FROM storage.buckets WHERE id = 'home-images';
```

---

**Installation Time:** ~5 minutes
**Difficulty:** Easy
**Version:** 1.0.0
