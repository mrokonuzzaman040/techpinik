-- Align slider_items column name with the app (`sort_order`).
-- - DBs from `20241201_fix_schema.sql` already have `sort_order` (nothing to do).
-- - DBs from `001_initial_schema.sql` may have `order_index` only; rename to `sort_order`.
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'slider_items' AND column_name = 'order_index'
  ) AND NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'slider_items' AND column_name = 'sort_order'
  ) THEN
    ALTER TABLE public.slider_items RENAME COLUMN order_index TO sort_order;
  END IF;
END $$;
