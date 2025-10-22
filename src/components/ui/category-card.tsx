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
import { Card, CardContent } from '@/components/ui/card'
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
      <Card className={`group hover:shadow-lg transition-all duration-300 hover:scale-105 ${className}`}>
        <CardContent className="p-4 text-center">
          {/* Category Icon */}
          <div className="relative w-16 h-16 md:w-20 md:h-20 mx-auto mb-3 overflow-hidden rounded-full bg-gray-100 flex items-center justify-center">
            <IconComponent className="w-8 h-8 md:w-10 md:h-10 text-gray-400 group-hover:text-green-600 transition-colors" />
          </div>

          {/* Category Name */}
          <h3 className="font-medium text-sm md:text-base text-gray-900 group-hover:text-green-600 transition-colors">
            {category.name}
          </h3>

          {/* Category Description */}
          {category.description && (
            <p className="text-xs text-gray-500 mt-1 line-clamp-2">
              {category.description}
            </p>
          )}
        </CardContent>
      </Card>
    </Link>
  )
}