'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, Filter, Grid, List, SlidersHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import MainLayout from '@/components/layout/MainLayout'
import ProductCard from '@/components/ui/product-card'
import { createClient } from '@/lib/supabase'
import { Product, Category } from '@/types'

export default function CategoryDetailPage() {
  const params = useParams()
  const categoryId = params.id as string
  
  const [category, setCategory] = useState<Category | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState('newest')
  const [priceRange, setPriceRange] = useState({ min: '', max: '' })
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      if (!categoryId) return

      const supabase = createClient()

      try {
        // Fetch category
        const { data: categoryData } = await supabase
          .from('categories')
          .select('*')
          .eq('id', categoryId)
          .single()

        setCategory(categoryData)
      } catch (error) {
        console.error('Error fetching category:', error)
      }
    }

    fetchData()
  }, [categoryId])

  useEffect(() => {
    const fetchProducts = async () => {
      if (!categoryId) return

      setLoading(true)
      const supabase = createClient()

      try {
        let query = supabase
          .from('products')
          .select('*')
          .eq('category_id', categoryId)
          .eq('is_active', true)

        // Apply price range filter
        if (priceRange.min) {
          query = query.gte('price', parseInt(priceRange.min))
        }
        if (priceRange.max) {
          query = query.lte('price', parseInt(priceRange.max))
        }

        // Apply search filter
        if (searchQuery) {
          query = query.ilike('name', `%${searchQuery}%`)
        }

        // Apply sorting
        switch (sortBy) {
          case 'price-low':
            query = query.order('price', { ascending: true })
            break
          case 'price-high':
            query = query.order('price', { ascending: false })
            break
          case 'name':
            query = query.order('name', { ascending: true })
            break
          default:
            query = query.order('created_at', { ascending: false })
        }

        const { data: productsData } = await query

        setProducts(productsData || [])
      } catch (error) {
        console.error('Error fetching products:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [categoryId, priceRange, searchQuery, sortBy])

  const clearFilters = () => {
    setPriceRange({ min: '', max: '' })
    setSearchQuery('')
  }

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Search */}
      <div>
        <Label htmlFor="search" className="text-sm font-medium">Search Products</Label>
        <Input
          id="search"
          placeholder="Search by name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="mt-2"
        />
      </div>

      {/* Price Range */}
      <div>
        <Label className="text-sm font-medium">Price Range (৳)</Label>
        <div className="mt-2 flex space-x-2">
          <Input
            placeholder="Min"
            type="number"
            value={priceRange.min}
            onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
          />
          <Input
            placeholder="Max"
            type="number"
            value={priceRange.max}
            onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
          />
        </div>
      </div>

      {/* Clear Filters */}
      <Button variant="outline" onClick={clearFilters} className="w-full">
        Clear All Filters
      </Button>
    </div>
  )

  if (!category && !loading) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Category Not Found</h1>
          <p className="text-gray-600 mb-6">The category you're looking for doesn't exist.</p>
          <Link href="/categories">
            <Button>Browse Categories</Button>
          </Link>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
          <Link href="/" className="hover:text-green-600">Home</Link>
          <span>/</span>
          <Link href="/categories" className="hover:text-green-600">Categories</Link>
          <span>/</span>
          <span className="text-gray-900">{category?.name}</span>
        </nav>

        {/* Back Button */}
        <Button variant="ghost" className="mb-6" onClick={() => window.history.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        {/* Category Header */}
        {category && (
          <div className="mb-8">
            {category.banner_image_url && (
              <div className="relative h-48 md:h-64 rounded-lg overflow-hidden mb-6">
                <Image
                  src={category.banner_image_url}
                  alt={category.name}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                  <div className="text-center text-white">
                    <h1 className="text-3xl md:text-4xl font-bold mb-2">{category.name}</h1>
                    {category.description && (
                      <p className="text-lg opacity-90">{category.description}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {!category.banner_image_url && (
              <div className="text-center mb-6">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{category.name}</h1>
                {category.description && (
                  <p className="text-gray-600">{category.description}</p>
                )}
              </div>
            )}
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Desktop Filters */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Filter className="h-5 w-5" />
                  <h3 className="font-semibold">Filters</h3>
                </div>
                <FilterContent />
              </CardContent>
            </Card>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* Controls */}
            <div className="flex items-center justify-between mb-6 gap-4">
              <div className="flex items-center gap-2">
                {/* Mobile Filter */}
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="sm" className="lg:hidden">
                      <SlidersHorizontal className="h-4 w-4 mr-2" />
                      Filters
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-80">
                    <SheetHeader>
                      <SheetTitle>Filters</SheetTitle>
                    </SheetHeader>
                    <div className="mt-6">
                      <FilterContent />
                    </div>
                  </SheetContent>
                </Sheet>

                <span className="text-sm text-gray-600">
                  {products.length} products found
                </span>
              </div>

              <div className="flex items-center gap-2">
                {/* Sort */}
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="name">Name: A to Z</SelectItem>
                  </SelectContent>
                </Select>

                {/* View Mode */}
                <div className="hidden md:flex border rounded-lg">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                    className="rounded-r-none"
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                    className="rounded-l-none"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No products found in this category</p>
                <Button onClick={clearFilters} className="mt-4">
                  Clear Filters
                </Button>
              </div>
            ) : (
              <div className={`grid gap-4 md:gap-6 ${
                viewMode === 'grid' 
                  ? 'grid-cols-2 md:grid-cols-3 xl:grid-cols-4' 
                  : 'grid-cols-1'
              }`}>
                {products.map((product) => (
                  <ProductCard 
                    key={product.id} 
                    product={product}
                    className={viewMode === 'list' ? 'flex-row' : ''}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  )
}