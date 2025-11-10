-- Quick Add Device to Authorized List
-- Replace YOUR_DEVICE_ID with the actual device ID from the admin login page

INSERT INTO authorized_devices (
  device_id,
  device_name,
  device_fingerprint,
  authorized_by,
  is_active,
  notes
) VALUES (
  'YOUR_DEVICE_ID',  -- Replace this with your actual device ID
  'My Computer',
  'YOUR_DEVICE_ID',  -- Replace this with your actual device ID
  'Manual Setup',
  true,
  'Authorized device for admin access'
);

-- Example:
-- If your device ID is: 7b34e6d69bd6df5f1234567890abcdef
-- Then replace YOUR_DEVICE_ID with: 7b34e6d69bd6df5f1234567890abcdef
