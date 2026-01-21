'use client'

import { ReactNode } from 'react'
import Navbar from './Navbar'
import Footer from './Footer'
import MobileBottomNav from './MobileBottomNav'
import FloatingCartButton from '@/components/ui/floating-cart-button'
import FacebookMessengerButton from '@/components/ui/facebook-messenger-button'

interface MainLayoutProps {
  children: ReactNode
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pb-16 lg:pb-0">{children}</main>
      <Footer />
      <MobileBottomNav />
      <div className="fixed bottom-20 right-4 lg:bottom-6 lg:right-6 z-40 flex flex-col gap-3">
        <FloatingCartButton />
        <div className="hidden lg:block">
          <FacebookMessengerButton />
        </div>
      </div>
    </div>
  )
}
