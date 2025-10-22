-- Fix schema issues for sample data population

-- Add missing columns to products table
ALTER TABLE products ADD COLUMN IF NOT EXISTS slug text UNIQUE;

-- Create slider_items table (rename from sliders)
CREATE TABLE IF NOT EXISTS slider_items (
  id uuid DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
  title text NOT NULL,
  subtitle text,
  description text,
  button_text text,
  button_link text,
  image_url text NOT NULL,
  sort_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS on slider_items
ALTER TABLE slider_items ENABLE ROW LEVEL SECURITY;

-- Create policies for slider_items
CREATE POLICY "Allow public read access to active slider items" ON slider_items
  FOR SELECT USING (is_active = true);

CREATE POLICY "Allow authenticated users full access to slider items" ON slider_items
  FOR ALL USING (auth.role() = 'authenticated');

-- Grant permissions
GRANT SELECT ON slider_items TO anon;
GRANT ALL PRIVILEGES ON slider_items TO authenticated;

-- Update existing products to have slugs if they don't
UPDATE products 
SET slug = lower(replace(replace(name, ' ', '-'), '''', ''))
WHERE slug IS NULL;

-- Grant permissions to ensure our API can access all tables
GRANT SELECT ON districts TO anon;
GRANT ALL PRIVILEGES ON districts TO authenticated;

GRANT SELECT ON categories TO anon;
GRANT ALL PRIVILEGES ON categories TO authenticated;

GRANT SELECT ON products TO anon;
GRANT ALL PRIVILEGES ON products TO authenticated;

GRANT SELECT ON orders TO anon;
GRANT ALL PRIVILEGES ON orders TO authenticated;

GRANT SELECT ON order_items TO anon;
GRANT ALL PRIVILEGES ON order_items TO authenticated;

GRANT SELECT ON customers TO anon;
GRANT ALL PRIVILEGES ON customers TO authenticated;