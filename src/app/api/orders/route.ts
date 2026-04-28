import { NextRequest } from 'next/server'
import { createServerClient } from '@/lib/supabase'; import { isAdmin } from '@/lib/supabase-server'
import { apiResponse } from '@/lib/utils'
import { orderSchema } from '@/lib/validations'
import { OrderStatus } from '@/types'

// GET /api/orders - Get all orders with filtering (Admin only)
export async function GET(request: NextRequest) {
  try {
    // Security check: Only admins can view the full order list
    if (!(await isAdmin())) {
      return apiResponse.unauthorized()
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const status = searchParams.get('status') as OrderStatus
    const customer_phone = searchParams.get('customer_phone')
    const date_from = searchParams.get('date_from')
    const date_to = searchParams.get('date_to')
    const sort_by = searchParams.get('sort_by') || 'created_at'
    const sort_order = searchParams.get('sort_order') || 'desc'

    const supabase = createServerClient()
    const offset = (page - 1) * limit

    let query = supabase.from('orders').select(
      `
        *,
        order_items(
          id,
          quantity,
          unit_price,
          products(id, name, slug, images)
        ),
        districts(id, name, delivery_charge)
      `,
      { count: 'exact' }
    )

    // Apply filters
    if (status) query = query.eq('status', status)
    if (customer_phone) query = query.ilike('customer_phone', `%${customer_phone}%`)
    if (date_from) query = query.gte('created_at', date_from)
    if (date_to) query = query.lte('created_at', date_to)

    // Apply sorting
    query = query.order(sort_by, { ascending: sort_order === 'asc' })

    // Apply pagination
    query = query.range(offset, offset + limit - 1)

    const { data: orders, error, count } = await query

    if (error) {
      return apiResponse.internalError('Failed to fetch orders', error)
    }

    const totalPages = Math.ceil((count || 0) / limit)

    return apiResponse.success({
      orders,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    })
  } catch (error) {
    return apiResponse.internalError('Internal server error', error)
  }
}

// POST /api/orders - Create a new order (Public)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate order data
    const validation = orderSchema.safeParse(body)
    if (!validation.success) {
      return apiResponse.badRequest(validation.error.issues[0]?.message ?? 'Invalid request payload')
    }

    const data = validation.data
    const supabase = createServerClient()

    // Validate district exists and get delivery charge
    const { data: district, error: districtError } = await supabase
      .from('districts')
      .select('id, name, delivery_charge')
      .eq('id', data.district_id)
      .single()

    if (districtError || !district) {
      return apiResponse.badRequest('Invalid district')
    }

    // Validate products and calculate totals
    let subtotal = 0
    const validatedItems = []

    for (const item of data.items) {
      const { data: product, error: productError } = await supabase
        .from('products')
        .select('id, name, price, stock_quantity')
        .eq('id', item.product_id)
        .single()

      if (productError || !product) {
        return apiResponse.badRequest(`Product not found: ${item.product_id}`)
      }

      if (product.stock_quantity < item.quantity) {
        return apiResponse.badRequest(`Insufficient stock for product: ${product.name}`)
      }

      subtotal += product.price * item.quantity

      validatedItems.push({
        product_id: item.product_id,
        quantity: item.quantity,
        unit_price: product.price,
      })
    }

    const delivery_charge = district.delivery_charge
    const total_amount = subtotal + delivery_charge

    // Create the order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert([
        {
          customer_name: data.customer_name,
          customer_phone: data.customer_phone,
          customer_email: data.customer_email || null,
          customer_address: data.customer_address,
          district_id: data.district_id,
          total_amount,
          delivery_charge,
          notes: data.notes || null,
          status: 'pending',
        },
      ])
      .select()
      .single()

    if (orderError) {
      return apiResponse.internalError('Failed to create order', orderError)
    }

    // Create order items
    const orderItemsData = validatedItems.map((item) => ({
      ...item,
      order_id: order.id,
    }))

    const { error: itemsError } = await supabase.from('order_items').insert(orderItemsData)

    if (itemsError) {
      // Rollback: delete the order if items fail
      await supabase.from('orders').delete().eq('id', order.id)
      return apiResponse.internalError('Failed to create order items', itemsError)
    }

    // Update product stock quantities
    for (const item of validatedItems) {
      const { error: stockError } = await supabase.rpc('decrement_stock', {
        product_id: item.product_id,
        quantity: item.quantity,
      })

      if (stockError) {
        console.error('Error updating stock for product', item.product_id, ':', stockError)
      }
    }

    // Fetch the complete order with items
    const { data: completeOrder, error: fetchError } = await supabase
      .from('orders')
      .select(
        `
        *,
        order_items(
          id,
          quantity,
          unit_price,
          products(id, name, slug, images)
        ),
        districts(id, name, delivery_charge)
      `
      )
      .eq('id', order.id)
      .single()

    return apiResponse.success(
      fetchError ? order : completeOrder,
      'Order created successfully',
      201
    )
  } catch (error) {
    return apiResponse.internalError('Internal server error', error)
  }
}
