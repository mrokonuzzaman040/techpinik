'use client'

import { useEffect, useState } from 'react'
import { ArrowLeft, Save, Globe, Phone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import AdminPageHeader from '@/components/admin/AdminPageHeader'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { toast } from 'sonner'

export default function GeneralSettingsPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [settings, setSettings] = useState({
    // Site Information
    site_name: 'TechPinik',
    site_description: 'Your trusted electronics and gadgets store in Bangladesh',
    site_keywords: 'electronics, gadgets, mobile, laptop, accessories, bangladesh',
    site_logo: '',
    favicon: '',

    // Contact Information
    contact_email: 'info@techpinik.com',
    contact_phone: '‪+880 1814‑931931‬',
    contact_address: 'Dhaka, Bangladesh',
    support_email: 'support@techpinik.com',

    // Business Settings
    currency: 'BDT',
    currency_symbol: '৳',
    timezone: 'Asia/Dhaka',
    date_format: 'DD/MM/YYYY',

    // Order Settings
    min_order_amount: 500,
    free_shipping_threshold: 1000,
    default_shipping_cost: 60,
    order_prefix: 'TP',

    // Social Media
    facebook_url: '',
    instagram_url: '',
    twitter_url: '',
    youtube_url: '',

    // Features
    enable_reviews: true,
    enable_wishlist: true,
    enable_compare: true,
    enable_newsletter: true,

    // SEO Settings
    meta_title: 'TechPinik - Electronics & Gadgets Store in Bangladesh',
    meta_description:
      'Shop the latest electronics, mobile phones, laptops, and accessories at TechPinik. Fast delivery across Bangladesh with competitive prices.',
    google_analytics_id: '',
    facebook_pixel_id: '',

    // Maintenance
    maintenance_mode: false,
    maintenance_message:
      'We are currently performing scheduled maintenance. Please check back soon.',
  })

  const handleInputChange = (field: string, value: string | number | boolean) => {
    setSettings((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const res = await fetch('/api/admin/settings/general')
        const payload = await res.json()

        if (!res.ok || !payload.success || !payload.data) {
          throw new Error(payload.error || 'Failed to load settings')
        }

        const dbSettings = payload.data
        setSettings((prev) => ({
          ...prev,
          site_name: dbSettings.site_name ?? prev.site_name,
          site_description: dbSettings.site_description ?? prev.site_description,
          site_keywords: dbSettings.site_keywords ?? prev.site_keywords,
          meta_title: dbSettings.meta_title ?? prev.meta_title,
          meta_description: dbSettings.meta_description ?? prev.meta_description,
          facebook_pixel_id: dbSettings.facebook_pixel_id ?? prev.facebook_pixel_id,
        }))
      } catch (error) {
        console.error('Error loading settings:', error)
        toast.error('Failed to load saved settings. Using defaults.')
      } finally {
        setLoading(false)
      }
    }

    loadSettings()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const res = await fetch('/api/admin/settings/general', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          site_name: settings.site_name,
          site_description: settings.site_description,
          site_keywords: settings.site_keywords,
          meta_title: settings.meta_title,
          meta_description: settings.meta_description,
          facebook_pixel_id: settings.facebook_pixel_id,
        }),
      })

      const payload = await res.json()
      if (!res.ok || !payload.success) {
        throw new Error(payload.error || 'Failed to save settings')
      }

      toast.success('Settings saved successfully!')
    } catch (error) {
      console.error('Error saving settings:', error)
      toast.error('Error saving settings. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 w-52 rounded bg-gray-200" />
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="h-48 rounded-xl border border-gray-200 bg-white" />
        ))}
      </div>
    )
  }

  return (
    <div>
      <AdminPageHeader
        title="General Settings"
        description="Configure site settings, contact information, and store preferences."
        leading={
          <Link href="/admin/settings">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Settings
            </Button>
          </Link>
        }
        actions={
          <Button onClick={handleSubmit} disabled={saving} className="w-full sm:w-auto">
            <Save className="h-4 w-4 mr-2" />
            {saving ? 'Saving...' : 'Save Settings'}
          </Button>
        }
      />

      <form onSubmit={handleSubmit} className="max-w-4xl space-y-6">
        {/* Site Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Site Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="site_name">Site Name</Label>
                <Input
                  id="site_name"
                  value={settings.site_name}
                  onChange={(e) => handleInputChange('site_name', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="currency">Currency</Label>
                <Input
                  id="currency"
                  value={settings.currency}
                  onChange={(e) => handleInputChange('currency', e.target.value)}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="site_description">Site Description</Label>
              <Textarea
                id="site_description"
                value={settings.site_description}
                onChange={(e) => handleInputChange('site_description', e.target.value)}
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="site_keywords">Site Keywords</Label>
              <Input
                id="site_keywords"
                value={settings.site_keywords}
                onChange={(e) => handleInputChange('site_keywords', e.target.value)}
                placeholder="Separate keywords with commas"
              />
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="h-5 w-5" />
              Contact Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="contact_email">Contact Email</Label>
                <Input
                  id="contact_email"
                  type="email"
                  value={settings.contact_email}
                  onChange={(e) => handleInputChange('contact_email', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="contact_phone">Contact Phone</Label>
                <Input
                  id="contact_phone"
                  value={settings.contact_phone}
                  onChange={(e) => handleInputChange('contact_phone', e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="support_email">Support Email</Label>
                <Input
                  id="support_email"
                  type="email"
                  value={settings.support_email}
                  onChange={(e) => handleInputChange('support_email', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="contact_address">Address</Label>
                <Input
                  id="contact_address"
                  value={settings.contact_address}
                  onChange={(e) => handleInputChange('contact_address', e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Order Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Order Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="min_order_amount">Minimum Order Amount (৳)</Label>
                <Input
                  id="min_order_amount"
                  type="number"
                  value={settings.min_order_amount}
                  onChange={(e) =>
                    handleInputChange('min_order_amount', parseInt(e.target.value) || 0)
                  }
                />
              </div>
              <div>
                <Label htmlFor="free_shipping_threshold">Free Shipping Threshold (৳)</Label>
                <Input
                  id="free_shipping_threshold"
                  type="number"
                  value={settings.free_shipping_threshold}
                  onChange={(e) =>
                    handleInputChange('free_shipping_threshold', parseInt(e.target.value) || 0)
                  }
                />
              </div>
              <div>
                <Label htmlFor="default_shipping_cost">Default Shipping Cost (৳)</Label>
                <Input
                  id="default_shipping_cost"
                  type="number"
                  value={settings.default_shipping_cost}
                  onChange={(e) =>
                    handleInputChange('default_shipping_cost', parseInt(e.target.value) || 0)
                  }
                />
              </div>
            </div>

            <div>
              <Label htmlFor="order_prefix">Order Number Prefix</Label>
              <Input
                id="order_prefix"
                value={settings.order_prefix}
                onChange={(e) => handleInputChange('order_prefix', e.target.value)}
                placeholder="e.g., TP, ORDER"
              />
            </div>
          </CardContent>
        </Card>

        {/* Social Media */}
        <Card>
          <CardHeader>
            <CardTitle>Social Media Links</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="facebook_url">Facebook URL</Label>
                <Input
                  id="facebook_url"
                  value={settings.facebook_url}
                  onChange={(e) => handleInputChange('facebook_url', e.target.value)}
                  placeholder="https://facebook.com/yourpage"
                />
              </div>
              <div>
                <Label htmlFor="instagram_url">Instagram URL</Label>
                <Input
                  id="instagram_url"
                  value={settings.instagram_url}
                  onChange={(e) => handleInputChange('instagram_url', e.target.value)}
                  placeholder="https://instagram.com/yourpage"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="twitter_url">Twitter URL</Label>
                <Input
                  id="twitter_url"
                  value={settings.twitter_url}
                  onChange={(e) => handleInputChange('twitter_url', e.target.value)}
                  placeholder="https://twitter.com/yourpage"
                />
              </div>
              <div>
                <Label htmlFor="youtube_url">YouTube URL</Label>
                <Input
                  id="youtube_url"
                  value={settings.youtube_url}
                  onChange={(e) => handleInputChange('youtube_url', e.target.value)}
                  placeholder="https://youtube.com/yourchannel"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Feature Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Feature Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="enable_reviews">Product Reviews</Label>
                  <p className="text-sm text-gray-500">Allow customers to review products</p>
                </div>
                <Switch
                  id="enable_reviews"
                  checked={settings.enable_reviews}
                  onCheckedChange={(checked) => handleInputChange('enable_reviews', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="enable_wishlist">Wishlist</Label>
                  <p className="text-sm text-gray-500">Enable wishlist functionality</p>
                </div>
                <Switch
                  id="enable_wishlist"
                  checked={settings.enable_wishlist}
                  onCheckedChange={(checked) => handleInputChange('enable_wishlist', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="enable_compare">Product Compare</Label>
                  <p className="text-sm text-gray-500">Allow product comparison</p>
                </div>
                <Switch
                  id="enable_compare"
                  checked={settings.enable_compare}
                  onCheckedChange={(checked) => handleInputChange('enable_compare', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="enable_newsletter">Newsletter</Label>
                  <p className="text-sm text-gray-500">Enable newsletter subscription</p>
                </div>
                <Switch
                  id="enable_newsletter"
                  checked={settings.enable_newsletter}
                  onCheckedChange={(checked) => handleInputChange('enable_newsletter', checked)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* SEO Settings */}
        <Card>
          <CardHeader>
            <CardTitle>SEO Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="meta_title">Meta Title</Label>
              <Input
                id="meta_title"
                value={settings.meta_title}
                onChange={(e) => handleInputChange('meta_title', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="meta_description">Meta Description</Label>
              <Textarea
                id="meta_description"
                value={settings.meta_description}
                onChange={(e) => handleInputChange('meta_description', e.target.value)}
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="google_analytics_id">Google Analytics ID</Label>
                <Input
                  id="google_analytics_id"
                  value={settings.google_analytics_id}
                  onChange={(e) => handleInputChange('google_analytics_id', e.target.value)}
                  placeholder="GA-XXXXXXXXX-X"
                />
              </div>
              <div>
                <Label htmlFor="facebook_pixel_id">Meta Pixel ID / Snippet</Label>
                <Input
                  id="facebook_pixel_id"
                  value={settings.facebook_pixel_id}
                  onChange={(e) => handleInputChange('facebook_pixel_id', e.target.value)}
                  placeholder="123456789012345 or fbq('init', '123456789012345')"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Maintenance Mode */}
        <Card>
          <CardHeader>
            <CardTitle>Maintenance Mode</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="maintenance_mode">Enable Maintenance Mode</Label>
                <p className="text-sm text-gray-500">Put the site in maintenance mode</p>
              </div>
              <Switch
                id="maintenance_mode"
                checked={settings.maintenance_mode}
                onCheckedChange={(checked) => handleInputChange('maintenance_mode', checked)}
              />
            </div>

            {settings.maintenance_mode && (
              <div>
                <Label htmlFor="maintenance_message">Maintenance Message</Label>
                <Textarea
                  id="maintenance_message"
                  value={settings.maintenance_message}
                  onChange={(e) => handleInputChange('maintenance_message', e.target.value)}
                  rows={3}
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:gap-4">
          <Button type="submit" disabled={saving} className="w-full sm:w-auto">
            <Save className="h-4 w-4 mr-2" />
            {saving ? 'Saving...' : 'Save Settings'}
          </Button>
          <Button type="button" variant="outline" className="w-full sm:w-auto">
            Reset to Defaults
          </Button>
        </div>
      </form>
    </div>
  )
}
