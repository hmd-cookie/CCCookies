-- ==========================================
-- CCCookies — Database Migration
-- Run this in Supabase SQL Editor
-- ==========================================

-- 1. PACKS TABLE (pricing managed via admin dashboard)
CREATE TABLE IF NOT EXISTS packs (
  id            TEXT PRIMARY KEY,
  name          TEXT NOT NULL,
  cookie_count  INTEGER NOT NULL,
  price         INTEGER NOT NULL, -- in cents (Stripe convention)
  description   TEXT NOT NULL,
  popular       BOOLEAN DEFAULT FALSE,
  savings       TEXT,
  active        BOOLEAN DEFAULT TRUE,
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Seed initial packs (prices in cents: 1499 = $14.99)
INSERT INTO packs (id, name, cookie_count, price, description, popular, savings)
VALUES
  ('pack-6',  '6-Pack',  6,  1499, 'Perfect for a taste. A half-dozen of our classic eggless dark chocolate chip cookies.',  FALSE, NULL),
  ('pack-12', '12-Pack', 12, 2799, 'Our most popular size. Great for sharing with family or stocking up.',                    TRUE,  'Save $1.99'),
  ('pack-20', '20-Pack', 20, 3999, 'Best value — perfect for parties, events, or serious cookie lovers.',                    FALSE, 'Save $7.99')
ON CONFLICT (id) DO NOTHING;

-- 2. ORDERS TABLE
CREATE TABLE IF NOT EXISTS orders (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name     TEXT NOT NULL,
  customer_email    TEXT NOT NULL,
  customer_phone    TEXT NOT NULL,
  address_line1     TEXT,
  address_city      TEXT,
  address_state     TEXT,
  address_postal    TEXT,
  address_country   TEXT DEFAULT 'Canada',
  delivery_option   TEXT NOT NULL CHECK (delivery_option IN ('pickup', 'brampton', 'gta')),
  delivery_fee      INTEGER NOT NULL DEFAULT 0, -- cents
  status            TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'confirmed', 'baking', 'shipped', 'ready', 'cancelled')),
  total             INTEGER NOT NULL, -- cents (subtotal + delivery)
  stripe_session_id TEXT UNIQUE,
  notes             TEXT,
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);

-- 3. ORDER ITEMS TABLE
CREATE TABLE IF NOT EXISTS order_items (
  id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id  UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  pack_id   TEXT NOT NULL,
  name      TEXT NOT NULL,
  quantity  INTEGER NOT NULL,
  price     INTEGER NOT NULL -- cents per unit
);

-- 4. PROFILES TABLE (linked to Supabase Auth)
CREATE TABLE IF NOT EXISTS profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  email       TEXT NOT NULL,
  name        TEXT,
  role        TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
    'customer'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Set your admin email (REPLACE with your email)
-- Run this AFTER signing up in the admin dashboard
-- UPDATE profiles SET role = 'admin' WHERE email = 'hmd.cookie@protonmail.com';

-- ==========================================
-- ROW LEVEL SECURITY
-- ==========================================

-- PACKS
ALTER TABLE packs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active packs"
  ON packs FOR SELECT
  USING (active = TRUE);

CREATE POLICY "Admins can manage packs"
  ON packs FOR ALL
  USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
  );

-- ORDERS
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Customers can view own orders"
  ON orders FOR SELECT
  USING (
    customer_email = auth.email()
    OR
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
  );

CREATE POLICY "Service role can insert orders"
  ON orders FOR INSERT
  WITH CHECK (true); -- restricted by service role usage

CREATE POLICY "Admins can update orders"
  ON orders FOR UPDATE
  USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
  );

-- ORDER ITEMS
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Customers can view own order items"
  ON order_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
      AND (orders.customer_email = auth.email()
        OR (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin')
    )
  );

CREATE POLICY "Service role can insert order items"
  ON order_items FOR INSERT
  WITH CHECK (true);

-- PROFILES
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (id = auth.uid());

CREATE POLICY "Admins can view all profiles"
  ON profiles FOR SELECT
  USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
  );

CREATE POLICY "Admins can update profiles"
  ON profiles FOR UPDATE
  USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
  );
