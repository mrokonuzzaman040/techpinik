-- Sync public.profiles with Supabase Auth.
-- Admin at signup: only via raw_app_meta_data.role = 'admin' (set by Admin API / service role), not user_metadata.

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  profile_role text;
BEGIN
  profile_role := CASE
    WHEN coalesce(new.raw_app_meta_data->>'role', '') = 'admin' THEN 'admin'
    ELSE 'user'
  END;

  INSERT INTO public.profiles (id, email, role)
  VALUES (new.id, coalesce(new.email, ''), profile_role);

  RETURN new;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
