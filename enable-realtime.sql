-- ============================================
-- ENABLE REAL-TIME FOR MESSAGES TABLE
-- Run this in Supabase SQL Editor
-- ============================================

-- Step 1: Enable real-time replication for messages table
ALTER PUBLICATION supabase_realtime ADD TABLE messages;

-- Step 2: Create RLS policy to allow real-time subscriptions
-- (Real-time needs SELECT permission)
DROP POLICY IF EXISTS "Enable realtime for messages" ON messages;

CREATE POLICY "Enable realtime for messages"
ON messages FOR SELECT
TO anon, authenticated
USING (true);

-- Step 3: Verify real-time is enabled
SELECT 
  schemaname,
  tablename,
  'Real-time ENABLED ✅' as status
FROM pg_publication_tables 
WHERE tablename = 'messages'
  AND pubname = 'supabase_realtime';

-- Step 4: Check RLS policies
SELECT 
  policyname,
  cmd,
  roles,
  'Policy EXISTS ✅' as status
FROM pg_policies 
WHERE tablename = 'messages';

-- ============================================
-- EXPECTED RESULTS:
-- ============================================
-- Query 1 (Verify): Should return 1 row showing messages table
-- Query 2 (Policies): Should show the "Enable realtime" policy
--
-- If Query 1 returns NO rows, real-time is NOT enabled
-- If Query 2 returns NO rows, RLS is blocking real-time
-- ============================================

-- ============================================
-- TROUBLESHOOTING
-- ============================================

-- If real-time was already enabled, you might see an error.
-- That's OK! Just run the verification queries:

-- Check if messages table is in the publication:
SELECT * FROM pg_publication_tables 
WHERE pubname = 'supabase_realtime';

-- Check all RLS policies on messages:
SELECT * FROM pg_policies 
WHERE tablename = 'messages';

-- ============================================
-- AFTER RUNNING THIS:
-- ============================================
-- 1. Refresh your browser (Ctrl+Shift+R)
-- 2. Open browser console (F12)
-- 3. Go to messaging page
-- 4. Look for: "✅ Successfully subscribed to real-time messages"
-- ============================================
