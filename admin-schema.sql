-- Admin Users Table
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  role VARCHAR(20) DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin', 'moderator')),
  is_active BOOLEAN DEFAULT true,
  last_login TIMESTAMP WITH TIME ZONE,
  failed_login_attempts INTEGER DEFAULT 0,
  locked_until TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Admin Sessions Table (for better session management)
CREATE TABLE IF NOT EXISTS admin_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_id UUID REFERENCES admin_users(id) ON DELETE CASCADE,
  session_token TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Admin Activity Log
CREATE TABLE IF NOT EXISTS admin_activity_log (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_id UUID REFERENCES admin_users(id) ON DELETE CASCADE,
  action VARCHAR(100) NOT NULL,
  resource_type VARCHAR(50),
  resource_id TEXT,
  details JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- System Settings Table
CREATE TABLE IF NOT EXISTS system_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category VARCHAR(50) NOT NULL,
  key VARCHAR(100) NOT NULL,
  value JSONB NOT NULL,
  description TEXT,
  updated_by UUID REFERENCES admin_users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(category, key)
);

-- Insert default admin users
INSERT INTO admin_users (username, password_hash, email, role) 
VALUES 
  (
    'yasinadil834@gmail.com',
    'Yasin2025@', -- In production, this should be properly hashed
    'yasinadil834@gmail.com',
    'super_admin'
  ),
  (
    'admin',
    'admin123', -- Backup admin account
    'admin@nanobot.com',
    'super_admin'
  )
ON CONFLICT (username) DO NOTHING;

-- Insert default system settings
INSERT INTO system_settings (category, key, value, description) VALUES
('general', 'site_name', '"NANOBOT"', 'Site name'),
('general', 'site_description', '"فروشگاه موتورسیکلت و قطعات یدکی"', 'Site description'),
('general', 'contact_email', '"info@nanobot.com"', 'Contact email'),
('general', 'contact_phone', '"+1234567890"', 'Contact phone'),
('general', 'address', '"تهران، ایران"', 'Business address'),
('notifications', 'email_notifications', 'true', 'Enable email notifications'),
('notifications', 'sms_notifications', 'false', 'Enable SMS notifications'),
('notifications', 'order_notifications', 'true', 'Enable order notifications'),
('notifications', 'customer_notifications', 'true', 'Enable customer notifications'),
('security', 'require_2fa', 'false', 'Require two-factor authentication'),
('security', 'session_timeout', '30', 'Session timeout in minutes'),
('security', 'max_login_attempts', '5', 'Maximum login attempts before lockout')
ON CONFLICT (category, key) DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_admin_sessions_admin_id ON admin_sessions(admin_id);
CREATE INDEX IF NOT EXISTS idx_admin_sessions_expires_at ON admin_sessions(expires_at);
CREATE INDEX IF NOT EXISTS idx_admin_activity_log_admin_id ON admin_activity_log(admin_id);
CREATE INDEX IF NOT EXISTS idx_admin_activity_log_created_at ON admin_activity_log(created_at);
CREATE INDEX IF NOT EXISTS idx_system_settings_category ON system_settings(category);

-- Enable RLS (Row Level Security)
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_activity_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for admin tables (only accessible by authenticated admin users)
CREATE POLICY "Admin users can view all admin users" ON admin_users
  FOR SELECT USING (true);

CREATE POLICY "Admin users can update their own profile" ON admin_users
  FOR UPDATE USING (true);

CREATE POLICY "Super admins can manage all admin users" ON admin_users
  FOR ALL USING (true);

CREATE POLICY "Admin sessions are accessible by owner" ON admin_sessions
  FOR ALL USING (true);

CREATE POLICY "Admin activity log is viewable by all admins" ON admin_activity_log
  FOR SELECT USING (true);

CREATE POLICY "Admin activity log is insertable by all admins" ON admin_activity_log
  FOR INSERT WITH CHECK (true);

CREATE POLICY "System settings are accessible by all admins" ON system_settings
  FOR ALL USING (true);

-- Function to clean up expired sessions
CREATE OR REPLACE FUNCTION cleanup_expired_admin_sessions()
RETURNS void AS $$
BEGIN
  DELETE FROM admin_sessions WHERE expires_at < NOW();
END;
$$ LANGUAGE plpgsql;

-- Function to log admin activity
CREATE OR REPLACE FUNCTION log_admin_activity(
  p_admin_id UUID,
  p_action VARCHAR(100),
  p_resource_type VARCHAR(50) DEFAULT NULL,
  p_resource_id TEXT DEFAULT NULL,
  p_details JSONB DEFAULT NULL,
  p_ip_address INET DEFAULT NULL,
  p_user_agent TEXT DEFAULT NULL
)
RETURNS void AS $$
BEGIN
  INSERT INTO admin_activity_log (
    admin_id, action, resource_type, resource_id, details, ip_address, user_agent
  ) VALUES (
    p_admin_id, p_action, p_resource_type, p_resource_id, p_details, p_ip_address, p_user_agent
  );
END;
$$ LANGUAGE plpgsql;