/**
 * Creates or promotes a Supabase Auth user to admin using the service role.
 *
 * Requires in .env.local:
 *   NEXT_PUBLIC_SUPABASE_URL
 *   NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY
 *
 * Usage:
 *   ADMIN_EMAIL=you@example.com ADMIN_PASSWORD='secure' pnpm create-admin
 *
 * Or:
 *   pnpm create-admin you@example.com 'secure'
 */

import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const serviceKey = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY!

const email = (process.env.ADMIN_EMAIL || process.argv[2])?.trim()
const password = (process.env.ADMIN_PASSWORD || process.argv[3])?.trim()

if (!supabaseUrl || !serviceKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY in .env.local')
  process.exit(1)
}

if (!email || !password) {
  console.error('Missing admin credentials.')
  console.error('  ADMIN_EMAIL=... ADMIN_PASSWORD=... pnpm create-admin')
  console.error('  pnpm create-admin <email> <password>')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
})

async function findUserIdByEmail(target: string): Promise<string | null> {
  let page = 1
  const perPage = 1000
  while (true) {
    const { data, error } = await supabase.auth.admin.listUsers({ page, perPage })
    if (error) throw error
    const match = data.users.find((u) => u.email?.toLowerCase() === target.toLowerCase())
    if (match) return match.id
    if (data.users.length < perPage) return null
    page += 1
  }
}

async function main() {
  const existingId = await findUserIdByEmail(email)

  if (existingId) {
    const { error: updAuthError } = await supabase.auth.admin.updateUserById(existingId, {
      app_metadata: { role: 'admin' },
      password,
      email_confirm: true,
    })
    if (updAuthError) throw updAuthError

    const { error: profileError } = await supabase.from('profiles').upsert(
      {
        id: existingId,
        email,
        role: 'admin',
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'id' }
    )
    if (profileError) throw profileError

    console.log('Updated existing user to admin:', email)
    return
  }

  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    app_metadata: { role: 'admin' },
  })
  if (error) throw error
  if (!data.user) throw new Error('createUser returned no user')

  const { error: profileError } = await supabase.from('profiles').upsert(
    {
      id: data.user.id,
      email,
      role: 'admin',
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'id' }
  )
  if (profileError) {
    console.warn('Auth user created but profiles upsert failed (trigger may have run):', profileError.message)
  }

  console.log('Created admin user:', email)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
