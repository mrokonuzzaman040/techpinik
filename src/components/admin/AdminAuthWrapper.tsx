'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { authManager, AuthState } from '@/lib/auth'
import { Loader2 } from 'lucide-react'

interface AdminAuthWrapperProps {
  children: React.ReactNode
}

export default function AdminAuthWrapper({ children }: AdminAuthWrapperProps) {
  // Initialize state with current auth state to avoid synchronous setState in effect
  const [authState, setAuthState] = useState<AuthState>(() => authManager.getState())
  const router = useRouter()

  useEffect(() => {
    // Check initial state and redirect if needed
    const initialState = authManager.getState()
    if (!initialState.loading && (!initialState.user || !initialState.isAdmin)) {
      console.log('No user in session, redirecting to login')
      router.replace('/admin/login?error=unauthorized')
      return
    }

    // Subscribe to auth state changes
    const unsubscribe = authManager.subscribe((state) => {
      console.log('Auth state updated:', state)
      setAuthState(state)

      if (!state.loading) {
        if (!state.user || !state.isAdmin) {
          console.log('User not authenticated or not admin, redirecting to login')
          console.log('Auth state details:', {
            user: state.user,
            isAdmin: state.isAdmin,
            loading: state.loading,
          })
          router.replace('/admin/login?error=unauthorized')
        } else {
          console.log('User authenticated and is admin, allowing access')
        }
      }
    })

    return unsubscribe
  }, [router])

  if (authState.loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100 px-6">
        <div className="rounded-lg border border-slate-200 bg-white px-10 py-12 text-center shadow-sm">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-md bg-slate-100 text-slate-700">
            <Loader2 className="h-7 w-7 animate-spin" />
          </div>
          <p className="text-sm font-semibold text-slate-700">Checking Access</p>
          <p className="mt-3 text-sm text-slate-600">Verifying authentication...</p>
        </div>
      </div>
    )
  }

  if (!authState.user || !authState.isAdmin) {
    return null // Will redirect to login
  }

  return <>{children}</>
}
