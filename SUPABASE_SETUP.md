# Supabase Setup for Product Likes

## Required Table: `product_likes`

Create this table in your Supabase database:

```sql
CREATE TABLE product_likes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id INTEGER NOT NULL,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(product_id, user_id)
);

-- Create index for faster queries
CREATE INDEX idx_product_likes_product_id ON product_likes(product_id);
CREATE INDEX idx_product_likes_user_id ON product_likes(user_id);

-- Enable Row Level Security (RLS)
ALTER TABLE product_likes ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read all likes
CREATE POLICY "Anyone can read likes" ON product_likes
  FOR SELECT USING (true);

-- Policy: Users can only insert their own likes
CREATE POLICY "Users can insert their own likes" ON product_likes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policy: Users can only delete their own likes
CREATE POLICY "Users can delete their own likes" ON product_likes
  FOR DELETE USING (auth.uid() = user_id);
```

This table stores:
- `product_id`: The ID of the product (from products.json)
- `user_id`: The UUID of the user who liked it
- Unique constraint ensures users can only like each product once

