'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase'
import {
  LayoutDashboard,
  Package,
  FolderOpen,
  ShoppingCart,
  Settings,
  Users,
  BarChart3,
  Image as ImageIcon,
  MapPin,
  ChevronDown,
  ChevronRight,
  Menu,
  X,
  LogOut,
  Store,
} from 'lucide-react'

interface SidebarItem {
  title: string
  href?: string
  icon: React.ComponentType<{ className?: string }>
  children?: SidebarItem[]
}

const sidebarItems: SidebarItem[] = [
  {
    title: 'Dashboard',
    href: '/admin',
    icon: LayoutDashboard,
  },
  {
    title: 'Products',
    icon: Package,
    children: [
      { title: 'All Products', href: '/admin/products', icon: Package },
      { title: 'Add Product', href: '/admin/products/new', icon: Package },
    ],
  },
  {
    title: 'Categories',
    icon: FolderOpen,
    children: [
      { title: 'All Categories', href: '/admin/categories', icon: FolderOpen },
      { title: 'Add Category', href: '/admin/categories/new', icon: FolderOpen },
    ],
  },
  {
    title: 'Orders',
    href: '/admin/orders',
    icon: ShoppingCart,
  },
  {
    title: 'Customers',
    href: '/admin/customers',
    icon: Users,
  },
  {
    title: 'Analytics',
    href: '/admin/analytics',
    icon: BarChart3,
  },
  {
    title: 'Settings',
    icon: Settings,
    children: [
      { title: 'Slider Management', href: '/admin/settings/slider', icon: ImageIcon },
      { title: 'Districts', href: '/admin/settings/districts', icon: MapPin },
      { title: 'General Settings', href: '/admin/settings/general', icon: Settings },
    ],
  },
]

interface AdminSidebarProps {
  className?: string
}

export default function AdminSidebar({ className }: AdminSidebarProps) {
  const [expandedItems, setExpandedItems] = useState<string[]>([
    'Products',
    'Categories',
    'Settings',
  ])
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  const visibleExpandedItems = Array.from(
    new Set([
      ...expandedItems,
      ...sidebarItems
        .filter((item) =>
          item.children?.some((child) => child.href && pathname.startsWith(child.href))
        )
        .map((item) => item.title),
    ])
  )

  const toggleExpanded = (title: string) => {
    setExpandedItems((prev) =>
      prev.includes(title) ? prev.filter((item) => item !== title) : [...prev, title]
    )
  }

  const isActive = (href: string) => {
    if (href === '/admin') {
      return pathname === '/admin'
    }
    return pathname.startsWith(href)
  }

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
      router.push('/admin/login')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const sidebarContent = (
    <div className="flex h-full flex-col overflow-hidden bg-slate-900 text-slate-100">
      <div className="border-b border-slate-800 px-5 py-5">
        <Link href="/admin" className="block" onClick={() => setIsMobileOpen(false)}>
          <Image
            src="/logo.png"
            alt="TechPinik Logo"
            width={112}
            height={40}
            className="h-9 w-auto object-contain"
            priority
          />
          <p className="mt-3 text-xs font-medium uppercase tracking-[0.18em] text-slate-400">
            Admin Panel
          </p>
        </Link>
      </div>

      <nav className="scrollbar-hide flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {sidebarItems.map((item) => (
          <div key={item.title}>
            {item.children ? (
              <div>
                <button
                  onClick={() => toggleExpanded(item.title)}
                  className={cn(
                    'flex w-full items-center justify-between rounded-md px-3 py-2.5 text-sm font-medium transition-colors',
                    'text-slate-300 hover:bg-slate-800 hover:text-white',
                    visibleExpandedItems.includes(item.title) && 'bg-slate-800 text-white'
                  )}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </div>
                  {visibleExpandedItems.includes(item.title) ? (
                    <ChevronDown className="h-4 w-4 transition-transform" />
                  ) : (
                    <ChevronRight className="h-4 w-4 transition-transform" />
                  )}
                </button>

                {visibleExpandedItems.includes(item.title) && (
                  <div className="ml-4 mt-1 space-y-1 border-l border-slate-800 pl-4">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href!}
                        onClick={() => setIsMobileOpen(false)}
                        className={cn(
                          'flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors',
                          isActive(child.href!)
                            ? 'bg-slate-800 text-white'
                            : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                        )}
                      >
                        <child.icon className="h-4 w-4" />
                        <span>{child.title}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Link
                href={item.href!}
                onClick={() => setIsMobileOpen(false)}
                className={cn(
                  'flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors',
                  isActive(item.href!)
                    ? 'bg-slate-800 text-white'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                )}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.title}</span>
              </Link>
            )}
          </div>
        ))}
      </nav>

      <div className="space-y-2 border-t border-slate-800 p-3">
        <Link
          href="/"
          onClick={() => setIsMobileOpen(false)}
          className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm text-slate-300 transition-colors hover:bg-slate-800 hover:text-white"
        >
          <Store className="h-4 w-4" />
          <span>Back to Store</span>
        </Link>
        <Button
          onClick={handleLogout}
          variant="ghost"
          className="w-full justify-start rounded-md px-3 py-2.5 text-sm text-slate-300 hover:bg-slate-800 hover:text-white"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </Button>
      </div>
    </div>
  )

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="fixed left-4 top-4 z-50 border border-slate-300 bg-white text-slate-900 shadow-sm lg:hidden"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        {isMobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <aside
        className={cn(
          'fixed left-0 top-0 z-40 h-full w-64 border-r border-slate-800 shadow-lg transition-transform duration-300 ease-in-out lg:translate-x-0',
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
          className
        )}
      >
        {sidebarContent}
      </aside>
    </>
  )
}
