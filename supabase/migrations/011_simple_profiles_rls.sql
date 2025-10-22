-- Simple RLS policies for profiles table to avoid recursion
-- This migration replaces complex policies with simple ones

-- Drop all existing policies
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.profiles;
DROP POLICY IF EXISTS "Simple admin access" ON public.profiles;

-- Disable RLS temporarily to fix the recursion issue
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;

-- Re-enable RLS with simple policies
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Simple policy: Users can access their own profile
CREATE POLICY "Users can access own profile" ON public.profiles
    FOR ALL USING (auth.uid() = id);

-- Simple policy: Allow admin@techpinik.com to access all profiles
CREATE POLICY "Admin email access" ON public.profiles
    FOR ALL USING (
        (auth.jwt() ->> 'email') = 'admin@techpinik.com'
    );

-- Allow authenticated users to insert profiles
CREATE POLICY "Authenticated users can insert" ON public.profiles
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Grant necessary permissions
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
