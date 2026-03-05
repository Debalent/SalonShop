-- ============================================================
-- SalonShop Database Schema
-- PostgreSQL + Supabase — run in Supabase SQL Editor
-- ============================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- ============================================================
-- ENUMS
-- ============================================================

CREATE TYPE user_role AS ENUM ('client', 'provider', 'shop_owner', 'admin');
CREATE TYPE appointment_status AS ENUM ('pending', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show');
CREATE TYPE payment_status AS ENUM ('pending', 'processing', 'succeeded', 'failed', 'refunded', 'partially_refunded');
CREATE TYPE payout_status AS ENUM ('pending', 'in_transit', 'paid', 'failed', 'cancelled');
CREATE TYPE subscription_tier AS ENUM ('free', 'pro', 'business');
CREATE TYPE notification_type AS ENUM ('booking_confirmed', 'booking_reminder', 'booking_cancelled', 'payment_received', 'payout_sent', 'review_received', 'message_received', 'system');
CREATE TYPE day_of_week AS ENUM ('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday');

-- ============================================================
-- PROFILES (extends Supabase auth.users)
-- ============================================================

CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role user_role NOT NULL DEFAULT 'client',
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  avatar_url TEXT,
  bio TEXT,
  -- Provider / shop owner fields
  slug TEXT UNIQUE,
  stripe_account_id TEXT UNIQUE,
  stripe_customer_id TEXT UNIQUE,
  stripe_account_enabled BOOLEAN NOT NULL DEFAULT FALSE,
  subscription_tier subscription_tier NOT NULL DEFAULT 'free',
  subscription_expires_at TIMESTAMPTZ,
  -- Metadata
  timezone TEXT NOT NULL DEFAULT 'America/New_York',
  locale TEXT NOT NULL DEFAULT 'en',
  is_onboarded BOOLEAN NOT NULL DEFAULT FALSE,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX profiles_role_idx ON profiles (role);
CREATE INDEX profiles_slug_idx ON profiles (slug);
CREATE INDEX profiles_stripe_account_id_idx ON profiles (stripe_account_id);
CREATE INDEX profiles_email_idx ON profiles (email);

-- ============================================================
-- PROVIDER PROFILES
-- ============================================================

CREATE TABLE provider_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  specialty TEXT,
  years_experience INTEGER,
  instagram_handle TEXT,
  website_url TEXT,
  portfolio_images TEXT[] DEFAULT '{}',
  -- Booking settings
  booking_buffer_minutes INTEGER NOT NULL DEFAULT 15,
  advance_booking_days INTEGER NOT NULL DEFAULT 60,
  cancellation_hours INTEGER NOT NULL DEFAULT 24,
  deposit_required BOOLEAN NOT NULL DEFAULT FALSE,
  deposit_percent INTEGER NOT NULL DEFAULT 25,
  -- Location
  location_type TEXT NOT NULL DEFAULT 'in_shop', -- 'in_shop' | 'mobile' | 'both'
  address_line1 TEXT,
  address_line2 TEXT,
  city TEXT,
  state TEXT,
  zip TEXT,
  country TEXT NOT NULL DEFAULT 'US',
  latitude NUMERIC(9, 6),
  longitude NUMERIC(9, 6),
  -- Stats (denormalised for performance)
  total_bookings INTEGER NOT NULL DEFAULT 0,
  total_reviews INTEGER NOT NULL DEFAULT 0,
  average_rating NUMERIC(3, 2) NOT NULL DEFAULT 0,
  response_time_minutes INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id)
);

CREATE INDEX provider_profiles_user_id_idx ON provider_profiles (user_id);
CREATE INDEX provider_profiles_city_idx ON provider_profiles (city);
CREATE INDEX provider_profiles_avg_rating_idx ON provider_profiles (average_rating DESC);

-- ============================================================
-- SHOPS
-- ============================================================

