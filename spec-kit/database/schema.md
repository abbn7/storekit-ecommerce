# Database Schema

## Primary Domains
- Store configuration and content:
  - `store_config`
  - `banners`
  - `announcements`
  - `testimonials`
- Catalog:
  - `products`
  - `product_images`
  - `product_variants`
  - `collections`
  - `product_collections`
- Orders:
  - `orders`
  - `order_items`
- Security/ops:
  - `login_attempts`
  - `processed_webhook_events`

## Relationship Highlights
- Product has many images and variants.
- Product and collection are many-to-many via `product_collections`.
- Order has many order items.
- Stripe session and webhook event tables support payment reconciliation and idempotency.

## Data Integrity Rules
- Foreign keys must remain explicit with deterministic delete behavior.
- Monetary values remain numeric and normalized for order/subtotal/tax/shipping.
- Soft business status fields (order/product) must use constrained enum-like values in application layer.
