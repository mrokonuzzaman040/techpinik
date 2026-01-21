import Link from 'next/link'
import {
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Phone,
  Mail,
  MapPin,
  Clock,
  CreditCard,
  Truck,
  Shield,
  RotateCcw,
} from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      {/* Features Section */}
      <div className="border-b border-gray-800">
        <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-8">
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left space-y-2 sm:space-y-0 sm:space-x-3">
              <div className="bg-yellow-600 p-2.5 sm:p-3 rounded-full shrink-0">
                <Truck className="h-5 w-5 sm:h-6 sm:w-6" />
              </div>
              <div>
                <h3 className="font-semibold text-sm sm:text-base">Free Delivery</h3>
                <p className="text-xs sm:text-sm text-gray-400">Free shipping on orders over ৳500</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left space-y-2 sm:space-y-0 sm:space-x-3">
              <div className="bg-yellow-600 p-2.5 sm:p-3 rounded-full shrink-0">
                <CreditCard className="h-5 w-5 sm:h-6 sm:w-6" />
              </div>
              <div>
                <h3 className="font-semibold text-sm sm:text-base">Secure Payment</h3>
                <p className="text-xs sm:text-sm text-gray-400">100% secure payment</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left space-y-2 sm:space-y-0 sm:space-x-3">
              <div className="bg-yellow-600 p-2.5 sm:p-3 rounded-full shrink-0">
                <RotateCcw className="h-5 w-5 sm:h-6 sm:w-6" />
              </div>
              <div>
                <h3 className="font-semibold text-sm sm:text-base">Easy Returns</h3>
                <p className="text-xs sm:text-sm text-gray-400">7 days return policy</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left space-y-2 sm:space-y-0 sm:space-x-3">
              <div className="bg-yellow-600 p-2.5 sm:p-3 rounded-full shrink-0">
                <Shield className="h-5 w-5 sm:h-6 sm:w-6" />
              </div>
              <div>
                <h3 className="font-semibold text-sm sm:text-base">Quality Guarantee</h3>
                <p className="text-xs sm:text-sm text-gray-400">Original products only</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container mx-auto px-3 sm:px-4 py-8 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {/* Company Info */}
          <div className="space-y-4 sm:col-span-2 lg:col-span-1">
            <div className="flex items-center space-x-2">
              <div className="bg-yellow-600 text-white px-3 py-2 rounded-lg font-bold text-lg sm:text-xl">
                TechPinik
              </div>
            </div>
            <p className="text-gray-400 text-sm sm:text-base leading-relaxed max-w-md">
              Your trusted partner for quality electronics and gadgets in Bangladesh. We provide
              authentic products with excellent customer service.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-yellow-400 transition-colors" aria-label="Facebook">
                <Facebook className="h-5 w-5 sm:h-6 sm:w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-yellow-400 transition-colors" aria-label="Instagram">
                <Instagram className="h-5 w-5 sm:h-6 sm:w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-yellow-400 transition-colors" aria-label="Twitter">
                <Twitter className="h-5 w-5 sm:h-6 sm:w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-yellow-400 transition-colors" aria-label="YouTube">
                <Youtube className="h-5 w-5 sm:h-6 sm:w-6" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3 sm:space-y-4">
            <h3 className="text-base sm:text-lg font-semibold">Quick Links</h3>
            <ul className="space-y-2 sm:space-y-2.5">
              <li>
                <Link
                  href="/about"
                  className="text-gray-400 hover:text-white transition-colors text-sm sm:text-base inline-block"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-gray-400 hover:text-white transition-colors text-sm sm:text-base inline-block"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  href="/products"
                  className="text-gray-400 hover:text-white transition-colors text-sm sm:text-base inline-block"
                >
                  All Products
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-gray-400 hover:text-white transition-colors text-sm sm:text-base inline-block"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-gray-400 hover:text-white transition-colors text-sm sm:text-base inline-block"
                >
                  Terms &amp; Conditions
                </Link>
              </li>
              <li>
                <Link
                  href="/shipping"
                  className="text-gray-400 hover:text-white transition-colors text-sm sm:text-base inline-block"
                >
                  Shipping Info
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className="space-y-3 sm:space-y-4">
            <h3 className="text-base sm:text-lg font-semibold">Customer Service</h3>
            <ul className="space-y-2 sm:space-y-2.5">
              <li>
                <Link
                  href="/help"
                  className="text-gray-400 hover:text-white transition-colors text-sm sm:text-base inline-block"
                >
                  Help Center
                </Link>
              </li>
              <li>
                <Link
                  href="/returns"
                  className="text-gray-400 hover:text-white transition-colors text-sm sm:text-base inline-block"
                >
                  Returns &amp; Exchanges
                </Link>
              </li>
              <li>
                <Link
                  href="/warranty"
                  className="text-gray-400 hover:text-white transition-colors text-sm sm:text-base inline-block"
                >
                  Warranty Info
                </Link>
              </li>
              <li>
                <Link
                  href="/track-order"
                  className="text-gray-400 hover:text-white transition-colors text-sm sm:text-base inline-block"
                >
                  Track Your Order
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="text-gray-400 hover:text-white transition-colors text-sm sm:text-base inline-block"
                >
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-3 sm:space-y-4 sm:col-span-2 lg:col-span-1">
            <h3 className="text-base sm:text-lg font-semibold">Contact Info</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm sm:text-base text-gray-400">
                    123 Tech Street, Dhanmondi
                    <br />
                    Dhaka 1205, Bangladesh
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-yellow-400 flex-shrink-0" />
                <div>
                  <p className="text-sm sm:text-base text-gray-400">‪+880 1814‑931931‬</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-yellow-400 flex-shrink-0" />
                <p className="text-sm sm:text-base text-gray-400">info@techpinik.com</p>
              </div>

              <div className="flex items-start space-x-3">
                <Clock className="h-5 w-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm sm:text-base text-gray-400">Mon - Sat: 9:00 AM - 8:00 PM</p>
                  <p className="text-sm sm:text-base text-gray-400">Sunday: 10:00 AM - 6:00 PM</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-6">
            <div className="text-xs sm:text-sm text-gray-400 text-center sm:text-left">
              © 2024 TechPinik. All rights reserved.
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-6">
              <span className="text-xs sm:text-sm text-gray-400">We Accept:</span>
              <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
                <div className="bg-white rounded px-2 sm:px-3 py-1 sm:py-1.5">
                  <span className="text-xs sm:text-sm font-bold text-gray-800">VISA</span>
                </div>
                <div className="bg-white rounded px-2 sm:px-3 py-1 sm:py-1.5">
                  <span className="text-xs sm:text-sm font-bold text-gray-800">bKash</span>
                </div>
                <div className="bg-white rounded px-2 sm:px-3 py-1 sm:py-1.5">
                  <span className="text-xs sm:text-sm font-bold text-gray-800">Nagad</span>
                </div>
                <div className="bg-white rounded px-2 sm:px-3 py-1 sm:py-1.5">
                  <span className="text-xs sm:text-sm font-bold text-gray-800">Rocket</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
