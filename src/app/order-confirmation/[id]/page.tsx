'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle, Package, Truck, CreditCard, MapPin, Phone, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import MainLayout from '@/components/layout/MainLayout'
import { createClient } from '@/lib/supabase'
import { Order, OrderItem } from '@/types'

export default function OrderConfirmationPage() {
  const params = useParams()
  const orderId = params.id as string

  const [order, setOrder] = useState<Order | null>(null)
  const [orderItems, setOrderItems] = useState<OrderItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) return

      const supabase = createClient()

      try {
        // Fetch order
        const { data: orderData } = await supabase
          .from('orders')
          .select('*')
          .eq('id', orderId)
          .single()

        // Fetch order items
        const { data: itemsData } = await supabase
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

        setOrder(orderData)
        const rows = itemsData || []
        setOrderItems(
          rows.map((row: any) => ({
            id: row.id,
            order_id: row.order_id,
            product_id: row.product_id,
            quantity: row.quantity,
            unit_price: row.unit_price,
            product_name: row.products?.name ?? 'Product',
            product_sku: row.products?.slug,
            total_price: row.unit_price * row.quantity,
          }))
        )
      } catch (error) {
        console.error('Error fetching order:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchOrder()
  }, [orderId])

  const OrderConfirmationSkeleton = () => (
    <MainLayout>
      <div className="container mx-auto px-4 py-6 animate-pulse">
        <div className="mb-8 h-44 rounded-xl bg-gray-200" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="h-44 rounded-xl border border-gray-200 bg-white" />
            ))}
          </div>
          <div className="h-80 rounded-xl border border-gray-200 bg-white" />
        </div>
      </div>
    </MainLayout>
  )

  if (loading) {
    return <OrderConfirmationSkeleton />
  }

  if (!order) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Order Not Found</h1>
          <p className="text-gray-600 mb-6">The order you're looking for doesn't exist.</p>
          <Link href="/">
            <Button>Go Home</Button>
          </Link>
        </div>
      </MainLayout>
    )
  }

  const safeOrderStatus = (order.order_status ?? order.status ?? 'pending') as string
  const safePaymentStatus = (order.payment_status || 'pending') as string
  const safePaymentMethod = order.payment_method || 'cash_on_delivery'

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'confirmed':
        return 'bg-blue-100 text-blue-800'
      case 'shipped':
        return 'bg-purple-100 text-purple-800'
      case 'delivered':
        return 'bg-yellow-100 text-yellow-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'paid':
        return 'bg-yellow-100 text-yellow-800'
      case 'failed':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-6">
        {/* Order confirmation message */}
        <div className="rounded-xl border border-green-200 bg-green-50 dark:bg-green-950/30 dark:border-green-800 p-6 md:p-8 text-center mb-8">
          <CheckCircle className="h-16 w-16 text-green-600 dark:text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Order placed successfully
          </h1>
          <p className="text-green-800 dark:text-green-200 font-medium mb-1">
            Thank you for your order.
          </p>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            We&apos;ve received your order and will send you a confirmation email shortly. You can track your order using the link below.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Order Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Order Number</p>
                    <p className="font-medium">{order.order_number}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Order Date</p>
                    <p className="font-medium">
                      {new Date(order.created_at).toLocaleDateString('en-GB')}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Order Status</p>
                    <Badge className={getStatusColor(safeOrderStatus)}>
                      {safeOrderStatus.charAt(0).toUpperCase() + safeOrderStatus.slice(1)}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Payment Status</p>
                    <Badge className={getPaymentStatusColor(safePaymentStatus)}>
                      {safePaymentStatus.charAt(0).toUpperCase() + safePaymentStatus.slice(1)}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Customer Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Customer Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <span>{order.customer_email || 'Not provided'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <span>{order.customer_phone}</span>
                </div>
              </CardContent>
            </Card>

            {/* Shipping Address */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="h-5 w-5" />
                  Shipping Address
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-gray-500 mt-1" />
                  <div>
                    <p className="font-medium">{order.customer_name}</p>
                    <p>{order.customer_address}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Order Items */}
            <Card>
              <CardHeader>
                <CardTitle>Order Items</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {orderItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between items-center py-3 border-b last:border-b-0"
                    >
                      <div className="flex-1">
                        <p className="font-medium">{item.product_name}</p>
                        <p className="text-sm text-gray-600">
                          Quantity: {item.quantity} × ৳{item.unit_price.toLocaleString()}
                        </p>
                      </div>
                      <div className="font-medium">
                        ৳{(item.total_price ?? item.unit_price * item.quantity).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>
                      ৳
                      {(
                        (typeof order.total_amount === 'string'
                          ? parseFloat(order.total_amount)
                          : order.total_amount || 0) -
                        (typeof order.delivery_charge === 'string'
                          ? parseFloat(order.delivery_charge)
                          : order.delivery_charge || 0)
                      ).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Shipping</span>
                    <span>
                      ৳
                      {(typeof order.delivery_charge === 'string'
                        ? parseFloat(order.delivery_charge)
                        : order.delivery_charge || 0
                      ).toLocaleString()}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span className="text-yellow-600">
                      ৳
                      {(typeof order.total_amount === 'string'
                        ? parseFloat(order.total_amount)
                        : order.total_amount || 0
                      ).toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <p className="text-sm text-gray-600 mb-2">Payment Method</p>
                  <p className="font-medium">
                    {safePaymentMethod === 'cash_on_delivery'
                      ? 'Cash on Delivery'
                      : safePaymentMethod}
                  </p>
                </div>

                {order.notes && (
                  <div className="pt-4 border-t">
                    <p className="text-sm text-gray-600 mb-2">Order Notes</p>
                    <p className="text-sm">{order.notes}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <Link href="/products">
            <Button variant="outline" size="lg">
              Continue Shopping
            </Button>
          </Link>
          <Button size="lg" onClick={() => window.print()}>
            Print Order
          </Button>
        </div>

        {/* Next Steps */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>What happens next?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="bg-yellow-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                  <CheckCircle className="h-6 w-6 text-yellow-600" />
                </div>
                <h3 className="font-medium mb-2">Order Confirmed</h3>
                <p className="text-sm text-gray-600">
                  We've received your order and will process it shortly.
                </p>
              </div>
              <div className="text-center">
                <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                  <Package className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-medium mb-2">Order Prepared</h3>
                <p className="text-sm text-gray-600">
                  Your items will be carefully packed and prepared for shipping.
                </p>
              </div>
              <div className="text-center">
                <div className="bg-purple-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                  <Truck className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="font-medium mb-2">Order Delivered</h3>
                <p className="text-sm text-gray-600">
                  Your order will be delivered to your specified address.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}
