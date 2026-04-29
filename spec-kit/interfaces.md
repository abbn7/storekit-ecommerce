# Interfaces

## UI to API Interface
- All route handlers return envelope:
  - `data`: payload or `null`
  - `error`: string or `null`
  - `meta`: optional pagination metadata
- UI pages must consume typed response models and avoid ad-hoc parsing.

## API to Data-Access Interface
- Route handlers call query modules in `src/lib/db/queries/*`.
- Query modules return domain-shaped objects that are presentation-agnostic.
- Input validation occurs at API boundary before query calls.

## API to Integration Interface
- Stripe: checkout session creation and webhook event reconciliation.
- Clerk: customer authentication context for protected flows.
- Cloudinary: admin-controlled media upload path.
- Resend: transactional order email notifications.

## Cross-Module Contracts
- Naming contract:
  - API payload keys: camelCase at frontend boundary.
  - DB columns: snake_case as defined in schema.
- Conversion contract:
  - Mapping between snake_case and camelCase happens in query/API boundary, not in UI components.
- Error contract:
  - Route handlers return normalized error responses with actionable messages.
