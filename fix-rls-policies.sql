-- =====================================================
-- FIX RLS POLICIES - Run this in Supabase SQL Editor
-- =====================================================

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can insert customers" ON customers;
DROP POLICY IF EXISTS "Anyone can insert orders" ON orders;
DROP POLICY IF EXISTS "Anyone can insert messages" ON messages;
DROP POLICY IF EXISTS "Anyone can view orders" ON orders;
DROP POLICY IF EXISTS "Anyone can update messages" ON messages;

-- Recreate policies with correct permissions
CREATE POLICY "Anyone can insert customers" 
ON customers FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can view customers" 
ON customers FOR SELECT 
USING (true);

CREATE POLICY "Anyone can insert orders" 
ON orders FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can view orders" 
ON orders FOR SELECT 
USING (true);

CREATE POLICY "Anyone can insert messages" 
ON messages FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can view messages" 
ON messages FOR SELECT 
USING (true);

CREATE POLICY "Anyone can update messages" 
ON messages FOR UPDATE 
USING (true);

-- Verify policies were created
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename IN ('customers', 'orders', 'messages')
ORDER BY tablename, policyname;
