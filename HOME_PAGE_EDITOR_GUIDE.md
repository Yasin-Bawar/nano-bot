# 🏠 Home Page Settings - Complete Guide

## Overview
A comprehensive web builder-style editor for your website's home page. Edit all content, images, and elements dynamically from the admin panel.

## 🎯 Features

### 1. **Hero Section Editor**
- ✅ Customize taglines (Dari & Pashto)
- ✅ Edit subtitles (Dari & Pashto)
- ✅ Upload hero background image
- ✅ Configure performance stats (Range, Speed, Charge Time)
- ✅ Manage available colors
- ✅ Customize CTA button text

### 2. **Features Section Manager**
- ✅ Add/Remove feature cards
- ✅ Edit titles in 3 languages (English, Dari, Pashto)
- ✅ Customize descriptions
- ✅ Set stat values
- ✅ Choose icons (Battery, Zap, Gauge, Shield, Wifi, Leaf)
- ✅ Reorder features

### 3. **Products Section Configuration**
- ✅ Edit section titles (Dari & Pashto)
- ✅ Customize subtitles
- ✅ Products automatically pulled from database

### 4. **Visibility Controls**
- ✅ Show/Hide Products Section
- ✅ Show/Hide Features Section
- ✅ Show/Hide Contact Section

## 📦 Installation

### Step 1: Run SQL Schema
Execute the SQL file in your Supabase SQL Editor:

```bash
# File: home-settings-schema.sql
```

This creates:
- `home_hero_settings` table
- `home_features` table
- `home_section_settings` table
- `home_settings_audit_log` table
- Storage bucket for images
- RLS policies
- Default data

### Step 2: Verify Tables
Check that all tables were created:

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name LIKE 'home_%';
```

### Step 3: Access Admin Panel
Navigate to: `http://your-domain.com/admin/home-settings`

## 🎨 How to Use

### Editing Hero Section

1. **Change Hero Image**
   - Click "Choose File" under Hero Background Image
   - Select image (recommended: 1920x1080px)
   - Image uploads automatically to Supabase Storage

2. **Edit Text Content**
   - Update taglines for both languages
   - Modify subtitles
   - Change CTA button text

3. **Update Stats**
   - Enter new values for Range, Speed, Charge Time
   - Values appear in the hero section cards

4. **Customize Colors**
   - Enter hex color codes separated by commas
   - Example: `#000000, #DC2626, #2563EB, #FFFFFF`

### Managing Features

1. **Add New Feature**
   - Click "Add Feature" button
   - Fill in all fields:
     - Title (English, Dari, Pashto)
     - Description (Dari, Pashto)
     - Stat value (e.g., "220km", "1hr")
     - Icon selection
     - Order index

2. **Edit Existing Feature**
   - Modify any field directly
   - Changes save when you click "Save Changes"

3. **Remove Feature**
   - Click trash icon on feature card
   - Feature removed immediately

4. **Reorder Features**
   - Change the "Order" number
   - Lower numbers appear first

### Products Section

1. **Edit Titles**
   - Update section title for both languages
   - Modify subtitle text

2. **Products Display**
   - Products automatically pulled from database
   - Shows featured products only
   - Managed in Products admin page

### Visibility Settings

Toggle sections on/off:
- ✅ Products Section
- ✅ Features Section
- ✅ Contact Section

## 🔄 Real-Time Updates

Changes appear on the home page immediately after saving:

1. Edit content in admin panel
2. Click "Save Changes"
3. Refresh home page to see updates
4. No code deployment needed!

## 📊 Database Structure

### home_hero_settings
```sql
- id (PRIMARY KEY)
- tagline_dari
- tagline_pashto
- subtitle_dari
- subtitle_pashto
- image_url
- range_value
- speed_value
- charge_value
- colors (TEXT[])
- cta_text_dari
- cta_text_pashto
- created_at
- updated_at
```

### home_features
```sql
- id (UUID PRIMARY KEY)
- title_dari
- title_pashto
- title_en
- description_dari
- description_pashto
- stat
- icon
- order_index
- created_at
- updated_at
```