CREATE TABLE shops (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id UUID NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  logo_url TEXT,
  cover_url TEXT,
  phone TEXT,
  email TEXT,
  website_url TEXT,
  instagram_handle TEXT,
  -- Location
  address_line1 TEXT NOT NULL,
  address_line2 TEXT,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  zip TEXT NOT NULL,
  country TEXT NOT NULL DEFAULT 'US',
  latitude NUMERIC(9, 6),
  longitude NUMERIC(9, 6),
  -- Settings
  stripe_account_id TEXT,
  stripe_account_enabled BOOLEAN NOT NULL DEFAULT FALSE,
  subscription_tier subscription_tier NOT NULL DEFAULT 'free',
  timezone TEXT NOT NULL DEFAULT 'America/New_York',
  booking_buffer_minutes INTEGER NOT NULL DEFAULT 15,
  advance_booking_days INTEGER NOT NULL DEFAULT 60,
  cancellation_hours INTEGER NOT NULL DEFAULT 24,
  deposit_required BOOLEAN NOT NULL DEFAULT FALSE,
  deposit_percent INTEGER NOT NULL DEFAULT 25,
  -- Stats
  total_bookings INTEGER NOT NULL DEFAULT 0,
  total_reviews INTEGER NOT NULL DEFAULT 0,
  average_rating NUMERIC(3, 2) NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX shops_owner_id_idx ON shops (owner_id);
CREATE INDEX shops_slug_idx ON shops (slug);
CREATE INDEX shops_city_state_idx ON shops (city, state);

-- ============================================================
-- SHOP MEMBERS (staff roster)
-- ============================================================

CREATE TABLE shop_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  shop_id UUID NOT NULL REFERENCES shops(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'stylist', -- 'owner' | 'manager' | 'stylist' | 'assistant'
  booth_rent_amount INTEGER, -- cents, if applicable
  commission_percent INTEGER, -- 0–100
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (shop_id, user_id)
);

CREATE INDEX shop_members_shop_id_idx ON shop_members (shop_id);
CREATE INDEX shop_members_user_id_idx ON shop_members (user_id);

-- ============================================================
-- BUSINESS HOURS
-- ============================================================

CREATE TABLE business_hours (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  -- Either user_id or shop_id (not both)
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  shop_id UUID REFERENCES shops(id) ON DELETE CASCADE,
  day_of_week day_of_week NOT NULL,
  is_open BOOLEAN NOT NULL DEFAULT TRUE,
  open_time TIME NOT NULL DEFAULT '09:00',
  close_time TIME NOT NULL DEFAULT '18:00',
  CHECK (
    (user_id IS NOT NULL AND shop_id IS NULL) OR
    (user_id IS NULL AND shop_id IS NOT NULL)
  )
);

CREATE INDEX business_hours_user_id_idx ON business_hours (user_id);
CREATE INDEX business_hours_shop_id_idx ON business_hours (shop_id);

-- ============================================================
-- SERVICE TYPES / CATEGORIES
-- ============================================================

CREATE TABLE service_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  icon TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0
);

INSERT INTO service_categories (name, icon, sort_order) VALUES
  ('Haircut & Styling', 'scissors', 1),
  ('Color & Highlights', 'palette', 2),
  ('Nails', 'hand', 3),
  ('Lashes & Brows', 'eye', 4),
  ('Skincare & Facials', 'sparkles', 5),
  ('Massage & Body', 'heart', 6),
  ('Makeup', 'star', 7),
  ('Waxing & Threading', 'zap', 8),
  ('Braids & Natural Hair', 'wind', 9),
  ('Men\'s Grooming', 'user', 10);

-- ============================================================
-- SERVICES
-- ============================================================

CREATE TABLE services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  -- Owned by provider or shop
  provider_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  shop_id UUID REFERENCES shops(id) ON DELETE CASCADE,
  category_id UUID REFERENCES service_categories(id),
  name TEXT NOT NULL,
  description TEXT,
  duration_minutes INTEGER NOT NULL,
  price INTEGER NOT NULL, -- cents
  deposit_percent INTEGER NOT NULL DEFAULT 0,
  is_popular BOOLEAN NOT NULL DEFAULT FALSE,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  image_url TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CHECK (
    (provider_id IS NOT NULL AND shop_id IS NULL) OR
    (provider_id IS NULL AND shop_id IS NOT NULL)
  )
);

