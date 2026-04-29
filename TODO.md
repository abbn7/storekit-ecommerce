# Storekit Fixes — Implementation Progress

## Completed
- [x] BUG-01: Stock decrement in orders API + webhook
- [x] BUG-02: Country select in checkout page
- [x] BUG-03: Stripe currency from store config
- [x] BUG-04: Dynamic sitemap with products & collections
- [x] INC-01: Product creation image upload
- [x] INC-02: Product edit page (`/admin/products/[id]/edit`)
- [x] INC-03: Collection edit page (`/admin/collections/[id]/edit`)
- [x] INC-04: Admin customers page with Clerk API
- [x] INC-05: Admin orders table formatting + detail page
- [x] INC-06: Address Line 2 input in checkout
- [x] WEAK-01: Rate limiting persistence in Supabase
- [x] WEAK-02: Stripe tax as automatic_tax (configurable)
- [x] WEAK-03: Webhook idempotency with DB table
- [x] WEAK-04: Nonce removed from admin-auth.ts
- [x] WEAK-05: Description required in product form

## Schema Migrations
- [x] `login_attempts` table for persistent rate limiting
- [x] `processed_webhook_events` table for idempotency
