-- =====================================================
-- HOME PAGE SETTINGS - COMPLETE SQL SCHEMA
-- Copy and paste this entire file into Supabase SQL Editor
-- =====================================================

-- =====================================================
-- STEP 1: CREATE TABLES
-- =====================================================

-- Table: home_hero_settings
CREATE TABLE IF NOT EXISTS home_hero_settings (
  id INTEGER PRIMARY KEY DEFAULT 1,
  tagline_dari TEXT NOT NULL DEFAULT 'آینده سواری الکتریکی',
  tagline_pashto TEXT NOT NULL DEFAULT 'د بریښنایی سواری راتلونکی',
  subtitle_dari TEXT NOT NULL DEFAULT 'طراحی شده برای افغانستان - پاک، خاموش، قدرتمند',
  subtitle_pashto TEXT NOT NULL DEFAULT 'د افغانستان لپاره ډیزاین شوی - پاک، خاموش، ځواکمن',
  image_url TEXT NOT NULL DEFAULT '/images/hero.jpg',
  range_value TEXT NOT NULL DEFAULT '220',
  speed_value TEXT NOT NULL DEFAULT '180',
  charge_value TEXT NOT NULL DEFAULT '1.5',
  colors TEXT[] NOT NULL DEFAULT ARRAY['#000000', '#DC2626', '#2563EB', '#FFFFFF', '#9CA3AF', '#1F2937'],
  cta_text_dari TEXT NOT NULL DEFAULT 'مشاهده مدل‌ها',
  cta_text_pashto TEXT NOT NULL DEFAULT 'ماډلونه وګورئ',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  CONSTRAINT single_hero_row CHECK (id = 1)
);

-- Table: home_features
CREATE TABLE IF NOT EXISTS home_features (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title_dari TEXT NOT NULL,
  title_pashto TEXT NOT NULL,
  title_en TEXT NOT NULL,
  description_dari TEXT NOT NULL,
  description_pashto TEXT NOT NULL,
  stat TEXT NOT NULL,
  icon TEXT NOT NULL DEFAULT 'Battery',
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Table: home_section_settings
CREATE TABLE IF NOT EXISTS home_section_settings (
  id INTEGER PRIMARY KEY DEFAULT 1,
  products_title_dari TEXT NOT NULL DEFAULT 'محصولات ما',
  products_title_pashto TEXT NOT NULL DEFAULT 'زموږ محصولات',
  products_subtitle_dari TEXT NOT NULL DEFAULT 'موتورسیکلت‌های برقی و قطعات',
  products_subtitle_pashto TEXT NOT NULL DEFAULT 'بریښنایی موټرسایکلونه او برخې',
  show_products_section BOOLEAN NOT NULL DEFAULT TRUE,
  show_features_section BOOLEAN NOT NULL DEFAULT TRUE,
  show_contact_section BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  CONSTRAINT single_section_row CHECK (id = 1)
);

-- Table: home_settings_audit_log
CREATE TABLE IF NOT EXISTS home_settings_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  table_name TEXT NOT NULL,
  action TEXT NOT NULL,
  old_data JSONB,
  new_data JSONB,
  changed_by UUID REFERENCES admin_users(id),
  changed_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- =====================================================
-- STEP 2: CREATE INDEXES
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_home_features_order ON home_features(order_index);
CREATE INDEX IF NOT EXISTS idx_home_features_created ON home_features(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_home_audit_log_changed_at ON home_settings_audit_log(changed_at DESC);
CREATE INDEX IF NOT EXISTS idx_home_audit_log_table ON home_settings_audit_log(table_name);

-- =====================================================
-- STEP 3: ENABLE ROW LEVEL SECURITY
-- =====================================================

ALTER TABLE home_hero_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE home_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE home_section_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE home_settings_audit_log ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- STEP 4: CREATE RLS POLICIES - PUBLIC READ ACCESS
-- =====================================================

CREATE POLICY "Public can view hero settings"
  ON home_hero_settings FOR SELECT
  USING (true);

CREATE POLICY "Public can view features"
  ON home_features FOR SELECT
  USING (true);

CREATE POLICY "Public can view section settings"
  ON home_section_settings FOR SELECT
  USING (true);

-- =====================================================
-- STEP 5: CREATE RLS POLICIES - ADMIN WRITE ACCESS
-- =====================================================

CREATE POLICY "Admins can update hero settings"
  ON home_hero_settings FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
      AND admin_users.is_active = true
    )
  );

CREATE POLICY "Admins can manage features"
  ON home_features FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
      AND admin_users.is_active = true
    )
  );

CREATE POLICY "Admins can update section settings"
  ON home_section_settings FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
      AND admin_users.is_active = true
    )
  );

CREATE POLICY "Admins can view audit log"
  ON home_settings_audit_log FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
      AND admin_users.is_active = true
    )
  );

-- =====================================================
-- STEP 6: INSERT DEFAULT DATA
-- =====================================================

-- Insert default hero settings
INSERT INTO home_hero_settings (
  id,
  tagline_dari,
  tagline_pashto,
  subtitle_dari,
  subtitle_pashto,
  image_url,
  range_value,
  speed_value,
  charge_value,
  colors,
  cta_text_dari,
  cta_text_pashto
) VALUES (
  1,
  'آینده سواری الکتریکی',
  'د بریښنایی سواری راتلونکی',
  'طراحی شده برای افغانستان - پاک، خاموش، قدرتمند',
  'د افغانستان لپاره ډیزاین شوی - پاک، خاموش، ځواکمن',
  '/images/hero.jpg',
  '220',
  '180',
  '1.5',
  ARRAY['#000000', '#DC2626', '#2563EB', '#FFFFFF', '#9CA3AF', '#1F2937'],
  'مشاهده مدل‌ها',
  'ماډلونه وګورئ'
) ON CONFLICT (id) DO NOTHING;

