-- Create user_cart table for storing each user's cart items
-- Run this in your Supabase SQL Editor

-- 1️⃣ Create the user_cart table
CREATE TABLE IF NOT EXISTS public.user_cart (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  product_id text NOT NULL,
  product_name text NOT NULL,
  product_price numeric NOT NULL,
  product_image text,
  quantity integer NOT NULL DEFAULT 1,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  UNIQUE (user_id, product_id)
);

-- 2️⃣ Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_user_cart_user_id ON public.user_cart(user_id);
CREATE INDEX IF NOT EXISTS idx_user_cart_product_id ON public.user_cart(product_id);

-- 3️⃣ Enable Row Level Security (RLS)
ALTER TABLE public.user_cart ENABLE ROW LEVEL SECURITY;

-- 4️⃣ Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Users can view their own cart" ON public.user_cart;
DROP POLICY IF EXISTS "Users can insert their own cart items" ON public.user_cart;
DROP POLICY IF EXISTS "Users can update their own cart items" ON public.user_cart;
DROP POLICY IF EXISTS "Users can delete their own cart items" ON public.user_cart;

-- 5️⃣ Create RLS policies

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

-- 6️⃣ Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_user_cart_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 7️⃣ Create trigger to automatically update updated_at on row update
DROP TRIGGER IF EXISTS update_user_cart_updated_at ON public.user_cart;
CREATE TRIGGER update_user_cart_updated_at
    BEFORE UPDATE ON public.user_cart
    FOR EACH ROW
    EXECUTE FUNCTION update_user_cart_updated_at();

-- ✅ Table is now ready to use!
-- Users can only access their own cart items, and timestamps are automatically managed.

