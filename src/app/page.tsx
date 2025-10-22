'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Truck, Shield, RotateCcw, Award } from 'lucide-react'
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

        setSliderItems(sliders || [])
        setCategories(categoriesData || [])
        setFeaturedProducts(productsData || [])
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
      <section className="py-16 bg-gradient-to-br from-gray-50 to-white">
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

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
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

      {/* Newsletter */}
      <section className="relative bg-gradient-to-br from-green-600 via-green-700 to-green-800 py-16 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 25px 25px, rgba(255,255,255,0.1) 2px, transparent 0)`,
            backgroundSize: '50px 50px'
          }}></div>
        </div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
                Stay Updated with 
                <span className="block text-green-200">Latest Offers</span>
              </h2>
              <p className="text-green-100 text-lg md:text-xl mb-8 max-w-2xl mx-auto leading-relaxed">
                Subscribe to our newsletter and get exclusive deals, new product announcements, and tech tips delivered to your inbox.
              </p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 md:p-10 border border-white/20 shadow-2xl">
              <div className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
                <div className="flex-1 relative">
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    className="w-full px-6 py-4 rounded-xl border-0 bg-white/90 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-white focus:ring-opacity-50 outline-none transition-all duration-300 text-lg"
                  />
                </div>
                <Button className="bg-white text-green-700 hover:bg-green-50 hover:text-green-800 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl whitespace-nowrap">
                  Subscribe Now
                </Button>
              </div>
              
              <p className="text-green-200 text-sm mt-4">
                🔒 We respect your privacy. Unsubscribe at any time.
              </p>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  )
}