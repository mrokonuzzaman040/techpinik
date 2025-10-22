import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { UpdateProductData } from '@/types';

interface RouteParams {
  params: { id: string };
}

// GET /api/products/[id] - Get a single product by ID
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params;

    const { data: product, error } = await supabase
      .from('products')
      .select(`
        *,
        category:categories(id, name, slug)
      `)
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { success: false, error: 'Product not found' },
          { status: 404 }
        );
      }
      console.error('Error fetching product:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch product' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error('Error in GET /api/products/[id]:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/products/[id] - Update a product
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params;
    const body: UpdateProductData = await request.json();

    // Check if product exists
    const { data: existingProduct, error: fetchError } = await supabase
      .from('products')
      .select('id, slug')
      .eq('id', id)
      .single();

    if (fetchError) {
      if (fetchError.code === 'PGRST116') {
        return NextResponse.json(
          { success: false, error: 'Product not found' },
          { status: 404 }
        );
      }
      console.error('Error fetching product:', fetchError);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch product' },
        { status: 500 }
      );
    }

    // Check if slug is being updated and if it conflicts with another product
    if (body.slug && body.slug !== existingProduct.slug) {
      const { data: conflictingProduct } = await supabase
        .from('products')
        .select('id')
        .eq('slug', body.slug)
        .neq('id', id)
        .single();

      if (conflictingProduct) {
        return NextResponse.json(
          { success: false, error: 'Product with this slug already exists' },
          { status: 409 }
        );
      }
    }

    // Update the product
    const updateData: any = {
      ...body,
      updated_at: new Date().toISOString(),
    };

    const { data: product, error } = await supabase
      .from('products')
      .update(updateData)
      .eq('id', id)
      .select(`
        *,
        category:categories(id, name, slug)
      `)
      .single();

    if (error) {
      console.error('Error updating product:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to update product' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: product,
      message: 'Product updated successfully',
    });
  } catch (error) {
    console.error('Error in PUT /api/products/[id]:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/products/[id] - Delete a product
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params;

    // Check if product exists
    const { data: existingProduct, error: fetchError } = await supabase
      .from('products')
      .select('id')
      .eq('id', id)
      .single();

    if (fetchError) {
      if (fetchError.code === 'PGRST116') {
        return NextResponse.json(
          { success: false, error: 'Product not found' },
          { status: 404 }
        );
      }
      console.error('Error fetching product:', fetchError);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch product' },
        { status: 500 }
      );
    }

    // Check if product is referenced in any orders
    const { data: orderItems, error: orderItemsError } = await supabase
      .from('order_items')
      .select('id')
      .eq('product_id', id)
      .limit(1);

    if (orderItemsError) {
      console.error('Error checking order items:', orderItemsError);
      return NextResponse.json(
        { success: false, error: 'Failed to check product references' },
        { status: 500 }
      );
    }

    if (orderItems && orderItems.length > 0) {
      return NextResponse.json(
        { success: false, error: 'Cannot delete product that is referenced in orders' },
        { status: 409 }
      );
    }

    // Delete the product
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting product:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to delete product' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error) {
    console.error('Error in DELETE /api/products/[id]:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}