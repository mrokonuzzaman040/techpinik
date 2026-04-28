'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { CalendarDays, ChevronRight, Store } from 'lucide-react'
import AdminAuthWrapper from '@/components/admin/AdminAuthWrapper'
import AdminSidebar from '@/components/layout/AdminSidebar'
import { Button } from '@/components/ui/button'
import { Toaster } from 'sonner'

interface AdminShellProps {
  children: React.ReactNode
}

const segmentLabels: Record<string, string> = {
  analytics: 'Analytics',
  categories: 'Categories',
  customers: 'Customers',
  districts: 'Districts',
  general: 'General Settings',
  orders: 'Orders',
  products: 'Products',
  settings: 'Settings',
  slider: 'Slider Management',
}

const singularLabels: Record<string, string> = {
  categories: 'Category',
  customers: 'Customer',
  districts: 'District',
  orders: 'Order',
  products: 'Product',
  slider: 'Slider',
}

const formatSegment = (segment: string) => {
  return (
    segmentLabels[segment] ||
    segment
      .split('-')
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ')
  )
}

const singularize = (segment: string) => singularLabels[segment] || formatSegment(segment)

const isDynamicSegment = (segment: string) =>
  /^[0-9a-f-]{8,}$/i.test(segment) || /^\d+$/.test(segment)

const buildBreadcrumbs = (pathname: string) => {
  const segments = pathname.split('/').filter(Boolean).slice(1)

  if (segments.length === 0) {
    return ['Dashboard']
  }

  return segments.map((segment, index) => {
    if (segment === 'new') {
      return `Create ${singularize(segments[index - 1] || '')}`
    }

    if (segment === 'edit') {
      return `Edit ${singularize(segments[index - 1] || '')}`
    }

    if (isDynamicSegment(segment)) {
      return `${singularize(segments[index - 1] || '')} Details`
    }

    return formatSegment(segment)
  })
}

export default function AdminShell({ children }: AdminShellProps) {
  const pathname = usePathname()

  if (pathname === '/admin/login') {
    return <>{children}</>
  }

  const breadcrumbs = buildBreadcrumbs(pathname)
  const todayLabel = new Intl.DateTimeFormat('en-BD', {
    day: 'numeric',
    month: 'short',
    weekday: 'long',
  }).format(new Date())

  return (
    <AdminAuthWrapper>
      <div className="min-h-screen bg-slate-100 text-slate-900">
        <AdminSidebar />
        <Toaster richColors position="top-right" />

        <div className="min-h-screen lg:pl-64">
          <header className="sticky top-0 z-30 border-b border-slate-200 bg-white">
            <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
              <div className="min-w-0 pl-14 lg:pl-0">
                <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
                  <span>Admin</span>
                  {breadcrumbs.map((crumb, index) => (
                    <span key={`${crumb}-${index}`} className="flex items-center gap-2">
                      <ChevronRight className="h-4 w-4 text-slate-400" />
                      <span className="truncate">{crumb}</span>
                    </span>
                  ))}
                </div>
              </div>

              <div className="hidden items-center gap-4 sm:flex">
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <CalendarDays className="h-4 w-4" />
                  <span>{todayLabel}</span>
                </div>
                <Button
                  asChild
                  variant="outline"
                  className="border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                >
                  <Link href="/">
                    <Store className="mr-2 h-4 w-4" />
                    View Store
                  </Link>
                </Button>
              </div>
            </div>
          </header>

          <main className="px-4 py-6 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl [&_[data-slot=card]]:rounded-lg [&_[data-slot=card]]:border-slate-200 [&_[data-slot=card]]:bg-white [&_[data-slot=card]]:shadow-sm">
              {children}
            </div>
          </main>
        </div>
      </div>
    </AdminAuthWrapper>
  )
}
