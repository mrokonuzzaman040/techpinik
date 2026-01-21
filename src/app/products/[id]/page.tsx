'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import {
  Star,
  ShoppingCart,
  Heart,
  Share2,
  Truck,
  Shield,
  RotateCcw,
  Minus,
  Plus,
  ArrowLeft,
  Zap,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import MainLayout from '@/components/layout/MainLayout'
import ProductCard from '@/components/ui/product-card'
import { createClient } from '@/lib/supabase'
import { Product, Category } from '@/types'
import { useCartStore } from '@/store/cart'

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const productId = params.id as string

  const [product, setProduct] = useState<Product | null>(null)
  const [category, setCategory] = useState<Category | null>(null)
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)

  const addToCart = useCartStore((state) => state.addItem)

  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) return

      const supabase = createClient()

      try {
        // Fetch product
        const { data: productData } = await supabase
          .from('products')
          .select('*')
          .eq('id', productId)
          .single()

        if (productData) {
          // Transform product data to match Product type
          const transformedProduct: Product = {
            id: productData.id,
            name: productData.name,
            description: productData.description || '',
            price: productData.price || 0,
            sale_price: productData.sale_price || undefined,
            sku: productData.sku || '',
            stock_quantity: productData.stock_quantity || 0,
            category_id: productData.category_id || undefined,
            images: Array.isArray(productData.images) 
              ? productData.images 
              : productData.image_url 
                ? [productData.image_url] 
                : [],
            image_url: Array.isArray(productData.images) && productData.images.length > 0
              ? productData.images[0]
              : productData.image_url || undefined,
            is_active: productData.is_active ?? true,
            is_featured: productData.is_featured ?? false,
            weight: productData.weight || undefined,
            dimensions: productData.dimensions || undefined,
            availability_status: productData.availability_status || 'in_stock',
            warranty: productData.warranty || undefined,
            brand: productData.brand || undefined,
            origin: productData.origin || undefined,
            key_features: Array.isArray(productData.key_features)
              ? productData.key_features
              : productData.key_features
                ? [productData.key_features]
                : undefined,
            box_contents: Array.isArray(productData.box_contents)
              ? productData.box_contents
              : productData.box_contents
                ? [productData.box_contents]
                : undefined,
            slug: productData.slug || '',
            created_at: productData.created_at || new Date().toISOString(),
            updated_at: productData.updated_at || new Date().toISOString(),
          }
          setProduct(transformedProduct)

          // Fetch category
          if (productData.category_id) {
            const { data: categoryData } = await supabase
              .from('categories')
              .select('*')
              .eq('id', productData.category_id)
              .single()

            setCategory(categoryData)

            // Fetch related products
            const { data: relatedData } = await supabase
              .from('products')
              .select('*')
              .eq('category_id', productData.category_id)
              .eq('is_active', true)
              .neq('id', productId)
              .limit(4)

            setRelatedProducts(relatedData || [])
          }
        }
      } catch (error) {
        console.error('Error fetching product:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [productId])

  const handleAddToCart = () => {
    if (!product) {
      console.error('Cannot add to cart: product is null')
      return
    }
    
    try {
      console.log('Adding to cart:', { productId: product.id, productName: product.name, quantity })
      addToCart(product, quantity)
      console.log('Successfully added to cart')
    } catch (error) {
      console.error('Error adding to cart:', error)
      alert('Failed to add product to cart. Please try again.')
    }
  }

  const handleOrderNow = () => {
    if (!product) return
    addToCart(product, quantity)
    router.push('/checkout')
  }

  const discountPercentage = product?.sale_price
    ? Math.round(((product.price - product.sale_price) / product.price) * 100)
    : 0

  // Use product images array
  const productImages =
    product?.images && product.images.length > 0
      ? product.images
      : [
          'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=product%20placeholder%20image&image_size=square',
        ]

  if (loading) {
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center px-4">
          <div className="animate-spin rounded-full h-24 w-24 sm:h-32 sm:w-32 border-b-2 border-yellow-600"></div>
        </div>
      </MainLayout>
    )
  }

  if (!product) {
    return (
      <MainLayout>
        <div className="container mx-auto px-3 sm:px-4 py-8 sm:py-12 text-center">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">Product Not Found</h1>
          <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">The product you're looking for doesn't exist.</p>
          <Link href="/products">
            <Button className="text-sm sm:text-base">Browse Products</Button>
          </Link>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm text-gray-600 mb-4 sm:mb-6 flex-wrap">
          <Link href="/" className="hover:text-yellow-600">
            Home
          </Link>
          <span>/</span>
          <Link href="/products" className="hover:text-yellow-600">
            Products
          </Link>
          {category && (
            <>
              <span>/</span>
              <Link href={`/categories/${category.id}`} className="hover:text-yellow-600 truncate max-w-[100px] sm:max-w-none">
                {category.name}
              </Link>
            </>
          )}
          <span>/</span>
          <span className="text-gray-900 truncate max-w-[120px] sm:max-w-none">{product.name}</span>
        </nav>

        {/* Back Button */}
        <Button variant="ghost" className="mb-4 sm:mb-6 text-sm" onClick={() => window.history.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-8 sm:mb-12">
          {/* Product Images */}
          <div className="space-y-3 sm:space-y-4">
            {/* Main Image */}
            <div className="aspect-square relative overflow-hidden rounded-lg border">
              <Image
                src={productImages[selectedImage]}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              {discountPercentage > 0 && (
                <Badge variant="destructive" className="absolute top-2 left-2 sm:top-4 sm:left-4 text-xs sm:text-sm">
                  -{discountPercentage}%
                </Badge>
              )}
            </div>

            {/* Thumbnail Images */}
            {productImages.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
                {productImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border-2 shrink-0 ${
                      selectedImage === index ? 'border-yellow-600' : 'border-gray-200'
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-4 sm:space-y-6">
            {/* Brand */}
            {product.brand && <p className="text-sm sm:text-base text-gray-600">{product.brand}</p>}

            {/* Title */}
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 leading-tight">{product.name}</h1>

            {/* Rating */}
            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-4 w-4 sm:h-5 sm:w-5 ${
                      star <= 4 ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs sm:text-sm text-gray-600">(4.0) • 24 reviews</span>
            </div>

            {/* Price */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                <span className="text-2xl sm:text-3xl font-bold text-yellow-600">
                  ৳{(product.sale_price || product.price).toLocaleString()}
                </span>
                {product.sale_price && (
                  <span className="text-lg sm:text-xl text-gray-500 line-through">
                    ৳{product.price.toLocaleString()}
                  </span>
                )}
              </div>
              {discountPercentage > 0 && (
                <p className="text-xs sm:text-sm text-yellow-600">
                  You save ৳
                  {(product.price - (product.sale_price || product.price)).toLocaleString()} (
                  {discountPercentage}%)
                </p>
              )}
            </div>

            {/* Availability */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm sm:text-base font-medium">Availability:</span>
              <Badge
                variant={product.stock_quantity > 0 ? 'default' : 'secondary'}
                className={`text-xs sm:text-sm ${product.stock_quantity > 0 ? 'bg-yellow-100 text-yellow-800' : ''}`}
              >
                {product.stock_quantity > 0 ? 'In Stock' : 'Out of Stock'}
                {product.stock_quantity > 0 && product.stock_quantity <= 5 && ' (Limited)'}
              </Badge>
            </div>

            {/* SKU */}
            {product.sku && <p className="text-xs sm:text-sm text-gray-600">SKU: {product.sku}</p>}

            {/* Quantity & Add to Cart */}
            {product.stock_quantity > 0 && (
              <div className="space-y-4 sm:space-y-5">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
                  <span className="text-sm sm:text-base font-medium">Quantity:</span>
                  <div className="flex items-center border rounded-lg">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                      className="h-9 w-9"
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="px-4 py-2 min-w-[60px] text-center text-sm sm:text-base">{quantity}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setQuantity(Math.min(product.stock_quantity, quantity + 1))}
                      disabled={quantity >= product.stock_quantity}
                      className="h-9 w-9"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <span className="text-xs sm:text-sm text-gray-500">{product.stock_quantity} available</span>
                </div>

                <div className="space-y-3">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button 
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        handleAddToCart()
                      }} 
                      variant="outline" 
                      className="flex-1 h-11 sm:h-10 text-sm sm:text-base"
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Add to Cart
                    </Button>
                    <Button
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        handleOrderNow()
                      }}
                      className="flex-1 h-11 sm:h-10 bg-yellow-600 hover:bg-yellow-700 text-sm sm:text-base"
                    >
                      <Zap className="h-4 w-4 mr-2" />
                      Order Now
                    </Button>
                  </div>
                  <div className="flex gap-3 justify-center">
                    <Button variant="outline" size="icon" className="h-10 w-10 sm:h-9 sm:w-9">
                      <Heart className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" className="h-10 w-10 sm:h-9 sm:w-9">
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Features */}
            <div className="grid grid-cols-3 gap-3 sm:gap-4 pt-4 sm:pt-6 border-t">
              <div className="text-center">
                <Truck className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-600 mx-auto mb-1 sm:mb-2" />
                <p className="text-xs sm:text-sm text-gray-600">Free Delivery</p>
              </div>
              <div className="text-center">
                <Shield className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-600 mx-auto mb-1 sm:mb-2" />
                <p className="text-xs sm:text-sm text-gray-600">Warranty</p>
              </div>
              <div className="text-center">
                <RotateCcw className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-600 mx-auto mb-1 sm:mb-2" />
                <p className="text-xs sm:text-sm text-gray-600">Easy Return</p>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <Card className="mb-8 sm:mb-12">
          <CardContent className="p-4 sm:p-6">
            <Tabs defaultValue="description" className="w-full">
              <TabsList className="grid w-full grid-cols-3 h-auto">
                <TabsTrigger value="description" className="text-xs sm:text-sm py-2 sm:py-2.5">Description</TabsTrigger>
                <TabsTrigger value="specifications" className="text-xs sm:text-sm py-2 sm:py-2.5">Specifications</TabsTrigger>
                <TabsTrigger value="reviews" className="text-xs sm:text-sm py-2 sm:py-2.5">Reviews</TabsTrigger>
              </TabsList>

              <TabsContent value="description" className="mt-4 sm:mt-6">
                <div className="prose max-w-none">
                  <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                    {product.description || 'No description available for this product.'}
                  </p>

                  {product.key_features && (
                    <div className="mt-4 sm:mt-6">
                      <h3 className="font-semibold text-base sm:text-lg text-gray-900 mb-2 sm:mb-3">Key Features:</h3>
                      <div className="whitespace-pre-line text-sm sm:text-base text-gray-700">
                        {product.key_features}
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="specifications" className="mt-4 sm:mt-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  {product.brand && (
                    <div className="flex justify-between py-2 sm:py-3 border-b">
                      <span className="font-medium text-sm sm:text-base">Brand</span>
                      <span className="text-sm sm:text-base">{product.brand}</span>
                    </div>
                  )}
                  {product.weight && (
                    <div className="flex justify-between py-2 sm:py-3 border-b">
                      <span className="font-medium text-sm sm:text-base">Weight</span>
                      <span className="text-sm sm:text-base">{product.weight}</span>
                    </div>
                  )}
                  {product.dimensions && (
                    <div className="flex justify-between py-2 sm:py-3 border-b">
                      <span className="font-medium text-sm sm:text-base">Dimensions</span>
                      <span className="text-sm sm:text-base">{product.dimensions}</span>
                    </div>
                  )}
                  {product.warranty && (
                    <div className="flex justify-between py-2 sm:py-3 border-b">
                      <span className="font-medium text-sm sm:text-base">Warranty</span>
                      <span className="text-sm sm:text-base">{product.warranty}</span>
                    </div>
                  )}
                  {product.origin && (
                    <div className="flex justify-between py-2 sm:py-3 border-b">
                      <span className="font-medium text-sm sm:text-base">Origin</span>
                      <span className="text-sm sm:text-base">{product.origin}</span>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="reviews" className="mt-4 sm:mt-6">
                <div className="text-center py-6 sm:py-8">
                  <p className="text-sm sm:text-base text-gray-600">
                    No reviews yet. Be the first to review this product!
                  </p>
                  <Button className="mt-4 text-sm sm:text-base">Write a Review</Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Related Products</h2>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} />
              ))}
            </div>
          </section>
        )}
      </div>
    </MainLayout>
  )
}
