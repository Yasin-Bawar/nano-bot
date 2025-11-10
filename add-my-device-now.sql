-- Simple script to add your device to authorized list
-- Just replace YOUR_DEVICE_ID with the actual ID from the admin login page

-- First, check if the device already exists
DO $$
DECLARE
  device_exists BOOLEAN;
BEGIN
  SELECT EXISTS(
    SELECT 1 FROM authorized_devices 
    WHERE device_id = 'YOUR_DEVICE_ID'
  ) INTO device_exists;
  
  IF device_exists THEN
    -- Update existing device to make it active
    UPDATE authorized_devices 
    SET is_active = true,
        device_name = 'My Browser',
        notes = 'Re-authorized device',
        updated_at = NOW()
    WHERE device_id = 'YOUR_DEVICE_ID';
    
    RAISE NOTICE '✅ Device updated and activated!';
  ELSE
    -- Insert new device
    INSERT INTO authorized_devices (
      device_id,
      device_name,
      device_fingerprint,
      authorized_by,
      is_active,
      notes
    ) VALUES (
      'YOUR_DEVICE_ID',
      'My Browser',
      'YOUR_DEVICE_ID',
      'Manual Setup',
      true,
      'Authorized from browser'
    );
    
    RAISE NOTICE '✅ New device added successfully!';
  END IF;
END $$;

-- Verify the device was added
SELECT 
  device_id,
  device_name,
  is_active,
  authorized_at,
  notes
FROM authorized_devices
WHERE device_id = 'YOUR_DEVICE_ID';
