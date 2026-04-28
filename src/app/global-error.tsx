'use client'

import Link from 'next/link'
import { useEffect } from 'react'

type GlobalErrorPageProps = {
  error: Error & { digest?: string }
  reset: () => void
}

export default function GlobalErrorPage({ error, reset }: GlobalErrorPageProps) {
  useEffect(() => {
    console.error('Global error boundary caught an error:', error)
  }, [error])

  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-lg w-full rounded-lg border border-gray-200 bg-white p-8 text-center shadow-sm space-y-4">
          <p className="text-sm font-medium tracking-wide text-red-600 uppercase">Critical application error</p>
          <h1 className="text-3xl font-bold text-gray-900">Something failed globally</h1>
          <p className="text-gray-600">
            A critical error happened and the app could not recover automatically. Please try resetting
            or go back to the homepage.
          </p>
          <div className="pt-2 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={reset}
              className="inline-flex items-center rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 transition-colors"
            >
              Reset app
            </button>
            <Link
              href="/"
              className="inline-flex items-center rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Go home
            </Link>
          </div>
        </div>
      </body>
    </html>
  )
}
