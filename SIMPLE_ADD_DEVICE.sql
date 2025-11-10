-- SIMPLE: Just add your device to the authorized list
-- This works whether you have authorized_devices or authorized_ips table

-- Step 1: Check which table exists and add device
DO $$
DECLARE
  has_authorized_devices BOOLEAN;
  has_authorized_ips BOOLEAN;
  your_device_id TEXT := 'YOUR_DEVICE_ID_HERE'; -- REPLACE THIS!
BEGIN
  -- Check which table exists
  SELECT EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_name = 'authorized_devices'
  ) INTO has_authorized_devices;
  
  SELECT EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_name = 'authorized_ips'
  ) INTO has_authorized_ips;
  
  -- Add to authorized_devices if it exists
  IF has_authorized_devices THEN
    INSERT INTO authorized_devices (
      device_id,
      device_name,
      device_fingerprint,
      authorized_by,
      is_active,
      notes
    ) VALUES (
      your_device_id,
      'My Browser',
      your_device_id,
      'Manual Setup',
      true,
      'Authorized device'
    )
    ON CONFLICT (device_id) 
    DO UPDATE SET 
      is_active = true,
      updated_at = NOW();
    
    RAISE NOTICE '✅ Device added to authorized_devices table!';
  END IF;
  
  -- Add to authorized_ips if it exists
  IF has_authorized_ips THEN
    INSERT INTO authorized_ips (
      ip_address,
      name,
      device_info,
      authorized_by,
      is_active,
      notes
    ) VALUES (
      your_device_id,
      'My Browser',
      your_device_id,
      'Manual Setup',
      true,
      'Authorized device'
    )
    ON CONFLICT (ip_address) 
    DO UPDATE SET 
      is_active = true,
      updated_at = NOW();
    
    RAISE NOTICE '✅ Device added to authorized_ips table!';
  END IF;
  
  IF NOT has_authorized_devices AND NOT has_authorized_ips THEN
    RAISE EXCEPTION '❌ No authorization table found! Run secure-admin-device-whitelist.sql first';
  END IF;
END $$;

-- Verify it was added
SELECT 'authorized_devices' as table_name, device_id as id, device_name as name, is_active, authorized_at
FROM authorized_devices
WHERE device_id = 'YOUR_DEVICE_ID_HERE'
UNION ALL
SELECT 'authorized_ips' as table_name, ip_address as id, name, is_active, authorized_at
FROM authorized_ips
WHERE ip_address = 'YOUR_DEVICE_ID_HERE';
