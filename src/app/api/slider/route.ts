import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

// GET /api/slider - Get all active slider items
export async function GET() {
  try {
    const supabase = createServerClient()
    const { data: sliderItems, error } = await supabase
      .from('slider_items')
      .select('*')
      .eq('is_active', true)
      .order('order_index', { ascending: true })

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
    console.error('Error in GET /api/slider:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}
