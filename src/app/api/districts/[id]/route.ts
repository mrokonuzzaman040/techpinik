import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { UpdateDistrictData } from '@/types'

interface RouteParams {
  params: Promise<{ id: string }>
}

// GET /api/districts/[id] - Get a single district by ID
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params

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
    const body: UpdateDistrictData = await request.json()

    // Check if district exists
    const { data: existingDistrict, error: fetchError } = await supabase
      .from('districts')
      .select('id, name')
      .eq('id', id)
      .single()

    if (fetchError) {
      if (fetchError.code === 'PGRST116') {
        return NextResponse.json({ success: false, error: 'District not found' }, { status: 404 })
      }
      console.error('Error fetching district:', fetchError)
      return NextResponse.json(
        { success: false, error: 'Failed to fetch district' },
        { status: 500 }
      )
    }

    // Validate delivery charge if provided
    if (body.delivery_charge !== undefined && body.delivery_charge < 0) {
      return NextResponse.json(
        { success: false, error: 'Delivery charge must be non-negative' },
        { status: 400 }
      )
    }

    // Check if name is being updated and if it conflicts with another district
    if (body.name && body.name.trim() !== existingDistrict.name) {
      const { data: conflictingDistrict } = await supabase
        .from('districts')
        .select('id')
        .ilike('name', body.name.trim())
        .neq('id', id)
        .single()

      if (conflictingDistrict) {
        return NextResponse.json(
          { success: false, error: 'District with this name already exists' },
          { status: 409 }
        )
      }
    }

    // Prepare update data
    const updateData: any = {}
    if (body.name !== undefined) {
      updateData.name = body.name.trim()
    }
    if (body.delivery_charge !== undefined) {
      updateData.delivery_charge = body.delivery_charge
    }
    updateData.updated_at = new Date().toISOString()

    // Update the district
    const { data: district, error } = await supabase
      .from('districts')
      .update(updateData)
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

    // Check if district exists
    const { data: existingDistrict, error: fetchError } = await supabase
      .from('districts')
      .select('id')
      .eq('id', id)
      .single()

    if (fetchError) {
      if (fetchError.code === 'PGRST116') {
        return NextResponse.json({ success: false, error: 'District not found' }, { status: 404 })
      }
      console.error('Error fetching district:', fetchError)
      return NextResponse.json(
        { success: false, error: 'Failed to fetch district' },
        { status: 500 }
      )
    }

    // Check if district is referenced in any orders
    const { data: orders, error: ordersError } = await supabase
      .from('orders')
      .select('id')
      .eq('district_id', id)
      .limit(1)

    if (ordersError) {
      console.error('Error checking orders:', ordersError)
      return NextResponse.json(
        { success: false, error: 'Failed to check district references' },
        { status: 500 }
      )
    }

    if (orders && orders.length > 0) {
      return NextResponse.json(
        { success: false, error: 'Cannot delete district that is referenced in orders' },
        { status: 409 }
      )
    }

    // Delete the district
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
