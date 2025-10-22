-- Fix order_number column to auto-generate unique order numbers
-- This migration addresses the NOT NULL constraint error by providing a default value

-- First, let's add a default value for the order_number column
-- We'll use a function to generate unique order numbers in the format ORD-YYYYMMDD-XXXX

-- Create a function to generate unique order numbers
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TEXT AS $$
DECLARE
    new_order_number TEXT;
    counter INTEGER;
    date_part TEXT;
BEGIN
    -- Get current date in YYYYMMDD format
    date_part := to_char(NOW(), 'YYYYMMDD');
    
    -- Get the count of orders created today + 1
    SELECT COUNT(*) + 1 INTO counter
    FROM orders 
    WHERE order_number LIKE 'ORD-' || date_part || '-%';
    
    -- Generate the order number
    new_order_number := 'ORD-' || date_part || '-' || LPAD(counter::TEXT, 4, '0');
    
    -- Ensure uniqueness (in case of concurrent inserts)
    WHILE EXISTS (SELECT 1 FROM orders WHERE order_number = new_order_number) LOOP
        counter := counter + 1;
        new_order_number := 'ORD-' || date_part || '-' || LPAD(counter::TEXT, 4, '0');
    END LOOP;
    
    RETURN new_order_number;
END;
$$ LANGUAGE plpgsql;

-- Set a default value for the order_number column
ALTER TABLE orders ALTER COLUMN order_number SET DEFAULT generate_order_number();

-- Update any existing orders that might have NULL order_number
UPDATE orders 
SET order_number = generate_order_number() 
WHERE order_number IS NULL;

-- Ensure the column remains NOT NULL and UNIQUE (it should already be, but let's be explicit)
ALTER TABLE orders ALTER COLUMN order_number SET NOT NULL;

-- Add a unique constraint if it doesn't exist (it should already exist)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'orders_order_number_key' 
        AND conrelid = 'orders'::regclass
    ) THEN
        ALTER TABLE orders ADD CONSTRAINT orders_order_number_key UNIQUE (order_number);
    END IF;
END $$;