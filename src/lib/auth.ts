import { supabase } from './supabase'
import { User } from '@supabase/supabase-js'

export interface AuthState {
  user: User | null
  isAdmin: boolean
  loading: boolean
}

export class AuthManager {
  private static instance: AuthManager
  private authState: AuthState = {
    user: null,
    isAdmin: false,
    loading: true,
  }
  private listeners: ((state: AuthState) => void)[] = []

  private constructor() {
    this.initializeAuth()
  }

  public static getInstance(): AuthManager {
    if (!AuthManager.instance) {
      AuthManager.instance = new AuthManager()
    }
    return AuthManager.instance
  }

  private async initializeAuth() {
    try {
      console.log('Initializing authentication...')

      // Get initial session
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession()

      if (error) {
        console.error('Session error:', error)
        this.updateState({ user: null, isAdmin: false, loading: false })
        return
      }

      if (session?.user) {
        console.log('User found in session:', session.user.email)
        await this.checkAdminStatus(session.user)
      } else {
        console.log('No user in session')
        this.updateState({ user: null, isAdmin: false, loading: false })
      }

      // Listen for auth changes
      supabase.auth.onAuthStateChange(async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email)

        if (session?.user) {
          await this.checkAdminStatus(session.user)
        } else {
          this.updateState({ user: null, isAdmin: false, loading: false })
        }
      })
    } catch (error) {
      console.error('Auth initialization error:', error)
      this.updateState({ user: null, isAdmin: false, loading: false })
    }
  }

  private async checkAdminStatus(user: User) {
    try {
      console.log('Checking admin status for user:', user.id)

      let isAdmin = false

      try {
        // Check profiles table
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single()

        if (profileError) {
          console.log('Profile not found, checking metadata and email')
          // Check user metadata
          isAdmin = user.user_metadata?.role === 'admin'

          // Fallback: Check if this is the specific admin email
          if (!isAdmin && user.email === 'admin@techpinik.com') {
            isAdmin = true
            console.log('Admin access granted via email fallback')

            // Try to create the profile entry
            try {
              await supabase.from('profiles').upsert({
                id: user.id,
                email: user.email,
                role: 'admin',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              })
              console.log('Admin profile created')
            } catch (upsertError) {
              console.warn('Failed to create admin profile:', upsertError)
            }
          }
        } else {
          isAdmin = profile.role === 'admin'
          console.log('Admin role from profile:', isAdmin)
        }
      } catch (error) {
        console.warn('Profiles table not accessible, using fallback authentication:', error)
        isAdmin = user.email === 'admin@techpinik.com'
        console.log('Fallback admin check result:', isAdmin)
      }

      console.log('Final admin check result:', isAdmin)
      this.updateState({ user, isAdmin, loading: false })
    } catch (error) {
      console.error('Admin status check error:', error)
      this.updateState({ user, isAdmin: false, loading: false })
    }
  }

  private updateState(newState: Partial<AuthState>) {
    this.authState = { ...this.authState, ...newState }
    this.listeners.forEach((listener) => listener(this.authState))
  }

  public getState(): AuthState {
    return this.authState
  }

  public subscribe(listener: (state: AuthState) => void): () => void {
    this.listeners.push(listener)
    // Return unsubscribe function
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener)
    }
  }

  public async signIn(email: string, password: string) {
    try {
      console.log('Attempting sign in for:', email)

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        console.error('Sign in error:', error)
        throw error
      }

      if (!data.user) {
        throw new Error('No user data returned')
      }

      console.log('Sign in successful for:', data.user.email)

      // Immediately check admin status after successful sign in
      await this.checkAdminStatus(data.user)

      return data
    } catch (error) {
      console.error('Sign in failed:', error)
      throw error
    }
  }

  public async signOut() {
    try {
      await supabase.auth.signOut()
      this.updateState({ user: null, isAdmin: false, loading: false })
    } catch (error) {
      console.error('Sign out error:', error)
    }
  }
}

// Export singleton instance
export const authManager = AuthManager.getInstance()
