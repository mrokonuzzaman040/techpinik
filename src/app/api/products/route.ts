import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { CreateProductData, ProductFilters } from '@/types';
import { PAGINATION } from '@/types/constants';

// GET /api/products - Get all products with optional filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Parse query parameters
    const page = parseInt(searchParams.get('page') || '1');
    const limit = Math.min(parseInt(searchParams.get('limit') || '12'), PAGINATION.MAX_LIMIT);
    const category_id = searchParams.get('category_id');
    const min_price = searchParams.get('min_price') ? parseFloat(searchParams.get('min_price')!) : undefined;
    const max_price = searchParams.get('max_price') ? parseFloat(searchParams.get('max_price')!) : undefined;
    const is_featured = searchParams.get('is_featured') === 'true';
    const search = searchParams.get('search');
    const sort_by = searchParams.get('sort_by') || 'created_at';
    const sort_order = searchParams.get('sort_order') || 'desc';

    // Build query
    let query = supabase
      .from('products')
      .select(`
        *,
        category:categories(id, name, slug)
      `, { count: 'exact' });

    // Apply filters
    if (category_id) {
      query = query.eq('category_id', category_id);
    }

    if (min_price !== undefined) {
      query = query.gte('price', min_price);
    }

    if (max_price !== undefined) {
      query = query.lte('price', max_price);
    }

    if (is_featured) {
      query = query.eq('is_featured', true);
    }

    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
    }

    // Apply sorting
    query = query.order(sort_by, { ascending: sort_order === 'asc' });

    // Apply pagination
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    const { data: products, error, count } = await query;

    if (error) {
      console.error('Error fetching products:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch products' },
        { status: 500 }
      );
    }

    const total_pages = Math.ceil((count || 0) / limit);

    return NextResponse.json({
      success: true,
      data: products,
      pagination: {
        page,
        limit,
        total: count || 0,
        total_pages,
      },
    });
  } catch (error) {
    console.error('Error in GET /api/products:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/products - Create a new product
export async function POST(request: NextRequest) {
  try {
    const body: CreateProductData = await request.json();

    // Validate required fields
    if (!body.name || !body.price || !body.slug) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: name, price, slug' },
        { status: 400 }
      );
    }

    // Check if slug already exists
    const { data: existingProduct } = await supabase
      .from('products')
      .select('id')
      .eq('slug', body.slug)
      .single();

    if (existingProduct) {
      return NextResponse.json(
        { success: false, error: 'Product with this slug already exists' },
        { status: 409 }
      );
    }

    // Create the product
    const { data: product, error } = await supabase
      .from('products')
      .insert([{
        name: body.name,
        description: body.description || null,
        price: body.price,
        category_id: body.category_id || null,
        images: body.images || [],
        stock_quantity: body.stock_quantity || 0,
        is_featured: body.is_featured || false,
        slug: body.slug,
      }])
      .select(`
        *,
        category:categories(id, name, slug)
      `)
      .single();

    if (error) {
      console.error('Error creating product:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to create product' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: product,
      message: 'Product created successfully',
    }, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/products:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}