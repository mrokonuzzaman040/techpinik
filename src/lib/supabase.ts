import { createClient as createSupabaseClient, type SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

const browserAuthOptions = {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
} as const

const serverAuthOptions = {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
} as const

// One client for the browser — avoids multiple GoTrueClient instances (same storage key).
export const supabase: SupabaseClient = createSupabaseClient(
  supabaseUrl,
  supabaseAnonKey,
  browserAuthOptions
)

/**
 * Browser: returns the shared `supabase` instance.
 * Server (API routes, RSC): returns a new client with no session persistence (safe per request).
 */
export const createClient = (): SupabaseClient => {
  if (typeof window === 'undefined') {
    return createSupabaseClient(supabaseUrl, supabaseAnonKey, serverAuthOptions)
  }
  return supabase
}

// For server-side operations that require elevated privileges
export const createServerClient = () => {
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
  if (!supabaseServiceKey) {
    throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY environment variable')
  }
  return createSupabaseClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  })
}
