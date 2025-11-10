# Featured Products System - Complete

## What Was Done

Created a complete system to select which products appear on the home page from the admin panel.

## Setup Steps

1. **Run SQL Migration**
   ```bash
   # Run add-featured-products.sql in Supabase SQL Editor
   ```

2. **How It Works**
   - Admin selects products from the Products tab in Home Settings
   - Selected product IDs are saved to `home_featured_products` table
   - Home page loads only the selected products in the specified order
   - If no products are selected, falls back to products marked as "featured"

## Features

✅ **Product Selector** - Visual grid of all products with checkboxes
✅ **Select/Deselect All** - Quick selection button
✅ **Visual Feedback** - Selected products highlighted with green border
✅ **Product Preview** - Shows image, name, category, and price
✅ **Counter** - Shows how many products selected
✅ **Order Preserved** - Products appear in the order they were selected
✅ **Database Connected** - Saves to and loads from database
✅ **Fallback** - If no products selected, shows products marked as "featured"

## Database Tables

### home_featured_products
- `id` - UUID primary key
- `product_id` - References products table
- `order_index` - Display order
- `created_at` - Timestamp
- `updated_at` - Timestamp

## API Functions Updated

### lib/api/home-settings.ts
- `getHomeSettings()` - Now loads featured_product_ids
- `updateHomeSettings()` - Now saves featured products

### lib/api/products.ts
- `getFeaturedProducts()` - Now returns products based on home_featured_products table

## Admin Panel Usage

1. Go to `/x9k2m7p4q8w5n3j6/home-settings`
2. Click "محصولات" (Products) tab
3. Scroll down to "انتخاب محصولات نمایشی"
4. Click on products to select/deselect them
5. Click "ذخیره تغییرات" to save
6. Selected products will appear on home page

## Home Page

The ProductsGridSection component automatically shows only the selected products in the order they were selected.

## Notes

- Products are displayed in the order they were selected
- Maximum recommended: 6-8 products for best layout
- If no products are selected, shows products with `featured = true`
- Product selection is preserved across page refreshes
