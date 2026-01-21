'use client'

import Link from 'next/link'
import Image from 'next/image'
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
  
  // Check if category has an image
  const hasImage = category.image_url || category.icon_url || category.banner_image_url || category.banner_url
  const imageUrl = category.image_url || category.icon_url || category.banner_image_url || category.banner_url

  return (
    <Link href={`/products?category=${category.id}`}>
      <div
        className={`group hover:shadow-xl transition-all duration-300 hover:scale-105 rounded-xl md:rounded-2xl border-0 shadow-sm bg-white cursor-pointer h-full flex flex-col ${className}`}
      >
        <div className="p-2 sm:p-3 text-center flex flex-col items-center justify-center flex-1">
          {/* Category Image or Icon */}
          <div className="relative w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 mx-auto mb-1.5 sm:mb-2 overflow-hidden rounded-lg bg-linear-to-br from-yellow-50 to-yellow-100 flex items-center justify-center group-hover:from-yellow-100 group-hover:to-yellow-200 transition-all duration-300 shrink-0">
            {hasImage && imageUrl ? (
              <Image
                src={imageUrl}
                alt={category.name}
                fill
                className="object-cover rounded-lg"
                sizes="(max-width: 640px) 40px, (max-width: 768px) 48px, 56px"
              />
            ) : (
              <IconComponent className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-yellow-500 group-hover:text-yellow-600 transition-colors" />
            )}
          </div>

          {/* Category Name */}
          <h3 className="font-semibold text-[10px] sm:text-xs md:text-sm text-gray-900 group-hover:text-yellow-600 transition-colors leading-tight line-clamp-2">
            {category.name}
          </h3>
        </div>
      </div>
    </Link>
  )
}
