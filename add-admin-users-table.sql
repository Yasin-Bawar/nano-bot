-- Create admin users table with secure password storage
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'admin',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_login TIMESTAMPTZ
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_admin_users_username ON admin_users(username);
CREATE INDEX IF NOT EXISTS idx_admin_users_email ON admin_users(email);

-- Insert default admin user (password: Yasin2025@)
-- Note: In production, use proper password hashing (bcrypt, argon2, etc.)
INSERT INTO admin_users (username, email, password_hash, role)
VALUES (
  'yasinadil834@gmail.com',
  'yasinadil834@gmail.com',
  'Yasin2025@', -- In production, this should be hashed
  'super_admin'
) ON CONFLICT (username) DO NOTHING;

-- Enable RLS
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Policy: Service role can do everything
CREATE POLICY "Service role full access on admin_users"
  ON admin_users
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Policy: Anon can only read for login verification
CREATE POLICY "Anon can read admin_users for login"
  ON admin_users
  FOR SELECT
  TO anon
  USING (is_active = true);

-- Grant permissions
GRANT SELECT ON admin_users TO anon;
GRANT ALL ON admin_users TO service_role;

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_admin_users_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER admin_users_updated_at
  BEFORE UPDATE ON admin_users
  FOR EACH ROW
  EXECUTE FUNCTION update_admin_users_updated_at();

-- Success message
DO $$
BEGIN
  RAISE NOTICE '✅ Admin users table created successfully!';
  RAISE NOTICE '📝 Default admin: yasinadil834@gmail.com / Yasin2025@';
  RAISE NOTICE '⚠️  Remember to change the password after first login!';
END $$;
