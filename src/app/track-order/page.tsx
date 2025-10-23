'use client'

import { useState } from 'react'
import { Search, Package, Truck, CheckCircle, Clock, MapPin, Phone, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import MainLayout from '@/components/layout/MainLayout'

interface TrackingResult {
  orderNumber: string;
  status: string;
  estimatedDelivery: string;
  trackingNumber: string;
  currentLocation: string;
  updates: Array<{
    date: string;
    time: string;
    status: string;
    description: string;
    location: string;
  }>;
}

export default function TrackOrderPage() {
  const [orderNumber, setOrderNumber] = useState('')
  const [email, setEmail] = useState('')
  const [trackingResult, setTrackingResult] = useState<TrackingResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleTrackOrder = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!orderNumber.trim() || !email.trim()) return

    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      setTrackingResult({
        orderNumber: orderNumber,
        status: 'shipped',
        estimatedDelivery: '2024-01-15',
        trackingNumber: 'TP123456789',
        currentLocation: 'Dhaka Distribution Center',
        updates: [
          {
            date: '2024-01-10',
            time: '10:30 AM',
            status: 'Order Placed',
            description: 'Your order has been confirmed and payment received.',
            location: 'TechPinik Warehouse'
          },
          {
            date: '2024-01-11',
            time: '2:15 PM',
            status: 'Processing',
            description: 'Your order is being prepared for shipment.',
            location: 'TechPinik Warehouse'
          },
          {
            date: '2024-01-12',
            time: '9:45 AM',
            status: 'Shipped',
            description: 'Your order has been shipped and is on its way.',
            location: 'Dhaka Distribution Center'
          },
          {
            date: '2024-01-13',
            time: '3:20 PM',
            status: 'In Transit',
            description: 'Your order is in transit to your location.',
            location: 'En route to delivery address'
          }
        ]
      })
      setIsLoading(false)
    }, 1500)
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'order placed': return 'bg-blue-100 text-blue-800'
      case 'processing': return 'bg-yellow-100 text-yellow-800'
      case 'shipped': return 'bg-purple-100 text-purple-800'
      case 'in transit': return 'bg-indigo-100 text-indigo-800'
      case 'out for delivery': return 'bg-orange-100 text-orange-800'
      case 'delivered': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'order placed': return <Package className="h-4 w-4" />
      case 'processing': return <Clock className="h-4 w-4" />
      case 'shipped': return <Truck className="h-4 w-4" />
      case 'in transit': return <Truck className="h-4 w-4" />
      case 'out for delivery': return <Truck className="h-4 w-4" />
      case 'delivered': return <CheckCircle className="h-4 w-4" />
      default: return <Clock className="h-4 w-4" />
    }
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <Search className="h-16 w-16 text-yellow-600 mx-auto mb-4" />
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Track Your Order
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Enter your order number and email to track your package in real-time.
          </p>
        </div>

        {/* Track Order Form */}
        <div className="max-w-2xl mx-auto mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-center">Track Your Package</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleTrackOrder} className="space-y-4">
                <div>
                  <label htmlFor="orderNumber" className="block text-sm font-medium text-gray-700 mb-2">
                    Order Number
                  </label>
                  <Input
                    id="orderNumber"
                    type="text"
                    placeholder="Enter your order number"
                    value={orderNumber}
                    onChange={(e) => setOrderNumber(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Tracking...
                    </>
                  ) : (
                    <>
                      <Search className="h-4 w-4 mr-2" />
                      Track Order
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Tracking Results */}
        {trackingResult && (
          <div className="max-w-4xl mx-auto">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Order #{trackingResult.orderNumber}</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(trackingResult.status)}`}>
                    {trackingResult.status}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Tracking Number</h3>
                    <p className="text-gray-700">{trackingResult.trackingNumber}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Current Location</h3>
                    <p className="text-gray-700">{trackingResult.currentLocation}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Estimated Delivery</h3>
                    <p className="text-gray-700">{trackingResult.estimatedDelivery}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tracking Timeline */}
            <Card>
              <CardHeader>
                <CardTitle>Tracking Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {trackingResult.updates.map((update, index) => (
                    <div key={index} className="flex items-start">
                      <div className="flex-shrink-0 w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center mr-4">
                        {getStatusIcon(update.status)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold text-gray-900">{update.status}</h3>
                          <div className="text-sm text-gray-500">
                            {update.date} at {update.time}
                          </div>
                        </div>
                        <p className="text-gray-700 mb-2">{update.description}</p>
                        <div className="flex items-center text-sm text-gray-500">
                          <MapPin className="h-4 w-4 mr-1" />
                          {update.location}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Help Section */}
        <div className="max-w-4xl mx-auto mt-12">
          <Card>
            <CardHeader>
              <CardTitle>Need Help?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Can't find your order?</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Check your email for order confirmation</li>
                    <li>• Verify your order number is correct</li>
                    <li>• Ensure you're using the same email address</li>
                    <li>• Contact us if you still can't find it</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Contact Support</h3>
                  <div className="space-y-2">
                    <p className="text-gray-700 flex items-center">
                      <Mail className="h-4 w-4 mr-2" />
                      support@techpinik.com
                    </p>
                    <p className="text-gray-700 flex items-center">
                      <Phone className="h-4 w-4 mr-2" />
                      +880 1234 567890
                    </p>
                    <p className="text-gray-700">Live chat available 24/7</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  )
}
