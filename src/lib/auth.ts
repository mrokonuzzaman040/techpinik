import { createClient } from './supabase'
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

  private getSupabaseClient() {
    return createClient()
  }

  private async initializeAuth() {
    try {
      console.log('Initializing authentication...')
      const supabase = this.getSupabaseClient()

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
      const supabase = this.getSupabaseClient()

      let isAdmin = false

      try {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single()

        const profileSaysAdmin = !profileError && profile?.role === 'admin'
        const jwtSaysAdmin = user.app_metadata?.role === 'admin'
        isAdmin = profileSaysAdmin || jwtSaysAdmin

        if (profileError && jwtSaysAdmin && user.email) {
          await supabase.from('profiles').upsert({
            id: user.id,
            email: user.email,
            role: 'admin',
            updated_at: new Date().toISOString(),
          })
        }
      } catch (error) {
        console.warn('Profiles admin check failed:', error)
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
      const supabase = this.getSupabaseClient()

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
      const supabase = this.getSupabaseClient()
      await supabase.auth.signOut()
      this.updateState({ user: null, isAdmin: false, loading: false })
    } catch (error) {
      console.error('Sign out error:', error)
    }
  }
}

// Export singleton instance
export const authManager = AuthManager.getInstance()
