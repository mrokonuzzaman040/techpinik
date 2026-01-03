'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Search, ShoppingCart, User, Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { useCartStore } from '@/store/cart'
import { createClient } from '@/lib/supabase'
import { Category } from '@/types'

export default function Navbar() {
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [mounted, setMounted] = useState(false)
  const { getTotalItems } = useCartStore()

  useEffect(() => {
    setMounted(true)
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

  const totalItems = getTotalItems()

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm border-b">
      {/* Top Bar */}
      {/* <div className="bg-yellow-600 text-white py-2 px-4">
        <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center text-sm">
          <div className="flex items-center space-x-4 mb-2 sm:mb-0">
            <div className="flex items-center space-x-1">
              <Phone className="h-3 w-3" />
              <span>+880 1234-567890</span>
            </div>
            <div className="flex items-center space-x-1">
              <Mail className="h-3 w-3" />
              <span>info@techpinik.com</span>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <MapPin className="h-3 w-3" />
            <span>Free delivery in Dhaka</span>
          </div>
        </div>
      </div> */}

      {/* Main Navigation */}
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
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

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-6">
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

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-6">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
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

          {/* Action Buttons */}
          <div className="flex items-center space-x-3">
            {/* Mobile Search */}
            <Button variant="ghost" size="icon" className="md:hidden">
              <Search className="h-5 w-5" />
            </Button>

            {/* Cart */}
            <Link href="/cart">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {mounted && totalItems > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
                  >
                    {totalItems}
                  </Badge>
                )}
              </Button>
            </Link>

            {/* User Account */}
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
            </Button>

            {/* Mobile Menu */}
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
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden mt-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search products..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
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
      </div>
    </header>
  )
}
