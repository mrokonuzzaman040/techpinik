-- Setup Admin User Script
-- Run this script in your Supabase SQL editor to set up the admin user

-- 1. First, create the profiles table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'admin')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Enable RLS on profiles table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 3. Create basic RLS policies for profiles
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.profiles;
CREATE POLICY "Enable insert for authenticated users only" ON public.profiles
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- 4. Grant permissions
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;

-- 5. Create the admin user profile
-- This will work if the user already exists in auth.users
UPDATE profiles 
SET role = 'admin', updated_at = now()
WHERE email = 'admin@techpinik.com';

-- If the profile doesn't exist, insert it
INSERT INTO profiles (id, email, role, created_at, updated_at)
SELECT 
    u.id,
    u.email,
    'admin',
    now(),
    now()
FROM auth.users u
WHERE u.email = 'admin@techpinik.com'
  AND NOT EXISTS (
    SELECT 1 FROM profiles p WHERE p.email = 'admin@techpinik.com'
  );

-- 6. Verify the admin user was created
SELECT * FROM profiles WHERE email = 'admin@techpinik.com';
