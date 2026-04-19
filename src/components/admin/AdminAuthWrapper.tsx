'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { authManager, AuthState } from '@/lib/auth'
import { Loader2 } from 'lucide-react'

interface AdminAuthWrapperProps {
  children: React.ReactNode
}

function AccessCheckingShell() {
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

export default function AdminAuthWrapper({ children }: AdminAuthWrapperProps) {
  // Defer reading auth until after mount so server HTML matches first client paint (avoids hydration mismatch).
  const [mounted, setMounted] = useState(false)
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAdmin: false,
    loading: true,
  })
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    const initialState = authManager.getState()
    setAuthState(initialState)
    if (!initialState.loading && (!initialState.user || !initialState.isAdmin)) {
      router.replace('/admin/login?error=unauthorized')
      return
    }

    const unsubscribe = authManager.subscribe((state) => {
      setAuthState(state)

      if (!state.loading) {
        if (!state.user || !state.isAdmin) {
          router.replace('/admin/login?error=unauthorized')
        } else {
          console.log('User authenticated and is admin, allowing access')
        }
      }
    })

    return unsubscribe
  }, [mounted, router])

  if (!mounted) {
    return <AccessCheckingShell />
  }

  if (authState.loading) {
    return <AccessCheckingShell />
  }

  if (!authState.user || !authState.isAdmin) {
    return null
  }

  return <>{children}</>
}
