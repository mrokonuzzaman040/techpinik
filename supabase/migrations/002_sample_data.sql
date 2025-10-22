-- Add missing columns to tables
ALTER TABLE categories ADD COLUMN IF NOT EXISTS sort_order INTEGER DEFAULT 0;

-- Insert sample categories
INSERT INTO categories (name, slug, description, icon, is_active, sort_order) VALUES
('Electronics', 'electronics', 'Electronic devices and gadgets', 'Smartphone', true, 1),
('Fashion', 'fashion', 'Clothing and accessories', 'Shirt', true, 2),
('Home & Garden', 'home-garden', 'Home improvement and garden supplies', 'Home', true, 3),
('Books', 'books', 'Books and educational materials', 'Book', true, 4),
('Sports', 'sports', 'Sports equipment and accessories', 'Dumbbell', true, 5)
ON CONFLICT (slug) DO NOTHING;

-- Insert sample products
INSERT INTO products (name, slug, description, price, sale_price, sku, stock_quantity, images, is_featured, is_active, weight, dimensions, brand) VALUES
('Samsung Galaxy A54', 'samsung-galaxy-a54', 'Latest Samsung smartphone with excellent camera and performance', 45000.00, 42000.00, 'SAM-A54-001', 25, ARRAY['https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=Samsung%20Galaxy%20A54%20smartphone%20product%20photo%20white%20background&image_size=square'], true, true, 0.18, '159.9 x 74.7 x 8.2 mm', 'Samsung'),
('iPhone 14', 'iphone-14', 'Apple iPhone 14 with A15 Bionic chip and advanced camera system', 85000.00, 80000.00, 'APL-IP14-001', 15, ARRAY['https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=Apple%20iPhone%2014%20smartphone%20product%20photo%20white%20background&image_size=square'], true, true, 0.17, '146.7 x 71.5 x 7.8 mm', 'Apple'),
('Dell Inspiron 15', 'dell-inspiron-15', 'Dell Inspiron 15 laptop with Intel Core i5 processor and 8GB RAM', 65000.00, null, 'DEL-INS15-001', 12, ARRAY['https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=Dell%20Inspiron%2015%20laptop%20computer%20product%20photo%20white%20background&image_size=square'], true, true, 1.8, '358.5 x 235 x 18.9 mm', 'Dell'),
('Men''s Cotton T-Shirt', 'mens-cotton-tshirt', 'Comfortable cotton t-shirt for men, available in multiple colors', 800.00, 650.00, 'TSH-MCT-001', 50, ARRAY['https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=mens%20cotton%20t-shirt%20casual%20wear%20product%20photo%20white%20background&image_size=square'], false, true, 0.2, 'Medium: 71 x 51 cm', 'Generic'),
('Women''s Summer Dress', 'womens-summer-dress', 'Elegant summer dress for women, perfect for casual and formal occasions', 2500.00, 2200.00, 'DRS-WSD-001', 30, ARRAY['https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=womens%20summer%20dress%20elegant%20fashion%20product%20photo%20white%20background&image_size=square'], true, true, 0.3, 'Medium: 95 x 60 cm', 'Fashion Brand')
ON CONFLICT (sku) DO NOTHING;

-- Insert sample slider items (no unique constraint on title, so we'll use a different approach)
INSERT INTO slider_items (title, subtitle, image_url, link_url, button_text, is_active, sort_order) 
SELECT 'Summer Sale 2024', 'Up to 50% off on all electronics', 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=summer%20sale%20electronics%20banner%20discount%20shopping%20colorful%20modern&image_size=landscape_16_9', '/products?category=electronics', 'Shop Now', true, 1
WHERE NOT EXISTS (SELECT 1 FROM slider_items WHERE title = 'Summer Sale 2024');

INSERT INTO slider_items (title, subtitle, image_url, link_url, button_text, is_active, sort_order) 
SELECT 'New Fashion Collection', 'Discover the latest trends in fashion', 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=fashion%20collection%20clothing%20banner%20stylish%20modern%20trendy&image_size=landscape_16_9', '/products?category=fashion', 'Explore', true, 2
WHERE NOT EXISTS (SELECT 1 FROM slider_items WHERE title = 'New Fashion Collection');

INSERT INTO slider_items (title, subtitle, image_url, link_url, button_text, is_active, sort_order) 
SELECT 'Home Essentials', 'Transform your home with our premium collection', 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=home%20essentials%20furniture%20decor%20banner%20cozy%20modern&image_size=landscape_16_9', '/products?category=home-garden', 'Shop Home', true, 3
WHERE NOT EXISTS (SELECT 1 FROM slider_items WHERE title = 'Home Essentials');