CREATE INDEX services_provider_id_idx ON services (provider_id);
CREATE INDEX services_shop_id_idx ON services (shop_id);
CREATE INDEX services_category_id_idx ON services (category_id);

-- ============================================================
-- SERVICE ADD-ONS
-- ============================================================

CREATE TABLE service_addons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  service_id UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  price INTEGER NOT NULL DEFAULT 0, -- cents
  duration_minutes INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE INDEX service_addons_service_id_idx ON service_addons (service_id);

-- ============================================================
-- CLIENTS (provider-specific client records)
-- ============================================================

CREATE TABLE clients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  provider_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  -- For walk-ins or manually added clients
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  notes TEXT,
  tags TEXT[] DEFAULT '{}',
  -- Loyalty
  loyalty_points INTEGER NOT NULL DEFAULT 0,
  total_spent INTEGER NOT NULL DEFAULT 0, -- cents
  total_visits INTEGER NOT NULL DEFAULT 0,
  last_visit_at TIMESTAMPTZ,
  is_vip BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (provider_id, email)
);

CREATE INDEX clients_provider_id_idx ON clients (provider_id);
CREATE INDEX clients_user_id_idx ON clients (user_id);
CREATE INDEX clients_provider_email_idx ON clients (provider_id, email);

-- ============================================================
-- APPOINTMENTS
-- ============================================================

CREATE TABLE appointments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  provider_id UUID NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
  shop_id UUID REFERENCES shops(id) ON DELETE SET NULL,
  client_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  -- Guest booking (not a registered user)
  guest_first_name TEXT,
  guest_last_name TEXT,
  guest_email TEXT,
  guest_phone TEXT,
  service_id UUID NOT NULL REFERENCES services(id) ON DELETE RESTRICT,
  addon_ids UUID[] DEFAULT '{}',
  status appointment_status NOT NULL DEFAULT 'pending',
  starts_at TIMESTAMPTZ NOT NULL,
  ends_at TIMESTAMPTZ NOT NULL,
  total_minutes INTEGER NOT NULL,
  -- Pricing (snapshot at booking time)
  subtotal INTEGER NOT NULL, -- cents
  tip_amount INTEGER NOT NULL DEFAULT 0, -- cents
  discount_amount INTEGER NOT NULL DEFAULT 0, -- cents
  total_amount INTEGER NOT NULL, -- cents
  deposit_amount INTEGER NOT NULL DEFAULT 0, -- cents
  deposit_paid BOOLEAN NOT NULL DEFAULT FALSE,
  notes TEXT,
  internal_notes TEXT,
  -- Source
  source TEXT NOT NULL DEFAULT 'web', -- 'web' | 'mobile' | 'walk_in' | 'phone'
  cancelled_at TIMESTAMPTZ,
  cancelled_by UUID REFERENCES profiles(id),
  cancellation_reason TEXT,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX appointments_provider_id_idx ON appointments (provider_id);
CREATE INDEX appointments_client_id_idx ON appointments (client_id);
CREATE INDEX appointments_starts_at_idx ON appointments (starts_at);
CREATE INDEX appointments_status_idx ON appointments (status);
CREATE INDEX appointments_provider_date_idx ON appointments (provider_id, starts_at);

-- ============================================================
-- PAYMENTS
-- ============================================================

CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  appointment_id UUID NOT NULL REFERENCES appointments(id) ON DELETE RESTRICT,
  payer_id UUID REFERENCES profiles(id),
  provider_id UUID NOT NULL REFERENCES profiles(id),
  stripe_payment_intent_id TEXT UNIQUE,
  stripe_charge_id TEXT,
  stripe_transfer_id TEXT,
  amount INTEGER NOT NULL, -- cents (total charged)
  tip_amount INTEGER NOT NULL DEFAULT 0,
  platform_fee INTEGER NOT NULL DEFAULT 0, -- cents (2%)
  provider_payout INTEGER NOT NULL, -- cents (amount - platform_fee)
  currency TEXT NOT NULL DEFAULT 'usd',
  status payment_status NOT NULL DEFAULT 'pending',
  is_deposit BOOLEAN NOT NULL DEFAULT FALSE,
  refund_amount INTEGER NOT NULL DEFAULT 0,
  refund_reason TEXT,
  stripe_refund_id TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX payments_appointment_id_idx ON payments (appointment_id);
