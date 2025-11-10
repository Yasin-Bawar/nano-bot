-- Migrate from device fingerprint to IP-based authentication
-- This makes authorization simpler and more reliable

-- Rename the table to reflect IP-based auth
ALTER TABLE authorized_devices RENAME TO authorized_ips;

-- Rename device_id column to ip_address (keep as primary identifier)
ALTER TABLE authorized_ips RENAME COLUMN device_id TO ip_address;

-- Rename device_name to a more generic name
ALTER TABLE authorized_ips RENAME COLUMN device_name TO name;

-- Keep device_fingerprint for logging purposes but make it optional
ALTER TABLE authorized_ips ALTER COLUMN device_fingerprint DROP NOT NULL;
ALTER TABLE authorized_ips RENAME COLUMN device_fingerprint TO device_info;

-- Update the unique constraint
ALTER TABLE authorized_ips DROP CONSTRAINT IF EXISTS authorized_devices_device_id_key;
ALTER TABLE authorized_ips ADD CONSTRAINT authorized_ips_ip_address_key UNIQUE (ip_address);

-- Update admin_access_logs to match
ALTER TABLE admin_access_logs RENAME COLUMN device_id TO ip_address;
ALTER TABLE admin_access_logs ADD COLUMN IF NOT EXISTS device_info TEXT;
ALTER TABLE admin_access_logs ADD COLUMN IF NOT EXISTS user_agent TEXT;
ALTER TABLE admin_access_logs ADD COLUMN IF NOT EXISTS platform TEXT;

-- Add comment
COMMENT ON TABLE authorized_ips IS 'IP addresses authorized to access admin panel';
COMMENT ON COLUMN authorized_ips.ip_address IS 'The IP address (can be specific IP or CIDR range)';
COMMENT ON COLUMN authorized_ips.device_info IS 'Optional device information for logging';

-- Example: Add your current IP
-- Get your IP from: https://whatismyipaddress.com/
-- INSERT INTO authorized_ips (ip_address, name, is_active, notes)
-- VALUES ('YOUR_IP_HERE', 'My Home/Office', true, 'Main admin access');

-- For local development, authorize localhost
INSERT INTO authorized_ips (ip_address, name, is_active, notes)
VALUES ('127.0.0.1', 'Localhost', true, 'Local development')
ON CONFLICT (ip_address) DO NOTHING;

INSERT INTO authorized_ips (ip_address, name, is_active, notes)
VALUES ('::1', 'Localhost IPv6', true, 'Local development IPv6')
ON CONFLICT (ip_address) DO NOTHING;

-- Show current authorized IPs
SELECT ip_address, name, is_active, authorized_at, last_access 
FROM authorized_ips 
ORDER BY authorized_at DESC;
