-- ============================================
-- CHECK REAL-TIME STATUS
-- Real-time is ALREADY ENABLED!
-- Now let's check what's blocking it
-- ============================================

-- Query 1: Verify messages table is in real-time publication
SELECT 
  schemaname,
  tablename,
  '✅ Real-time IS enabled' as status
FROM pg_publication_tables 
WHERE tablename = 'messages'
  AND pubname = 'supabase_realtime';

-- Query 2: Check ALL RLS policies on messages table
SELECT 
  policyname,
  cmd as command,
  qual as using_expression,
  with_check,
  roles
FROM pg_policies 
WHERE tablename = 'messages'
ORDER BY policyname;

-- Query 3: Check if anon role can SELECT messages
SELECT 
  grantee,
  privilege_type,
  '✅ Permission granted' as status
FROM information_schema.role_table_grants
WHERE table_name = 'messages'
  AND privilege_type = 'SELECT';

-- ============================================
-- WHAT TO LOOK FOR:
-- ============================================
-- Query 1: Should return 1 row (real-time enabled)
-- Query 2: Should show policies - look for SELECT policies
-- Query 3: Should show SELECT permission for anon/authenticated
-- ============================================
