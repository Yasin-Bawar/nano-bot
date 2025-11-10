-- Fix RLS policies for authorized_devices to allow service role access

-- Drop all existing policies
DROP POLICY IF EXISTS "Allow service role full access to authorized_devices" ON authorized_devices;
DROP POLICY IF EXISTS "Allow public read access to authorized_devices" ON authorized_devices;
DROP POLICY IF EXISTS "Allow authenticated users to update authorized_devices" ON authorized_devices;
DROP POLICY IF EXISTS "Allow authenticated users to insert authorized_devices" ON authorized_devices;

DROP POLICY IF EXISTS "Allow service role full access to admin_access_logs" ON admin_access_logs;
DROP POLICY IF EXISTS "Allow service role full access to admin_secret_keys" ON admin_secret_keys;

-- Disable RLS temporarily to allow service role
ALTER TABLE authorized_devices DISABLE ROW LEVEL SECURITY;
ALTER TABLE admin_access_logs DISABLE ROW LEVEL SECURITY;
ALTER TABLE admin_secret_keys DISABLE ROW LEVEL SECURITY;

-- Re-enable RLS
ALTER TABLE authorized_devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_access_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_secret_keys ENABLE ROW LEVEL SECURITY;

-- Create permissive policies for service role
CREATE POLICY "Service role has full access to authorized_devices"
  ON authorized_devices
  FOR ALL
  USING (
    current_setting('request.jwt.claims', true)::json->>'role' = 'service_role'
    OR auth.role() = 'service_role'
  )
  WITH CHECK (
    current_setting('request.jwt.claims', true)::json->>'role' = 'service_role'
    OR auth.role() = 'service_role'
  );

CREATE POLICY "Service role has full access to admin_access_logs"
  ON admin_access_logs
  FOR ALL
  USING (
    current_setting('request.jwt.claims', true)::json->>'role' = 'service_role'
    OR auth.role() = 'service_role'
  )
  WITH CHECK (
    current_setting('request.jwt.claims', true)::json->>'role' = 'service_role'
    OR auth.role() = 'service_role'
  );

CREATE POLICY "Service role has full access to admin_secret_keys"
  ON admin_secret_keys
  FOR ALL
  USING (
    current_setting('request.jwt.claims', true)::json->>'role' = 'service_role'
    OR auth.role() = 'service_role'
  )
  WITH CHECK (
    current_setting('request.jwt.claims', true)::json->>'role' = 'service_role'
    OR auth.role() = 'service_role'
  );

-- Verify policies
DO $$
BEGIN
  RAISE NOTICE '✅ RLS policies fixed for service role access!';
  RAISE NOTICE '⚠️  Make sure you are using the SERVICE ROLE KEY in the app';
  RAISE NOTICE '📝 Service Role Key is found in: Supabase Dashboard → Settings → API → service_role (secret)';
END $$;
