// Application Constants

// Order Status Constants
export const ORDER_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
} as const

export const ORDER_STATUS_LABELS = {
  [ORDER_STATUS.PENDING]: 'Pending',
  [ORDER_STATUS.CONFIRMED]: 'Confirmed',
  [ORDER_STATUS.SHIPPED]: 'Shipped',
  [ORDER_STATUS.DELIVERED]: 'Delivered',
  [ORDER_STATUS.CANCELLED]: 'Cancelled',
} as const

export const ORDER_STATUS_COLORS = {
  [ORDER_STATUS.PENDING]: 'bg-yellow-100 text-yellow-800',
  [ORDER_STATUS.CONFIRMED]: 'bg-blue-100 text-blue-800',
  [ORDER_STATUS.SHIPPED]: 'bg-purple-100 text-purple-800',
  [ORDER_STATUS.DELIVERED]: 'bg-green-100 text-green-800',
  [ORDER_STATUS.CANCELLED]: 'bg-red-100 text-red-800',
} as const

// Pagination Constants
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 12,
  MAX_LIMIT: 100,
  PRODUCTS_PER_PAGE: 12,
  ORDERS_PER_PAGE: 20,
  ADMIN_ITEMS_PER_PAGE: 10,
} as const

// Price Constants
export const PRICE = {
  MIN: 0,
  MAX: 1000000,
  CURRENCY: 'BDT',
  CURRENCY_SYMBOL: '৳',
} as const

// Image Constants
export const IMAGE = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
  PLACEHOLDER: '/images/placeholder.jpg',
  PRODUCT_SIZES: {
    THUMBNAIL: { width: 150, height: 150 },
    SMALL: { width: 300, height: 300 },
    MEDIUM: { width: 600, height: 600 },
    LARGE: { width: 1200, height: 1200 },
  },
} as const

// Form Validation Constants
export const VALIDATION = {
  PRODUCT_NAME: {
    MIN_LENGTH: 2,
    MAX_LENGTH: 255,
  },
  PRODUCT_DESCRIPTION: {
    MIN_LENGTH: 10,
    MAX_LENGTH: 2000,
  },
  CATEGORY_NAME: {
    MIN_LENGTH: 2,
    MAX_LENGTH: 100,
  },
  CUSTOMER_NAME: {
    MIN_LENGTH: 2,
    MAX_LENGTH: 100,
  },
  CUSTOMER_PHONE: {
    MIN_LENGTH: 11,
    MAX_LENGTH: 15,
    PATTERN: /^(\+88)?01[3-9]\d{8}$/, // Bangladesh phone number pattern
  },
  CUSTOMER_ADDRESS: {
    MIN_LENGTH: 10,
    MAX_LENGTH: 500,
  },
  SLUG: {
    PATTERN: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
  },
} as const

// API Constants
export const API = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || '',
  TIMEOUT: 30000, // 30 seconds
  RETRY_ATTEMPTS: 3,
  ENDPOINTS: {
    PRODUCTS: '/api/products',
    CATEGORIES: '/api/categories',
    ORDERS: '/api/orders',
    DISTRICTS: '/api/districts',
    SLIDER: '/api/settings/slider',
    UPLOAD: '/api/upload',
    SEARCH: '/api/search',
  },
} as const

// Local Storage Keys
export const STORAGE_KEYS = {
  CART: 'techpinik_cart',
  THEME: 'techpinik_theme',
  ADMIN_TOKEN: 'techpinik_admin_token',
  RECENT_SEARCHES: 'techpinik_recent_searches',
  USER_PREFERENCES: 'techpinik_user_preferences',
} as const

