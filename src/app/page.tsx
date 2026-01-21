'use client'

import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Package } from 'lucide-react'
import { Button } from '@/components/ui/button'
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
  const categoryScrollRef = useRef<HTMLDivElement>(null)
  const autoScrollIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const isPausedRef = useRef(false)
  const isDraggingRef = useRef(false)
  const startXRef = useRef(0)
  const scrollLeftRef = useRef(0)

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
          for (const category of categoriesData.slice(0, 4)) {
            // Limit to 4 categories for homepage
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

  // Auto-scroll functionality for categories with infinite loop
  useEffect(() => {
    const scrollContainer = categoryScrollRef.current
    if (!scrollContainer || categories.length === 0) return

    // Calculate the width of one set of categories for seamless loop
    const calculateSingleSetWidth = () => {
      if (scrollContainer.children.length === 0) return 0

      // Get the actual width of all items in the first set
      let totalWidth = 0
      for (let i = 0; i < categories.length; i++) {
        const child = scrollContainer.children[i] as HTMLElement
        if (child) {
          totalWidth += child.offsetWidth
          if (i < categories.length - 1) {
            totalWidth += 24 // gap-6 = 24px
          }
        }
      }
      return totalWidth
    }

    // Handle scroll position reset for infinite loop
    const handleScrollReset = () => {
      if (!scrollContainer) return
      const singleSetWidth = calculateSingleSetWidth()
      const currentScroll = scrollContainer.scrollLeft

      // If we've scrolled past the first set, reset to start instantly (seamless loop)
      if (currentScroll >= singleSetWidth - 1) {
        scrollContainer.scrollLeft = currentScroll - singleSetWidth
      }
    }

    const startAutoScroll = () => {
      if (autoScrollIntervalRef.current) {
        clearInterval(autoScrollIntervalRef.current)
      }

      // Set initial scroll position to the start of the first set
      scrollContainer.scrollLeft = 0

      autoScrollIntervalRef.current = setInterval(() => {
        if (!isPausedRef.current && !isDraggingRef.current && scrollContainer) {
          const singleSetWidth = calculateSingleSetWidth()
          const currentScroll = scrollContainer.scrollLeft

          // If we've scrolled past the first set, reset to start instantly (seamless loop)
          if (currentScroll >= singleSetWidth - 1) {
            scrollContainer.scrollLeft = currentScroll - singleSetWidth
          } else {
            // Scroll forward
            scrollContainer.scrollLeft += 2
          }
        }
      }, 50) // Smooth scrolling every 50ms
    }

    // Also handle manual scrolling to ensure infinite loop
    scrollContainer.addEventListener('scroll', handleScrollReset)

    startAutoScroll()

    return () => {
      scrollContainer.removeEventListener('scroll', handleScrollReset)
      if (autoScrollIntervalRef.current) {
        clearInterval(autoScrollIntervalRef.current)
      }
    }
  }, [categories])

  // Touch and mouse drag handlers - global mouse events
  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current || !categoryScrollRef.current) return
      e.preventDefault()
      const x = e.pageX - categoryScrollRef.current.offsetLeft
      const walk = (x - startXRef.current) * 2
      categoryScrollRef.current.scrollLeft = scrollLeftRef.current - walk
    }

    const handleGlobalMouseUp = () => {
      if (!isDraggingRef.current) return
      isDraggingRef.current = false
      if (categoryScrollRef.current) {
        categoryScrollRef.current.style.cursor = 'grab'
        categoryScrollRef.current.style.userSelect = 'auto'
      }
      // Resume auto-scroll after a delay
      setTimeout(() => {
        isPausedRef.current = false
      }, 2000)
    }

    document.addEventListener('mousemove', handleGlobalMouseMove)
    document.addEventListener('mouseup', handleGlobalMouseUp)

    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove)
      document.removeEventListener('mouseup', handleGlobalMouseUp)
    }
  }, [])

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!categoryScrollRef.current) return
    isDraggingRef.current = true
    isPausedRef.current = true
    startXRef.current = e.pageX - categoryScrollRef.current.offsetLeft
    scrollLeftRef.current = categoryScrollRef.current.scrollLeft
    categoryScrollRef.current.style.cursor = 'grabbing'
    categoryScrollRef.current.style.userSelect = 'none'
  }

  const handleMouseUp = () => {
    isDraggingRef.current = false
    if (categoryScrollRef.current) {
      categoryScrollRef.current.style.cursor = 'grab'
      categoryScrollRef.current.style.userSelect = 'auto'
    }
    // Resume auto-scroll after a delay
    setTimeout(() => {
      isPausedRef.current = false
    }, 2000)
  }

  const handleMouseLeave = () => {
    if (isDraggingRef.current) return // Don't reset if still dragging
    if (categoryScrollRef.current) {
      categoryScrollRef.current.style.cursor = 'grab'
    }
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!categoryScrollRef.current) return
    isPausedRef.current = true
    startXRef.current = e.touches[0].pageX - categoryScrollRef.current.offsetLeft
    scrollLeftRef.current = categoryScrollRef.current.scrollLeft
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!categoryScrollRef.current) return
    const x = e.touches[0].pageX - categoryScrollRef.current.offsetLeft
    const walk = (x - startXRef.current) * 2
    categoryScrollRef.current.scrollLeft = scrollLeftRef.current - walk
  }

  const handleTouchEnd = () => {
    setTimeout(() => {
      isPausedRef.current = false
    }, 2000)
  }

  const handleMouseEnter = () => {
    isPausedRef.current = true
  }

  const handleMouseLeaveCategory = () => {
    setTimeout(() => {
      isPausedRef.current = false
    }, 1000)
  }

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
      {/* Hero Slider */}
      <section className="container mx-auto px-4 py-6">
        <HeroSlider slides={sliderItems} />
      </section>

      {/* Features */}
      {/* <section className="bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="text-center border-0 shadow-sm">
                <CardContent className="p-6">
                  <feature.icon className="h-12 w-12 text-yellow-600 mx-auto mb-4" />
                  <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section> */}

      {/* Categories */}
      <section
        className="py-8 md:py-16 bg-linear-to-br from-gray-50 to-white"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeaveCategory}
      >
        <div className="container mx-auto px-3 sm:px-4">
          <div className="flex items-center justify-between mb-4 sm:mb-6 md:mb-10">
            <div>
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-1 sm:mb-2">
                Shop by Category
              </h2>
              <p className="text-sm sm:text-base md:text-lg text-gray-600">Discover products by category</p>
            </div>
            <Link href="/categories">
              <Button
                variant="outline"
                className="hidden md:flex border-yellow-200 text-yellow-600 hover:bg-yellow-50"
              >
                View All <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div
            ref={categoryScrollRef}
            className="flex gap-2.5 md:gap-6 overflow-x-auto scrollbar-hide pb-4 cursor-grab -mx-4 px-4"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              WebkitOverflowScrolling: 'touch',
            }}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {/* Render categories twice for seamless infinite scroll */}
            {[...categories, ...categories].map((category, index) => (
              <div key={`${category.id}-${index}`} className="shrink-0 flex-[0_0_calc(25%-7.5px)] md:flex-none md:w-[180px]">
                <CategoryCard category={category} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="bg-gray-50 py-8 md:py-12">
        <div className="container mx-auto px-3 sm:px-4">
          <div className="flex items-center justify-between mb-4 sm:mb-6 md:mb-8">
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900">
              Featured Products
            </h2>
            <Link href="/products">
              <Button variant="outline" className="hidden md:flex">
                View All <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
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
        const category = categories.find((cat) => cat.id === categoryId)
        if (!category || products.length === 0) return null

        return (
          <section key={categoryId} className="py-8 md:py-12">
            <div className="container mx-auto px-4">
              {/* Category Banner Image */}
              {(category.banner_url || category.banner_image_url) && (
                <Link href={`/categories/${categoryId}`} className="block mb-6 md:mb-8">
                  <div className="relative w-full h-32 sm:h-40 md:h-48 lg:h-56 rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity">
                    <Image
                      src={category.banner_url || category.banner_image_url || ''}
                      alt={category.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                </Link>
              )}

              {/* Category Header */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-6 md:mb-8">
                <div className="flex items-center gap-2 md:gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 rounded-full bg-linear-to-br from-yellow-50 to-yellow-100 flex items-center justify-center shrink-0">
                    <Package className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-yellow-500" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-900">
                      {category.name}
                    </h2>
                    {category.description && (
                      <p className="text-sm md:text-base text-gray-600 line-clamp-1 sm:line-clamp-2 hidden sm:block">
                        {category.description}
                      </p>
                    )}
                  </div>
                </div>
                <div className="hidden sm:block flex-1 h-px bg-gray-200"></div>
                <Link href={`/products?category=${categoryId}`} className="self-start sm:self-auto">
                  <Button variant="outline" size="sm" className="text-xs sm:text-sm">
                    View All <ArrowRight className="ml-1 sm:ml-2 h-3 w-3 sm:h-4 sm:w-4" />
                  </Button>
                </Link>
              </div>

              {/* Products Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
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
