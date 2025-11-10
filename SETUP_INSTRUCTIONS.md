# 🚀 Setup Instructions - Home Page Settings

## ⚠️ IMPORTANT: You Must Run SQL First!

The system won't work until you create the database tables. Follow these steps:

## Step 1: Create Database Tables

1. **Open Supabase Dashboard**
   - Go to your Supabase project
   - Click on "SQL Editor" in the left sidebar

2. **Copy SQL Code**
   - Open the file `SQL_CODE_ONLY.sql` in this project
   - Copy ALL the content (Ctrl+A, then Ctrl+C)

3. **Run SQL Code**
   - Paste the code into Supabase SQL Editor
   - Click the "Run" button (or press Ctrl+Enter)
   - Wait for it to complete

4. **Verify Tables Created**
   Run this query to check:
   ```sql
   SELECT table_name 
   FROM information_schema.tables 
   WHERE table_schema = 'public' 
   AND table_name LIKE 'home_%';
   ```
   
   You should see:
   - home_hero_settings
   - home_features
   - home_section_settings
   - home_settings_audit_log

## Step 2: Create Storage Bucket (for images)

1. **Go to Storage** in Supabase Dashboard
2. **Create New Bucket**:
   - Name: `images`
   - Public: ✅ Yes
   - Click "Create bucket"

OR run this SQL:
```sql
INSERT INTO storage.buckets (id, name, public)
VALUES ('images', 'images', true)
ON CONFLICT (id) DO NOTHING;
```

## Step 3: Test the System

1. **Go to Admin Panel**
   ```
   http://localhost:3000/x9k2m7p4q8w5n3j6/home-settings
   ```

2. **Try Editing**
   - Change some text
   - Click "ذخیره تغییرات" (Save)
   - You should see a success message

3. **Check Home Page**
   ```
   http://localhost:3000/
   ```
   - Refresh the page
   - Your changes should appear!

## 🐛 Troubleshooting

### Error: "Failed to load settings"
**Solution:** You haven't run the SQL code yet. Go to Step 1.

### Error: "Failed to upload image"
**Solution:** Storage bucket doesn't exist. Go to Step 2.

### Error: "Permission denied"
**Solution:** RLS policies not set up. Re-run the SQL code from Step 1.

### Changes don't appear on home page
**Solution:** 
1. Hard refresh browser (Ctrl+Shift+R)
2. Check browser console for errors (F12)
3. Verify data saved in Supabase:
   ```sql
   SELECT * FROM home_hero_settings;
   ```

## ✅ Success Checklist

- [ ] SQL code executed in Supabase
- [ ] Tables created (4 tables)
- [ ] Storage bucket created
- [ ] Admin page loads without errors
- [ ] Can edit and save content
- [ ] Can upload images
- [ ] Changes appear on home page

## 📞 Need Help?

1. Check browser console (F12) for errors
2. Check Supabase logs for database errors
3. Verify your `.env.local` has correct Supabase credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
   ```

---

**Once you complete these steps, everything will work perfectly!** 🎉
