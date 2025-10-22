-- Update categories table to match our requirements
ALTER TABLE categories 
ADD COLUMN IF NOT EXISTS parent_id UUID REFERENCES categories(id),
ADD COLUMN IF NOT EXISTS icon TEXT;

-- Update categories table constraints
ALTER TABLE categories 
DROP CONSTRAINT IF EXISTS categories_slug_key;
ALTER TABLE categories 
ADD CONSTRAINT categories_slug_unique UNIQUE (slug);

-- Update products table to ensure slug is unique and not null
ALTER TABLE products 
ALTER COLUMN slug SET NOT NULL;

-- Update orders table to match our requirements
-- First, let's add the missing columns
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS customer_address TEXT,
ADD COLUMN IF NOT EXISTS district_id UUID REFERENCES districts(id),
ADD COLUMN IF NOT EXISTS subtotal NUMERIC(10,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS delivery_charge NUMERIC(10,2) DEFAULT 0;

-- Update orders table to rename shipping columns to match our API
UPDATE orders SET customer_address = shipping_address_line_1 WHERE customer_address IS NULL;
UPDATE orders SET subtotal = total_amount - COALESCE(shipping_cost, 0) WHERE subtotal = 0;
UPDATE orders SET delivery_charge = COALESCE(shipping_cost, 0) WHERE delivery_charge = 0;

-- Drop unnecessary columns from orders (we'll keep them for now to avoid data loss)
-- ALTER TABLE orders DROP COLUMN IF EXISTS order_number;
-- ALTER TABLE orders DROP COLUMN IF EXISTS customer_id;
-- ALTER TABLE orders DROP COLUMN IF EXISTS shipping_address_line_1;
-- ALTER TABLE orders DROP COLUMN IF EXISTS shipping_address_line_2;
-- ALTER TABLE orders DROP COLUMN IF EXISTS shipping_city;
-- ALTER TABLE orders DROP COLUMN IF EXISTS shipping_district;
-- ALTER TABLE orders DROP COLUMN IF EXISTS shipping_country;
-- ALTER TABLE orders DROP COLUMN IF EXISTS shipping_cost;
-- ALTER TABLE orders DROP COLUMN IF EXISTS payment_method;
-- ALTER TABLE orders DROP COLUMN IF EXISTS payment_status;

-- Update order_items table to match our requirements
-- Remove unnecessary columns and add missing ones
ALTER TABLE order_items 
DROP COLUMN IF EXISTS product_name,
DROP COLUMN IF EXISTS product_sku,
DROP COLUMN IF EXISTS total_price;

-- Ensure order_items has the correct structure
ALTER TABLE order_items 
ALTER COLUMN order_id SET NOT NULL,
ALTER COLUMN product_id SET NOT NULL,
ALTER COLUMN quantity SET NOT NULL,
ALTER COLUMN unit_price SET NOT NULL;

-- Update slider_items table to match our API expectations
-- The table structure looks good, but let's ensure it has the right field names
-- Rename button_link to link_url if needed
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'slider_items' AND column_name = 'button_link') THEN
        ALTER TABLE slider_items RENAME COLUMN button_link TO link_url;
    END IF;
END $$;

-- Add missing indexes for better performance
CREATE INDEX IF NOT EXISTS idx_categories_parent_id ON categories(parent_id);
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);
CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_is_featured ON products(is_featured);
CREATE INDEX IF NOT EXISTS idx_products_is_active ON products(is_active);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_district_id ON orders(district_id);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON order_items(product_id);
CREATE INDEX IF NOT EXISTS idx_slider_items_sort_order ON slider_items(sort_order);
CREATE INDEX IF NOT EXISTS idx_slider_items_is_active ON slider_items(is_active);
CREATE INDEX IF NOT EXISTS idx_districts_name ON districts(name);

-- Enable Row Level Security (RLS) on all tables
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE districts ENABLE ROW LEVEL SECURITY;
ALTER TABLE slider_items ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for public read access
-- Categories - public read access
DROP POLICY IF EXISTS "Categories are viewable by everyone" ON categories;
CREATE POLICY "Categories are viewable by everyone" ON categories
    FOR SELECT USING (true);

-- Products - public read access
DROP POLICY IF EXISTS "Products are viewable by everyone" ON products;
CREATE POLICY "Products are viewable by everyone" ON products
    FOR SELECT USING (true);

-- Districts - public read access
DROP POLICY IF EXISTS "Districts are viewable by everyone" ON districts;
CREATE POLICY "Districts are viewable by everyone" ON districts
    FOR SELECT USING (true);

-- Slider items - public read access for active items
DROP POLICY IF EXISTS "Active slider items are viewable by everyone" ON slider_items;
CREATE POLICY "Active slider items are viewable by everyone" ON slider_items
    FOR SELECT USING (is_active = true);

-- Orders - users can create orders, admins can view all
DROP POLICY IF EXISTS "Anyone can create orders" ON orders;
CREATE POLICY "Anyone can create orders" ON orders
    FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Orders are viewable by admins" ON orders;
