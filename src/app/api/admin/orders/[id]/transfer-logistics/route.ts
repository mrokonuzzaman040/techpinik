import { NextRequest } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { isAdmin } from '@/lib/supabase-server'
import { apiResponse } from '@/lib/utils'

interface RouteParams {
  params: Promise<{ id: string }>
}

type LogisticsProvider = 'pathao' | 'steadfast'

const LOGISTICS_PROVIDERS: LogisticsProvider[] = ['pathao', 'steadfast']

const sanitizePhone = (phone: string) => phone.replace(/[^\d]/g, '')

const toNumber = (value: number | string | null | undefined) => {
  if (typeof value === 'number') return value
  if (typeof value === 'string') return parseFloat(value)
  return 0
}

const getDistrictName = async (districtId: string) => {
  const supabase = createServerClient()
  const { data } = await supabase
    .from('districts')
    .select('name')
    .eq('id', districtId)
    .single()

  return data?.name || 'Unknown District'
}

async function transferToSteadfast(order: any) {
  const supabase = createServerClient()
  const { data: siteSettings } = await supabase
    .from('site_settings')
    .select('steadfast_api_key, steadfast_secret_key, steadfast_create_order_url')
    .eq('id', 1)
    .single()

  const apiKey = siteSettings?.steadfast_api_key || process.env.STEADFAST_API_KEY
  const secretKey = siteSettings?.steadfast_secret_key || process.env.STEADFAST_SECRET_KEY
  const endpoint =
    siteSettings?.steadfast_create_order_url ||
    process.env.STEADFAST_CREATE_ORDER_URL ||
    'https://portal.packzy.com/api/v1/create_order'

  if (!apiKey || !secretKey) {
    throw new Error('Steadfast credentials are missing. Set STEADFAST_API_KEY and STEADFAST_SECRET_KEY.')
  }

  const districtName = await getDistrictName(order.district_id)

  const payload = {
    invoice: order.order_number || order.id,
    recipient_name: order.customer_name,
    recipient_phone: sanitizePhone(order.customer_phone),
    recipient_address: order.customer_address,
    cod_amount: toNumber(order.total_amount),
    note: order.notes || '',
    item_description: `Order #${order.order_number || order.id}`,
    total_lot: 1,
    recipient_city: districtName,
  }

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Api-Key': apiKey,
      'Secret-Key': secretKey,
    },
    body: JSON.stringify(payload),
  })

  const result = await response.json().catch(() => ({}))
  if (!response.ok || result?.status === false) {
    throw new Error(result?.message || 'Steadfast transfer failed')
  }

  const consignmentId =
    result?.consignment?.consignment_id ||
    result?.consignment_id ||
    result?.data?.consignment_id ||
    null
  const trackingCode =
    result?.consignment?.tracking_code ||
    result?.tracking_code ||
    result?.data?.tracking_code ||
    null

  return { payload, result, consignmentId, trackingCode }
}

