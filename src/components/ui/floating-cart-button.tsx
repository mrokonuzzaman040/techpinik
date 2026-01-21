'use client'

import { useEffect, useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { ShoppingCart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useCartStore } from '@/store/cart'

export default function FloatingCartButton() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  
  // Subscribe to cart items for real-time updates
  const items = useCartStore((state) => state.items)
  
  // Calculate total items from the subscribed items array
  const totalItems = useMemo(() => {
    return items.reduce((total, item) => total + item.quantity, 0)
  }, [items])

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleClick = () => {
    router.push('/cart')
  }

  // Don't render until mounted to avoid hydration mismatch
  if (!mounted) {
    return null
  }

  return (
    <Button
      onClick={handleClick}
      className="h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16 rounded-full bg-yellow-600 hover:bg-yellow-700 shadow-lg hover:shadow-2xl transition-all duration-300 flex items-center justify-center relative hover:scale-110 active:scale-95"
      aria-label={`View cart${totalItems > 0 ? ` (${totalItems} items)` : ''}`}
    >
      <ShoppingCart className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7 text-white" />
      {totalItems > 0 && (
        <Badge
          variant="destructive"
          className="absolute -top-1 -right-1 h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7 flex items-center justify-center p-0 text-[10px] sm:text-xs font-bold rounded-full"
        >
          {totalItems > 99 ? '99+' : totalItems}
        </Badge>
      )}
    </Button>
  )
}

