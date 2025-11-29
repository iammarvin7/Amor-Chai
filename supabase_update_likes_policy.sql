-- Update RLS Policy to Allow Anonymous Users to View Like Counts
-- Run this in your Supabase SQL Editor

-- IMPORTANT: First, make sure your product_likes table uses TEXT for product_id
-- If your product_id column is UUID but your products have integer IDs, 
-- you need to change the column type:
-- ALTER TABLE public.product_likes ALTER COLUMN product_id TYPE text;

-- Drop the existing SELECT policy (if it exists)
DROP POLICY IF EXISTS "Allow select for authenticated users" ON public.product_likes;

-- Create a new policy that allows ALL users (including anonymous) to SELECT (view) likes
CREATE POLICY "Allow select for all users"
ON public.product_likes
FOR SELECT
USING (true);  -- This allows anyone to read likes, including anonymous users

-- The existing INSERT and DELETE policies remain unchanged:
-- - INSERT: Only authenticated users can like products
-- - DELETE: Users can only delete their own likes

