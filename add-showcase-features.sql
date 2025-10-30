-- Create home_visibility table if it doesn't exist
CREATE TABLE IF NOT EXISTS home_visibility (
  id INTEGER PRIMARY KEY DEFAULT 1,
  show_products_section BOOLEAN DEFAULT true,
  show_features_section BOOLEAN DEFAULT true,
  show_contact_section BOOLEAN DEFAULT true,
  show_showcase_section BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  CONSTRAINT single_row CHECK (id = 1)
);

-- Add showcase features table for rotating showcase section
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

-- If home_visibility table already exists but doesn't have show_showcase_section column
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'home_visibility' 
    AND column_name = 'show_showcase_section'
  ) THEN
    ALTER TABLE home_visibility ADD COLUMN show_showcase_section BOOLEAN DEFAULT true;
  END IF;
END $$;

-- Enable RLS on both tables
ALTER TABLE home_visibility ENABLE ROW LEVEL SECURITY;
ALTER TABLE home_showcase_features ENABLE ROW LEVEL SECURITY;

-- Create policies for home_visibility
DROP POLICY IF EXISTS "Allow public read access to visibility settings" ON home_visibility;
CREATE POLICY "Allow public read access to visibility settings"
  ON home_visibility FOR SELECT
  TO public
  USING (true);

DROP POLICY IF EXISTS "Allow authenticated users to update visibility settings" ON home_visibility;
CREATE POLICY "Allow authenticated users to update visibility settings"
  ON home_visibility FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create policies for home_showcase_features
DROP POLICY IF EXISTS "Allow public read access to showcase features" ON home_showcase_features;
CREATE POLICY "Allow public read access to showcase features"
  ON home_showcase_features FOR SELECT
  TO public
  USING (true);

DROP POLICY IF EXISTS "Allow authenticated users to insert showcase features" ON home_showcase_features;
CREATE POLICY "Allow authenticated users to insert showcase features"
  ON home_showcase_features FOR INSERT
  TO authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "Allow authenticated users to update showcase features" ON home_showcase_features;
CREATE POLICY "Allow authenticated users to update showcase features"
  ON home_showcase_features FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Allow authenticated users to delete showcase features" ON home_showcase_features;
CREATE POLICY "Allow authenticated users to delete showcase features"
  ON home_showcase_features FOR DELETE
  TO authenticated
  USING (true);

-- Insert default showcase features
INSERT INTO home_showcase_features (number, title_en, title_dari, title_pashto, subtitle_en, subtitle_dari, subtitle_pashto, order_index)
VALUES
  ('01', 'RAPID CHARGING', 'شارژ سریع', 'چټک چارج', 'Full charge in as fast as 1hr.', 'شارژ کامل در 1 ساعت', 'په 1 ساعت کې بشپړ چارج', 0),
  ('02', 'LOW-TO-NO MAINTENANCE', 'نگهداری کم تا صفر', 'کم څخه هیڅ ساتنه', 'Fluidity without the fluids.', 'روانی بدون مایعات', 'د مایعاتو پرته روانتیا', 1),
  ('03', '223MI PEAK RANGE', '223MI برد اوج', '223MI لوړ واټن', 'SR/F city range with Power Tank.', 'برد شهری SR/F با تانک قدرت', 'د پاور ټانک سره SR/F ښار واټن', 2),
  ('04', '124MPH TOP SPEED', '124MPH سرعت بالا', '124MPH لوړ سرعت', 'No clutch. No gears. Just go.', 'بدون کلاچ. بدون دنده. فقط برو.', 'هیڅ کلچ نشته. هیڅ ګیر نشته. یوازې حرکت.', 3),
  ('05', 'CYPHER III+', 'CYPHER III+', 'CYPHER III+', 'Advanced motorcycle performance customization.', 'سفارشی‌سازی عملکرد موتورسیکلت پیشرفته', 'د پرمختللي موټرسایکل فعالیت شخصي کول', 4),
  ('06', 'INSTANT TORQUE', 'گشتاور فوری', 'فوری ټورک', 'Up to 169 lb-ft of torque.', 'تا 169 lb-ft گشتاور', 'تر 169 lb-ft پورې ټورک', 5)
ON CONFLICT DO NOTHING;

-- Insert or update visibility record
INSERT INTO home_visibility (id, show_products_section, show_features_section, show_contact_section, show_showcase_section)
VALUES (1, true, true, true, true)
ON CONFLICT (id) 
DO UPDATE SET 
  show_showcase_section = true,
  updated_at = TIMEZONE('utc', NOW());
