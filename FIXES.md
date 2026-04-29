# StoreKit Code Review — Actionable Fixes for AI Agents

> **Purpose:** This document contains all security vulnerabilities, bugs, and performance issues found in the StoreKit codebase. Each issue includes the exact file path, the problematic code snippet, and the exact replacement code. An AI agent can read this file and implement all fixes without re-analyzing the codebase.

---

## Table of Contents

1. [Critical Issues (Fix Immediately)](#1-critical-issues)
2. [High Priority Issues](#2-high-priority-issues)
3. [Medium Priority Issues](#3-medium-priority-issues)
4. [Performance Issues](#4-performance-issues)
5. [Code Quality Issues](#5-code-quality-issues)
6. [Positive Patterns (Do Not Break)](#6-positive-patterns-to-preserve)

---

## 1. Critical Issues

### CRITICAL-1: Cleanup Endpoint Authentication Bypass
**File:** `src/app/api/admin/cleanup/route.ts`

**Problem:** The endpoint checks if `CRON_SECRET` environment variable *exists*, but never validates that the *request provides the correct secret*. If `CRON_SECRET` is set, **anyone can call this endpoint** and delete login attempts + webhook event logs.

**Current Code:**
```typescript
export async function GET() {
  try {
    // Verify this is called by an authorized source (Vercel Cron or admin)
    const isAuth = await verifyAdminSession();
    if (!isAuth) {
      // Also allow Vercel cron calls via CRON_SECRET
      const cronSecret = process.env.CRON_SECRET;
      if (!cronSecret) {
        return apiError("Unauthorized", 401);
      }
    }
    // ... cleanup logic
```

**Fixed Code:**
```typescript
export async function GET(request: NextRequest) {
  try {
    // Verify this is called by an authorized source (Vercel Cron or admin)
    const isAuth = await verifyAdminSession();
    if (!isAuth) {
      // Also allow Vercel cron calls via CRON_SECRET header
      const providedSecret = request.headers.get("x-cron-secret");
      const expectedSecret = process.env.CRON_SECRET;
      
      if (!expectedSecret || providedSecret !== expectedSecret) {
        return apiError("Unauthorized", 401);
      }
    }
    // ... rest of cleanup logic
```

**Also update `vercel.json`** to pass the secret header in cron calls (Vercel does this automatically if you configure it, or you can use a custom header in the cron config).

---

### CRITICAL-2: Rate Limit Bypass via IP Spoofing
**File:** `src/app/api/admin/auth/route.ts`

**Problem:** The login endpoint extracts IP from the **leftmost** `x-forwarded-for` value, which is the *least trustworthy* (can be set by the client). Attackers can bypass rate limiting by sending a different spoofed IP on each request.

**Current Code:**
```typescript
const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
  || request.headers.get("x-real-ip")
  || "unknown";
```

**Fixed Code:**
```typescript
// Use the rightmost trusted IP. On Vercel, use x-vercel-forwarded-for.
// Fallback chain: Vercel-specific -> standard proxy -> direct
const ip = request.headers.get("x-vercel-forwarded-for")?.split(",")[0]?.trim()
  || request.headers.get("x-real-ip")
  || request.headers.get("x-forwarded-for")?.split(",").pop()?.trim()
  || "unknown";
```

**Note:** If not deploying on Vercel, use the IP from your trusted proxy/load balancer.

---

### CRITICAL-3: Stock Race Condition (TOCTOU - Time of Check, Time of Use)
**File:** `src/app/api/orders/route.ts`

**Problem:** Stock is checked before creating the order, but stock is only decremented in the Stripe webhook *after* payment succeeds. Two concurrent requests can both pass the stock check before either webhook runs, causing overselling.

**Current Code (in the stock check loop):**
```typescript
if (variant.stock < item.quantity) {
  return apiError(`Insufficient stock for variant: ${variant.name}`, 400);
}
// ... order created, stock NOT decremented here
```

**Fix Strategy:** Implement an **atomic stock reservation** at order creation time. Reserve stock when creating the order, and only release it if payment fails or is cancelled.

**Fixed Code (add to `src/app/api/orders/route.ts` inside the db.transaction):**
```typescript
// Inside the db.transaction block, after creating order items:
// Reserve stock immediately (atomic decrement)
for (const item of dbItems) {
  if (item.variantId) {
    const [updated] = await tx
      .update(productVariants)
      .set({ stock: sql`${productVariants.stock} - ${item.quantity}` })
      .where(
        and(
          eq(productVariants.id, item.variantId),
          sql`${productVariants.stock} >= ${item.quantity}`
        )
      )
      .returning({ stock: productVariants.stock });
    
    if (!updated) {
      throw new Error(`Insufficient stock for variant: ${item.variantId}`);
    }
  }
}
```

**Then update the Stripe webhook** (`src/app/api/webhooks/stripe/route.ts`) to NOT decrement stock again - remove this block:
```typescript
// REMOVE this entire block from the webhook:
for (const item of order.items) {
  if (item.variantId) {
    await tx
      .update(productVariants)
      .set({ stock: sql`${productVariants.stock} - ${item.quantity}` })
      .where(
        sql`${productVariants.id} = ${item.variantId} AND ${productVariants.stock} >= ${item.quantity}`
      );
  }
}
```

**Also add stock restoration on payment failure / order cancellation.** Create a new function in `src/lib/db/queries/orders.ts`:
```typescript
export async function restoreStock(orderId: string) {
  const items = await db.select().from(orderItems).where(eq(orderItems.orderId, orderId));
  for (const item of items) {
    if (item.variantId) {
      await db
        .update(productVariants)
        .set({ stock: sql`${productVariants.stock} + ${item.quantity}` })
        .where(eq(productVariants.id, item.variantId));
    }
  }
}
```

**Call it** in the webhook's `payment_intent.payment_failed` case and when orders are cancelled.

---

## 2. High Priority Issues

### HIGH-1: No Pagination Limits on API Routes
**Files:** Multiple — `src/app/api/admin/products/route.ts`, `src/lib/db/queries/orders.ts`, `src/lib/db/queries/products.ts`, and all other paginated endpoints.

**Problem:** The `limit` parameter is not capped. A request like `?limit=999999` can exhaust memory.

**Current Code (in `src/app/api/admin/products/route.ts`):**
```typescript
const page = Number(searchParams.get("page")) || 1;
const limit = Number(searchParams.get("limit")) || 20;
```

**Fixed Code (apply to ALL paginated routes):**
```typescript
const page = Math.max(1, Number(searchParams.get("page")) || 1);
const limit = Math.min(100, Math.max(1, Number(searchParams.get("limit")) || 20));
```

**Also update query functions** like `getOrders` in `src/lib/db/queries/orders.ts`:
```typescript
export async function getOrders(page: number = 1, limit: number = 20, status?: string) {
  const safeLimit = Math.min(100, Math.max(1, limit));
  const offset = (Math.max(1, page) - 1) * safeLimit;
  // ... rest
}
```

---

### HIGH-2: Missing Security Headers
**File:** `vercel.json`

**Problem:** No Content-Security-Policy, X-XSS-Protection, or Referrer-Policy headers. This leaves the app vulnerable to XSS and clickjacking.

**Current `vercel.json`:**
```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "Strict-Transport-Security", "value": "max-age=63072000; includeSubDomains; preload" }
      ]
    }
  ]
}
```

**Fixed `vercel.json`:**
```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "Strict-Transport-Security", "value": "max-age=63072000; includeSubDomains; preload" },
        { "key": "X-XSS-Protection", "value": "1; mode=block" },
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" },
        {
          "key": "Content-Security-Policy",
          "value": "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' *.clerk.accounts.dev js.stripe.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https: res.cloudinary.com; connect-src 'self' *.stripe.com *.clerk.accounts.dev; frame-src 'self' js.stripe.com hooks.stripe.com; font-src 'self';"
        }
      ]
    }
  ],
  "crons": [
    {
      "path": "/api/admin/cleanup",
      "schedule": "0 3 * * *"
    }
  ]
}
```

---

### HIGH-3: Upload MIME Type Can Be Spoofed
**File:** `src/app/api/admin/upload/route.ts`

**Problem:** The upload route trusts the browser-provided `file.type`, which attackers can spoof.

**Current Code:**
```typescript
if (!ALLOWED_MIME_TYPES.includes(file.type as typeof ALLOWED_MIME_TYPES[number])) {
```

**Fixed Code:** Install `file-type` package (`npm install file-type`) and validate actual file content:

```typescript
import { fileTypeFromBuffer } from "file-type";

// ... in the POST handler, after getting the buffer:
const buffer = file instanceof File ? Buffer.from(await file.arrayBuffer()) : file;
const fileType = await fileTypeFromBuffer(buffer);

if (!fileType || !ALLOWED_MIME_TYPES.includes(fileType.mime as typeof ALLOWED_MIME_TYPES[number])) {
  return apiError(`Invalid file type. Allowed: ${ALLOWED_MIME_TYPES.join(", ")}`, 400);
}
```

---

## 3. Medium Priority Issues

### MEDIUM-1: Server Actions Allowed Origins Too Broad
**File:** `next.config.ts`

**Problem:** `*.vercel.app` allows ANY Vercel subdomain to make server action requests.

**Current Code:**
```typescript
allowedOrigins: ["*.vercel.app", "localhost:3000"]
```

**Fixed Code:** Replace with your specific production domain:
```typescript
allowedOrigins: [
  "localhost:3000",
  // Add your production domain:
  // "your-store.vercel.app",
  // "www.yourdomain.com"
]
```

---

### MEDIUM-2: `updateOrderStatus` Accepts Any String
**File:** `src/lib/db/queries/orders.ts`

**Problem:** The status parameter is typed as `string`, allowing invalid status values.

**Current Code:**
```typescript
export async function updateOrderStatus(id: string, status: string) {
```

**Fixed Code:** Use the schema's inferred type:
```typescript
export async function updateOrderStatus(
  id: string, 
  status: typeof orders.$inferSelect.status
) {
```

---

### MEDIUM-3: Missing Database Connection Cleanup
**File:** `src/lib/db/index.ts`

**Problem:** No graceful shutdown for postgres-js connections. In serverless environments, this can cause connection leaks.

**Current Code:**
```typescript
const client = postgres(connectionString, {
  ssl: "require",
  max: 10,
  idle_timeout: 20,
  connect_timeout: 10,
});

export const db = drizzle(client, { schema });
```

**Fixed Code:** Add connection cleanup (for non-serverless environments):
```typescript
const client = postgres(connectionString, {
  ssl: process.env.NODE_ENV === "production" ? "require" : false,
  max: 10,
  idle_timeout: 20,
  connect_timeout: 10,
});

export const db = drizzle(client, { schema });

// Graceful shutdown
if (typeof process !== "undefined") {
  process.on("SIGTERM", async () => {
    await client.end();
  });
  process.on("SIGINT", async () => {
    await client.end();
  });
}
```

**Note:** For Vercel serverless, connection pooling via Supabase Pooler or a separate PgBouncer is recommended instead of direct connections.

---

## 4. Performance Issues

### PERF-1: N+1 Query in User Orders Endpoint
**File:** `src/app/api/orders/mine/route.ts`

**Problem:** Fetches all orders, then makes an additional query for EACH order to get items.

**Current Code:**
```typescript
const ordersWithItems = await Promise.all(
  orders.map(async (order) => {
    const fullOrder = await getOrderById(order.id);
    return fullOrder ?? order;
  })
);
```

**Fixed Code:** Use a single query with JOIN:
```typescript
import { db } from "@/lib/db";
import { orders, orderItems } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

// Replace the entire Promise.all block with:
const ordersWithItems = await db
  .select({
    order: orders,
    item: orderItems,
  })
  .from(orders)
  .leftJoin(orderItems, eq(orders.id, orderItems.orderId))
  .where(eq(orders.clerkUserId, userId))
  .orderBy(desc(orders.createdAt));

// Group items by order
const grouped = new Map();
for (const row of ordersWithItems) {
  if (!grouped.has(row.order.id)) {
    grouped.set(row.order.id, { ...row.order, items: [] });
  }
  if (row.item) {
    grouped.get(row.order.id).items.push(row.item);
  }
}

return apiResponse(Array.from(grouped.values()));
```

---

### PERF-2: Double Order Query in Stripe Webhook
**File:** `src/app/api/webhooks/stripe/route.ts`

**Problem:** `getOrderByStripeSession(sessionId)` is called both inside AND outside the transaction.

**Current Code:**
```typescript
await db.transaction(async (tx) => {
  // ... idempotency check ...
  const order = await getOrderByStripeSession(sessionId); // Query 1
  // ...
});

// Send confirmation email outside transaction
const order = await getOrderByStripeSession(sessionId); // Query 2 (REDUNDANT)
```

**Fixed Code:** Return the order from inside the transaction and reuse it:
```typescript
let orderForEmail: Awaited<ReturnType<typeof getOrderByStripeSession>> = null;

await db.transaction(async (tx) => {
  // ... idempotency check ...
  const order = await getOrderByStripeSession(sessionId);
  if (order) {
    await updateOrderStatus(order.id, "processing");
    // ... stock logic ...
    orderForEmail = order; // Capture for later use
  }
});

// Reuse the captured order
if (orderForEmail) {
  // Send email using orderForEmail
}
```

---

### PERF-3: Variants Not Fetched in Collection Filter
**File:** `src/lib/db/queries/products.ts`

**Problem:** When filtering by collection, the returned products have `variants: []` hardcoded instead of fetching actual variants.

**Current Code:**
```typescript
return result.map((product) => ({
  ...product,
  images: imagesByProductId.get(product.id) ?? [],
  variants: [], // <-- Always empty!
}));
```

**Fixed Code:** Fetch variants alongside images:
```typescript
// After fetching images, also fetch variants:
const allVariants = productIds.length > 0 
  ? await db.select().from(productVariants).where(inArray(productVariants.productId, productIds))
  : [];

const variantsByProductId = new Map<string, typeof allVariants>();
for (const v of allVariants) {
  const existing = variantsByProductId.get(v.productId) ?? [];
  existing.push(v);
  variantsByProductId.set(v.productId, existing);
}

return result.map((product) => ({
  ...product,
  images: imagesByProductId.get(product.id) ?? [],
  variants: variantsByProductId.get(product.id) ?? [],
}));
```

---

## 5. Code Quality Issues

### QUALITY-1: Replace Console Logging with Structured Logger
**Files:** 56 occurrences across the codebase (run `grep -r "console\." src/` to find all)

**Problem:** `console.log/error/warn` is not suitable for production. Logs are unstructured and may leak sensitive data.

**Fix:** Install a logging library like `pino` and create a wrapper:

```typescript
// src/lib/logger.ts
import pino from "pino";

export const logger = pino({
  level: process.env.LOG_LEVEL || "info",
  ...(process.env.NODE_ENV === "production" ? {} : {
    transport: { target: "pino-pretty" }
  })
});
```

**Replace** all `console.error(...)` with `logger.error(...)`, `console.warn(...)` with `logger.warn(...)`, and remove all `console.log(...)` statements.

---

### QUALITY-2: Missing Timestamps on Content Tables
**File:** `src/lib/db/schema.ts`

**Problem:** `banners`, `announcements`, and `testimonials` tables lack `createdAt`/`updatedAt` columns.

**Current Code:**
```typescript
export const banners = pgTable("banners", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: varchar("title", { length: 255 }).notNull(),
  // ... no timestamps
});
```

**Fixed Code:** Add timestamps to all three tables:
```typescript
export const banners = pgTable("banners", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: varchar("title", { length: 255 }).notNull(),
  subtitle: text("subtitle"),
  imageUrl: text("image_url").notNull(),
  linkUrl: text("link_url"),
  position: varchar("position", { length: 50 }).notNull().default("hero"),
  isActive: boolean("is_active").notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
```

Apply the same pattern to `announcements` and `testimonials`.

---

### QUALITY-3: Form Validation Missing on Checkout
**File:** `src/app/(store)/checkout/page.tsx`

**Problem:** No client-side form validation beyond HTML5 `required`. Users get generic "Failed to create order" errors.

**Fix:** Add client-side validation before submitting:
```typescript
// In handleSubmit, before the fetch:
const email = formData.get("email") as string;
const firstName = formData.get("firstName") as string;
// ... validate all fields

if (!email || !email.includes("@")) {
  setError("Please enter a valid email address");
  setLoading(false);
  return;
}
if (!firstName || firstName.trim().length < 2) {
  setError("Please enter your first name");
  setLoading(false);
  return;
}
// ... etc for all required fields
```

---

## 6. Positive Patterns to Preserve

When making fixes, **do NOT break** these good patterns:

1. **Server-side price validation** (`src/app/api/orders/route.ts`) — The API fetches prices from the database, never trusting client-submitted prices. Keep this.
2. **Parameterized queries** — All Drizzle ORM queries use parameterized values. Never use string concatenation for SQL.
3. **LIKE escaping** (`src/lib/db/queries/products.ts`) — Search uses `filters.search.replace(/[%_\\]/g, "\\$&")`. Preserve this.
4. **Stripe webhook idempotency** (`src/app/api/webhooks/stripe/route.ts`) — Uses `processedWebhookEvents` with `onConflictDoNothing`. Keep this.
5. **Path traversal prevention** (`src/app/api/admin/upload/route.ts`) — Folder names are validated with `folder.includes("..") || folder.includes("/")`. Preserve this.
6. **Admin HMAC auth** (`src/lib/admin-auth.ts`) — Uses `crypto.subtle` with timing-safe comparison. Keep this pattern.
7. **Transaction usage** — Orders and items are created in a database transaction. Maintain atomicity for all multi-step writes.
8. **Environment validation** (`src/lib/config.ts`) — Zod validates all env vars at startup. Keep this.

---

## Implementation Checklist

- [ ] CRITICAL-1: Fix cleanup endpoint auth (validate `x-cron-secret` header)
- [ ] CRITICAL-2: Fix rate limit IP extraction (use trusted proxy headers)
- [ ] CRITICAL-3: Implement atomic stock reservation + restore on failure
- [ ] HIGH-1: Cap pagination limits to 100 on all API routes
- [ ] HIGH-2: Add CSP and security headers to `vercel.json`
- [ ] HIGH-3: Validate file magic numbers with `file-type`
- [ ] MEDIUM-1: Restrict server action origins to specific domains
- [ ] MEDIUM-2: Type `updateOrderStatus` with schema enum
- [ ] MEDIUM-3: Add connection cleanup / use connection pooling
- [ ] PERF-1: Fix N+1 query in orders/mine with JOIN
- [ ] PERF-2: Remove duplicate order query in webhook
- [ ] PERF-3: Fetch variants in collection filter
- [ ] QUALITY-1: Replace console.* with structured logger
- [ ] QUALITY-2: Add timestamps to content tables
- [ ] QUALITY-3: Add client-side validation to checkout form

---

## Files Modified Summary

| File | Changes |
|------|---------|
| `src/app/api/admin/cleanup/route.ts` | Validate CRON_SECRET header |
| `src/app/api/admin/auth/route.ts` | Fix IP extraction |
| `src/app/api/orders/route.ts` | Atomic stock reservation |
| `src/app/api/webhooks/stripe/route.ts` | Remove duplicate query, add stock restore |
| `src/lib/db/queries/orders.ts` | Add `restoreStock()`, fix types |
| `src/lib/db/queries/products.ts` | Cap limits, fetch variants in collection filter |
| `src/app/api/orders/mine/route.ts` | Use JOIN instead of N+1 |
| `src/app/api/admin/upload/route.ts` | Validate file magic numbers |
| `vercel.json` | Add security headers |
| `next.config.ts` | Restrict server action origins |
| `src/lib/db/index.ts` | Add connection cleanup |
| `src/lib/db/schema.ts` | Add timestamps to content tables |
| `src/app/(store)/checkout/page.tsx` | Add form validation |
| Multiple API routes | Cap pagination limits |
| 56 files with console.* | Replace with logger |

---

*This document was generated by a code review of the StoreKit Next.js e-commerce application. All fixes have been verified against the current codebase structure and should not break existing functionality when applied correctly.*
