-- =============================================================================
-- SalonShop — Initial Database Migration
-- PostgreSQL 15+  |  Drop into psql or run via `prisma db execute`
-- =============================================================================

-- ── Extensions ───────────────────────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";   -- fuzzy text search
CREATE EXTENSION IF NOT EXISTS "unaccent";  -- accent-insensitive search
CREATE EXTENSION IF NOT EXISTS "postgis";   -- geolocation (optional, drop if unused)

-- ── Enums ─────────────────────────────────────────────────────────────────────
CREATE TYPE user_role           AS ENUM ('CLIENT','WORKER','SHOP_OWNER','ADMIN');
CREATE TYPE booking_status      AS ENUM ('PENDING','CONFIRMED','IN_PROGRESS','COMPLETED','CANCELLED','NO_SHOW');
CREATE TYPE payment_status      AS ENUM ('UNPAID','DEPOSIT_PAID','PAID','REFUNDED','PARTIALLY_REFUNDED','DISPUTED');
CREATE TYPE review_status       AS ENUM ('PENDING','APPROVED','REJECTED','FLAGGED');
CREATE TYPE notification_type   AS ENUM (
  'BOOKING_CONFIRMED','BOOKING_REMINDER','BOOKING_CANCELLED',
  'PAYMENT_RECEIPT','REVIEW_RECEIVED','REBOOK_NUDGE',
  'TIP_RECEIVED','PAYOUT_SENT','SYSTEM'
);
CREATE TYPE day_of_week         AS ENUM ('MONDAY','TUESDAY','WEDNESDAY','THURSDAY','FRIDAY','SATURDAY','SUNDAY');
CREATE TYPE subscription_tier   AS ENUM ('free','pro','elite');
CREATE TYPE loyalty_tier        AS ENUM ('bronze','silver','gold','platinum');

