import {
  RotateCcw,
  Clock,
  CheckCircle,
  AlertTriangle,
  Package,
  Truck,
  CreditCard,
} from 'lucide-react'
import MainLayout from '@/components/layout/MainLayout'

export default function ReturnsPage() {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <RotateCcw className="h-16 w-16 text-yellow-600 mx-auto mb-4" />
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Returns & Refunds</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Easy returns and fast refunds. Learn about our return policy and how to process your
            return.
          </p>
        </div>

        {/* Returns Content */}
        <div className="max-w-4xl mx-auto">
          <div className="space-y-8">
            {/* Return Policy Overview */}
            <section className="bg-yellow-50 p-6 rounded-lg">
              <div className="flex items-center mb-4">
                <CheckCircle className="h-6 w-6 text-yellow-600 mr-2" />
                <h2 className="text-2xl font-bold text-gray-900">7-Day Return Policy</h2>
              </div>
              <p className="text-gray-700 leading-relaxed">
                We offer a hassle-free 7-day return policy for most products. If you're not
                satisfied with your purchase, you can return it within 7 days of delivery for a full
                refund.
              </p>
            </section>

            {/* Return Conditions */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <Package className="h-6 w-6 text-yellow-600 mr-2" />
                Return Conditions
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <CheckCircle className="h-5 w-5 text-yellow-600 mr-2" />
                    Eligible for Return
                  </h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Items in original condition</li>
                    <li>• Original packaging included</li>
                    <li>• All accessories and manuals</li>
                    <li>• Unused and unopened items</li>
                    <li>• Within 7 days of delivery</li>
                    <li>• Valid proof of purchase</li>
                  </ul>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
                    Not Eligible for Return
                  </h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Digital products and software</li>
                    <li>• Personalized or custom items</li>
                    <li>• Items damaged by customer</li>
                    <li>• Items without original packaging</li>
                    <li>• Perishable goods</li>
                    <li>• Items purchased more than 7 days ago</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Return Process */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <Clock className="h-6 w-6 text-yellow-600 mr-2" />
                How to Return an Item
              </h2>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center mr-4">
                    <span className="text-yellow-600 font-semibold">1</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Contact Support</h3>
                    <p className="text-gray-700">
                      Email us at returns@techpinik.com or call ‪+880 1814‑931931‬ to initiate your
                      return.
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center mr-4">
                    <span className="text-yellow-600 font-semibold">2</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Get Return Authorization</h3>
                    <p className="text-gray-700">
                      We'll provide you with a Return Merchandise Authorization (RMA) number and
                      return instructions.
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center mr-4">
                    <span className="text-yellow-600 font-semibold">3</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Package Your Item</h3>
                    <p className="text-gray-700">
                      Pack the item securely in its original packaging with all accessories and
                      documentation.
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center mr-4">
                    <span className="text-yellow-600 font-semibold">4</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Ship the Item</h3>
                    <p className="text-gray-700">
                      Send the package to our return address. We recommend using a trackable
                      shipping method.
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center mr-4">
                    <span className="text-yellow-600 font-semibold">5</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Receive Refund</h3>
                    <p className="text-gray-700">
                      Once we receive and inspect your return, we'll process your refund within 5-7
                      business days.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Refund Information */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <CreditCard className="h-6 w-6 text-yellow-600 mr-2" />
                Refund Information
              </h2>
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Refund Timeline</h3>
                    <ul className="list-disc list-inside text-gray-700 space-y-1">
                      <li>Processing time: 5-7 business days after we receive your return</li>
                      <li>Credit card refunds: 3-5 business days to appear on your statement</li>
                      <li>Bank transfer refunds: 5-7 business days</li>
                      <li>Mobile banking refunds: 1-3 business days</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Refund Methods</h3>
                    <ul className="list-disc list-inside text-gray-700 space-y-1">
                      <li>Original payment method (preferred)</li>
                      <li>Bank transfer to your account</li>
                      <li>Mobile banking (bKash, Rocket, Nagad)</li>
                      <li>Store credit (upon request)</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Exchange Policy */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <Truck className="h-6 w-6 text-yellow-600 mr-2" />
                Exchange Policy
              </h2>
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <p className="text-gray-700 leading-relaxed mb-4">
                  We offer exchanges for items of equal or greater value. If you want to exchange an
                  item:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Contact our support team to initiate an exchange</li>
                  <li>Return the original item following our return process</li>
                  <li>Pay the difference if the new item costs more</li>
                  <li>Receive a refund if the new item costs less</li>
                  <li>Exchange requests must be made within 7 days of delivery</li>
                </ul>
              </div>
            </section>

            {/* Return Shipping */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Return Shipping</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Customer Pays Return Shipping
                  </h3>
                  <p className="text-gray-700 mb-3">
                    In most cases, customers are responsible for return shipping costs.
                  </p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>Use a trackable shipping method</li>
                    <li>Keep your shipping receipt</li>
                    <li>Return shipping costs are non-refundable</li>
                  </ul>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Free Return Shipping</h3>
                  <p className="text-gray-700 mb-3">
                    We cover return shipping costs in these cases:
                  </p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>Defective or damaged items</li>
                    <li>Wrong item sent by us</li>
                    <li>Items not as described</li>
                    <li>Quality issues</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Important Notes */}
            <section className="bg-yellow-50 p-6 rounded-lg">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Important Notes</h2>
              <ul className="space-y-2 text-gray-700">
                <li>• All returns must be authorized before shipping</li>
                <li>• Include the RMA number on your return package</li>
                <li>• We recommend insuring valuable items during return shipping</li>
                <li>• Refunds will be processed to the original payment method</li>
                <li>• Store credit never expires and can be used for future purchases</li>
                <li>
                  • Contact us immediately if you don't receive your refund within the expected
                  timeframe
                </li>
              </ul>
            </section>

            {/* Contact Information */}
            <section className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Need Help with Returns?</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                If you have any questions about returns or need assistance, please contact us:
              </p>
              <div className="space-y-2">
                <p className="text-gray-700">
                  <strong>Email:</strong> returns@techpinik.com
                </p>
                <p className="text-gray-700">
                  <strong>Phone:</strong> ‪+880 1814‑931931‬
                </p>
                <p className="text-gray-700">
                  <strong>Live Chat:</strong> Available 24/7 on our website
                </p>
                <p className="text-gray-700">
                  <strong>Return Address:</strong> TechPinik Returns, Dhaka, Bangladesh
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
