-- Fix RLS policies to allow anonymous order creation
-- The issue was that policies were trying to access auth.users table which anon role can't access

-- Drop existing problematic policies
DROP POLICY IF EXISTS "Anyone can create orders" ON orders;
DROP POLICY IF EXISTS "Orders are viewable by admins" ON orders;
DROP POLICY IF EXISTS "Anyone can create order items" ON order_items;
DROP POLICY IF EXISTS "Order items are viewable by admins" ON order_items;
DROP POLICY IF EXISTS "Admins can manage orders" ON orders;
DROP POLICY IF EXISTS "Admins can manage order items" ON order_items;

-- Create simplified policies that don't access auth.users table

-- Orders policies
-- Allow anyone (including anonymous users) to create orders
CREATE POLICY "Public can create orders" ON orders
    FOR INSERT WITH CHECK (true);

-- Allow only authenticated users to view orders (for admin dashboard)
-- This avoids the auth.users table access issue by only checking if user is authenticated
CREATE POLICY "Authenticated users can view orders" ON orders
    FOR SELECT USING (auth.uid() IS NOT NULL);

-- Allow only authenticated users to update/delete orders (for admin operations)
CREATE POLICY "Authenticated users can manage orders" ON orders
    FOR ALL USING (auth.uid() IS NOT NULL);

-- Order items policies
-- Allow anyone (including anonymous users) to create order items
CREATE POLICY "Public can create order items" ON order_items
    FOR INSERT WITH CHECK (true);

-- Allow only authenticated users to view order items (for admin dashboard)
CREATE POLICY "Authenticated users can view order items" ON order_items
    FOR SELECT USING (auth.uid() IS NOT NULL);

-- Allow only authenticated users to update/delete order items (for admin operations)
CREATE POLICY "Authenticated users can manage order items" ON order_items
    FOR ALL USING (auth.uid() IS NOT NULL);

-- Ensure proper permissions are granted
-- Grant INSERT permissions to anon role for orders and order_items
GRANT INSERT ON orders TO anon;
GRANT INSERT ON order_items TO anon;

-- Grant SELECT permissions to anon for public tables
GRANT SELECT ON categories TO anon;
GRANT SELECT ON products TO anon;
GRANT SELECT ON districts TO anon;
GRANT SELECT ON slider_items TO anon;

-- Grant full permissions to authenticated users (for admin operations)
GRANT ALL ON orders TO authenticated;
GRANT ALL ON order_items TO authenticated;
GRANT ALL ON categories TO authenticated;
GRANT ALL ON products TO authenticated;
GRANT ALL ON districts TO authenticated;
GRANT ALL ON slider_items TO authenticated;

-- Ensure RLS is enabled on all tables
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE districts ENABLE ROW LEVEL SECURITY;
ALTER TABLE slider_items ENABLE ROW LEVEL SECURITY;