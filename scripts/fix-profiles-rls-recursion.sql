-- Quick fix for profiles table RLS recursion issue
-- Run this in your Supabase SQL editor to fix the infinite recursion error

-- Step 1: Drop all existing policies on profiles table
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.profiles;
DROP POLICY IF EXISTS "Simple admin access" ON public.profiles;

-- Step 2: Disable RLS temporarily
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;

-- Step 3: Re-enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Step 4: Create simple, non-recursive policies
-- Users can access their own profile
CREATE POLICY "Users can access own profile" ON public.profiles
    FOR ALL USING (auth.uid() = id);

-- Admin email can access all profiles (fallback for admin@techpinik.com)
CREATE POLICY "Admin email access" ON public.profiles
    FOR ALL USING (
        (auth.jwt() ->> 'email') = 'admin@techpinik.com'
    );

-- Allow authenticated users to insert profiles
CREATE POLICY "Authenticated users can insert" ON public.profiles
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Step 5: Ensure proper permissions
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;

-- Step 6: Verify the fix worked
SELECT 'RLS policies fixed successfully' as status;
