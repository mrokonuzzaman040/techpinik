import { cookies } from 'next/headers'
import { createServerClient as createSSRClient } from '@supabase/ssr'
import { createServerClient } from './supabase'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

/**
 * Creates a Supabase client for use in Server Components and API Routes.
 * This client is aware of the user's session stored in cookies.
 */
export async function createSSRServerClient() {
  const cookieStore = await cookies()

  return createSSRClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        } catch {
          // The `setAll` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing
          // user sessions.
        }
      },
    },
  })
}

/**
 * Helper to check if the current requester is an admin in Server Components or API Routes.
 */
export async function isAdmin() {
  try {
    const supabase = await createSSRServerClient()
    
    // Get the user from the session
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      console.log('No user or error getting user in isAdmin:', userError?.message)
      return false
    }

    // Check JWT app_metadata for role
    if (user.app_metadata?.role === 'admin') return true

    // Fallback: Check profiles table using service role (bypass RLS for the check)
    const adminClient = createServerClient()
    const { data: profile, error: profileError } = await adminClient
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profileError) {
      console.log('Error fetching profile in isAdmin:', profileError.message)
    }

    return profile?.role === 'admin'
  } catch (error) {
    console.error('Error checking admin status:', error)
    return false
  }
}