### home_section_settings
```sql
- id (PRIMARY KEY)
- products_title_dari
- products_title_pashto
- products_subtitle_dari
- products_subtitle_pashto
- show_products_section
- show_features_section
- show_contact_section
- created_at
- updated_at
```

## 🔒 Security

### RLS Policies
- ✅ Public can READ all settings
- ✅ Only admins can UPDATE settings
- ✅ Admin authentication required

### Storage Policies
- ✅ Public can view images
- ✅ Only admins can upload/delete images

## 🎯 API Endpoints

### Get Settings
```typescript
import { getHomeSettings } from "@/lib/api/home-settings"

const settings = await getHomeSettings()
```

### Update Settings
```typescript
import { updateHomeSettings } from "@/lib/api/home-settings"

await updateHomeSettings(settings)
```

### Upload Image
```typescript
import { uploadImage } from "@/lib/api/home-settings"

const url = await uploadImage(file)
```

## 🚀 Advanced Features

### Audit Log
All changes are tracked in `home_settings_audit_log`:
- Who made the change
- What was changed
- When it was changed
- Old and new values

### Helper View
Use `home_page_config` view for complete configuration:

```sql
SELECT * FROM home_page_config;
```

Returns:
- Hero settings
- All features
- Section settings

## 🎨 Customization

### Adding New Icons
Edit `components/features-showcase-section.tsx`:

```typescript
import { NewIcon } from "lucide-react"

const iconMap: Record<string, any> = {
  Battery,
  Zap,
  Gauge,
  Shield,
  Wifi,
  Leaf,
  NewIcon  // Add your icon here
}
```

### Adding New Sections
1. Create new table in SQL
2. Add API functions in `lib/api/home-settings.ts`
3. Add tab in admin page
4. Update home page component

## 📱 Responsive Design

All sections are fully responsive:
- ✅ Mobile (< 768px)
- ✅ Tablet (768px - 1024px)
- ✅ Desktop (> 1024px)

## 🐛 Troubleshooting

### Images Not Uploading
1. Check storage bucket exists: `home-images`
2. Verify RLS policies on storage.objects
3. Check file size (max 5MB recommended)

### Changes Not Appearing
1. Clear browser cache
2. Check if settings saved successfully
3. Verify RLS policies allow public read

### Features Not Showing
1. Check `show_features_section` is true
2. Verify features exist in database
3. Check order_index values

## 📝 Best Practices

1. **Images**
   - Use optimized images (WebP format)
   - Recommended size: 1920x1080px for hero
   - Keep file size under 500KB

2. **Text Content**
   - Keep taglines short (< 50 characters)
   - Subtitles should be 1-2 sentences
   - Use clear, concise descriptions

3. **Features**
   - Limit to 6-8 features for best UX
   - Use consistent stat formats
   - Order by importance

4. **Colors**
   - Use brand colors
   - Ensure good contrast
   - Test on different backgrounds

## 🔄 Backup & Restore

### Backup Settings
```sql
-- Export hero settings
COPY home_hero_settings TO '/tmp/hero_backup.csv' CSV HEADER;

-- Export features
COPY home_features TO '/tmp/features_backup.csv' CSV HEADER;

-- Export section settings
COPY home_section_settings TO '/tmp/sections_backup.csv' CSV HEADER;
```

### Restore Settings
```sql
-- Import hero settings
COPY home_hero_settings FROM '/tmp/hero_backup.csv' CSV HEADER;

-- Import features
COPY home_features FROM '/tmp/features_backup.csv' CSV HEADER;

-- Import section settings
COPY home_section_settings FROM '/tmp/sections_backup.csv' CSV HEADER;
```

## 🎉 Success!

Your home page editor is now fully functional! You can:
- ✅ Edit all content from admin panel
- ✅ Upload and manage images
- ✅ Add/remove features dynamically
- ✅ Control section visibility
- ✅ See changes in real-time

## 📞 Support

For issues or questions:
1. Check the troubleshooting section
2. Review SQL schema for table structure
3. Verify RLS policies are correct
4. Check browser console for errors

---

**Built with:** Next.js, Supabase, TypeScript, Tailwind CSS
**Version:** 1.0.0
**Last Updated:** 2025
