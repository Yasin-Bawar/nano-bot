# Models Showcase Section Setup Guide

## What Was Added

A new "مدل‌های موتور" (Models) tab has been added to the Home Settings admin page that allows you to edit the SR/S, SR/F, S, DSR/X models showcase section.

## Database Setup

Run this SQL in your Supabase SQL Editor:

```bash
# Copy and paste the contents of add-models-showcase.sql
```

## Features

### Admin Interface
- **New Tab**: "مدل‌های موتور" tab in Home Settings (first tab after Hero)
- **Add/Remove Models**: Add or remove motorcycle models dynamically
- **Full Customization**: Edit model name, specs, background color, and image
- **Order Management**: Control the display order of models
- **Color Picker**: Visual color picker for background colors

### Default Models Included
1. **SR/S** - 171 miles range, 1.1 hours charge, 124 MPH speed
2. **SR/F** - 176 miles range, 1.1 hours charge, 124 MPH speed
3. **S** - 154 miles range, 1.3 hours charge, 104 MPH speed
4. **DSR/X** - 180 miles range, 1.5 hours charge, 112 MPH speed

### Editable Fields
- **Model Name**: SR/S, SR/F, S, DSR/X, etc.
- **Range**: Miles (e.g., 171)
- **Charge Time**: Hours (e.g., 1.1)
- **Top Speed**: MPH (e.g., 124)
- **Background Color**: Hex color code with visual picker
- **Image URL**: Path to motorcycle image
- **Display Order**: Control which model appears first

## How to Use

1. **Navigate to Admin Panel**
   - Go to `/x9k2m7p4q8w5n3j6/home-settings`
   - Click on "مدل‌های موتور" tab (second tab)

2. **Add New Model**
   - Click "افزودن مدل جدید" button
   - Fill in all the model details
   - Choose a background color
   - Set the image URL
   - Set the display order

3. **Edit Existing Models**
   - Update any field directly in the form
   - Use the color picker to change background color
   - Preview the image in real-time

4. **Remove Models**
   - Click the "حذف" (Delete) button on any model card

5. **Control Visibility**
   - Go to "نمایش" (Visibility) tab
   - Toggle "بخش مدل‌های موتور" on/off

6. **Save Changes**
   - Click "ذخیره تغییرات" button at the top

## Database Tables

### home_models_showcase
- `id` - UUID primary key
- `name` - Model name (SR/S, SR/F, etc.)
- `range` - Range in miles
- `charge` - Charge time in hours
- `speed` - Top speed in MPH
- `bg_color` - Background color (hex code)
- `image_url` - Path to motorcycle image
- `order_index` - Display order
- `created_at` - Timestamp
- `updated_at` - Timestamp

### home_visibility (updated)
- Added `show_models_showcase_section` column

## API Updates

The following API functions have been updated:

- `getHomeSettings()` - Now includes `model_showcases` array
- `updateHomeSettings()` - Now saves model showcases to database

## Next Steps

1. Run the SQL migration: `add-models-showcase.sql`
2. Refresh the admin page
3. Navigate to the "مدل‌های موتور" tab
4. You'll see 4 default models (SR/S, SR/F, S, DSR/X)
5. Customize them as needed
6. Click "ذخیره تغییرات" to save

## Notes

- The section displays models with scroll-based transitions
- Each model has its own background color
- Models are ordered by `order_index`
- The section can be toggled on/off without deleting data
- Images should be placed in `/public/images/` folder
