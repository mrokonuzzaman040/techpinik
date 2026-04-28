import { NextRequest } from 'next/server'
import { createServerClient } from '@/lib/supabase'; import { isAdmin } from '@/lib/supabase-server'
import { apiResponse } from '@/lib/utils'
import { sliderItemSchema } from '@/lib/validations'

// GET /api/slider-items - Get all slider items
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const is_active = searchParams.get('is_active')
    const sort_by = searchParams.get('sort_by') || 'sort_order'
    const sort_order = searchParams.get('sort_order') || 'asc'
    const supabase = createServerClient()

    let query = supabase.from('slider_items').select('*')

    // Filter by active status if specified
    if (is_active !== null) {
      query = query.eq('is_active', is_active === 'true')
    }

    // Apply sorting
    query = query.order(sort_by, { ascending: sort_order === 'asc' })

    const { data: sliderItems, error } = await query

    if (error) {
      return apiResponse.internalError('Failed to fetch slider items', error)
    }

    return apiResponse.success(sliderItems)
  } catch (error) {
    return apiResponse.internalError('Internal server error', error)
  }
}

// POST /api/slider-items - Create a new slider item (Admin only)
export async function POST(request: NextRequest) {
  try {
    // Security check
    if (!(await isAdmin())) {
      return apiResponse.unauthorized()
    }

    const body = await request.json()
    const validation = sliderItemSchema.safeParse(body)
    
    if (!validation.success) {
      return apiResponse.badRequest(validation.error.issues[0]?.message ?? 'Invalid request payload')
    }

    const data = validation.data
    const supabase = createServerClient()

    // Create the slider item
    const { data: sliderItem, error } = await supabase
      .from('slider_items')
      .insert([
        {
          title: data.title,
          subtitle: data.subtitle || null,
          image_url: data.image_url,
          link_url: data.link_url || null,
          sort_order: data.sort_order,
          is_active: data.is_active,
        },
      ])
      .select()
      .single()

    if (error) {
      return apiResponse.internalError('Failed to create slider item', error)
    }

    return apiResponse.success(sliderItem, 'Slider item created successfully', 201)
  } catch (error) {
    return apiResponse.internalError('Internal server error', error)
  }
}
