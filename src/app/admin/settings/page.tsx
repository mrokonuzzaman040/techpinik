'use client'

import { Settings, Sliders, MapPin, Globe } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import AdminSidebar from '@/components/layout/AdminSidebar'
import Link from 'next/link'

export default function AdminSettingsPage() {
  const settingsItems = [
    {
      title: 'Slider Management',
      description: 'Manage homepage hero slider images and content',
      icon: Sliders,
      href: '/admin/settings/slider',
      color: 'bg-blue-500'
    },
    {
      title: 'Districts Management',
      description: 'Manage delivery districts and shipping charges',
      icon: MapPin,
      href: '/admin/settings/districts',
      color: 'bg-green-500'
    },
    {
      title: 'General Settings',
      description: 'Configure site settings, contact info, and preferences',
      icon: Globe,
      href: '/admin/settings/general',
      color: 'bg-purple-500'
    }
  ]

  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar />
      
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <Settings className="h-8 w-8 text-gray-700" />
              <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
            </div>
            <p className="text-gray-600">Manage your application settings and configurations</p>
          </div>

          {/* Settings Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {settingsItems.map((item) => {
              const IconComponent = item.icon
              return (
                <Card key={item.href} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${item.color} text-white`}>
                        <IconComponent className="h-6 w-6" />
                      </div>
                      <CardTitle className="text-lg">{item.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">{item.description}</p>
                    <Link href={item.href}>
                      <Button className="w-full">
                        Manage
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Quick Stats */}
          <div className="mt-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Active Sliders</p>
                      <p className="text-2xl font-bold text-gray-900">-</p>
                    </div>
                    <Sliders className="h-8 w-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Delivery Districts</p>
                      <p className="text-2xl font-bold text-gray-900">-</p>
                    </div>
                    <MapPin className="h-8 w-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Site Status</p>
                      <p className="text-lg font-semibold text-green-600">Active</p>
                    </div>
                    <Globe className="h-8 w-8 text-purple-500" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="mt-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Settings Changes</h2>
            <Card>
              <CardContent className="p-6">
                <div className="text-center text-gray-500">
                  <Settings className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No recent settings changes</p>
                  <p className="text-sm">Settings modifications will appear here</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}