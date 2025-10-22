'use client'

import { useEffect, useState } from 'react'
import { ArrowLeft, Plus, Edit, Trash2, Eye, EyeOff, Upload, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import AdminSidebar from '@/components/layout/AdminSidebar'
import { createClient } from '@/lib/supabase'
import { SliderItem } from '@/types'
import Link from 'next/link'

export default function SliderManagementPage() {
  const [sliders, setSliders] = useState<SliderItem[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingSlider, setEditingSlider] = useState<SliderItem | null>(null)
  const [imagePreview, setImagePreview] = useState<string>('')
  const [imageFile, setImageFile] = useState<File | null>(null)

  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    description: '',
    button_text: '',
    button_link: '',
    is_active: true,
    sort_order: 1
  })

  useEffect(() => {
    fetchSliders()
  }, [])

  const fetchSliders = async () => {
    const supabase = createClient()

    try {
      const { data, error } = await supabase
        .from('slider_items')
        .select('*')
        .order('sort_order')

      if (error) throw error

      setSliders(data || [])
    } catch (error) {
      console.error('Error fetching sliders:', error)
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      subtitle: '',
      description: '',
      button_text: '',
      button_link: '',
      is_active: true,
      sort_order: 1
    })
    setImagePreview('')
    setImageFile(null)
    setEditingSlider(null)
  }

  const openAddDialog = () => {
    resetForm()
    setFormData(prev => ({ ...prev, sort_order: sliders.length + 1 }))
    setIsDialogOpen(true)
  }

  const openEditDialog = (slider: SliderItem) => {
    setEditingSlider(slider)
    setFormData({
      title: slider.title || '',
      subtitle: slider.subtitle || '',
      description: slider.description || '',
      button_text: slider.button_text || '',
      button_link: slider.button_link || '',
      is_active: slider.is_active ?? true,
      sort_order: slider.sort_order || 1
    })
    setImagePreview(slider.image_url || '')
    setImageFile(null)
    setIsDialogOpen(true)
  }

  const handleInputChange = (field: string, value: string | boolean | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
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
    const supabase = createClient()
    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}.${fileExt}`
    const filePath = `sliders/${fileName}`

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
      
      let imageUrl = editingSlider?.image_url || ''
      
      // Upload new image if selected
      if (imageFile) {
        imageUrl = await uploadImage(imageFile)
      } else if (!imagePreview && !editingSlider) {
        alert('Please select an image for the slider')
        setSaving(false)
        return
      }

      const sliderData = {
        title: formData.title,
        subtitle: formData.subtitle,
        description: formData.description,
        button_text: formData.button_text,
        button_link: formData.button_link,
        image_url: imageUrl,
        is_active: formData.is_active,
        sort_order: formData.sort_order
      }

      if (editingSlider) {
        // Update existing slider
        const { error } = await supabase
          .from('slider_items')
          .update({ ...sliderData, updated_at: new Date().toISOString() })
          .eq('id', editingSlider.id)

        if (error) throw error
      } else {
        // Create new slider
        const { error } = await supabase
          .from('slider_items')
          .insert([sliderData])

        if (error) throw error
      }

      await fetchSliders()
      setIsDialogOpen(false)
      resetForm()
      alert(editingSlider ? 'Slider updated successfully!' : 'Slider created successfully!')
    } catch (error) {
      console.error('Error saving slider:', error)
      alert('Error saving slider. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const toggleSliderStatus = async (slider: SliderItem) => {
    const supabase = createClient()

    try {
      const { error } = await supabase
        .from('slider_items')
        .update({ 
          is_active: !slider.is_active,
          updated_at: new Date().toISOString()
        })
        .eq('id', slider.id)

      if (error) throw error

      await fetchSliders()
    } catch (error) {
      console.error('Error updating slider status:', error)
      alert('Error updating slider status. Please try again.')
    }
  }

  const deleteSlider = async (slider: SliderItem) => {
    if (!confirm('Are you sure you want to delete this slider? This action cannot be undone.')) {
      return
    }

    const supabase = createClient()

    try {
      const { error } = await supabase
        .from('slider_items')
        .delete()
        .eq('id', slider.id)

      if (error) throw error

      await fetchSliders()
      alert('Slider deleted successfully!')
    } catch (error) {
      console.error('Error deleting slider:', error)
      alert('Error deleting slider. Please try again.')
    }
  }

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-50">
        <AdminSidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
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
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <Link href="/admin/settings">
                <Button variant="ghost">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Settings
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Slider Management</h1>
                <p className="text-gray-600">Manage homepage hero slider images and content</p>
              </div>
            </div>
            <Button onClick={openAddDialog}>
              <Plus className="h-4 w-4 mr-2" />
              Add Slider
            </Button>
          </div>

          {/* Sliders Table */}
          <Card>
            <CardHeader>
              <CardTitle>Slider Items ({sliders.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {sliders.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">No slider items found</p>
                  <Button onClick={openAddDialog}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add First Slider
                  </Button>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Image</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Subtitle</TableHead>
                      <TableHead>Order</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sliders.map((slider) => (
                      <TableRow key={slider.id}>
                        <TableCell>
                          {slider.image_url ? (
                            <img
                              src={slider.image_url}
                              alt={slider.title || 'Slider'}
                              className="w-16 h-10 object-cover rounded"
                            />
                          ) : (
                            <div className="w-16 h-10 bg-gray-200 rounded flex items-center justify-center">
                              <span className="text-xs text-gray-500">No Image</span>
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{slider.title}</p>
                            {slider.button_text && (
                              <p className="text-sm text-gray-500">Button: {slider.button_text}</p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <p className="text-sm text-gray-600">{slider.subtitle}</p>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{slider.sort_order}</Badge>
                        </TableCell>
                        <TableCell>
                          <button
                            onClick={() => toggleSliderStatus(slider)}
                            className="flex items-center gap-1"
                          >
                            {slider.is_active ? (
                              <>
                                <Eye className="h-4 w-4 text-green-600" />
                                <Badge className="bg-green-100 text-green-800">Active</Badge>
                              </>
                            ) : (
                              <>
                                <EyeOff className="h-4 w-4 text-gray-400" />
                                <Badge variant="secondary">Inactive</Badge>
                              </>
                            )}
                          </button>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openEditDialog(slider)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteSlider(slider)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          {/* Add/Edit Dialog */}
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingSlider ? 'Edit Slider' : 'Add New Slider'}
                </DialogTitle>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Image Upload */}
                <div>
                  <Label>Slider Image *</Label>
                  {imagePreview && (
                    <div className="relative inline-block mt-2">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-48 object-cover rounded-lg border"
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
                  
                  <div className="mt-2">
                    <Input
                      id="image"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById('image')?.click()}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      {imagePreview ? 'Change Image' : 'Upload Image'}
                    </Button>
                    <p className="text-sm text-gray-500 mt-1">
                      Recommended size: 1920x800px
                    </p>
                  </div>
                </div>

                {/* Content Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      placeholder="Main heading"
                    />
                  </div>
                  <div>
                    <Label htmlFor="subtitle">Subtitle</Label>
                    <Input
                      id="subtitle"
                      value={formData.subtitle}
                      onChange={(e) => handleInputChange('subtitle', e.target.value)}
                      placeholder="Secondary heading"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Brief description"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="button_text">Button Text</Label>
                    <Input
                      id="button_text"
                      value={formData.button_text}
                      onChange={(e) => handleInputChange('button_text', e.target.value)}
                      placeholder="e.g., Shop Now"
                    />
                  </div>
                  <div>
                    <Label htmlFor="button_link">Button Link</Label>
                    <Input
                      id="button_link"
                      value={formData.button_link}
                      onChange={(e) => handleInputChange('button_link', e.target.value)}
                      placeholder="e.g., /products"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="sort_order">Sort Order</Label>
                    <Input
                      id="sort_order"
                      type="number"
                      value={formData.sort_order}
                      onChange={(e) => handleInputChange('sort_order', parseInt(e.target.value) || 1)}
                      min="1"
                    />
                  </div>
                  <div className="flex items-center space-x-2 pt-6">
                    <Switch
                      id="is_active"
                      checked={formData.is_active}
                      onCheckedChange={(checked) => handleInputChange('is_active', checked)}
                    />
                    <Label htmlFor="is_active">Active</Label>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <Button type="submit" disabled={saving}>
                    {saving ? 'Saving...' : editingSlider ? 'Update Slider' : 'Add Slider'}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  )
}