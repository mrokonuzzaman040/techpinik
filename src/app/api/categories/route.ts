import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { CreateCategoryData } from '@/types';

// GET /api/categories - Get all categories
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const include_products = searchParams.get('include_products') === 'true';
    const parent_id = searchParams.get('parent_id');

    let query = supabase
      .from('categories')
      .select(include_products ? `
        *,
        products(id, name, slug, price, images, is_featured)
      ` : '*')
      .order('name');

    // Filter by parent_id if provided
    if (parent_id) {
      if (parent_id === 'null') {
        query = query.is('parent_id', null);
      } else {
        query = query.eq('parent_id', parent_id);
      }
    }

    const { data: categories, error } = await query;

    if (error) {
      console.error('Error fetching categories:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch categories' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: categories,
    });
  } catch (error) {
    console.error('Error in GET /api/categories:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/categories - Create a new category
export async function POST(request: NextRequest) {
  try {
    const body: CreateCategoryData = await request.json();

    // Validate required fields
    if (!body.name || !body.slug) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: name, slug' },
        { status: 400 }
      );
    }

    // Check if slug already exists
    const { data: existingCategory } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', body.slug)
      .single();

    if (existingCategory) {
      return NextResponse.json(
        { success: false, error: 'Category with this slug already exists' },
        { status: 409 }
      );
    }

    // If parent_id is provided, check if parent category exists
    if (body.parent_id) {
      const { data: parentCategory, error: parentError } = await supabase
        .from('categories')
        .select('id')
        .eq('id', body.parent_id)
        .single();

      if (parentError || !parentCategory) {
        return NextResponse.json(
          { success: false, error: 'Parent category not found' },
          { status: 400 }
        );
      }
    }

    // Create the category
    const { data: category, error } = await supabase
      .from('categories')
      .insert([{
        name: body.name,
        description: body.description || null,
        icon: body.icon || null,
        slug: body.slug,
        parent_id: body.parent_id || null,
      }])
      .select()
      .single();

    if (error) {
      console.error('Error creating category:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to create category' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: category,
      message: 'Category created successfully',
    }, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/categories:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}