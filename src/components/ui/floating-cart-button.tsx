'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ShoppingCart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useCartStore } from '@/store/cart'

export default function FloatingCartButton() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const getTotalItems = useCartStore((state) => state.getTotalItems)
  const totalItems = getTotalItems()

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
    <div className="fixed bottom-6 right-6 z-50">
      <Button
        onClick={handleClick}
        size="lg"
        className="h-16 w-16 rounded-full bg-yellow-600 hover:bg-yellow-700 shadow-lg hover:shadow-2xl transition-all duration-300 flex items-center justify-center relative hover:scale-110 active:scale-95"
        aria-label={`View cart${totalItems > 0 ? ` (${totalItems} items)` : ''}`}
      >
        <ShoppingCart className="h-7 w-7 text-white" />
        {totalItems > 0 && (
          <Badge
            variant="destructive"
            className="absolute -top-1 -right-1 h-7 w-7 flex items-center justify-center p-0 text-xs font-bold rounded-full"
          >
            {totalItems > 99 ? '99+' : totalItems}
          </Badge>
        )}
      </Button>
    </div>
  )
}

