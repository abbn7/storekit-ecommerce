-- StoreKit Migration 00004: Schema Alignment & Security Fixes

-- ─── NEW-H1: Fix order_items.product_id to match Drizzle schema ───
-- Drizzle schema says: nullable with ON DELETE SET NULL
-- Current DB says: NOT NULL with RESTRICT (default)
ALTER TABLE order_items ALTER COLUMN product_id DROP NOT NULL;

-- Drop existing foreign key constraint and recreate with ON DELETE SET NULL
-- Need to find the constraint name first (it varies by Supabase version)
DO $$
DECLARE
  fk_constraint_name TEXT;
BEGIN
  SELECT con.conname INTO fk_constraint_name
  FROM pg_constraint con
  JOIN pg_class rel ON rel.oid = con.conrelid
  JOIN pg_namespace nsp ON nsp.oid = rel.relnamespace
  WHERE rel.relname = 'order_items'
    AND con.contype = 'f'
    AND con.conkey = (
      SELECT array_agg(attnum)
      FROM pg_attribute
      WHERE attrelid = 'order_items'::regclass AND attname = 'product_id'
    );

  IF fk_constraint_name IS NOT NULL THEN
    EXECUTE format('ALTER TABLE order_items DROP CONSTRAINT %I', fk_constraint_name);
  END IF;
END $$;

-- Add the correct foreign key with ON DELETE SET NULL
ALTER TABLE order_items
  ADD CONSTRAINT order_items_product_id_fkey
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL;

-- ─── NEW-M1: Fix RLS policy for orders ──────────────────────────
-- The current policy "Users read own orders" uses USING (true) which exposes all orders
-- Replace with a policy that only allows reading own orders via clerk_user_id
-- Note: Since the app uses service_role key for server-side queries, this only
-- affects direct client-side Supabase calls. Still important for defense-in-depth.
DROP POLICY IF EXISTS "Users read own orders" ON orders;

-- Public can no longer read orders directly — only via API routes (service_role)
-- Authenticated users can read their own orders (matched by clerk_user_id in JWT)
CREATE POLICY "Users read own orders" ON orders FOR SELECT
  USING (clerk_user_id = auth.jwt()->>'sub');

-- Also restrict order_items: only readable if the parent order is readable
DROP POLICY IF EXISTS "Public read order_items" ON order_items;
CREATE POLICY "Read order_items for own orders" ON order_items FOR SELECT
  USING (
    order_id IN (
      SELECT id FROM orders WHERE clerk_user_id = auth.jwt()->>'sub'
    )
  );

-- ─── NEW-M7: Add stock column to products table ─────────────────
-- Products without variants currently have no stock tracking
ALTER TABLE products ADD COLUMN IF NOT EXISTS stock INTEGER NOT NULL DEFAULT 0;

-- ─── NEW-M3: Add newsletter_subscribers table ───────────────────
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) NOT NULL UNIQUE,
  subscribed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  unsubscribed_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS newsletter_subscribers_email_idx ON newsletter_subscribers(email);

-- RLS for newsletter_subscribers
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role full access newsletter_subscribers" ON newsletter_subscribers
  FOR ALL USING (auth.role() = 'service_role');
