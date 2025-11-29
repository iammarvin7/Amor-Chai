-- Fix user_cart table schema to match frontend expectations
-- This script safely alters the existing table without dropping it (preserves data)
-- Run this in your Supabase SQL Editor

-- 1️⃣ Change product_id from UUID to TEXT
-- First, drop the unique constraint if it exists (we'll recreate it later)
ALTER TABLE IF EXISTS public.user_cart 
  DROP CONSTRAINT IF EXISTS user_cart_user_id_product_id_key;

-- Convert product_id from uuid to text
ALTER TABLE IF EXISTS public.user_cart 
  ALTER COLUMN product_id TYPE text USING product_id::text;

-- 2️⃣ Add product_name column (if it doesn't exist)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'user_cart' 
    AND column_name = 'product_name'
  ) THEN
    ALTER TABLE public.user_cart ADD COLUMN product_name text;
    -- Update existing rows with a default value (you may want to customize this)
    UPDATE public.user_cart SET product_name = 'Unknown Product' WHERE product_name IS NULL;
    -- Make it NOT NULL after setting defaults
    ALTER TABLE public.user_cart ALTER COLUMN product_name SET NOT NULL;
  END IF;
END $$;

-- 3️⃣ Add product_price column (if it doesn't exist)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'user_cart' 
    AND column_name = 'product_price'
  ) THEN
    ALTER TABLE public.user_cart ADD COLUMN product_price numeric;
    -- Update existing rows with a default value
    UPDATE public.user_cart SET product_price = 0 WHERE product_price IS NULL;
    -- Make it NOT NULL after setting defaults
    ALTER TABLE public.user_cart ALTER COLUMN product_price SET NOT NULL;
  END IF;
END $$;

-- 4️⃣ Add product_image column (if it doesn't exist)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'user_cart' 
    AND column_name = 'product_image'
  ) THEN
    ALTER TABLE public.user_cart ADD COLUMN product_image text;
  END IF;
END $$;

-- 5️⃣ Add created_at column (if it doesn't exist)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'user_cart' 
    AND column_name = 'created_at'
  ) THEN
    ALTER TABLE public.user_cart 
      ADD COLUMN created_at timestamp with time zone DEFAULT now();
    -- Set default for existing rows
    UPDATE public.user_cart SET created_at = now() WHERE created_at IS NULL;
  END IF;
END $$;

-- 6️⃣ Add updated_at column (if it doesn't exist)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'user_cart' 
    AND column_name = 'updated_at'
  ) THEN
    ALTER TABLE public.user_cart 
      ADD COLUMN updated_at timestamp with time zone DEFAULT now();
    -- Set default for existing rows
    UPDATE public.user_cart SET updated_at = now() WHERE updated_at IS NULL;
  END IF;
END $$;

-- 7️⃣ Ensure quantity has a default value
ALTER TABLE IF EXISTS public.user_cart 
  ALTER COLUMN quantity SET DEFAULT 1;

-- 8️⃣ Recreate unique constraint on (user_id, product_id)
ALTER TABLE IF EXISTS public.user_cart 
  ADD CONSTRAINT user_cart_user_id_product_id_key 
  UNIQUE (user_id, product_id);

-- 9️⃣ Create indexes for better performance (if they don't exist)
CREATE INDEX IF NOT EXISTS idx_user_cart_user_id ON public.user_cart(user_id);
CREATE INDEX IF NOT EXISTS idx_user_cart_product_id ON public.user_cart(product_id);

-- 🔟 Ensure RLS is enabled
ALTER TABLE IF EXISTS public.user_cart ENABLE ROW LEVEL SECURITY;

-- 1️⃣1️⃣ Recreate RLS policies (drop and recreate to ensure they're correct)
DROP POLICY IF EXISTS "Users can view their own cart" ON public.user_cart;
DROP POLICY IF EXISTS "Users can insert their own cart items" ON public.user_cart;
DROP POLICY IF EXISTS "Users can update their own cart items" ON public.user_cart;
DROP POLICY IF EXISTS "Users can delete their own cart items" ON public.user_cart;

-- Policy: Users can SELECT (view) only their own cart items
CREATE POLICY "Users can view their own cart"
ON public.user_cart
FOR SELECT
USING (auth.uid() = user_id);

-- Policy: Users can INSERT only their own cart items
CREATE POLICY "Users can insert their own cart items"
ON public.user_cart
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Policy: Users can UPDATE only their own cart items
CREATE POLICY "Users can update their own cart items"
ON public.user_cart
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Policy: Users can DELETE only their own cart items
CREATE POLICY "Users can delete their own cart items"
ON public.user_cart
FOR DELETE
USING (auth.uid() = user_id);

-- 1️⃣2️⃣ Create or replace function for automatic updated_at timestamp
CREATE OR REPLACE FUNCTION update_user_cart_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 1️⃣3️⃣ Create trigger for automatic updated_at (drop and recreate)
DROP TRIGGER IF EXISTS update_user_cart_updated_at ON public.user_cart;
CREATE TRIGGER update_user_cart_updated_at
    BEFORE UPDATE ON public.user_cart
    FOR EACH ROW
    EXECUTE FUNCTION update_user_cart_updated_at();

-- ✅ Schema update complete!
-- The user_cart table now matches frontend expectations:
-- - product_id is text
-- - product_name, product_price, product_image are added
-- - created_at and updated_at timestamps are added
-- - Unique constraint on (user_id, product_id)
-- - RLS policies ensure users can only access their own cart

