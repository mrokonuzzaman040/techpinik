'use client'

import { ReactNode } from 'react'
import Navbar from './Navbar'
import Footer from './Footer'
import FloatingCartButton from '@/components/ui/floating-cart-button'

interface MainLayoutProps {
  children: ReactNode
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <FloatingCartButton />
    </div>
  )
}
