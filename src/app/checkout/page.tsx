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
import { toast } from 'sonner'

export default function CheckoutPage() {
  const router = useRouter()
  const { items, getTotalItems, getTotalPrice, clearCart } = useCartStore()

  const [districts, setDistricts] = useState<District[]>([])
  const [loading, setLoading] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [validationErrors, setValidationErrors] = useState<Partial<Record<keyof CheckoutForm, string>>>({})
  const [orderSuccess, setOrderSuccess] = useState(false)
  const [placedOrderId, setPlacedOrderId] = useState<string | null>(null)
  const [formData, setFormData] = useState<CheckoutForm>({
    customer_name: '',
    customer_phone: '',
    customer_address: '',
    district_id: '',
    notes: '',
  })

  useEffect(() => {
    // Redirect to cart only when checkout hasn't completed.
    if (items.length === 0 && !loading && !placedOrderId) {
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
  }, [items.length, loading, placedOrderId, router])

  const selectedDistrict = districts.find((d) => d.id === formData.district_id)
  const subtotal = getTotalPrice()
  const deliveryCharge = selectedDistrict?.delivery_charge || 0
  const total = subtotal + deliveryCharge

  const handleInputChange = (field: keyof CheckoutForm, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear validation error for this field when user types
    if (validationErrors[field]) {
      setValidationErrors((prev) => {
        const next = { ...prev }
        delete next[field]
        return next
      })
    }
    setSubmitError(null)
  }

  const validateForm = (): boolean => {
    const errors: Partial<Record<keyof CheckoutForm, string>> = {}
    const trimmedName = formData.customer_name.trim()
    const trimmedPhone = formData.customer_phone.trim().replace(/\s/g, '')
    const trimmedAddress = formData.customer_address.trim()

    if (!trimmedName) {
      errors.customer_name = 'Please enter your full name.'
    }
    if (!trimmedPhone) {
      errors.customer_phone = 'Please enter your phone number.'
    } else if (!/^[\d+-\s]{10,}$/.test(trimmedPhone)) {
      errors.customer_phone = 'Please enter a valid phone number (at least 10 digits).'
    }
    if (!trimmedAddress) {
      errors.customer_address = 'Please enter your complete address.'
    }
    if (!formData.district_id) {
      errors.district_id = 'Please select a district for delivery.'
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitError(null)
    setValidationErrors({})

    if (!validateForm()) {
      toast.error('Please fix the highlighted fields before placing order.')
      return
    }

    setLoading(true)

    try {
      const payload = {
        customer_name: formData.customer_name.trim(),
        customer_phone: formData.customer_phone.trim(),
        customer_address: formData.customer_address.trim(),
        district_id: formData.district_id,
        notes: formData.notes?.trim() || null,
        items: items.map((item) => ({
          product_id: item.product.id,
          quantity: item.quantity,
        })),
      }

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const result = await response.json().catch(() => ({}))
      if (!response.ok || !result?.success) {
        throw new Error(result?.error || result?.message || 'Failed to place order. Please try again.')
      }

      const createdOrder = result?.data
      if (!createdOrder?.id) {
        throw new Error('Order was created but no order ID was returned.')
      }

      setPlacedOrderId(createdOrder.id)
      toast.success('Order placed successfully!')
      setOrderSuccess(true)
      // Navigate first to avoid checkout empty-cart flicker, then clear cart.
      router.replace(`/order-confirmation/${createdOrder.id}`)
      clearCart()
    } catch (error) {
      console.error('Error placing order:', error)

      let errorMessage = 'Failed to place order. Please try again.'
      if (error && typeof error === 'object' && 'message' in error) {
        errorMessage = String((error as { message: string }).message)
      } else if (error && typeof error === 'object' && 'details' in error) {
        errorMessage = String((error as { details: string }).details)
      }
      setSubmitError(errorMessage)
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

  if (orderSuccess) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-md mx-auto text-center">
            <div className="rounded-lg border border-green-200 bg-green-50 p-6">
              <h2 className="text-xl font-semibold text-green-800 mb-2">Order placed successfully!</h2>
              <p className="text-green-700 mb-4">
                Thank you for your order. Redirecting you to your order confirmation…
              </p>
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-green-600 border-t-transparent mx-auto" />
            </div>
          </div>
        </div>
      </MainLayout>
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

        {submitError && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-red-800 text-sm">
            {submitError}
          </div>
        )}

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
                      className={validationErrors.customer_name ? 'border-red-500' : ''}
                    />
                    {validationErrors.customer_name && (
                      <p className="text-sm text-red-600 mt-1">{validationErrors.customer_name}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="customer_phone">Phone Number *</Label>
                    <Input
                      id="customer_phone"
                      value={formData.customer_phone}
                      onChange={(e) => handleInputChange('customer_phone', e.target.value)}
                      placeholder="Enter your phone number"
                      required
                      className={validationErrors.customer_phone ? 'border-red-500' : ''}
                    />
                    {validationErrors.customer_phone && (
                      <p className="text-sm text-red-600 mt-1">{validationErrors.customer_phone}</p>
                    )}
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
                      className={validationErrors.customer_address ? 'border-red-500' : ''}
                    />
                    {validationErrors.customer_address && (
                      <p className="text-sm text-red-600 mt-1">{validationErrors.customer_address}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="district_id">District *</Label>
                    <Select
                      value={formData.district_id}
                      onValueChange={(value) => handleInputChange('district_id', value)}
                      required
                    >
                      <SelectTrigger className={validationErrors.district_id ? 'border-red-500' : ''}>
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
                    {validationErrors.district_id && (
                      <p className="text-sm text-red-600 mt-1">{validationErrors.district_id}</p>
                    )}
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
                            src={
                              (item.product.images &&
                                item.product.images.length > 0 &&
                                item.product.images[0]) ||
                              item.product.image_url ||
                              'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=product%20placeholder%20image&image_size=square'
                            }
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
                    disabled={loading}
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
