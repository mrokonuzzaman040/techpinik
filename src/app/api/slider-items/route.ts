import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { CreateSliderItemData } from '@/types'

// GET /api/slider-items - Get all slider items
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const is_active = searchParams.get('is_active')
    const sort_by = searchParams.get('sort_by') || 'sort_order'
    const sort_order = searchParams.get('sort_order') || 'asc'

    let query = supabase.from('slider_items').select('*')

    // Filter by active status if specified
    if (is_active !== null) {
      query = query.eq('is_active', is_active === 'true')
    }

    // Apply sorting
    query = query.order(sort_by, { ascending: sort_order === 'asc' })

    const { data: sliderItems, error } = await query

    if (error) {
      console.error('Error fetching slider items:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to fetch slider items' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: sliderItems,
    })
  } catch (error) {
    console.error('Error in GET /api/slider-items:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/slider-items - Create a new slider item
export async function POST(request: NextRequest) {
  try {
    const body: CreateSliderItemData = await request.json()

    // Validate required fields
    if (!body.title || !body.image_url) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: title, image_url' },
        { status: 400 }
      )
    }

    // Validate sort_order is non-negative
    if (body.sort_order !== undefined && body.sort_order < 0) {
      return NextResponse.json(
        { success: false, error: 'Sort order must be non-negative' },
        { status: 400 }
      )
    }

    // If no sort_order provided, set it to the next available position
    let sortOrder = body.sort_order
    if (sortOrder === undefined) {
      const { data: lastItem } = await supabase
        .from('slider_items')
        .select('sort_order')
        .order('sort_order', { ascending: false })
        .limit(1)
        .single()

      sortOrder = lastItem ? lastItem.sort_order + 1 : 0
    }

    // Create the slider item
    const { data: sliderItem, error } = await supabase
      .from('slider_items')
      .insert([
        {
          title: body.title,
          subtitle: body.subtitle || null,
          image_url: body.image_url,
          link_url: body.link_url || null,
          sort_order: sortOrder,
          is_active: body.is_active !== undefined ? body.is_active : true,
        },
      ])
      .select()
      .single()

    if (error) {
      console.error('Error creating slider item:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to create slider item' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      {
        success: true,
        data: sliderItem,
        message: 'Slider item created successfully',
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error in POST /api/slider-items:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}
