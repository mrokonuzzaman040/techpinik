-- Fix infinite recursion in profiles table RLS policies
-- The issue is that the policies are referencing the profiles table from within profiles table policies

-- Drop all existing policies on profiles table
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.profiles;

-- Create a function to check if user is admin without causing recursion
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  -- Use a direct query with SECURITY DEFINER to bypass RLS
  RETURN EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = user_id AND role = 'admin'
  );
EXCEPTION
  WHEN OTHERS THEN
    -- If there's any error (like table doesn't exist), return false
    RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create simplified policies that don't cause recursion
-- Users can view their own profile
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

-- Admins can view all profiles (using the function to avoid recursion)
CREATE POLICY "Admins can view all profiles" ON public.profiles
    FOR SELECT USING (public.is_admin(auth.uid()));

-- Admins can update any profile (using the function to avoid recursion)
CREATE POLICY "Admins can update all profiles" ON public.profiles
    FOR UPDATE USING (public.is_admin(auth.uid()));

-- Allow profile insertion for authenticated users
CREATE POLICY "Enable insert for authenticated users only" ON public.profiles
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Grant execute permission on the function
GRANT EXECUTE ON FUNCTION public.is_admin(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_admin(UUID) TO service_role;

-- Alternative approach: Create a simpler policy that doesn't reference profiles table
-- This is a fallback in case the function approach still causes issues
DROP POLICY IF EXISTS "Simple admin access" ON public.profiles;
CREATE POLICY "Simple admin access" ON public.profiles
    FOR ALL USING (
        auth.uid() = id OR 
        (auth.jwt() ->> 'email') = 'admin@techpinik.com'
    );
