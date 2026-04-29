# StoreKit Audit Gap Analysis

## Current State Summary
- Next.js App Router structure is cleanly separated by storefront, auth, and admin areas.
- Backend has modular query files and an API response envelope.
- Core integrations are present and wired (Stripe, Clerk, Supabase, Cloudinary, Resend).
- Visual foundation is strong but inconsistent in implementation details.

## Gap Matrix

| Area | Current | Gap | Risk | Priority |
|---|---|---|---|---|
| Dashboard discoverability | `/admin` redirect exists | Storefront navigation does not expose admin entry clearly | Operational confusion | P0 |
| Frontend token discipline | Semantic tokens exist | Hardcoded color/surface classes still widespread | Visual inconsistency | P0 |
| Motion system | Mixed CSS animations + transition timings | No single motion scale or reduced-motion policy | UX inconsistency/accessibility | P0 |
| API contract governance | Response envelope exists | No formal OpenAPI contract in repo | Integration drift | P1 |
| Orders auth invariants | Session-id public read + admin read logic | Route behavior can be ambiguous without strict contract | Security/maintainability | P0 |
| Pagination guards | Pagination implemented in several routes | Missing global caps and consistent policy | Performance and abuse risk | P1 |
| Admin frontend data layer | Works with direct fetch in many pages | Repeated loading/error logic, weak type reuse | Maintenance cost | P1 |
| DB documentation | Drizzle schema exists | Missing centralized schema/ERD policy docs | Change risk | P1 |

## External Benchmark Signals (Similar Projects)
- Mature starters emphasize typed API contracts and consistent architecture docs.
- Premium storefronts standardize motion timings and use token-first design systems.
- Production-grade e-commerce templates prioritize strict auth boundaries and explicit pagination caps.

## Product-Level Recommendations
1. Formalize full spec-kit documentation before broad refactor.
2. Prioritize frontend system hardening (tokens, motion, glass/iOS patterns) with no business logic changes.
3. Fix dashboard discoverability without adding new business features.
4. Harden API and data contracts before scaling implementation changes.

## Phase 1 Exit Criteria
- Baseline requirements document created.
- Gap analysis with priorities created.
- Risks and priorities aligned to subsequent phases.
