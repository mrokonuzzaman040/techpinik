import { NextRequest } from 'next/server'
import { createServerClient } from '@/lib/supabase'; import { isAdmin } from '@/lib/supabase-server'
import { apiResponse } from '@/lib/utils'
import { updateCategorySchema } from '@/lib/validations'

interface RouteParams {
  params: Promise<{ id: string }>
}

// GET /api/categories/[id] - Get a single category by ID
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const { searchParams } = new URL(request.url)
    const include_products = searchParams.get('include_products') === 'true'
    const supabase = createServerClient()

    const { data: category, error } = await supabase
      .from('categories')
      .select(
        include_products
          ? `
        *,
        products(id, name, slug, price, images, is_featured, stock_quantity)
      `
          : '*'
      )
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') return apiResponse.notFound('Category not found')
      return apiResponse.internalError('Failed to fetch category', error)
    }

    return apiResponse.success(category)
  } catch (error) {
    return apiResponse.internalError('Internal server error', error)
  }
}

// PUT /api/categories/[id] - Update a category (Admin only)
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    if (!(await isAdmin())) return apiResponse.unauthorized()

    const { id } = await params
    const body = await request.json()
    
    const validation = updateCategorySchema.safeParse(body)
    if (!validation.success) {
      return apiResponse.badRequest(validation.error.issues[0]?.message ?? 'Invalid request payload')
    }

    const data = validation.data
    const supabase = createServerClient()

    // Check if category exists
    const { data: existingCategory, error: fetchError } = await supabase
      .from('categories')
      .select('id, slug')
      .eq('id', id)
      .single()

    if (fetchError) {
      if (fetchError.code === 'PGRST116') return apiResponse.notFound('Category not found')
      return apiResponse.internalError('Failed to fetch category', fetchError)
    }

    // Check if slug conflicts
    if (data.slug && data.slug !== existingCategory.slug) {
      const { data: conflictingCategory } = await supabase
        .from('categories')
        .select('id')
        .eq('slug', data.slug)
        .neq('id', id)
        .single()

      if (conflictingCategory) {
        return apiResponse.conflict('Category with this slug already exists')
      }
    }

    // Update the category
    const { data: category, error } = await supabase
      .from('categories')
      .update({
        ...data,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      return apiResponse.internalError('Failed to update category', error)
    }

    return apiResponse.success(category, 'Category updated successfully')
  } catch (error) {
    return apiResponse.internalError('Internal server error', error)
  }
}

// DELETE /api/categories/[id] - Delete a category (Admin only)
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    if (!(await isAdmin())) return apiResponse.unauthorized()

    const { id } = await params
    const supabase = createServerClient()

    // Check if category exists
    const { data: existingCategory, error: fetchError } = await supabase
      .from('categories')
      .select('id')
      .eq('id', id)
      .single()

    if (fetchError) {
      if (fetchError.code === 'PGRST116') return apiResponse.notFound('Category not found')
      return apiResponse.internalError('Failed to fetch category', fetchError)
    }

    // Check references
    const { count: childCount } = await supabase
      .from('categories')
      .select('id', { count: 'exact', head: true })
      .eq('parent_id', id)

    if (childCount && childCount > 0) {
      return apiResponse.conflict('Cannot delete category that has subcategories')
    }

    const { count: productCount } = await supabase
      .from('products')
      .select('id', { count: 'exact', head: true })
      .eq('category_id', id)

    if (productCount && productCount > 0) {
      return apiResponse.conflict('Cannot delete category that contains products')
    }

    // Delete the category
    const { error } = await supabase.from('categories').delete().eq('id', id)

    if (error) {
      return apiResponse.internalError('Failed to delete category', error)
    }

    return apiResponse.success(null, 'Category deleted successfully')
  } catch (error) {
    return apiResponse.internalError('Internal server error', error)
  }
}
