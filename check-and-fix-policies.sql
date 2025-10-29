-- =====================================================
-- CHECK AND FIX RLS POLICIES
-- Run this in Supabase SQL Editor
-- =====================================================

-- Step 1: Check existing policies
SELECT tablename, policyname, cmd 
FROM pg_policies 
WHERE tablename IN ('customers', 'orders', 'messages')
ORDER BY tablename, cmd;

-- Step 2: Drop and recreate INSERT policies only
DROP POLICY IF EXISTS "Anyone can insert customers" ON customers;
DROP POLICY IF EXISTS "Anyone can insert orders" ON orders;
DROP POLICY IF EXISTS "Anyone can insert messages" ON messages;

-- Step 3: Create INSERT policies
CREATE POLICY "Anyone can insert customers" 
ON customers FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can insert orders" 
ON orders FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can insert messages" 
ON messages FOR INSERT 
WITH CHECK (true);

-- Step 4: Verify INSERT policies exist
SELECT tablename, policyname, cmd 
FROM pg_policies 
WHERE tablename IN ('customers', 'orders', 'messages')
AND cmd = 'INSERT'
ORDER BY tablename;

-- You should see 3 INSERT policies (one for each table)
