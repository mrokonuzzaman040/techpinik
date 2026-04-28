-- Production Performance Optimization Migration

-- 1. Add indexes for high-frequency filtering and sorting
CREATE INDEX IF NOT EXISTS idx_products_price ON products(price);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_products_is_featured_created_at ON products(is_featured, created_at DESC);

-- 2. Enable Full-Text Search (FTS) for Products
-- This creates a generated column that combines name and description for ultra-fast searching
ALTER TABLE products ADD COLUMN IF NOT EXISTS fts tsvector 
GENERATED ALWAYS AS (to_tsvector('english', name || ' ' || coalesce(description, ''))) STORED;

CREATE INDEX IF NOT EXISTS idx_products_fts ON products USING GIN (fts);

-- 3. Optimization for Categories
CREATE INDEX IF NOT EXISTS idx_categories_name ON categories(name);

-- 4. Optimization for Orders
CREATE INDEX IF NOT EXISTS idx_orders_customer_phone ON orders(customer_phone);
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON orders(order_number);
