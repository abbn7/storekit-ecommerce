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

## Code Review Audit — Low Priority Fixes ⏳ PENDING
- [ ] **L1**: Remove `console.log` statements from production
- [ ] **L2**: Enable strict TypeScript (`strict: true` in tsconfig)
- [ ] **L3**: Add rate limit headers (`X-RateLimit-*`) to API responses
- [ ] **L4**: Add test coverage for critical paths (orders, webhooks, auth)
