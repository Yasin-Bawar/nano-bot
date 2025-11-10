-- Check what tables and columns currently exist

-- Check if authorized_devices table exists
SELECT 
  table_name,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_name IN ('authorized_devices', 'authorized_ips', 'admin_access_logs')
ORDER BY table_name, ordinal_position;

-- Check current data in authorized_devices (if exists)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'authorized_devices') THEN
    RAISE NOTICE '✅ authorized_devices table exists';
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'authorized_ips') THEN
    RAISE NOTICE '✅ authorized_ips table exists';
  END IF;
END $$;