// Route Constants
export const ROUTES = {
  HOME: '/',
  PRODUCTS: '/products',
  PRODUCT_DETAIL: (slug: string) => `/products/${slug}`,
  CART: '/cart',
  CHECKOUT: '/checkout',
  ORDER_CONFIRMATION: (orderId: string) => `/order-confirmation/${orderId}`,
  ADMIN: {
    DASHBOARD: '/admin',
    LOGIN: '/admin/login',
    PRODUCTS: '/admin/products',
    PRODUCT_NEW: '/admin/products/new',
    PRODUCT_EDIT: (id: string) => `/admin/products/${id}/edit`,
    CATEGORIES: '/admin/categories',
    CATEGORY_NEW: '/admin/categories/new',
    CATEGORY_EDIT: (id: string) => `/admin/categories/${id}/edit`,
    ORDERS: '/admin/orders',
    ORDER_DETAIL: (id: string) => `/admin/orders/${id}`,
    SETTINGS: {
      SLIDER: '/admin/settings/slider',
      FOOTER: '/admin/settings/footer',
      DISTRICTS: '/admin/settings/districts',
    },
  },
} as const

// Bangladesh Districts with Delivery Charges
export const BANGLADESH_DISTRICTS = [
  { name: 'Dhaka', delivery_charge: 60 },
  { name: 'Chittagong', delivery_charge: 100 },
  { name: 'Sylhet', delivery_charge: 120 },
  { name: 'Rajshahi', delivery_charge: 100 },
  { name: 'Khulna', delivery_charge: 100 },
  { name: 'Barisal', delivery_charge: 120 },
  { name: 'Rangpur', delivery_charge: 120 },
  { name: 'Mymensingh', delivery_charge: 100 },
  { name: 'Comilla', delivery_charge: 80 },
  { name: 'Gazipur', delivery_charge: 70 },
  { name: 'Narayanganj', delivery_charge: 70 },
  { name: 'Tangail', delivery_charge: 80 },
  { name: 'Jessore', delivery_charge: 110 },
  { name: 'Bogra', delivery_charge: 110 },
  { name: 'Dinajpur', delivery_charge: 130 },
  { name: 'Kushtia', delivery_charge: 110 },
  { name: 'Faridpur', delivery_charge: 90 },
  { name: 'Pabna', delivery_charge: 100 },
  { name: 'Sirajganj', delivery_charge: 100 },
  { name: 'Brahmanbaria', delivery_charge: 90 },
] as const

// Error Messages
export const ERROR_MESSAGES = {
  GENERIC: 'Something went wrong. Please try again.',
  NETWORK: 'Network error. Please check your connection.',
  VALIDATION: 'Please check your input and try again.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  NOT_FOUND: 'The requested resource was not found.',
  SERVER_ERROR: 'Server error. Please try again later.',
  CART_EMPTY: 'Your cart is empty.',
  PRODUCT_OUT_OF_STOCK: 'This product is out of stock.',
  INVALID_PHONE: 'Please enter a valid Bangladesh phone number.',
  REQUIRED_FIELD: 'This field is required.',
} as const

// Success Messages
export const SUCCESS_MESSAGES = {
  PRODUCT_CREATED: 'Product created successfully.',
  PRODUCT_UPDATED: 'Product updated successfully.',
  PRODUCT_DELETED: 'Product deleted successfully.',
  CATEGORY_CREATED: 'Category created successfully.',
  CATEGORY_UPDATED: 'Category updated successfully.',
  CATEGORY_DELETED: 'Category deleted successfully.',
  ORDER_CREATED: 'Order placed successfully.',
  ORDER_UPDATED: 'Order updated successfully.',
  CART_UPDATED: 'Cart updated successfully.',
  ITEM_ADDED_TO_CART: 'Item added to cart.',
  ITEM_REMOVED_FROM_CART: 'Item removed from cart.',
} as const

// Feature Flags
export const FEATURES = {
  ENABLE_SEARCH: true,
  ENABLE_WISHLIST: false,
  ENABLE_REVIEWS: false,
  ENABLE_COUPONS: false,
  ENABLE_MULTI_CURRENCY: false,
  ENABLE_GUEST_CHECKOUT: true,
  ENABLE_ADMIN_NOTIFICATIONS: true,
} as const

// Theme Configuration
export const THEME_CONFIG = {
  DEFAULT_THEME: 'light' as const,
  STORAGE_KEY: STORAGE_KEYS.THEME,
  THEMES: ['light', 'dark', 'system'] as const,
} as const

// Animation Durations (in milliseconds)
export const ANIMATION = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
  VERY_SLOW: 1000,
} as const

// Breakpoints (matching Tailwind CSS)
export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  '2XL': 1536,
} as const
