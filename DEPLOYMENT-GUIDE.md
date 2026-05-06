# 🚀 StoreKit — Complete Deployment & Launch Guide

## 📋 Project Completeness Assessment

### ✅ What's Complete (Production-Ready)

| Feature | Status | Details |
|---------|--------|---------|
| **Next.js App Router** | ✅ Complete | v16.2.4 with full App Router structure |
| **Database Schema** | ✅ Complete | 15+ tables with Drizzle ORM (products, orders, collections, reviews, discounts, etc.) |
| **Auth System** | ✅ Complete | Clerk integration + custom HMAC admin auth |
| **Stripe Payments** | ✅ Complete | Checkout sessions, webhooks, order flow |
| **Admin Dashboard** | ✅ Complete | Products, collections, orders, customers, analytics, banners, testimonials, announcements |
| **Storefront Pages** | ✅ Complete | Home, collections, product detail, cart, checkout, account, wishlist, search |
| **Image Management** | ✅ Complete | Cloudinary integration with upload API |
| **Email System** | ✅ Complete | Resend integration with order confirmation/shipped/delivered templates |
| **Design System** | ✅ Complete | Luxury glass morphism, warm gold accent, 3-level glass tokens, motion system |
| **Dark Mode** | ✅ Complete | ThemeProvider + ThemeToggle with warm dark palette |
| **Motion/Animation** | ✅ Complete | Framer Motion primitives (FadeIn, StaggerContainer, ScrollReveal, PageTransition) |
| **Mobile Responsive** | ✅ Complete | Mobile menu, bottom nav, responsive grid |
| **SEO** | ✅ Complete | Metadata, sitemap, robots.txt |
| **Accessibility** | ✅ Complete | Skip-to-content, focus rings, reduced motion, ARIA labels |
| **Newsletter** | ✅ Complete | Subscription with DB storage |
| **Discount Codes** | ✅ Complete | Percentage, fixed, free shipping types |
| **Product Reviews** | ✅ Complete | With verified purchase badges |
| **Middleware** | ✅ Complete | Route protection for checkout/account/admin |

### ⚠️ What Needs Work Before Launch

| Area | Priority | Effort | Details |
|------|----------|--------|---------|
| **Build Verification** | P0 | 1hr | Run `pnpm build` and fix any TypeScript/build errors |
| **Seed Data** | P0 | 2hr | Create seed script with sample products, collections, banners |
| **Environment Variables** | P0 | 1hr | Set up all production API keys (see checklist below) |
| **Database Migration** | P0 | 1hr | Run all 5 migrations on production Supabase |
| **Stripe Webhook Endpoint** | P0 | 30min | Configure webhook in Stripe dashboard pointing to production URL |
| **Domain & SSL** | P1 | 1hr | Custom domain setup on Vercel |
| **Email Domain Verification** | P1 | 30min | Verify sending domain in Resend |
| **Rate Limiting** | P1 | 2hr | Add rate limiting to API routes (currently only login has it) |
| **Error Monitoring** | P1 | 1hr | Add Sentry or similar for production error tracking |
| **Analytics** | P2 | 1hr | Add Google Analytics or Vercel Analytics |
| **Performance Audit** | P2 | 2hr | Lighthouse audit, optimize images, lazy loading |
| **Legal Pages** | P2 | 2hr | Privacy policy, terms of service, refund policy pages |
| **Testing** | P2 | 4hr | E2E tests for critical flows (checkout, auth, admin) |

---

## 🔧 Step-by-Step Deployment (Vercel — Recommended)

### Step 1: Prepare Your Codebase

```bash
# 1. Navigate to the project
cd storekit

# 2. Install dependencies
pnpm install

# 3. Run a production build to catch errors
pnpm build

# 4. Fix any build errors before proceeding
```

### Step 2: Set Up Supabase (Database)

