'use client'

import { useEffect, useState } from 'react'
import { Grid, List } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import MainLayout from '@/components/layout/MainLayout'
import CategoryCard from '@/components/ui/category-card'
import { createClient } from '@/lib/supabase'
import { Category } from '@/types'

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  useEffect(() => {
    const fetchCategories = async () => {
      const supabase = createClient()

      try {
        const { data } = await supabase
          .from('categories')
          .select('*')
          .eq('is_active', true)
          .order('name')

        setCategories(data || [])
      } catch (error) {
        console.error('Error fetching categories:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  if (loading) {
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-yellow-600"></div>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">All Categories</h1>
          <p className="text-gray-600">Browse products by category</p>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between mb-6">
          <span className="text-sm text-gray-600">{categories.length} categories found</span>

          {/* View Mode Toggle */}
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

        {/* Categories Grid */}
        {categories.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No categories found</p>
          </div>
        ) : (
          <div
            className={`grid gap-4 md:gap-6 ${
              viewMode === 'grid'
                ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6'
                : 'grid-cols-1 md:grid-cols-2'
            }`}
          >
            {categories.map((category) => (
              <CategoryCard
                key={category.id}
                category={category}
                className={viewMode === 'list' ? 'md:flex md:items-center md:text-left' : ''}
              />
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  )
}
