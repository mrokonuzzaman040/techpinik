'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Package, MessageCircle, Grid3x3 } from 'lucide-react'

export default function MobileBottomNav() {
  const pathname = usePathname()

  const navItems = [
    {
      name: 'Home',
      href: '/',
      icon: Home,
    },
    {
      name: 'Categories',
      href: '/categories',
      icon: Grid3x3,
    },
    {
      name: 'All Products',
      href: '/products',
      icon: Package,
    },
    {
      name: 'Message',
      href: 'https://m.me/661656337036736', // Replace YOUR_PAGE_ID with your Facebook Page username or ID (e.g., https://m.me/yourpagename)
      icon: MessageCircle,
      external: true,
    }
  ]

  const isActive = (href: string, external?: boolean) => {
    if (external) return false
    if (href === '/') {
      return pathname === '/'
    }
    return pathname.startsWith(href)
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 lg:hidden safe-area-inset-bottom">
      <div className="flex items-center justify-around h-16 sm:h-18 px-2 py-1">
        {navItems.map((item) => {
          const Icon = item.icon
          const active = isActive(item.href, item.external)
          
          if (item.external) {
            return (
              <a
                key={item.name}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center justify-center flex-1 h-full transition-colors hover:bg-gray-50 active:bg-gray-100 rounded-t-lg gap-0.5"
                aria-label={item.name}
                title={item.name}
              >
                <Icon
                  className={`h-5 w-5 sm:h-6 sm:w-6 transition-colors ${
                    active ? 'text-yellow-600' : 'text-gray-500'
                  }`}
                />
                <span className={`text-[10px] sm:text-xs font-medium transition-colors ${
                  active ? 'text-yellow-600' : 'text-gray-500'
                }`}>
                  {item.name}
                </span>
              </a>
            )
          }

          return (
            <Link
              key={item.name}
              href={item.href}
              className="flex flex-col items-center justify-center flex-1 h-full transition-colors hover:bg-gray-50 active:bg-gray-100 rounded-t-lg gap-0.5"
              aria-label={item.name}
              title={item.name}
            >
              <Icon
                className={`h-5 w-5 sm:h-6 sm:w-6 transition-colors ${
                  active ? 'text-yellow-600' : 'text-gray-500'
                }`}
              />
              <span className={`text-[10px] sm:text-xs font-medium transition-colors ${
                active ? 'text-yellow-600' : 'text-gray-500'
              }`}>
                {item.name}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
