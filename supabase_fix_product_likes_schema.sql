-- Fix product_likes table schema to match product IDs
-- Run this in your Supabase SQL Editor BEFORE updating RLS policies

-- Option 1: If your products use integer IDs (1, 2, 3, etc.)
-- Change product_id from UUID to TEXT or INTEGER
-- Uncomment the line below that matches your needs:

-- For TEXT (most flexible, works with any ID format):
ALTER TABLE public.product_likes ALTER COLUMN product_id TYPE text;

-- OR for INTEGER (if all your product IDs are integers):
-- ALTER TABLE public.product_likes ALTER COLUMN product_id TYPE integer USING product_id::text::integer;

-- After changing the column type, update the RLS policies:
-- (See supabase_update_likes_policy.sql)

