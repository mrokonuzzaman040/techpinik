'use client'

import { Settings, Sliders, MapPin, Globe } from 'lucide-react'
import AdminPageHeader from '@/components/admin/AdminPageHeader'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function AdminSettingsPage() {
  const settingsItems = [
    {
      title: 'Slider Management',
      description: 'Manage homepage hero slider images and content',
      icon: Sliders,
      href: '/admin/settings/slider',
      color: 'bg-slate-100 text-slate-700',
    },
    {
      title: 'Districts Management',
      description: 'Manage delivery districts and shipping charges',
      icon: MapPin,
      href: '/admin/settings/districts',
      color: 'bg-slate-100 text-slate-700',
    },
    {
      title: 'General Settings',
      description: 'Configure site settings, contact info, and preferences',
      icon: Globe,
      href: '/admin/settings/general',
      color: 'bg-slate-100 text-slate-700',
    },
  ]

  return (
    <div>
      <AdminPageHeader
        title="Settings"
        description="Manage application settings and configuration."
      />

      {/* Settings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {settingsItems.map((item) => {
          const IconComponent = item.icon
          return (
            <Card key={item.href} className="transition-shadow hover:shadow-md">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className={`rounded-lg p-2 ${item.color}`}>
                    <IconComponent className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-lg">{item.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">{item.description}</p>
                <Link href={item.href}>
                  <Button className="w-full">Manage</Button>
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
                <MapPin className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Site Status</p>
                  <p className="text-lg font-semibold text-yellow-600">Active</p>
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
  )
}
