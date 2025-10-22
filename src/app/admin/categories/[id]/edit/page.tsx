'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Upload, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import AdminSidebar from '@/components/layout/AdminSidebar'
import { createClient } from '@/lib/supabase'
import { Category } from '@/types'

export default function EditCategoryPage() {
  const params = useParams()
  const router = useRouter()
  const categoryId = params.id as string

  const [category, setCategory] = useState<Category | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [iconPreview, setIconPreview] = useState<string>('')
  const [bannerPreview, setBannerPreview] = useState<string>('')
  const [iconFile, setIconFile] = useState<File | null>(null)
  const [bannerFile, setBannerFile] = useState<File | null>(null)

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    is_active: true
  })

  useEffect(() => {
    fetchCategory()
  }, [categoryId])

  const fetchCategory = async () => {
    const supabase = createClient()

    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('id', categoryId)
        .single()

      if (error) throw error

      setCategory(data)
      setIconPreview(data.icon_url || '')
      setBannerPreview(data.banner_url || '')
      
      setFormData({
        name: data.name || '',
        description: data.description || '',
        is_active: data.is_active ?? true
      })
    } catch (error) {
      console.error('Error fetching category:', error)
      alert('Error loading category data. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleIconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setIconFile(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setIconPreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setBannerFile(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setBannerPreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeIcon = () => {
    setIconFile(null)
    setIconPreview('')
  }

  const removeBanner = () => {
    setBannerFile(null)
    setBannerPreview('')
  }

  const uploadImage = async (file: File, folder: string): Promise<string> => {
    const supabase = createClient()
    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}.${fileExt}`
    const filePath = `${folder}/${fileName}`

    const { error: uploadError } = await supabase.storage
      .from('images')
      .upload(filePath, file)

    if (uploadError) {
      throw uploadError
    }

    const { data } = supabase.storage
      .from('images')
      .getPublicUrl(filePath)

    return data.publicUrl
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const supabase = createClient()
      
      let iconUrl = category?.icon_url || ''
      let bannerUrl = category?.banner_url || ''
      
      // Upload new icon if selected
      if (iconFile) {
        iconUrl = await uploadImage(iconFile, 'categories/icons')
      } else if (!iconPreview) {
        iconUrl = ''
      }

      // Upload new banner if selected
      if (bannerFile) {
        bannerUrl = await uploadImage(bannerFile, 'categories/banners')
      } else if (!bannerPreview) {
        bannerUrl = ''
      }

      const updateData = {
        name: formData.name,
        description: formData.description,
        icon_url: iconUrl,
        banner_url: bannerUrl,
        is_active: formData.is_active,
        updated_at: new Date().toISOString()
      }

      const { error } = await supabase
        .from('categories')
        .update(updateData)
        .eq('id', categoryId)

      if (error) throw error

      alert('Category updated successfully!')
      router.push('/admin/categories')
    } catch (error) {
      console.error('Error updating category:', error)
      alert('Error updating category. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-50">
        <AdminSidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600"></div>
        </div>
      </div>
    )
  }

  if (!category) {
    return (
      <div className="flex h-screen bg-gray-50">
        <AdminSidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Category Not Found</h2>
            <p className="text-gray-600 mb-4">The category you're looking for doesn't exist.</p>
            <Button onClick={() => router.push('/admin/categories')}>
              Back to Categories
            </Button>
          </div>
        </div>
      </div>
    )
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
              <h1 className="text-2xl font-bold text-gray-900">Edit Category</h1>
              <p className="text-gray-600">Update category information</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="name">Category Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    rows={4}
                    placeholder="Brief description of the category"
                  />
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

            {/* Category Icon */}
            <Card>
              <CardHeader>
                <CardTitle>Category Icon</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {iconPreview && (
                    <div className="relative inline-block">
                      <img
                        src={iconPreview}
                        alt="Icon preview"
                        className="w-24 h-24 object-cover rounded-lg border"
                      />
                      <button
                        type="button"
                        onClick={removeIcon}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                  
                  <div>
                    <Label htmlFor="icon">Upload New Icon</Label>
                    <div className="mt-1 flex items-center gap-4">
                      <Input
                        id="icon"
                        type="file"
                        accept="image/*"
                        onChange={handleIconChange}
                        className="hidden"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => document.getElementById('icon')?.click()}
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Choose Icon
                      </Button>
                      <span className="text-sm text-gray-500">
                        Square image recommended (e.g., 200x200px)
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Category Banner */}
            <Card>
              <CardHeader>
                <CardTitle>Category Banner</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {bannerPreview && (
                    <div className="relative inline-block">
                      <img
                        src={bannerPreview}
                        alt="Banner preview"
                        className="w-64 h-32 object-cover rounded-lg border"
                      />
                      <button
                        type="button"
                        onClick={removeBanner}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                  
                  <div>
                    <Label htmlFor="banner">Upload New Banner</Label>
                    <div className="mt-1 flex items-center gap-4">
                      <Input
                        id="banner"
                        type="file"
                        accept="image/*"
                        onChange={handleBannerChange}
                        className="hidden"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => document.getElementById('banner')?.click()}
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Choose Banner
                      </Button>
                      <span className="text-sm text-gray-500">
                        Wide image recommended (e.g., 1200x400px)
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Submit Button */}
            <div className="flex gap-4">
              <Button type="submit" disabled={saving}>
                {saving ? 'Updating...' : 'Update Category'}
              </Button>
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}