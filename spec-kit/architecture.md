# Architecture

## System Context
StoreKit is a full-stack Next.js product with two UI surfaces (storefront/admin), route-handler APIs, a Drizzle query layer, Postgres storage, and external commerce integrations. The frontend follows a Glass + iOS Luxury design language powered by Framer Motion animations.

## Module Boundaries
- `src/app/(store)`: storefront pages and customer journeys.
- `src/app/admin`: admin pages and operations console.
- `src/app/api`: HTTP contracts and orchestration.
- `src/lib/db/queries`: data access and SQL composition.
- `src/lib/motion`: shared animation primitives, variants, and wrappers (Framer Motion).
- `src/lib/*`: auth, config, integrations, utilities.
- `src/components/store`: storefront presentation components.
- `src/components/admin`: admin presentation components.
- `src/components/ui`: shared UI primitives (shadcn/ui).
- `src/stores/*`: Zustand state management (cart, wishlist, UI).
- `src/hooks/*`: custom React hooks.
- `src/types/*`: TypeScript type definitions.

## Runtime Flow
1. UI requests data via route handlers.
2. Route handlers validate/authenticate and call query modules.
3. Query modules read/write Postgres using Drizzle.
4. Integration libraries handle Stripe, Clerk, Cloudinary, Resend.
5. Framer Motion handles all animation orchestration client-side.
6. Design tokens in `globals.css` drive all visual properties.

## Animation Architecture
```
┌─────────────────────────────────────────────┐
│  Page Transition (AnimatePresence)          │
│  ┌───────────────────────────────────────┐  │
│  │  ScrollReveal (useInView)             │  │
│  │  ┌─────────────────────────────────┐  │  │
│  │  │  StaggerContainer               │  │  │
│  │  │  ┌──────┐ ┌──────┐ ┌──────┐    │  │  │
│  │  │  │Item 1│ │Item 2│ │Item 3│    │  │  │
│  │  │  └──────┘ └──────┘ └──────┘    │  │  │
│  │  └─────────────────────────────────┘  │  │
│  └───────────────────────────────────────┘  │
└─────────────────────────────────────────────┘
```

### Animation Module Structure (`src/lib/motion/`)
- `variants.ts`: Shared Framer Motion variant definitions (fade, slide, scale, stagger).
- `MotionWrapper.tsx`: Generic wrapper with enter/exit animations.
- `FadeIn.tsx`: Simple fade-in with optional direction.
- `StaggerContainer.tsx`: Parent container that staggers children.
- `StaggerItem.tsx`: Child item with stagger delay.
- `ScrollReveal.tsx`: Viewport-triggered animation using `useInView`.
- `PageTransition.tsx`: Route transition wrapper using `AnimatePresence`.

## Design Token Architecture
```
globals.css (source of truth)
├── :root (light mode tokens)
│   ├── Brand colors (primary, accent, gradient)
│   ├── Surface hierarchy (4 levels)
│   ├── Glass morphism (3 levels)
│   ├── Text hierarchy (3 levels)
│   ├── Status colors (success, warning, destructive)
│   ├── Motion tokens (duration, easing)
│   └── Radius tokens
├── .dark (dark mode overrides)
└── @theme inline (Tailwind v4 mapping)
```

## Scalability Principles
- Keep request orchestration at route boundary only.
- Keep DB access in query modules, not UI components.
- Keep styling system token-driven and globally centralized.
- Keep integration-specific logic isolated in dedicated libs.
- Keep animation logic in `src/lib/motion/`, not scattered in components.
- Keep component animations declarative via variants, not imperative.

## Auth Boundaries
- Storefront auth: Clerk for customer identity-protected routes.
- Admin auth: cookie-based admin session with server-side verification.
- Admin APIs must enforce auth independently even if middleware exists.

## Performance Guardrails
- Framer Motion: use `transform` and `opacity` only for animations (GPU-accelerated).
- Avoid animating `width`, `height`, `top`, `left` (causes layout thrashing).
- Use `will-change` sparingly and remove after animation.
- Lazy-load animation components below the fold.
- Respect `prefers-reduced-motion` globally.
