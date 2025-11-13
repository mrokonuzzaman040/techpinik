'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { authManager, AuthState } from '@/lib/auth'
import { Loader2 } from 'lucide-react'

interface AdminAuthWrapperProps {
  children: React.ReactNode
}

export default function AdminAuthWrapper({ children }: AdminAuthWrapperProps) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAdmin: false,
    loading: true
  })
  const router = useRouter()

  useEffect(() => {
    // Subscribe to auth state changes
    const unsubscribe = authManager.subscribe((state) => {
      console.log('Auth state updated:', state)
      setAuthState(state)
      
      if (!state.loading) {
        if (!state.user || !state.isAdmin) {
          console.log('User not authenticated or not admin, redirecting to login')
          console.log('Auth state details:', { user: state.user, isAdmin: state.isAdmin, loading: state.loading })
          router.push('/admin/login?error=unauthorized')
        } else {
          console.log('User authenticated and is admin, allowing access')
        }
      }
    })

    // Get initial state
    setAuthState(authManager.getState())

    return unsubscribe
  }, [router])

  if (authState.loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Verifying authentication...</p>
        </div>
      </div>
    )
  }

  if (!authState.user || !authState.isAdmin) {
    return null // Will redirect to login
  }

  return <>{children}</>
}