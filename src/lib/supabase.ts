import { createBrowserClient, createServerClient as createSSRClient } from '@supabase/ssr'
import { createClient as createSupabaseClient, type SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabaseServiceKey = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

// Client for the browser
export const supabase = typeof window !== 'undefined' 
  ? createBrowserClient(supabaseUrl, supabaseAnonKey)
  : null as unknown as SupabaseClient // Should not be used on server, use createClient() instead

/**
 * Server (API routes, RSC): returns a new client.
 * For Client Components: returns the browser client.
 */
export const createClient = () => {
  if (typeof window === 'undefined') {
    // This is a minimal server client without cookie handling.
    // For cookie handling, use createSSRServerClient from supabase-server.ts
    return createSupabaseClient(supabaseUrl, supabaseAnonKey, {
        auth: {
            persistSession: false,
            autoRefreshToken: false,
        }
    })
  }
  return supabase
}

/**
 * For server-side operations that require elevated privileges.
 * WARNING: This client bypasses RLS. Use ONLY in server-side contexts after proper auth checks.
 */
export const createServerClient = () => {
  if (!supabaseServiceKey) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY environment variable')
  }
  return createSupabaseClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  })
}
