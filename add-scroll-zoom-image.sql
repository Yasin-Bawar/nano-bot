-- Add scroll_zoom_image_url column to home_hero_settings table
ALTER TABLE home_hero_settings 
ADD COLUMN IF NOT EXISTS scroll_zoom_image_url TEXT DEFAULT '/images/IMG-20251021-WA0010.jpg';

-- Update existing record with default value
UPDATE home_hero_settings 
SET scroll_zoom_image_url = '/images/IMG-20251021-WA0010.jpg'
WHERE scroll_zoom_image_url IS NULL;
