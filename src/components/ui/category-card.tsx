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
        className={`group hover:shadow-xl transition-all duration-300 hover:scale-105 rounded-xl md:rounded-2xl border-0 shadow-sm bg-white cursor-pointer h-full flex flex-col ${className}`}
      >
        <div className="p-3 sm:p-4 md:p-5 text-center flex flex-col items-center justify-center flex-1 min-h-[120px] sm:min-h-[140px] md:min-h-[160px]">
          {/* Category Icon */}
          <div className="relative w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 mx-auto mb-2 sm:mb-3 overflow-hidden rounded-full bg-linear-to-br from-yellow-50 to-yellow-100 flex items-center justify-center group-hover:from-yellow-100 group-hover:to-yellow-200 transition-all duration-300 shrink-0">
            <IconComponent className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-yellow-500 group-hover:text-yellow-600 transition-colors" />
          </div>

          {/* Category Name */}
          <h3 className="font-semibold text-xs sm:text-sm md:text-base text-gray-900 group-hover:text-yellow-600 transition-colors leading-tight line-clamp-2 flex-1 flex items-center justify-center">
            {category.name}
          </h3>
        </div>
      </div>
    </Link>
  )
}
