'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Upload, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import AdminSidebar from '@/components/layout/AdminSidebar'
import { createClient } from '@/lib/supabase'
import { Category, ProductForm } from '@/types'

export default function AddProductPage() {
  const router = useRouter()
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)
  const [imagePreview, setImagePreview] = useState<string>('')

  const [formData, setFormData] = useState<ProductForm>({
    name: '',
    description: '',
    price: 0,
    sale_price: 0,
    sku: '',
    stock_quantity: 0,
    category_id: '',
    images: [],
    image_url: '',
    is_featured: false,
    is_active: true,
    weight: '',
    dimensions: '',
    availability_status: 'in_stock',
    warranty: '',
    brand: '',
    origin: '',
    key_features: [],
    box_contents: [],
  })

  useEffect(() => {
    fetchCategories()
  }, [])

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
    }
  }

  const handleInputChange = (field: keyof ProductForm, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setImagePreview(result)
        setFormData((prev) => ({ ...prev, image_url: result }))
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    setImagePreview('')
    setFormData((prev) => ({ ...prev, image_url: '' }))
  }

  const generateSKU = () => {
    const timestamp = Date.now().toString().slice(-6)
    const random = Math.random().toString(36).substring(2, 5).toUpperCase()
    return `PRD-${timestamp}-${random}`
  }

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const supabase = createClient()

    try {
      // Generate SKU if not provided
      const sku = formData.sku || generateSKU()
      
      // Generate slug from name
      const slug = generateSlug(formData.name)

      // Prepare images array - convert image_url to images array if it's a valid URL
      const images: string[] = []
      if (formData.image_url && formData.image_url.startsWith('http')) {
        images.push(formData.image_url)
      }

      // Prepare product data - only include fields that exist in the database schema
      const productData = {
        name: formData.name,
        description: formData.description || null,
        price: Number(formData.price) || 0,
        category_id: formData.category_id || null,
        images: images.length > 0 ? images : [],
        stock_quantity: Number(formData.stock_quantity) || 0,
        is_featured: formData.is_featured || false,
        is_active: formData.is_active ?? true,
        slug,
        sku,
      }

      const { error, data } = await supabase.from('products').insert([productData]).select()

      if (error) {
        console.error('Supabase error:', error)
        throw new Error(error.message || 'Failed to create product')
      }

      if (!data || data.length === 0) {
        throw new Error('Product was not created successfully')
      }

      alert('Product created successfully!')
      router.push('/admin/products')
    } catch (error) {
      console.error('Error creating product:', error)
      const errorMessage =
        error instanceof Error
          ? error.message
          : typeof error === 'object' && error !== null && 'message' in error
            ? String(error.message)
            : 'Unknown error occurred'
      alert(`Error creating product: ${errorMessage}. Please try again.`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar />

      <div className="flex-1 overflow-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <Button variant="ghost" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Add New Product</h1>
              <p className="text-gray-600">Create a new product for your store</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="max-w-4xl">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Information */}
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Basic Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="name">Product Name *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        placeholder="Enter product name"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                        placeholder="Enter product description"
                        rows={4}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="brand">Brand</Label>
                        <Input
                          id="brand"
                          value={formData.brand}
                          onChange={(e) => handleInputChange('brand', e.target.value)}
                          placeholder="Enter brand name"
                        />
                      </div>

                      <div>
                        <Label htmlFor="origin">Origin</Label>
                        <Input
                          id="origin"
                          value={formData.origin}
                          onChange={(e) => handleInputChange('origin', e.target.value)}
                          placeholder="e.g., Bangladesh, China"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="key_features">Key Features</Label>
                      <Textarea
                        id="key_features"
                        value={formData.key_features}
                        onChange={(e) => handleInputChange('key_features', e.target.value)}
                        placeholder="List key features (one per line)"
                        rows={3}
                      />
                    </div>

                    <div>
                      <Label htmlFor="box_contents">Box Contents</Label>
                      <Textarea
                        id="box_contents"
                        value={formData.box_contents}
                        onChange={(e) => handleInputChange('box_contents', e.target.value)}
                        placeholder="What's included in the box"
                        rows={2}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Pricing &amp; Inventory</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="price">Regular Price (৳) *</Label>
                        <Input
                          id="price"
                          type="number"
                          value={formData.price}
                          onChange={(e) => handleInputChange('price', e.target.value)}
                          placeholder="0"
                          min="0"
                          step="0.01"
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="sale_price">Sale Price (৳)</Label>
                        <Input
                          id="sale_price"
                          type="number"
                          value={formData.sale_price}
                          onChange={(e) => handleInputChange('sale_price', e.target.value)}
                          placeholder="0"
                          min="0"
                          step="0.01"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="sku">SKU</Label>
                        <Input
                          id="sku"
                          value={formData.sku}
                          onChange={(e) => handleInputChange('sku', e.target.value)}
                          placeholder="Auto-generated if empty"
                        />
                      </div>

                      <div>
                        <Label htmlFor="stock_quantity">Stock Quantity *</Label>
                        <Input
                          id="stock_quantity"
                          type="number"
                          value={formData.stock_quantity}
                          onChange={(e) => handleInputChange('stock_quantity', e.target.value)}
                          placeholder="0"
                          min="0"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="weight">Weight</Label>
                        <Input
                          id="weight"
                          value={formData.weight}
                          onChange={(e) => handleInputChange('weight', e.target.value)}
                          placeholder="e.g., 500g, 1.2kg"
                        />
                      </div>

                      <div>
                        <Label htmlFor="dimensions">Dimensions</Label>
                        <Input
                          id="dimensions"
                          value={formData.dimensions}
                          onChange={(e) => handleInputChange('dimensions', e.target.value)}
                          placeholder="e.g., 20x15x10 cm"
                        />
                      </div>
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
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Product Image</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {imagePreview ? (
                        <div className="relative">
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="w-full h-48 object-cover rounded-lg"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="absolute top-2 right-2"
                            onClick={removeImage}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                          <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                          <p className="text-sm text-gray-600 mb-2">Upload product image</p>
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                            id="image-upload"
                          />
                          <Label htmlFor="image-upload" className="cursor-pointer">
                            <Button type="button" variant="outline" size="sm">
                              Choose File
                            </Button>
                          </Label>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Organization</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="category">Category *</Label>
                      <Select
                        value={formData.category_id}
                        onValueChange={(value) => handleInputChange('category_id', value)}
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
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
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center justify-between">
                      <Label htmlFor="is_active">Active Status</Label>
                      <Switch
                        id="is_active"
                        checked={formData.is_active}
                        onCheckedChange={(checked) => handleInputChange('is_active', checked)}
                      />
                    </div>
                  </CardContent>
                </Card>

                <div className="flex gap-2">
                  <Button type="submit" className="flex-1" disabled={loading}>
                    {loading ? 'Creating...' : 'Create Product'}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => router.back()}>
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