1. **Create a Supabase project** at [supabase.com](https://supabase.com)
   - Choose a region close to your target audience
   - Save the project URL and keys

2. **Get your connection string**
   - Go to Project Settings → Database → Connection string
   - Copy the PostgreSQL connection string (URI format)

3. **Run database migrations**
   ```bash
   # Set DATABASE_URL in .env.local
   # Then run migrations using drizzle-kit
   pnpm drizzle-kit push
   ```
   
   Or manually run the SQL migrations in order from `supabase/migrations/`:
   - `00001_initial.sql`
   - `00002_security_and_webhooks.sql`
   - `00003_reviews_and_discounts.sql`
   - `00004_schema_alignment.sql`
   - `00005_content_timestamps.sql`

4. **Seed initial data** — Create a `store_config` row at minimum:
   ```sql
   INSERT INTO store_config (name, description, primary_color, accent_color, currency, shipping_cost, tax_rate)
   VALUES ('Your Store Name', 'Your store description', '#000000', '#C8A96E', 'USD', 0, '0.0000');
   ```

### Step 3: Set Up Clerk (Authentication)

1. **Create a Clerk application** at [clerk.com](https://clerk.com)
   - Enable Email/Password sign-in
   - Configure sign-in/sign-up URLs: `/sign-in` and `/sign-up`

2. **Get your API keys**
   - Copy `Publishable Key` (starts with `pk_test_`)
   - Copy `Secret Key` (starts with `sk_test_`)

3. **Configure allowed origins**
   - Add your production domain (e.g., `yourdomain.com`)

### Step 4: Set Up Stripe (Payments)

1. **Create a Stripe account** at [stripe.com](https://stripe.com)

2. **Get API keys**
   - Copy `Publishable Key` (starts with `pk_test_` or `pk_live_`)
   - Copy `Secret Key` (starts with `sk_test_` or `sk_live_`)

3. **Configure webhook endpoint**
   - Go to Developers → Webhooks → Add endpoint
   - URL: `https://yourdomain.com/api/webhooks/stripe`
   - Events to listen for:
     - `checkout.session.completed`
     - `checkout.session.expired`
     - `payment_intent.payment_failed`
   - Copy the `Signing secret` (starts with `whsec_`)

4. **Switch to live mode** when ready for real payments
   - Replace test keys with live keys
   - Update webhook endpoint for live mode

### Step 5: Set Up Cloudinary (Image Hosting)

1. **Create a Cloudinary account** at [cloudinary.com](https://cloudinary.com)

2. **Get your credentials**
   - Cloud name (from dashboard)
   - API Key
   - API Secret

3. **Create an upload preset**
   - Go to Settings → Upload → Upload presets
   - Add an **unsigned** preset named e.g., `storekit_uploads`
   - Set folder to `products`

### Step 6: Set Up Resend (Email)

1. **Create a Resend account** at [resend.com](https://resend.com)

2. **Verify your sending domain**
   - Go to Domains → Add Domain
   - Add the required DNS records to your domain
   - Wait for verification

3. **Get your API key**
   - Copy the API key (starts with `re_`)

### Step 7: Deploy to Vercel

1. **Push code to GitHub**
   ```bash
   cd storekit
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/storekit.git
   git push -u origin main
   ```

2. **Import project in Vercel**
   - Go to [vercel.com](https://vercel.com) → New Project
   - Import from GitHub
   - Select the `storekit` repository
   - Framework preset: **Next.js**
   - Root directory: `storekit` (if monorepo)
   - Build command: `pnpm build`
   - Output directory: `.next`

3. **Add environment variables** in Vercel dashboard:

   ```
   # Clerk
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...
   CLERK_SECRET_KEY=sk_live_...
   NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
   NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

   # Supabase
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ_...
   SUPABASE_SERVICE_ROLE_KEY=eyJ_...
   DATABASE_URL=postgresql://postgres:...@db.your-project.supabase.co:5432/postgres

   # Stripe (use LIVE keys for production)
   STRIPE_SECRET_KEY=sk_live_...
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
   STRIPE_WEBHOOK_SECRET=whsec_...

   # Cloudinary
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=...
   CLOUDINARY_API_SECRET=...
   CLOUDINARY_UPLOAD_PRESET=storekit_uploads

   # Resend
   RESEND_API_KEY=re_...
   EMAIL_FROM=noreply@yourdomain.com

   # Admin
   ADMIN_PASSWORD=YourStrongPassword!2024#Min12
   ADMIN_SECRET=your-hmac-secret-min-16-chars
   CRON_SECRET=your-cron-secret

   # App
   NEXT_PUBLIC_APP_URL=https://yourdomain.com
   ```

4. **Deploy**
   - Click "Deploy" and wait for the build to complete
   - Vercel will provide a preview URL

5. **Configure custom domain**
   - Go to Project Settings → Domains
   - Add your custom domain
   - Update DNS records as instructed

### Step 8: Post-Deployment Verification

Run through this checklist after deployment:

- [ ] Homepage loads with hero section and animations
- [ ] Dark mode toggle works
- [ ] Sign in / Sign up works (Clerk)
- [ ] Browse collections page
- [ ] Product detail page loads
- [ ] Add to cart works
- [ ] Cart drawer opens with items
- [ ] Checkout flow completes (test with Stripe test card `4242 4242 4242 4242`)
- [ ] Order confirmation email received
- [ ] Admin login works at `/admin/login`
- [ ] Admin dashboard loads
- [ ] Can create/edit products in admin
- [ ] Can upload images (Cloudinary)
- [ ] Search returns results
- [ ] Mobile responsive layout works
- [ ] Newsletter subscription works
- [ ] 404 page works for invalid routes

---

## 💰 Preparing to Sell (As a Template/Product)

If you want to sell StoreKit as a premium e-commerce template:

### 1. Code Cleanup & Polish

```bash
# Remove development artifacts
rm -f fix-entities.ps1 fix-entities.mjs fix-entities.cjs
rm -f FIXES.md

# Clean up any hardcoded test data
# Ensure all fallback images use proper placeholder services
```

### 2. Create Compelling Documentation

- [ ] **README.md** — Screenshot, features list, quick start guide, tech stack
- [ ] **DEMO.md** — Link to live demo, demo admin credentials
- [ ] **CUSTOMIZATION.md** — How to customize colors, fonts, branding
- [ ] **API.md** — API endpoint documentation

### 3. Add Demo/Seed Data

Create `supabase/seed.sql` with:
- 3-5 collections with beautiful images
- 12-20 products across collections
- 3-5 hero banners
- 5-10 testimonials
- 1 active announcement
- Store config with demo branding

### 4. Create a Live Demo

1. Deploy a separate instance with seed data
2. Set up demo admin credentials (read-only or limited)
3. Use Stripe test mode for checkout demo
4. Add a "Buy This Template" banner on the demo

### 5. Marketplace Preparation

**For selling on ThemeForest/Creative Market:**

- [ ] Create preview images (1920×1080 screenshots)
- [ ] Record a demo video walkthrough (2-3 minutes)
- [ ] Write detailed item description
- [ ] Include installation documentation
- [ ] Set up a support channel (Discord/email)
- [ ] Price competitively ($49-$149 for premium Next.js templates)

**For selling as a SaaS/starter kit:**

- [ ] Set up a landing page with pricing
- [ ] Create a Gumroad/LemonSqueezy store
- [ ] Offer license tiers (Single, Multi, Extended)
- [ ] Include 6 months of support
- [ ] Provide update changelog

### 6. License Considerations

Create a `LICENSE.md` file specifying:
- **Single License**: Use on one personal/commercial project
- **Multi License**: Use on up to 5 projects
- **Extended License**: Unlimited projects + priority support
- Prohibit redistribution of the source code

---

## 🔒 Production Security Checklist

- [ ] All API keys are production keys (not test keys)
- [ ] `ADMIN_PASSWORD` is strong (12+ chars, mixed case, numbers, symbols)
- [ ] `ADMIN_SECRET` is a random 32+ char string
- [ ] Stripe webhook secret matches production webhook
- [ ] `.env.local` is in `.gitignore` (never committed)
- [ ] Supabase RLS policies are enabled (from migration 00002)
- [ ] Server action origins restricted to production domain
- [ ] Rate limiting on auth endpoints
- [ ] CORS headers properly configured
- [ ] No `console.log` statements in production code
- [ ] Error messages don't leak sensitive info

---

## 📊 Performance Optimization (Post-Launch)

1. **Enable Vercel Analytics**
   ```bash
   pnpm add @vercel/analytics
   ```
   Add `<Analytics />` to root layout.

2. **Image Optimization**
   - All images served via Cloudinary with `q_auto,f_auto`
   - Use `sizes` prop on all `<Image>` components
   - Lazy load below-fold images

3. **Bundle Analysis**
   ```bash
   ANALYZE=true pnpm build
   ```

4. **Core Web Vitals Targets**
   - LCP < 2.5s
   - FID < 100ms
   - CLS < 0.1

---

## 🔄 Ongoing Maintenance

| Task | Frequency |
|------|-----------|
| Update npm dependencies | Monthly |
| Review Stripe webhook logs | Weekly |
| Check Supabase backups | Weekly |
| Monitor error tracking | Daily |
| Review analytics | Weekly |
| Update product inventory | As needed |
| Rotate API keys | Quarterly |

---

## 🆘 Troubleshooting Common Issues

### Build Fails
```bash
# Clear Next.js cache
rm -rf .next
pnpm build
```

### Database Connection Errors
- Verify `DATABASE_URL` format: `postgresql://postgres:PASSWORD@db.PROJECT_REF.supabase.co:5432/postgres`
- Check Supabase project is not paused

### Stripe Webhook Not Working
- Verify endpoint URL is accessible (not localhost)
- Check webhook signing secret matches
- Review Stripe dashboard → Webhooks → Events for errors

### Clerk Auth Issues
- Verify `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` matches the environment
- Check allowed origins in Clerk dashboard
- Ensure middleware is properly configured

### Images Not Loading
- Verify Cloudinary cloud name is correct
- Check `next.config.ts` has Cloudinary hostname in `remotePatterns`
- Ensure upload preset is set to **unsigned**

### Admin Login Fails
- Check `ADMIN_PASSWORD` and `ADMIN_SECRET` are set
- Clear browser cookies and try again
- Verify the admin auth API route is working

---

## 📁 Quick Reference: Key URLs

| Page | URL |
|------|-----|
| Homepage | `/` |
| Collections | `/collections` |
| Product Detail | `/products/[id]` |
| Cart | `/cart` |
| Checkout | `/checkout` |
| Sign In | `/sign-in` |
| Sign Up | `/sign-up` |
| Account | `/account` |
| Orders | `/account/orders` |
| Wishlist | `/account/wishlist` |
| Search | `/search?q=...` |
| Admin Login | `/admin/login` |
| Admin Dashboard | `/admin` |
| Admin Products | `/admin/products` |
| Admin Collections | `/admin/collections` |
| Admin Orders | `/admin/orders` |
| Admin Analytics | `/admin/analytics` |
| API Webhooks | `/api/webhooks/stripe` |
