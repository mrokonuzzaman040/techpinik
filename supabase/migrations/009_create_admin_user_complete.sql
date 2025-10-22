-- Complete admin user setup migration
-- This migration ensures the admin user exists and has proper privileges

-- First, create the admin user in auth.users if it doesn't exist
-- Note: This requires the user to be created through Supabase Auth UI first
-- or through the Supabase dashboard

-- Create a function to handle new user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role)
  VALUES (new.id, new.email, 'user');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for automatic profile creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Update the profile for admin@techpinik.com to have admin role
-- This will work if the user already exists in auth.users
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

-- Create a function to check if a user is admin
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = user_id AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission on the function
GRANT EXECUTE ON FUNCTION public.is_admin(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_admin(UUID) TO service_role;
