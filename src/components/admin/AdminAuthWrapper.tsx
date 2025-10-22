'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Loader2 } from 'lucide-react'

interface AdminAuthWrapperProps {
  children: React.ReactNode
}

export default function AdminAuthWrapper({ children }: AdminAuthWrapperProps) {
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      // Get current session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      
      if (sessionError || !session?.user) {
        router.push('/admin/login')
        return
      }

      // Check if user has admin role
      let isAdmin = false
      
      try {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single()

        if (profileError) {
          // If no profile exists, check user metadata
          isAdmin = session.user.user_metadata?.role === 'admin'
          
          // Fallback: Check if this is the specific admin email
          if (!isAdmin && session.user.email === 'admin@techpinik.com') {
            isAdmin = true
          }
        } else {
          isAdmin = profile.role === 'admin'
        }
      } catch (error) {
        // If profiles table doesn't exist, fallback to email check
        console.warn('Profiles table not accessible, using fallback authentication')
        isAdmin = session.user.email === 'admin@techpinik.com'
      }

      if (!isAdmin) {
        router.push('/admin/login?error=unauthorized')
        return
      }

      setIsAuthenticated(true)
    } catch (error) {
      console.error('Auth check error:', error)
      router.push('/admin/login')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Verifying authentication...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null // Will redirect to login
  }

  return <>{children}</>
}