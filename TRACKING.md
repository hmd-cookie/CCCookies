# CCCookies — Project Tracking

## Phase 1: Frontend Foundation ✅
- [x] Initialize Next.js 16 + Tailwind v4 + Zustand
- [x] Hero section with cookie image + warm theme + animations
- [x] Site layout (navbar, footer, 4 sections)
- [x] Shopping cart (Zustand, persist, hydration guard)
- [x] 3-tier pricing (6/$14.99, 12/$27.99, 20/$39.99)
- [x] GitHub repo pushed (hmd-cookie/CCCookies)

## Phase 2: Backend & Order Infrastructure ✅
- [x] Supabase project created + clients configured
- [x] Database migration (packs, orders, order_items, profiles)
- [x] Row-Level Security (RLS) on all tables
- [x] API routes (packs, checkout, webhook scaffold, orders, track)
- [x] Checkout page (customer info + delivery options + address)
- [x] Order success/cancel pages
- [x] Customer order tracking (/track)
- [x] Admin dashboard (login, orders list, order detail, pricing editor)
- [x] Admin pricing management (edit packs, toggle active)
- [x] CartDrawer connected to /checkout
- [x] OrderSection fetches packs from DB via API
- [x] Navbar + Footer updated with Track Order link
- [x] Memory file created (MEMORY.md)

### ⏳ Pending
- [ ] Admin login test — waiting for Supabase email rate limit or configure SMTP
- [ ] End-to-end checkout test

## Phase 3: Payments & Auth (Next)
- [ ] User creates Stripe account
- [ ] Stripe Checkout integration (live)
- [ ] Webhook handler (checkout.session.completed)
- [ ] Order confirmation emails via Resend
- [ ] Connect Resend SMTP to Supabase for reliable auth emails

## Phase 4: Security Hardening
- [ ] Rate limiting on checkout endpoint
- [ ] CSP headers configured
- [ ] Stripe webhook signature verification
- [ ] Input sanitization library

## Phase 5: Launch
- [ ] SEO metadata + Open Graph tags
- [ ] Performance optimization
- [ ] Analytics
- [ ] Custom domain (optional)
- [ ] Deploy to Vercel (production)

---

### Notes
- Color palette: Light warm earthy (#FBF3EA / #D4A574 / #A67C52)
- Email: hmd.cookie@protonmail.com
- Repo: https://github.com/hmd-cookie/CCCookies
- Dev server: http://localhost:3000
- Keys stored in .env.local (gitignored), use Vercel env vars for deploy
