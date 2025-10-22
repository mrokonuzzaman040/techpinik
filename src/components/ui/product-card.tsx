'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Star, ShoppingCart, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Product } from '@/types'
import { useCartStore } from '@/store/cart'

interface ProductCardProps {
  product: Product
  className?: string
}

export default function ProductCard({ product, className }: ProductCardProps) {
  const addToCart = useCartStore((state) => state.addItem)

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    addToCart(product, 1)
  }

  const discountPercentage = product.sale_price 
    ? Math.round(((product.price - product.sale_price) / product.price) * 100)
    : 0

  const primaryImage = product.images && product.images.length > 0 
    ? product.images[0] 
    : 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=product%20placeholder%20image&image_size=square'

  return (
    <Card className={`group hover:shadow-lg transition-shadow duration-300 ${className}`}>
      <Link href={`/products/${product.id}`}>
        <CardContent className="p-0">
          {/* Image Container */}
          <div className="relative aspect-square overflow-hidden rounded-t-lg">
            <Image
              src={primaryImage}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
            
            {/* Badges */}
            <div className="absolute top-2 left-2 flex flex-col gap-1">
              {discountPercentage > 0 && (
                <Badge variant="destructive" className="text-xs">
                  -{discountPercentage}%
                </Badge>
              )}
              {product.stock_quantity === 0 && (
                <Badge variant="secondary" className="text-xs">
                  Out of Stock
                </Badge>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div className="p-3">
            {/* Product Name */}
            <h3 className="font-medium text-sm line-clamp-2 mb-2 group-hover:text-green-600 transition-colors">
              {product.name}
            </h3>

            {/* Price */}
            <div className="flex items-center gap-2 mb-2">
              <span className="font-bold text-green-600 text-sm">
                ৳{(product.sale_price || product.price).toLocaleString()}
              </span>
              {product.sale_price && (
                <span className="text-xs text-gray-500 line-through">
                  ৳{product.price.toLocaleString()}
                </span>
              )}
            </div>

            {/* Add to Cart Button */}
            <Button
              onClick={handleAddToCart}
              disabled={product.stock_quantity === 0}
              className="w-full h-8 text-xs"
              variant={product.stock_quantity === 0 ? 'secondary' : 'default'}
            >
              <ShoppingCart className="h-3 w-3 mr-1" />
              {product.stock_quantity === 0 ? 'Out of Stock' : 'Add to Cart'}
            </Button>
          </div>
        </CardContent>
      </Link>
    </Card>
  )
}