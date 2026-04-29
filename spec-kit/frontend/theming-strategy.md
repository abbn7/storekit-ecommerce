# Theming Strategy

## Objective
Bridge persisted store configuration values into runtime CSS variables without breaking current styling. Extend the token system to support Glass + iOS Luxury design with professional color engineering.

## Strategy
1. Keep semantic defaults in `globals.css` as the single source of truth.
2. Read store config at app shell level.
3. Inject runtime CSS variables for brand/accent safely.
4. Map components to semantic tokens, not direct config values.
5. All new tokens (gradients, glass levels, surface elevations) follow the same pattern.

## Token Architecture

### Layer 1: Primitive Tokens (HSL values)
```css
:root {
  --brand: 0 0% 4%;
  --accent: 40 60% 50%;
  --surface-1: 0 0% 100%;
  /* ... */
}
```

### Layer 2: Semantic Tokens (mapped from primitives)
```css
@theme inline {
  --color-background: var(--surface-1);
  --color-foreground: var(--text-primary);
  --color-primary: var(--brand);
  --color-accent: var(--accent);
  /* ... */
}
```

### Layer 3: Component Tokens (composed from semantic)
```css
.glass-panel {
  background: hsl(var(--glass-bg));
  border: 1px solid hsl(var(--glass-border));
  backdrop-filter: blur(var(--glass-blur));
}
```

## New Token Additions

### Gradient Tokens
```css
:root {
  --accent-gradient-from: 35 70% 55%;
  --accent-gradient-to: 45 55% 45%;
}
```

### Surface Elevation Tokens
```css
:root {
  --surface-1: 0 0% 100%;  /* base */
  --surface-2: 0 0% 98%;   /* raised */
  --surface-3: 0 0% 94%;   /* overlay */
  --surface-4: 0 0% 100%;  /* modal */
}
.dark {
  --surface-1: 0 0% 4%;
  --surface-2: 0 0% 7%;
  --surface-3: 0 0% 14%;
  --surface-4: 0 0% 10%;
}
```

### Glass Level Tokens
```css
:root {
  /* Level 1: Subtle */
  --glass-bg: 0 0% 100% / 0.6;
  --glass-blur: 12px;
  /* Level 2: Standard */
  --glass-bg-strong: 0 0% 100% / 0.74;
  --glass-blur-strong: 18px;
  /* Level 3: Heavy */
  --glass-bg-heavy: 0 0% 100% / 0.9;
  --glass-blur-heavy: 24px;
}
```

### Motion Tokens (CSS-side, for non-Framer transitions)
```css
:root {
  --motion-instant: 100ms;
  --motion-fast: 150ms;
  --motion-base: 300ms;
  --motion-slow: 500ms;
  --motion-dramatic: 800ms;
  --ease-standard: cubic-bezier(0.2, 0, 0, 1);
  --ease-emphasized: cubic-bezier(0.2, 0.8, 0.2, 1);
  --ease-decelerate: cubic-bezier(0, 0, 0, 1);
  --ease-accelerate: cubic-bezier(0.3, 0, 1, 1);
}
```

## Guardrails
- Runtime colors must pass minimum contrast checks for text/surfaces.
- If store config is missing or invalid, fallback to defaults.
- Do not expose sensitive admin settings to client beyond required visual tokens.
- Glass backgrounds must always have sufficient opacity for text readability.
- Dark mode tokens must be defined for EVERY light mode token — no gaps.
- Gradient tokens must work in both light and dark modes.

## Migration Path
1. Add new tokens to `globals.css` without removing existing ones.
2. Update `@theme inline` block to map new tokens to Tailwind utilities.
3. Gradually replace hardcoded values in components with token references.
4. Test dark mode after each component migration.
