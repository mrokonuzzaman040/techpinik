import { Shield, Clock, CheckCircle, AlertTriangle, Wrench, Phone, Mail } from 'lucide-react'
import MainLayout from '@/components/layout/MainLayout'

export default function WarrantyPage() {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <Shield className="h-16 w-16 text-yellow-600 mx-auto mb-4" />
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Warranty Information
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Comprehensive warranty coverage for your peace of mind. Learn about our warranty terms and how to claim warranty service.
          </p>
        </div>

        {/* Warranty Content */}
        <div className="max-w-4xl mx-auto">
          <div className="space-y-8">
            {/* Warranty Overview */}
            <section className="bg-yellow-50 p-6 rounded-lg">
              <div className="flex items-center mb-4">
                <CheckCircle className="h-6 w-6 text-yellow-600 mr-2" />
                <h2 className="text-2xl font-bold text-gray-900">Manufacturer Warranty</h2>
              </div>
              <p className="text-gray-700 leading-relaxed">
                All products sold by TechPinik come with the original manufacturer's warranty. Warranty terms vary by brand and product type, typically ranging from 1 to 3 years.
              </p>
            </section>

            {/* Warranty Types */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <Shield className="h-6 w-6 text-yellow-600 mr-2" />
                Warranty Types
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <CheckCircle className="h-5 w-5 text-yellow-600 mr-2" />
                    Standard Warranty
                  </h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Covers manufacturing defects</li>
                    <li>• Material and workmanship issues</li>
                    <li>• Normal wear and tear excluded</li>
                    <li>• 1-3 years depending on product</li>
                    <li>• Repair or replacement service</li>
                  </ul>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Wrench className="h-5 w-5 text-blue-600 mr-2" />
                    Extended Warranty
                  </h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Available for select products</li>
                    <li>• Additional coverage beyond standard</li>
                    <li>• Accidental damage protection</li>
                    <li>• On-site service options</li>
                    <li>• Priority support</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Warranty Coverage */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <CheckCircle className="h-6 w-6 text-yellow-600 mr-2" />
                What's Covered
              </h2>
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Manufacturing Defects</h3>
                    <ul className="list-disc list-inside text-gray-700 space-y-1">
                      <li>Faulty components or materials</li>
                      <li>Assembly errors</li>
                      <li>Design flaws</li>
                      <li>Premature component failure</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Hardware Issues</h3>
                    <ul className="list-disc list-inside text-gray-700 space-y-1">
                      <li>Power supply problems</li>
                      <li>Display defects</li>
                      <li>Connectivity issues</li>
                      <li>Performance degradation</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* What's Not Covered */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <AlertTriangle className="h-6 w-6 text-red-600 mr-2" />
                What's Not Covered
              </h2>
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Physical Damage</h3>
                    <ul className="list-disc list-inside text-gray-700 space-y-1">
                      <li>Drops, impacts, or falls</li>
                      <li>Water damage or liquid spills</li>
                      <li>Fire, flood, or natural disasters</li>
                      <li>Intentional damage or abuse</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Normal Wear and Tear</h3>
                    <ul className="list-disc list-inside text-gray-700 space-y-1">
                      <li>Battery degradation over time</li>
                      <li>Cosmetic scratches or dents</li>
                      <li>Wear from normal use</li>
                      <li>Software-related issues</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Modifications</h3>
                    <ul className="list-disc list-inside text-gray-700 space-y-1">
                      <li>Unauthorized repairs or modifications</li>
                      <li>Third-party software installation</li>
                      <li>Hardware modifications</li>
                      <li>Voided warranty seals</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Warranty Claim Process */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <Clock className="h-6 w-6 text-yellow-600 mr-2" />
                How to Claim Warranty
              </h2>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center mr-4">
                    <span className="text-yellow-600 font-semibold">1</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Contact Support</h3>
                    <p className="text-gray-700">Email us at warranty@techpinik.com or call +880 1234 567890 with your order details and issue description.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center mr-4">
                    <span className="text-yellow-600 font-semibold">2</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Provide Documentation</h3>
                    <p className="text-gray-700">Submit your purchase receipt, warranty card, and detailed description of the issue with photos if applicable.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center mr-4">
                    <span className="text-yellow-600 font-semibold">3</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Assessment</h3>
                    <p className="text-gray-700">Our technical team will assess the issue and determine if it's covered under warranty.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center mr-4">
                    <span className="text-yellow-600 font-semibold">4</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Service Options</h3>
                    <p className="text-gray-700">We'll provide options for repair, replacement, or refund based on the warranty terms and issue severity.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center mr-4">
                    <span className="text-yellow-600 font-semibold">5</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Resolution</h3>
                    <p className="text-gray-700">We'll process your warranty claim and provide updates throughout the service process.</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Warranty Terms by Category */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Warranty Terms by Product Category
              </h2>
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product Category</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Warranty Period</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service Type</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Laptops & Computers</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">1-3 years</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Repair/Replacement</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Smartphones & Tablets</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">1-2 years</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Repair/Replacement</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Audio & Headphones</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">1-2 years</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Repair/Replacement</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Gaming Accessories</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">1-2 years</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Repair/Replacement</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Cables & Accessories</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">6 months - 1 year</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Replacement</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* Extended Warranty Options */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Extended Warranty Options
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Accidental Damage Protection</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Covers accidental drops and spills</li>
                    <li>• Screen damage protection</li>
                    <li>• Liquid damage coverage</li>
                    <li>• Available for laptops and smartphones</li>
                    <li>• Additional premium required</li>
                  </ul>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">On-Site Service</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Home or office service</li>
                    <li>• Certified technicians</li>
                    <li>• Same-day or next-day service</li>
                    <li>• Available in major cities</li>
                    <li>• Additional service fee</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Important Notes */}
            <section className="bg-yellow-50 p-6 rounded-lg">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Important Notes
              </h2>
              <ul className="space-y-2 text-gray-700">
                <li>• Keep your purchase receipt and warranty card safe</li>
                <li>• Warranty is non-transferable to other users</li>
                <li>• Service may require sending the product to authorized service centers</li>
                <li>• Warranty service is free, but shipping may be required</li>
                <li>• Extended warranty must be purchased at the time of original purchase</li>
                <li>• Contact us immediately if you experience any issues</li>
              </ul>
            </section>

            {/* Contact Information */}
            <section className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Warranty Support
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                For warranty claims, technical support, or questions about warranty coverage:
              </p>
              <div className="space-y-2">
                <p className="text-gray-700"><strong>Email:</strong> warranty@techpinik.com</p>
                <p className="text-gray-700"><strong>Phone:</strong> +880 1234 567890</p>
                <p className="text-gray-700"><strong>Live Chat:</strong> Available 24/7 on our website</p>
                <p className="text-gray-700"><strong>Service Hours:</strong> Monday - Friday, 9:00 AM - 6:00 PM</p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
