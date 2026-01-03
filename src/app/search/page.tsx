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
    <div className="container mx-auto px-4 py-8">
      {/* Search Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Search className="h-6 w-6 text-gray-500" />
          <h1 className="text-2xl font-bold text-gray-900">Search Results</h1>
        </div>

        {query && (
          <p className="text-gray-600">
            Showing results for: <span className="font-semibold">"{query}"</span>
          </p>
        )}

        {!loading && products.length > 0 && (
          <p className="text-sm text-gray-500 mt-2">
            Found {products.length} product{products.length !== 1 ? 's' : ''}
          </p>
        )}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-600"></div>
          <span className="ml-3 text-gray-600">Searching products...</span>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="text-center py-12">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      )}

      {/* No Query */}
      {!query && !loading && (
        <div className="text-center py-12">
          <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-600 mb-2">Start your search</h2>
          <p className="text-gray-500">
            Enter a product name or keyword to find what you're looking for
          </p>
        </div>
      )}

      {/* No Results */}
      {query && !loading && products.length === 0 && !error && (
        <div className="text-center py-12">
          <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-600 mb-2">No products found</h2>
          <p className="text-gray-500 mb-4">We couldn't find any products matching "{query}"</p>
          <div className="text-sm text-gray-500">
            <p>Try:</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Checking your spelling</li>
              <li>Using different keywords</li>
              <li>Using more general terms</li>
            </ul>
          </div>
        </div>
      )}

      {/* Search Results */}
      {!loading && products.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
