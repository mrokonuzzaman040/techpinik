'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Filter, Grid, List, SlidersHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import MainLayout from '@/components/layout/MainLayout'
import ProductCard from '@/components/ui/product-card'
import { createClient } from '@/lib/supabase'
import { Product, Category } from '@/types'

function ProductsPageContent() {
  const PAGE_SIZE = 24
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [brands, setBrands] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState('newest')
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null)
  const [priceRange, setPriceRange] = useState({ min: '', max: '' })
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalProducts, setTotalProducts] = useState(0)

  const searchParams = useSearchParams()
  const categoryParam = searchParams.get('category')

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient()

      try {
        // Fetch categories
        const { data: categoriesData } = await supabase
          .from('categories')
          .select('*')
          .eq('is_active', true)
          .order('sort_order', { ascending: true })
          .order('name', { ascending: true })

        setCategories(categoriesData || [])

        // Fetch unique brands from products
        const { data: productsData } = await supabase
          .from('products')
          .select('brand')
          .eq('is_active', true)
          .not('brand', 'is', null)

        // Extract unique brands and sort them
        const uniqueBrands = Array.from(
          new Set(
            (productsData || [])
              .map((p) => p.brand)
              .filter((brand): brand is string => Boolean(brand))
          )
        ).sort()

        setBrands(uniqueBrands)

        // Set initial category filter if provided in URL
        if (categoryParam) {
          setSelectedCategories([categoryParam])
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchData()
  }, [categoryParam])

  useEffect(() => {
    setCurrentPage(1)
  }, [selectedCategories, selectedBrand, priceRange.min, priceRange.max, searchQuery, sortBy])

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      const supabase = createClient()

      try {
        let query = supabase.from('products').select('*', { count: 'exact' }).eq('is_active', true)

        // Apply category filter
        if (selectedCategories.length > 0) {
          query = query.in('category_id', selectedCategories)
        }

        // Apply brand filter
        if (selectedBrand) {
          query = query.eq('brand', selectedBrand)
        }

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

        const from = (currentPage - 1) * PAGE_SIZE
        const to = from + PAGE_SIZE - 1
        query = query.range(from, to)

        const { data: productsData, count } = await query

        setProducts(productsData || [])
        setTotalProducts(count || 0)
      } catch (error) {
        console.error('Error fetching products:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [selectedCategories, selectedBrand, priceRange, searchQuery, sortBy, currentPage])

  const handleCategoryChange = (categoryId: string, checked: boolean) => {
    if (checked) {
      setSelectedCategories((prev) => [...prev, categoryId])
    } else {
      setSelectedCategories((prev) => prev.filter((id) => id !== categoryId))
    }
  }

  const handleBrandChange = (brand: string) => {
    // Toggle: if already selected, deselect; otherwise, select this brand only
    setSelectedBrand((prev) => (prev === brand ? null : brand))
  }

  const clearFilters = () => {
    setSelectedCategories([])
    setSelectedBrand(null)
    setPriceRange({ min: '', max: '' })
    setSearchQuery('')
  }

  const selectedCategoryNames = categories
    .filter((category) => selectedCategories.includes(category.id))
    .map((category) => category.name)

  const activeFiltersCount =
    selectedCategories.length +
    (selectedBrand ? 1 : 0) +
    (priceRange.min || priceRange.max ? 1 : 0) +
    (searchQuery ? 1 : 0)
  const totalPages = Math.max(1, Math.ceil(totalProducts / PAGE_SIZE))

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Search */}
      <div>
        <Label htmlFor="search" className="text-sm font-medium">
          Search Products
        </Label>
        <Input
          id="search"
          placeholder="Search by name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="mt-2"
        />
      </div>

      {/* Categories */}
      <div>
        <Label className="text-sm font-medium">Categories</Label>
        <div className="mt-2 space-y-2 max-h-48 overflow-y-auto">
          {categories.map((category) => (
            <div key={category.id} className="flex items-center space-x-2">
              <Checkbox
                id={category.id}
                checked={selectedCategories.includes(category.id)}
                onCheckedChange={(checked) => handleCategoryChange(category.id, checked as boolean)}
              />
              <Label htmlFor={category.id} className="text-sm">
                {category.name}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Brands */}
      {brands.length > 0 && (
        <div>
          <Label className="text-sm font-medium">Brands</Label>
          <div className="mt-2 space-y-2 max-h-48 overflow-y-auto">
            {brands.map((brand) => (
              <div key={brand} className="flex items-center space-x-2">
                <Checkbox
                  id={`brand-${brand}`}
                  checked={selectedBrand === brand}
                  onCheckedChange={() => handleBrandChange(brand)}
                />
                <Label htmlFor={`brand-${brand}`} className="text-sm cursor-pointer">
                  {brand}
                </Label>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Price Range */}
      <div>
        <Label className="text-sm font-medium">Price Range (৳)</Label>
        <div className="mt-2 flex space-x-2">
          <Input
            placeholder="Min"
            type="number"
            value={priceRange.min}
            onChange={(e) => setPriceRange((prev) => ({ ...prev, min: e.target.value }))}
          />
          <Input
            placeholder="Max"
            type="number"
            value={priceRange.max}
            onChange={(e) => setPriceRange((prev) => ({ ...prev, max: e.target.value }))}
          />
        </div>
      </div>

      {/* Clear Filters */}
      <Button variant="outline" onClick={clearFilters} className="w-full">
        Clear All Filters
      </Button>
    </div>
  )

  const ProductGridSkeleton = () => (
    <div
      className={`grid gap-3 sm:gap-4 md:gap-6 ${
        viewMode === 'grid' ? 'grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'
      }`}
    >
      {Array.from({ length: viewMode === 'grid' ? 8 : 4 }).map((_, index) => (
        <div
          key={`product-skeleton-${index}`}
          className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm animate-pulse"
        >
          <div className="aspect-square w-full bg-gray-200" />
          <div className="space-y-3 p-4">
            <div className="h-4 w-2/3 rounded bg-gray-200" />
            <div className="h-3 w-1/2 rounded bg-gray-200" />
            <div className="h-4 w-1/3 rounded bg-gray-200" />
          </div>
        </div>
      ))}
    </div>
  )

  return (
    <MainLayout>
      <div className="bg-linear-to-b from-amber-50/70 via-white to-white">
        <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6">
          {/* Header */}
          <div className="mb-6 rounded-2xl border border-amber-100/80 bg-white/90 p-4 shadow-sm sm:p-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                  All Products
                </h1>
                <p className="mt-2 text-sm text-gray-600 sm:text-base">
                  Discover our complete range of electronics and gadgets
                </p>
              </div>
              <div className="inline-flex w-fit items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-medium text-amber-800 sm:text-sm">
                <span>{loading ? 'Loading products...' : `${totalProducts} products available`}</span>
              </div>
            </div>
          </div>

          {/* Active Filters */}
          {activeFiltersCount > 0 && (
            <div className="mb-5 rounded-xl border border-gray-200 bg-white p-3 shadow-sm sm:p-4">
              <div className="mb-3 flex items-center justify-between gap-2">
                <p className="text-sm font-medium text-gray-700">
                  Active filters <span className="text-gray-500">({activeFiltersCount})</span>
                </p>
                <Button variant="ghost" size="sm" onClick={clearFilters} className="h-8 px-2 text-xs">
                  Clear all
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {searchQuery && (
                  <Badge variant="secondary" className="rounded-full">
                    Search: {searchQuery}
                  </Badge>
                )}
                {selectedCategoryNames.map((name) => (
                  <Badge key={name} variant="secondary" className="rounded-full">
                    {name}
                  </Badge>
                ))}
                {selectedBrand && (
                  <Badge variant="secondary" className="rounded-full">
                    Brand: {selectedBrand}
                  </Badge>
                )}
                {(priceRange.min || priceRange.max) && (
                  <Badge variant="secondary" className="rounded-full">
                    Price: {priceRange.min || 0} - {priceRange.max || 'Any'}
                  </Badge>
                )}
              </div>
            </div>
          )}

          {/* Brand Filters - Top Section */}
          {brands.length > 0 && (
            <div className="mb-5 rounded-xl border border-gray-200 bg-white p-3 shadow-sm sm:p-4">
              <div className="mb-3 flex items-center gap-2">
                <Label className="text-sm font-medium text-gray-700">Filter by Brand:</Label>
                {selectedBrand && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedBrand(null)}
                    className="h-6 px-2 text-xs text-gray-500 hover:text-gray-700"
                  >
                    Clear brand
                  </Button>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {brands.map((brand) => {
                  const isSelected = selectedBrand === brand
                  return (
                    <Badge
                      key={brand}
                      variant={isSelected ? 'default' : 'outline'}
                      className={`cursor-pointer rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
                        isSelected
                          ? 'bg-yellow-600 text-white hover:bg-yellow-700 border-yellow-600'
                          : 'border-gray-300 bg-white text-gray-700 hover:border-yellow-400 hover:bg-yellow-50'
                      }`}
                      onClick={() => handleBrandChange(brand)}
                    >
                      {brand}
                    </Badge>
                  )
                })}
              </div>
            </div>
          )}

          <div className="flex flex-col gap-6 lg:flex-row">
            {/* Desktop Filters */}
            <aside className="hidden w-72 shrink-0 lg:block">
              <Card className="sticky top-24 border-gray-200 shadow-sm">
                <CardContent className="p-5">
                  <div className="mb-4 flex items-center gap-2">
                    <Filter className="h-5 w-5" />
                    <h3 className="font-semibold">Filters</h3>
                  </div>
                  <Separator className="mb-4" />
                  <FilterContent />
                </CardContent>
              </Card>
            </aside>

            {/* Main Content */}
            <div className="flex-1">
              {/* Controls */}
              <div className="mb-6 flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-3 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-4">
                <div className="flex items-center gap-2">
                  {/* Mobile Filter */}
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="outline" size="sm" className="lg:hidden">
                        <SlidersHorizontal className="mr-2 h-4 w-4" />
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

                  <span className="text-sm text-gray-600 sm:text-base">
                    {loading ? 'Loading...' : `${totalProducts} products found`}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {/* Sort */}
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-44">
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
                  <div className="hidden rounded-lg border bg-gray-50 p-0.5 md:flex">
                    <Button
                      variant={viewMode === 'grid' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setViewMode('grid')}
                      className="rounded-md"
                    >
                      <Grid className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={viewMode === 'list' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setViewMode('list')}
                      className="rounded-md"
                    >
                      <List className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Products Grid */}
              {loading ? (
                <ProductGridSkeleton />
              ) : products.length === 0 ? (
                <div className="rounded-xl border border-dashed border-gray-300 bg-white py-16 text-center">
                  <p className="text-lg font-medium text-gray-700">No products found</p>
                  <p className="mt-2 text-sm text-gray-500">
                    Try adjusting your search or filters to find what you are looking for.
                  </p>
                  <Button onClick={clearFilters} className="mt-5">
                    Clear Filters
                  </Button>
                </div>
              ) : (
                <>
                  <div
                    className={`grid gap-3 sm:gap-4 md:gap-6 ${
                      viewMode === 'grid'
                        ? 'grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4'
                        : 'grid-cols-1'
                    }`}
                  >
                    {products.map((product) => (
                      <ProductCard key={product.id} product={product} layout={viewMode} />
                    ))}
                  </div>

                  {totalPages > 1 && (
                    <div className="mt-8 flex flex-col items-center justify-between gap-3 rounded-xl border border-gray-200 bg-white p-4 sm:flex-row">
                      <p className="text-sm text-gray-600">
                        Page {currentPage} of {totalPages}
                      </p>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                          disabled={currentPage === 1}
                        >
                          Previous
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                          disabled={currentPage === totalPages}
                        >
                          Next
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProductsPageContent />
    </Suspense>
  )
}