async function transferToPathao(order: any) {
  const supabase = createServerClient()
  const { data: siteSettings } = await supabase
    .from('site_settings')
    .select(
      `
      pathao_client_id,
      pathao_client_secret,
      pathao_username,
      pathao_password,
      pathao_store_id,
      pathao_base_url,
      pathao_city_id,
      pathao_zone_id,
      pathao_area_id
    `
    )
    .eq('id', 1)
    .single()

  const clientId = siteSettings?.pathao_client_id || process.env.PATHAO_CLIENT_ID
  const clientSecret = siteSettings?.pathao_client_secret || process.env.PATHAO_CLIENT_SECRET
  const username = siteSettings?.pathao_username || process.env.PATHAO_USERNAME
  const password = siteSettings?.pathao_password || process.env.PATHAO_PASSWORD
  const storeId = siteSettings?.pathao_store_id || process.env.PATHAO_STORE_ID
  const cityId = siteSettings?.pathao_city_id || process.env.PATHAO_CITY_ID
  const zoneId = siteSettings?.pathao_zone_id || process.env.PATHAO_ZONE_ID
  const areaId = siteSettings?.pathao_area_id || process.env.PATHAO_AREA_ID
  const baseUrl =
    siteSettings?.pathao_base_url || process.env.PATHAO_BASE_URL || 'https://api-hermes.pathao.com'

  if (!clientId || !clientSecret || !username || !password || !storeId) {
    throw new Error(
      'Pathao credentials are missing. Set PATHAO_CLIENT_ID, PATHAO_CLIENT_SECRET, PATHAO_USERNAME, PATHAO_PASSWORD, and PATHAO_STORE_ID.'
    )
  }

  const tokenResponse = await fetch(`${baseUrl}/aladdin/api/v1/issue-token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      username,
      password,
      grant_type: 'password',
    }),
  })
  const tokenResult = await tokenResponse.json().catch(() => ({}))
  const accessToken = tokenResult?.access_token

  if (!tokenResponse.ok || !accessToken) {
    throw new Error(tokenResult?.message || 'Failed to authenticate with Pathao')
  }

  const districtName = await getDistrictName(order.district_id)

  const payload = {
    store_id: Number(storeId),
    merchant_order_id: order.order_number || order.id,
    recipient_name: order.customer_name,
    recipient_phone: sanitizePhone(order.customer_phone),
    recipient_address: order.customer_address,
    recipient_city: cityId ? Number(cityId) : undefined,
    recipient_zone: zoneId ? Number(zoneId) : undefined,
    recipient_area: areaId ? Number(areaId) : undefined,
    recipient_city_name: districtName,
    delivery_type: 48,
    item_type: 2,
    special_instruction: order.notes || '',
    item_quantity: 1,
    item_weight: 0.5,
    amount_to_collect: toNumber(order.total_amount),
  }

  const createOrderResponse = await fetch(`${baseUrl}/aladdin/api/v1/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(payload),
  })
  const createOrderResult = await createOrderResponse.json().catch(() => ({}))

  if (!createOrderResponse.ok || createOrderResult?.code === 400 || createOrderResult?.status === false) {
    throw new Error(createOrderResult?.message || 'Pathao transfer failed')
  }

  const consignmentId =
    createOrderResult?.data?.consignment_id ||
    createOrderResult?.consignment_id ||
    createOrderResult?.data?.order_id ||
    null
  const trackingCode =
    createOrderResult?.data?.tracking_number ||
    createOrderResult?.tracking_number ||
    createOrderResult?.data?.consignment_id ||
    null

  return { payload, result: createOrderResult, consignmentId, trackingCode }
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    if (!(await isAdmin())) return apiResponse.unauthorized()

    const { id } = await params
    const body = await request.json()
    const providerInput = String(body?.provider || '').toLowerCase()
    const provider =
      providerInput === 'statefast' || providerInput === 'stead_fast'
        ? 'steadfast'
        : (providerInput as LogisticsProvider)

    if (!LOGISTICS_PROVIDERS.includes(provider)) {
      return apiResponse.badRequest('Invalid logistics provider. Use pathao or steadfast.')
    }

    const supabase = createServerClient()
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', id)
      .single()

    if (orderError || !order) {
      return apiResponse.notFound('Order not found')
    }

    const transferResult =
      provider === 'pathao' ? await transferToPathao(order) : await transferToSteadfast(order)

    const updateData = {
      logistics_provider: provider,
      logistics_status: 'transferred',
      logistics_consignment_id: transferResult.consignmentId,
      logistics_tracking_code: transferResult.trackingCode,
      logistics_payload: transferResult.result,
      logistics_transferred_at: new Date().toISOString(),
      status: order.status === 'pending' ? 'processing' : order.status,
      updated_at: new Date().toISOString(),
    }

    const { data: updatedOrder, error: updateError } = await supabase
      .from('orders')
      .update(updateData)
      .eq('id', id)
      .select('*')
      .single()

    if (updateError) {
      return apiResponse.internalError('Order transferred but failed to save transfer details', updateError)
    }

    return apiResponse.success(
      {
        order: updatedOrder,
        transfer: {
          provider,
          consignment_id: transferResult.consignmentId,
          tracking_code: transferResult.trackingCode,
        },
      },
      `Order transferred to ${provider === 'pathao' ? 'Pathao' : 'Steadfast'} successfully`
    )
  } catch (error: any) {
    return apiResponse.badRequest(error?.message || 'Failed to transfer order to logistics provider')
  }
}
