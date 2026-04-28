import { NextRequest } from 'next/server'
import { createServerClient } from '@/lib/supabase'; import { isAdmin } from '@/lib/supabase-server'
import { apiResponse } from '@/lib/utils'
import { updateProductSchema } from '@/lib/validations'

interface RouteParams {
  params: Promise<{ id: string }>
}

// GET /api/products/[id] - Get a single product by ID
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const supabase = createServerClient()

    const { data: product, error } = await supabase
      .from('products')
      .select(`
        *,
        category:categories(id, name, slug)
      `)
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') return apiResponse.notFound('Product not found')
      return apiResponse.internalError('Failed to fetch product', error)
    }

    return apiResponse.success(product)
  } catch (error) {
    return apiResponse.internalError('Internal server error', error)
  }
}

// PUT /api/products/[id] - Update a product (Admin only)
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    if (!(await isAdmin())) return apiResponse.unauthorized()

    const { id } = await params
    const body = await request.json()
    
    const validation = updateProductSchema.safeParse(body)
    if (!validation.success) {
      return apiResponse.badRequest(validation.error.issues[0]?.message ?? 'Invalid request payload')
    }

    const data = validation.data
    const supabase = createServerClient()

    // Check if product exists
    const { data: existingProduct, error: fetchError } = await supabase
      .from('products')
      .select('id, slug')
      .eq('id', id)
      .single()

    if (fetchError) {
      if (fetchError.code === 'PGRST116') return apiResponse.notFound('Product not found')
      return apiResponse.internalError('Failed to fetch product', fetchError)
    }

    // Check if slug conflicts
    if (data.slug && data.slug !== existingProduct.slug) {
      const { data: conflictingProduct } = await supabase
        .from('products')
        .select('id')
        .eq('slug', data.slug)
        .neq('id', id)
        .single()

      if (conflictingProduct) {
        return apiResponse.conflict('Product with this slug already exists')
      }
    }

    // Update the product
    const { data: product, error } = await supabase
      .from('products')
      .update({
        ...data,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select(`
        *,
        category:categories(id, name, slug)
      `)
      .single()

    if (error) {
      return apiResponse.internalError('Failed to update product', error)
    }

    return apiResponse.success(product, 'Product updated successfully')
  } catch (error) {
    return apiResponse.internalError('Internal server error', error)
  }
}

// DELETE /api/products/[id] - Delete a product (Admin only)
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    if (!(await isAdmin())) return apiResponse.unauthorized()

    const { id } = await params
    const supabase = createServerClient()

    // Check if product exists
    const { data: existingProduct, error: fetchError } = await supabase
      .from('products')
      .select('id')
      .eq('id', id)
      .single()

    if (fetchError) {
      if (fetchError.code === 'PGRST116') return apiResponse.notFound('Product not found')
      return apiResponse.internalError('Failed to fetch product', fetchError)
    }

    // Delete the product
    const { error } = await supabase.from('products').delete().eq('id', id)

    if (error) {
      return apiResponse.internalError('Failed to delete product', error)
    }

    return apiResponse.success(null, 'Product deleted successfully')
  } catch (error) {
    return apiResponse.internalError('Internal server error', error)
  }
}
