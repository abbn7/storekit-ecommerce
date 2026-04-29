# Folder Structure Standard

## Target Structure
```text
spec-kit/
  requirements.md
  audit-gap-analysis.md
  quality-attributes.md
  architecture.md
  interfaces.md
  naming-conventions.md
  folder-structure.md
  api/
    openapi.yaml
  database/
    schema.md
    erd.md
    migration-policy.md
  frontend/
    design-system.md
    motion-guidelines.md
    theming-strategy.md
    navigation-access.md
  tasks-roadmap.md
  deployment.md
  verification-report.md
```

## Source Structure Ownership
- `src/app`: routes, layouts, page-level orchestration.
- `src/components`: reusable UI/presentation components.
- `src/lib`: shared runtime and integration logic.
- `src/lib/db`: schema and query layer.
- `src/types`: shared type contracts.
- `src/stores`: client state containers.
- `src/hooks`: reusable client hooks.

## Structural Rules
- Business logic should not be embedded in leaf UI presentation components.
- Route handlers must not leak DB schema details directly to UI.
- New reusable logic should be placed in `lib`, `hooks`, or `components/ui` based on responsibility.