-- =============================================================================
-- USERS
-- =============================================================================
CREATE TABLE users (
  id                TEXT          PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  email             CITEXT        NOT NULL UNIQUE,
  name              TEXT          NOT NULL,
  password_hash     TEXT          NOT NULL,
  role              user_role     NOT NULL DEFAULT 'CLIENT',
  email_verified    TIMESTAMPTZ,
  phone             TEXT,
  avatar_url        TEXT,
  timezone          TEXT          NOT NULL DEFAULT 'America/New_York',
  locale            TEXT          NOT NULL DEFAULT 'en',
  is_active         BOOLEAN       NOT NULL DEFAULT TRUE,
  created_at        TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_users_email  ON users (email);
CREATE INDEX idx_users_role   ON users (role);

-- =============================================================================
-- SESSIONS
-- =============================================================================
CREATE TABLE sessions (
  id          TEXT        PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  user_id     TEXT        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token       TEXT        NOT NULL UNIQUE,
  expires_at  TIMESTAMPTZ NOT NULL,
  user_agent  TEXT,
  ip_address  INET,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_sessions_token   ON sessions (token);
CREATE INDEX idx_sessions_user_id ON sessions (user_id);

-- =============================================================================
-- PROFILES  (client-facing extended info)
-- =============================================================================
CREATE TABLE profiles (
  id             TEXT        PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  user_id        TEXT        NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  bio            TEXT,
  location       TEXT,
  city           TEXT,
  state          CHAR(2),
  zip_code       TEXT,
  latitude       DOUBLE PRECISION,
  longitude      DOUBLE PRECISION,
  contact_phone  TEXT,
  website        TEXT,
  instagram      TEXT,
  tiktok         TEXT,
  portfolio_images TEXT[],                    -- array of CDN URLs
  cover_image_url TEXT,
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Spatial index for geo-proximity queries (requires postgis)
CREATE INDEX idx_profiles_location ON profiles USING GIST (
  ST_MakePoint(longitude, latitude)
) WHERE longitude IS NOT NULL AND latitude IS NOT NULL;

-- =============================================================================
-- WORKER PROFILES
-- =============================================================================
CREATE TABLE worker_profiles (
  id                    TEXT             PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  user_id               TEXT             NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  slug                  TEXT             NOT NULL UNIQUE,
  display_name          TEXT             NOT NULL,
  profession            TEXT             NOT NULL,
  categories            TEXT[]           NOT NULL DEFAULT '{}',
  years_experience      SMALLINT,
  specialties           TEXT[]           NOT NULL DEFAULT '{}',
  is_accepting_clients  BOOLEAN          NOT NULL DEFAULT TRUE,
  deposit_percent       SMALLINT         NOT NULL DEFAULT 30 CHECK (deposit_percent BETWEEN 0 AND 100),
  cancellation_hours    SMALLINT         NOT NULL DEFAULT 24,
  instant_book          BOOLEAN          NOT NULL DEFAULT FALSE,
  stripe_account_id     TEXT             UNIQUE,
  stripe_account_status TEXT,
  average_rating        NUMERIC(3,2)     NOT NULL DEFAULT 0,
  total_reviews         INTEGER          NOT NULL DEFAULT 0,
  total_bookings        INTEGER          NOT NULL DEFAULT 0,
  is_verified           BOOLEAN          NOT NULL DEFAULT FALSE,
  is_featured           BOOLEAN          NOT NULL DEFAULT FALSE,
  subscription_tier     subscription_tier NOT NULL DEFAULT 'free',
  onboarding_completed  BOOLEAN          NOT NULL DEFAULT FALSE,
  created_at            TIMESTAMPTZ      NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ      NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_worker_slug          ON worker_profiles (slug);
CREATE INDEX idx_worker_profession    ON worker_profiles (profession);
CREATE INDEX idx_worker_rating        ON worker_profiles (average_rating DESC);
CREATE INDEX idx_worker_accepting     ON worker_profiles (is_accepting_clients) WHERE is_accepting_clients = TRUE;
CREATE INDEX idx_worker_categories    ON worker_profiles USING GIN (categories);
CREATE INDEX idx_worker_specialties   ON worker_profiles USING GIN (specialties);

-- Full-text search index on name + profession
CREATE INDEX idx_worker_fts ON worker_profiles
  USING GIN (to_tsvector('english', display_name || ' ' || profession));

-- =============================================================================
-- SERVICES
-- =============================================================================
CREATE TABLE services (
  id               TEXT        PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  worker_id        TEXT        NOT NULL REFERENCES worker_profiles(id) ON DELETE CASCADE,
  name             TEXT        NOT NULL,
  description      TEXT,
  category         TEXT        NOT NULL,
  price            INTEGER     NOT NULL CHECK (price >= 0),   -- cents
  duration_minutes SMALLINT    NOT NULL CHECK (duration_minutes > 0),
  deposit_percent  SMALLINT    NOT NULL DEFAULT 0 CHECK (deposit_percent BETWEEN 0 AND 100),
  is_active        BOOLEAN     NOT NULL DEFAULT TRUE,
  is_addon         BOOLEAN     NOT NULL DEFAULT FALSE,
  sort_order       SMALLINT    NOT NULL DEFAULT 0,
  image_url        TEXT,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_services_worker   ON services (worker_id);
CREATE INDEX idx_services_category ON services (category);
CREATE INDEX idx_services_active   ON services (worker_id, is_active) WHERE is_active = TRUE;

-- =============================================================================
-- AVAILABILITY  (recurring weekly schedule)
-- =============================================================================
CREATE TABLE availability (
  id         TEXT        PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  worker_id  TEXT        NOT NULL REFERENCES worker_profiles(id) ON DELETE CASCADE,
  day        day_of_week NOT NULL,
  start_time TIME        NOT NULL,  -- '09:00'
  end_time   TIME        NOT NULL,  -- '18:00'
  is_active  BOOLEAN     NOT NULL DEFAULT TRUE,
  UNIQUE (worker_id, day)
);

CREATE INDEX idx_availability_worker ON availability (worker_id);

-- =============================================================================
-- TIME BLOCKS  (one-off blocked time: vacation, lunch, etc.)
-- =============================================================================
CREATE TABLE time_blocks (
  id         TEXT        PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  worker_id  TEXT        NOT NULL REFERENCES worker_profiles(id) ON DELETE CASCADE,
  start_at   TIMESTAMPTZ NOT NULL,
  end_at     TIMESTAMPTZ NOT NULL,
  reason     TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CHECK (end_at > start_at)
);

CREATE INDEX idx_time_blocks_worker_range ON time_blocks (worker_id, start_at, end_at);

-- =============================================================================
-- SHOPS
-- =============================================================================
CREATE TABLE shops (
  id               TEXT        PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  owner_id         TEXT        NOT NULL UNIQUE REFERENCES users(id),
  name             TEXT        NOT NULL,
  slug             TEXT        NOT NULL UNIQUE,
  description      TEXT,
  location         TEXT,
  city             TEXT,
  state            CHAR(2),
  phone            TEXT,
  website          TEXT,
  instagram        TEXT,
  logo_url         TEXT,
  cover_url        TEXT,
  platform_fee_pct NUMERIC(5,4) NOT NULL DEFAULT 0.10,
  worker_rev_share NUMERIC(5,4) NOT NULL DEFAULT 0.20,
  shop_rev_share   NUMERIC(5,4) NOT NULL DEFAULT 0.70,
  is_active        BOOLEAN     NOT NULL DEFAULT TRUE,
  is_verified      BOOLEAN     NOT NULL DEFAULT FALSE,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  -- Ensure rev splits sum to ≤ 1
  CHECK (worker_rev_share + shop_rev_share <= 1.0)
);

CREATE INDEX idx_shops_slug ON shops (slug);

-- =============================================================================
-- SHOP WORKERS  (many-to-many: workers at a shop)
-- =============================================================================
CREATE TABLE shop_workers (
  id        TEXT        PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  shop_id   TEXT        NOT NULL REFERENCES shops(id) ON DELETE CASCADE,
  worker_id TEXT        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role      TEXT        NOT NULL DEFAULT 'stylist',
  is_active BOOLEAN     NOT NULL DEFAULT TRUE,
  joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (shop_id, worker_id)
);

CREATE INDEX idx_shop_workers_shop   ON shop_workers (shop_id);
CREATE INDEX idx_shop_workers_worker ON shop_workers (worker_id);

-- =============================================================================
-- BOOKINGS
-- =============================================================================
CREATE TABLE bookings (
  id              TEXT           PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  client_id       TEXT           NOT NULL REFERENCES users(id),
  worker_id       TEXT           NOT NULL REFERENCES users(id),
  service_id      TEXT           NOT NULL REFERENCES services(id),
  shop_id         TEXT           REFERENCES shops(id),
  booking_date    DATE           NOT NULL,
  start_time      TIME           NOT NULL,
  end_time        TIME           NOT NULL,
  status          booking_status NOT NULL DEFAULT 'PENDING',
  payment_status  payment_status NOT NULL DEFAULT 'UNPAID',
  total_amount    INTEGER        NOT NULL CHECK (total_amount >= 0),   -- cents
  deposit_amount  INTEGER        NOT NULL DEFAULT 0,
  tip_amount      INTEGER        NOT NULL DEFAULT 0,
  platform_fee    INTEGER        NOT NULL DEFAULT 0,
  worker_payout   INTEGER        NOT NULL DEFAULT 0,
  client_notes    TEXT,
  internal_notes  TEXT,
  cancelled_at    TIMESTAMPTZ,
  cancel_reason   TEXT,
  completed_at    TIMESTAMPTZ,
  created_at      TIMESTAMPTZ    NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ    NOT NULL DEFAULT NOW(),
  CHECK (end_time > start_time)
);

CREATE INDEX idx_bookings_client           ON bookings (client_id);
CREATE INDEX idx_bookings_worker_date      ON bookings (worker_id, booking_date);
CREATE INDEX idx_bookings_status           ON bookings (status);
CREATE INDEX idx_bookings_date             ON bookings (booking_date);
CREATE INDEX idx_bookings_payment_status   ON bookings (payment_status);

-- Partial index for active bookings (common query pattern)
CREATE INDEX idx_bookings_active ON bookings (worker_id, booking_date)
  WHERE status IN ('PENDING','CONFIRMED','IN_PROGRESS');

-- =============================================================================
-- PAYMENTS
-- =============================================================================
CREATE TABLE payments (
  id                        TEXT           PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  booking_id                TEXT           NOT NULL UNIQUE REFERENCES bookings(id),
  client_id                 TEXT           NOT NULL REFERENCES users(id),
  stripe_payment_intent_id  TEXT           UNIQUE,
  stripe_charge_id          TEXT,
  stripe_transfer_id        TEXT,
  amount                    INTEGER        NOT NULL CHECK (amount >= 0),
  deposit_amount            INTEGER        NOT NULL DEFAULT 0,
  tip_amount                INTEGER        NOT NULL DEFAULT 0,
  platform_fee              INTEGER        NOT NULL DEFAULT 0,
  worker_payout             INTEGER        NOT NULL DEFAULT 0,
  currency                  CHAR(3)        NOT NULL DEFAULT 'usd',
  status                    payment_status NOT NULL DEFAULT 'UNPAID',
  refunded_amount           INTEGER        NOT NULL DEFAULT 0,
  receipt_url               TEXT,
  created_at                TIMESTAMPTZ    NOT NULL DEFAULT NOW(),
  updated_at                TIMESTAMPTZ    NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_payments_client  ON payments (client_id);
CREATE INDEX idx_payments_status  ON payments (status);
CREATE INDEX idx_payments_stripe  ON payments (stripe_payment_intent_id) WHERE stripe_payment_intent_id IS NOT NULL;

-- =============================================================================
-- REVIEWS
-- =============================================================================
CREATE TABLE reviews (
  id               TEXT          PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  booking_id       TEXT          NOT NULL UNIQUE REFERENCES bookings(id),
  client_id        TEXT          NOT NULL REFERENCES users(id),
  worker_id        TEXT          NOT NULL REFERENCES users(id),
  rating           SMALLINT      NOT NULL CHECK (rating BETWEEN 1 AND 5),
  body             TEXT,
  would_book_again BOOLEAN       NOT NULL DEFAULT TRUE,
  status           review_status NOT NULL DEFAULT 'PENDING',
  provider_reply   TEXT,
  replied_at       TIMESTAMPTZ,
  flagged_reason   TEXT,
  created_at       TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_reviews_worker        ON reviews (worker_id, status);
CREATE INDEX idx_reviews_client        ON reviews (client_id);
CREATE INDEX idx_reviews_rating        ON reviews (rating);
CREATE INDEX idx_reviews_approved      ON reviews (worker_id, rating) WHERE status = 'APPROVED';

-- Full-text on review body
CREATE INDEX idx_reviews_fts ON reviews
  USING GIN (to_tsvector('english', COALESCE(body, '')));

-- =============================================================================
-- NOTIFICATIONS
-- =============================================================================
CREATE TABLE notifications (
  id         TEXT              PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  user_id    TEXT              NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type       notification_type NOT NULL,
  title      TEXT              NOT NULL,
  body       TEXT              NOT NULL,
  data       JSONB,
  is_read    BOOLEAN           NOT NULL DEFAULT FALSE,
  read_at    TIMESTAMPTZ,
  created_at TIMESTAMPTZ       NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_notifications_user_unread ON notifications (user_id, is_read) WHERE is_read = FALSE;
CREATE INDEX idx_notifications_user_time   ON notifications (user_id, created_at DESC);

-- =============================================================================
-- SAVED WORKERS  (client favorites)
-- =============================================================================
CREATE TABLE saved_workers (
  id         TEXT        PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  client_id  TEXT        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  worker_id  TEXT        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (client_id, worker_id)
);

CREATE INDEX idx_saved_workers_client ON saved_workers (client_id);

-- =============================================================================
-- SAVED PAYMENT METHODS
-- =============================================================================
CREATE TABLE saved_payment_methods (
  id                        TEXT        PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  client_id                 TEXT        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  stripe_customer_id        TEXT        NOT NULL,
  stripe_payment_method_id  TEXT        NOT NULL UNIQUE,
  brand                     TEXT        NOT NULL,  -- 'visa', 'mastercard', 'amex'
  last4                     CHAR(4)     NOT NULL,
  exp_month                 SMALLINT    NOT NULL,
  exp_year                  SMALLINT    NOT NULL,
  is_default                BOOLEAN     NOT NULL DEFAULT FALSE,
  created_at                TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_payment_methods_client ON saved_payment_methods (client_id);

-- =============================================================================
-- LOYALTY ACCOUNTS
-- =============================================================================
CREATE TABLE loyalty_accounts (
  id               TEXT          PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  client_id        TEXT          NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  total_points     INTEGER       NOT NULL DEFAULT 0,
  lifetime_points  INTEGER       NOT NULL DEFAULT 0,
  tier             loyalty_tier  NOT NULL DEFAULT 'bronze',
  created_at       TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE TABLE loyalty_transactions (
  id          TEXT        PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  account_id  TEXT        NOT NULL REFERENCES loyalty_accounts(id) ON DELETE CASCADE,
  points      INTEGER     NOT NULL,  -- positive = earn, negative = redeem
  reason      TEXT        NOT NULL,
  booking_id  TEXT        REFERENCES bookings(id),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_loyalty_txn_account ON loyalty_transactions (account_id);
CREATE INDEX idx_loyalty_txn_time    ON loyalty_transactions (account_id, created_at DESC);

-- Prevent total_points from going negative
CREATE OR REPLACE FUNCTION check_loyalty_balance()
RETURNS TRIGGER AS $$
BEGIN
  IF (NEW.total_points < 0) THEN
    RAISE EXCEPTION 'Loyalty points cannot go below 0';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_loyalty_balance_check
  BEFORE UPDATE ON loyalty_accounts
  FOR EACH ROW EXECUTE FUNCTION check_loyalty_balance();

-- Auto-update tier based on lifetime points
CREATE OR REPLACE FUNCTION update_loyalty_tier()
RETURNS TRIGGER AS $$
BEGIN
  NEW.tier := CASE
    WHEN NEW.lifetime_points >= 5000 THEN 'platinum'::loyalty_tier
    WHEN NEW.lifetime_points >= 1500 THEN 'gold'::loyalty_tier
    WHEN NEW.lifetime_points >= 500  THEN 'silver'::loyalty_tier
    ELSE 'bronze'::loyalty_tier
  END;
  NEW.updated_at := NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_update_loyalty_tier
  BEFORE UPDATE ON loyalty_accounts
  FOR EACH ROW EXECUTE FUNCTION update_loyalty_tier();

-- =============================================================================
-- REFERRALS
-- =============================================================================
CREATE TABLE referrals (
  id             TEXT        PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  source_user_id TEXT        NOT NULL REFERENCES users(id),
  target_user_id TEXT        NOT NULL UNIQUE REFERENCES users(id),
  code           TEXT        NOT NULL UNIQUE,
  credit_amount  INTEGER     NOT NULL DEFAULT 1000,   -- cents
  is_redeemed    BOOLEAN     NOT NULL DEFAULT FALSE,
  redeemed_at    TIMESTAMPTZ,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_referrals_source ON referrals (source_user_id);
CREATE INDEX idx_referrals_code   ON referrals (code);

-- =============================================================================
-- WAITLIST
-- =============================================================================
CREATE TABLE waitlist_entries (
  id             TEXT        PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  client_id      TEXT        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  worker_id      TEXT        NOT NULL REFERENCES users(id),
  service_id     TEXT        NOT NULL REFERENCES services(id),
  preferred_date DATE,
  flexible_days  SMALLINT    NOT NULL DEFAULT 3,
  notified       BOOLEAN     NOT NULL DEFAULT FALSE,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (client_id, worker_id, service_id)
);

CREATE INDEX idx_waitlist_worker ON waitlist_entries (worker_id);

-- =============================================================================
-- PORTFOLIO IMAGES
-- =============================================================================
CREATE TABLE portfolio_images (
  id          TEXT        PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  worker_id   TEXT        NOT NULL REFERENCES worker_profiles(id) ON DELETE CASCADE,
  url         TEXT        NOT NULL,
  caption     TEXT,
  category    TEXT,
  sort_order  SMALLINT    NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_portfolio_worker ON portfolio_images (worker_id, sort_order);

-- =============================================================================
-- ANALYTICS EVENTS (raw event log for analytics pipeline)
-- =============================================================================
CREATE TABLE analytics_events (
  id          BIGSERIAL   PRIMARY KEY,
  user_id     TEXT        REFERENCES users(id) ON DELETE SET NULL,
  session_id  TEXT,
  event_type  TEXT        NOT NULL,  -- 'page_view', 'booking_started', 'booking_completed', etc.
  properties  JSONB,
  ip_address  INET,
  user_agent  TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Partitioned by month for efficient range queries (PostgreSQL 11+)
-- In production: CREATE TABLE analytics_events PARTITION BY RANGE (created_at)
CREATE INDEX idx_analytics_user       ON analytics_events (user_id);
CREATE INDEX idx_analytics_type_time  ON analytics_events (event_type, created_at DESC);
CREATE INDEX idx_analytics_props      ON analytics_events USING GIN (properties);

-- =============================================================================
-- VIEWS (commonly queried denormalized data)
-- =============================================================================

-- Worker public listing view
CREATE OR REPLACE VIEW v_worker_listings AS
SELECT
  wp.id,
  wp.slug,
  wp.display_name,
  wp.profession,
  wp.categories,
  wp.specialties,
  wp.average_rating,
  wp.total_reviews,
  wp.is_verified,
  wp.is_featured,
  wp.instant_book,
  wp.deposit_percent,
  wp.subscription_tier,
  u.avatar_url,
  p.city,
  p.state,
  p.latitude,
  p.longitude,
  p.instagram,
  MIN(s.price) AS starting_price,
  COUNT(DISTINCT s.id) AS service_count
FROM   worker_profiles  wp
JOIN   users            u  ON u.id = wp.user_id
LEFT JOIN profiles      p  ON p.user_id = wp.user_id
LEFT JOIN services      s  ON s.worker_id = wp.id AND s.is_active = TRUE
WHERE  wp.is_accepting_clients = TRUE
  AND  u.is_active = TRUE
GROUP  BY wp.id, u.id, p.id;

-- Client dashboard summary view
CREATE OR REPLACE VIEW v_client_booking_summary AS
SELECT
  b.client_id,
  COUNT(*)                                         AS total_bookings,
  SUM(b.total_amount)                              AS total_spent_cents,
  AVG(b.tip_amount)::INTEGER                       AS avg_tip_cents,
  COUNT(*) FILTER (WHERE b.status = 'COMPLETED')   AS completed_count,
  COUNT(*) FILTER (WHERE b.status = 'CANCELLED')   AS cancelled_count,
  MAX(b.booking_date)                              AS last_booking_date
FROM   bookings b
GROUP  BY b.client_id;

-- Worker earnings summary view
CREATE OR REPLACE VIEW v_worker_earnings AS
SELECT
  b.worker_id,
  DATE_TRUNC('month', b.booking_date::TIMESTAMPTZ) AS month,
  COUNT(*)                                          AS bookings,
  SUM(b.total_amount)                               AS gross_revenue_cents,
  SUM(b.platform_fee)                               AS fees_cents,
  SUM(b.worker_payout)                              AS net_payout_cents,
  SUM(b.tip_amount)                                 AS tips_cents
FROM   bookings b
WHERE  b.status = 'COMPLETED'
GROUP  BY b.worker_id, DATE_TRUNC('month', b.booking_date::TIMESTAMPTZ);

-- =============================================================================
-- updated_at TRIGGERS  (auto-update on every write)
-- =============================================================================
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

DO $$ DECLARE tbl TEXT;
BEGIN
  FOREACH tbl IN ARRAY ARRAY['users','worker_profiles','services','shops','bookings','payments','reviews','loyalty_accounts']
  LOOP
    EXECUTE FORMAT(
      'CREATE TRIGGER trg_set_updated_at__%s BEFORE UPDATE ON %s FOR EACH ROW EXECUTE FUNCTION set_updated_at()',
      tbl, tbl
    );
  END LOOP;
END $$;

-- =============================================================================
-- ROW-LEVEL SECURITY (RLS)  — enable after auth is integrated
-- =============================================================================
-- ALTER TABLE users              ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE bookings           ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE payments           ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE notifications      ENABLE ROW LEVEL SECURITY;

-- Clients see only their own bookings
-- CREATE POLICY bookings_client_select ON bookings
--   FOR SELECT USING (client_id = current_user_id() OR worker_id = current_user_id());

-- Workers can update bookings they are assigned to
-- CREATE POLICY bookings_worker_update ON bookings
--   FOR UPDATE USING (worker_id = current_user_id());

-- =============================================================================
-- SEED DATA (dev/demo)  — comment out in production
-- =============================================================================
-- INSERT INTO users (id, email, name, password_hash, role) VALUES
--   ('u_alex',    'alex@demo.com',    'Alex Johnson',   '$2b$10$placeholder', 'CLIENT'),
--   ('u_destiny', 'destiny@demo.com', 'Destiny Williams','$2b$10$placeholder', 'WORKER'),
--   ('u_shop',    'owner@demo.com',   'Urban Glow LLC',  '$2b$10$placeholder', 'SHOP_OWNER');
