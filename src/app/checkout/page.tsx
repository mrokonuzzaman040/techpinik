'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, CreditCard, Truck, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'

import MainLayout from '@/components/layout/MainLayout'
import { useCartStore } from '@/store/cart'
import { createClient } from '@/lib/supabase'
import { District, CheckoutForm } from '@/types'

export default function CheckoutPage() {
  const router = useRouter()
  const { items, getTotalItems, getTotalPrice, clearCart } = useCartStore()

  const [districts, setDistricts] = useState<District[]>([])
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<CheckoutForm>({
    customer_name: '',
    customer_phone: '',
    customer_address: '',
    district_id: '',
    notes: '',
  })

  useEffect(() => {
    // Redirect if cart is empty
    if (items.length === 0) {
      router.push('/cart')
      return
    }

    // Fetch districts
    const fetchDistricts = async () => {
      const supabase = createClient()
      const { data } = await supabase
        .from('districts')
        .select('*')
        .eq('is_active', true)
        .order('name')

      setDistricts(data || [])
    }

    fetchDistricts()
  }, [items.length, router])

  const selectedDistrict = districts.find((d) => d.id === formData.district_id)
  const subtotal = getTotalPrice()
  const deliveryCharge = selectedDistrict?.delivery_charge || 60
  const total = subtotal + deliveryCharge

  const handleInputChange = (field: keyof CheckoutForm, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const supabase = createClient()

      // Create order - use form data directly as it matches database schema
      const orderData = {
        customer_name: formData.customer_name,
        customer_phone: formData.customer_phone,
        customer_address: formData.customer_address,
        district_id: formData.district_id,
        notes: formData.notes || '',
        total_amount: total,
        delivery_charge: deliveryCharge,
        status: 'pending' as const,
      }

      console.log('Submitting order data:', orderData)

      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert(orderData)
        .select()
        .single()

      if (orderError) {
        console.error('Order creation error:', orderError)
        throw orderError
      }

      console.log('Order created successfully:', order)

      // Create order items - map to actual database schema
      const orderItems = items.map((item) => ({
        order_id: order.id,
        product_id: item.product.id,
        quantity: item.quantity,
        unit_price: item.product.sale_price || item.product.price,
      }))

      console.log('Submitting order items:', orderItems)

      const { error: itemsError } = await supabase.from('order_items').insert(orderItems)

      if (itemsError) {
        console.error('Order items creation error:', itemsError)
        throw itemsError
      }

      console.log('Order items created successfully')

      // Clear cart and redirect
      clearCart()
      router.push(`/order-confirmation/${order.id}`)
    } catch (error) {
      console.error('Error placing order:', error)

      // Better error handling
      let errorMessage = 'Failed to place order. Please try again.'
      if (error && typeof error === 'object' && 'message' in error) {
        errorMessage = `Error: ${error.message}`
      } else if (error && typeof error === 'object' && 'details' in error) {
        errorMessage = `Error: ${error.details}`
      }

      alert(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const isFormValid = () => {
    return (
      formData.customer_name &&
      formData.customer_phone &&
      formData.customer_address &&
      formData.district_id
    )
  }

  if (items.length === 0) {
    return null // Will redirect
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Link href="/cart">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Cart
            </Button>
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Checkout</h1>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Customer Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Customer Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="customer_name">Full Name *</Label>
                    <Input
                      id="customer_name"
                      value={formData.customer_name}
                      onChange={(e) => handleInputChange('customer_name', e.target.value)}
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="customer_phone">Phone Number *</Label>
                    <Input
                      id="customer_phone"
                      value={formData.customer_phone}
                      onChange={(e) => handleInputChange('customer_phone', e.target.value)}
                      placeholder="Enter your phone number"
                      required
                    />
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
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="customer_address">Full Address *</Label>
                    <Textarea
                      id="customer_address"
                      value={formData.customer_address}
                      onChange={(e) => handleInputChange('customer_address', e.target.value)}
                      placeholder="Enter your complete address (House/Flat number, Street, Area, City)"
                      rows={3}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="district_id">District *</Label>
                    <Select
                      value={formData.district_id}
                      onValueChange={(value) => handleInputChange('district_id', value)}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select district" />
                      </SelectTrigger>
                      <SelectContent>
                        {districts.map((district) => (
                          <SelectItem key={district.id} value={district.id}>
                            {district.name} (৳{district.delivery_charge} delivery)
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="notes">Order Notes</Label>
                    <Textarea
                      id="notes"
                      value={formData.notes}
                      onChange={(e) => handleInputChange('notes', e.target.value)}
                      placeholder="Any special instructions for delivery"
                      rows={3}
                    />
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
                  {/* Order Items */}
                  <div className="space-y-3">
                    {items.map((item) => (
                      <div key={item.product.id} className="flex gap-3">
                        <div className="relative w-12 h-12 flex-shrink-0 overflow-hidden rounded border">
                          <Image
                            src={item.product.images[0] || '/placeholder-product.jpg'}
                            alt={item.product.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium line-clamp-2">{item.product.name}</p>
                          <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                        </div>
                        <div className="text-sm font-medium">
                          ৳
                          {(
                            (item.product.sale_price || item.product.price) * item.quantity
                          ).toLocaleString()}
                        </div>
                      </div>
                    ))}
                  </div>

                  <Separator />

                  {/* Pricing */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal ({getTotalItems()} items)</span>
                      <span>৳{subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Delivery Charge</span>
                      <span>
                        {selectedDistrict ? (
                          `৳${deliveryCharge}`
                        ) : (
                          <span className="text-gray-400">Select district</span>
                        )}
                      </span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total</span>
                      <span className="text-yellow-600">৳{total.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Place Order Button */}
                  <Button
                    type="submit"
                    className="w-full"
                    size="lg"
                    disabled={loading || !isFormValid()}
                  >
                    {loading ? 'Placing Order...' : 'Place Order'}
                  </Button>

                  <p className="text-xs text-gray-500 text-center">
                    By placing your order, you agree to our Terms & Conditions
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </MainLayout>
  )
}
