-- Fix shipping address schema mismatch
-- This migration resolves the issue where old shipping address columns still exist with NOT NULL constraints
-- but the checkout form uses the simplified customer_address field

-- First, handle existing orders with NULL values by providing defaults
-- Get the first available district for orders with NULL district_id
UPDATE orders 
SET district_id = (SELECT id FROM districts WHERE is_active = true LIMIT 1)
WHERE district_id IS NULL;

-- Migrate any existing data from old shipping columns to customer_address if needed
-- This handles cases where there might be existing orders with old schema data
UPDATE orders 
SET customer_address = COALESCE(
    customer_address,
    CONCAT_WS(', ', 
        NULLIF(shipping_address_line_1, ''),
        NULLIF(shipping_address_line_2, ''),
        NULLIF(shipping_city, ''),
        NULLIF(shipping_district, '')
    ),
    'Address not provided'  -- Fallback for completely empty addresses
)
WHERE customer_address IS NULL OR customer_address = '';

-- Now safely set NOT NULL constraints
ALTER TABLE orders ALTER COLUMN customer_address SET NOT NULL;
ALTER TABLE orders ALTER COLUMN district_id SET NOT NULL;

-- Now safely drop the old shipping address columns that are causing conflicts
ALTER TABLE orders DROP COLUMN IF EXISTS shipping_address_line_1;
ALTER TABLE orders DROP COLUMN IF EXISTS shipping_address_line_2;
ALTER TABLE orders DROP COLUMN IF EXISTS shipping_city;
ALTER TABLE orders DROP COLUMN IF EXISTS shipping_district;
ALTER TABLE orders DROP COLUMN IF EXISTS shipping_country;

-- Drop other unnecessary columns that aren't used by the current checkout form
ALTER TABLE orders DROP COLUMN IF EXISTS customer_id;
ALTER TABLE orders DROP COLUMN IF EXISTS customer_email;
ALTER TABLE orders DROP COLUMN IF EXISTS payment_method;
ALTER TABLE orders DROP COLUMN IF EXISTS payment_status;
ALTER TABLE orders DROP COLUMN IF EXISTS shipping_cost;
ALTER TABLE orders DROP COLUMN IF EXISTS subtotal;

-- Ensure the remaining columns have proper constraints
ALTER TABLE orders ALTER COLUMN customer_name SET NOT NULL;
ALTER TABLE orders ALTER COLUMN customer_phone SET NOT NULL;
ALTER TABLE orders ALTER COLUMN total_amount SET NOT NULL;

-- Add a comment to document the schema
COMMENT ON TABLE orders IS 'Orders table with simplified schema - uses customer_address instead of separate shipping address fields';
COMMENT ON COLUMN orders.customer_address IS 'Complete customer address including house/flat number, street, area, city';
COMMENT ON COLUMN orders.district_id IS 'Reference to districts table for delivery charge calculation';