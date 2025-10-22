import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { UpdateSliderItemData } from '@/types';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/slider-items/[id] - Get a single slider item by ID
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    const { data: sliderItem, error } = await supabase
      .from('slider_items')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { success: false, error: 'Slider item not found' },
          { status: 404 }
        );
      }
      console.error('Error fetching slider item:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch slider item' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: sliderItem,
    });
  } catch (error) {
    console.error('Error in GET /api/slider-items/[id]:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/slider-items/[id] - Update a slider item
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body: UpdateSliderItemData = await request.json();

    // Check if slider item exists
    const { data: existingItem, error: fetchError } = await supabase
      .from('slider_items')
      .select('id')
      .eq('id', id)
      .single();

    if (fetchError) {
      if (fetchError.code === 'PGRST116') {
        return NextResponse.json(
          { success: false, error: 'Slider item not found' },
          { status: 404 }
        );
      }
      console.error('Error fetching slider item:', fetchError);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch slider item' },
        { status: 500 }
      );
    }

    // Validate sort_order if provided
    if (body.sort_order !== undefined && body.sort_order < 0) {
      return NextResponse.json(
        { success: false, error: 'Sort order must be non-negative' },
        { status: 400 }
      );
    }

    // Prepare update data
    const updateData: any = {
      ...body,
      updated_at: new Date().toISOString(),
    };

    // Update the slider item
    const { data: sliderItem, error } = await supabase
      .from('slider_items')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating slider item:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to update slider item' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: sliderItem,
      message: 'Slider item updated successfully',
    });
  } catch (error) {
    console.error('Error in PUT /api/slider-items/[id]:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/slider-items/[id] - Delete a slider item
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    // Check if slider item exists
    const { data: existingItem, error: fetchError } = await supabase
      .from('slider_items')
      .select('id')
      .eq('id', id)
      .single();

    if (fetchError) {
      if (fetchError.code === 'PGRST116') {
        return NextResponse.json(
          { success: false, error: 'Slider item not found' },
          { status: 404 }
        );
      }
      console.error('Error fetching slider item:', fetchError);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch slider item' },
        { status: 500 }
      );
    }

    // Delete the slider item
    const { error } = await supabase
      .from('slider_items')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting slider item:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to delete slider item' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Slider item deleted successfully',
    });
  } catch (error) {
    console.error('Error in DELETE /api/slider-items/[id]:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}