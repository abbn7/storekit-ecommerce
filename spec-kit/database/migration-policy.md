# Migration Policy

## Principles
- Schema changes must be additive-first where possible.
- Every migration must include rollback considerations.
- Drizzle schema and SQL migrations must stay synchronized.

## Required Steps Per Migration
1. Update schema definitions in `src/lib/db/schema.ts`.
2. Generate migration and review SQL for constraints/indexes/nullability.
3. Validate compatibility with existing API contracts and query modules.
4. Test migration on staging-like database before production rollout.
5. Document impact in spec-kit database docs.

## Safety Rules
- Never drop columns/tables in same release as consumer code rollout without backward strategy.
- For high-risk changes, deploy in two-step migration pattern (expand then contract).
- Maintain data repair scripts for rollback scenarios where needed.
