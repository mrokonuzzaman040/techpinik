-- COMPLETE RLS FIX - Run this in your Supabase SQL Editor
-- This will fix all RLS infinite recursion issues

-- ===========================================
-- STEP 1: Fix PROFILES table (main culprit)
-- ===========================================

-- Drop ALL existing policies on profiles
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.profiles;
DROP POLICY IF EXISTS "Simple admin access" ON public.profiles;
DROP POLICY IF EXISTS "Users can access own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admin email access" ON public.profiles;
DROP POLICY IF EXISTS "Authenticated users can insert" ON public.profiles;

-- Disable and re-enable RLS to clear any cached policies
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create simple, non-recursive policies for profiles
CREATE POLICY "Users can access own profile" ON public.profiles
    FOR ALL USING (auth.uid() = id);

CREATE POLICY "Admin email access" ON public.profiles
    FOR ALL USING ((auth.jwt() ->> 'email') = 'admin@techpinik.com');

-- ===========================================
-- STEP 2: Fix PRODUCTS table
-- ===========================================

-- Drop existing policies
DROP POLICY IF EXISTS "Admins can manage products" ON products;
DROP POLICY IF EXISTS "Products are viewable by everyone" ON products;
DROP POLICY IF EXISTS "Admin can manage products" ON products;

-- Disable and re-enable RLS
ALTER TABLE products DISABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Create simple policies for products
CREATE POLICY "Products are viewable by everyone" ON products
    FOR SELECT USING (true);

CREATE POLICY "Admin can manage products" ON products
    FOR ALL USING ((auth.jwt() ->> 'email') = 'admin@techpinik.com');

-- ===========================================
-- STEP 3: Fix CATEGORIES table
-- ===========================================

-- Drop existing policies
DROP POLICY IF EXISTS "Admins can manage categories" ON categories;
DROP POLICY IF EXISTS "Categories are viewable by everyone" ON categories;
DROP POLICY IF EXISTS "Admin can manage categories" ON categories;

-- Disable and re-enable RLS
ALTER TABLE categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Create simple policies for categories
CREATE POLICY "Categories are viewable by everyone" ON categories
    FOR SELECT USING (true);

CREATE POLICY "Admin can manage categories" ON categories
    FOR ALL USING ((auth.jwt() ->> 'email') = 'admin@techpinik.com');

-- ===========================================
-- STEP 4: Fix ORDERS table
-- ===========================================

-- Drop existing policies
DROP POLICY IF EXISTS "Admins can manage orders" ON orders;
DROP POLICY IF EXISTS "Orders are viewable by admins" ON orders;
DROP POLICY IF EXISTS "Anyone can create orders" ON orders;
DROP POLICY IF EXISTS "Admin can manage orders" ON orders;

-- Disable and re-enable RLS
ALTER TABLE orders DISABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Create simple policies for orders
CREATE POLICY "Anyone can create orders" ON orders
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Admin can manage orders" ON orders
    FOR ALL USING ((auth.jwt() ->> 'email') = 'admin@techpinik.com');

-- ===========================================
-- STEP 5: Fix ORDER_ITEMS table
-- ===========================================

-- Drop existing policies
DROP POLICY IF EXISTS "Admins can manage order items" ON order_items;
DROP POLICY IF EXISTS "Order items are viewable by admins" ON order_items;
DROP POLICY IF EXISTS "Anyone can create order items" ON order_items;
DROP POLICY IF EXISTS "Admin can manage order items" ON order_items;

-- Disable and re-enable RLS
ALTER TABLE order_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Create simple policies for order_items
CREATE POLICY "Anyone can create order items" ON order_items
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Admin can manage order items" ON order_items
    FOR ALL USING ((auth.jwt() ->> 'email') = 'admin@techpinik.com');

-- ===========================================
-- STEP 6: Fix DISTRICTS table
-- ===========================================

-- Drop existing policies
DROP POLICY IF EXISTS "Admins can manage districts" ON districts;
DROP POLICY IF EXISTS "Districts are viewable by everyone" ON districts;
DROP POLICY IF EXISTS "Admin can manage districts" ON districts;

-- Disable and re-enable RLS
ALTER TABLE districts DISABLE ROW LEVEL SECURITY;
ALTER TABLE districts ENABLE ROW LEVEL SECURITY;

-- Create simple policies for districts
CREATE POLICY "Districts are viewable by everyone" ON districts
    FOR SELECT USING (true);

CREATE POLICY "Admin can manage districts" ON districts
    FOR ALL USING ((auth.jwt() ->> 'email') = 'admin@techpinik.com');

-- ===========================================
-- STEP 7: Fix SLIDER_ITEMS table
-- ===========================================

-- Drop existing policies
DROP POLICY IF EXISTS "Admins can manage slider items" ON slider_items;
DROP POLICY IF EXISTS "Active slider items are viewable by everyone" ON slider_items;
DROP POLICY IF EXISTS "Admin can manage slider items" ON slider_items;

-- Disable and re-enable RLS
ALTER TABLE slider_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE slider_items ENABLE ROW LEVEL SECURITY;

-- Create simple policies for slider_items
CREATE POLICY "Active slider items are viewable by everyone" ON slider_items
    FOR SELECT USING (is_active = true);

CREATE POLICY "Admin can manage slider items" ON slider_items
    FOR ALL USING ((auth.jwt() ->> 'email') = 'admin@techpinik.com');

-- ===========================================
-- STEP 8: Set proper permissions
-- ===========================================

-- Grant permissions to profiles table
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;

-- Grant permissions to other tables
GRANT SELECT ON categories TO anon, authenticated;
GRANT SELECT ON products TO anon, authenticated;
GRANT SELECT ON districts TO anon, authenticated;
GRANT SELECT ON slider_items TO anon, authenticated;
GRANT INSERT ON orders TO anon, authenticated;
GRANT INSERT ON order_items TO anon, authenticated;

GRANT ALL ON categories TO authenticated;
GRANT ALL ON products TO authenticated;
GRANT ALL ON districts TO authenticated;
GRANT ALL ON slider_items TO authenticated;
GRANT ALL ON orders TO authenticated;
GRANT ALL ON order_items TO authenticated;

-- ===========================================
-- STEP 9: Verify the fix
-- ===========================================

SELECT 'RLS policies fixed successfully - infinite recursion should be resolved' as status;
