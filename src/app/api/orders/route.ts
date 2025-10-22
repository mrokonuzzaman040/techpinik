import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { CreateOrderData, OrderStatus } from '@/types';

// GET /api/orders - Get all orders with filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status') as OrderStatus;
    const customer_phone = searchParams.get('customer_phone');
    const date_from = searchParams.get('date_from');
    const date_to = searchParams.get('date_to');
    const sort_by = searchParams.get('sort_by') || 'created_at';
    const sort_order = searchParams.get('sort_order') || 'desc';

    const offset = (page - 1) * limit;

    let query = supabase
      .from('orders')
      .select(`
        *,
        order_items(
          id,
          quantity,
          unit_price,
          products(id, name, slug, images)
        ),
        districts(id, name, delivery_charge)
      `, { count: 'exact' });

    // Apply filters
    if (status) {
      query = query.eq('status', status);
    }

    if (customer_phone) {
      query = query.ilike('customer_phone', `%${customer_phone}%`);
    }

    if (date_from) {
      query = query.gte('created_at', date_from);
    }

    if (date_to) {
      query = query.lte('created_at', date_to);
    }

    // Apply sorting
    query = query.order(sort_by, { ascending: sort_order === 'asc' });

    // Apply pagination
    query = query.range(offset, offset + limit - 1);

    const { data: orders, error, count } = await query;

    if (error) {
      console.error('Error fetching orders:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch orders' },
        { status: 500 }
      );
    }

    const totalPages = Math.ceil((count || 0) / limit);

    return NextResponse.json({
      success: true,
      data: orders,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    console.error('Error in GET /api/orders:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/orders - Create a new order
export async function POST(request: NextRequest) {
  try {
    const body: CreateOrderData = await request.json();

    // Validate required fields
    if (!body.customer_name || !body.customer_phone || !body.customer_address || 
        !body.district_id || !body.items || body.items.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate district exists and get delivery charge
    const { data: district, error: districtError } = await supabase
      .from('districts')
      .select('id, name, delivery_charge')
      .eq('id', body.district_id)
      .single();

    if (districtError || !district) {
      return NextResponse.json(
        { success: false, error: 'Invalid district' },
        { status: 400 }
      );
    }

    // Validate products and calculate totals
    let subtotal = 0;
    const validatedItems = [];

    for (const item of body.items) {
      const { data: product, error: productError } = await supabase
        .from('products')
        .select('id, name, price, stock_quantity')
        .eq('id', item.product_id)
        .single();

      if (productError || !product) {
        return NextResponse.json(
          { success: false, error: `Product not found: ${item.product_id}` },
          { status: 400 }
        );
      }

      if (product.stock_quantity < item.quantity) {
        return NextResponse.json(
          { success: false, error: `Insufficient stock for product: ${product.name}` },
          { status: 400 }
        );
      }

      const itemTotal = product.price * item.quantity;
      subtotal += itemTotal;

      validatedItems.push({
        product_id: item.product_id,
        quantity: item.quantity,
        unit_price: product.price,
      });
    }

    const delivery_charge = district.delivery_charge;
    const total_amount = subtotal + delivery_charge;

    // Create the order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert([{
        customer_name: body.customer_name,
        customer_phone: body.customer_phone,
        customer_email: body.customer_email || null,
        customer_address: body.customer_address,
        district_id: body.district_id,
        subtotal,
        delivery_charge,
        total_amount,
        notes: body.notes || null,
        status: 'pending',
      }])
      .select()
      .single();

    if (orderError) {
      console.error('Error creating order:', orderError);
      return NextResponse.json(
        { success: false, error: 'Failed to create order' },
        { status: 500 }
      );
    }

    // Create order items
    const orderItemsData = validatedItems.map(item => ({
      ...item,
      order_id: order.id,
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItemsData);

    if (itemsError) {
      console.error('Error creating order items:', itemsError);
      // Rollback: delete the order
      await supabase.from('orders').delete().eq('id', order.id);
      return NextResponse.json(
        { success: false, error: 'Failed to create order items' },
        { status: 500 }
      );
    }

    // Update product stock quantities
    for (const item of validatedItems) {
      const { error: stockError } = await supabase
        .from('products')
        .update({
          stock_quantity: supabase.rpc('decrement_stock', {
            product_id: item.product_id,
            quantity: item.quantity
          })
        })
        .eq('id', item.product_id);

      if (stockError) {
        console.error('Error updating stock:', stockError);
        // Note: In a production app, you might want to implement proper transaction rollback
      }
    }

    // Fetch the complete order with items
    const { data: completeOrder, error: fetchError } = await supabase
      .from('orders')
      .select(`
        *,
        order_items(
          id,
          quantity,
          unit_price,
          products(id, name, slug, images)
        ),
        districts(id, name, delivery_charge)
      `)
      .eq('id', order.id)
      .single();

    if (fetchError) {
      console.error('Error fetching complete order:', fetchError);
      return NextResponse.json({
        success: true,
        data: order,
        message: 'Order created successfully',
      }, { status: 201 });
    }

    return NextResponse.json({
      success: true,
      data: completeOrder,
      message: 'Order created successfully',
    }, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/orders:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}