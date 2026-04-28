import { NextRequest } from 'next/server'
import { createServerClient } from '@/lib/supabase'; import { isAdmin } from '@/lib/supabase-server'
import { apiResponse } from '@/lib/utils'
import { categorySchema } from '@/lib/validations'

// GET /api/categories - Get all categories
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const include_products = searchParams.get('include_products') === 'true'
    const parent_id = searchParams.get('parent_id')

    const supabase = createServerClient()
    let query = supabase
      .from('categories')
      .select(
        include_products
          ? `
        *,
        products(id, name, slug, price, images, is_featured)
      `
          : '*'
      )
      .order('sort_order', { ascending: true })
      .order('name', { ascending: true })

    // Filter by parent_id if provided
    if (parent_id) {
      if (parent_id === 'null') {
        query = query.is('parent_id', null)
      } else {
        query = query.eq('parent_id', parent_id)
      }
    }

    const { data: categories, error } = await query

    if (error) {
      return apiResponse.internalError('Failed to fetch categories', error)
    }

    return apiResponse.success(categories)
  } catch (error) {
    return apiResponse.internalError('Internal server error', error)
  }
}

// POST /api/categories - Create a new category (Admin only)
export async function POST(request: NextRequest) {
  try {
    // Security check: Only admins can create categories
    if (!(await isAdmin())) {
      return apiResponse.unauthorized()
    }

    const body = await request.json()

    // Validate input data
    const validation = categorySchema.safeParse(body)
    if (!validation.success) {
      return apiResponse.badRequest(validation.error.issues[0]?.message ?? 'Invalid request payload')
    }

    const data = validation.data
    const supabase = createServerClient()

    // Check if slug already exists
    const { data: existingCategory } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', data.slug)
      .single()

    if (existingCategory) {
      return apiResponse.conflict('Category with this slug already exists')
    }

    // If parent_id is provided, check if parent category exists
    if (data.parent_id) {
      const { data: parentCategory, error: parentError } = await supabase
        .from('categories')
        .select('id')
        .eq('id', data.parent_id)
        .single()

      if (parentError || !parentCategory) {
        return apiResponse.badRequest('Parent category not found')
      }
    }

    // Create the category
    const { data: category, error } = await supabase
      .from('categories')
      .insert([
        {
          name: data.name,
          description: data.description || null,
          icon: data.icon || null,
          slug: data.slug,
          parent_id: data.parent_id || null,
        },
      ])
      .select()
      .single()

    if (error) {
      return apiResponse.internalError('Failed to create category', error)
    }

    return apiResponse.success(category, 'Category created successfully', 201)
  } catch (error) {
    return apiResponse.internalError('Internal server error', error)
  }
}