CREATE INDEX payments_provider_id_idx ON payments (provider_id);
CREATE INDEX payments_stripe_payment_intent_id_idx ON payments (stripe_payment_intent_id);
CREATE INDEX payments_status_idx ON payments (status);
CREATE INDEX payments_created_at_idx ON payments (created_at DESC);

-- ============================================================
-- SAVED PAYMENT METHODS
-- ============================================================

CREATE TABLE saved_payment_methods (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  stripe_payment_method_id TEXT NOT NULL UNIQUE,
  brand TEXT NOT NULL, -- 'visa', 'mastercard', etc.
  last4 TEXT NOT NULL,
  exp_month INTEGER NOT NULL,
  exp_year INTEGER NOT NULL,
  is_default BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX saved_payment_methods_user_id_idx ON saved_payment_methods (user_id);

-- ============================================================
-- PAYOUTS
-- ============================================================

CREATE TABLE payouts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  provider_id UUID NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
  stripe_payout_id TEXT UNIQUE,
  amount INTEGER NOT NULL, -- cents
  currency TEXT NOT NULL DEFAULT 'usd',
  status payout_status NOT NULL DEFAULT 'pending',
  arrival_date DATE,
  bank_name TEXT,
  last4 TEXT,
  description TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX payouts_provider_id_idx ON payouts (provider_id);
CREATE INDEX payouts_status_idx ON payouts (status);
CREATE INDEX payouts_created_at_idx ON payouts (created_at DESC);

-- ============================================================
-- REVIEWS
-- ============================================================

CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  appointment_id UUID NOT NULL REFERENCES appointments(id) ON DELETE RESTRICT,
  reviewer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  provider_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  shop_id UUID REFERENCES shops(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  title TEXT,
  body TEXT,
  provider_reply TEXT,
  provider_replied_at TIMESTAMPTZ,
  is_verified BOOLEAN NOT NULL DEFAULT TRUE,
  is_flagged BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (appointment_id, reviewer_id)
);

CREATE INDEX reviews_provider_id_idx ON reviews (provider_id);
CREATE INDEX reviews_appointment_id_idx ON reviews (appointment_id);
CREATE INDEX reviews_rating_idx ON reviews (rating DESC);
CREATE INDEX reviews_created_at_idx ON reviews (created_at DESC);

-- ============================================================
-- NOTIFICATIONS
-- ============================================================

CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type notification_type NOT NULL,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  data JSONB DEFAULT '{}',
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX notifications_user_id_idx ON notifications (user_id);
CREATE INDEX notifications_is_read_idx ON notifications (user_id, is_read);
CREATE INDEX notifications_created_at_idx ON notifications (created_at DESC);

-- ============================================================
-- MESSAGES (Client <-> Provider)
-- ============================================================

CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sender_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  recipient_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  appointment_id UUID REFERENCES appointments(id) ON DELETE SET NULL,
  body TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX messages_sender_id_idx ON messages (sender_id);
CREATE INDEX messages_recipient_id_idx ON messages (recipient_id);
CREATE INDEX messages_created_at_idx ON messages (created_at DESC);

-- ============================================================
-- LOYALTY PROGRAMS
-- ============================================================

CREATE TABLE loyalty_programs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  provider_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  shop_id UUID REFERENCES shops(id) ON DELETE CASCADE,
  name TEXT NOT NULL DEFAULT 'Rewards',
  points_per_dollar INTEGER NOT NULL DEFAULT 1,
  dollars_per_point NUMERIC(6, 4) NOT NULL DEFAULT 0.01,
  min_redeem_points INTEGER NOT NULL DEFAULT 100,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- SUBSCRIPTION PLANS
-- ============================================================

CREATE TABLE subscription_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tier subscription_tier NOT NULL UNIQUE,
  name TEXT NOT NULL,
  price_monthly INTEGER NOT NULL, -- cents
  price_yearly INTEGER NOT NULL, -- cents
  stripe_price_id_monthly TEXT,
  stripe_price_id_yearly TEXT,
  features JSONB NOT NULL DEFAULT '[]',
  max_services INTEGER,
  max_staff INTEGER,
  max_bookings_per_month INTEGER,
  platform_fee_percent NUMERIC(4, 3) NOT NULL DEFAULT 0.02,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO subscription_plans (tier, name, price_monthly, price_yearly, features, max_services, max_staff, max_bookings_per_month, platform_fee_percent) VALUES
  ('free',     'Starter', 0,       0,       '["5 services", "Basic booking page", "Email reminders", "Client management"]',          5,    1,   50,  0.02),
  ('pro',      'Pro',     2900,    27840,   '["Unlimited services", "Custom booking page", "SMS reminders", "Analytics", "No-show protection", "Instant payouts"]', NULL, 1,   NULL, 0.015),
  ('business', 'Business',7900,    75840,   '["Everything in Pro", "Up to 10 staff", "Shop management", "Team analytics", "Booth rent tracking", "Priority support"]', NULL, 10,  NULL, 0.01);

-- ============================================================
-- AUDIT LOGS
-- ============================================================

CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  actor_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  table_name TEXT NOT NULL,
  record_id UUID,
  old_values JSONB,
  new_values JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX audit_logs_actor_id_idx ON audit_logs (actor_id);
CREATE INDEX audit_logs_table_record_idx ON audit_logs (table_name, record_id);
CREATE INDEX audit_logs_created_at_idx ON audit_logs (created_at DESC);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE provider_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE shops ENABLE ROW LEVEL SECURITY;
ALTER TABLE shop_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_addons ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE payouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_hours ENABLE ROW LEVEL SECURITY;

-- Profiles: users can read all, only update their own
CREATE POLICY "profiles_select_all" ON profiles FOR SELECT USING (true);
CREATE POLICY "profiles_update_own" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "profiles_insert_own" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Provider profiles: public read, own write
CREATE POLICY "provider_profiles_select_all" ON provider_profiles FOR SELECT USING (true);
CREATE POLICY "provider_profiles_write_own" ON provider_profiles FOR ALL USING (auth.uid() = user_id);

-- Shops: public read, owner write
CREATE POLICY "shops_select_all" ON shops FOR SELECT USING (true);
CREATE POLICY "shops_write_owner" ON shops FOR ALL USING (auth.uid() = owner_id);

-- Shop members: shop owner or member can read
CREATE POLICY "shop_members_select" ON shop_members FOR SELECT
  USING (auth.uid() = user_id OR EXISTS (SELECT 1 FROM shops WHERE id = shop_id AND owner_id = auth.uid()));
CREATE POLICY "shop_members_write_owner" ON shop_members FOR ALL
  USING (EXISTS (SELECT 1 FROM shops WHERE id = shop_id AND owner_id = auth.uid()));

-- Services: public read, provider write
CREATE POLICY "services_select_all" ON services FOR SELECT USING (true);
CREATE POLICY "services_write_own" ON services FOR ALL USING (auth.uid() = provider_id);
CREATE POLICY "services_write_shop_owner" ON services FOR ALL
  USING (EXISTS (SELECT 1 FROM shops WHERE id = shop_id AND owner_id = auth.uid()));

-- Appointments: provider sees all their own; client sees their own
CREATE POLICY "appointments_select_provider" ON appointments FOR SELECT USING (auth.uid() = provider_id);
CREATE POLICY "appointments_select_client" ON appointments FOR SELECT USING (auth.uid() = client_id);
CREATE POLICY "appointments_insert_client" ON appointments FOR INSERT WITH CHECK (auth.uid() = client_id);
CREATE POLICY "appointments_update_provider" ON appointments FOR UPDATE USING (auth.uid() = provider_id);
CREATE POLICY "appointments_update_client" ON appointments FOR UPDATE
  USING (auth.uid() = client_id AND status = 'pending');

-- Payments: provider or payer can see
CREATE POLICY "payments_select" ON payments FOR SELECT
  USING (auth.uid() = provider_id OR auth.uid() = payer_id);

-- Saved payment methods: own only
CREATE POLICY "saved_payment_methods_own" ON saved_payment_methods FOR ALL USING (auth.uid() = user_id);

-- Payouts: provider only
CREATE POLICY "payouts_provider" ON payouts FOR SELECT USING (auth.uid() = provider_id);

-- Reviews: public read, reviewer write
CREATE POLICY "reviews_select_all" ON reviews FOR SELECT USING (true);
CREATE POLICY "reviews_write_own" ON reviews FOR INSERT WITH CHECK (auth.uid() = reviewer_id);
CREATE POLICY "reviews_reply_provider" ON reviews FOR UPDATE USING (auth.uid() = provider_id);

-- Notifications: own only
CREATE POLICY "notifications_own" ON notifications FOR ALL USING (auth.uid() = user_id);

-- Messages: sender or recipient
CREATE POLICY "messages_select" ON messages FOR SELECT
  USING (auth.uid() = sender_id OR auth.uid() = recipient_id);
CREATE POLICY "messages_insert" ON messages FOR INSERT WITH CHECK (auth.uid() = sender_id);
CREATE POLICY "messages_update_recipient" ON messages FOR UPDATE USING (auth.uid() = recipient_id);

-- Clients: provider only
CREATE POLICY "clients_provider" ON clients FOR ALL USING (auth.uid() = provider_id);

-- Business hours: public read, own write
CREATE POLICY "business_hours_select_all" ON business_hours FOR SELECT USING (true);
CREATE POLICY "business_hours_write_own" ON business_hours FOR ALL USING (auth.uid() = user_id);

-- ============================================================
-- FUNCTIONS & TRIGGERS
-- ============================================================

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_provider_profiles_updated_at BEFORE UPDATE ON provider_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_shops_updated_at BEFORE UPDATE ON shops FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON services FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_appointments_updated_at BEFORE UPDATE ON appointments FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_payouts_updated_at BEFORE UPDATE ON payouts FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON reviews FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON clients FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO profiles (id, email, first_name, last_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'client')
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Update provider rating on review upsert
CREATE OR REPLACE FUNCTION update_provider_rating()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  UPDATE provider_profiles
  SET
    average_rating = (
      SELECT ROUND(AVG(rating)::numeric, 2)
      FROM reviews WHERE provider_id = NEW.provider_id
    ),
    total_reviews = (
      SELECT COUNT(*) FROM reviews WHERE provider_id = NEW.provider_id
    )
  WHERE user_id = NEW.provider_id;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_review_upsert
  AFTER INSERT OR UPDATE ON reviews
  FOR EACH ROW EXECUTE FUNCTION update_provider_rating();

-- Increment booking count on appointment completion
CREATE OR REPLACE FUNCTION update_provider_booking_count()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  IF NEW.status = 'completed' AND (OLD.status IS DISTINCT FROM 'completed') THEN
    UPDATE provider_profiles
    SET total_bookings = total_bookings + 1
    WHERE user_id = NEW.provider_id;

    UPDATE clients
    SET
      total_visits = total_visits + 1,
      total_spent = total_spent + NEW.total_amount,
      last_visit_at = NEW.completed_at
    WHERE provider_id = NEW.provider_id AND user_id = NEW.client_id;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_appointment_completed
  AFTER UPDATE ON appointments
  FOR EACH ROW EXECUTE FUNCTION update_provider_booking_count();

-- ============================================================
-- STORAGE BUCKETS (run via Supabase dashboard or API)
-- ============================================================

-- INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true);
-- INSERT INTO storage.buckets (id, name, public) VALUES ('portfolio', 'portfolio', true);
-- INSERT INTO storage.buckets (id, name, public) VALUES ('shop-assets', 'shop-assets', true);

-- Storage policies:
-- CREATE POLICY "avatars_public_read" ON storage.objects FOR SELECT USING (bucket_id = 'avatars');
-- CREATE POLICY "avatars_own_write" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);
