import { NextRequest } from 'next/server'
import { createServerClient } from '@/lib/supabase'; import { isAdmin } from '@/lib/supabase-server'
import { apiResponse } from '@/lib/utils'

// GET /api/admin/stats - Get admin dashboard statistics (Admin only)
export async function GET(request: NextRequest) {
  try {
    // Security check
    if (!(await isAdmin())) {
      return apiResponse.unauthorized()
    }

    const { searchParams } = new URL(request.url)
    const period = searchParams.get('period') || '30' // days
    const supabase = createServerClient()

    // Calculate date range
    const endDate = new Date()
    const startDate = new Date()
    startDate.setDate(endDate.getDate() - parseInt(period))

    // Get total counts in parallel for performance
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
    ])

    // Get orders in the specified period
    const { data: periodOrders, error: ordersError } = await supabase
      .from('orders')
      .select('total_amount, status, created_at')
      .gte('created_at', startDate.toISOString())
      .lte('created_at', endDate.toISOString())

    if (ordersError) {
      return apiResponse.internalError('Failed to fetch order statistics', ordersError)
    }

    // Calculate revenue and status distribution
    const totalRevenue = periodOrders?.reduce((sum, order) => sum + (order.total_amount || 0), 0) || 0
    
    const statusCounts = periodOrders?.reduce((acc: Record<string, number>, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1
      return acc
    }, {}) || {}

    // Get low stock products
    const { data: lowStockProducts } = await supabase
      .from('products')
      .select('id, name, stock_quantity')
      .lt('stock_quantity', 10)
      .order('stock_quantity', { ascending: true })
      .limit(10)

    // Get recent orders
    const { data: recentOrders } = await supabase
      .from('orders')
      .select(`
        id,
        customer_name,
        total_amount,
        status,
        created_at,
        districts(name)
      `)
      .order('created_at', { ascending: false })
      .limit(10)

    // Get top selling products
    const { data: topProducts } = await supabase
      .from('order_items')
      .select(`
        product_id,
        quantity,
        products(id, name, images),
        orders!inner(created_at)
      `)
      .gte('orders.created_at', startDate.toISOString())
      .lte('orders.created_at', endDate.toISOString())

    let topSellingProducts: any[] = []
    if (topProducts) {
      const productSales = topProducts.reduce((acc: any, item: any) => {
        const productId = item.product_id
        if (!acc[productId]) {
          acc[productId] = {
            product: item.products,
            totalQuantity: 0,
          }
        }
        acc[productId].totalQuantity += item.quantity
        return acc
      }, {})

      topSellingProducts = Object.values(productSales)
        .sort((a: any, b: any) => b.totalQuantity - a.totalQuantity)
        .slice(0, 5)
    }

    // Prepare daily revenue chart data
    const revenueChart = []
    for (let i = 6; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const dayStart = new Date(date.setHours(0, 0, 0, 0))
      const dayEnd = new Date(date.setHours(23, 59, 59, 999))

      const dayRevenue = periodOrders
        ?.filter(order => {
          const orderDate = new Date(order.created_at)
          return orderDate >= dayStart && orderDate <= dayEnd
        })
        .reduce((sum, order) => sum + (order.total_amount || 0), 0) || 0

      revenueChart.push({
        date: dayStart.toISOString().split('T')[0],
        revenue: dayRevenue,
      })
    }

    return apiResponse.success({
      overview: {
        totalProducts: totalProducts || 0,
        totalCategories: totalCategories || 0,
        totalOrders: totalOrders || 0,
        totalDistricts: totalDistricts || 0,
        totalRevenue,
        periodOrders: periodOrders?.length || 0,
      },
      orderStatus: statusCounts,
      lowStockProducts: lowStockProducts || [],
      recentOrders: recentOrders || [],
      topSellingProducts,
      revenueChart,
      period: parseInt(period),
    })
  } catch (error) {
    return apiResponse.internalError('Internal server error', error)
  }
}
