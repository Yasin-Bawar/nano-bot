-- ============================================
-- COMPLETE HOME SETTINGS MIGRATIONS
-- Run this entire file in Supabase SQL Editor
-- ============================================

-- 1. Add scroll_zoom_image_url to hero settings
ALTER TABLE home_hero_settings 
ADD COLUMN IF NOT EXISTS scroll_zoom_image_url TEXT DEFAULT '/images/IMG-20251021-WA0010.jpg';

UPDATE home_hero_settings 
SET scroll_zoom_image_url = '/images/IMG-20251021-WA0010.jpg'
WHERE scroll_zoom_image_url IS NULL;

-- 2. Create home_visibility table if it doesn't exist
CREATE TABLE IF NOT EXISTS home_visibility (
  id INTEGER PRIMARY KEY DEFAULT 1,
  show_products_section BOOLEAN DEFAULT true,
  show_features_section BOOLEAN DEFAULT true,
  show_contact_section BOOLEAN DEFAULT true,
  show_showcase_section BOOLEAN DEFAULT true,
  show_models_showcase_section BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  CONSTRAINT single_row CHECK (id = 1)
);

-- 3. Create home_showcase_features table
CREATE TABLE IF NOT EXISTS home_showcase_features (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  number VARCHAR(2) NOT NULL,
  title_en TEXT NOT NULL,
  title_dari TEXT NOT NULL,
  title_pashto TEXT NOT NULL,
  subtitle_en TEXT NOT NULL,
  subtitle_dari TEXT NOT NULL,
  subtitle_pashto TEXT NOT NULL,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 4. Create home_models_showcase table
CREATE TABLE IF NOT EXISTS home_models_showcase (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  range VARCHAR(10) NOT NULL,
  charge VARCHAR(10) NOT NULL,
  speed VARCHAR(10) NOT NULL,
  bg_color VARCHAR(7) NOT NULL DEFAULT '#4A5A6A',
  image_url TEXT NOT NULL,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 5. Create home_featured_products table
CREATE TABLE IF NOT EXISTS home_featured_products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  UNIQUE(product_id)
);

-- ============================================
-- ENABLE RLS ON ALL TABLES
-- ============================================

ALTER TABLE home_visibility ENABLE ROW LEVEL SECURITY;
ALTER TABLE home_showcase_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE home_models_showcase ENABLE ROW LEVEL SECURITY;
ALTER TABLE home_featured_products ENABLE ROW LEVEL SECURITY;

-- ============================================
-- DROP EXISTING POLICIES
-- ============================================

-- home_visibility policies
DROP POLICY IF EXISTS "Allow public read access to visibility settings" ON home_visibility;
DROP POLICY IF EXISTS "Allow authenticated users to update visibility settings" ON home_visibility;

-- home_showcase_features policies
DROP POLICY IF EXISTS "Allow public read access to showcase features" ON home_showcase_features;
DROP POLICY IF EXISTS "Allow authenticated users to insert showcase features" ON home_showcase_features;
DROP POLICY IF EXISTS "Allow authenticated users to update showcase features" ON home_showcase_features;
DROP POLICY IF EXISTS "Allow authenticated users to delete showcase features" ON home_showcase_features;

-- home_models_showcase policies
DROP POLICY IF EXISTS "Allow public read access to models showcase" ON home_models_showcase;
DROP POLICY IF EXISTS "Allow authenticated users to insert models showcase" ON home_models_showcase;
DROP POLICY IF EXISTS "Allow authenticated users to update models showcase" ON home_models_showcase;
DROP POLICY IF EXISTS "Allow authenticated users to delete models showcase" ON home_models_showcase;
DROP POLICY IF EXISTS "Allow all operations for authenticated users on models showcase" ON home_models_showcase;
DROP POLICY IF EXISTS "Allow all operations for anon users on models showcase" ON home_models_showcase;

-- home_featured_products policies
DROP POLICY IF EXISTS "Allow public read access to featured products" ON home_featured_products;
DROP POLICY IF EXISTS "Allow all operations for authenticated users on featured products" ON home_featured_products;
DROP POLICY IF EXISTS "Allow all operations for anon users on featured products" ON home_featured_products;

-- ============================================
-- CREATE NEW POLICIES (PERMISSIVE)
-- ============================================

-- home_visibility policies
CREATE POLICY "Allow public read access to visibility settings"
  ON home_visibility FOR SELECT
  USING (true);

CREATE POLICY "Allow all operations for all users on visibility settings"
  ON home_visibility FOR ALL
  USING (true)
  WITH CHECK (true);

-- home_showcase_features policies
CREATE POLICY "Allow public read access to showcase features"
  ON home_showcase_features FOR SELECT
  USING (true);

CREATE POLICY "Allow all operations for all users on showcase features"
  ON home_showcase_features FOR ALL
  USING (true)
  WITH CHECK (true);

-- home_models_showcase policies
CREATE POLICY "Allow public read access to models showcase"
  ON home_models_showcase FOR SELECT
  USING (true);

CREATE POLICY "Allow all operations for all users on models showcase"
  ON home_models_showcase FOR ALL
  USING (true)
  WITH CHECK (true);

-- home_featured_products policies
CREATE POLICY "Allow public read access to featured products"
  ON home_featured_products FOR SELECT
  USING (true);

CREATE POLICY "Allow all operations for all users on featured products"
  ON home_featured_products FOR ALL
  USING (true)
  WITH CHECK (true);

-- ============================================
-- INSERT DEFAULT DATA
-- ============================================

-- Insert default visibility settings
INSERT INTO home_visibility (id, show_products_section, show_features_section, show_contact_section, show_showcase_section, show_models_showcase_section)
VALUES (1, true, true, true, true, true)
ON CONFLICT (id) DO UPDATE SET
  show_models_showcase_section = COALESCE(home_visibility.show_models_showcase_section, true),
  show_showcase_section = COALESCE(home_visibility.show_showcase_section, true);

-- Insert default model showcases (if not exists)
INSERT INTO home_models_showcase (name, range, charge, speed, bg_color, image_url, order_index)
VALUES
  ('SR/S', '171', '1.1', '124', '#4A5A6A', '/images/bike-blue-silver.png', 0),
  ('SR/F', '176', '1.1', '124', '#9B9B8E', '/images/bike-blue-sport.png', 1),
  ('S', '154', '1.3', '104', '#5DABA8', '/images/bike-white-sport.png', 2),
  ('DSR/X', '180', '1.5', '112', '#2D3E50', '/images/bike-white-rounded.png', 3)
ON CONFLICT DO NOTHING;

-- Insert default showcase features (if not exists)
INSERT INTO home_showcase_features (number, title_en, title_dari, title_pashto, subtitle_en, subtitle_dari, subtitle_pashto, order_index)
VALUES
  ('01', 'RAPID CHARGING', 'شارژ سریع', 'چټک چارج', 'Full charge in as fast as 1hr.', 'شارژ کامل در 1 ساعت', 'په 1 ساعت کې بشپړ چارج', 0),
  ('02', 'LOW-TO-NO MAINTENANCE', 'نگهداری کم تا صفر', 'کم څخه هیڅ ساتنه', 'Fluidity without the fluids.', 'روانی بدون مایعات', 'د مایعاتو پرته روانتیا', 1),
  ('03', '223MI PEAK RANGE', '223MI برد اوج', '223MI لوړ واټن', 'SR/F city range with Power Tank.', 'برد شهری SR/F با تانک قدرت', 'د پاور ټانک سره SR/F ښار واټن', 2),
  ('04', '124MPH TOP SPEED', '124MPH سرعت بالا', '124MPH لوړ سرعت', 'No clutch. No gears. Just go.', 'بدون کلاچ. بدون دنده. فقط برو.', 'هیڅ کلچ نشته. هیڅ ګیر نشته. یوازې حرکت.', 3),
  ('05', 'CYPHER III+', 'CYPHER III+', 'CYPHER III+', 'Advanced motorcycle performance customization.', 'سفارشی‌سازی عملکرد موتورسیکلت پیشرفته', 'د پرمختللي موټرسایکل فعالیت شخصي کول', 4),
  ('06', 'INSTANT TORQUE', 'گشتاور فوری', 'فوری ټورک', 'Up to 169 lb-ft of torque.', 'تا 169 lb-ft گشتاور', 'تر 169 lb-ft پورې ټورک', 5)
ON CONFLICT DO NOTHING;

-- ============================================
-- CREATE INDEXES
-- ============================================

CREATE INDEX IF NOT EXISTS idx_featured_products_order ON home_featured_products(order_index);
CREATE INDEX IF NOT EXISTS idx_models_showcase_order ON home_models_showcase(order_index);
CREATE INDEX IF NOT EXISTS idx_showcase_features_order ON home_showcase_features(order_index);

-- ============================================
-- DONE!
-- ============================================

SELECT 'All migrations completed successfully!' as status;
