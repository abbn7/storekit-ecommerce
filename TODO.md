# Storekit Fixes — Implementation Progress

## Previous Fixes (Already Completed)
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

## Schema Migrations (Already Completed)
- [x] `login_attempts` table for persistent rate limiting
- [x] `processed_webhook_events` table for idempotency

---

## Code Review Audit — Critical Fixes ✅ DONE
- [x] **C1**: Cleanup endpoint auth bypass → `src/app/api/admin/cleanup/route.ts`
- [x] **C2**: Orders route clerkUserId linking → `src/app/api/orders/route.ts`
- [x] **C3**: Stock race condition (TOCTOU) → `src/app/api/orders/route.ts` + `src/app/api/webhooks/stripe/route.ts` + `src/lib/db/queries/orders.ts`

## Code Review Audit — High Priority Fixes ✅ DONE
- [x] **H1**: `updateOrderStatus` returns null → `src/lib/db/queries/orders.ts`
- [x] **H2**: Missing `x-stripe-signature` check → `src/app/api/webhooks/stripe/route.ts`
- [x] **H3**: Orders leak to other users → `src/app/api/orders/mine/route.ts`
- [x] **H4**: Double webhook processing → `src/app/api/webhooks/stripe/route.ts`
- [x] **H5**: Orphaned orders on Stripe failure → `src/app/api/orders/route.ts`

## Code Review Audit — Medium Priority Fixes ✅ DONE
- [x] **M1**: Input sanitization (XSS prevention) → `src/lib/validations.ts` (`stripHtml`, `sanitizeHtml` on all text fields)
- [x] **M2**: Server-side pagination → Already implemented in `src/lib/db/queries/products.ts` (page/limit params)
- [x] **M3**: Image size limits → Already implemented in `src/app/api/admin/upload/route.ts` (5MB max, MIME type check, path traversal prevention)
- [x] **M4**: Order deletion cascade → `src/lib/db/queries/orders.ts` (explicit `orderItems` delete before `orders` delete)
- [x] **M5**: Type safety → `calculateOrderAmount` already typed with `{ price: number; quantity: number }[]`
- [x] **M6**: Centralized error logging → `src/lib/logger.ts` (structured logger with env-aware output)

## Code Review Audit — Low Priority Fixes
- [x] **L1**: Remove `console.log` statements from production → Replaced all with `logger.*`
- [x] **L2**: Enable strict TypeScript (`strict: true` in tsconfig) → Already enabled
- [ ] **L3**: Add rate limit headers (`X-RateLimit-*`) to API responses
- [ ] **L4**: Add test coverage for critical paths (orders, webhooks, auth)

---

## Full Code Review — Round 2 (2026-04-30) ✅ DONE

### High Priority
- [x] **NEW-H1**: `order_items.product_id` schema↔migration mismatch → Migration `00004_schema_alignment.sql`
- [x] **NEW-H2**: `payment_intent.payment_failed` webhook handler → `src/app/api/orders/route.ts` (sets PaymentIntent metadata) + `src/app/api/webhooks/stripe/route.ts`
- [x] **NEW-H3**: Discount code brute-force → `src/app/api/discounts/validate/route.ts` (DB-backed rate limiting)
- [x] **NEW-H4**: Review authorName impersonation → `src/app/api/products/[id]/reviews/route.ts` (derived from Clerk profile)

### Medium Priority
- [x] **NEW-M1**: RLS policy "Users read own orders" exposes all orders → Migration `00004_schema_alignment.sql`
- [x] **NEW-M2**: `checkout.session.expired` lacks idempotency → `src/app/api/webhooks/stripe/route.ts`
- [x] **NEW-M3**: Newsletter in-memory storage → `src/app/api/newsletter/route.ts` (DB-backed with `newsletter_subscribers` table)
- [x] **NEW-M4**: HTML sanitizer bypasses → `src/lib/validations.ts` (added svg, img, video, audio, base, etc.)
- [x] **NEW-M5**: In-memory rate limiting in serverless → `src/app/api/search/route.ts` (DB-backed via `checkRateLimit`)
- [x] **NEW-M6**: N+1 query in `/api/orders/mine` → `src/app/api/orders/mine/route.ts` (batch-fetch items)
- [x] **NEW-M7**: Products without variants have no stock → `src/lib/db/schema.ts` (added `stock` column) + order flow updated
- [x] **NEW-M8**: Vercel cron auth → `src/app/api/admin/cleanup/route.ts` (Authorization: Bearer header) + `vercel.json`

### Low Priority
- [x] **NEW-L1**: Replace `console.*` with `logger.*` → All files updated
- [x] **NEW-L3**: Content-Security-Policy header → `vercel.json`
- [x] **NEW-L4**: Discount type validation → `src/lib/db/schema.ts` (pgEnum)
- [x] **NEW-L5**: Remove `fix-entities.*` scripts → Deleted
- [x] **NEW-L6**: Hardcoded fallback secret → `src/lib/admin-auth.ts` (throws if no secret)
- [x] **NEW-L7**: CRON_SECRET env var → `src/lib/config.ts` + `.env.local.example`
