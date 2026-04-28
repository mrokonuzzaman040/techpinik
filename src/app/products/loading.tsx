'use client'

import MainLayout from '@/components/layout/MainLayout'

export default function ProductsLoading() {
  return (
    <MainLayout>
      <div className="bg-linear-to-b from-amber-50/70 via-white to-white">
        <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6">
          <div className="mb-6 rounded-2xl border border-amber-100/80 bg-white/90 p-4 shadow-sm sm:p-6 animate-pulse">
            <div className="h-8 w-48 rounded bg-gray-200" />
            <div className="mt-3 h-4 w-72 rounded bg-gray-200" />
          </div>

          <div className="mb-6 rounded-xl border border-gray-200 bg-white p-4 shadow-sm animate-pulse">
            <div className="h-10 w-full rounded bg-gray-200 sm:w-64" />
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 md:gap-6 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={`loading-product-${index}`}
                className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm animate-pulse"
              >
                <div className="aspect-square w-full bg-gray-200" />
                <div className="space-y-3 p-4">
                  <div className="h-4 w-2/3 rounded bg-gray-200" />
                  <div className="h-3 w-1/2 rounded bg-gray-200" />
                  <div className="h-4 w-1/3 rounded bg-gray-200" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
