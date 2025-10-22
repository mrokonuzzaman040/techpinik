'use client'

import Link from 'next/link'
import { 
  Package, 
  Smartphone, 
  Shirt, 
  Home, 
  Book, 
  Dumbbell,
  ShoppingBag 
} from 'lucide-react'
import { Category } from '@/types'

interface CategoryCardProps {
  category: Category
  className?: string
}

// Icon mapping for category icons
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  'Smartphone': Smartphone,
  'Shirt': Shirt,
  'Home': Home,
  'Book': Book,
  'Dumbbell': Dumbbell,
  'ShoppingBag': ShoppingBag,
  'Package': Package,
}

export default function CategoryCard({ category, className }: CategoryCardProps) {
  // Get the appropriate icon component
  const IconComponent = category.icon && iconMap[category.icon] ? iconMap[category.icon] : Package

  return (
    <Link href={`/products?category=${category.id}`}>
      <div className={`group hover:shadow-xl transition-all duration-300 hover:scale-105 rounded-2xl border-0 shadow-sm bg-white cursor-pointer ${className}`}>
        <div className="p-6 text-center">
          {/* Category Icon */}
          <div className="relative w-20 h-20 md:w-24 md:h-24 mx-auto mb-4 overflow-hidden rounded-full bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center group-hover:from-green-100 group-hover:to-green-200 transition-all duration-300">
            <IconComponent className="w-10 h-10 md:w-12 md:h-12 text-green-500 group-hover:text-green-600 transition-colors" />
          </div>

          {/* Category Name */}
          <h3 className="font-semibold text-sm md:text-base text-gray-900 group-hover:text-green-600 transition-colors mb-2">
            {category.name}
          </h3>

          {/* Category Description */}
          {category.description && (
            <p className="text-xs text-gray-500 mt-1 line-clamp-2 group-hover:text-gray-600 transition-colors">
              {category.description}
            </p>
          )}
        </div>
      </div>
    </Link>
  )
}