// Core Database Types

// Product Types
export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  sale_price?: number;
  sku: string;
  stock_quantity: number;
  category_id?: string;
  images: string[];
  is_active: boolean;
  is_featured: boolean;
  weight?: number;
  dimensions?: string;
  availability_status?: string;
  warranty?: string;
  brand?: string;
  origin?: string;
  key_features?: string[];
  box_contents?: string[];
  slug: string;
  created_at: string;
  updated_at: string;
}

export interface ProductWithCategory extends Product {
  category: Category;
}

export interface CreateProductData {
  name: string;
  description: string;
  price: number;
  category_id: string;
  images: string[];
  stock_quantity: number;
  is_featured: boolean;
  slug: string;
}

export interface UpdateProductData extends Partial<CreateProductData> {
  updated_at?: string;
}

// Category Types
export interface Category {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  icon_url?: string;
  banner_url?: string;
  slug: string;
  parent_id?: string;
  created_at: string;
  updated_at?: string;
}

export interface CategoryWithProducts extends Category {
  products: Product[];
}

export interface CreateCategoryData {
  name: string;
  description?: string;
  icon?: string;
  icon_url?: string;
  banner_url?: string;
  slug: string;
  parent_id?: string;
}

export interface UpdateCategoryData extends Partial<CreateCategoryData> {
  updated_at?: string;
}

export interface CategoryForm {
  name: string;
  description: string;
  image_url: string;
  banner_image_url: string;
  is_active: boolean;
}

// Order Types
export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  customer_address: string;
  shipping_address: string;
  district_id: string;
  notes?: string;
  total_amount: number;
  delivery_charge: number;
  payment_method: string;
  payment_status: string;
  status: OrderStatus;
  created_at: string;
  updated_at: string;
}

export interface OrderWithDetails extends Order {
  district: District;
  order_items: OrderItemWithProduct[];
}

export interface CreateOrderData {
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  district_id: string;
  notes?: string;
  total_amount: number;
  delivery_charge: number;
  order_items: CreateOrderItemData[];
}

export interface UpdateOrderData {
  status?: OrderStatus;
  notes?: string;
  updated_at?: string;
}

// Order Item Types
export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
}

export interface OrderItemWithProduct extends OrderItem {
  product: Product;
}

export interface CreateOrderItemData {
  product_id: string;
  quantity: number;
  unit_price: number;
}

// District Types
export interface District {
  id: string;
  name: string;
  delivery_charge: number;
  is_active?: boolean;
}

export interface CreateDistrictData {
  name: string;
  delivery_charge: number;
  is_active?: boolean;
}

export interface UpdateDistrictData extends Partial<CreateDistrictData> {
  updated_at?: string;
}

// Slider Item Types
export interface SliderItem {
  id: string;
  image_url: string;
  title?: string;
  subtitle?: string;
  link_url?: string;
  order_index: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateSliderItemData {
  image_url: string;
  title?: string;
  subtitle?: string;
  link_url?: string;
  order_index: number;
  is_active?: boolean;
}

export interface UpdateSliderItemData extends Partial<CreateSliderItemData> {
  updated_at?: string;
}

// Cart Types
export interface CartItem {
  product_id: string;
  product: Product;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  total_items: number;
  total_amount: number;
}

// API Response Types
export interface ApiResponse<T = unknown> {
  data?: T;
  error?: string;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T = unknown> extends ApiResponse<T[]> {
  pagination?: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
}

// Customer Types
export interface Customer {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  address_line_1?: string;
  address_line_2?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  country: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateCustomerData {
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  address_line_1?: string;
  address_line_2?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  country?: string;
  is_active?: boolean;
}

export interface UpdateCustomerData extends Partial<CreateCustomerData> {
  updated_at?: string;
}

// Form Types
export interface CustomerInfo {
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  district_id: string;
  notes?: string;
}

export interface ProductFilters {
  category_id?: string;
  min_price?: number;
  max_price?: number;
  is_featured?: boolean;
  search?: string;
  sort_by?: 'name' | 'price' | 'created_at';
  sort_order?: 'asc' | 'desc';
}

export interface OrderFilters {
  status?: OrderStatus;
  district_id?: string;
  date_from?: string;
  date_to?: string;
  search?: string;
}

// Admin Types
export interface AdminStats {
  total_products: number;
  total_categories: number;
  total_orders: number;
  pending_orders: number;
  total_revenue: number;
  recent_orders: Order[];
}

// Utility Types
export type DatabaseTables = 'products' | 'categories' | 'orders' | 'order_items' | 'districts' | 'slider_items';

export interface SelectOption {
  value: string;
  label: string;
}

// Error Types
export interface ValidationError {
  field: string;
  message: string;
}

export interface FormErrors {
  [key: string]: string | undefined;
}

// Image Types
export interface ImageUploadResult {
  url: string;
  public_id?: string;
}

// Search Types
export interface SearchResult {
  products: Product[];
  categories: Category[];
  total_results: number;
}

// Navigation Types
export interface NavItem {
  title: string;
  href: string;
  icon?: string;
  children?: NavItem[];
}

// Theme Types
export type Theme = 'light' | 'dark' | 'system';

// Component Props Types
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

export interface PageProps {
  params: { [key: string]: string };
  searchParams: { [key: string]: string | string[] | undefined };
}


export interface CheckoutForm {
  customer_name: string
  customer_phone: string
  customer_address: string
  district_id: string
  notes?: string
}