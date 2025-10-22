import { Shield, Eye, Lock, Database, UserCheck, AlertTriangle } from 'lucide-react'
import MainLayout from '@/components/layout/MainLayout'

export default function PrivacyPage() {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <Shield className="h-16 w-16 text-yellow-600 mx-auto mb-4" />
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Privacy Policy
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Your privacy is important to us. This policy explains how we collect, use, and protect your information.
          </p>
        </div>

        {/* Privacy Content */}
        <div className="max-w-4xl mx-auto">
          <div className="space-y-8">
            {/* Section 1 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <Eye className="h-6 w-6 text-yellow-600 mr-2" />
                1. Information We Collect
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We collect information you provide directly to us, such as when you create an account, make a purchase, or contact us for support.
              </p>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Personal Information</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>Name and contact information</li>
                    <li>Email address and phone number</li>
                    <li>Billing and shipping addresses</li>
                    <li>Payment information (processed securely)</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Usage Information</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>Website usage and browsing patterns</li>
                    <li>Device information and IP address</li>
                    <li>Cookies and similar technologies</li>
                    <li>Purchase history and preferences</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Section 2 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <Database className="h-6 w-6 text-yellow-600 mr-2" />
                2. How We Use Your Information
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We use the information we collect to provide, maintain, and improve our services.
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Process and fulfill your orders</li>
                <li>Provide customer support and respond to inquiries</li>
                <li>Send you important updates about your orders</li>
                <li>Improve our website and services</li>
                <li>Send promotional emails (with your consent)</li>
                <li>Prevent fraud and ensure security</li>
              </ul>
            </section>

            {/* Section 3 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <Lock className="h-6 w-6 text-yellow-600 mr-2" />
                3. Information Security
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
              </p>
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h3 className="font-semibold text-yellow-800 mb-2">Security Measures Include:</h3>
                <ul className="list-disc list-inside text-yellow-700 space-y-1">
                  <li>SSL encryption for data transmission</li>
                  <li>Secure payment processing</li>
                  <li>Regular security audits</li>
                  <li>Access controls and authentication</li>
                  <li>Data backup and recovery procedures</li>
                </ul>
              </div>
            </section>

            {/* Section 4 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <UserCheck className="h-6 w-6 text-yellow-600 mr-2" />
                4. Your Rights and Choices
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                You have certain rights regarding your personal information:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li><strong>Access:</strong> Request a copy of your personal information</li>
                <li><strong>Correction:</strong> Update or correct your information</li>
                <li><strong>Deletion:</strong> Request deletion of your account and data</li>
                <li><strong>Portability:</strong> Export your data in a readable format</li>
                <li><strong>Opt-out:</strong> Unsubscribe from marketing communications</li>
              </ul>
            </section>

            {/* Section 5 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                5. Cookies and Tracking
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We use cookies and similar technologies to enhance your browsing experience and analyze website traffic.
              </p>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Types of Cookies We Use:</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li><strong>Essential Cookies:</strong> Required for website functionality</li>
                    <li><strong>Analytics Cookies:</strong> Help us understand website usage</li>
                    <li><strong>Marketing Cookies:</strong> Used for targeted advertising</li>
                    <li><strong>Preference Cookies:</strong> Remember your settings and preferences</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Section 6 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <AlertTriangle className="h-6 w-6 text-yellow-600 mr-2" />
                6. Third-Party Services
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We may share your information with trusted third-party service providers who assist us in operating our website and conducting our business.
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Payment processors for secure transactions</li>
                <li>Shipping companies for order delivery</li>
                <li>Email service providers for communications</li>
                <li>Analytics services for website improvement</li>
                <li>Customer support tools and platforms</li>
              </ul>
            </section>

            {/* Section 7 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                7. Data Retention
              </h2>
              <p className="text-gray-700 leading-relaxed">
                We retain your personal information for as long as necessary to provide our services and comply with legal obligations. Typically, we retain account information for 3 years after account closure, unless a longer retention period is required by law.
              </p>
            </section>

            {/* Section 8 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                8. Children's Privacy
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Our services are not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe your child has provided us with personal information, please contact us.
              </p>
            </section>

            {/* Section 9 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                9. Changes to This Policy
              </h2>
              <p className="text-gray-700 leading-relaxed">
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date. You are advised to review this Privacy Policy periodically for any changes.
              </p>
            </section>

            {/* Contact Information */}
            <section className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Contact Us
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                If you have any questions about this Privacy Policy or our data practices, please contact us:
              </p>
              <div className="space-y-2">
                <p className="text-gray-700"><strong>Email:</strong> privacy@techpinik.com</p>
                <p className="text-gray-700"><strong>Phone:</strong> +880 1234 567890</p>
                <p className="text-gray-700"><strong>Address:</strong> Dhaka, Bangladesh</p>
                <p className="text-gray-700"><strong>Last Updated:</strong> {new Date().toLocaleDateString()}</p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
