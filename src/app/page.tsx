'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Truck, Shield, RotateCcw, Award, Package } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import MainLayout from '@/components/layout/MainLayout'
import HeroSlider from '@/components/ui/hero-slider'
import ProductCard from '@/components/ui/product-card'
import CategoryCard from '@/components/ui/category-card'
import { supabase } from '@/lib/supabase'
import { Product, Category, SliderItem } from '@/types'

export default function HomePage() {
  const [sliderItems, setSliderItems] = useState<SliderItem[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [categoryProducts, setCategoryProducts] = useState<Record<string, Product[]>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch slider items
        const { data: sliders } = await supabase
          .from('slider_items')
          .select('*')
          .eq('is_active', true)
          .order('sort_order', { ascending: true })
          .limit(5)

        // Fetch categories
        const { data: categoriesData } = await supabase
          .from('categories')
          .select('*')
          .eq('is_active', true)
          .order('name')
          .limit(8)

        // Fetch featured products
        const { data: productsData } = await supabase
          .from('products')
          .select('*')
          .eq('is_active', true)
          .order('created_at', { ascending: false })
          .limit(8)

        // Fetch products for each category
        const categoryProductsData: Record<string, Product[]> = {}
        if (categoriesData && categoriesData.length > 0) {
          for (const category of categoriesData.slice(0, 4)) { // Limit to 4 categories for homepage
            const { data: categoryProducts } = await supabase
              .from('products')
              .select('*')
              .eq('category_id', category.id)
              .eq('is_active', true)
              .order('created_at', { ascending: false })
              .limit(10)
            
            if (categoryProducts && categoryProducts.length > 0) {
              categoryProductsData[category.id] = categoryProducts
            }
          }
        }

        setSliderItems(sliders || [])
        setCategories(categoriesData || [])
        setFeaturedProducts(productsData || [])
        setCategoryProducts(categoryProductsData)
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const features = [
    {
      icon: Truck,
      title: 'Free Delivery',
      description: 'Free delivery on orders over ৳1000'
    },
    {
      icon: Shield,
      title: 'Secure Payment',
      description: '100% secure payment methods'
    },
    {
      icon: RotateCcw,
      title: 'Easy Returns',
      description: '7-day return policy'
    },
    {
      icon: Award,
      title: 'Quality Guarantee',
      description: 'Authentic products only'
    }
  ]

  if (loading) {
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      {/* Hero Slider */}
      <section className="container mx-auto px-4 py-6">
        <HeroSlider slides={sliderItems} />
      </section>

      {/* Features */}
      <section className="bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="text-center border-0 shadow-sm">
                <CardContent className="p-6">
                  <feature.icon className="h-12 w-12 text-green-600 mx-auto mb-4" />
                  <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-linear-to-br from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Shop by Category</h2>
              <p className="text-gray-600">Discover products by category</p>
            </div>
            <Link href="/categories">
              <Button variant="outline" className="hidden md:flex border-green-200 text-green-600 hover:bg-green-50">
                View All <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-6">
            {categories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>

          <div className="text-center mt-8 md:hidden">
            <Link href="/categories">
              <Button variant="outline" className="border-green-200 text-green-600 hover:bg-green-50">
                View All Categories <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Featured Products</h2>
            <Link href="/products">
              <Button variant="outline" className="hidden md:flex">
                View All <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="text-center mt-6 md:hidden">
            <Link href="/products">
              <Button variant="outline">
                View All Products <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Category-based Product Sections */}
      {Object.entries(categoryProducts).map(([categoryId, products]) => {
        const category = categories.find(cat => cat.id === categoryId)
        if (!category || products.length === 0) return null

        return (
          <section key={categoryId} className="py-12">
            <div className="container mx-auto px-4">
              {/* Category Header */}
              <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 rounded-full bg-linear-to-br from-green-50 to-green-100 flex items-center justify-center">
                  <Package className="w-8 h-8 text-green-500" />
                </div>
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900">{category.name}</h2>
                  <p className="text-gray-600">{category.description}</p>
                </div>
                <div className="flex-1 h-px bg-gray-200"></div>
                <Link href={`/products?category=${categoryId}`}>
                  <Button variant="outline" className="hidden md:flex">
                    View All <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>

              {/* Products Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {products.slice(0, 10).map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              <div className="text-center mt-6 md:hidden">
                <Link href={`/products?category=${categoryId}`}>
                  <Button variant="outline">
                    View All {category.name} <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </section>
        )
      })}
    </MainLayout>
  )
}