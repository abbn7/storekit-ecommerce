-- StoreKit Migration 00003: Product Reviews & Discount Codes
-- Run this in Supabase SQL Editor

-- ─── Product Reviews ──────────────────────────────────
CREATE TABLE IF NOT EXISTS product_reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  clerk_user_id VARCHAR(255) NOT NULL,
  author_name VARCHAR(255) NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title VARCHAR(255),
  content TEXT,
  is_verified_purchase BOOLEAN NOT NULL DEFAULT FALSE,
  is_approved BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS product_reviews_product_idx ON product_reviews(product_id);
CREATE INDEX IF NOT EXISTS product_reviews_clerk_user_idx ON product_reviews(clerk_user_id);
CREATE INDEX IF NOT EXISTS product_reviews_approved_idx ON product_reviews(is_approved);
CREATE INDEX IF NOT EXISTS product_reviews_rating_idx ON product_reviews(rating);

-- Prevent duplicate reviews: one per user per product
CREATE UNIQUE INDEX IF NOT EXISTS product_reviews_user_product_idx ON product_reviews(product_id, clerk_user_id);

-- ─── Discount Codes ───────────────────────────────────
CREATE TABLE IF NOT EXISTS discount_codes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  type VARCHAR(20) NOT NULL CHECK (type IN ('percentage', 'fixed', 'free_shipping')),
  value INTEGER NOT NULL DEFAULT 0,
  min_order_amount INTEGER,
  max_uses INTEGER,
  used_count INTEGER NOT NULL DEFAULT 0,
  starts_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS discount_codes_code_idx ON discount_codes(code);
CREATE INDEX IF NOT EXISTS discount_codes_active_idx ON discount_codes(is_active);

-- ─── RLS Policies ─────────────────────────────────────
ALTER TABLE product_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE discount_codes ENABLE ROW LEVEL SECURITY;

-- Anyone can read approved reviews
CREATE POLICY "Approved reviews are publicly readable"
  ON product_reviews FOR SELECT
  USING (is_approved = TRUE);

-- Authenticated users can insert their own reviews
CREATE POLICY "Authenticated users can create reviews"
  ON product_reviews FOR INSERT
  WITH CHECK (auth.jwt() IS NOT NULL);

-- Users can update their own reviews
CREATE POLICY "Users can update own reviews"
  ON product_reviews FOR UPDATE
  USING (clerk_user_id = auth.jwt()->>'sub');

-- Discount codes are only readable server-side (no public SELECT)
-- Admin access handled via service role key

-- ─── Trigger: auto-update updated_at ──────────────────
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_product_reviews_updated_at
  BEFORE UPDATE ON product_reviews
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
