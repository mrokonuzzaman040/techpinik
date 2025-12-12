# Fix RLS Infinite Recursion Error

## Problem

You're getting this error when accessing admin pages:

```
{
    "code": "42P17",
    "details": null,
    "hint": null,
    "message": "infinite recursion detected in policy for relation \"profiles\""
}
```

## Root Cause

The RLS (Row Level Security) policies on the `profiles` table are referencing the `profiles` table itself, creating infinite recursion.

## Quick Fix

### Option 1: Run the SQL Script (Recommended)

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Copy and paste the contents of `scripts/fix-all-rls-policies.sql`
4. Execute the script

### Option 2: Manual Fix

If you prefer to fix manually, run these commands in your Supabase SQL editor:

```sql
-- Drop problematic policies
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.profiles;

-- Disable and re-enable RLS
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create simple, non-recursive policies
CREATE POLICY "Users can access own profile" ON public.profiles
    FOR ALL USING (auth.uid() = id);

CREATE POLICY "Admin email access" ON public.profiles
    FOR ALL USING ((auth.jwt() ->> 'email') = 'admin@techpinik.com');
```

## What the Fix Does

1. **Removes recursive policies** - Eliminates policies that reference the profiles table from within profiles table policies
2. **Creates simple policies** - Uses email-based admin detection instead of role-based detection
3. **Fixes all tables** - Updates RLS policies for products, categories, orders, etc.
4. **Maintains security** - Still protects data while avoiding recursion

## After the Fix

Once you run the fix:

1. The admin login should work properly
2. The admin products page should load without errors
3. All admin functionality should be accessible

## Files Created

- `scripts/fix-all-rls-policies.sql` - Comprehensive fix for all RLS policies
- `scripts/fix-profiles-rls-recursion.sql` - Quick fix for just the profiles table
- `supabase/migrations/010_fix_profiles_rls_recursion.sql` - Migration for the fix
- `supabase/migrations/011_simple_profiles_rls.sql` - Alternative migration approach

## Verification

After running the fix, you should be able to:

1. Access `http://localhost:3000/admin/login`
2. Log in with `admin@techpinik.com` / `1234567890`
3. Navigate to `http://localhost:3000/admin/products` without errors
4. See the products list load successfully
