# 🧠 CCCookies — Project Memory

> A living document. Updated after every session to capture architecture decisions, mistakes, fixes, and lessons learned.

---

## Table of Contents

- [Overview](#overview)
- [Architecture Decisions](#architecture-decisions)
- [Phases & Progress](#phases--progress)
- [Session Log](#session-log)
- [Problems & Solutions](#problems--solutions)
- [Security Notes](#security-notes)
- [Configuration Checklist](#configuration-checklist)

---

## Overview

**What:** E-commerce site for homemade eggless dark chocolate chip cookies.
**Stack:** Next.js 16 + Tailwind v4 + Supabase + (future: Stripe, Resend)
**Hosting:** Vercel (planned)
**Domain:** (none yet, will use `.vercel.app`)
**Email:** hmd.cookie@protonmail.com
**Repo:** https://github.com/hmd-cookie/CCCookies

---

## Architecture Decisions

### Why Supabase for DB + Auth over alternatives
- Free tier is generous
- Built-in Auth with magic links (no password management)
- Row Level Security (RLS) means the anon key is safe in the browser
- PostgreSQL — familiar, powerful, easy migrations

### Why packs live in the DB (not hardcoded)
- Owner can change prices/descriptions from `/admin/pricing` without developer
- A/B testing different pricing strategies later
- Disable a pack (`active = false`) without redeploying

### Why guest checkout (no customer accounts)
- Lower friction to purchase
- Simpler auth model (admin-only magic links)
- Customer tracks order via email + order ID (no password to forget)

### Why prices stored in cents (integer)
- Stripe convention — avoids floating point rounding errors
- Display: divide by 100 for dollars
- Consistent across entire stack (DB, API, Stripe)

### Color palette (chosen by user)
- `#FBF3EA` (cream), `#D4A574` (tan), `#A67C52` (hazelnut), warm browns

### Next.js 16 specifics
- `middleware.ts` → renamed to `proxy.ts` (v16 breaking change)
- `params` in route handlers is a Promise — must be awaited
- Turbopack is default compiler
- No `next lint` — use ESLint directly

### Shopping cart
- Zustand with `persist` middleware (localStorage)
- Hydration guard to prevent React SSR mismatch errors
- Supports multiple items by ID (e.g., different packs)

---

## Phases & Progress

| Phase | Status | What |
|-------|--------|------|
| Phase 1 | ✅ Done | Frontend — hero, cart, packs layout, GitHub push |
| Phase 2 | 🟡 Mostly done | Supabase backend, checkout, admin dashboard, order tracking |
| Phase 3 | ⬜ Pending | Stripe Checkout + webhooks + email confirmations |
| Phase 4 | ⬜ Pending | Security hardening |
| Phase 5 | ⬜ Pending | Launch — SEO, analytics, domain |

---

## Session Log

### Session 1 — Initial build
- Next.js 16 init, Tailwind v4, R3F, Zustand
- Procedural 3D cookie → replaced with static PNG (CCCookie.png)
- Hero section, warm theme, floating animation
- Full site layout (Navbar, Footer, 4 sections)
- Shopping cart with Zustand persist
- Hydration error fixes (Footer date, cart store)
- Pushed to GitHub

### Session 2 — 3-tier pricing
- Replaced single product ($4.99) with 3 packs (6/$14.99, 12/$27.99, 20/$39.99)
- Marketing positioning: 12-pack = "Most Popular", 20-pack = "Best Value"
- Per-cookie pricing shown, savings badges
- Hero CTA changed to "Order Now" (scrolls to packs)
- Pushed to GitHub

### Session 3 — Phase 2 backend
**Dependencies installed:** `@supabase/supabase-js`, `@supabase/ssr`, `stripe`, `@stripe/stripe-js`, `resend`

**Setup:**
- `.env.local` with Supabase URL, anon key, service role key, Resend API key
- 3 Supabase client utilities: `server.ts` (SSR), `client.ts` (browser), `admin.ts` (service role)

**Database schema:**
- `packs` — Managed via admin dashboard, `active` flag for toggling
- `orders` — Name, email, phone, address, delivery option, status
- `order_items` — Linked to orders, stores pack snapshots
- `profiles` — Linked to auth.users, `role` field (customer/admin)
- RLS policies on all tables (customers see own orders, admin sees all)

**API routes:**
- `GET /api/packs` — Public, returns active packs
- `POST /api/checkout` — Validates input, verifies prices against DB, creates order
- `POST /api/webhook` — Stripe webhook scaffold (Phase 3)
- `GET /api/orders` — Customer's orders (auth required)
- `GET /api/track` — Guest order tracking (email + order ID)
- `GET /api/admin/orders` — Admin: all orders with filters/search
- `PUT /api/admin/orders/[id]/status` — Admin: update order status
- `GET/PUT /api/admin/packs` — Admin: read/update packs

**Pages built:**
- `/checkout` — Customer info form, delivery options (pickup/free, Brampton/$3.99, GTA/$6.99), address fields
- `/order/success` — Order confirmation with copy-able order ID
- `/order/cancel` — Cancelled payment page
- `/track` — Enter email + order ID to see status timeline
- `/admin` — Magic link login
- `/admin/orders` — All orders table with status filter + search
- `/admin/orders/[id]` — Full order detail, status update buttons
- `/admin/pricing` — Edit pack name, price (in cents), description, active toggle

**Connections:**
- CartDrawer "Proceed to Checkout" → `/checkout`
- OrderSection fetches from `GET /api/packs`
- Navbar + Footer: "Track Order" link added

---

## Problems & Solutions

### 1. Hydration mismatch errors (Phase 1)
**Problem:** React hydration failed because:
- `new Date().getFullYear()` in Footer — server rendered one year, client another
- Zustand persist reads localStorage after first render, mismatching server state

**Solution:**
- Footer: Moved year to `useState` + `useEffect`
- Cart store: Added `hydrated` flag via `onRehydrateStorage` callback
- CartButton/CartDrawer: Guard UI behind `hydrated` flag

### 2. 3D cookie looked wrong (Phase 1)
**Problem:** Procedural R3F cookie model didn't look correct

**Solution:** Replaced with static PNG image (CCCookie.png, 896×896) with CSS animations:
- Floating animation (`@keyframes float`)
- Mouse-tilt hover effect (3D perspective transform)

### 3. TypeScript build errors (Phase 2)
**Problem 1:** `handleChange` in admin pricing page had type `(keyof Pack, string | number | boolean)` but `null` was passed for savings field.

**Fix:** Expanded type to accept `null`.

**Problem 2:** Import mismatch in `/api/packs/route.ts` — imported `{ createClient }` from admin module but the module exports `createAdminClient`.

**Fix:** Changed import to `{ createAdminClient }`.

### 4. Dev server didn't pick up new files (Phase 2)
**Problem:** After creating new pages (admin, checkout, etc.), visiting them returned 404. Next.js dev server caches route structure at startup.

**Fix:** Kill server (`kill $(lsof -ti :3000)`) and restart with `nohup npm run dev &`.

### 5. Background server process killed by shell timeout (Phase 2)
**Problem:** Starting dev server via bash tool with a timeout killed the server when the tool timed out (10s).

**Fix:** Use `nohup npm run dev > /tmp/nextdev.log 2>&1 &` to detach the process from the shell session.

### 6. Supabase magic link email rate limit (Phase 2, unresolved)
**Problem:** Supabase free tier has a rate limit on auth emails. Multiple test sign-ins triggered the limit.

**Current state:** Waiting for rate limit to reset (~1 hour) or configure SMTP.

**Solution (recommended):** Connect Resend SMTP in Supabase Dashboard → Authentication → Settings → SMTP. Use `smtp.resend.com` with the Resend API key.

### 7. Magic link redirects to homepage, not admin (Phase 2)
**Problem:** After clicking magic link, user landed on `/` (homepage) instead of admin dashboard.

**Fix:** Added `emailRedirectTo: ${window.location.origin}/admin/orders` to `signInWithOtp` options.

### 8. Packs display used hardcoded data after DB switch (Phase 2, potential)
**Risk:** The OrderSection previously imported hardcoded PACKS from constants.ts. After switching to API fetch, constants.ts was cleaned up but any old references would break.

**Fix:** Removed hardcoded PACKS array from constants.ts, kept only the `Pack` type export for type safety. OrderSection now fetches from `GET /api/packs`.

---

## Security Notes

### Key management
| Key | Exposure | How protected |
|-----|----------|---------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Public | Safe — just the project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public in browser | Safe — RLS is the real gatekeeper |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only | Never in client bundle (no `NEXT_PUBLIC_` prefix) |
| `RESEND_API_KEY` | Server-only | Never in client bundle |
| Future Stripe secret keys | Server-only | Never in client bundle |

### RLS Policies (defense in depth)
- `packs`: Public reads only active packs; only admin can write
- `orders`: Customers read only their own (by email match); admin reads all
- `order_items`: Inherits order-level RLS via subquery
- `profiles`: Users read only own profile; admin reads all

### API route protection
- Admin endpoints check `profiles.role = 'admin'` on every request
- Checkout validates prices server-side against DB (doesn't trust client)
- Guest tracking requires both order ID AND email to match

### Still to do (Phase 4)
- Rate limiting on checkout endpoint
- CSP headers in next.config.ts or proxy.ts
- Stripe webhook signature verification
- Input sanitization library

---

## Configuration Checklist

Items to configure whenever moving to a new environment (local → Vercel):

### Supabase Dashboard
- [ ] **URL Configuration** → Site URL, Redirect URLs
- [ ] **SMTP Settings** → Connect Resend (or use built-in)
- [ ] **Auth Providers** → Ensure email auth is enabled

### .env.local (local dev) / Vercel Environment Variables
- [ ] `NEXT_PUBLIC_SUPABASE_URL`
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] `SUPABASE_SERVICE_ROLE_KEY`
- [ ] `RESEND_API_KEY`
- [ ] (future) `STRIPE_SECRET_KEY`
- [ ] (future) `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- [ ] (future) `STRIPE_WEBHOOK_SECRET`

### Vercel Deployment
- [ ] Import GitHub repo `hmd-cookie/CCCookies`
- [ ] Set all env vars in Vercel dashboard
- [ ] Build command: `npm run build`
- [ ] Output directory: default (`.next`)
- [ ] Add site URL + redirect URLs in Supabase for Vercel domain

### Post-Deploy
- [ ] Run SQL migration in Supabase SQL Editor
- [ ] Set admin role: `UPDATE profiles SET role = 'admin' WHERE email = 'hmd.cookie@protonmail.com';`
- [ ] Test admin login at `https://project.vercel.app/admin`
- [ ] Test full checkout flow (currently mock — need Stripe keys)

---

## Future Improvements

Features the user explicitly asked for or that would improve the experience:

1. **SMS notifications** — via Twilio (requires another account, cost ~$0.0079/text). Deferred
2. **Shipping calculator** — integrate Canada Post/ShipStation for addresses outside GTA. Deferred
3. **Customer login/accounts** — currently guest-only, but could add Supabase auth for customers later
4. **Stripe Checkout** — Phase 3, awaiting user's Stripe account
5. **Order confirmation emails** — Via Resend, triggered by Stripe webhook. Phase 3
6. **Security hardening** — Rate limiting, CSP headers, webhook verification. Phase 4
