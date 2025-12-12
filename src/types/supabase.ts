// Supabase Database Types
// This file contains types that match the Supabase database schema

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string
          name: string
          description: string | null
          icon: string | null
          slug: string
          parent_id: string | null
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          icon?: string | null
          slug: string
          parent_id?: string | null
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          icon?: string | null
          slug?: string
          parent_id?: string | null
          created_at?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'categories_parent_id_fkey'
            columns: ['parent_id']
            isOneToOne: false
            referencedRelation: 'categories'
            referencedColumns: ['id']
          },
        ]
      }
      districts: {
        Row: {
          id: string
          name: string
          delivery_charge: number
          is_active: boolean | null
        }
        Insert: {
          id?: string
          name: string
          delivery_charge?: number
          is_active?: boolean | null
        }
        Update: {
          id?: string
          name?: string
          delivery_charge?: number
          is_active?: boolean | null
        }
        Relationships: []
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          product_id: string
          quantity: number
          unit_price: number
        }
        Insert: {
          id?: string
          order_id: string
          product_id: string
          quantity: number
          unit_price: number
        }
        Update: {
          id?: string
          order_id?: string
          product_id?: string
          quantity?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: 'order_items_order_id_fkey'
            columns: ['order_id']
            isOneToOne: false
            referencedRelation: 'orders'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'order_items_product_id_fkey'
            columns: ['product_id']
            isOneToOne: false
            referencedRelation: 'products'
            referencedColumns: ['id']
          },
        ]
      }
      orders: {
        Row: {
          id: string
          customer_name: string
          customer_phone: string
          customer_address: string
          district_id: string
          notes: string | null
          total_amount: number
          delivery_charge: number
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          customer_name: string
          customer_phone: string
          customer_address: string
          district_id: string
          notes?: string | null
          total_amount: number
          delivery_charge: number
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          customer_name?: string
          customer_phone?: string
          customer_address?: string
          district_id?: string
          notes?: string | null
          total_amount?: number
          delivery_charge?: number
          status?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'orders_district_id_fkey'
            columns: ['district_id']
            isOneToOne: false
            referencedRelation: 'districts'
            referencedColumns: ['id']
          },
        ]
      }
      products: {
        Row: {
          id: string
          name: string
          description: string | null
          price: number
          category_id: string | null
          images: Json
          stock_quantity: number | null
          is_featured: boolean | null
          slug: string
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          price: number
          category_id?: string | null
          images?: Json
          stock_quantity?: number | null
          is_featured?: boolean | null
          slug: string
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          price?: number
          category_id?: string | null
          images?: Json
          stock_quantity?: number | null
          is_featured?: boolean | null
          slug?: string
          created_at?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'products_category_id_fkey'
            columns: ['category_id']
            isOneToOne: false
            referencedRelation: 'categories'
            referencedColumns: ['id']
          },
        ]
      }
      slider_items: {
        Row: {
          id: string
          image_url: string
          title: string | null
          subtitle: string | null
          link_url: string | null
          order_index: number
          is_active: boolean | null
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          image_url: string
          title?: string | null
          subtitle?: string | null
          link_url?: string | null
          order_index?: number
          is_active?: boolean | null
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          image_url?: string
          title?: string | null
          subtitle?: string | null
          link_url?: string | null
          order_index?: number
          is_active?: boolean | null
          created_at?: string
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

// Helper types for easier usage
export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row']
export type TablesInsert<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Insert']
export type TablesUpdate<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Update']

// Specific table types
export type CategoryRow = Tables<'categories'>
export type CategoryInsert = TablesInsert<'categories'>
export type CategoryUpdate = TablesUpdate<'categories'>

export type ProductRow = Tables<'products'>
export type ProductInsert = TablesInsert<'products'>
export type ProductUpdate = TablesUpdate<'products'>

export type OrderRow = Tables<'orders'>
export type OrderInsert = TablesInsert<'orders'>
export type OrderUpdate = TablesUpdate<'orders'>

export type OrderItemRow = Tables<'order_items'>
export type OrderItemInsert = TablesInsert<'order_items'>
export type OrderItemUpdate = TablesUpdate<'order_items'>

export type DistrictRow = Tables<'districts'>
export type DistrictInsert = TablesInsert<'districts'>
export type DistrictUpdate = TablesUpdate<'districts'>

export type SliderItemRow = Tables<'slider_items'>
export type SliderItemInsert = TablesInsert<'slider_items'>
export type SliderItemUpdate = TablesUpdate<'slider_items'>

// Supabase Client Types
export interface SupabaseError {
  message: string
  details: string
  hint: string
  code: string
}

export interface SupabaseResponse<T> {
  data: T | null
  error: SupabaseError | null
  count?: number | null
  status: number
  statusText: string
}

// Query Builder Types
export interface QueryOptions {
  select?: string
  limit?: number
  offset?: number
  orderBy?: {
    column: string
    ascending?: boolean
  }
  filters?: {
    column: string
    operator: 'eq' | 'neq' | 'gt' | 'gte' | 'lt' | 'lte' | 'like' | 'ilike' | 'in' | 'is'
    value: any
  }[]
}

// RLS (Row Level Security) Types
export interface RLSContext {
  user_id?: string
  role?: 'anon' | 'authenticated' | 'service_role'
}

// Storage Types
export interface StorageBucket {
  id: string
  name: string
  public: boolean
  created_at: string
  updated_at: string
}

export interface StorageObject {
  name: string
  bucket_id: string
  owner: string
  id: string
  updated_at: string
  created_at: string
  last_accessed_at: string
  metadata: Record<string, any>
}

export interface FileUploadOptions {
  cacheControl?: string
  contentType?: string
  duplex?: string
  upsert?: boolean
}

// Real-time Types
export interface RealtimeChannel {
  topic: string
  config: {
    broadcast?: {
      ack?: boolean
      self?: boolean
    }
    presence?: {
      key?: string
    }
  }
}

export interface RealtimePayload<T = any> {
  schema: string
  table: string
  commit_timestamp: string
  eventType: 'INSERT' | 'UPDATE' | 'DELETE'
  new: T
  old: T
  errors: any[]
}

// Auth Types (if needed for admin)
export interface User {
  id: string
  email?: string
  phone?: string
  created_at: string
  updated_at: string
  last_sign_in_at?: string
  role?: string
  user_metadata: Record<string, any>
  app_metadata: Record<string, any>
}

export interface Session {
  access_token: string
  refresh_token: string
  expires_in: number
  expires_at?: number
  token_type: string
  user: User
}

// Database Function Types (for custom functions if needed)
export interface DatabaseFunction<T = any> {
  name: string
  args: Record<string, any>
  returns: T
}
