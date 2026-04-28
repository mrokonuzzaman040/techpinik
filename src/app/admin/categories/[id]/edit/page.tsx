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
import { createClient } from '@/lib/supabase'
import { Category } from '@/types'
import { toast } from 'sonner'

export default function EditCategoryPage() {
  const params = useParams()
  const router = useRouter()
  const categoryId = params.id as string

  const [category, setCategory] = useState<Category | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [iconPreview, setIconPreview] = useState<string>('')
  const [iconFile, setIconFile] = useState<File | null>(null)
  const iconInputRef = useRef<HTMLInputElement>(null)

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    is_active: true,
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
      setIconPreview(data.image_url || data.icon || '')

      setFormData({
        name: data.name || '',
        description: data.description || '',
        is_active: data.is_active ?? true,
      })
    } catch (error) {
      console.error('Error fetching category:', error)
      toast.error('Error loading category data. Please try again.')
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

  const removeIcon = () => {
    setIconFile(null)
    setIconPreview('')
  }

  const uploadImage = async (file: File, folder: string): Promise<string> => {
    const supabase = createClient()
    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}.${fileExt}`
    const filePath = `${folder}/${fileName}`

    const { error: uploadError } = await supabase.storage.from('images').upload(filePath, file)

    if (uploadError) {
      throw uploadError
    }

    const { data } = supabase.storage.from('images').getPublicUrl(filePath)

    return data.publicUrl
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const supabase = createClient()

      let iconUrl = category?.image_url || category?.icon || ''

      // Upload new icon if selected
      if (iconFile) {
        iconUrl = await uploadImage(iconFile, 'categories/icons')
      } else if (!iconPreview) {
        iconUrl = ''
      }

      const updateData = {
        name: formData.name,
        description: formData.description,
        image_url: iconUrl,
        // Keep legacy field in sync for older reads.
        icon: iconUrl,
        is_active: formData.is_active,
      }

      const response = await fetch(`/api/categories/${categoryId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      })

      const result = await response.json().catch(() => ({}))

      if (!response.ok || !result?.success) {
        throw new Error(result?.error || 'Failed to update category')
      }

      toast.success('Category updated successfully!')
      router.push('/admin/categories')
    } catch (error) {
      console.error('Error updating category:', error)
      const message =
        error instanceof Error ? error.message : 'Error updating category. Please try again.'
      toast.error(message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 w-44 rounded bg-gray-200" />
        <div className="h-48 rounded-xl border border-gray-200 bg-white" />
        <div className="h-48 rounded-xl border border-gray-200 bg-white" />
      </div>
    )
  }

  if (!category) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Category Not Found</h2>
          <p className="text-gray-600 mb-4">
            The category you&rsquo;re looking for doesn&rsquo;t exist.
          </p>
          <Button onClick={() => router.push('/admin/categories')}>Back to Categories</Button>
        </div>
      </div>
    )
  }

  return (
    <div>
      <AdminPageHeader
        title="Edit Category"
        description="Update category information."
        leading={
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        }
      />

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
                <div className="relative inline-block max-w-full">
                  <img
                    src={iconPreview}
                    alt="Icon preview"
                    className="h-24 w-24 max-w-full object-cover rounded-lg border"
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
                <div className="mt-1 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-4">
                  <Input
                    id="icon"
                    type="file"
                    accept="image/*"
                    onChange={handleIconChange}
                    className="hidden"
                    ref={iconInputRef}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full sm:w-auto"
                    onClick={() => iconInputRef.current?.click()}
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

        {/* Submit Button */}
        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:gap-4">
          <Button type="submit" disabled={saving} className="w-full sm:w-auto">
            {saving ? 'Updating...' : 'Update Category'}
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
