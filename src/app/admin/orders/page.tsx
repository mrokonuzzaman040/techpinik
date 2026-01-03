'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  Search,
  Eye,
  MoreHorizontal,
  ShoppingCart,
  Calendar,
  Download,
  FileText,
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
  TableRow,
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
import { Order, OrderStatus } from '@/types'

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
      let query = supabase.from('orders').select(`
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
        query = query.or(
          `order_number.ilike.%${searchQuery}%,customer_name.ilike.%${searchQuery}%,customer_email.ilike.%${searchQuery}%`
        )
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

      setOrders((data || []) as Order[])
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

      setOrders(
        orders.map((order) =>
          order.id === orderId ? { ...order, status: newStatus as OrderStatus } : order
        )
      )
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

      setOrders(
        orders.map((order) =>
          order.id === orderId ? { ...order, payment_status: newStatus } : order
        )
      )
    } catch (error) {
      console.error('Error updating payment status:', error)
      alert('Error updating payment status. Please try again.')
    }
  }

  const formatCurrency = (amount: number | string | undefined) => {
    if (amount === undefined || amount === null) return '৳0'
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount
    if (isNaN(numAmount)) return '৳0'
    return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 0,
    }).format(numAmount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-BD', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const generateInvoice = async (order: Order) => {
    // Helper function to safely format currency
    const safeFormatCurrency = (amount: number | string | undefined) => {
      if (amount === undefined || amount === null) return '৳0'
      const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount
      if (isNaN(numAmount)) return '৳0'
      return new Intl.NumberFormat('en-BD', {
        style: 'currency',
        currency: 'BDT',
        minimumFractionDigits: 0,
      }).format(numAmount)
    }

    // Calculate safe totals
    const totalAmount =
      typeof order.total_amount === 'string'
        ? parseFloat(order.total_amount)
        : order.total_amount || 0
    const shippingCost =
      typeof order.delivery_charge === 'string'
        ? parseFloat(order.delivery_charge)
        : order.delivery_charge || 0
    const subtotal = totalAmount - shippingCost

    // Get logo as base64 - fetch from public folder
    let logoBase64 = ''
    try {
      const logoUrl = window.location.origin + '/logo.png'
      const response = await fetch(logoUrl)
      if (response.ok) {
        const blob = await response.blob()
        const reader = new FileReader()
        logoBase64 = await new Promise<string>((resolve, reject) => {
          reader.onloadend = () => {
            const result = reader.result as string
            const base64String = result.split(',')[1] || ''
            resolve(base64String)
          }
          reader.onerror = reject
          reader.readAsDataURL(blob)
        })
      }
    } catch (error) {
      console.error('Error loading logo:', error)
      // Continue without logo if fetch fails
      logoBase64 = ''
    }

    // Create invoice content
    const invoiceContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Invoice #${order.order_number}</title>
        <meta charset="UTF-8">
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif; 
            line-height: 1.6; 
            color: #2c3e50; 
            background: #ffffff;
            padding: 40px 20px;
          }
          .invoice-container {
            max-width: 900px;
            margin: 0 auto;
            background: white;
            border: 1px solid #e0e0e0;
            box-shadow: 0 2px 8px rgba(0,0,0,0.08);
          }
          .header {
            background: #2c3e50;
            color: white;
            padding: 50px 50px 40px;
            border-bottom: 4px solid #1a252f;
          }
          .header-content {
            display: flex;
            align-items: center;
            justify-content: space-between;
          }
          .logo-section {
            display: flex;
            align-items: center;
            gap: 20px;
          }
          .logo {
            height: 60px;
            width: auto;
          }
          .company-info {
            flex: 1;
          }
          .company-name {
            font-size: 28px;
            font-weight: 700;
            margin-bottom: 6px;
            letter-spacing: 0.5px;
          }
          .company-tagline {
            font-size: 14px;
            opacity: 0.9;
            font-weight: 300;
          }
          .invoice-title {
            text-align: right;
          }
          .invoice-title-text {
            font-size: 36px;
            font-weight: 300;
            margin-bottom: 8px;
            letter-spacing: 2px;
          }
          .invoice-number {
            font-size: 14px;
            opacity: 0.9;
            font-weight: 400;
          }
          .invoice-details {
            display: flex;
            padding: 40px 50px;
            gap: 60px;
            background: #fafafa;
            border-bottom: 1px solid #e0e0e0;
          }
          .customer-info, .invoice-info {
            flex: 1;
          }
          .section-title {
            font-size: 12px;
            font-weight: 700;
            color: #2c3e50;
            margin-bottom: 20px;
            padding-bottom: 10px;
            border-bottom: 2px solid #2c3e50;
            text-transform: uppercase;
            letter-spacing: 1px;
          }
          .info-row {
            margin-bottom: 14px;
            display: flex;
            align-items: flex-start;
          }
          .info-label {
            font-weight: 600;
            color: #7f8c8d;
            min-width: 100px;
            font-size: 13px;
          }
          .info-value {
            color: #2c3e50;
            font-weight: 400;
            font-size: 14px;
            flex: 1;
          }
          .table-container {
            padding: 40px 50px;
            background: white;
          }
          .table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 30px;
          }
          .table th {
            background: #2c3e50;
            color: white;
            padding: 16px 12px;
            text-align: left;
            font-weight: 600;
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 0.8px;
            border-bottom: 2px solid #1a252f;
          }
          .table td {
            padding: 16px 12px;
            border-bottom: 1px solid #ecf0f1;
            background: white;
            font-size: 14px;
            color: #2c3e50;
          }
          .table tr:last-child td {
            border-bottom: none;
          }
          .total-section {
            padding: 0 50px 40px;
            background: white;
          }
          .total-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 12px 0;
            border-bottom: 1px solid #ecf0f1;
          }
          .total-row:last-child {
            border-bottom: none;
          }
          .total-label {
            font-weight: 600;
            color: #2c3e50;
            font-size: 14px;
          }
          .total-value {
            font-weight: 600;
            color: #2c3e50;
            font-size: 14px;
          }
          .grand-total {
            background: #2c3e50;
            color: white;
            padding: 20px 30px;
            margin-top: 20px;
            font-size: 18px;
            font-weight: 700;
          }
          .grand-total .total-label,
          .grand-total .total-value {
            color: white;
            font-size: 18px;
          }
          .footer {
            background: #fafafa;
            padding: 40px 50px;
            text-align: center;
            color: #7f8c8d;
            border-top: 1px solid #e0e0e0;
          }
          .footer h3 {
            color: #2c3e50;
            margin-bottom: 16px;
            font-size: 16px;
            font-weight: 600;
          }
          .footer p {
            margin-bottom: 8px;
            font-size: 13px;
          }
          .status-badge {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 3px;
            font-size: 11px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            background: #ecf0f1;
            color: #2c3e50;
          }
          .status-pending { background: #ecf0f1; color: #2c3e50; }
          .status-processing { background: #ecf0f1; color: #2c3e50; }
          .status-shipped { background: #ecf0f1; color: #2c3e50; }
          .status-delivered { background: #ecf0f1; color: #2c3e50; }
          .status-cancelled { background: #ecf0f1; color: #2c3e50; }
          @media print {
            body { padding: 0; }
            .invoice-container { box-shadow: none; border: none; }
          }
        </style>
      </head>
      <body>
        <div class="invoice-container">
          <div class="header">
            <div class="header-content">
              <div class="logo-section">
                ${logoBase64 ? `<img src="data:image/png;base64,${logoBase64}" alt="TechPinik Logo" class="logo" />` : ''}
                <div class="company-info">
                  <div class="company-name">TECH PINIK</div>
                  <div class="company-tagline">Your Trusted Electronics Store in Bangladesh</div>
                </div>
              </div>
              <div class="invoice-title">
                <div class="invoice-title-text">INVOICE</div>
                <div class="invoice-number">#${order.order_number || 'N/A'}</div>
              </div>
            </div>
          </div>
          
          <div class="invoice-details">
            <div class="customer-info">
              <div class="section-title">Bill To</div>
              <div class="info-row">
                <div class="info-label">Name:</div>
                <div class="info-value">${order.customer_name || 'N/A'}</div>
              </div>
              <div class="info-row">
                <div class="info-label">Email:</div>
                <div class="info-value">${order.customer_email || 'N/A'}</div>
              </div>
              <div class="info-row">
                <div class="info-label">Phone:</div>
                <div class="info-value">${order.customer_phone || 'N/A'}</div>
              </div>
              <div class="info-row">
                <div class="info-label">Address:</div>
                <div class="info-value">${order.customer_address || order.shipping_address || 'N/A'}</div>
              </div>
            </div>
            
            <div class="invoice-info">
              <div class="section-title">Invoice Details</div>
              <div class="info-row">
                <div class="info-label">Invoice #:</div>
                <div class="info-value">${order.order_number || 'N/A'}</div>
              </div>
              <div class="info-row">
                <div class="info-label">Date:</div>
                <div class="info-value">${formatDate(order.created_at)}</div>
              </div>
              <div class="info-row">
                <div class="info-label">Payment:</div>
                <div class="info-value">${order.payment_method || 'N/A'}</div>
              </div>
              <div class="info-row">
                <div class="info-label">Status:</div>
                <div class="info-value">
                  <span class="status-badge status-${order.status}">${order.status}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div class="table-container">
            <table class="table">
              <thead>
                <tr>
                  <th>Item Description</th>
                  <th>Quantity</th>
                  <th>Unit Price</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                ${
                  (order as any).order_items
                    ?.map(
                      (item: {
                        product_name?: string
                        quantity: number
                        unit_price: number
                        total_price?: number
                      }) => `
                  <tr>
                    <td>${item.product_name || 'Product'}</td>
                    <td>${item.quantity || 0}</td>
                    <td>${safeFormatCurrency(item.unit_price)}</td>
                    <td>${safeFormatCurrency(item.total_price || item.unit_price * item.quantity)}</td>
                  </tr>
                `
                    )
                    .join('') ||
                  '<tr><td colspan="4" style="text-align: center; color: #6b7280;">No items found</td></tr>'
                }
              </tbody>
            </table>
          </div>
          
          <div class="total-section">
            <div class="total-row">
              <div class="total-label">Subtotal:</div>
              <div class="total-value">${safeFormatCurrency(subtotal)}</div>
            </div>
            <div class="total-row">
              <div class="total-label">Shipping:</div>
              <div class="total-value">${safeFormatCurrency(shippingCost)}</div>
            </div>
            <div class="total-row grand-total">
              <div class="total-label">Total Amount:</div>
              <div class="total-value">${safeFormatCurrency(totalAmount)}</div>
            </div>
          </div>
          
          <div class="footer">
            <h3>Thank You for Your Business!</h3>
            <p>For any questions or support, please contact us:</p>
            <p><strong>Email:</strong> support@techpinik.com</p>
            <p><strong>Phone:</strong> ‪+880 1814‑931931‬</p>
            <p><strong>Website:</strong> www.techpinik.com</p>
            <p style="margin-top: 20px; font-size: 12px; color: #9ca3af;">
              This is a computer-generated invoice. No signature required.
            </p>
          </div>
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

  const getPaymentStatusBadge = (status: string) => {
    const statusColors = {
      pending: 'bg-yellow-100 text-yellow-800',
      paid: 'bg-yellow-100 text-yellow-800',
      failed: 'bg-red-100 text-red-800',
      refunded: 'bg-gray-100 text-gray-800',
    }

    return (
      <Badge
        className={statusColors[status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800'}
      >
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
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-600"></div>
                </div>
              ) : orders.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
                  <p className="text-gray-600">
                    Orders will appear here when customers place them.
                  </p>
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
                                Shipping: {formatCurrency(order.delivery_charge)}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>{getStatusBadge(order.status)}</TableCell>
                          <TableCell>{getPaymentStatusBadge(order.payment_status)}</TableCell>
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
                                <DropdownMenuItem onClick={() => generateInvoice(order).catch(console.error)}>
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
                                  disabled={
                                    order.status === 'shipped' || order.status === 'delivered'
                                  }
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
                                  disabled={
                                    order.status === 'cancelled' || order.status === 'delivered'
                                  }
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
