'use client'

import { ReactNode } from 'react'
import Navbar from './Navbar'
import Footer from './Footer'
import FloatingCartButton from '@/components/ui/floating-cart-button'
import FacebookMessengerButton from '@/components/ui/facebook-messenger-button'

interface MainLayoutProps {
  children: ReactNode
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
        <FloatingCartButton />
        <FacebookMessengerButton />
      </div>
    </div>
  )
}
