import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { UpdateOrderData, OrderStatus } from '@/types';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/orders/[id] - Get a single order by ID
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    const { data: order, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items(
          id,
          quantity,
          unit_price,
          products(id, name, slug, images, price)
        ),
        districts(id, name, delivery_charge)
      `)
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { success: false, error: 'Order not found' },
          { status: 404 }
        );
      }
      console.error('Error fetching order:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch order' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: order,
    });
  } catch (error) {
    console.error('Error in GET /api/orders/[id]:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/orders/[id] - Update an order
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body: UpdateOrderData = await request.json();

    // Check if order exists
    const { data: existingOrder, error: fetchError } = await supabase
      .from('orders')
      .select('id, status')
      .eq('id', id)
      .single();

    if (fetchError) {
      if (fetchError.code === 'PGRST116') {
        return NextResponse.json(
          { success: false, error: 'Order not found' },
          { status: 404 }
        );
      }
      console.error('Error fetching order:', fetchError);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch order' },
        { status: 500 }
      );
    }

    // Validate status transition if status is being updated
    if (body.status && body.status !== existingOrder.status) {
      const validTransitions: Record<OrderStatus, OrderStatus[]> = {
        pending: ['confirmed', 'cancelled'],
        confirmed: ['processing', 'cancelled'],
        processing: ['shipped', 'cancelled'],
        shipped: ['delivered'],
        delivered: [],
        cancelled: [],
      };

      const allowedStatuses = validTransitions[existingOrder.status as OrderStatus];
      if (!allowedStatuses.includes(body.status as OrderStatus)) {
        return NextResponse.json(
          { success: false, error: `Cannot change status from ${existingOrder.status} to ${body.status}` },
          { status: 400 }
        );
      }
    }

    // If district is being updated, validate it and recalculate delivery charge
    let updateData: any = { ...body };
    
    if (body.district_id && body.district_id !== existingOrder.district_id) {
      const { data: district, error: districtError } = await supabase
        .from('districts')
        .select('id, delivery_charge')
        .eq('id', body.district_id)
        .single();

      if (districtError || !district) {
        return NextResponse.json(
          { success: false, error: 'Invalid district' },
          { status: 400 }
        );
      }

      // Recalculate total amount with new delivery charge
      const { data: currentOrder } = await supabase
        .from('orders')
        .select('subtotal')
        .eq('id', id)
        .single();

      if (currentOrder) {
        updateData.delivery_charge = district.delivery_charge;
        updateData.total_amount = currentOrder.subtotal + district.delivery_charge;
      }
    }

    updateData.updated_at = new Date().toISOString();

    // Update the order
    const { data: order, error } = await supabase
      .from('orders')
      .update(updateData)
      .eq('id', id)
      .select(`
        *,
        order_items(
          id,
          quantity,
          unit_price,
          products(id, name, slug, images, price)
        ),
        districts(id, name, delivery_charge)
      `)
      .single();

    if (error) {
      console.error('Error updating order:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to update order' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: order,
      message: 'Order updated successfully',
    });
  } catch (error) {
    console.error('Error in PUT /api/orders/[id]:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/orders/[id] - Delete an order (only if pending or cancelled)
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    // Check if order exists and get its status
    const { data: existingOrder, error: fetchError } = await supabase
      .from('orders')
      .select('id, status')
      .eq('id', id)
      .single();

    if (fetchError) {
      if (fetchError.code === 'PGRST116') {
        return NextResponse.json(
          { success: false, error: 'Order not found' },
          { status: 404 }
        );
      }
      console.error('Error fetching order:', fetchError);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch order' },
        { status: 500 }
      );
    }

    // Only allow deletion of pending or cancelled orders
    if (!['pending', 'cancelled'].includes(existingOrder.status)) {
      return NextResponse.json(
        { success: false, error: 'Cannot delete order with status: ' + existingOrder.status },
        { status: 409 }
      );
    }

    // If order is pending, restore product stock quantities
    if (existingOrder.status === 'pending') {
      const { data: orderItems, error: itemsError } = await supabase
        .from('order_items')
        .select('product_id, quantity')
        .eq('order_id', id);

      if (!itemsError && orderItems) {
        for (const item of orderItems) {
          await supabase
            .from('products')
            .update({
              stock_quantity: supabase.rpc('increment_stock', {
                product_id: item.product_id,
                quantity: item.quantity
              })
            })
            .eq('id', item.product_id);
        }
      }
    }

    // Delete order items first (due to foreign key constraint)
    const { error: itemsDeleteError } = await supabase
      .from('order_items')
      .delete()
      .eq('order_id', id);

    if (itemsDeleteError) {
      console.error('Error deleting order items:', itemsDeleteError);
      return NextResponse.json(
        { success: false, error: 'Failed to delete order items' },
        { status: 500 }
      );
    }

    // Delete the order
    const { error } = await supabase
      .from('orders')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting order:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to delete order' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Order deleted successfully',
    });
  } catch (error) {
    console.error('Error in DELETE /api/orders/[id]:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}