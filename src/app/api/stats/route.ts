import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient()
    
    // Get total orders
    const { count: totalOrders } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true })
    
    // Get total products
    const { count: totalProducts } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
    
    // Get total categories
    const { count: totalCategories } = await supabase
      .from('categories')
      .select('*', { count: 'exact', head: true })
    
    // Get total revenue
    const { data: revenueData } = await supabase
      .from('orders')
      .select('total_amount')
      .eq('payment_status', 'paid')
    
    const totalRevenue = revenueData?.reduce((sum, order) => sum + (order.total_amount || 0), 0) || 0
    
    // Get recent orders
    const { data: recentOrders } = await supabase
      .from('orders')
      .select(`
        id,
        order_number,
        customer_name,
        total_amount,
        status,
        created_at
      `)
      .order('created_at', { ascending: false })
      .limit(5)
    
    // Get low stock products
    const { data: lowStockProducts } = await supabase
      .from('products')
      .select('id, name, stock_quantity, image_url')
      .lte('stock_quantity', 10)
      .eq('is_active', true)
      .order('stock_quantity', { ascending: true })
      .limit(5)
    
    // Get top selling products (based on order items)
    const { data: topSellingData } = await supabase
      .from('order_items')
      .select(`
        product_id,
        quantity,
        products (
          id,
          name,
          image_url
        )
      `)
    
    // Calculate top selling products
    const productSales: { [key: string]: { product: any, totalSold: number } } = {}
    
    topSellingData?.forEach(item => {
      const productId = item.product_id
      if (!productSales[productId]) {
        productSales[productId] = {
          product: item.products,
          totalSold: 0
        }
      }
      productSales[productId].totalSold += item.quantity
    })
    
    const topSellingProducts = Object.values(productSales)
      .sort((a, b) => b.totalSold - a.totalSold)
      .slice(0, 5)
    
    return NextResponse.json({
      stats: {
        totalOrders: totalOrders || 0,
        totalProducts: totalProducts || 0,
        totalCategories: totalCategories || 0,
        totalRevenue
      },
      recentOrders: recentOrders || [],
      lowStockProducts: lowStockProducts || [],
      topSellingProducts
    })
  } catch (error) {
    console.error('Error in stats API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}