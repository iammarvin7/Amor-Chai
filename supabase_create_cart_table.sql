-- Create user_cart table to store each user's cart items
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

-- 2️⃣ Enable Row Level Security (RLS)
ALTER TABLE public.user_cart ENABLE ROW LEVEL SECURITY;

-- 3️⃣ Allow users to SELECT only their own cart items
CREATE POLICY "Users can view their own cart"
ON public.user_cart
FOR SELECT
USING (auth.uid() = user_id);

-- 4️⃣ Allow users to INSERT only their own cart items
CREATE POLICY "Users can insert their own cart items"
ON public.user_cart
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- 5️⃣ Allow users to UPDATE only their own cart items
CREATE POLICY "Users can update their own cart items"
ON public.user_cart
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- 6️⃣ Allow users to DELETE only their own cart items
CREATE POLICY "Users can delete their own cart items"
ON public.user_cart
FOR DELETE
USING (auth.uid() = user_id);

-- 7️⃣ Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_user_cart_user_id ON public.user_cart(user_id);

-- 8️⃣ Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 9️⃣ Create trigger to automatically update updated_at
CREATE TRIGGER update_user_cart_updated_at 
    BEFORE UPDATE ON public.user_cart
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

