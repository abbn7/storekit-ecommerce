# Navigation and Dashboard Access

## Problem
Admin dashboard route exists, but discoverability is weak from storefront navigation. The current "Admin" link in the navbar is styled identically to other nav links, making it indistinguishable and easy to miss. There is no dashboard access point in the footer or a clear visual indicator.

## Access Design
- Keep admin auth boundary unchanged (HMAC cookie + middleware).
- Provide explicit, visually distinct entry to admin login from storefront navigation.
- Add dashboard access in Footer (under brand section).
- Add dashboard access in Mobile Menu (properly styled).
- Admin login page must reflect luxury brand identity with glass/iOS design.

## Navigation Structure

### Desktop Navbar
```
┌─────────────────────────────────────────────────────────┐
│ ☰ Collections  New Arrivals     MAISON    🔍 ❤️ 👤 🛒  │
│                                [Dashboard icon button]  │
└─────────────────────────────────────────────────────────┘
```
- Dashboard entry: small icon button (LayoutDashboard icon) positioned after account icon.
- Subtle but discoverable — uses muted styling that becomes visible on hover.
- Tooltip on hover: "Dashboard".

### Mobile Menu
```
┌──────────────┐
│ MAISON    ✕  │
├──────────────┤
│ Collections  │
│ New Arrivals │
│ Search       │
│              │
│ ──────────── │
│ My Account   │
│ Wishlist     │
│ Orders       │
│              │
│ ──────────── │
│ ⬡ Dashboard  │  ← New section with icon
└──────────────┘
```

### Footer
```
┌─────────────────────────────────────────┐
│ MAISON          Shop       Service      │
│ Curated...      Coll.     Contact      │
│                  New        FAQ         │
│ [Dashboard →]   About      Shipping    │
└─────────────────────────────────────────┘
```
- Dashboard link placed under brand description with arrow indicator.

## Admin Login Page Redesign
- Full-screen glass panel with brand logo.
- Centered card with glass Level 3 treatment.
- Animated entrance (scale + fade).
- Password input with premium styling.
- Error states with smooth transitions.
- "MAISON" branding consistent with storefront.

## UX Rules
- Entry should be visible but not intrusive to shoppers.
- Same access path should exist on desktop and mobile menus.
- If unauthenticated admin user visits admin routes, redirect to `/admin/login` with target context.
- After successful login, redirect to originally requested admin page (or dashboard).
- Admin sidebar must use glass treatment consistent with storefront.

## Validation
- Verify discoverability from home page on desktop and mobile.
- Verify login success redirects to dashboard.
- Verify invalid/expired admin token returns to login cleanly.
- Verify dashboard link exists in Navbar, Footer, and Mobile Menu.
- Verify admin login page has glass/iOS design treatment.