-- Insert default features
INSERT INTO home_features (
  title_dari,
  title_pashto,
  title_en,
  description_dari,
  description_pashto,
  stat,
  icon,
  order_index
) VALUES
  (
    'برد طولانی',
    'اوږد واټن',
    'LONG RANGE',
    'تا 220 کیلومتر با یک شارژ',
    'تر 220 کیلومتره پورې د یو چارج سره',
    '220km',
    'Battery',
    0
  ),
  (
    'شارژ سریع',
    'چټک چارج',
    'FAST CHARGING',
    'شارژ کامل در 1 ساعت',
    'په 1 ساعت کې بشپړ چارج',
    '1hr',
    'Zap',
    1
  ),
  (
    'سرعت بالا',
    'لوړ سرعت',
    'HIGH SPEED',
    'تا 180 کیلومتر در ساعت',
    'تر 180 کیلومتره/ساعت پورې',
    '180km/h',
    'Gauge',
    2
  ),
  (
    'ایمنی',
    'خوندیتوب',
    'SAFETY',
    'ABS پیشرفته و کنترل کشش',
    'پرمختللي ABS او ټریکشن کنټرول',
    'ABS',
    'Shield',
    3
  ),
  (
    'فناوری هوشمند',
    'سمارټ',
    'SMART TECH',
    'متصل به اپلیکیشن موبایل',
    'د موبایل اپلیکیشن سره وصل',
    'IoT',
    'Wifi',
    4
  ),
  (
    'سازگار با محیط زیست',
    'پاک',
    'ECO FRIENDLY',
    'صفر انتشار، محیط زیست پاک',
    'صفر اخراج، پاک چاپیریال',
    '0%',
    'Leaf',
    5
  )
ON CONFLICT DO NOTHING;

-- Insert default section settings
INSERT INTO home_section_settings (
  id,
  products_title_dari,
  products_title_pashto,
  products_subtitle_dari,
  products_subtitle_pashto,
  show_products_section,
  show_features_section,
  show_contact_section
) VALUES (
  1,
  'محصولات ما',
  'زموږ محصولات',
  'موتورسیکلت‌های برقی و قطعات',
  'بریښنایی موټرسایکلونه او برخې',
  true,
  true,
  true
) ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- STEP 7: CREATE FUNCTIONS AND TRIGGERS
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_home_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc', NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_home_hero_settings_updated_at
  BEFORE UPDATE ON home_hero_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_home_settings_updated_at();

CREATE TRIGGER update_home_features_updated_at
  BEFORE UPDATE ON home_features
  FOR EACH ROW
  EXECUTE FUNCTION update_home_settings_updated_at();

CREATE TRIGGER update_home_section_settings_updated_at
  BEFORE UPDATE ON home_section_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_home_settings_updated_at();

-- =====================================================
-- STEP 8: CREATE STORAGE BUCKET
-- =====================================================

-- Create storage bucket for home page images
INSERT INTO storage.buckets (id, name, public)
VALUES ('home-images', 'home-images', true)
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- STEP 9: CREATE STORAGE POLICIES
-- =====================================================

-- Public can view home images
CREATE POLICY "Public can view home images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'home-images');

-- Admins can upload home images
CREATE POLICY "Admins can upload home images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'home-images'
    AND EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
      AND admin_users.is_active = true
    )
  );

-- Admins can update home images
CREATE POLICY "Admins can update home images"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'home-images'
    AND EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
      AND admin_users.is_active = true
    )
  );

-- Admins can delete home images
CREATE POLICY "Admins can delete home images"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'home-images'
    AND EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
      AND admin_users.is_active = true
    )
  );

-- =====================================================
-- STEP 10: CREATE HELPER VIEW
-- =====================================================

-- View for complete home page configuration
CREATE OR REPLACE VIEW home_page_config AS
SELECT
  (SELECT row_to_json(h.*) FROM home_hero_settings h WHERE h.id = 1) as hero_settings,
  (SELECT json_agg(f.* ORDER BY f.order_index) FROM home_features f) as features,
  (SELECT row_to_json(s.*) FROM home_section_settings s WHERE s.id = 1) as section_settings;

-- Grant access to the view
GRANT SELECT ON home_page_config TO anon, authenticated;

-- =====================================================
-- COMPLETION MESSAGE
-- =====================================================

DO $$
BEGIN
  RAISE NOTICE '✅ Home Page Settings Schema Created Successfully!';
  RAISE NOTICE '📋 Tables created:';
  RAISE NOTICE '   - home_hero_settings';
  RAISE NOTICE '   - home_features';
  RAISE NOTICE '   - home_section_settings';
  RAISE NOTICE '   - home_settings_audit_log';
  RAISE NOTICE '🔒 RLS policies configured';
  RAISE NOTICE '📦 Storage bucket "home-images" configured';
  RAISE NOTICE '✨ Default data inserted';
  RAISE NOTICE '';
  RAISE NOTICE '🚀 You can now use the Home Settings page in your admin panel!';
  RAISE NOTICE '📍 Navigate to: /admin/home-settings';
END $$;

-- =====================================================
-- END OF SCHEMA
-- =====================================================
