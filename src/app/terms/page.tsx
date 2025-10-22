import { FileText, Shield, Users, CreditCard, Truck, RotateCcw } from 'lucide-react'
import MainLayout from '@/components/layout/MainLayout'

export default function TermsPage() {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <FileText className="h-16 w-16 text-yellow-600 mx-auto mb-4" />
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Terms of Service
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Please read these terms and conditions carefully before using our services.
          </p>
        </div>

        {/* Terms Content */}
        <div className="max-w-4xl mx-auto">
          <div className="space-y-8">
            {/* Section 1 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <Shield className="h-6 w-6 text-yellow-600 mr-2" />
                1. Acceptance of Terms
              </h2>
              <p className="text-gray-700 leading-relaxed">
                By accessing and using TechPinik's website and services, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
              </p>
            </section>

            {/* Section 2 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <Users className="h-6 w-6 text-yellow-600 mr-2" />
                2. User Accounts
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                When you create an account with us, you must provide information that is accurate, complete, and current at all times. You are responsible for safeguarding the password and for all activities that occur under your account.
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>You must be at least 18 years old to create an account</li>
                <li>You are responsible for maintaining the confidentiality of your account</li>
                <li>You must notify us immediately of any unauthorized use of your account</li>
              </ul>
            </section>

            {/* Section 3 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <CreditCard className="h-6 w-6 text-yellow-600 mr-2" />
                3. Payment Terms
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                All payments are processed securely. We accept various payment methods including credit cards, mobile banking, and cash on delivery.
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Payment must be made in Bangladeshi Taka (BDT)</li>
                <li>All prices are inclusive of applicable taxes</li>
                <li>We reserve the right to change our prices at any time</li>
                <li>Refunds will be processed within 5-7 business days</li>
              </ul>
            </section>

            {/* Section 4 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <Truck className="h-6 w-6 text-yellow-600 mr-2" />
                4. Shipping and Delivery
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We strive to deliver your orders as quickly as possible. Delivery times may vary depending on your location and product availability.
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Free delivery on orders over ৳1,000</li>
                <li>Standard delivery: 2-5 business days</li>
                <li>Express delivery: 1-2 business days (additional charges apply)</li>
                <li>Delivery charges vary by location</li>
              </ul>
            </section>

            {/* Section 5 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <RotateCcw className="h-6 w-6 text-yellow-600 mr-2" />
                5. Returns and Refunds
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We offer a 7-day return policy for most products. Some items may have different return policies.
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Items must be in original condition with packaging</li>
                <li>Return shipping costs are the responsibility of the customer</li>
                <li>Refunds will be processed within 5-7 business days</li>
                <li>Digital products are non-refundable</li>
              </ul>
            </section>

            {/* Section 6 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                6. Limitation of Liability
              </h2>
              <p className="text-gray-700 leading-relaxed">
                TechPinik shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your use of the service.
              </p>
            </section>

            {/* Section 7 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                7. Changes to Terms
              </h2>
              <p className="text-gray-700 leading-relaxed">
                We reserve the right, at our sole discretion, to modify or replace these Terms of Service at any time. If a revision is material, we will try to provide at least 30 days notice prior to any new terms taking effect.
              </p>
            </section>

            {/* Contact Information */}
            <section className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Contact Information
              </h2>
              <p className="text-gray-700 leading-relaxed">
                If you have any questions about these Terms of Service, please contact us at:
              </p>
              <div className="mt-4 space-y-2">
                <p className="text-gray-700"><strong>Email:</strong> legal@techpinik.com</p>
                <p className="text-gray-700"><strong>Phone:</strong> +880 1234 567890</p>
                <p className="text-gray-700"><strong>Address:</strong> Dhaka, Bangladesh</p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
