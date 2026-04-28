import { NextRequest } from 'next/server'
import { isAdmin } from '@/lib/supabase-server'
import { createServerClient } from '@/lib/supabase'
import { apiResponse } from '@/lib/utils'
import { defaultSiteSettings } from '@/lib/site-settings'
import type { SiteSettingsUpdate } from '@/types/supabase'

const toStringValue = (value: unknown, fallback = ''): string =>
  typeof value === 'string' ? value.trim() : String(value ?? fallback).trim()

const toNumberValue = (value: unknown, fallback = 0): number => {
  const parsed = typeof value === 'number' ? value : Number(value)
  return Number.isFinite(parsed) ? parsed : fallback
}

const toBooleanValue = (value: unknown, fallback = false): boolean =>
  typeof value === 'boolean' ? value : fallback

// GET /api/admin/settings/general - read persisted general/SEO settings
export async function GET() {
  try {
    if (!(await isAdmin())) return apiResponse.unauthorized()

    const supabase = createServerClient()
    const { data, error } = await supabase.from('site_settings').select('*').eq('id', 1).single()

    if (error) return apiResponse.internalError('Failed to fetch settings', error)
    return apiResponse.success(data)
  } catch (error) {
    return apiResponse.internalError('Internal server error', error)
  }
}

// PUT /api/admin/settings/general - update persisted general/SEO settings
export async function PUT(request: NextRequest) {
  try {
    if (!(await isAdmin())) return apiResponse.unauthorized()

    const payload = await request.json()
    const supabase = createServerClient()

    const updateData: SiteSettingsUpdate = {
      site_name: toStringValue(payload.site_name, defaultSiteSettings.site_name),
      site_description: toStringValue(payload.site_description, defaultSiteSettings.site_description),
      site_keywords: toStringValue(payload.site_keywords, defaultSiteSettings.site_keywords),
      site_logo: toStringValue(payload.site_logo),
      favicon: toStringValue(payload.favicon),
      contact_email: toStringValue(payload.contact_email, 'info@techpinik.com'),
      contact_phone: toStringValue(payload.contact_phone, '+8801814931931'),
      contact_address: toStringValue(payload.contact_address, 'Dhaka, Bangladesh'),
      support_email: toStringValue(payload.support_email, 'support@techpinik.com'),
      currency: toStringValue(payload.currency, 'BDT'),
      currency_symbol: toStringValue(payload.currency_symbol, '৳'),
      timezone: toStringValue(payload.timezone, 'Asia/Dhaka'),
      date_format: toStringValue(payload.date_format, 'DD/MM/YYYY'),
      min_order_amount: toNumberValue(payload.min_order_amount, 500),
      free_shipping_threshold: toNumberValue(payload.free_shipping_threshold, 1000),
      default_shipping_cost: toNumberValue(payload.default_shipping_cost, 60),
      order_prefix: toStringValue(payload.order_prefix, 'TP'),
      facebook_url: toStringValue(payload.facebook_url),
      instagram_url: toStringValue(payload.instagram_url),
      twitter_url: toStringValue(payload.twitter_url),
      youtube_url: toStringValue(payload.youtube_url),
      enable_reviews: toBooleanValue(payload.enable_reviews, true),
      enable_wishlist: toBooleanValue(payload.enable_wishlist, true),
      enable_compare: toBooleanValue(payload.enable_compare, true),
      enable_newsletter: toBooleanValue(payload.enable_newsletter, true),
      meta_title: toStringValue(payload.meta_title, defaultSiteSettings.meta_title),
      meta_description: toStringValue(payload.meta_description, defaultSiteSettings.meta_description),
      google_analytics_id: toStringValue(payload.google_analytics_id),
      facebook_pixel_id: toStringValue(payload.facebook_pixel_id),
      maintenance_mode: toBooleanValue(payload.maintenance_mode, false),
      maintenance_message: toStringValue(
        payload.maintenance_message,
        'We are currently performing scheduled maintenance. Please check back soon.'
      ),
      pathao_client_id: toStringValue(payload.pathao_client_id),
      pathao_client_secret: toStringValue(payload.pathao_client_secret),
      pathao_username: toStringValue(payload.pathao_username),
      pathao_password: toStringValue(payload.pathao_password),
      pathao_store_id: toStringValue(payload.pathao_store_id),
      pathao_base_url: toStringValue(payload.pathao_base_url, 'https://api-hermes.pathao.com'),
      pathao_city_id: toStringValue(payload.pathao_city_id),
      pathao_zone_id: toStringValue(payload.pathao_zone_id),
      pathao_area_id: toStringValue(payload.pathao_area_id),
      steadfast_api_key: toStringValue(payload.steadfast_api_key),
      steadfast_secret_key: toStringValue(payload.steadfast_secret_key),
      steadfast_create_order_url: toStringValue(
        payload.steadfast_create_order_url,
        'https://portal.packzy.com/api/v1/create_order'
      ),
      updated_at: new Date().toISOString(),
    }

    const workingUpdateData: SiteSettingsUpdate = { ...updateData }
    let data: SiteSettingsUpdate | null = null
    let error: { code?: string; message?: string } | null = null
    let attempts = 0

    // Handle schema drift safely if local DB is behind migrations.
    while (attempts < 20) {
      attempts += 1
      const result = await supabase
        .from('site_settings')
        .upsert({ id: 1, ...workingUpdateData }, { onConflict: 'id' })
        .select('*')
        .single()

      data = result.data
      error = result.error

      if (!error) break
      if (error.code !== 'PGRST204') break

      const missingColumn = error.message?.match(/'([^']+)' column/)?.[1]
      if (!missingColumn) break

      delete workingUpdateData[missingColumn as keyof SiteSettingsUpdate]
    }

    if (error) return apiResponse.internalError('Failed to save settings', error)
    return apiResponse.success(data, 'Settings saved successfully')
  } catch (error) {
    return apiResponse.internalError('Internal server error', error)
  }
}
