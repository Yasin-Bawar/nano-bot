-- Create authorized_devices table for device-based access control
CREATE TABLE IF NOT EXISTS authorized_devices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  device_id TEXT UNIQUE NOT NULL,
  device_name TEXT NOT NULL,
  device_fingerprint TEXT NOT NULL,
  authorized_by TEXT,
  authorized_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_access TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create admin_access_logs table for security auditing
CREATE TABLE IF NOT EXISTS admin_access_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  device_id TEXT NOT NULL,
  device_fingerprint TEXT NOT NULL,
  access_granted BOOLEAN NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  accessed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  access_path TEXT,
  denial_reason TEXT
);

-- Create admin_secret_keys table (stores the secret admin URL path)
CREATE TABLE IF NOT EXISTS admin_secret_keys (
  id INTEGER PRIMARY KEY DEFAULT 1,
  secret_path TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_rotated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default secret path (CHANGE THIS!)
INSERT INTO admin_secret_keys (id, secret_path)
SELECT 1, 'x9k2m7p4q8w5n3j6'
WHERE NOT EXISTS (SELECT 1 FROM admin_secret_keys WHERE id = 1);

-- Enable RLS on all tables
ALTER TABLE authorized_devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_access_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_secret_keys ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Allow service role full access to authorized_devices" ON authorized_devices;
DROP POLICY IF EXISTS "Allow service role full access to admin_access_logs" ON admin_access_logs;
DROP POLICY IF EXISTS "Allow service role full access to admin_secret_keys" ON admin_secret_keys;

-- Policies for authorized_devices (only service role can access)
CREATE POLICY "Allow service role full access to authorized_devices"
  ON authorized_devices
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Policies for admin_access_logs (only service role can access)
CREATE POLICY "Allow service role full access to admin_access_logs"
  ON admin_access_logs
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Policies for admin_secret_keys (only service role can access)
CREATE POLICY "Allow service role full access to admin_secret_keys"
  ON admin_secret_keys
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_authorized_devices_device_id ON authorized_devices(device_id);
CREATE INDEX IF NOT EXISTS idx_authorized_devices_is_active ON authorized_devices(is_active);
CREATE INDEX IF NOT EXISTS idx_admin_access_logs_device_id ON admin_access_logs(device_id);
CREATE INDEX IF NOT EXISTS idx_admin_access_logs_accessed_at ON admin_access_logs(accessed_at DESC);

-- Create function to log access attempts
CREATE OR REPLACE FUNCTION log_admin_access(
  p_device_id TEXT,
  p_device_fingerprint TEXT,
  p_access_granted BOOLEAN,
  p_ip_address TEXT DEFAULT NULL,
  p_user_agent TEXT DEFAULT NULL,
  p_access_path TEXT DEFAULT NULL,
  p_denial_reason TEXT DEFAULT NULL
)
RETURNS void AS $$
BEGIN
  INSERT INTO admin_access_logs (
    device_id,
    device_fingerprint,
    access_granted,
    ip_address,
    user_agent,
    access_path,
    denial_reason
  ) VALUES (
    p_device_id,
    p_device_fingerprint,
    p_access_granted,
    p_ip_address,
    p_user_agent,
    p_access_path,
    p_denial_reason
  );
  
  -- Update last_access for authorized devices
  IF p_access_granted THEN
    UPDATE authorized_devices 
    SET last_access = NOW()
    WHERE device_id = p_device_id;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to check if device is authorized
CREATE OR REPLACE FUNCTION is_device_authorized(
  p_device_id TEXT,
  p_device_fingerprint TEXT
)
RETURNS BOOLEAN AS $$
DECLARE
  v_is_authorized BOOLEAN;
BEGIN
  SELECT is_active INTO v_is_authorized
  FROM authorized_devices
  WHERE device_id = p_device_id 
    AND device_fingerprint = p_device_fingerprint
    AND is_active = true;
  
  RETURN COALESCE(v_is_authorized, false);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to rotate secret path
CREATE OR REPLACE FUNCTION rotate_admin_secret_path(
  p_new_secret_path TEXT
)
RETURNS TEXT AS $$
DECLARE
  v_old_path TEXT;
BEGIN
  SELECT secret_path INTO v_old_path FROM admin_secret_keys WHERE id = 1;
  
  UPDATE admin_secret_keys 
  SET secret_path = p_new_secret_path,
      last_rotated = NOW(),
      updated_at = NOW()
  WHERE id = 1;
  
  RETURN v_old_path;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permissions on functions
GRANT EXECUTE ON FUNCTION log_admin_access TO service_role;
GRANT EXECUTE ON FUNCTION is_device_authorized TO service_role;
GRANT EXECUTE ON FUNCTION rotate_admin_secret_path TO service_role;

-- Create trigger for updated_at
DROP TRIGGER IF EXISTS update_authorized_devices_updated_at ON authorized_devices;
CREATE TRIGGER update_authorized_devices_updated_at
  BEFORE UPDATE ON authorized_devices
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_admin_secret_keys_updated_at ON admin_secret_keys;
CREATE TRIGGER update_admin_secret_keys_updated_at
  BEFORE UPDATE ON admin_secret_keys
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Success message
DO $$
BEGIN
  RAISE NOTICE '✅ Secure admin device whitelist system created!';
  RAISE NOTICE '🔐 Default secret path: x9k2m7p4q8w5n3j6';
  RAISE NOTICE '⚠️  IMPORTANT: Change the secret path immediately!';
  RAISE NOTICE '📱 Use the Electron app to manage authorized devices';
END $$;
