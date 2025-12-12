'use client'

import { useState, useEffect } from 'react'
import {
  TrendingUp,
  ShoppingCart,
  Package,
  Users,
  DollarSign,
  Eye,
  Calendar,
  BarChart3,
  PieChart,
  Activity,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import AdminSidebar from '@/components/layout/AdminSidebar'
import AdminAuthWrapper from '@/components/admin/AdminAuthWrapper'
import { createClient } from '@/lib/supabase'

interface AnalyticsData {
  totalRevenue: number
  totalOrders: number
  totalProducts: number
  totalCustomers: number
  pendingOrders: number
  deliveredOrders: number
  activeProducts: number
  activeCustomers: number
  recentOrders: any[]
  topProducts: any[]
  monthlyRevenue: any[]
}

export default function AdminAnalyticsPage() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('30')

  useEffect(() => {
    fetchAnalyticsData()
  }, [timeRange])

  const fetchAnalyticsData = async () => {
    setLoading(true)
    const supabase = createClient()

    try {
      // Get basic stats
      const { data: ordersData } = await supabase
        .from('orders')
        .select('id, total_amount, status, created_at')

      const { data: productsData } = await supabase
        .from('products')
        .select('id, name, price, is_active, created_at')

      const { data: customersData } = await supabase
        .from('customers')
        .select('id, is_active, created_at')

      // Calculate analytics
      const totalRevenue =
        ordersData?.reduce((sum, order) => sum + Number(order.total_amount), 0) || 0
      const totalOrders = ordersData?.length || 0
      const pendingOrders = ordersData?.filter((order) => order.status === 'pending').length || 0
      const deliveredOrders =
        ordersData?.filter((order) => order.status === 'delivered').length || 0
      const totalProducts = productsData?.length || 0
      const activeProducts = productsData?.filter((product) => product.is_active).length || 0
      const totalCustomers = customersData?.length || 0
      const activeCustomers = customersData?.filter((customer) => customer.is_active).length || 0

      // Get recent orders
      const { data: recentOrders } = await supabase
        .from('orders')
        .select(
          `
          id,
          order_number,
          customer_name,
          total_amount,
          status,
          created_at
        `
        )
        .order('created_at', { ascending: false })
        .limit(5)

      // Get top products by order count
      const { data: topProductsData } = await supabase.from('order_items').select(`
          product_id,
          products!inner(name, price),
          quantity
        `)

      // Calculate product popularity
      const productStats = topProductsData?.reduce((acc: any, item: any) => {
        const productId = item.product_id
        if (!acc[productId]) {
          acc[productId] = {
            product_id: productId,
            name: item.products.name,
            price: item.products.price,
            total_quantity: 0,
            total_revenue: 0,
          }
        }
        acc[productId].total_quantity += item.quantity
        acc[productId].total_revenue += item.quantity * item.products.price
        return acc
      }, {})

      const topProducts = Object.values(productStats || {})
        .sort((a: any, b: any) => b.total_quantity - a.total_quantity)
        .slice(0, 5)

      // Get monthly revenue data
      const monthlyRevenue = ordersData?.reduce((acc: any, order: any) => {
        const month = new Date(order.created_at).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
        })
        if (!acc[month]) {
          acc[month] = 0
        }
        acc[month] += Number(order.total_amount)
        return acc
      }, {})

      const monthlyRevenueArray = Object.entries(monthlyRevenue || {})
        .map(([month, revenue]) => ({ month, revenue }))
        .sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime())

      setAnalyticsData({
        totalRevenue,
        totalOrders,
        totalProducts,
        totalCustomers,
        pendingOrders,
        deliveredOrders,
        activeProducts,
        activeCustomers,
        recentOrders: recentOrders || [],
        topProducts,
        monthlyRevenue: monthlyRevenueArray,
      })
    } catch (error) {
      console.error('Error fetching analytics data:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { variant: 'secondary' as const, label: 'Pending' },
      confirmed: { variant: 'default' as const, label: 'Confirmed' },
      processing: { variant: 'default' as const, label: 'Processing' },
      shipped: { variant: 'default' as const, label: 'Shipped' },
      delivered: { variant: 'default' as const, label: 'Delivered' },
      cancelled: { variant: 'destructive' as const, label: 'Cancelled' },
    }

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  if (loading) {
    return (
      <AdminAuthWrapper>
        <div className="flex h-screen bg-gray-50">
          <AdminSidebar />
          <div className="flex-1 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600"></div>
          </div>
        </div>
      </AdminAuthWrapper>
    )
  }

  return (
    <AdminAuthWrapper>
      <div className="flex h-screen bg-gray-50">
        <AdminSidebar />

        <div className="flex-1 overflow-auto">
          <div className="p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
                <p className="text-gray-600">Overview of your business performance</p>
              </div>
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Time Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">Last 7 days</SelectItem>
                  <SelectItem value="30">Last 30 days</SelectItem>
                  <SelectItem value="90">Last 90 days</SelectItem>
                  <SelectItem value="365">Last year</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {formatCurrency(analyticsData?.totalRevenue || 0)}
                  </div>
                  <p className="text-xs text-muted-foreground">+20.1% from last month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                  <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analyticsData?.totalOrders || 0}</div>
                  <p className="text-xs text-muted-foreground">
                    {analyticsData?.deliveredOrders || 0} delivered
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Products</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analyticsData?.activeProducts || 0}</div>
                  <p className="text-xs text-muted-foreground">
                    {analyticsData?.totalProducts || 0} total products
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Customers</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analyticsData?.activeCustomers || 0}</div>
                  <p className="text-xs text-muted-foreground">
                    {analyticsData?.totalCustomers || 0} total customers
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Charts and Tables */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Recent Orders */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Activity className="h-5 w-5 mr-2" />
                    Recent Orders
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analyticsData?.recentOrders.map((order) => (
                      <div key={order.id} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{order.order_number}</p>
                          <p className="text-sm text-gray-500">{order.customer_name}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{formatCurrency(order.total_amount)}</p>
                          <div className="flex items-center space-x-2">
                            {getStatusBadge(order.status)}
                            <span className="text-xs text-gray-500">
                              {formatDate(order.created_at)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Top Products */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2" />
                    Top Products
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analyticsData?.topProducts.map((product: any, index) => (
                      <div key={product.product_id} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-yellow-600">
                              #{index + 1}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium">{product.name}</p>
                            <p className="text-sm text-gray-500">{product.total_quantity} sold</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{formatCurrency(product.total_revenue)}</p>
                          <p className="text-sm text-gray-500">
                            {formatCurrency(product.price)} each
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Order Status Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calendar className="h-5 w-5 mr-2" />
                    Pending Orders
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-orange-600">
                    {analyticsData?.pendingOrders || 0}
                  </div>
                  <p className="text-sm text-gray-500">Awaiting processing</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="h-5 w-5 mr-2" />
                    Delivered Orders
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-yellow-600">
                    {analyticsData?.deliveredOrders || 0}
                  </div>
                  <p className="text-sm text-gray-500">Successfully completed</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <PieChart className="h-5 w-5 mr-2" />
                    Completion Rate
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-600">
                    {analyticsData?.totalOrders
                      ? Math.round(
                          (analyticsData.deliveredOrders / analyticsData.totalOrders) * 100
                        )
                      : 0}
                    %
                  </div>
                  <p className="text-sm text-gray-500">Orders delivered</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </AdminAuthWrapper>
  )
}
