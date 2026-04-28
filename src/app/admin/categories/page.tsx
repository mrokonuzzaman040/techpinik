'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Plus, Search, Edit, Trash2, Eye, MoreHorizontal, Tag, ArrowUp, ArrowDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import AdminPageHeader from '@/components/admin/AdminPageHeader'
import { createClient } from '@/lib/supabase'
import { Category } from '@/types'
import { toast } from 'sonner'

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [deleteCategoryId, setDeleteCategoryId] = useState<string | null>(null)

  useEffect(() => {
    fetchCategories()
  }, [searchQuery, selectedStatus])

  const fetchCategories = async () => {
    setLoading(true)
    const supabase = createClient()

    try {
      let query = supabase.from('categories').select(`
          *,
          products (count)
        `)

      // Apply filters
      if (searchQuery) {
        query = query.ilike('name', `%${searchQuery}%`)
      }

      if (selectedStatus !== 'all') {
        query = query.eq('is_active', selectedStatus === 'active')
      }

      query = query.order('sort_order', { ascending: true }).order('created_at', { ascending: false })

      const { data, error } = await query

      if (error) throw error

      setCategories(data || [])
    } catch (error) {
      console.error('Error fetching categories:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteCategory = async (categoryId: string) => {
    const supabase = createClient()

    try {
      // Check if category has products
      const { count } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })
        .eq('category_id', categoryId)

      if (count && count > 0) {
        toast.error(
          'Cannot delete category with existing products. Please move or delete the products first.'
        )
        setDeleteCategoryId(null)
        return
      }

      const { error } = await supabase.from('categories').delete().eq('id', categoryId)

      if (error) throw error

      setCategories(categories.filter((c) => c.id !== categoryId))
      setDeleteCategoryId(null)
    } catch (error) {
      console.error('Error deleting category:', error)
      toast.error('Error deleting category. Please try again.')
    }
  }

  const toggleCategoryStatus = async (categoryId: string, currentStatus: boolean) => {
    const supabase = createClient()

    try {
      const { error } = await supabase
        .from('categories')
        .update({ is_active: !currentStatus })
        .eq('id', categoryId)

      if (error) throw error

      setCategories(
        categories.map((c) => (c.id === categoryId ? { ...c, is_active: !currentStatus } : c))
      )
    } catch (error) {
      console.error('Error updating category status:', error)
    }
  }

  const moveCategory = async (categoryId: string, direction: 'up' | 'down') => {
    const currentIndex = categories.findIndex((category) => category.id === categoryId)
    if (currentIndex === -1) return

    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1
    if (targetIndex < 0 || targetIndex >= categories.length) return

    const updatedCategories = [...categories]
    ;[updatedCategories[currentIndex], updatedCategories[targetIndex]] = [
      updatedCategories[targetIndex],
      updatedCategories[currentIndex],
    ]

    setCategories(updatedCategories)

    const updates = updatedCategories.map((category, index) => ({
      id: category.id,
      sort_order: index,
      updated_at: new Date().toISOString(),
    }))

    const supabase = createClient()
    const { error } = await supabase.from('categories').upsert(updates, { onConflict: 'id' })

    if (error) {
      toast.error('Failed to update category order. Please try again.')
      await fetchCategories()
      return
    }

    toast.success('Category order updated.')
  }

  const getStatusBadge = (isActive: boolean) => {
    return isActive ? (
      <Badge variant="default">Active</Badge>
    ) : (
      <Badge variant="secondary">Inactive</Badge>
    )
  }

  const getCategoryImageSrc = (category: Category) => {
    const raw = ((category as any).image_url || (category as any).icon || '').trim()
    if (!raw) return null

    // Accept absolute URLs, root-relative paths, and data URLs.
    if (raw.startsWith('http://') || raw.startsWith('https://') || raw.startsWith('/') || raw.startsWith('data:image/')) {
      return raw
    }

    return null
  }

  return (
    <div>
      <AdminPageHeader
        title="Categories"
        description="Manage your product categories."
        actions={
          <Link href="/admin/categories/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Category
            </Button>
          </Link>
        }
      />

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search categories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-full md:w-32">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Categories Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Tag className="h-5 w-5" />
            Categories ({categories.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3 animate-pulse py-2">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="h-16 rounded-lg border border-gray-200 bg-gray-100" />
              ))}
            </div>
          ) : categories.length === 0 ? (
            <div className="text-center py-12">
              <Tag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No categories found</h3>
              <p className="text-gray-600 mb-4">Get started by adding your first category.</p>
              <Link href="/admin/categories/new">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Category
                </Button>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Category</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Products</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-center">Move</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categories.map((category, index) => (
                    <TableRow key={category.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="h-12 w-12 relative rounded-lg overflow-hidden bg-gray-100">
                            {getCategoryImageSrc(category) ? (
                              <img
                                src={getCategoryImageSrc(category)!}
                                alt={category.name}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="h-full w-full flex items-center justify-center">
                                <Tag className="h-6 w-6 text-gray-400" />
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{category.name}</p>
                            <p className="text-sm text-gray-600">
                              Created {new Date(category.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm text-gray-600 max-w-xs truncate">
                          {category.description || 'No description'}
                        </p>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm font-medium">
                          {(category as any).products?.[0]?.count || 0} products
                        </span>
                      </TableCell>
                      <TableCell>{getStatusBadge(category.is_active ?? true)}</TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            disabled={index === 0}
                            onClick={() => moveCategory(category.id, 'up')}
                            aria-label={`Move ${category.name} up`}
                          >
                            <ArrowUp className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            disabled={index === categories.length - 1}
                            onClick={() => moveCategory(category.id, 'down')}
                            aria-label={`Move ${category.name} down`}
                          >
                            <ArrowDown className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link href={`/categories/${category.id}`}>
                                <Eye className="h-4 w-4 mr-2" />
                                View
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link href={`/admin/categories/${category.id}/edit`}>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                toggleCategoryStatus(category.id, category.is_active ?? true)
                              }
                            >
                              {(category.is_active ?? true) ? 'Deactivate' : 'Activate'}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => setDeleteCategoryId(category.id)}
                              className="text-red-600"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteCategoryId} onOpenChange={() => setDeleteCategoryId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the category and remove it
              from our servers. Make sure there are no products in this category.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteCategoryId && handleDeleteCategory(deleteCategoryId)}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
