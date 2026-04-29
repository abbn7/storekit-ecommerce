# Naming Conventions

## Files and Directories
- Components: `PascalCase.tsx` (example: `ProductCard.tsx`).
- Utilities/hooks/stores/types: `camelCase.ts` (example: `useStoreConfig.ts`).
- Route folders and URL segments: lowercase kebab or Next dynamic folder syntax.

## Symbols
- React components: `PascalCase`.
- Functions/variables: `camelCase`.
- Constants: `UPPER_SNAKE_CASE` for stable compile-time constants.
- Types/interfaces: `PascalCase`.

## API and Data Naming
- Frontend/API DTO fields: `camelCase`.
- Database columns/tables: `snake_case`.
- Never mix naming styles inside a single DTO.

## CSS/Tokens
- CSS custom properties: kebab case prefixed by semantic scope (example: `--color-primary`, `--glass-bg`).
- Utility classes should reference semantic tokens over hardcoded colors.
