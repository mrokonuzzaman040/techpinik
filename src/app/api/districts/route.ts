import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { CreateDistrictData } from '@/types';

// GET /api/districts - Get all districts
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const sort_by = searchParams.get('sort_by') || 'name';
    const sort_order = searchParams.get('sort_order') || 'asc';

    let query = supabase
      .from('districts')
      .select('*');

    // Apply search filter
    if (search) {
      query = query.ilike('name', `%${search}%`);
    }

    // Apply sorting
    query = query.order(sort_by, { ascending: sort_order === 'asc' });

    const { data: districts, error } = await query;

    if (error) {
      console.error('Error fetching districts:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch districts' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: districts,
    });
  } catch (error) {
    console.error('Error in GET /api/districts:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/districts - Create a new district
export async function POST(request: NextRequest) {
  try {
    const body: CreateDistrictData = await request.json();

    // Validate required fields
    if (!body.name || body.delivery_charge === undefined) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: name, delivery_charge' },
        { status: 400 }
      );
    }

    // Validate delivery charge is non-negative
    if (body.delivery_charge < 0) {
      return NextResponse.json(
        { success: false, error: 'Delivery charge must be non-negative' },
        { status: 400 }
      );
    }

    // Check if district with same name already exists
    const { data: existingDistrict } = await supabase
      .from('districts')
      .select('id')
      .ilike('name', body.name)
      .single();

    if (existingDistrict) {
      return NextResponse.json(
        { success: false, error: 'District with this name already exists' },
        { status: 409 }
      );
    }

    // Create the district
    const { data: district, error } = await supabase
      .from('districts')
      .insert([{
        name: body.name.trim(),
        delivery_charge: body.delivery_charge,
      }])
      .select()
      .single();

    if (error) {
      console.error('Error creating district:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to create district' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: district,
      message: 'District created successfully',
    }, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/districts:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}