-- Fix Product Insertion Policies
-- Run this in Supabase SQL Editor if you're getting errors when adding products

-- Drop existing policies
DROP POLICY IF EXISTS "Public can view products" ON products;
DROP POLICY IF EXISTS "Public can view product_specs" ON product_specs;
DROP POLICY IF EXISTS "Public can view product_features" ON product_features;
DROP POLICY IF EXISTS "Public can view product_colors" ON product_colors;

-- Create new policies with INSERT permissions

-- Products table
CREATE POLICY "Anyone can view products" ON products FOR SELECT USING (true);
CREATE POLICY "Anyone can insert products" ON products FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update products" ON products FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete products" ON products FOR DELETE USING (true);

-- Product specs table
CREATE POLICY "Anyone can view product_specs" ON product_specs FOR SELECT USING (true);
CREATE POLICY "Anyone can insert product_specs" ON product_specs FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update product_specs" ON product_specs FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete product_specs" ON product_specs FOR DELETE USING (true);

-- Product features table
CREATE POLICY "Anyone can view product_features" ON product_features FOR SELECT USING (true);
CREATE POLICY "Anyone can insert product_features" ON product_features FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update product_features" ON product_features FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete product_features" ON product_features FOR DELETE USING (true);

-- Product colors table
CREATE POLICY "Anyone can view product_colors" ON product_colors FOR SELECT USING (true);
CREATE POLICY "Anyone can insert product_colors" ON product_colors FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update product_colors" ON product_colors FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete product_colors" ON product_colors FOR DELETE USING (true);

-- Verify policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE tablename IN ('products', 'product_specs', 'product_features', 'product_colors')
ORDER BY tablename, policyname;