CREATE POLICY "Orders are viewable by admins" ON orders
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.users.id = auth.uid() 
            AND auth.users.raw_user_meta_data->>'role' = 'admin'
        )
    );

-- Order items - same as orders
DROP POLICY IF EXISTS "Anyone can create order items" ON order_items;
CREATE POLICY "Anyone can create order items" ON order_items
    FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Order items are viewable by admins" ON order_items;
CREATE POLICY "Order items are viewable by admins" ON order_items
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.users.id = auth.uid() 
            AND auth.users.raw_user_meta_data->>'role' = 'admin'
        )
    );

-- Admin policies for full access
-- Categories
DROP POLICY IF EXISTS "Admins can manage categories" ON categories;
CREATE POLICY "Admins can manage categories" ON categories
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.users.id = auth.uid() 
            AND auth.users.raw_user_meta_data->>'role' = 'admin'
        )
    );

-- Products
DROP POLICY IF EXISTS "Admins can manage products" ON products;
CREATE POLICY "Admins can manage products" ON products
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.users.id = auth.uid() 
            AND auth.users.raw_user_meta_data->>'role' = 'admin'
        )
    );

-- Districts
DROP POLICY IF EXISTS "Admins can manage districts" ON districts;
CREATE POLICY "Admins can manage districts" ON districts
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.users.id = auth.uid() 
            AND auth.users.raw_user_meta_data->>'role' = 'admin'
        )
    );

-- Slider items
DROP POLICY IF EXISTS "Admins can manage slider items" ON slider_items;
CREATE POLICY "Admins can manage slider items" ON slider_items
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.users.id = auth.uid() 
            AND auth.users.raw_user_meta_data->>'role' = 'admin'
        )
    );

-- Orders (admin full access)
DROP POLICY IF EXISTS "Admins can manage orders" ON orders;
CREATE POLICY "Admins can manage orders" ON orders
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.users.id = auth.uid() 
            AND auth.users.raw_user_meta_data->>'role' = 'admin'
        )
    );

-- Order items (admin full access)
DROP POLICY IF EXISTS "Admins can manage order items" ON order_items;
CREATE POLICY "Admins can manage order items" ON order_items
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.users.id = auth.uid() 
            AND auth.users.raw_user_meta_data->>'role' = 'admin'
        )
    );

-- Grant permissions to anon and authenticated roles
GRANT SELECT ON categories TO anon, authenticated;
GRANT SELECT ON products TO anon, authenticated;
GRANT SELECT ON districts TO anon, authenticated;
GRANT SELECT ON slider_items TO anon, authenticated;
GRANT INSERT ON orders TO anon, authenticated;
GRANT INSERT ON order_items TO anon, authenticated;

-- Grant full permissions to authenticated users (for admin operations)
GRANT ALL ON categories TO authenticated;
GRANT ALL ON products TO authenticated;
GRANT ALL ON districts TO authenticated;
GRANT ALL ON slider_items TO authenticated;
GRANT ALL ON orders TO authenticated;
GRANT ALL ON order_items TO authenticated;

-- Create functions for stock management
CREATE OR REPLACE FUNCTION decrement_stock(product_id UUID, quantity INTEGER)
RETURNS INTEGER AS $$
DECLARE
    current_stock INTEGER;
BEGIN
    SELECT stock_quantity INTO current_stock FROM products WHERE id = product_id;
    
    IF current_stock >= quantity THEN
        UPDATE products 
        SET stock_quantity = stock_quantity - quantity,
            updated_at = NOW()
        WHERE id = product_id;
        RETURN current_stock - quantity;
    ELSE
        RAISE EXCEPTION 'Insufficient stock. Available: %, Requested: %', current_stock, quantity;
    END IF;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION increment_stock(product_id UUID, quantity INTEGER)
RETURNS INTEGER AS $$
BEGIN
    UPDATE products 
    SET stock_quantity = stock_quantity + quantity,
        updated_at = NOW()
    WHERE id = product_id;
    
    RETURN (SELECT stock_quantity FROM products WHERE id = product_id);
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for updated_at
DROP TRIGGER IF EXISTS update_categories_updated_at ON categories;
CREATE TRIGGER update_categories_updated_at
    BEFORE UPDATE ON categories
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_products_updated_at ON products;
CREATE TRIGGER update_products_updated_at
    BEFORE UPDATE ON products
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_orders_updated_at ON orders;
CREATE TRIGGER update_orders_updated_at
    BEFORE UPDATE ON orders
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_order_items_updated_at ON order_items;
CREATE TRIGGER update_order_items_updated_at
    BEFORE UPDATE ON order_items
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_districts_updated_at ON districts;
CREATE TRIGGER update_districts_updated_at
    BEFORE UPDATE ON districts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_slider_items_updated_at ON slider_items;
CREATE TRIGGER update_slider_items_updated_at
    BEFORE UPDATE ON slider_items
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();