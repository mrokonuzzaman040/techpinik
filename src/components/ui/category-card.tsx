'use client'

import Link from 'next/link'
import { Package, Smartphone, Shirt, Home, Book, Dumbbell, ShoppingBag } from 'lucide-react'
import { Category } from '@/types'

interface CategoryCardProps {
  category: Category
  className?: string
}

// Icon mapping for category icons
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Smartphone: Smartphone,
  Shirt: Shirt,
  Home: Home,
  Book: Book,
  Dumbbell: Dumbbell,
  ShoppingBag: ShoppingBag,
  Package: Package,
}

export default function CategoryCard({ category, className }: CategoryCardProps) {
  // Get the appropriate icon component
  const IconComponent = category.icon && iconMap[category.icon] ? iconMap[category.icon] : Package

  return (
    <Link href={`/products?category=${category.id}`}>
      <div
        className={`group hover:shadow-xl transition-all duration-300 hover:scale-105 rounded-xl md:rounded-2xl border-0 shadow-sm bg-white cursor-pointer ${className}`}
      >
        <div className="p-3 md:p-6 text-center">
          {/* Category Icon */}
          <div className="relative w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 mx-auto mb-2 md:mb-4 overflow-hidden rounded-full bg-gradient-to-br from-yellow-50 to-yellow-100 flex items-center justify-center group-hover:from-yellow-100 group-hover:to-yellow-200 transition-all duration-300">
            <IconComponent className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 text-yellow-500 group-hover:text-yellow-600 transition-colors" />
          </div>

          {/* Category Name */}
          <h3 className="font-semibold text-xs md:text-sm lg:text-base text-gray-900 group-hover:text-yellow-600 transition-colors">
            {category.name}
          </h3>
        </div>
      </div>
    </Link>
  )
}
