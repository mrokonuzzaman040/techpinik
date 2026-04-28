'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import {
  ArrowLeft,
  Package,
  User,
  MapPin,
  CreditCard,
  Calendar,
  Phone,
  Mail,
  Edit,
  Printer,
  Truck,
} from 'lucide-react'
import AdminPageHeader from '@/components/admin/AdminPageHeader'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { createClient } from '@/lib/supabase'
import { Order, OrderItem, OrderStatus } from '@/types'
import { toast } from 'sonner'

export default function AdminOrderDetailPage() {
  const params = useParams()
  const router = useRouter()
  const orderId = params.id as string

  const [order, setOrder] = useState<Order | null>(null)
  const [orderItems, setOrderItems] = useState<OrderItem[]>([])
  const [loading, setLoading] = useState(true)
  const [transferProvider, setTransferProvider] = useState<'pathao' | 'steadfast'>('pathao')
  const [transferring, setTransferring] = useState(false)

  useEffect(() => {
    if (orderId) {
      fetchOrderDetails()
    }
  }, [orderId])

  const fetchOrderDetails = async () => {
    const supabase = createClient()

    try {
      // Fetch order details
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .single()

      if (orderError) throw orderError

      // Fetch order items (names live on products — order_items has no product_name column)
      const { data: itemsData, error: itemsError } = await supabase
        .from('order_items')
        .select(
          `
          id,
          order_id,
          product_id,
          quantity,
          unit_price,
          products ( name, slug )
        `
        )
        .eq('order_id', orderId)

      if (itemsError) throw itemsError

      const rows = itemsData || []
      const normalized = rows.map((row: any) => ({
        id: row.id,
        order_id: row.order_id,
        product_id: row.product_id,
        quantity: row.quantity,
        unit_price: row.unit_price,
        product_name: row.products?.name ?? 'Product',
        product_sku: row.products?.slug,
        total_price: row.unit_price * row.quantity,
      }))

      setOrder(orderData)
      setOrderItems(normalized)
    } catch (error) {
      console.error('Error fetching order details:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateOrderStatus = async (newStatus: string) => {
    if (!order) return

    const supabase = createClient()

    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', order.id)

      if (error) throw error

      setOrder({ ...order, status: newStatus as OrderStatus })
    } catch (error) {
      console.error('Error updating order status:', error)
      toast.error('Error updating order status. Please try again.')
    }
  }

  const updatePaymentStatus = async (newStatus: string) => {
    if (!order) return

    const supabase = createClient()

    try {
      const { error } = await supabase
        .from('orders')
        .update({ payment_status: newStatus })
        .eq('id', order.id)

      if (error) throw error

      setOrder({ ...order, payment_status: newStatus })
    } catch (error) {
      console.error('Error updating payment status:', error)
      toast.error('Error updating payment status. Please try again.')
    }
  }

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
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
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

  const printOrder = () => {
    window.print()
  }

  const transferToLogistics = async () => {
    if (!order || transferring) return

    try {
      setTransferring(true)
      const response = await fetch(`/api/admin/orders/${order.id}/transfer-logistics`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider: transferProvider }),
      })

      const result = await response.json()
      if (!response.ok || !result?.success) {
        throw new Error(result?.error || 'Failed to transfer order')
      }

      const updatedOrder = result?.data?.order
      if (updatedOrder) {
        setOrder(updatedOrder as Order)
      } else {
        await fetchOrderDetails()
      }

      const transferData = result?.data?.transfer
      const trackingCode = transferData?.tracking_code || transferData?.consignment_id || 'N/A'

      toast.success(
        `Order transferred to ${
          transferProvider === 'pathao' ? 'Pathao' : 'SteadFast'
        } successfully. Tracking: ${trackingCode}`
      )
    } catch (error: any) {
      toast.error(error?.message || 'Failed to transfer order to logistics')
    } finally {
      setTransferring(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 w-64 rounded bg-gray-200" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-[520px] rounded-xl border border-gray-200 bg-white" />
          <div className="h-[520px] rounded-xl border border-gray-200 bg-white" />
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Not Found</h2>
          <p className="text-gray-600 mb-4">
            The order you&rsquo;re looking for doesn&rsquo;t exist.
          </p>
          <Button onClick={() => router.push('/admin/orders')}>Back to Orders</Button>
        </div>
      </div>
    )
  }

  return (
    <div>
      <AdminPageHeader
        title={`Order #${order.order_number}`}
        description={`Placed on ${formatDate(order.created_at)}`}
        leading={
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        }
        actions={
          <Button variant="outline" className="w-full sm:w-auto" onClick={printOrder}>
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Order Items ({orderItems.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>SKU</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Unit Price</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orderItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <p className="font-medium">{item.product_name}</p>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-gray-600">{item.product_sku}</span>
                      </TableCell>
                      <TableCell>
                        <span className="font-medium">{item.quantity}</span>
                      </TableCell>
                      <TableCell>{formatCurrency(item.unit_price)}</TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(item.total_price ?? item.unit_price * item.quantity)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                </Table>
              </div>

              <Separator className="my-4" />

              {/* Order Summary */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>
                    {formatCurrency(
                      (typeof order.total_amount === 'string'
                        ? parseFloat(order.total_amount)
                        : order.total_amount || 0) -
                        (typeof order.delivery_charge === 'string'
                          ? parseFloat(order.delivery_charge)
                          : order.delivery_charge || 0)
                    )}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping:</span>
                  <span>
                    {formatCurrency(
                      typeof order.delivery_charge === 'string'
                        ? parseFloat(order.delivery_charge)
                        : order.delivery_charge || 0
                    )}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span>
                    {formatCurrency(
                      typeof order.total_amount === 'string'
                        ? parseFloat(order.total_amount)
                        : order.total_amount || 0
                    )}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Customer Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Customer Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Contact Details</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-400" />
                      <span>{order.customer_name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <span>{order.customer_email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span>{order.customer_phone}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Shipping Address</h4>
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-gray-400 mt-1" />
                    <div className="text-sm">
                      <p>{order.customer_address}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Order Status */}
          <Card>
            <CardHeader>
              <CardTitle>Order Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Order Status</label>
                <Select value={order.status} onValueChange={updateOrderStatus}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="shipped">Shipped</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Payment Status
                </label>
                <Select value={order.payment_status} onValueChange={updatePaymentStatus}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                    <SelectItem value="refunded">Refunded</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="pt-2">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Current Status:</span>
                  {getStatusBadge(order.status)}
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Payment:</span>
                  {getPaymentStatusBadge(order.payment_status)}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Payment Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Method:</span>
                <span className="font-medium">{order.payment_method}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Status:</span>
                {getPaymentStatusBadge(order.payment_status)}
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Total Amount:</span>
                <span className="font-bold text-lg">{formatCurrency(order.total_amount)}</span>
              </div>
            </CardContent>
          </Card>

          {/* Logistics Transfer */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-5 w-5" />
                Logistics Transfer
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Select Provider
                </label>
                <Select
                  value={transferProvider}
                  onValueChange={(value) => setTransferProvider(value as 'pathao' | 'steadfast')}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pathao">Pathao</SelectItem>
                    <SelectItem value="steadfast">SteadFast</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                className="w-full"
                onClick={transferToLogistics}
                disabled={transferring || order.status === 'cancelled'}
              >
                {transferring ? 'Transferring...' : 'Transfer to Logistics'}
              </Button>

              {(order.logistics_provider ||
                order.logistics_consignment_id ||
                order.logistics_tracking_code) && (
                <div className="rounded-md border-2 border-primary/20 bg-primary/5 p-4 space-y-3">
                  <div className="flex justify-between items-center border-b pb-2">
                    <span className="text-sm font-semibold text-gray-700">Logistics Details</span>
                    <Badge variant="outline" className="capitalize">
                      {order.logistics_provider}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Status:</span>
                      <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 border-none">
                        {order.logistics_status || 'Transferred'}
                      </Badge>
                    </div>
                    {order.logistics_tracking_code && (
                      <div className="flex flex-col gap-1">
                        <span className="text-xs text-gray-500">Tracking Number:</span>
                        <span className="font-mono text-base font-bold text-primary break-all">
                          {order.logistics_tracking_code}
                        </span>
                      </div>
                    )}
                    {order.logistics_consignment_id && (
                      <div className="flex justify-between text-sm pt-1">
                        <span className="text-gray-600">Consignment ID:</span>
                        <span className="font-medium">{order.logistics_consignment_id}</span>
                      </div>
                    )}
                    {order.logistics_transferred_at && (
                      <div className="flex justify-between text-xs text-gray-400 pt-2 border-t">
                        <span>Transferred On:</span>
                        <span>{new Date(order.logistics_transferred_at).toLocaleString()}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Order Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Order Timeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 bg-yellow-600 rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium">Order Placed</p>
                    <p className="text-xs text-gray-600">{formatDate(order.created_at)}</p>
                  </div>
                </div>
                {order.updated_at !== order.created_at && (
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 bg-blue-600 rounded-full"></div>
                    <div>
                      <p className="text-sm font-medium">Last Updated</p>
                      <p className="text-xs text-gray-600">{formatDate(order.updated_at)}</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Notes */}
          {order.notes && (
            <Card>
              <CardHeader>
                <CardTitle>Order Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-700">{order.notes}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
