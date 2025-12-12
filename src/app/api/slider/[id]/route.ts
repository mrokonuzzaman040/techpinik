import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase'

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const supabase = createClient()
    const { id } = await params

    const { data: sliderItem, error } = await supabase
      .from('slider_items')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error fetching slider item:', error)
      return NextResponse.json({ error: 'Slider item not found' }, { status: 404 })
    }

    return NextResponse.json({ sliderItem })
  } catch (error) {
    console.error('Error in slider item GET API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const supabase = createClient()
    const { id } = await params
    const body = await request.json()

    const { data: sliderItem, error } = await supabase
      .from('slider_items')
      .update(body)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating slider item:', error)
      return NextResponse.json({ error: 'Failed to update slider item' }, { status: 500 })
    }

    return NextResponse.json({ sliderItem })
  } catch (error) {
    console.error('Error in slider item PUT API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = createClient()
    const { id } = await params

    const { error } = await supabase.from('slider_items').delete().eq('id', id)

    if (error) {
      console.error('Error deleting slider item:', error)
      return NextResponse.json({ error: 'Failed to delete slider item' }, { status: 500 })
    }

    return NextResponse.json({ message: 'Slider item deleted successfully' })
  } catch (error) {
    console.error('Error in slider item DELETE API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
