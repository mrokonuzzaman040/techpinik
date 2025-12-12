import {
  HelpCircle,
  Search,
  MessageCircle,
  Phone,
  Mail,
  Clock,
  BookOpen,
  Users,
  CreditCard,
  Truck,
  RotateCcw,
} from 'lucide-react'
import MainLayout from '@/components/layout/MainLayout'

export default function HelpPage() {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <HelpCircle className="h-16 w-16 text-yellow-600 mx-auto mb-4" />
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Help Center</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Find answers to common questions and get the support you need.
          </p>
        </div>

        {/* Help Content */}
        <div className="max-w-4xl mx-auto">
          <div className="space-y-8">
            {/* Quick Help Categories */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <BookOpen className="h-6 w-6 text-yellow-600 mr-2" />
                Quick Help Categories
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-center mb-4">
                    <Users className="h-8 w-8 text-blue-600 mr-3" />
                    <h3 className="text-lg font-semibold text-gray-900">Account & Login</h3>
                  </div>
                  <ul className="space-y-2 text-gray-700 text-sm">
                    <li>• How to create an account</li>
                    <li>• Forgot password</li>
                    <li>• Update profile information</li>
                    <li>• Account security</li>
                  </ul>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-center mb-4">
                    <CreditCard className="h-8 w-8 text-yellow-600 mr-3" />
                    <h3 className="text-lg font-semibold text-gray-900">Orders & Payment</h3>
                  </div>
                  <ul className="space-y-2 text-gray-700 text-sm">
                    <li>• How to place an order</li>
                    <li>• Payment methods</li>
                    <li>• Order tracking</li>
                    <li>• Payment issues</li>
                  </ul>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-center mb-4">
                    <Truck className="h-8 w-8 text-purple-600 mr-3" />
                    <h3 className="text-lg font-semibold text-gray-900">Shipping & Delivery</h3>
                  </div>
                  <ul className="space-y-2 text-gray-700 text-sm">
                    <li>• Delivery times</li>
                    <li>• Shipping costs</li>
                    <li>• Delivery areas</li>
                    <li>• Track your order</li>
                  </ul>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-center mb-4">
                    <RotateCcw className="h-8 w-8 text-orange-600 mr-3" />
                    <h3 className="text-lg font-semibold text-gray-900">Returns & Refunds</h3>
                  </div>
                  <ul className="space-y-2 text-gray-700 text-sm">
                    <li>• Return policy</li>
                    <li>• How to return items</li>
                    <li>• Refund process</li>
                    <li>• Exchange policy</li>
                  </ul>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-center mb-4">
                    <Search className="h-8 w-8 text-indigo-600 mr-3" />
                    <h3 className="text-lg font-semibold text-gray-900">Product Information</h3>
                  </div>
                  <ul className="space-y-2 text-gray-700 text-sm">
                    <li>• Product specifications</li>
                    <li>• Warranty information</li>
                    <li>• Product availability</li>
                    <li>• Product reviews</li>
                  </ul>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-center mb-4">
                    <MessageCircle className="h-8 w-8 text-red-600 mr-3" />
                    <h3 className="text-lg font-semibold text-gray-900">Technical Support</h3>
                  </div>
                  <ul className="space-y-2 text-gray-700 text-sm">
                    <li>• Website issues</li>
                    <li>• Mobile app problems</li>
                    <li>• Browser compatibility</li>
                    <li>• Performance issues</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* FAQ Section */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
              <div className="space-y-6">
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    How do I track my order?
                  </h3>
                  <p className="text-gray-700">
                    Once your order is shipped, you'll receive a tracking number via email and SMS.
                    You can track your order status in your account dashboard or by visiting our
                    tracking page.
                  </p>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    What payment methods do you accept?
                  </h3>
                  <p className="text-gray-700">
                    We accept all major credit cards (Visa, Mastercard, American Express), mobile
                    banking (bKash, Rocket, Nagad), bank transfers, and cash on delivery (COD) for
                    eligible orders.
                  </p>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    How long does delivery take?
                  </h3>
                  <p className="text-gray-700">
                    Standard delivery takes 2-5 business days, while express delivery takes 1-2
                    business days. Delivery times may vary based on your location and product
                    availability.
                  </p>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Can I return or exchange items?
                  </h3>
                  <p className="text-gray-700">
                    Yes, we offer a 7-day return policy for most products. Items must be in original
                    condition with packaging. Some items like software and digital products are
                    non-returnable.
                  </p>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Is my personal information secure?
                  </h3>
                  <p className="text-gray-700">
                    Absolutely. We use SSL encryption and secure payment processing to protect your
                    personal and financial information. We never share your data with third parties
                    without your consent.
                  </p>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Do you offer warranty on products?
                  </h3>
                  <p className="text-gray-700">
                    Yes, most products come with manufacturer warranty. Warranty terms vary by
                    product and brand. Check the product page for specific warranty information.
                  </p>
                </div>
              </div>
            </section>

            {/* Contact Support */}
            <section className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <MessageCircle className="h-6 w-6 text-yellow-600 mr-2" />
                Contact Support
              </h2>
              <p className="text-gray-700 leading-relaxed mb-6">
                Can't find what you're looking for? Our support team is here to help you 24/7.
              </p>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="bg-yellow-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <MessageCircle className="h-8 w-8 text-yellow-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Live Chat</h3>
                  <p className="text-gray-700 text-sm mb-3">
                    Get instant help from our support team
                  </p>
                  <button className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors">
                    Start Chat
                  </button>
                </div>
                <div className="text-center">
                  <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <Mail className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Email Support</h3>
                  <p className="text-gray-700 text-sm mb-3">
                    Send us an email and we'll respond within 24 hours
                  </p>
                  <a
                    href="mailto:support@techpinik.com"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors inline-block"
                  >
                    Send Email
                  </a>
                </div>
                <div className="text-center">
                  <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <Phone className="h-8 w-8 text-purple-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Phone Support</h3>
                  <p className="text-gray-700 text-sm mb-3">Call us for immediate assistance</p>
                  <a
                    href="tel:+8801234567890"
                    className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors inline-block"
                  >
                    Call Now
                  </a>
                </div>
              </div>
            </section>

            {/* Support Hours */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <Clock className="h-6 w-6 text-yellow-600 mr-2" />
                Support Hours
              </h2>
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Live Chat & Phone</h3>
                    <p className="text-gray-700">24/7 Available</p>
                    <p className="text-gray-700">Instant response</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Email Support</h3>
                    <p className="text-gray-700">Monday - Friday: 9:00 AM - 6:00 PM</p>
                    <p className="text-gray-700">Saturday: 10:00 AM - 4:00 PM</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Contact Information */}
            <section className="bg-yellow-50 p-6 rounded-lg">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Get in Touch</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">General Inquiries</h3>
                  <p className="text-gray-700">Email: info@techpinik.com</p>
                  <p className="text-gray-700">Phone: +880 1234 567890</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Technical Support</h3>
                  <p className="text-gray-700">Email: support@techpinik.com</p>
                  <p className="text-gray-700">Phone: +880 1234 567891</p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
