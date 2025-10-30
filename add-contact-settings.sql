-- Create contact settings table
CREATE TABLE IF NOT EXISTS home_contact_settings (
  id INTEGER PRIMARY KEY DEFAULT 1,
  title_dari TEXT NOT NULL DEFAULT 'با ما تماس بگیرید',
  title_pashto TEXT NOT NULL DEFAULT 'زموږ سره اړیکه ونیسئ',
  subtitle_dari TEXT NOT NULL DEFAULT 'ما اینجا هستیم تا به شما خدمت کنیم',
  subtitle_pashto TEXT NOT NULL DEFAULT 'موږ ستاسو د خدمت لپاره دلته یو',
  address_dari TEXT NOT NULL DEFAULT 'شهر هرات، افغانستان',
  address_pashto TEXT NOT NULL DEFAULT 'د هرات ښار، افغانستان',
  address_detail_dari TEXT NOT NULL DEFAULT 'بازار مرکزی هرات، فروشگاه موتورسیکلت',
  address_detail_pashto TEXT NOT NULL DEFAULT 'د هرات مرکزي بازار، د موټرسایکل پلورنځي',
  phone VARCHAR(20) NOT NULL DEFAULT '+93 799 123 456',
  email VARCHAR(100) NOT NULL DEFAULT 'info@electricbikes.af',
  hours_dari TEXT NOT NULL DEFAULT 'هفته: 8:00 - 18:00',
  hours_pashto TEXT NOT NULL DEFAULT 'اونۍ: 8:00 - 18:00',
  hours_detail_dari TEXT NOT NULL DEFAULT 'شنبه تا پنجشنبه',
  hours_detail_pashto TEXT NOT NULL DEFAULT 'شنبه تر پنجشنبه',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  CONSTRAINT single_row CHECK (id = 1)
);

-- Enable RLS
ALTER TABLE home_contact_settings ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Allow public read access to contact settings" ON home_contact_settings;
DROP POLICY IF EXISTS "Allow all operations for all users on contact settings" ON home_contact_settings;

-- Create policies
CREATE POLICY "Allow public read access to contact settings"
  ON home_contact_settings FOR SELECT
  USING (true);

CREATE POLICY "Allow all operations for all users on contact settings"
  ON home_contact_settings FOR ALL
  USING (true)
  WITH CHECK (true);

-- Insert default data
INSERT INTO home_contact_settings (id)
VALUES (1)
ON CONFLICT (id) DO NOTHING;
