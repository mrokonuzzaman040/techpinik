import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient()
    const { searchParams } = new URL(request.url)
    
    const active = searchParams.get('active')
    const sortBy = searchParams.get('sortBy') || 'sort_order'
    const sortOrder = searchParams.get('sortOrder') || 'asc'
    
    let query = supabase
      .from('slider_items')
      .select('*')
    
    // Apply filters
    if (active !== null && active !== undefined) {
      query = query.eq('is_active', active === 'true')
    }
    
    // Apply sorting
    query = query.order(sortBy, { ascending: sortOrder === 'asc' })
    
    const { data: sliderItems, error } = await query
    
    if (error) {
      console.error('Error fetching slider items:', error)
      return NextResponse.json({ error: 'Failed to fetch slider items' }, { status: 500 })
    }
    
    return NextResponse.json({ sliderItems })
  } catch (error) {
    console.error('Error in slider API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    const body = await request.json()
    
    const { data: sliderItem, error } = await supabase
      .from('slider_items')
      .insert([body])
      .select()
      .single()
    
    if (error) {
      console.error('Error creating slider item:', error)
      return NextResponse.json({ error: 'Failed to create slider item' }, { status: 500 })
    }
    
    return NextResponse.json({ sliderItem }, { status: 201 })
  } catch (error) {
    console.error('Error in slider POST API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}