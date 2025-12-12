'use client'

import { useState } from 'react'
import {
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Search,
  MessageCircle,
  Phone,
  Mail,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import MainLayout from '@/components/layout/MainLayout'

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [openItems, setOpenItems] = useState<number[]>([])

  const toggleItem = (index: number) => {
    setOpenItems((prev) =>
      prev.includes(index) ? prev.filter((item) => item !== index) : [...prev, index]
    )
  }

  const faqData = [
    {
      category: 'General',
      questions: [
        {
          question: 'What is TechPinik?',
          answer:
            "TechPinik is Bangladesh's leading electronics and technology store, offering a wide range of products including laptops, smartphones, gaming accessories, and more. We provide quality products with reliable service and competitive prices.",
        },
        {
          question: 'How do I create an account?',
          answer:
            'Creating an account is easy! Click on the "Sign Up" button in the top right corner, fill in your details including name, email, and password, then verify your email address. You\'ll be ready to shop in minutes.',
        },
        {
          question: 'Is my personal information secure?',
          answer:
            'Yes, absolutely. We use SSL encryption and secure payment processing to protect your personal and financial information. We never share your data with third parties without your consent.',
        },
      ],
    },
    {
      category: 'Orders & Payment',
      questions: [
        {
          question: 'How do I place an order?',
          answer:
            "Simply browse our products, add items to your cart, proceed to checkout, enter your shipping details, choose a payment method, and confirm your order. You'll receive an order confirmation via email.",
        },
        {
          question: 'What payment methods do you accept?',
          answer:
            'We accept all major credit cards (Visa, Mastercard, American Express), mobile banking (bKash, Rocket, Nagad), bank transfers, and cash on delivery (COD) for eligible orders.',
        },
        {
          question: 'Can I modify or cancel my order?',
          answer:
            "You can modify or cancel your order within 1 hour of placing it, as long as it hasn't been processed for shipping. Contact our customer service team immediately for assistance.",
        },
        {
          question: 'How do I track my order?',
          answer:
            "Once your order is shipped, you'll receive a tracking number via email and SMS. You can track your order status in your account dashboard or by visiting our tracking page.",
        },
      ],
    },
    {
      category: 'Shipping & Delivery',
      questions: [
        {
          question: 'How long does delivery take?',
          answer:
            'Standard delivery takes 2-5 business days, while express delivery takes 1-2 business days. Delivery times may vary based on your location and product availability.',
        },
        {
          question: 'Do you offer free shipping?',
          answer:
            'Yes! We offer free delivery on all orders over ৳1,000. For orders under this amount, delivery charges range from ৳60-৳120 depending on your location.',
        },
        {
          question: 'What areas do you deliver to?',
          answer:
            'We deliver nationwide across Bangladesh, including all major cities like Dhaka, Chittagong, Sylhet, Rajshahi, Khulna, and more. Some remote areas may have longer delivery times.',
        },
        {
          question: 'Can I change my delivery address?',
          answer:
            'You can change your delivery address before your order is shipped. Contact our customer service team with your order number and new address details.',
        },
      ],
    },
    {
      category: 'Returns & Refunds',
      questions: [
        {
          question: 'What is your return policy?',
          answer:
            'We offer a 7-day return policy for most products. Items must be in original condition with packaging. Some items like software and digital products are non-returnable.',
        },
        {
          question: 'How do I return an item?',
          answer:
            "Contact our support team to initiate a return. We'll provide you with a Return Merchandise Authorization (RMA) number and return instructions. Pack the item securely and send it to our return address.",
        },
        {
          question: 'How long do refunds take?',
          answer:
            'Refunds are processed within 5-7 business days after we receive your return. Credit card refunds take 3-5 business days to appear on your statement.',
        },
        {
          question: 'Who pays for return shipping?',
          answer:
            'Customers typically pay for return shipping, except when the return is due to our error (wrong item, defective product, etc.). In such cases, we cover the return shipping costs.',
        },
      ],
    },
    {
      category: 'Products & Warranty',
      questions: [
        {
          question: 'Do products come with warranty?',
          answer:
            "Yes, all products come with the original manufacturer's warranty. Warranty terms vary by brand and product type, typically ranging from 1 to 3 years.",
        },
        {
          question: 'Are your products genuine?',
          answer:
            'Absolutely! We only sell genuine, authentic products from authorized distributors. All products come with proper documentation and warranty cards.',
        },
        {
          question: 'Can I get technical support?',
          answer:
            'Yes, we provide technical support for the products we sell. Contact our support team for assistance with setup, troubleshooting, or warranty claims.',
        },
        {
          question: 'Do you offer extended warranty?',
          answer:
            'Yes, we offer extended warranty options for select products. Extended warranty can be purchased at the time of original purchase and provides additional coverage beyond the standard warranty.',
        },
      ],
    },
  ]

  const filteredData = faqData
    .map((category) => ({
      ...category,
      questions: category.questions.filter(
        (q) =>
          q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          q.answer.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    }))
    .filter((category) => category.questions.length > 0)

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <HelpCircle className="h-16 w-16 text-yellow-600 mx-auto mb-4" />
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Find answers to common questions about our products, services, and policies.
          </p>
        </div>

        {/* Search */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search FAQs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* FAQ Content */}
        <div className="max-w-4xl mx-auto">
          {filteredData.length === 0 ? (
            <div className="text-center py-12">
              <HelpCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No results found</h3>
              <p className="text-gray-600">
                Try searching with different keywords or browse our categories below.
              </p>
            </div>
          ) : (
            <div className="space-y-8">
              {filteredData.map((category, categoryIndex) => (
                <div key={categoryIndex} className="bg-white border border-gray-200 rounded-lg">
                  <div className="p-6 border-b border-gray-200">
                    <h2 className="text-2xl font-bold text-gray-900">{category.category}</h2>
                  </div>
                  <div className="divide-y divide-gray-200">
                    {category.questions.map((item, questionIndex) => {
                      const globalIndex = categoryIndex * 100 + questionIndex
                      const isOpen = openItems.includes(globalIndex)

                      return (
                        <div key={questionIndex} className="p-6">
                          <button
                            onClick={() => toggleItem(globalIndex)}
                            className="w-full flex items-center justify-between text-left"
                          >
                            <h3 className="text-lg font-semibold text-gray-900 pr-4">
                              {item.question}
                            </h3>
                            {isOpen ? (
                              <ChevronUp className="h-5 w-5 text-gray-500 flex-shrink-0" />
                            ) : (
                              <ChevronDown className="h-5 w-5 text-gray-500 flex-shrink-0" />
                            )}
                          </button>
                          {isOpen && (
                            <div className="mt-4 text-gray-700 leading-relaxed">{item.answer}</div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Contact Support */}
        <div className="max-w-4xl mx-auto mt-12">
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">Still Need Help?</h2>
            <p className="text-gray-700 text-center mb-6">
              Can't find the answer you're looking for? Our support team is here to help you 24/7.
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="bg-yellow-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="h-8 w-8 text-yellow-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Live Chat</h3>
                <p className="text-gray-700 text-sm mb-3">Get instant help from our support team</p>
                <Button className="bg-yellow-600 hover:bg-yellow-700">Start Chat</Button>
              </div>
              <div className="text-center">
                <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Mail className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Email Support</h3>
                <p className="text-gray-700 text-sm mb-3">
                  Send us an email and we'll respond within 24 hours
                </p>
                <Button
                  variant="outline"
                  className="border-blue-600 text-blue-600 hover:bg-blue-50"
                >
                  Send Email
                </Button>
              </div>
              <div className="text-center">
                <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Phone className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Phone Support</h3>
                <p className="text-gray-700 text-sm mb-3">Call us for immediate assistance</p>
                <Button
                  variant="outline"
                  className="border-purple-600 text-purple-600 hover:bg-purple-50"
                >
                  Call Now
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
