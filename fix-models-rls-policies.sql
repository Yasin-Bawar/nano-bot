-- Drop existing policies
DROP POLICY IF EXISTS "Allow public read access to models showcase" ON home_models_showcase;
DROP POLICY IF EXISTS "Allow authenticated users to insert models showcase" ON home_models_showcase;
DROP POLICY IF EXISTS "Allow authenticated users to update models showcase" ON home_models_showcase;
DROP POLICY IF EXISTS "Allow authenticated users to delete models showcase" ON home_models_showcase;

-- Create new policies that allow ALL operations for authenticated users
CREATE POLICY "Allow public read access to models showcase"
  ON home_models_showcase FOR SELECT
  USING (true);

CREATE POLICY "Allow all operations for authenticated users on models showcase"
  ON home_models_showcase FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Also allow anon users (for service role key)
CREATE POLICY "Allow all operations for anon users on models showcase"
  ON home_models_showcase FOR ALL
  TO anon
  USING (true)
  WITH CHECK (true);
