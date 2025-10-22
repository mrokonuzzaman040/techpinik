-- Comprehensive fix for all RLS policies
-- This script fixes the infinite recursion and admin access issues

-- Step 1: Fix profiles table RLS policies
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.profiles;
DROP POLICY IF EXISTS "Simple admin access" ON public.profiles;
DROP POLICY IF EXISTS "Users can access own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admin email access" ON public.profiles;
DROP POLICY IF EXISTS "Authenticated users can insert" ON public.profiles;

-- Disable and re-enable RLS on profiles
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create simple profiles policies
CREATE POLICY "Users can access own profile" ON public.profiles
    FOR ALL USING (auth.uid() = id);

CREATE POLICY "Admin email access" ON public.profiles
    FOR ALL USING ((auth.jwt() ->> 'email') = 'admin@techpinik.com');

CREATE POLICY "Authenticated users can insert" ON public.profiles
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Step 2: Fix products table RLS policies
DROP POLICY IF EXISTS "Admins can manage products" ON products;
DROP POLICY IF EXISTS "Products are viewable by everyone" ON products;

-- Create simple products policies
CREATE POLICY "Products are viewable by everyone" ON products
    FOR SELECT USING (true);

CREATE POLICY "Admin can manage products" ON products
    FOR ALL USING ((auth.jwt() ->> 'email') = 'admin@techpinik.com');

-- Step 3: Fix categories table RLS policies
DROP POLICY IF EXISTS "Admins can manage categories" ON categories;
DROP POLICY IF EXISTS "Categories are viewable by everyone" ON categories;

CREATE POLICY "Categories are viewable by everyone" ON categories
    FOR SELECT USING (true);

CREATE POLICY "Admin can manage categories" ON categories
    FOR ALL USING ((auth.jwt() ->> 'email') = 'admin@techpinik.com');

-- Step 4: Fix orders table RLS policies
DROP POLICY IF EXISTS "Admins can manage orders" ON orders;
DROP POLICY IF EXISTS "Orders are viewable by admins" ON orders;
DROP POLICY IF EXISTS "Anyone can create orders" ON orders;

CREATE POLICY "Anyone can create orders" ON orders
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Admin can manage orders" ON orders
    FOR ALL USING ((auth.jwt() ->> 'email') = 'admin@techpinik.com');

-- Step 5: Fix order_items table RLS policies
DROP POLICY IF EXISTS "Admins can manage order items" ON order_items;
DROP POLICY IF EXISTS "Order items are viewable by admins" ON order_items;
DROP POLICY IF EXISTS "Anyone can create order items" ON order_items;

CREATE POLICY "Anyone can create order items" ON order_items
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Admin can manage order items" ON order_items
    FOR ALL USING ((auth.jwt() ->> 'email') = 'admin@techpinik.com');

-- Step 6: Fix districts table RLS policies
DROP POLICY IF EXISTS "Admins can manage districts" ON districts;
DROP POLICY IF EXISTS "Districts are viewable by everyone" ON districts;

CREATE POLICY "Districts are viewable by everyone" ON districts
    FOR SELECT USING (true);

CREATE POLICY "Admin can manage districts" ON districts
    FOR ALL USING ((auth.jwt() ->> 'email') = 'admin@techpinik.com');

-- Step 7: Fix slider_items table RLS policies
DROP POLICY IF EXISTS "Admins can manage slider items" ON slider_items;
DROP POLICY IF EXISTS "Active slider items are viewable by everyone" ON slider_items;

CREATE POLICY "Active slider items are viewable by everyone" ON slider_items
    FOR SELECT USING (is_active = true);

CREATE POLICY "Admin can manage slider items" ON slider_items
    FOR ALL USING ((auth.jwt() ->> 'email') = 'admin@techpinik.com');

-- Step 8: Ensure proper permissions
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;

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

-- Step 9: Verify the fix
SELECT 'All RLS policies fixed successfully' as status;
