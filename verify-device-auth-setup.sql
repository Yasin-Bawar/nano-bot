-- Verify device authorization system is set up correctly

-- Check if tables exist
SELECT 
  'authorized_devices' as table_name,
  COUNT(*) as record_count
FROM authorized_devices
UNION ALL
SELECT 
  'admin_access_logs' as table_name,
  COUNT(*) as record_count
FROM admin_access_logs
UNION ALL
SELECT 
  'admin_secret_keys' as table_name,
  COUNT(*) as record_count
FROM admin_secret_keys;

-- Show all authorized devices
SELECT 
  device_id,
  device_name,
  is_active,
  authorized_at,
  last_access
FROM authorized_devices
ORDER BY authorized_at DESC;

-- Show recent access logs
SELECT 
  device_id,
  ip_address,
  access_granted,
  denial_reason,
  accessed_at
FROM admin_access_logs
ORDER BY accessed_at DESC
LIMIT 20;

-- Show current secret path
SELECT secret_path FROM admin_secret_keys WHERE id = 1;
