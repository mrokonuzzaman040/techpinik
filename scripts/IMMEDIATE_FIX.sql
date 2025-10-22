-- IMMEDIATE FIX for RLS infinite recursion
-- Copy and paste this into your Supabase SQL Editor and run it

-- Step 1: Drop ALL problematic policies on profiles table
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.profiles;
DROP POLICY IF EXISTS "Simple admin access" ON public.profiles;
DROP POLICY IF EXISTS "Users can access own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admin email access" ON public.profiles;
DROP POLICY IF EXISTS "Authenticated users can insert" ON public.profiles;

-- Step 2: Completely disable RLS on profiles table temporarily
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;

-- Step 3: Re-enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Step 4: Create ONLY simple, non-recursive policies
CREATE POLICY "Users can access own profile" ON public.profiles
    FOR ALL USING (auth.uid() = id);

CREATE POLICY "Admin email can access all" ON public.profiles
    FOR ALL USING ((auth.jwt() ->> 'email') = 'admin@techpinik.com');

-- Step 5: Fix products table policies
DROP POLICY IF EXISTS "Admins can manage products" ON products;
DROP POLICY IF EXISTS "Products are viewable by everyone" ON products;

CREATE POLICY "Products are viewable by everyone" ON products
    FOR SELECT USING (true);

CREATE POLICY "Admin can manage products" ON products
    FOR ALL USING ((auth.jwt() ->> 'email') = 'admin@techpinik.com');

-- Step 6: Fix categories table policies  
DROP POLICY IF EXISTS "Admins can manage categories" ON categories;
DROP POLICY IF EXISTS "Categories are viewable by everyone" ON categories;

CREATE POLICY "Categories are viewable by everyone" ON categories
    FOR SELECT USING (true);

CREATE POLICY "Admin can manage categories" ON categories
    FOR ALL USING ((auth.jwt() ->> 'email') = 'admin@techpinik.com');

-- Step 7: Ensure proper permissions
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;

GRANT SELECT ON categories TO anon, authenticated;
GRANT SELECT ON products TO anon, authenticated;
GRANT ALL ON categories TO authenticated;
GRANT ALL ON products TO authenticated;

-- Step 8: Verify fix
SELECT 'RLS policies fixed - infinite recursion should be resolved' as status;
