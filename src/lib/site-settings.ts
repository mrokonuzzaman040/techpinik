import { cache } from 'react'
import { createClient } from '@/lib/supabase'

export interface SiteSettings {
  site_name: string
  site_description: string
  site_keywords: string
  meta_title: string
  meta_description: string
  facebook_pixel_id: string
}

export const defaultSiteSettings: SiteSettings = {
  site_name: 'TechPinik',
  site_description: 'Your trusted electronics and gadgets store in Bangladesh',
  site_keywords: 'electronics, gadgets, mobile, laptop, accessories, bangladesh',
  meta_title: 'TechPinik - Electronics & Gadgets Store in Bangladesh',
  meta_description:
    'Shop the latest electronics, mobile phones, laptops, and accessories at TechPinik. Fast delivery across Bangladesh with competitive prices.',
  facebook_pixel_id: '',
}

const normalizeSettings = (
  row: Partial<SiteSettings> | null | undefined
): SiteSettings => ({
  site_name: row?.site_name || defaultSiteSettings.site_name,
  site_description: row?.site_description || defaultSiteSettings.site_description,
  site_keywords: row?.site_keywords || defaultSiteSettings.site_keywords,
  meta_title: row?.meta_title || defaultSiteSettings.meta_title,
  meta_description: row?.meta_description || defaultSiteSettings.meta_description,
  facebook_pixel_id: row?.facebook_pixel_id || defaultSiteSettings.facebook_pixel_id,
})

export const getPublicSiteSettings = cache(async (): Promise<SiteSettings> => {
  try {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('site_settings')
      .select(
        'site_name, site_description, site_keywords, meta_title, meta_description, facebook_pixel_id'
      )
      .eq('id', 1)
      .single()

    if (error) return defaultSiteSettings
    return normalizeSettings(data)
  } catch (error) {
    console.error('Error loading public site settings:', error)
    return defaultSiteSettings
  }
})

/**
 * Supports both plain Pixel IDs and pasted snippets by extracting the ID.
 */
export function extractMetaPixelId(rawValue: string): string {
  const value = rawValue.trim()
  if (!value) return ''

  const directId = value.match(/^\d{8,20}$/)
  if (directId) return directId[0]

  const initMatch = value.match(/fbq\(\s*['"]init['"]\s*,\s*['"](\d{8,20})['"]\s*\)/i)
  if (initMatch?.[1]) return initMatch[1]

  return ''
}
