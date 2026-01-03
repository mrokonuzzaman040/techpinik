import { MapPin, Phone, Mail, Clock, Users, Award, Truck } from 'lucide-react'
import MainLayout from '@/components/layout/MainLayout'

export default function AboutPage() {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">About TechPinik</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Your trusted electronics store in Bangladesh, bringing you the latest technology with
            reliable service and competitive prices since our establishment.
          </p>
        </div>

        {/* Company Story */}
        <div className="grid md:grid-cols-2 gap-12 mb-16">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Story</h2>
            <p className="text-gray-600 mb-4">
              TechPinik was founded with a simple mission: to make quality electronics accessible to
              everyone in Bangladesh. We started as a small electronics shop and have grown into a
              trusted online platform serving customers across the country.
            </p>
            <p className="text-gray-600 mb-4">
              Our commitment to customer satisfaction, authentic products, and competitive pricing
              has made us a preferred choice for tech enthusiasts and everyday consumers alike.
            </p>
            <p className="text-gray-600">
              Today, we continue to expand our product range and improve our services to meet the
              evolving needs of our customers in the digital age.
            </p>
          </div>
          <div className="bg-yellow-50 p-8 rounded-lg">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Why Choose TechPinik?</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Award className="h-6 w-6 text-yellow-600 mt-1" />
                <div>
                  <h4 className="font-medium text-gray-900">Authentic Products</h4>
                  <p className="text-sm text-gray-600">
                    100% genuine products with official warranty
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Truck className="h-6 w-6 text-yellow-600 mt-1" />
                <div>
                  <h4 className="font-medium text-gray-900">Fast Delivery</h4>
                  <p className="text-sm text-gray-600">Quick delivery across Bangladesh</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Users className="h-6 w-6 text-yellow-600 mt-1" />
                <div>
                  <h4 className="font-medium text-gray-900">Expert Support</h4>
                  <p className="text-sm text-gray-600">Knowledgeable customer service team</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-gray-50 rounded-lg p-8 mb-16">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">
            TechPinik by Numbers
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-yellow-600 mb-2">10K+</div>
              <div className="text-gray-600">Happy Customers</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-yellow-600 mb-2">500+</div>
              <div className="text-gray-600">Products</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-yellow-600 mb-2">64</div>
              <div className="text-gray-600">Districts Covered</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-yellow-600 mb-2">5+</div>
              <div className="text-gray-600">Years Experience</div>
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="bg-white border rounded-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Get in Touch</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-yellow-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-8 w-8 text-yellow-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Visit Our Store</h3>
              <p className="text-gray-600 text-sm">
                123 Electronics Street
                <br />
                Dhanmondi, Dhaka 1205
                <br />
                Bangladesh
              </p>
            </div>
            <div className="text-center">
              <div className="bg-yellow-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="h-8 w-8 text-yellow-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Call Us</h3>
              <p className="text-gray-600 text-sm">
                ‪+880 1814‑931931‬
                <br />
                +880 1234-567891
                <br />
                (9 AM - 9 PM, 7 days a week)
              </p>
            </div>
            <div className="text-center">
              <div className="bg-yellow-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="h-8 w-8 text-yellow-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Email Us</h3>
              <p className="text-gray-600 text-sm">
                info@techpinik.com
                <br />
                support@techpinik.com
                <br />
                sales@techpinik.com
              </p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
