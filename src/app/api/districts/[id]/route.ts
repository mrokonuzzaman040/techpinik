import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

interface RouteParams {
  params: Promise<{ id: string }>
}

// GET /api/districts/[id] - Get a single district by ID
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const supabase = createServerClient()
    const { data: district, error } = await supabase
      .from('districts')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ success: false, error: 'District not found' }, { status: 404 })
      }
      console.error('Error fetching district:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to fetch district' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: district,
    })
  } catch (error) {
    console.error('Error in GET /api/districts/[id]:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}

// PUT /api/districts/[id] - Update a district
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const body = await request.json()
    const supabase = createServerClient()

    const { data: district, error } = await supabase
      .from('districts')
      .update({
        name: body.name,
        delivery_charge: body.delivery_charge,
        is_active: body.is_active,
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating district:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to update district' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: district,
      message: 'District updated successfully',
    })
  } catch (error) {
    console.error('Error in PUT /api/districts/[id]:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE /api/districts/[id] - Delete a district
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const supabase = createServerClient()

    // Check if district is being used by orders
    const { data: orders, error: ordersError } = await supabase
      .from('orders')
      .select('id')
      .eq('district_id', id)
      .limit(1)

    if (ordersError) {
      console.error('Error checking orders for district:', ordersError)
    }

    if (orders && orders.length > 0) {
      return NextResponse.json(
        { success: false, error: 'Cannot delete district that is associated with orders' },
        { status: 400 }
      )
    }

    const { error } = await supabase.from('districts').delete().eq('id', id)

    if (error) {
      console.error('Error deleting district:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to delete district' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'District deleted successfully',
    })
  } catch (error) {
    console.error('Error in DELETE /api/districts/[id]:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}
