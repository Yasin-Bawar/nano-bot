-- Debug IP Authorization Issue

-- Check if the IP exists in the database
SELECT 
  id,
  device_id,
  device_name,
  is_active,
  authorized_at,
  last_access,
  notes
FROM authorized_devices
WHERE device_id = '116.204.242.58';

-- Check all authorized devices
SELECT 
  device_id,
  device_name,
  is_active,
  authorized_at
FROM authorized_devices
ORDER BY authorized_at DESC;

-- Check recent access logs
SELECT 
  device_id,
  ip_address,
  access_granted,
  denial_reason,
  accessed_at
FROM admin_access_logs
ORDER BY accessed_at DESC
LIMIT 10;

-- Check RLS policies on authorized_devices
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'authorized_devices';

-- Verify the service role can access the table
SELECT COUNT(*) as total_devices FROM authorized_devices;
