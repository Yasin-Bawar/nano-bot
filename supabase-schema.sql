-- =====================================================
-- NANOBOT Electric Motorcycles - Supabase Database Schema
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 1. PRODUCTS TABLE
-- =====================================================
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    name_local VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    old_price DECIMAL(10, 2),
    category VARCHAR(50) NOT NULL CHECK (category IN ('motorcycle', 'part', 'accessory')),
    category_local VARCHAR(100),
    image_url TEXT,
    images TEXT[], -- Array of image URLs
    rating DECIMAL(2, 1) DEFAULT 0,
    reviews_count INTEGER DEFAULT 0,
    in_stock BOOLEAN DEFAULT true,
    stock_quantity INTEGER DEFAULT 0,
    featured BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 2. PRODUCT SPECIFICATIONS TABLE
-- =====================================================
CREATE TABLE product_specs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    label VARCHAR(100) NOT NULL,
    value VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 3. PRODUCT FEATURES TABLE
-- =====================================================
CREATE TABLE product_features (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    feature TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 4. PRODUCT COLORS TABLE
-- =====================================================
CREATE TABLE product_colors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    name VARCHAR(50) NOT NULL,
    code VARCHAR(7) NOT NULL, -- Hex color code
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 5. CUSTOMERS TABLE
-- =====================================================
CREATE TABLE customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    country_code VARCHAR(5) DEFAULT '+93',
    location TEXT,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 6. ORDERS TABLE
-- =====================================================
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
    product_id UUID REFERENCES products(id) ON DELETE SET NULL, -- Can be NULL
    product_name VARCHAR(255) NOT NULL,
    quantity INTEGER DEFAULT 1,
    total_price DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled')),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 7. MESSAGES TABLE (Customer-Admin Chat)
-- =====================================================
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
    order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
    sender_type VARCHAR(20) NOT NULL CHECK (sender_type IN ('customer', 'admin')),
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 8. REVIEWS TABLE
-- =====================================================
CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 9. CART TABLE
-- =====================================================
CREATE TABLE cart (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    quantity INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(customer_id, product_id)
);

-- =====================================================
-- 10. WISHLIST TABLE
-- =====================================================
CREATE TABLE wishlist (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(customer_id, product_id)
);

-- =====================================================
-- INDEXES for Performance
-- =====================================================
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_featured ON products(featured);
CREATE INDEX idx_orders_customer ON orders(customer_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_messages_customer ON messages(customer_id);
CREATE INDEX idx_messages_order ON messages(order_id);
CREATE INDEX idx_reviews_product ON reviews(product_id);

-- =====================================================
-- FUNCTIONS & TRIGGERS
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON customers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cart_updated_at BEFORE UPDATE ON cart
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to update product rating when review is added
CREATE OR REPLACE FUNCTION update_product_rating()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE products
    SET rating = (
        SELECT AVG(rating)::DECIMAL(2,1)
        FROM reviews
        WHERE product_id = NEW.product_id
    ),
    reviews_count = (
        SELECT COUNT(*)
        FROM reviews
        WHERE product_id = NEW.product_id
    )
    WHERE id = NEW.product_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_rating_on_review AFTER INSERT ON reviews
    FOR EACH ROW EXECUTE FUNCTION update_product_rating();

-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_specs ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_colors ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlist ENABLE ROW LEVEL SECURITY;

-- Public read access for products and related tables
CREATE POLICY "Public can view products" ON products FOR SELECT USING (true);
CREATE POLICY "Public can view product_specs" ON product_specs FOR SELECT USING (true);
CREATE POLICY "Public can view product_features" ON product_features FOR SELECT USING (true);
CREATE POLICY "Public can view product_colors" ON product_colors FOR SELECT USING (true);
CREATE POLICY "Public can view reviews" ON reviews FOR SELECT USING (true);

-- Customers can insert their own data
CREATE POLICY "Anyone can insert customers" ON customers FOR INSERT WITH CHECK (true);
CREATE POLICY "Customers can view own data" ON customers FOR SELECT USING (true);

-- Orders policies
CREATE POLICY "Anyone can insert orders" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can view orders" ON orders FOR SELECT USING (true);

-- Messages policies
CREATE POLICY "Anyone can insert messages" ON messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can view messages" ON messages FOR SELECT USING (true);
CREATE POLICY "Anyone can update messages" ON messages FOR UPDATE USING (true);

-- Cart policies
CREATE POLICY "Anyone can manage cart" ON cart FOR ALL USING (true);

-- Wishlist policies
CREATE POLICY "Anyone can manage wishlist" ON wishlist FOR ALL USING (true);

-- Reviews policies
CREATE POLICY "Anyone can insert reviews" ON reviews FOR INSERT WITH CHECK (true);

-- =====================================================
-- SAMPLE DATA
-- =====================================================

-- Insert sample products
INSERT INTO products (name, name_local, description, price, old_price, category, category_local, image_url, images, rating, reviews_count, in_stock, stock_quantity, featured) VALUES
('Sport SR/F', 'اسپرت SR/F', 'موتورسیکلت برقی پیشرفته با عملکرد بالا و طراحی مدرن', 19995.00, 22995.00, 'motorcycle', 'موتورسیکلت', '/images/bike-blue-sport.png', ARRAY['/images/bike-blue-sport.png', '/images/bike-blue-front.png', '/images/bike-blue-silver.png'], 4.8, 124, true, 15, true),
('Urban Cruiser', 'کروزر شهری', 'موتورسیکلت برقی برای شهر با راحتی بالا', 17995.00, NULL, 'motorcycle', 'موتورسیکلت', '/images/bike-blue-front.png', ARRAY['/images/bike-blue-front.png'], 4.9, 156, true, 20, true),
('White Sport', 'اسپرت سفید', 'موتورسیکلت اسپرت سفید با طراحی زیبا', 10995.00, NULL, 'motorcycle', 'موتورسیکلت', '/images/bike-white-sport.png', ARRAY['/images/bike-white-sport.png'], 4.7, 98, true, 10, false),
('Silver Edition', 'نسخه نقره‌ای', 'نسخه ویژه نقره‌ای با امکانات پیشرفته', 11995.00, NULL, 'motorcycle', 'موتورسیکلت', '/images/bike-blue-silver.png', ARRAY['/images/bike-blue-silver.png'], 4.6, 78, true, 8, false),
('White Rounded', 'سفید گرد', 'طراحی گرد و مدرن با رنگ سفید', 12995.00, NULL, 'motorcycle', 'موتورسیکلت', '/images/bike-white-rounded.png', ARRAY['/images/bike-white-rounded.png'], 4.9, 145, true, 12, false),
('Battery Pack', 'بسته باتری', 'باتری اضافی با ظرفیت بالا', 2499.00, NULL, 'part', 'قطعه', '/technical-diagram-electric-motorcycle-battery-syst.jpg', ARRAY['/technical-diagram-electric-motorcycle-battery-syst.jpg'], 4.6, 89, true, 50, false),
('Handlebars', 'فرمان', 'فرمان ارگونومیک با کیفیت بالا', 299.00, NULL, 'part', 'قطعه', '/images/bike-handlebars.png', ARRAY['/images/bike-handlebars.png'], 4.5, 67, true, 30, false),
('Motor System', 'سیستم موتور', 'سیستم موتور الکتریکی پیشرفته', 1899.00, NULL, 'part', 'قطعه', '/high-tech-electric-motorcycle-design-studio-with-n.jpg', ARRAY['/high-tech-electric-motorcycle-design-studio-with-n.jpg'], 4.8, 112, true, 25, false);

-- Get product IDs for relationships
DO $$
DECLARE
    sport_id UUID;
    urban_id UUID;
BEGIN
    -- Get Sport SR/F ID
    SELECT id INTO sport_id FROM products WHERE name = 'Sport SR/F' LIMIT 1;
    
    -- Insert specs for Sport SR/F
    INSERT INTO product_specs (product_id, label, value) VALUES
    (sport_id, 'برد', '220 کیلومتر'),
    (sport_id, 'سرعت بالا', '180 کیلومتر/ساعت'),
    (sport_id, 'زمان شارژ', '1 ساعت'),
    (sport_id, 'قدرت موتور', '110 اسب بخار'),
    (sport_id, 'وزن', '220 کیلوگرم'),
    (sport_id, 'گارانتی', '2 سال'),
    (sport_id, 'ظرفیت باتری', '14.4 kWh'),
    (sport_id, 'نوع موتور', 'الکتریکی بدون جاروبک');
    
    -- Insert features for Sport SR/F
    INSERT INTO product_features (product_id, feature) VALUES
    (sport_id, 'سیستم ABS پیشرفته'),
    (sport_id, 'نمایشگر دیجیتال رنگی'),
    (sport_id, 'اتصال بلوتوث و اپلیکیشن موبایل'),
    (sport_id, 'چراغ‌های LED تمام'),
    (sport_id, 'صندلی راحت و قابل تنظیم'),
    (sport_id, 'باتری قابل تعویض'),
    (sport_id, 'سیستم کنترل کشش'),
    (sport_id, 'شارژر سریع همراه');
    
    -- Insert colors for Sport SR/F
    INSERT INTO product_colors (product_id, name, code) VALUES
    (sport_id, 'آبی', '#2563EB'),
    (sport_id, 'سفید', '#FFFFFF'),
    (sport_id, 'مشکی', '#000000'),
    (sport_id, 'قرمز', '#DC2626');
END $$;

-- =====================================================
-- VIEWS for easier querying
-- =====================================================

-- View for products with all details
CREATE OR REPLACE VIEW products_full AS
SELECT 
    p.*,
    COALESCE(json_agg(DISTINCT jsonb_build_object('label', ps.label, 'value', ps.value)) FILTER (WHERE ps.id IS NOT NULL), '[]') as specs,
    COALESCE(json_agg(DISTINCT pf.feature) FILTER (WHERE pf.id IS NOT NULL), '[]') as features,
    COALESCE(json_agg(DISTINCT jsonb_build_object('name', pc.name, 'code', pc.code)) FILTER (WHERE pc.id IS NOT NULL), '[]') as colors
FROM products p
LEFT JOIN product_specs ps ON p.id = ps.product_id
LEFT JOIN product_features pf ON p.id = pf.product_id
LEFT JOIN product_colors pc ON p.id = pc.product_id
GROUP BY p.id;

-- =====================================================
-- FUNCTIONS for API
-- =====================================================

-- Function to create order with customer
CREATE OR REPLACE FUNCTION create_order_with_customer(
    p_customer_name VARCHAR,
    p_phone VARCHAR,
    p_country_code VARCHAR,
    p_location TEXT,
    p_latitude DECIMAL,
    p_longitude DECIMAL,
    p_product_id UUID,
    p_product_name VARCHAR,
    p_quantity INTEGER,
    p_total_price DECIMAL
)
RETURNS TABLE(order_id UUID, customer_id UUID) AS $$
DECLARE
    v_customer_id UUID;
    v_order_id UUID;
BEGIN
    -- Insert customer
    INSERT INTO customers (name, phone, country_code, location, latitude, longitude)
    VALUES (p_customer_name, p_phone, p_country_code, p_location, p_latitude, p_longitude)
    RETURNING id INTO v_customer_id;
    
    -- Insert order
    INSERT INTO orders (customer_id, product_id, product_name, quantity, total_price)
    VALUES (v_customer_id, p_product_id, p_product_name, p_quantity, p_total_price)
    RETURNING id INTO v_order_id;
    
    RETURN QUERY SELECT v_order_id, v_customer_id;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- COMPLETED!
-- =====================================================
-- Run this entire script in your Supabase SQL Editor
-- Then use the Supabase client in your Next.js app
-- =====================================================
