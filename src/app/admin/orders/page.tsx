'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { 
  Search, 
  Filter, 
  Eye,
  MoreHorizontal,
  ShoppingCart,
  Calendar,
  Download,
  FileText
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import AdminSidebar from '@/components/layout/AdminSidebar'
import { createClient } from '@/lib/supabase'
import { Order } from '@/types'

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState('all')

  useEffect(() => {
    fetchOrders()
  }, [searchQuery, selectedStatus, selectedPaymentStatus])

  const fetchOrders = async () => {
    setLoading(true)
    const supabase = createClient()

    try {
      let query = supabase
        .from('orders')
        .select(`
          *,
          order_items (
            id,
            quantity,
            unit_price,
            total_price
          )
        `)

      // Apply filters
      if (searchQuery) {
        query = query.or(`order_number.ilike.%${searchQuery}%,customer_name.ilike.%${searchQuery}%,customer_email.ilike.%${searchQuery}%`)
      }

      if (selectedStatus !== 'all') {
        query = query.eq('status', selectedStatus)
      }

      if (selectedPaymentStatus !== 'all') {
        query = query.eq('payment_status', selectedPaymentStatus)
      }

      query = query.order('created_at', { ascending: false })

      const { data, error } = await query

      if (error) throw error

      setOrders(data || [])
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    const supabase = createClient()

    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId)

      if (error) throw error

      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      ))
    } catch (error) {
      console.error('Error updating order status:', error)
      alert('Error updating order status. Please try again.')
    }
  }

  const updatePaymentStatus = async (orderId: string, newStatus: string) => {
    const supabase = createClient()

    try {
      const { error } = await supabase
        .from('orders')
        .update({ payment_status: newStatus })
        .eq('id', orderId)

      if (error) throw error

      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, payment_status: newStatus } : order
      ))
    } catch (error) {
      console.error('Error updating payment status:', error)
      alert('Error updating payment status. Please try again.')
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-BD', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const generateInvoice = (order: Order) => {
    // Create invoice content
    const invoiceContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Invoice #${order.order_number}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
          .header { text-align: center; margin-bottom: 30px; }
          .company-name { font-size: 24px; font-weight: bold; color: #059669; }
          .invoice-details { display: flex; justify-content: space-between; margin-bottom: 30px; }
          .customer-info, .invoice-info { width: 45%; }
          .table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
          .table th, .table td { border: 1px solid #ddd; padding: 12px; text-align: left; }
          .table th { background-color: #f5f5f5; }
          .total-section { text-align: right; margin-top: 20px; }
          .total-row { display: flex; justify-content: space-between; margin: 5px 0; }
          .grand-total { font-weight: bold; font-size: 18px; border-top: 2px solid #059669; padding-top: 10px; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="company-name">TechPinik</div>
          <p>Your Trusted Electronics Store</p>
        </div>
        
        <div class="invoice-details">
          <div class="customer-info">
            <h3>Bill To:</h3>
            <p><strong>${order.customer_name}</strong></p>
            <p>${order.customer_email}</p>
            <p>${order.customer_phone}</p>
            <p>${order.shipping_address}</p>
          </div>
          <div class="invoice-info">
            <h3>Invoice Details:</h3>
            <p><strong>Invoice #:</strong> ${order.order_number}</p>
            <p><strong>Date:</strong> ${formatDate(order.created_at)}</p>
            <p><strong>Payment Method:</strong> ${order.payment_method}</p>
            <p><strong>Status:</strong> ${order.status}</p>
          </div>
        </div>
        
        <table class="table">
          <thead>
            <tr>
              <th>Item</th>
              <th>Quantity</th>
              <th>Unit Price</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            ${(order as any).order_items?.map((item: any) => `
              <tr>
                <td>${item.product_name || 'Product'}</td>
                <td>${item.quantity}</td>
                <td>${formatCurrency(item.unit_price)}</td>
                <td>${formatCurrency(item.total_price || item.unit_price * item.quantity)}</td>
              </tr>
            `).join('') || ''}
          </tbody>
        </table>
        
        <div class="total-section">
          <div class="total-row">
            <span>Subtotal:</span>
            <span>${formatCurrency(order.total_amount - order.shipping_cost)}</span>
          </div>
          <div class="total-row">
            <span>Shipping:</span>
            <span>${formatCurrency(order.shipping_cost)}</span>
          </div>
          <div class="total-row grand-total">
            <span>Total:</span>
            <span>${formatCurrency(order.total_amount)}</span>
          </div>
        </div>
        
        <div style="margin-top: 50px; text-align: center; color: #666;">
          <p>Thank you for your business!</p>
          <p>For support, contact us at support@techpinik.com</p>
        </div>
      </body>
      </html>
    `

    // Create and download the invoice
    const blob = new Blob([invoiceContent], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `invoice-${order.order_number}.html`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const getStatusBadge = (status: string) => {
    const statusColors = {
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      shipped: 'bg-purple-100 text-purple-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    }

    return (
      <Badge className={statusColors[status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800'}>
        {status}
      </Badge>
    )
  }

  const getPaymentStatusBadge = (status: string) => {
    const statusColors = {
      pending: 'bg-yellow-100 text-yellow-800',
      paid: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800',
      refunded: 'bg-gray-100 text-gray-800'
    }

    return (
      <Badge className={statusColors[status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800'}>
        {status}
      </Badge>
    )
  }

  const getTotalItems = (orderItems: any[]) => {
    return orderItems.reduce((total, item) => total + item.quantity, 0)
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar />
      
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
              <p className="text-gray-600">Manage customer orders and fulfillment</p>
            </div>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export Orders
            </Button>
          </div>

          {/* Filters */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search by order number, customer name, or email..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="w-full md:w-40">
                    <SelectValue placeholder="Order Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="shipped">Shipped</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={selectedPaymentStatus} onValueChange={setSelectedPaymentStatus}>
                  <SelectTrigger className="w-full md:w-40">
                    <SelectValue placeholder="Payment Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Payments</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                    <SelectItem value="refunded">Refunded</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Orders Table */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                Orders ({orders.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                </div>
              ) : orders.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
                  <p className="text-gray-600">Orders will appear here when customers place them.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Order</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Items</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Payment</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orders.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium">#{order.order_number}</p>
                              <p className="text-sm text-gray-600">{order.payment_method}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium">{order.customer_name}</p>
                              <p className="text-sm text-gray-600">{order.customer_email}</p>
                              <p className="text-sm text-gray-600">{order.customer_phone}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm font-medium">
                              {getTotalItems((order as any).order_items || [])} items
                            </span>
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium">{formatCurrency(order.total_amount)}</p>
                              <p className="text-sm text-gray-600">
                                Shipping: {formatCurrency(order.shipping_cost)}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>
                            {getStatusBadge(order.status)}
                          </TableCell>
                          <TableCell>
                            {getPaymentStatusBadge(order.payment_status)}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4 text-gray-400" />
                              <span className="text-sm">{formatDate(order.created_at)}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem asChild>
                                  <Link href={`/admin/orders/${order.id}`}>
                                    <Eye className="h-4 w-4 mr-2" />
                                    View Details
                                  </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => generateInvoice(order)}>
                                  <FileText className="h-4 w-4 mr-2" />
                                  Generate Invoice
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => updateOrderStatus(order.id, 'processing')}
                                  disabled={order.status === 'processing'}
                                >
                                  Mark as Processing
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => updateOrderStatus(order.id, 'shipped')}
                                  disabled={order.status === 'shipped' || order.status === 'delivered'}
                                >
                                  Mark as Shipped
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => updateOrderStatus(order.id, 'delivered')}
                                  disabled={order.status === 'delivered'}
                                >
                                  Mark as Delivered
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => updatePaymentStatus(order.id, 'paid')}
                                  disabled={order.payment_status === 'paid'}
                                >
                                  Mark as Paid
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => updateOrderStatus(order.id, 'cancelled')}
                                  disabled={order.status === 'cancelled' || order.status === 'delivered'}
                                  className="text-red-600"
                                >
                                  Cancel Order
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}