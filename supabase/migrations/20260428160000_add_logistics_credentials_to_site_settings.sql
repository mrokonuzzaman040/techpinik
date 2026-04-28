ALTER TABLE public.site_settings
  ADD COLUMN IF NOT EXISTS pathao_client_id TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS pathao_client_secret TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS pathao_username TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS pathao_password TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS pathao_store_id TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS pathao_base_url TEXT NOT NULL DEFAULT 'https://api-hermes.pathao.com',
  ADD COLUMN IF NOT EXISTS pathao_city_id TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS pathao_zone_id TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS pathao_area_id TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS steadfast_api_key TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS steadfast_secret_key TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS steadfast_create_order_url TEXT NOT NULL DEFAULT 'https://portal.packzy.com/api/v1/create_order';
