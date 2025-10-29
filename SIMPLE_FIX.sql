-- =====================================================
-- SIMPLE FIX - Just run these 3 lines
-- =====================================================

-- Create INSERT policies (ignore if they already exist)
CREATE POLICY IF NOT EXISTS "Anyone can insert customers" ON customers FOR INSERT WITH CHECK (true);
CREATE POLICY IF NOT EXISTS "Anyone can insert orders" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY IF NOT EXISTS "Anyone can insert messages" ON messages FOR INSERT WITH CHECK (true);

-- Done! Now try checkout again.
