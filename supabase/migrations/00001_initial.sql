-- StoreKit Initial Migration
-- Run this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── Store Config ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS store_config (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  logo_url TEXT,
  favicon_url TEXT,
  primary_color VARCHAR(7) NOT NULL DEFAULT '#000000',
  accent_color VARCHAR(7) NOT NULL DEFAULT '#C8A96E',
  currency VARCHAR(3) NOT NULL DEFAULT 'USD',
  social_links JSONB,
  free_shipping_threshold INTEGER,
  shipping_cost INTEGER NOT NULL DEFAULT 0,
  tax_rate NUMERIC(5,4) NOT NULL DEFAULT 0.0000,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Products ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  description TEXT NOT NULL,
  short_description TEXT,
  price INTEGER NOT NULL,
  compare_at_price INTEGER,
  cost INTEGER,
  sku VARCHAR(100),
  barcode VARCHAR(100),
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  is_featured BOOLEAN NOT NULL DEFAULT FALSE,
  is_new BOOLEAN NOT NULL DEFAULT FALSE,
  material VARCHAR(255),
  care_instructions TEXT,
  meta_title VARCHAR(255),
  meta_description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS products_slug_idx ON products(slug);
CREATE INDEX IF NOT EXISTS products_active_idx ON products(is_active);
CREATE INDEX IF NOT EXISTS products_featured_idx ON products(is_featured);

CREATE TABLE IF NOT EXISTS product_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  alt_text VARCHAR(255),
  width INTEGER,
  height INTEGER,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_primary BOOLEAN NOT NULL DEFAULT FALSE
);
CREATE INDEX IF NOT EXISTS product_images_product_idx ON product_images(product_id);

CREATE TABLE IF NOT EXISTS product_variants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  sku VARCHAR(100),
  price INTEGER NOT NULL,
  compare_at_price INTEGER,
  stock INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT TRUE
);
CREATE INDEX IF NOT EXISTS product_variants_product_idx ON product_variants(product_id);

-- ─── Collections ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS collections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  image_url TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT TRUE
);
CREATE INDEX IF NOT EXISTS collections_slug_idx ON collections(slug);

CREATE TABLE IF NOT EXISTS product_collections (
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  collection_id UUID NOT NULL REFERENCES collections(id) ON DELETE CASCADE,
  PRIMARY KEY (product_id, collection_id)
);
CREATE INDEX IF NOT EXISTS product_collections_product_idx ON product_collections(product_id);
CREATE INDEX IF NOT EXISTS product_collections_collection_idx ON product_collections(collection_id);

-- ─── Orders ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) NOT NULL,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  address_line1 VARCHAR(255) NOT NULL,
  address_line2 VARCHAR(255),
  city VARCHAR(255) NOT NULL,
  state VARCHAR(255) NOT NULL,
  postal_code VARCHAR(20) NOT NULL,
  country VARCHAR(255) NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'pending',
  subtotal INTEGER NOT NULL,
  shipping_cost INTEGER NOT NULL DEFAULT 0,
  tax INTEGER NOT NULL DEFAULT 0,
  total INTEGER NOT NULL,
  stripe_session_id VARCHAR(255),
  clerk_user_id VARCHAR(255),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS orders_status_idx ON orders(status);
CREATE INDEX IF NOT EXISTS orders_clerk_user_idx ON orders(clerk_user_id);
CREATE INDEX IF NOT EXISTS orders_stripe_session_idx ON orders(stripe_session_id);

CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id),
  variant_id UUID,
  product_name VARCHAR(255) NOT NULL,
  variant_name VARCHAR(255),
  quantity INTEGER NOT NULL,
  price INTEGER NOT NULL,
  total INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS order_items_order_idx ON order_items(order_id);

-- ─── Content ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS banners (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  subtitle TEXT,
  image_url TEXT NOT NULL,
  link_url TEXT,
  position VARCHAR(50) NOT NULL DEFAULT 'hero',
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS announcements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  text TEXT NOT NULL,
  link_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS testimonials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  author_name VARCHAR(255) NOT NULL,
  author_title VARCHAR(255),
  content TEXT NOT NULL,
  avatar_url TEXT,
  rating INTEGER NOT NULL DEFAULT 5,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order INTEGER NOT NULL DEFAULT 0
);

-- ─── RLS Policies ─────────────────────────────────────
ALTER TABLE store_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Public read store_config" ON store_config FOR SELECT USING (true);
CREATE POLICY "Public read active products" ON products FOR SELECT USING (is_active = true);
CREATE POLICY "Public read product_images" ON product_images FOR SELECT USING (true);
CREATE POLICY "Public read active variants" ON product_variants FOR SELECT USING (is_active = true);
CREATE POLICY "Public read active collections" ON collections FOR SELECT USING (is_active = true);
CREATE POLICY "Public read product_collections" ON product_collections FOR SELECT USING (true);
CREATE POLICY "Users read own orders" ON orders FOR SELECT USING (true);
CREATE POLICY "Public read order_items" ON order_items FOR SELECT USING (true);
CREATE POLICY "Public read active banners" ON banners FOR SELECT USING (is_active = true);
CREATE POLICY "Public read active announcements" ON announcements FOR SELECT USING (is_active = true);
CREATE POLICY "Public read active testimonials" ON testimonials FOR SELECT USING (is_active = true);

-- Service role full access
CREATE POLICY "Service role full access store_config" ON store_config FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access products" ON products FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access product_images" ON product_images FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access product_variants" ON product_variants FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access collections" ON collections FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access product_collections" ON product_collections FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access orders" ON orders FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access order_items" ON order_items FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access banners" ON banners FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access announcements" ON announcements FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access testimonials" ON testimonials FOR ALL USING (auth.role() = 'service_role');

-- ─── Seed Data ────────────────────────────────────────
INSERT INTO store_config (name, description, primary_color, accent_color, currency, free_shipping_threshold, shipping_cost, tax_rate, social_links)
VALUES (
  'MAISON',
  'Curated luxury essentials for the modern connoisseur.',
  '#000000',
  '#C8A96E',
  'USD',
  20000,
  1500,
  0.0875,
  '{"instagram": "https://instagram.com/maison", "twitter": "https://twitter.com/maison", "pinterest": "https://pinterest.com/maison"}'
);

INSERT INTO announcements (text, link_url, is_active, sort_order)
VALUES ('Complimentary shipping on orders over $200', NULL, true, 0);

INSERT INTO banners (title, subtitle, image_url, position, is_active, sort_order)
VALUES (
  'The New Collection',
  'Timeless pieces crafted with intention',
  'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920&h=1080&fit=crop',
  'hero',
  true,
  0
);

INSERT INTO testimonials (author_name, author_title, content, rating, is_active, sort_order)
VALUES
  ('Alexandra Chen', 'Creative Director', 'The quality is unmatched. Every piece feels like it was made just for me.', 5, true, 0),
  ('James Wright', 'Architect', 'Minimal, refined, and built to last. Exactly what I look for.', 5, true, 1),
  ('Sofia Martinez', 'Gallery Owner', 'From packaging to product, the experience is truly luxurious.', 5, true, 2);
