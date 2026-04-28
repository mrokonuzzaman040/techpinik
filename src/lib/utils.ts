import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { NextResponse } from 'next/server'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Standard API Response helpers for consistent backend-to-frontend communication
 */
export const apiResponse = {
  success: <T>(data: T, message?: string, status: number = 200) => {
    return NextResponse.json(
      {
        success: true,
        data,
        message,
      },
      { status }
    )
  },

  error: (message: string, status: number = 500, error?: any) => {
    console.error(`API Error [${status}]: ${message}`, error || '')
    return NextResponse.json(
      {
        success: false,
        error: message,
      },
      { status }
    )
  },

  unauthorized: (message: string = 'Unauthorized access') => {
    return apiResponse.error(message, 401)
  },

  notFound: (message: string = 'Resource not found') => {
    return apiResponse.error(message, 404)
  },

  badRequest: (message: string = 'Invalid request data') => {
    return apiResponse.error(message, 400)
  },

  conflict: (message: string = 'Resource already exists') => {
    return apiResponse.error(message, 409)
  },

  internalError: (message: string = 'Internal server error', error?: any) => {
    return apiResponse.error(message, 500, error)
  },
}

/**
 * Helper to format currency consistently
 */
export function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-BD', {
    style: 'currency',
    currency: 'BDT',
    minimumFractionDigits: 0,
  }).format(amount)
}

/**
 * Helper to generate a slug from a string
 */
export function generateSlug(text: string) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w-]+/g, '') // Remove all non-word chars
    .replace(/--+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, '') // Trim - from end of text
}

/**
 * Helper to generate a SKU
 */
export function generateSKU(prefix: string = 'PRD') {
  const timestamp = Date.now().toString().slice(-6)
  const random = Math.random().toString(36).substring(2, 5).toUpperCase()
  return `${prefix}-${timestamp}-${random}`
}
