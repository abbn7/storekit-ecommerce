# Frontend Design System (Glass + iOS Luxury)

## Visual Direction
- Premium minimal storefront with soft glass layers, high readability, and restrained contrast.
- iOS-inspired frosted glass navigation, large titles, and generous whitespace.
- Keep existing brand tone while enforcing semantic token usage across ALL components.
- Every surface must use a defined elevation level — no hardcoded white/black backgrounds.

## Color Philosophy

### Primary Palette
| Token | Light | Dark | Usage |
|-------|-------|------|-------|
| `--brand` | `0 0% 4%` (Deep Noir) | `0 0% 98%` (Warm White) | Primary brand color |
| `--brand-foreground` | `0 0% 98%` | `0 0% 4%` | Text on brand |
| `--accent` | `40 60% 50%` (Rich Gold) | `40 60% 60%` (Lighter Gold) | Accent highlights |
| `--accent-foreground` | `0 0% 4%` | `0 0% 98%` | Text on accent |

### Accent Gradient
| Token | Value | Usage |
|-------|-------|-------|
| `--accent-gradient` | `linear-gradient(135deg, hsl(35 70% 55%), hsl(45 55% 45%))` | Premium accent surfaces |
| `--accent-gradient-subtle` | `linear-gradient(135deg, hsl(35 70% 55% / 0.15), hsl(45 55% 45% / 0.05))` | Subtle accent backgrounds |

### Surface Hierarchy (4 Levels)
| Level | Token | Light | Dark | Usage |
|-------|-------|-------|------|-------|
| Base | `--surface-1` | `0 0% 100%` | `0 0% 4%` | Page background |
| Raised | `--surface-2` | `0 0% 98%` | `0 0% 7%` | Cards, sections |
| Overlay | `--surface-3` | `0 0% 94%` | `0 0% 14%` | Elevated panels |
| Modal | `--surface-4` | `0 0% 100%` | `0 0% 10%` | Modals, dialogs |

### Text Hierarchy (3 Levels)
| Level | Token | Light | Dark | Usage |
|-------|-------|-------|------|-------|
| Primary | `--text-primary` | `0 0% 4%` | `0 0% 98%` | Headlines, body |
| Secondary | `--text-secondary` | `0 0% 40%` | `0 0% 64%` | Descriptions, captions |
| Muted | `--text-muted` | `0 0% 64%` | `0 0% 40%` | Placeholders, hints |

### Status Colors
| Status | Token | Light | Usage |
|--------|-------|-------|-------|
| Success | `--success` | `142 76% 36%` | Confirmations, stock available |
| Warning | `--warning` | `38 92% 50%` | Low stock, alerts |
| Destructive | `--destructive` | `0 84% 60%` | Errors, out of stock, sale badges |

## Glass Morphism System (3 Levels)

### Level 1 — Subtle (Navigation bars, subtle overlays)
```css
--glass-bg: 0 0% 100% / 0.6;
--glass-blur: 12px;
--glass-border: 0 0% 100% / 0.3;
--glass-shadow: 0 4px 16px hsl(0 0% 4% / 0.06);
```

### Level 2 — Standard (Cards, panels, drawers)
```css
--glass-bg-strong: 0 0% 100% / 0.74;
--glass-blur-strong: 18px;
--glass-border: 0 0% 100% / 0.45;
--glass-shadow: 0 14px 40px hsl(0 0% 4% / 0.12);
```

### Level 3 — Strong (Modals, search overlay, login)
```css
--glass-bg-heavy: 0 0% 100% / 0.9;
--glass-blur-heavy: 24px;
--glass-border: 0 0% 100% / 0.6;
--glass-shadow: 0 18px 48px hsl(0 0% 4% / 0.16);
```

### Dark Mode Glass
```css
--glass-bg: 0 0% 7% / 0.7;
--glass-bg-strong: 0 0% 7% / 0.85;
--glass-bg-heavy: 0 0% 10% / 0.92;
--glass-border: 0 0% 98% / 0.12;
```

## Typography Scale

### Font Families
| Token | Font | Usage |
|-------|------|-------|
| `--font-heading` | Cormorant Garamond | Headlines, section titles |
| `--font-body` | Inter | Body text, UI elements |
| `--font-display` | Bebas Neue | Marquee, large display text |

### Type Scale
| Element | Size | Weight | Tracking | Font |
|---------|------|--------|----------|------|
| Display | 5xl-7xl | Light (300) | Wide (0.15-0.2em) | Heading |
| H1 | 4xl-5xl | Light (300) | Wide (0.1em) | Heading |
| H2 | 3xl-4xl | Light (300) | Wide | Heading |
| H3 | 2xl | Light (300) | Normal | Heading |
| Body | sm-base | Regular (400) | Normal | Body |
| Caption | xs | Medium (500) | Wide (0.1em) | Body |
| Overline | xs | Medium (500) | Widest (0.2em) | Body, uppercase |

## Component Policy

### Navigation Surfaces
- Navbar, Mobile Menu, Cart Drawer, Search Overlay share glass treatment model.
- Navbar uses Level 1 glass when scrolled, transparent at top.
- Cart Drawer and Mobile Menu use Level 2 glass.
- Search Overlay uses Level 3 glass.

### Cards and Panels
- Product cards: solid surface-1 with glass hover overlay.
- Collection cards: image with glass text overlay at bottom.
- Testimonial cards: glass Level 2 background.
- Account cards: glass Level 1 with border.
- Admin dashboard cards: glass Level 1 with subtle shadow.

### Buttons and Badges
- Buttons remain variant-based with token-driven palettes.
- Primary buttons: brand color with accent hover.
- Accent buttons: gold gradient for premium CTAs.
- Badges: semantic colors (destructive for sale, secondary for new).

### Interactive States
- Hover: scale(1.02) + shadow elevation + accent color shift.
- Active/Pressed: scale(0.98).
- Focus: ring with accent color.
- Disabled: opacity 0.5, cursor-not-allowed.

## Spacing System
- Section padding: `py-20 lg:py-28` (major sections).
- Container: `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`.
- Card padding: `p-6 lg:p-8`.
- Element gaps: `gap-4` (tight), `gap-6` (standard), `gap-8 lg:gap-12` (generous).

## Border Radius
| Token | Value | Usage |
|-------|-------|-------|
| `--radius-sm` | 6px | Small elements, badges |
| `--radius-md` | 8px | Inputs, buttons |
| `--radius-lg` | 10px | Cards, panels |
| `--radius-xl` | 14px | Modals, overlays |
| `--radius-2xl` | 20px | Large glass panels |
| `--radius-full` | 9999px | Pills, avatars |

## Accessibility
- Maintain WCAG AA contrast targets (4.5:1 for text, 3:1 for large text).
- Ensure visual effects (blur/transparency) do not reduce legibility.
- Glass backgrounds must have sufficient opacity for text readability.
- Focus states must be visible and use accent color ring.
- All interactive elements must have proper aria labels.
