-- =====================================================
-- FIX RLS POLICIES FOR HOME SETTINGS TABLES
-- Run this if you get "Error updating home settings"
-- =====================================================

-- Drop existing policies
DROP POLICY IF EXISTS "Public can view hero settings" ON home_hero_settings;
DROP POLICY IF EXISTS "Admins can update hero settings" ON home_hero_settings;
DROP POLICY IF EXISTS "Anyone can manage hero settings" ON home_hero_settings;

DROP POLICY IF EXISTS "Public can view features" ON home_features;
DROP POLICY IF EXISTS "Admins can manage features" ON home_features;
DROP POLICY IF EXISTS "Anyone can manage features" ON home_features;

DROP POLICY IF EXISTS "Public can view section settings" ON home_section_settings;
DROP POLICY IF EXISTS "Admins can update section settings" ON home_section_settings;
DROP POLICY IF EXISTS "Anyone can manage section settings" ON home_section_settings;

-- Create simple policies that allow all operations (for development)
-- Hero Settings
CREATE POLICY "Anyone can view hero settings"
  ON home_hero_settings FOR SELECT
  USING (true);

CREATE POLICY "Anyone can manage hero settings"
  ON home_hero_settings FOR ALL
  USING (true)
  WITH CHECK (true);

-- Features
CREATE POLICY "Anyone can view features"
  ON home_features FOR SELECT
  USING (true);

CREATE POLICY "Anyone can manage features"
  ON home_features FOR ALL
  USING (true)
  WITH CHECK (true);

-- Section Settings
CREATE POLICY "Anyone can view section settings"
  ON home_section_settings FOR SELECT
  USING (true);

CREATE POLICY "Anyone can manage section settings"
  ON home_section_settings FOR ALL
  USING (true)
  WITH CHECK (true);

-- Success message
DO $$
BEGIN
  RAISE NOTICE '✅ RLS policies fixed!';
  RAISE NOTICE '🔓 All home settings tables now allow read/write';
  RAISE NOTICE '';
  RAISE NOTICE '⚠️ SECURITY NOTE: These are permissive policies for development.';
  RAISE NOTICE 'For production, restrict to authenticated admins only.';
END $$;
