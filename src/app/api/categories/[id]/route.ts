import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { UpdateCategoryData } from '@/types';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/categories/[id] - Get a single category by ID
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const include_products = searchParams.get('include_products') === 'true';

    const { data: category, error } = await supabase
      .from('categories')
      .select(include_products ? `
        *,
        products(id, name, slug, price, images, is_featured, stock_quantity)
      ` : '*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { success: false, error: 'Category not found' },
          { status: 404 }
        );
      }
      console.error('Error fetching category:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch category' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: category,
    });
  } catch (error) {
    console.error('Error in GET /api/categories/[id]:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/categories/[id] - Update a category
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params;
    const body: UpdateCategoryData = await request.json();

    // Check if category exists
    const { data: existingCategory, error: fetchError } = await supabase
      .from('categories')
      .select('id, slug')
      .eq('id', id)
      .single();

    if (fetchError) {
      if (fetchError.code === 'PGRST116') {
        return NextResponse.json(
          { success: false, error: 'Category not found' },
          { status: 404 }
        );
      }
      console.error('Error fetching category:', fetchError);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch category' },
        { status: 500 }
      );
    }

    // Check if slug is being updated and if it conflicts with another category
    if (body.slug && body.slug !== existingCategory.slug) {
      const { data: conflictingCategory } = await supabase
        .from('categories')
        .select('id')
        .eq('slug', body.slug)
        .neq('id', id)
        .single();

      if (conflictingCategory) {
        return NextResponse.json(
          { success: false, error: 'Category with this slug already exists' },
          { status: 409 }
        );
      }
    }

    // If parent_id is being updated, validate it
    if (body.parent_id !== undefined) {
      if (body.parent_id === id) {
        return NextResponse.json(
          { success: false, error: 'Category cannot be its own parent' },
          { status: 400 }
        );
      }

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
    }

    // Update the category
    const updateData: any = {
      ...body,
      updated_at: new Date().toISOString(),
    };

    const { data: category, error } = await supabase
      .from('categories')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating category:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to update category' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: category,
      message: 'Category updated successfully',
    });
  } catch (error) {
    console.error('Error in PUT /api/categories/[id]:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/categories/[id] - Delete a category
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params;

    // Check if category exists
    const { data: existingCategory, error: fetchError } = await supabase
      .from('categories')
      .select('id')
      .eq('id', id)
      .single();

    if (fetchError) {
      if (fetchError.code === 'PGRST116') {
        return NextResponse.json(
          { success: false, error: 'Category not found' },
          { status: 404 }
        );
      }
      console.error('Error fetching category:', fetchError);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch category' },
        { status: 500 }
      );
    }

    // Check if category has child categories
    const { data: childCategories, error: childError } = await supabase
      .from('categories')
      .select('id')
      .eq('parent_id', id)
      .limit(1);

    if (childError) {
      console.error('Error checking child categories:', childError);
      return NextResponse.json(
        { success: false, error: 'Failed to check category references' },
        { status: 500 }
      );
    }

    if (childCategories && childCategories.length > 0) {
      return NextResponse.json(
        { success: false, error: 'Cannot delete category that has child categories' },
        { status: 409 }
      );
    }

    // Check if category has products
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('id')
      .eq('category_id', id)
      .limit(1);

    if (productsError) {
      console.error('Error checking products:', productsError);
      return NextResponse.json(
        { success: false, error: 'Failed to check category references' },
        { status: 500 }
      );
    }

    if (products && products.length > 0) {
      return NextResponse.json(
        { success: false, error: 'Cannot delete category that has products' },
        { status: 409 }
      );
    }

    // Delete the category
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting category:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to delete category' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Category deleted successfully',
    });
  } catch (error) {
    console.error('Error in DELETE /api/categories/[id]:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}