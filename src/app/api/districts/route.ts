import { NextRequest } from 'next/server'
import { createServerClient } from '@/lib/supabase'; import { isAdmin } from '@/lib/supabase-server'
import { apiResponse } from '@/lib/utils'
import { districtSchema } from '@/lib/validations'

// GET /api/districts - Get all districts
export async function GET() {
  try {
    const supabase = createServerClient()
    const { data: districts, error } = await supabase
      .from('districts')
      .select('*')
      .order('name')

    if (error) {
      return apiResponse.internalError('Failed to fetch districts', error)
    }

    return apiResponse.success(districts)
  } catch (error) {
    return apiResponse.internalError('Internal server error', error)
  }
}

// POST /api/districts - Create a new district (Admin only)
export async function POST(request: NextRequest) {
  try {
    // Security check
    if (!(await isAdmin())) {
      return apiResponse.unauthorized()
    }

    const body = await request.json()
    const validation = districtSchema.safeParse(body)
    
    if (!validation.success) {
      return apiResponse.badRequest(validation.error.errors[0].message)
    }

    const data = validation.data
    const supabase = createServerClient()

    const { data: district, error } = await supabase
      .from('districts')
      .insert([
        {
          name: data.name,
          delivery_charge: data.delivery_charge,
          is_active: data.is_active,
        },
      ])
      .select()
      .single()

    if (error) {
      return apiResponse.internalError('Failed to create district', error)
    }

    return apiResponse.success(district, 'District created successfully', 201)
  } catch (error) {
    return apiResponse.internalError('Internal server error', error)
  }
}
