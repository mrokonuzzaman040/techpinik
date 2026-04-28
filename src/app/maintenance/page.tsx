import { Wrench } from 'lucide-react'
import { getPublicSiteSettings } from '@/lib/site-settings'

export default async function MaintenancePage() {
  const settings = await getPublicSiteSettings()
  const message =
    settings.maintenance_message ||
    'We are currently performing scheduled maintenance. Please check back soon.'

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900">
      <div className="mx-auto flex min-h-screen w-full max-w-2xl flex-col items-center justify-center px-6 py-16 text-center">
        <div className="mb-6 rounded-full bg-amber-100 p-4 text-amber-700">
          <Wrench className="h-8 w-8" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">We&apos;ll be back soon</h1>
        <p className="mt-4 text-base text-gray-600 sm:text-lg">{message}</p>
      </div>
    </main>
  )
}
