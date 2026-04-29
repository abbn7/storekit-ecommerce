# ERD (Textual)

## Core Graph
- `products` 1--* `product_images`
- `products` 1--* `product_variants`
- `products` *--* `collections` through `product_collections`
- `orders` 1--* `order_items`
- `orders` 1--0..1 Stripe session linkage (`stripe_session_id`)
- `processed_webhook_events` tracks webhook idempotency by event id

## Entity Notes
- `orders` stores customer identity/contact and totals snapshot at purchase time.
- `order_items` stores product and variant naming snapshot to preserve historical accuracy.
- `store_config` is singleton-style configuration used by storefront and admin.
