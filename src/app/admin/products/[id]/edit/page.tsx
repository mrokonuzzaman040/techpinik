'use client'

import { useEffect, useRef, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Upload, X } from 'lucide-react'
import AdminPageHeader from '@/components/admin/AdminPageHeader'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { createClient } from '@/lib/supabase'
import { Product, Category } from '@/types'
import { toast } from 'sonner'

export default function EditProductPage() {
  const params = useParams()
  const router = useRouter()
  const productId = params.id as string

  const [product, setProduct] = useState<Product | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [imagePreview, setImagePreview] = useState<string>('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const imageInputRef = useRef<HTMLInputElement>(null)

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    brand: '',
    origin: '',
    key_features: '',
    box_contents: '',
    sale_price: '',
    sku: '',
    stock_quantity: '',
    weight: '',
    dimensions: '',
    warranty: '',
    category_id: '',
    availability_status: 'in_stock',
    is_active: true,
  })

  useEffect(() => {
    fetchData()
  }, [productId])

  const fetchData = async () => {
    const supabase = createClient()

    try {
      // Fetch product
      const { data: productData, error: productError } = await supabase
        .from('products')
        .select('*')
        .eq('id', productId)
        .single()

      if (productError) throw productError

      // Fetch categories
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('categories')
        .select('*')
        // Include categories where is_active is true or null (legacy rows).
        .neq('is_active', false)
        .order('name')

      if (categoriesError) throw categoriesError

      setProduct(productData)
      setCategories(categoriesData || [])

      // Product images are stored in `images` (JSON array), not image_url
      const images = productData.images as string[] | null | undefined
      const firstImage =
        Array.isArray(images) && images.length > 0
          ? images[0]
          : typeof images === 'string'
            ? images
            : ''
      setImagePreview(firstImage || '')

      // Populate form data - only DB columns: name, description, price, category_id, stock_quantity, is_featured
      setFormData({
        name: productData.name || '',
        description: productData.description || '',
        price: productData.price?.toString() ?? '',
        brand: (productData as any).brand || '',
        origin: (productData as any).origin || '',
        key_features:
          typeof (productData as any).key_features === 'string'
            ? (productData as any).key_features
            : '',
        box_contents: (productData as any).box_contents || '',
        sale_price: (productData as any).sale_price?.toString() || '',
        sku: (productData as any).sku || '',
        stock_quantity: productData.stock_quantity?.toString() ?? '',
        weight: (productData as any).weight?.toString() || '',
        dimensions: (productData as any).dimensions || '',
        warranty: (productData as any).warranty || '',
        category_id: productData.category_id || '',
        availability_status: (productData as any).availability_status || 'in_stock',
        is_active: (productData as any).is_active ?? true,
      })
    } catch (error) {
      console.error('Error fetching data:', error)
      toast.error('Error loading product data. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    setImageFile(null)
    setImagePreview('')
  }

  const uploadImage = async (file: File): Promise<string> => {
    try {
      const supabase = createClient()
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}.${fileExt}`
      const filePath = `products/${fileName}`

      const { error: uploadError } = await supabase.storage.from('images').upload(filePath, file)

      if (uploadError) {
        console.error('Image upload error:', uploadError)
        throw new Error(uploadError.message || 'Failed to upload image')
      }

      const { data } = supabase.storage.from('images').getPublicUrl(filePath)

      if (!data?.publicUrl) {
        throw new Error('Failed to get public URL for uploaded image')
      }

      return data.publicUrl
    } catch (error) {
      console.error('Error in uploadImage:', error)
      throw error
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const supabase = createClient()

      // Build images array: product uses `images` (JSON array), not image_url
      let images: string[] = []
      if (imageFile) {
        const url = await uploadImage(imageFile)
        images = [url]
      } else if (imagePreview) {
        const existing = (product?.images as string[] | null) || []
        images = Array.isArray(existing) ? [...existing] : [existing].filter(Boolean)
      }

      // Only update columns that exist in the products table: name, description, price, category_id, images, stock_quantity, is_featured, updated_at
      const updateData = {
        name: formData.name,
        description: formData.description || null,
        price: parseFloat(formData.price) || 0,
        category_id: formData.category_id || null,
        images,
        stock_quantity: parseInt(formData.stock_quantity, 10) || 0,
        is_featured: (product as any)?.is_featured ?? false,
        updated_at: new Date().toISOString(),
      }

      const { error } = await supabase.from('products').update(updateData).eq('id', productId)

      if (error) {
        console.error('Supabase error:', error)
        throw new Error(error.message || 'Failed to update product')
      }

      toast.success('Product updated successfully!')
      router.push('/admin/products')
    } catch (error) {
      console.error('Error updating product:', error)
      const errorMessage =
        error instanceof Error
          ? error.message
          : typeof error === 'object' && error !== null && 'message' in error
            ? String(error.message)
            : 'Unknown error occurred'
      toast.error(`Error updating product: ${errorMessage}. Please try again.`)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 w-44 rounded bg-gray-200" />
        <div className="h-64 rounded-xl border border-gray-200 bg-white" />
        <div className="h-56 rounded-xl border border-gray-200 bg-white" />
        <div className="h-56 rounded-xl border border-gray-200 bg-white" />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Product Not Found</h2>
          <p className="text-gray-600 mb-4">
            The product you&rsquo;re looking for doesn&rsquo;t exist.
          </p>
          <Button onClick={() => router.push('/admin/products')}>Back to Products</Button>
        </div>
      </div>
    )
  }

  return (
    <div>
      <AdminPageHeader
        title="Edit Product"
        description="Update product information."
        leading={
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        }
      />

      <form onSubmit={handleSubmit} className="max-w-4xl space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Product Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="brand">Brand</Label>
                <Input
                  id="brand"
                  value={formData.brand}
                  onChange={(e) => handleInputChange('brand', e.target.value)}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={4}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="origin">Origin</Label>
                <Input
                  id="origin"
                  value={formData.origin}
                  onChange={(e) => handleInputChange('origin', e.target.value)}
                  placeholder="e.g., Bangladesh, China, USA"
                />
              </div>
              <div>
                <Label htmlFor="warranty">Warranty</Label>
                <Input
                  id="warranty"
                  value={formData.warranty}
                  onChange={(e) => handleInputChange('warranty', e.target.value)}
                  placeholder="e.g., 1 year, 6 months"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="key_features">Key Features</Label>
              <Textarea
                id="key_features"
                value={formData.key_features}
                onChange={(e) => handleInputChange('key_features', e.target.value)}
                rows={3}
                placeholder="List key features separated by new lines"
              />
            </div>

            <div>
              <Label htmlFor="box_contents">Box Contents</Label>
              <Textarea
                id="box_contents"
                value={formData.box_contents}
                onChange={(e) => handleInputChange('box_contents', e.target.value)}
                rows={3}
                placeholder="List what's included in the box"
              />
            </div>
          </CardContent>
        </Card>

        {/* Pricing and Inventory */}
        <Card>
          <CardHeader>
            <CardTitle>Pricing and Inventory</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="price">Price (৳) *</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => handleInputChange('price', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="sale_price">Sale Price (৳)</Label>
                <Input
                  id="sale_price"
                  type="number"
                  step="0.01"
                  value={formData.sale_price}
                  onChange={(e) => handleInputChange('sale_price', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="stock_quantity">Stock Quantity *</Label>
                <Input
                  id="stock_quantity"
                  type="number"
                  value={formData.stock_quantity}
                  onChange={(e) => handleInputChange('stock_quantity', e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="sku">SKU *</Label>
                <Input
                  id="sku"
                  value={formData.sku}
                  onChange={(e) => handleInputChange('sku', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  step="0.01"
                  value={formData.weight}
                  onChange={(e) => handleInputChange('weight', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="dimensions">Dimensions</Label>
                <Input
                  id="dimensions"
                  value={formData.dimensions}
                  onChange={(e) => handleInputChange('dimensions', e.target.value)}
                  placeholder="L x W x H"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Product Image */}
        <Card>
          <CardHeader>
            <CardTitle>Product Image</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {imagePreview && (
                <div className="relative inline-block max-w-full">
                  <img
                    src={imagePreview}
                    alt="Product preview"
                    className="h-32 w-32 max-w-full object-cover rounded-lg border"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}

              <div>
                <Label htmlFor="image">Upload New Image</Label>
                <div className="mt-1 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-4">
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    ref={imageInputRef}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full sm:w-auto"
                    onClick={() => imageInputRef.current?.click()}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Choose Image
                  </Button>
                  <span className="text-sm text-gray-500">JPG, PNG up to 5MB</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Organization */}
        <Card>
          <CardHeader>
            <CardTitle>Organization</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category_id">Category *</Label>
                <Select
                  value={formData.category_id}
                  onValueChange={(value) => handleInputChange('category_id', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="availability_status">Availability Status</Label>
                <Select
                  value={formData.availability_status}
                  onValueChange={(value) => handleInputChange('availability_status', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="in_stock">In Stock</SelectItem>
                    <SelectItem value="out_of_stock">Out of Stock</SelectItem>
                    <SelectItem value="pre_order">Pre Order</SelectItem>
                    <SelectItem value="discontinued">Discontinued</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) => handleInputChange('is_active', checked)}
              />
              <Label htmlFor="is_active">Active (visible to customers)</Label>
            </div>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:gap-4">
          <Button type="submit" disabled={saving} className="w-full sm:w-auto">
            {saving ? 'Updating...' : 'Update Product'}
          </Button>
          <Button
            type="button"
            variant="outline"
            className="w-full sm:w-auto"
            onClick={() => router.back()}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  )
}
