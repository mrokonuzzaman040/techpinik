import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET /api/admin/stats - Get admin dashboard statistics
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || '30'; // days

    // Calculate date range
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - parseInt(period));

    // Get total counts
    const [
      { count: totalProducts },
      { count: totalCategories },
      { count: totalOrders },
      { count: totalDistricts },
    ] = await Promise.all([
      supabase.from('products').select('*', { count: 'exact', head: true }),
      supabase.from('categories').select('*', { count: 'exact', head: true }),
      supabase.from('orders').select('*', { count: 'exact', head: true }),
      supabase.from('districts').select('*', { count: 'exact', head: true }),
    ]);

    // Get orders in the specified period
    const { data: periodOrders, error: ordersError } = await supabase
      .from('orders')
      .select('total_amount, status, created_at')
      .gte('created_at', startDate.toISOString())
      .lte('created_at', endDate.toISOString());

    if (ordersError) {
      console.error('Error fetching period orders:', ordersError);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch order statistics' },
        { status: 500 }
      );
    }

    // Calculate revenue and order statistics
    const totalRevenue = periodOrders?.reduce((sum, order) => sum + (order.total_amount || 0), 0) || 0;
    const pendingOrders = periodOrders?.filter(order => order.status === 'pending').length || 0;
    const confirmedOrders = periodOrders?.filter(order => order.status === 'confirmed').length || 0;
    const processingOrders = periodOrders?.filter(order => order.status === 'processing').length || 0;
    const shippedOrders = periodOrders?.filter(order => order.status === 'shipped').length || 0;
    const deliveredOrders = periodOrders?.filter(order => order.status === 'delivered').length || 0;
    const cancelledOrders = periodOrders?.filter(order => order.status === 'cancelled').length || 0;

    // Get low stock products (stock_quantity < 10)
    const { data: lowStockProducts, error: stockError } = await supabase
      .from('products')
      .select('id, name, stock_quantity')
      .lt('stock_quantity', 10)
      .order('stock_quantity', { ascending: true });

    if (stockError) {
      console.error('Error fetching low stock products:', stockError);
    }

    // Get recent orders
    const { data: recentOrders, error: recentError } = await supabase
      .from('orders')
      .select(`
        id,
        customer_name,
        customer_phone,
        total_amount,
        status,
        created_at,
        districts(name)
      `)
      .order('created_at', { ascending: false })
      .limit(10);

    if (recentError) {
      console.error('Error fetching recent orders:', recentError);
    }

    // Get top selling products (based on order items in the period)
    const { data: topProducts, error: topProductsError } = await supabase
      .from('order_items')
      .select(`
        product_id,
        quantity,
        products(id, name, images),
        orders!inner(created_at)
      `)
      .gte('orders.created_at', startDate.toISOString())
      .lte('orders.created_at', endDate.toISOString());

    let topSellingProducts: any[] = [];
    if (!topProductsError && topProducts) {
      // Aggregate quantities by product
      const productSales = topProducts.reduce((acc: any, item: any) => {
        const productId = item.product_id;
        if (!acc[productId]) {
          acc[productId] = {
            product: item.products,
            totalQuantity: 0,
          };
        }
        acc[productId].totalQuantity += item.quantity;
        return acc;
      }, {});

      // Sort by total quantity and take top 5
      topSellingProducts = Object.values(productSales)
        .sort((a: any, b: any) => b.totalQuantity - a.totalQuantity)
        .slice(0, 5);
    }

    // Prepare daily revenue chart data for the last 7 days
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dayStart = new Date(date.setHours(0, 0, 0, 0));
      const dayEnd = new Date(date.setHours(23, 59, 59, 999));
      
      const dayRevenue = periodOrders?.filter(order => {
        const orderDate = new Date(order.created_at);
        return orderDate >= dayStart && orderDate <= dayEnd;
      }).reduce((sum, order) => sum + (order.total_amount || 0), 0) || 0;

      last7Days.push({
        date: dayStart.toISOString().split('T')[0],
        revenue: dayRevenue,
      });
    }

    const stats = {
      overview: {
        totalProducts: totalProducts || 0,
        totalCategories: totalCategories || 0,
        totalOrders: totalOrders || 0,
        totalDistricts: totalDistricts || 0,
        totalRevenue,
        periodOrders: periodOrders?.length || 0,
      },
      orderStatus: {
        pending: pendingOrders,
        confirmed: confirmedOrders,
        processing: processingOrders,
        shipped: shippedOrders,
        delivered: deliveredOrders,
        cancelled: cancelledOrders,
      },
      lowStockProducts: lowStockProducts || [],
      recentOrders: recentOrders || [],
      topSellingProducts,
      revenueChart: last7Days,
      period: parseInt(period),
    };

    return NextResponse.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error('Error in GET /api/admin/stats:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}