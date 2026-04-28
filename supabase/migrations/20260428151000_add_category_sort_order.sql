ALTER TABLE public.categories
ADD COLUMN IF NOT EXISTS sort_order integer NOT NULL DEFAULT 0;

WITH ranked_categories AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY created_at ASC, id ASC) - 1 AS position
  FROM public.categories
)
UPDATE public.categories AS c
SET sort_order = r.position
FROM ranked_categories AS r
WHERE c.id = r.id;

CREATE INDEX IF NOT EXISTS idx_categories_sort_order
ON public.categories (sort_order ASC, created_at DESC);
