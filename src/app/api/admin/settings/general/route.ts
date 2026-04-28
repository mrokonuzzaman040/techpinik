import { NextRequest } from 'next/server'
import { isAdmin } from '@/lib/supabase-server'
import { createServerClient } from '@/lib/supabase'
import { apiResponse } from '@/lib/utils'
import { defaultSiteSettings } from '@/lib/site-settings'

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

    const updateData = {
      site_name: String(payload.site_name ?? defaultSiteSettings.site_name).trim(),
      site_description: String(payload.site_description ?? defaultSiteSettings.site_description).trim(),
      site_keywords: String(payload.site_keywords ?? defaultSiteSettings.site_keywords).trim(),
      meta_title: String(payload.meta_title ?? defaultSiteSettings.meta_title).trim(),
      meta_description: String(payload.meta_description ?? defaultSiteSettings.meta_description).trim(),
      facebook_pixel_id: String(payload.facebook_pixel_id ?? '').trim(),
      updated_at: new Date().toISOString(),
    }

    const { data, error } = await supabase
      .from('site_settings')
      .upsert({ id: 1, ...updateData }, { onConflict: 'id' })
      .select('*')
      .single()

    if (error) return apiResponse.internalError('Failed to save settings', error)
    return apiResponse.success(data, 'Settings saved successfully')
  } catch (error) {
    return apiResponse.internalError('Internal server error', error)
  }
}
