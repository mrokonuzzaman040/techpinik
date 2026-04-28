import { z } from 'zod'

/**
 * Zod schemas for consistent API input validation
 */

// Category validation
export const categorySchema = z.object({
  name: z.string().min(1, 'Name is required').max(255),
  description: z.string().optional().nullable(),
  icon: z.string().optional().nullable(),
  image_url: z.string().optional().nullable(),
  banner_image_url: z.string().optional().nullable(),
  is_active: z.boolean().optional(),
  slug: z.string().min(1, 'Slug is required').max(255),
  parent_id: z.string().uuid().optional().nullable(),
})

export const updateCategorySchema = categorySchema.partial()

// Product validation
export const productSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255),
  description: z.string().min(1, 'Description is required'),
  price: z.number().positive('Price must be positive'),
  category_id: z.string().uuid('Invalid category ID'),
  images: z.array(z.string()).min(1, 'At least one image is required'),
  stock_quantity: z.number().int().nonnegative('Stock cannot be negative'),
  is_featured: z.boolean().default(false),
  slug: z.string().min(1, 'Slug is required'),
  sku: z.string().optional(),
})

export const updateProductSchema = productSchema.partial()

// District validation
export const districtSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255),
  delivery_charge: z.number().nonnegative('Delivery charge cannot be negative'),
  is_active: z.boolean().default(true),
})

export const updateDistrictSchema = districtSchema.partial()

// Order item validation
export const orderItemSchema = z.object({
  product_id: z.string().uuid('Invalid product ID'),
  quantity: z.number().int().positive('Quantity must be at least 1'),
})

// Order validation
export const orderSchema = z.object({
  customer_name: z.string().min(1, 'Customer name is required'),
  customer_phone: z.string().min(1, 'Phone number is required'),
  customer_email: z.string().email('Invalid email address').optional().nullable(),
  customer_address: z.string().min(1, 'Address is required'),
  district_id: z.string().uuid('Invalid district ID'),
  notes: z.string().optional().nullable(),
  items: z.array(orderItemSchema).min(1, 'Order must have at least one item'),
})

// Slider item validation
export const sliderItemSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255),
  subtitle: z.string().optional().nullable(),
  image_url: z.string().url('Invalid image URL'),
  link_url: z.string().optional().nullable(),
  sort_order: z.number().int().nonnegative().default(0),
  is_active: z.boolean().default(true),
})

export const updateSliderItemSchema = sliderItemSchema.partial()
