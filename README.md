# StoreKit — White-Label Luxury E-Commerce Platform

A full-stack, white-label e-commerce platform built with Next.js 16, Tailwind v4, shadcn/ui, Supabase, Stripe, and Cloudinary. All brand data (name, colors, logo, etc.) comes from the database — zero hardcoded branding.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router, Server Components) |
| Styling | Tailwind CSS v4 + shadcn/ui |
| Database | Supabase Postgres + Drizzle ORM |
| Auth (Storefront) | Clerk |
| Auth (Admin) | Password-only cookie session |
| Payments | Stripe Checkout + Webhooks |
| Images | Cloudinary |
| Email | Resend + React Email |
| State | Zustand (persisted) |
| Deployment | Vercel |

## Features

### Storefront
- 🛍️ Product catalog with collections, filters, search
- 🛒 Cart with persistent state, free shipping bar
- 💳 Stripe Checkout integration
- ❤️ Wishlist with localStorage persistence
- 🔍 Instant search overlay
- 📱 Fully responsive with mobile menu
- ✨ Luxury UI: parallax hero, marquee, fade-up animations
- 📧 Order confirmation emails

### Admin Dashboard
- 📊 Analytics dashboard with stats cards
- 📦 Product CRUD with image upload
- 📁 Collection management
- 🛍️ Order management with status updates
- 🎨 Store settings: name, colors, logo, shipping, tax
- 📢 Content management: banners, announcements, testimonials
- 🔐 Password-protected admin panel

## Quick Start

### Prerequisites
- Node.js 18+
- pnpm 8+
- Supabase account
- Stripe account
- Cloudinary account
- Clerk account
- Resend account

### 1. Clone & Install

```bash
git clone <your-repo-url> storekit
cd storekit
pnpm install
```

### 2. Set Up Database

Create a new Supabase project, then run the migration SQL:

```bash
# Copy the migration file content and run it in Supabase SQL Editor
# File: supabase/migrations/00001_initial.sql
```

### 3. Configure Environment

```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your actual values:

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk publishable key |
| `CLERK_SECRET_KEY` | Clerk secret key |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key |
| `DATABASE_URL` | Postgres connection string |
| `STRIPE_SECRET_KEY` | Stripe secret key |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |
| `RESEND_API_KEY` | Resend API key |
| `ADMIN_PASSWORD` | Password for admin login |

### 4. Set Up Stripe

1. Create products and prices in Stripe Dashboard
2. Set up a webhook endpoint pointing to `/api/webhooks/stripe`
3. Subscribe to `checkout.session.completed` event
4. Copy the webhook signing secret to `STRIPE_WEBHOOK_SECRET`

### 5. Configure Cloudinary

1. Create a Cloudinary account
2. Copy your cloud name to `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`
3. Copy API key and secret

### 6. Deploy to Vercel

```bash
vercel --prod
```

Set all environment variables in Vercel Dashboard → Settings → Environment Variables.

## Development

```bash
# Start dev server
pnpm dev

# Build for production
pnpm build

# Run linting
pnpm lint
```

## Project Structure

```
src/
├── app/
│   ├── (store)/          # Storefront pages
│   │   ├── collections/
│   │   ├── products/
│   │   ├── cart/
│   │   ├── checkout/
│   │   ├── account/
│   │   └── search/
│   ├── (auth)/           # Auth pages (Clerk)
│   ├── admin/            # Admin dashboard
│   └── api/              # API routes
│       ├── admin/        # Admin CRUD
│       ├── webhooks/     # Stripe webhook
│       └── public/       # Public store API
├── components/
│   ├── store/            # Storefront components
│   └── ui/               # shadcn/ui primitives
├── lib/
│   ├── db/               # Drizzle schema + queries
│   ├── stripe.ts
│   ├── cloudinary.ts
│   ├── email.ts
│   ├── admin-auth.ts
│   └── utils.ts
├── stores/               # Zustand stores
├── hooks/                # Custom hooks
├── types/                # TypeScript interfaces
└── emails/               # React Email templates
```

## API Envelope

Every API route returns:

```json
{
  "data": <T | null>,
  "error": <string | null>,
  "meta": { "page": 1, "limit": 20, "total": 100, "total_pages": 5 }
}
```

## License

MIT
