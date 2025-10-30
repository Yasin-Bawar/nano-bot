-- Create table to store featured products for home page
CREATE TABLE IF NOT EXISTS home_featured_products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  UNIQUE(product_id)
);

-- Enable RLS
ALTER TABLE home_featured_products ENABLE ROW LEVEL SECURITY;

-- Create policies
DROP POLICY IF EXISTS "Allow public read access to featured products" ON home_featured_products;
CREATE POLICY "Allow public read access to featured products"
  ON home_featured_products FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Allow all operations for authenticated users on featured products" ON home_featured_products;
CREATE POLICY "Allow all operations for authenticated users on featured products"
  ON home_featured_products FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all operations for anon users on featured products" ON home_featured_products;
CREATE POLICY "Allow all operations for anon users on featured products"
  ON home_featured_products FOR ALL
  TO anon
  USING (true)
  WITH CHECK (true);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_featured_products_order ON home_featured_products(order_index);
