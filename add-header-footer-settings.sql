-- Create header_settings table
CREATE TABLE IF NOT EXISTS header_settings (
  id INTEGER PRIMARY KEY DEFAULT 1,
  logo_url TEXT,
  logo_dark_url TEXT,
  site_name_dari TEXT,
  site_name_pashto TEXT,
  tagline_dari TEXT,
  tagline_pashto TEXT,
  show_language_selector BOOLEAN DEFAULT true,
  show_search BOOLEAN DEFAULT true,
  sticky_header BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create footer_settings table
CREATE TABLE IF NOT EXISTS footer_settings (
  id INTEGER PRIMARY KEY DEFAULT 1,
  company_name_dari TEXT,
  company_name_pashto TEXT,
  description_dari TEXT,
  description_pashto TEXT,
  logo_url TEXT,
  address_dari TEXT,
  address_pashto TEXT,
  phone TEXT,
  email TEXT,
  facebook_url TEXT,
  instagram_url TEXT,
  twitter_url TEXT,
  youtube_url TEXT,
  whatsapp_number TEXT,
  copyright_text_dari TEXT,
  copyright_text_pashto TEXT,
  show_social_links BOOLEAN DEFAULT true,
  show_newsletter BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default header settings (only if table is empty)
INSERT INTO header_settings (
  id,
  logo_url,
  logo_dark_url,
  site_name_dari,
  site_name_pashto,
  tagline_dari,
  tagline_pashto,
  show_language_selector,
  show_search,
  sticky_header
) 
SELECT 
  1,
  '/images/logo.png',
  '',
  'موتورسیکلت‌های برقی',
  'بریښنایی موټرسایکلونه',
  'آینده سواری الکتریکی',
  'د بریښنایی سواری راتلونکی',
  true,
  true,
  true
WHERE NOT EXISTS (SELECT 1 FROM header_settings WHERE id = 1);

-- Insert default footer settings (only if table is empty)
INSERT INTO footer_settings (
  id,
  company_name_dari,
  company_name_pashto,
  description_dari,
  description_pashto,
  logo_url,
  address_dari,
  address_pashto,
  phone,
  email,
  facebook_url,
  instagram_url,
  twitter_url,
  youtube_url,
  whatsapp_number,
  copyright_text_dari,
  copyright_text_pashto,
  show_social_links,
  show_newsletter
) 
SELECT
  1,
  'موتورسیکلت‌های برقی افغانستان',
  'د افغانستان بریښنایی موټرسایکلونه',
  'ما بهترین موتورسیکلت‌های برقی را برای مردم افغانستان فراهم می‌کنیم',
  'موږ د افغانستان خلکو لپاره غوره بریښنایی موټرسایکلونه چمتو کوو',
  '/images/logo.png',
  'شهر هرات، افغانستان',
  'د هرات ښار، افغانستان',
  '+93 799 123 456',
  'info@electricbikes.af',
  '',
  '',
  '',
  '',
  '',
  '© 2024 تمامی حقوق محفوظ است',
  '© 2024 ټول حقونه خوندي دي',
  true,
  true
WHERE NOT EXISTS (SELECT 1 FROM footer_settings WHERE id = 1);

-- Enable RLS
ALTER TABLE header_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE footer_settings ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow public read access to header_settings" ON header_settings;
DROP POLICY IF EXISTS "Allow authenticated users to update header_settings" ON header_settings;
DROP POLICY IF EXISTS "Allow authenticated users to insert header_settings" ON header_settings;
DROP POLICY IF EXISTS "Allow public read access to footer_settings" ON footer_settings;
DROP POLICY IF EXISTS "Allow authenticated users to update footer_settings" ON footer_settings;
DROP POLICY IF EXISTS "Allow authenticated users to insert footer_settings" ON footer_settings;

-- Create policies for header_settings
CREATE POLICY "Allow public read access to header_settings"
  ON header_settings FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow authenticated users to update header_settings"
  ON header_settings FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to insert header_settings"
  ON header_settings FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Create policies for footer_settings
CREATE POLICY "Allow public read access to footer_settings"
  ON footer_settings FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow authenticated users to update footer_settings"
  ON footer_settings FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to insert footer_settings"
  ON footer_settings FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Create updated_at trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for updated_at
DROP TRIGGER IF EXISTS update_header_settings_updated_at ON header_settings;
CREATE TRIGGER update_header_settings_updated_at
  BEFORE UPDATE ON header_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_footer_settings_updated_at ON footer_settings;
CREATE TRIGGER update_footer_settings_updated_at
  BEFORE UPDATE ON footer_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Grant permissions
GRANT SELECT ON header_settings TO anon, authenticated;
GRANT INSERT, UPDATE ON header_settings TO authenticated;

GRANT SELECT ON footer_settings TO anon, authenticated;
GRANT INSERT, UPDATE ON footer_settings TO authenticated;

-- Verify tables were created
DO $$
BEGIN
  RAISE NOTICE '✅ Header and Footer settings tables created successfully!';
  RAISE NOTICE '📋 Run this query to verify: SELECT * FROM header_settings;';
  RAISE NOTICE '📋 Run this query to verify: SELECT * FROM footer_settings;';
END $$;
