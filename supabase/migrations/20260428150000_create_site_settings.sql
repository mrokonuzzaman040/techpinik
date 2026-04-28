CREATE TABLE IF NOT EXISTS site_settings (
  id INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  site_name TEXT NOT NULL DEFAULT 'TechPinik',
  site_description TEXT NOT NULL DEFAULT 'Your trusted electronics and gadgets store in Bangladesh',
  site_keywords TEXT NOT NULL DEFAULT 'electronics, gadgets, mobile, laptop, accessories, bangladesh',
  meta_title TEXT NOT NULL DEFAULT 'TechPinik - Electronics & Gadgets Store in Bangladesh',
  meta_description TEXT NOT NULL DEFAULT 'Shop the latest electronics, mobile phones, laptops, and accessories at TechPinik. Fast delivery across Bangladesh with competitive prices.',
  facebook_pixel_id TEXT NOT NULL DEFAULT '',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO site_settings (id)
VALUES (1)
ON CONFLICT (id) DO NOTHING;

ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'site_settings'
      AND policyname = 'Allow public read access to site_settings'
  ) THEN
    CREATE POLICY "Allow public read access to site_settings"
      ON site_settings
      FOR SELECT
      USING (true);
  END IF;
END$$;

GRANT SELECT ON site_settings TO anon, authenticated;
GRANT ALL ON site_settings TO service_role;
