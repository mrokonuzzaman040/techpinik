-- Migration: Set admin role for admin@techpinik.com user
-- This migration ensures the admin user has proper admin privileges

-- Update the profile for admin@techpinik.com to have admin role
UPDATE profiles 
SET role = 'admin', updated_at = now()
WHERE email = 'admin@techpinik.com';

-- If the profile doesn't exist, we need to insert it
-- First get the user ID from auth.users
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