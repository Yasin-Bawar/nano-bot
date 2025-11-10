-- Add your local IP address to authorized devices
-- Replace YOUR_IP_ADDRESS with the IP shown on the admin login page

INSERT INTO authorized_devices (
  device_id,
  device_name,
  device_fingerprint,
  authorized_by,
  is_active,
  notes
) VALUES (
  'YOUR_IP_ADDRESS',  -- e.g., '192.168.1.100'
  'My Local IP',
  'YOUR_IP_ADDRESS',
  'Manual Setup',
  true,
  'Authorized local IP address'
)
ON CONFLICT (device_id) 
DO UPDATE SET 
  is_active = true,
  updated_at = NOW();

-- Verify it was added
SELECT device_id, device_name, is_active, authorized_at
FROM authorized_devices
WHERE device_id = 'YOUR_IP_ADDRESS';
