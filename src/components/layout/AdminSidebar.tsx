'use client'

import { useState } from 'react'
import Link from 'next/link'
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
  Image,
  MapPin,
  ChevronDown,
  ChevronRight,
  Menu,
  X,
  LogOut
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
    icon: LayoutDashboard
  },
  {
    title: 'Products',
    icon: Package,
    children: [
      { title: 'All Products', href: '/admin/products', icon: Package },
      { title: 'Add Product', href: '/admin/products/new', icon: Package },
    ]
  },
  {
    title: 'Categories',
    icon: FolderOpen,
    children: [
      { title: 'All Categories', href: '/admin/categories', icon: FolderOpen },
      { title: 'Add Category', href: '/admin/categories/new', icon: FolderOpen },
    ]
  },
  {
    title: 'Orders',
    href: '/admin/orders',
    icon: ShoppingCart
  },
  {
    title: 'Customers',
    href: '/admin/customers',
    icon: Users
  },
  {
    title: 'Analytics',
    href: '/admin/analytics',
    icon: BarChart3
  },
  {
    title: 'Settings',
    icon: Settings,
    children: [
      { title: 'Slider Management', href: '/admin/settings/slider', icon: Image },
      { title: 'Districts', href: '/admin/settings/districts', icon: MapPin },
      { title: 'General Settings', href: '/admin/settings/general', icon: Settings },
    ]
  }
]

interface AdminSidebarProps {
  className?: string
}

export default function AdminSidebar({ className }: AdminSidebarProps) {
  const [expandedItems, setExpandedItems] = useState<string[]>(['Products', 'Categories', 'Settings'])
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  const toggleExpanded = (title: string) => {
    setExpandedItems(prev => 
      prev.includes(title) 
        ? prev.filter(item => item !== title)
        : [...prev, title]
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
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <Link href="/admin" className="flex items-center space-x-2">
          <div className="bg-yellow-600 text-white px-3 py-2 rounded-lg font-bold text-lg">
            TechPinik
          </div>
          <span className="text-sm text-gray-500">Admin</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {sidebarItems.map((item) => (
          <div key={item.title}>
            {item.children ? (
              <div>
                <button
                  onClick={() => toggleExpanded(item.title)}
                  className={cn(
                    "w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                    "text-gray-700 hover:bg-gray-100"
                  )}
                >
                  <div className="flex items-center space-x-3">
                    <item.icon className="h-5 w-5" />
                    <span>{item.title}</span>
                  </div>
                  {expandedItems.includes(item.title) ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </button>
                
                {expandedItems.includes(item.title) && (
                  <div className="ml-6 mt-2 space-y-1">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href!}
                        className={cn(
                          "flex items-center space-x-3 px-3 py-2 text-sm rounded-lg transition-colors",
                          isActive(child.href!)
                            ? "bg-yellow-100 text-yellow-700 font-medium"
                            : "text-gray-600 hover:bg-gray-100"
                        )}
                        onClick={() => setIsMobileOpen(false)}
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
                className={cn(
                  "flex items-center space-x-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                  isActive(item.href!)
                    ? "bg-yellow-100 text-yellow-700"
                    : "text-gray-700 hover:bg-gray-100"
                )}
                onClick={() => setIsMobileOpen(false)}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.title}</span>
              </Link>
            )}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 space-y-2">
        <Link
          href="/"
          className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-900"
        >
          <span>← Back to Store</span>
        </Link>
        <Button
          onClick={handleLogout}
          variant="ghost"
          className="w-full justify-start text-sm text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </Button>
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 lg:hidden bg-white shadow-md"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        {isMobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed top-0 left-0 z-40 h-full w-64 bg-white border-r border-gray-200 transition-transform duration-300 ease-in-out lg:translate-x-0",
        isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        className
      )}>
        {sidebarContent}
      </aside>

      {/* Desktop Sidebar Spacer */}
      <div className="hidden lg:block w-64 shrink-0" />
    </>
  )
}