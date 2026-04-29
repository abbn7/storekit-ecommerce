# Deployment Plan

## Target Runtime
- Platform: Vercel (recommended for Next.js App Router deployment).
- Build command: `pnpm build`
- Start command: `pnpm start`

## Environment Variables
- Required: Clerk, Supabase, Stripe, Cloudinary, Resend, admin password/session settings.
- Keep secrets only in deployment environment settings, never in client bundle.

## Deployment Steps
1. Ensure branch includes synchronized spec-kit and code updates.
2. Run `pnpm build` and confirm success.
3. Deploy preview and validate critical user journeys.
4. Promote to production after verification checks pass.

## Rollback Strategy
- Keep previous successful deployment alias ready.
- Roll back to previous deployment if checkout/admin auth regressions appear.
- Use verification report to identify impacted areas before re-release.
