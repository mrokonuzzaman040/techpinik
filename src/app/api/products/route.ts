import { NextRequest } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { isAdmin } from '@/lib/supabase-server'
import { apiResponse, generateSKU } from '@/lib/utils'
import { productSchema } from '@/lib/validations'
import { PAGINATION } from '@/types/constants'

/**
 * GET /api/products - Highly Optimized for 10k+ Products
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const supabase = createServerClient()

    const page = Math.max(1, parseInt(searchParams.get('page') || '1'))
    const limit = Math.min(parseInt(searchParams.get('limit') || '12'), PAGINATION.MAX_LIMIT)
    const category_id = searchParams.get('category_id')
    const min_price = searchParams.get('min_price') ? parseFloat(searchParams.get('min_price')!) : undefined
    const max_price = searchParams.get('max_price') ? parseFloat(searchParams.get('max_price')!) : undefined
    const is_featured = searchParams.get('is_featured') === 'true'
    const search = searchParams.get('search')?.trim()
    const sort_by = searchParams.get('sort_by') || 'created_at'
    const sort_order = searchParams.get('sort_order') === 'asc' ? 'asc' : 'desc'

    let query = supabase.from('products').select(
      `
        id, 
        name, 
        slug, 
        price, 
        images, 
        stock_quantity, 
        is_featured, 
        created_at,
        category:categories(id, name, slug)
      `,
      { count: 'exact' }
    )

    if (search) {
      query = query.textSearch('fts', `${search}:*`)
    }

    if (category_id) query = query.eq('category_id', category_id)
    if (min_price !== undefined) query = query.gte('price', min_price)
    if (max_price !== undefined) query = query.lte('price', max_price)
    if (is_featured) query = query.eq('is_featured', true)

    const from = (page - 1) * limit
    const to = from + limit - 1
    
    query = query
      .order(sort_by, { ascending: sort_order === 'asc' })
      .range(from, to)

    const { data: products, error, count } = await query

    if (error) return apiResponse.internalError('Database query failed', error)

    const total_pages = Math.ceil((count || 0) / limit)

    return apiResponse.success({
      products: products || [],
      pagination: {
        page, limit, total: count || 0, total_pages,
      }
    })
  } catch (error) {
    return apiResponse.internalError('Internal server error', error)
  }
}

/**
 * POST /api/products - Admin Only
 */
export async function POST(request: NextRequest) {
  try {
    if (!(await isAdmin())) return apiResponse.unauthorized()

    const body = await request.json()
    const validation = productSchema.safeParse(body)
    
    if (!validation.success) {
      return apiResponse.badRequest(validation.error.errors[0].message)
    }

    const data = validation.data
    const supabase = createServerClient()

    const { data: existingProductBySlug } = await supabase
      .from('products')
      .select('id')
      .eq('slug', data.slug)
      .single()

    if (existingProductBySlug) return apiResponse.conflict('Product with this slug already exists')

    const sku = data.sku || generateSKU()
    const { data: existingProductBySKU } = await supabase
      .from('products')
      .select('id')
      .eq('sku', sku)
      .single()

    if (existingProductBySKU) return apiResponse.conflict('Product with this SKU already exists')

    const { data: product, error } = await supabase
      .from('products')
      .insert([{
        ...data,
        sku,
        updated_at: new Date().toISOString(),
      }])
      .select(`*, category:categories(id, name, slug)`)
      .single()

    if (error) return apiResponse.internalError('Failed to create product', error)

    return apiResponse.success(product, 'Product created successfully', 201)
  } catch (error) {
    return apiResponse.internalError('Internal server error', error)
  }
}
