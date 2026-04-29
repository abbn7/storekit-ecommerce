# StoreKit Requirements (Final v2)

## Product Overview
StoreKit is a white-label luxury e-commerce platform with a storefront and an admin dashboard. The product must be production-ready, modular, and maintainable while preserving existing business logic. The visual identity follows a Glass + iOS Luxury design language with premium animations.

## Product Goals
- Strengthen the existing product without feature creep.
- Transform frontend into a cohesive Glass + iOS-inspired luxury experience with professional color engineering.
- Implement Framer Motion animation system across all storefront surfaces (scroll reveal, page transitions, micro-interactions).
- Improve dashboard discoverability and operational reliability.
- Formalize contracts (API, data, module interfaces) using spec-kit artifacts.

## In-Scope Modules
- **Frontend**: storefront + admin UI + shared UI primitives + animation system + design tokens.
- **Backend**: route handlers and request orchestration (unchanged).
- **Database**: schema, relations, indexes, constraints (unchanged).
- **APIs**: public, admin, and webhook contracts (unchanged).
- **Integrations**: Clerk, Stripe, Supabase, Cloudinary, Resend (unchanged).

## Delivery Constraints
- No uncontrolled new features.
- Do not break checkout/order/admin business logic.
- Keep backward compatibility for existing core routes and flows.
- All changes must be documented before and during implementation.
- Framer Motion must be used for all animations (replacing CSS keyframes where applicable).
- All components must use semantic design tokens — no hardcoded colors.

## Functional Requirements

### Frontend (Storefront)
- Product and collection pages must remain navigable and responsive across mobile and desktop.
- Cart, checkout, and order-confirmation flows must preserve existing business logic and integrations.
- Search and account sections must keep behavior while receiving UI consistency improvements.
- Global visual language must be token-driven (color/surface/motion), not hardcoded per page.
- **All storefront components must use Glass + iOS design tokens consistently.**
- **Framer Motion must power all animations: scroll reveal, page transitions, stagger lists, micro-interactions.**
- **Color system must be professionally engineered with proper contrast ratios and gradient tokens.**
- **Dark mode must be fully consistent across all components.**

### Frontend (Admin)
- Admin entry must be clear and discoverable from storefront Navbar, Footer, and Mobile Menu.
- Dashboard, products, collections, orders, customers, content, and settings screens must remain functional.
- Shared admin UI states (loading/error/empty) must follow a unified pattern.
- Admin login page must reflect the luxury brand identity with glass/iOS design.
- Admin sidebar must use glass treatment consistent with storefront.

### Frontend (Animation System)
- `src/lib/motion/` module must contain shared animation primitives.
- `MotionWrapper`, `FadeIn`, `StaggerContainer`, `StaggerItem` components must be created.
- `ScrollReveal` component must replace CSS `.reveal` system.
- `PageTransition` component must wrap store layout for route transitions.
- Micro-interaction variants (hover, tap, focus) must be standardized.
- All animations must respect `prefers-reduced-motion`.

### Backend/APIs
- Public, admin, and webhook routes must keep stable contracts and standard envelope behavior.
- Input validation must be explicit and consistent with documented request schemas.
- Auth and authorization rules must be documented and enforced per endpoint.

### Database
- Existing entities and relationships must remain compatible with current production logic.
- Schema constraints, indexes, and migration behavior must be documented before structural changes.

### Integrations
- Stripe, Clerk, Supabase, Cloudinary, and Resend must remain operational with explicit interface contracts.

## Critical User Journeys
- Browse catalog and collections with smooth scroll animations.
- View product details and add to cart with micro-interaction feedback.
- Checkout via Stripe and view order confirmation with success animation.
- Access account and order history with glass card layouts.
- Admin login and dashboard entry with clear discoverability, then CRUD operations.
- Navigate between pages with smooth transitions.

## Baseline Risks To Address
- Dashboard entry discoverability from storefront navigation.
- Inconsistent token usage and motion patterns across frontend.
- Framer Motion installed but completely unused.
- Color system lacks depth, gradients, and professional engineering.
- No page transitions — navigation feels jarring for luxury brand.
- Sub-pages (About, Account, Cart) are visually flat with no glass treatment.
- API hardening gaps around auth invariants and pagination limits.
- Maintainability drift due to repeated fetch/error handling patterns.

## Acceptance Criteria
- A complete spec-kit set exists for requirements, architecture, API contract, data model, roadmap, and deployment.
- Frontend uses a coherent glass+iOS-inspired token and motion system across ALL storefront surfaces.
- Framer Motion powers all animations (scroll, page transitions, micro-interactions, overlays).
- Color system has gradient tokens, surface elevation tokens, and proper dark mode.
- Admin dashboard access path is clear and tested end-to-end.
- API and DB contracts are documented and aligned with implementation.
- Verification phase passes lint/build/runtime checks and critical user-flow checks.

## Success Metrics
- Admin entry path clarity: users can reliably discover and reach `/admin/login` from Navbar, Footer, and Mobile Menu.
- UI consistency: tokenized colors/surfaces and unified motion on ALL core pages.
- Animation coverage: Framer Motion used in 100% of animated components.
- Contract maturity: OpenAPI and database documentation completed.
- Reliability: lint/build pass and critical flow verification pass.
