# Showcase Section Setup Guide

## What Was Added

A new "Rotating Showcase" tab has been added to the Home Settings admin page that allows you to edit the rotating motorcycle showcase section with features displayed on both sides.

## Database Setup

Run this SQL in your Supabase SQL Editor:

```sql
-- Run the add-showcase-features.sql file
```

Or copy and paste the contents of `add-showcase-features.sql` into Supabase SQL Editor.

## Features

### Admin Interface
- **New Tab**: "نمایش چرخشی" (Rotating Showcase) tab in Home Settings
- **Add/Remove Features**: Add or remove showcase features dynamically
- **Multilingual Support**: Edit content in English, Dari, and Pashto
- **Order Management**: Control the display order of features
- **Number Badges**: Customize the feature number (01, 02, etc.)

### Default Features Included
1. **Rapid Charging** - Full charge in 1 hour
2. **Low-to-No Maintenance** - Fluidity without fluids
3. **223MI Peak Range** - SR/F city range with Power Tank
4. **124MPH Top Speed** - No clutch, no gears, just go
5. **Cypher III+** - Advanced performance customization
6. **Instant Torque** - Up to 169 lb-ft of torque

### Visibility Control
- Toggle the entire showcase section on/off from the "Visibility" tab
- Control which sections appear on the home page

## How to Use

1. **Navigate to Admin Panel**
   - Go to `/x9k2m7p4q8w5n3j6/home-settings`
   - Click on "نمایش چرخشی" tab

2. **Add New Feature**
   - Click "افزودن ویژگی جدید" button
   - Fill in the feature details in all three languages
   - Set the number badge (01, 02, etc.)
   - Set the display order

3. **Edit Existing Features**
   - Update any field directly in the form
   - Changes are saved when you click "ذخیره تغییرات"

4. **Remove Features**
   - Click the "حذف" (Delete) button on any feature card

5. **Control Visibility**
   - Go to "نمایش" (Visibility) tab
   - Toggle "بخش نمایش چرخشی" on/off

## Database Tables

### home_showcase_features
- `id` - UUID primary key
- `number` - Feature number badge (01, 02, etc.)
- `title_en` - English title
- `title_dari` - Dari title
- `title_pashto` - Pashto title
- `subtitle_en` - English description
- `subtitle_dari` - Dari description
- `subtitle_pashto` - Pashto description
- `order_index` - Display order
- `created_at` - Timestamp
- `updated_at` - Timestamp

### home_visibility (updated)
- Added `show_showcase_section` column to control section visibility

## API Updates

The following API functions have been updated:

- `getHomeSettings()` - Now includes `showcase_features` array
- `updateHomeSettings()` - Now saves showcase features to database

## Next Steps

1. Run the SQL migration: `add-showcase-features.sql`
2. Refresh the admin page
3. Navigate to the "نمایش چرخشی" tab
4. Customize the showcase features as needed
5. Click "ذخیره تغییرات" to save

## Notes

- The showcase section displays features in pairs (2 per screen)
- Features are ordered by `order_index`
- All content is multilingual (English, Dari, Pashto)
- The section can be toggled on/off without deleting data
