'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  ShoppingCart,
  Package,
  Users,
  TrendingUp,
  DollarSign,
  Eye,
  Calendar,
  ArrowUpRight,
} from 'lucide-react'
import AdminSidebar from '@/components/layout/AdminSidebar'
import AdminAuthWrapper from '@/components/admin/AdminAuthWrapper'
import { createClient } from '@/lib/supabase'
import Link from 'next/link'

interface DashboardStats {
  totalOrders: number
  totalProducts: number
  totalCustomers: number
  totalRevenue: number
  recentOrders: any[]
  lowStockProducts: any[]
  topProducts: any[]
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalOrders: 0,
    totalProducts: 0,
    totalCustomers: 0,
    totalRevenue: 0,
    recentOrders: [],
    lowStockProducts: [],
    topProducts: [],
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      const supabase = createClient()

      try {
        // Fetch total orders
        const { count: ordersCount } = await supabase
          .from('orders')
          .select('*', { count: 'exact', head: true })

        // Fetch total products
        const { count: productsCount } = await supabase
          .from('products')
          .select('*', { count: 'exact', head: true })

        // Fetch total customers (unique customer emails)
        const { data: customersData } = await supabase.from('orders').select('customer_email')

        const uniqueCustomers = new Set(customersData?.map((order) => order.customer_email) || [])

        // Fetch total revenue
        const { data: ordersData } = await supabase
          .from('orders')
          .select('total_amount')
          .eq('payment_status', 'paid')

        const totalRevenue = ordersData?.reduce((sum, order) => sum + order.total_amount, 0) || 0

        // Fetch recent orders
        const { data: recentOrders } = await supabase
          .from('orders')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(5)

        // Fetch low stock products
        const { data: lowStockProducts } = await supabase
          .from('products')
          .select('*')
          .lt('stock_quantity', 10)
          .eq('is_active', true)
          .limit(5)

        // Fetch top products (by order items count)
        const { data: topProductsData } = await supabase.from('order_items').select(`
            product_id,
            product_name,
            quantity
          `)

        // Group by product and sum quantities
        const productSales =
          topProductsData?.reduce((acc: any, item) => {
            if (!acc[item.product_id]) {
              acc[item.product_id] = {
                product_id: item.product_id,
                product_name: item.product_name,
                total_sold: 0,
              }
            }
            acc[item.product_id].total_sold += item.quantity
            return acc
          }, {}) || {}

        const topProducts = Object.values(productSales)
          .sort((a: any, b: any) => b.total_sold - a.total_sold)
          .slice(0, 5)

        setStats({
          totalOrders: ordersCount || 0,
          totalProducts: productsCount || 0,
          totalCustomers: uniqueCustomers.size,
          totalRevenue,
          recentOrders: recentOrders || [],
          lowStockProducts: lowStockProducts || [],
          topProducts: topProducts as any[],
        })
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-BD', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const getStatusBadge = (status: string) => {
    const statusColors = {
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      shipped: 'bg-purple-100 text-purple-800',
      delivered: 'bg-yellow-100 text-yellow-800',
      cancelled: 'bg-red-100 text-red-800',
    }

    return (
      <Badge
        className={statusColors[status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800'}
      >
        {status}
      </Badge>
    )
  }

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-50">
        <AdminSidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600"></div>
        </div>
      </div>
    )
  }

  return (
    <AdminAuthWrapper>
      <div className="flex h-screen bg-gray-50">
        <AdminSidebar />

        <div className="flex-1 overflow-auto">
          <div className="p-6">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600">
                Welcome back! Here's what's happening with your store.
              </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Orders</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
                    </div>
                    <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <ShoppingCart className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Products</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.totalProducts}</p>
                    </div>
                    <div className="h-12 w-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                      <Package className="h-6 w-6 text-yellow-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Customers</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.totalCustomers}</p>
                    </div>
                    <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Users className="h-6 w-6 text-purple-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {formatCurrency(stats.totalRevenue)}
                      </p>
                    </div>
                    <div className="h-12 w-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                      <DollarSign className="h-6 w-6 text-yellow-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Orders */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Recent Orders</CardTitle>
                  <Link href="/admin/orders">
                    <Button variant="ghost" size="sm">
                      View All
                      <ArrowUpRight className="h-4 w-4 ml-1" />
                    </Button>
                  </Link>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {stats.recentOrders.length === 0 ? (
                      <p className="text-gray-500 text-center py-4">No orders yet</p>
                    ) : (
                      stats.recentOrders.map((order) => (
                        <div
                          key={order.id}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                        >
                          <div>
                            <p className="font-medium">#{order.order_number}</p>
                            <p className="text-sm text-gray-600">{order.customer_name}</p>
                            <p className="text-xs text-gray-500">{formatDate(order.created_at)}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">{formatCurrency(order.total_amount)}</p>
                            {getStatusBadge(order.status)}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Low Stock Products */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Low Stock Alert</CardTitle>
                  <Link href="/admin/products">
                    <Button variant="ghost" size="sm">
                      View All
                      <ArrowUpRight className="h-4 w-4 ml-1" />
                    </Button>
                  </Link>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {stats.lowStockProducts.length === 0 ? (
                      <p className="text-gray-500 text-center py-4">
                        All products are well stocked
                      </p>
                    ) : (
                      stats.lowStockProducts.map((product) => (
                        <div
                          key={product.id}
                          className="flex items-center justify-between p-3 bg-red-50 rounded-lg"
                        >
                          <div>
                            <p className="font-medium">{product.name}</p>
                            <p className="text-sm text-gray-600">SKU: {product.sku}</p>
                          </div>
                          <div className="text-right">
                            <Badge variant="destructive">{product.stock_quantity} left</Badge>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Top Products */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Top Selling Products</CardTitle>
                  <Link href="/admin/products">
                    <Button variant="ghost" size="sm">
                      View All
                      <ArrowUpRight className="h-4 w-4 ml-1" />
                    </Button>
                  </Link>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {stats.topProducts.length === 0 ? (
                      <p className="text-gray-500 text-center py-4">No sales data yet</p>
                    ) : (
                      stats.topProducts.map((product, index) => (
                        <div
                          key={product.product_id}
                          className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 bg-yellow-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                              {index + 1}
                            </div>
                            <div>
                              <p className="font-medium">{product.product_name}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge variant="secondary">{product.total_sold} sold</Badge>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    <Link href="/admin/products/new">
                      <Button className="w-full" variant="outline">
                        <Package className="h-4 w-4 mr-2" />
                        Add Product
                      </Button>
                    </Link>
                    <Link href="/admin/categories/new">
                      <Button className="w-full" variant="outline">
                        <TrendingUp className="h-4 w-4 mr-2" />
                        Add Category
                      </Button>
                    </Link>
                    <Link href="/admin/orders">
                      <Button className="w-full" variant="outline">
                        <Eye className="h-4 w-4 mr-2" />
                        View Orders
                      </Button>
                    </Link>
                    <Link href="/admin/settings">
                      <Button className="w-full" variant="outline">
                        <Calendar className="h-4 w-4 mr-2" />
                        Settings
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </AdminAuthWrapper>
  )
}
