import Link from 'next/link'

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center space-y-4">
        <p className="text-sm font-medium tracking-wide text-gray-500 uppercase">404 error</p>
        <h1 className="text-3xl font-bold text-gray-900">Page not found</h1>
        <p className="text-gray-600">
          The page you are looking for does not exist or may have been moved.
        </p>
        <div className="pt-2">
          <Link
            href="/"
            className="inline-flex items-center rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 transition-colors"
          >
            Back to home
          </Link>
        </div>
      </div>
    </div>
  )
}
