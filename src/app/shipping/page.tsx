import { Truck, MapPin, Clock, Package, Shield, CheckCircle } from 'lucide-react'
import MainLayout from '@/components/layout/MainLayout'

export default function ShippingPage() {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <Truck className="h-16 w-16 text-yellow-600 mx-auto mb-4" />
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Shipping Information
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Fast, reliable, and secure delivery across Bangladesh. Learn about our shipping options and policies.
          </p>
        </div>

        {/* Shipping Content */}
        <div className="max-w-4xl mx-auto">
          <div className="space-y-8">
            {/* Free Shipping */}
            <section className="bg-yellow-50 p-6 rounded-lg">
              <div className="flex items-center mb-4">
                <CheckCircle className="h-6 w-6 text-yellow-600 mr-2" />
                <h2 className="text-2xl font-bold text-gray-900">Free Shipping</h2>
              </div>
              <p className="text-gray-700 leading-relaxed">
                Enjoy free delivery on all orders over ৳1,000. No hidden fees, no minimum order requirements beyond the threshold.
              </p>
            </section>

            {/* Delivery Options */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <Package className="h-6 w-6 text-yellow-600 mr-2" />
                Delivery Options
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                    <Clock className="h-5 w-5 text-blue-600 mr-2" />
                    Standard Delivery
                  </h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>• 2-5 business days</li>
                    <li>• Delivery charge: ৳60-৳120</li>
                    <li>• Available nationwide</li>
                    <li>• Tracked delivery</li>
                  </ul>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                    <Truck className="h-5 w-5 text-yellow-600 mr-2" />
                    Express Delivery
                  </h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>• 1-2 business days</li>
                    <li>• Delivery charge: ৳120-৳200</li>
                    <li>• Major cities only</li>
                    <li>• Priority handling</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Delivery Areas */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <MapPin className="h-6 w-6 text-yellow-600 mr-2" />
                Delivery Areas
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Dhaka Division</h3>
                  <ul className="space-y-1 text-gray-700 text-sm">
                    <li>• Dhaka City</li>
                    <li>• Gazipur</li>
                    <li>• Narayanganj</li>
                    <li>• Narsingdi</li>
                    <li>• Tangail</li>
                    <li>• Kishoreganj</li>
                  </ul>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Chittagong Division</h3>
                  <ul className="space-y-1 text-gray-700 text-sm">
                    <li>• Chittagong City</li>
                    <li>• Cox's Bazar</li>
                    <li>• Comilla</li>
                    <li>• Feni</li>
                    <li>• Brahmanbaria</li>
                    <li>• Chandpur</li>
                  </ul>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Other Major Cities</h3>
                  <ul className="space-y-1 text-gray-700 text-sm">
                    <li>• Sylhet</li>
                    <li>• Rajshahi</li>
                    <li>• Khulna</li>
                    <li>• Barisal</li>
                    <li>• Rangpur</li>
                    <li>• Mymensingh</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Delivery Charges */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Delivery Charges by Location
              </h2>
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Standard</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Express</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Dhaka City</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">৳60</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">৳120</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Chittagong City</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">৳80</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">৳150</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Sylhet</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">৳100</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">৳180</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Other Cities</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">৳120</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">৳200</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* Delivery Process */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <Shield className="h-6 w-6 text-yellow-600 mr-2" />
                Delivery Process
              </h2>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center mr-4">
                    <span className="text-yellow-600 font-semibold">1</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Order Processing</h3>
                    <p className="text-gray-700">We process your order within 24 hours of payment confirmation.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center mr-4">
                    <span className="text-yellow-600 font-semibold">2</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Packaging</h3>
                    <p className="text-gray-700">Your items are carefully packaged to ensure safe delivery.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center mr-4">
                    <span className="text-yellow-600 font-semibold">3</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Shipping</h3>
                    <p className="text-gray-700">Your package is handed over to our trusted delivery partners.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center mr-4">
                    <span className="text-yellow-600 font-semibold">4</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Tracking</h3>
                    <p className="text-gray-700">You receive tracking information to monitor your delivery.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center mr-4">
                    <span className="text-yellow-600 font-semibold">5</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Delivery</h3>
                    <p className="text-gray-700">Your package is delivered to your specified address.</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Important Notes */}
            <section className="bg-yellow-50 p-6 rounded-lg">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Important Notes
              </h2>
              <ul className="space-y-2 text-gray-700">
                <li>• Delivery times may vary during holidays and peak seasons</li>
                <li>• Someone must be available to receive the package</li>
                <li>• Valid ID may be required for delivery confirmation</li>
                <li>• We are not responsible for delays caused by weather or natural disasters</li>
                <li>• Contact us immediately if you don't receive your package within the estimated time</li>
              </ul>
            </section>

            {/* Contact Information */}
            <section className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Need Help?
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                If you have any questions about shipping or delivery, please contact our customer service team:
              </p>
              <div className="space-y-2">
                <p className="text-gray-700"><strong>Email:</strong> shipping@techpinik.com</p>
                <p className="text-gray-700"><strong>Phone:</strong> +880 1234 567890</p>
                <p className="text-gray-700"><strong>Live Chat:</strong> Available 24/7 on our website</p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
