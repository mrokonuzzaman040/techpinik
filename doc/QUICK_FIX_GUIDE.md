# 🚨 URGENT: Fix RLS Infinite Recursion Error

## The Problem
Your admin products page is showing "Products (0)" because of RLS infinite recursion errors. The console shows:
```
infinite recursion detected in policy for relation "profiles"
```

## The Solution (5 minutes)

### Step 1: Open Supabase Dashboard
1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**

### Step 2: Run the Fix Script
1. Copy the entire contents of `scripts/COMPLETE_RLS_FIX.sql`
2. Paste it into the SQL Editor
3. Click **Run** to execute

### Step 3: Verify the Fix
1. Go back to `http://localhost:3000/admin/products`
2. Refresh the page
3. You should see products loading (or at least no more errors)

## What the Script Does
- ✅ Removes all recursive RLS policies
- ✅ Creates simple, non-recursive policies
- ✅ Uses email-based admin detection instead of role-based
- ✅ Fixes all tables: profiles, products, categories, orders, etc.

## Alternative: Quick Manual Fix
If you prefer to do it manually, run these 3 commands in SQL Editor:

```sql
-- 1. Drop all problematic policies
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.profiles;

-- 2. Disable and re-enable RLS
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 3. Create simple policies
CREATE POLICY "Users can access own profile" ON public.profiles
    FOR ALL USING (auth.uid() = id);
CREATE POLICY "Admin email access" ON public.profiles
    FOR ALL USING ((auth.jwt() ->> 'email') = 'admin@techpinik.com');
```

## After the Fix
- ✅ Admin login works
- ✅ Admin products page loads
- ✅ No more infinite recursion errors
- ✅ All admin functionality accessible

## Need Help?
If you're still having issues after running the script, check:
1. Make sure you're logged in as `admin@techpinik.com`
2. Check the browser console for any remaining errors
3. Verify the RLS policies were applied in Supabase dashboard
