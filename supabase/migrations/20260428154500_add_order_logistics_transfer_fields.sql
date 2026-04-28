ALTER TABLE public.orders
ADD COLUMN IF NOT EXISTS logistics_provider TEXT,
ADD COLUMN IF NOT EXISTS logistics_status TEXT,
ADD COLUMN IF NOT EXISTS logistics_consignment_id TEXT,
ADD COLUMN IF NOT EXISTS logistics_tracking_code TEXT,
ADD COLUMN IF NOT EXISTS logistics_payload JSONB,
ADD COLUMN IF NOT EXISTS logistics_transferred_at TIMESTAMPTZ;
