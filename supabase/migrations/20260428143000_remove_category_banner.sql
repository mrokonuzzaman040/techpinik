-- Remove unused category banner support from schema.
ALTER TABLE categories
DROP COLUMN IF EXISTS banner_image_url;
