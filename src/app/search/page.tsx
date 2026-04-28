'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Search } from 'lucide-react'
import ProductCard from '@/components/ui/product-card'
import MainLayout from '@/components/layout/MainLayout'
import { Product } from '@/types'

function SearchPageContent() {
  const searchParams = useSearchParams()
  const query = searchParams.get('q') || ''
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (query) {
      searchProducts(query)
    } else {
      setProducts([])
      setLoading(false)
    }
  }, [query])

  const searchProducts = async (searchQuery: string) => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`/api/products?search=${encodeURIComponent(searchQuery)}`)
      if (!response.ok) {
        throw new Error('Failed to search products')
      }

      const data = await response.json()
      setProducts(data.data || [])
    } catch (error) {
      console.error('Error searching products:', error)
      setError('Failed to search products. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-3 sm:px-4 py-6 md:py-8">
      {/* Search Header */}
      <div className="mb-6 md:mb-8">
        <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
          <Search className="h-5 w-5 sm:h-6 sm:w-6 text-gray-500" />
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
            Search Results
          </h1>
        </div>

        {query && (
          <div className="mb-2">
            <p className="text-sm sm:text-base text-gray-600">
              Showing results for: <span className="font-semibold text-gray-900">"{query}"</span>
            </p>
            {!loading && products.length > 0 && (
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                Found {products.length} product{products.length !== 1 ? 's' : ''}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="py-6 md:py-8 animate-pulse">
          <div className="mb-4 h-4 w-40 rounded bg-gray-200" />
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
            {Array.from({ length: 12 }).map((_, index) => (
              <div
                key={`search-skeleton-${index}`}
                className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"
              >
                <div className="aspect-square w-full bg-gray-200" />
                <div className="space-y-3 p-3">
                  <div className="h-4 w-2/3 rounded bg-gray-200" />
                  <div className="h-3 w-1/2 rounded bg-gray-200" />
                  <div className="h-4 w-1/3 rounded bg-gray-200" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="text-center py-12 md:py-16">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 sm:p-6 max-w-md mx-auto">
            <p className="text-sm sm:text-base text-red-600">{error}</p>
          </div>
        </div>
      )}

      {/* No Query */}
      {!query && !loading && (
        <div className="text-center py-12 md:py-16">
          <Search className="h-12 w-12 sm:h-16 sm:w-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-lg sm:text-xl font-semibold text-gray-600 mb-2">Start your search</h2>
          <p className="text-sm sm:text-base text-gray-500 px-4">
            Enter a product name or keyword to find what you're looking for
          </p>
        </div>
      )}

      {/* No Results */}
      {query && !loading && products.length === 0 && !error && (
        <div className="text-center py-12 md:py-16">
          <Search className="h-12 w-12 sm:h-16 sm:w-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-lg sm:text-xl font-semibold text-gray-600 mb-2">No products found</h2>
          <p className="text-sm sm:text-base text-gray-500 mb-4 px-4">
            We couldn't find any products matching "{query}"
          </p>
          <div className="text-xs sm:text-sm text-gray-500 max-w-md mx-auto px-4">
            <p className="font-medium mb-2">Try:</p>
            <ul className="list-disc list-inside space-y-1 text-left inline-block">
              <li>Checking your spelling</li>
              <li>Using different keywords</li>
              <li>Using more general terms</li>
            </ul>
          </div>
        </div>
      )}

      {/* Search Results */}
      {!loading && products.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}

export default function SearchPage() {
  return (
    <MainLayout>
      <Suspense fallback={<div>Loading...</div>}>
        <SearchPageContent />
      </Suspense>
    </MainLayout>
  )
}
