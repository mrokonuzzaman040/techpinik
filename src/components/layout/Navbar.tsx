'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Search, Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { createClient } from '@/lib/supabase'
import { Category } from '@/types'

export default function Navbar() {
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('is_active', true)
        .order('name')

      if (error) throw error
      setCategories(data || [])
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm border-b">
      {/* Main Navigation */}
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center gap-4">
          {/* Mobile Menu Button - Before Logo */}
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80 sm:w-96 p-0 overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 z-10 bg-white border-b px-6 py-4">
                  <div className="flex items-center justify-between">
                    <Link href="/" onClick={() => setIsMenuOpen(false)}>
                      <Image
                        src="/logo.png"
                        alt="TechPinik Logo"
                        width={120}
                        height={43}
                        className="h-10 w-auto object-contain"
                        priority
                      />
                    </Link>
                  </div>
                </div>

                {/* Navigation Content */}
                <div className="flex flex-col px-4 py-6 space-y-1">
                  {/* Home Link */}
                  <Link
                    href="/"
                    className="flex items-center space-x-3 px-4 py-3 rounded-lg text-base font-medium text-gray-700 hover:bg-yellow-50 hover:text-yellow-600 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span>🏠</span>
                    <span>Home</span>
                  </Link>

                  {/* Categories Section */}
                  <div className="pt-2">
                    <div className="px-4 py-2 mb-2">
                      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Categories
                      </h3>
                    </div>
                    <div className="space-y-1">
                      {categories.length > 0 ? (
                        categories.map((category) => (
                          <Link
                            key={category.id}
                            href={`/products?category=${category.id}`}
                            className="flex items-center space-x-3 px-4 py-3 rounded-lg text-sm text-gray-700 hover:bg-yellow-50 hover:text-yellow-600 transition-colors group"
                            onClick={() => setIsMenuOpen(false)}
                          >
                            {category.image_url ? (
                              <img
                                src={category.image_url}
                                alt={category.name}
                                className="w-8 h-8 object-cover rounded-md"
                              />
                            ) : (
                              <div className="w-8 h-8 rounded-md bg-linear-to-br from-yellow-100 to-yellow-200 flex items-center justify-center">
                                <span className="text-yellow-600 text-xs">📦</span>
                              </div>
                            )}
                            <span className="flex-1">{category.name}</span>
                            <span className="text-gray-400 group-hover:text-yellow-600">→</span>
                          </Link>
                        ))
                      ) : (
                        <div className="px-4 py-3 text-sm text-gray-500">
                          No categories available
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="my-2 border-t border-gray-200"></div>

                  {/* Other Links */}
                  <Link
                    href="/products"
                    className="flex items-center space-x-3 px-4 py-3 rounded-lg text-base font-medium text-gray-700 hover:bg-yellow-50 hover:text-yellow-600 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span>🛍️</span>
                    <span>All Products</span>
                  </Link>

                  <Link
                    href="/about"
                    className="flex items-center space-x-3 px-4 py-3 rounded-lg text-base font-medium text-gray-700 hover:bg-yellow-50 hover:text-yellow-600 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span>ℹ️</span>
                    <span>About Us</span>
                  </Link>

                  <Link
                    href="/contact"
                    className="flex items-center space-x-3 px-4 py-3 rounded-lg text-base font-medium text-gray-700 hover:bg-yellow-50 hover:text-yellow-600 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span>📧</span>
                    <span>Contact</span>
                  </Link>

                  <Link
                    href="/faq"
                    className="flex items-center space-x-3 px-4 py-3 rounded-lg text-base font-medium text-gray-700 hover:bg-yellow-50 hover:text-yellow-600 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span>❓</span>
                    <span>FAQ</span>
                  </Link>

                  {/* Divider */}
                  <div className="my-2 border-t border-gray-200"></div>

                  {/* Quick Links */}
                  <div className="pt-2">
                    <div className="px-4 py-2 mb-2">
                      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Quick Links
                      </h3>
                    </div>
                    <Link
                      href="/shipping"
                      className="flex items-center space-x-3 px-4 py-3 rounded-lg text-sm text-gray-700 hover:bg-yellow-50 hover:text-yellow-600 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <span>🚚</span>
                      <span>Shipping Info</span>
                    </Link>
                    <Link
                      href="/returns"
                      className="flex items-center space-x-3 px-4 py-3 rounded-lg text-sm text-gray-700 hover:bg-yellow-50 hover:text-yellow-600 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <span>↩️</span>
                      <span>Returns</span>
                    </Link>
                    <Link
                      href="/warranty"
                      className="flex items-center space-x-3 px-4 py-3 rounded-lg text-sm text-gray-700 hover:bg-yellow-50 hover:text-yellow-600 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <span>🛡️</span>
                      <span>Warranty</span>
                    </Link>
                  </div>
                </div>

                {/* Footer */}
                <div className="sticky bottom-0 bg-gray-50 border-t px-4 py-4 mt-auto">
                  <div className="flex items-center justify-center space-x-4 text-sm text-gray-600">
                    <span>© 2024 TechPinik</span>
                  </div>
                </div>
            </SheetContent>
          </Sheet>

          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src="/logo.png"
              alt="TechPinik Logo"
              width={140}
              height={50}
              className="h-12 w-auto object-contain"
              priority
            />
          </Link>

          {/* Short Search Input - After Logo */}
          <div className="flex-1 max-w-xs">
            <div className="relative">
              <input
                type="text"
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-sm"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    const query = (e.target as HTMLInputElement).value
                    if (query.trim()) {
                      router.push(`/search?q=${encodeURIComponent(query)}`)
                    }
                  }
                }}
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-6 ml-auto">
            <Link href="/" className="text-gray-700 hover:text-yellow-600 font-medium">
              Home
            </Link>
            <div className="relative group">
              <button className="text-gray-700 hover:text-yellow-600 font-medium flex items-center">
                Categories
              </button>
              <div className="absolute top-full left-0 mt-2 w-64 bg-white shadow-lg rounded-lg border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="p-4 grid grid-cols-1 gap-2">
                  {categories.map((category) => (
                    <Link
                      key={category.id}
                      href={`/categories/${category.id}`}
                      className="flex items-center space-x-2 p-2 rounded hover:bg-gray-50"
                    >
                      {category.image_url && (
                        <img
                          src={category.image_url}
                          alt={category.name}
                          className="w-6 h-6 object-cover rounded"
                        />
                      )}
                      <span className="text-sm">{category.name}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
            <Link href="/products" className="text-gray-700 hover:text-yellow-600 font-medium">
              All Products
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-yellow-600 font-medium">
              About
            </Link>
            <Link href="/contact" className="text-gray-700 hover:text-yellow-600 font-medium">
              Contact
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}
