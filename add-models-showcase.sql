-- Add models showcase table for SR/S, SR/F, S, DSR/X section
CREATE TABLE IF NOT EXISTS home_models_showcase (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  range VARCHAR(10) NOT NULL,
  charge VARCHAR(10) NOT NULL,
  speed VARCHAR(10) NOT NULL,
  bg_color VARCHAR(7) NOT NULL DEFAULT '#4A5A6A',
  image_url TEXT NOT NULL,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Add show_models_showcase_section column to home_visibility table
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'home_visibility' 
    AND column_name = 'show_models_showcase_section'
  ) THEN
    ALTER TABLE home_visibility ADD COLUMN show_models_showcase_section BOOLEAN DEFAULT true;
  END IF;
END $$;

-- Enable RLS
ALTER TABLE home_models_showcase ENABLE ROW LEVEL SECURITY;

-- Create policies for home_models_showcase
DROP POLICY IF EXISTS "Allow public read access to models showcase" ON home_models_showcase;
CREATE POLICY "Allow public read access to models showcase"
  ON home_models_showcase FOR SELECT
  TO public
  USING (true);

DROP POLICY IF EXISTS "Allow authenticated users to insert models showcase" ON home_models_showcase;
CREATE POLICY "Allow authenticated users to insert models showcase"
  ON home_models_showcase FOR INSERT
  TO authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "Allow authenticated users to update models showcase" ON home_models_showcase;
CREATE POLICY "Allow authenticated users to update models showcase"
  ON home_models_showcase FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Allow authenticated users to delete models showcase" ON home_models_showcase;
CREATE POLICY "Allow authenticated users to delete models showcase"
  ON home_models_showcase FOR DELETE
  TO authenticated
  USING (true);

-- Insert default models
INSERT INTO home_models_showcase (name, range, charge, speed, bg_color, image_url, order_index)
VALUES
  ('SR/S', '171', '1.1', '124', '#4A5A6A', '/images/bike-blue-silver.png', 0),
  ('SR/F', '176', '1.1', '124', '#9B9B8E', '/images/bike-blue-sport.png', 1),
  ('S', '154', '1.3', '104', '#5DABA8', '/images/bike-white-sport.png', 2),
  ('DSR/X', '180', '1.5', '112', '#2D3E50', '/images/bike-white-rounded.png', 3)
ON CONFLICT DO NOTHING;

-- Update visibility record
UPDATE home_visibility 
SET show_models_showcase_section = true 
WHERE id = 1;
