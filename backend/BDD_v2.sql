-- ============================================================
--  Funkidz Animation — Base de données v2 (PostgreSQL)
--  Mise à jour : Passage aux UUID pour toutes les clés
-- ============================================================

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ------------------------------------------------------------
-- 1. users
-- ------------------------------------------------------------
CREATE TABLE users (
  id            UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  email         VARCHAR(255)  UNIQUE NOT NULL,
  password_hash VARCHAR(255)  NOT NULL,
  role          VARCHAR(20)   NOT NULL DEFAULT 'CLIENT', -- En Django, on utilise souvent VARCHAR avec des choix
  is_verified   BOOLEAN       NOT NULL DEFAULT FALSE,
  created_at    TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ------------------------------------------------------------
-- 2. animateur_profiles
-- ------------------------------------------------------------
CREATE TABLE animateur_profiles (
  id           UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID          NOT NULL UNIQUE,
  first_name   VARCHAR(100)  NOT NULL,
  last_name    VARCHAR(100)  NOT NULL,
  phone        VARCHAR(20),
  bio          TEXT,
  is_available BOOLEAN       NOT NULL DEFAULT TRUE,
  created_at   TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at   TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ------------------------------------------------------------
-- 3. services
-- ------------------------------------------------------------
CREATE TABLE services (
  id               UUID           PRIMARY KEY DEFAULT gen_random_uuid(),
  title            VARCHAR(255)   NOT NULL,
  description      TEXT           NOT NULL,
  base_price       DECIMAL(10,2)  NOT NULL,
  duration_minutes INT            NOT NULL,
  category         VARCHAR(100)   NOT NULL,
  is_active        BOOLEAN        NOT NULL DEFAULT TRUE,
  created_at       TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at       TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ------------------------------------------------------------
-- 4. options
-- ------------------------------------------------------------
CREATE TABLE options (
  id           UUID           PRIMARY KEY DEFAULT gen_random_uuid(),
  name         VARCHAR(255)   NOT NULL,
  description  TEXT,
  price        DECIMAL(10,2)  NOT NULL,
  pricing_type VARCHAR(20)    NOT NULL, -- FIXED, PER_CHILD, PER_HOUR
  is_active    BOOLEAN        NOT NULL DEFAULT TRUE
);

-- ------------------------------------------------------------
-- 5. service_options
-- ------------------------------------------------------------
CREATE TABLE service_options (
  service_id UUID NOT NULL,
  option_id  UUID NOT NULL,
  PRIMARY KEY (service_id, option_id)
);

-- ------------------------------------------------------------
-- 6. bookings
-- ------------------------------------------------------------
CREATE TABLE bookings (
  id                  UUID           PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_number      VARCHAR(50)    UNIQUE NOT NULL,
  user_id             UUID           NOT NULL,
  service_id          UUID           NOT NULL,
  status              VARCHAR(20)    NOT NULL DEFAULT 'PENDING',
  event_date          DATE           NOT NULL,
  start_time          TIME           NOT NULL,
  address             VARCHAR(255)   NOT NULL,
  city                VARCHAR(100)   NOT NULL,
  children_count      INT            NOT NULL,
  duration_minutes    INT            NOT NULL,
  notes               TEXT,
  estimated_price     DECIMAL(10,2)  NOT NULL,
  final_price         DECIMAL(10,2),
  cancelled_at        TIMESTAMP,
  cancellation_reason TEXT,
  created_at          TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at          TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT uq_slot UNIQUE (event_date, start_time)
);

-- ------------------------------------------------------------
-- 7. booking_options
-- ------------------------------------------------------------
CREATE TABLE booking_options (
  id          UUID           PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id  UUID           NOT NULL,
  option_id   UUID           NOT NULL,
  quantity    INT            NOT NULL DEFAULT 1,
  unit_price  DECIMAL(10,2)  NOT NULL,
  total_price DECIMAL(10,2)  NOT NULL
);

-- ------------------------------------------------------------
-- 8. booking_assignments
-- ------------------------------------------------------------
CREATE TABLE booking_assignments (
  id            UUID      PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id    UUID      NOT NULL,
  animateur_id  UUID      NOT NULL,
  status        VARCHAR(20) NOT NULL DEFAULT 'PENDING',
  assigned_by   VARCHAR(20) NOT NULL,
  assigned_at   TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP,
  responded_at  TIMESTAMP
);

-- ------------------------------------------------------------
-- 9. payments
-- ------------------------------------------------------------
CREATE TABLE payments (
  id                UUID           PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id        UUID           UNIQUE NOT NULL,
  provider          VARCHAR(50)    NOT NULL DEFAULT 'STRIPE',
  stripe_session_id VARCHAR(255)   UNIQUE,
  amount            DECIMAL(10,2)  NOT NULL,
  currency          VARCHAR(10)    NOT NULL DEFAULT 'EUR',
  status            VARCHAR(20)    NOT NULL,
  created_at        TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ------------------------------------------------------------
-- 10. availability
-- ------------------------------------------------------------
CREATE TABLE availability (
  id            UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  animateur_id  UUID          NOT NULL,
  blocked_date  DATE         NOT NULL,
  blocked_start TIME         NOT NULL,
  blocked_end   TIME         NOT NULL,
  reason        VARCHAR(255),
  created_at    TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ------------------------------------------------------------
-- 11. media_gallery
-- ------------------------------------------------------------
CREATE TABLE media_gallery (
  id            UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  title         VARCHAR(255) NOT NULL,
  type          VARCHAR(10)  NOT NULL,
  file_url      VARCHAR(255) NOT NULL,
  thumbnail_url VARCHAR(255),
  service_id    UUID,
  is_visible    BOOLEAN      NOT NULL DEFAULT TRUE,
  created_at    TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ------------------------------------------------------------
-- 12. contact_messages
-- ------------------------------------------------------------
CREATE TABLE contact_messages (
  id         UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  name       VARCHAR(255) NOT NULL,
  email      VARCHAR(255) NOT NULL,
  phone      VARCHAR(20),
  message    TEXT         NOT NULL,
  created_at TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
--  FOREIGN KEYS
-- ============================================================

ALTER TABLE animateur_profiles
  ADD CONSTRAINT fk_ap_user
  FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE;

ALTER TABLE service_options
  ADD CONSTRAINT fk_so_service
  FOREIGN KEY (service_id) REFERENCES services (id) ON DELETE CASCADE;

ALTER TABLE service_options
  ADD CONSTRAINT fk_so_option
  FOREIGN KEY (option_id) REFERENCES options (id) ON DELETE CASCADE;

ALTER TABLE bookings
  ADD CONSTRAINT fk_b_user
  FOREIGN KEY (user_id) REFERENCES users (id);

ALTER TABLE bookings
  ADD CONSTRAINT fk_b_service
  FOREIGN KEY (service_id) REFERENCES services (id);

ALTER TABLE booking_options
  ADD CONSTRAINT fk_bo_booking
  FOREIGN KEY (booking_id) REFERENCES bookings (id) ON DELETE CASCADE;

ALTER TABLE booking_options
  ADD CONSTRAINT fk_bo_option
  FOREIGN KEY (option_id) REFERENCES options (id);

ALTER TABLE booking_assignments
  ADD CONSTRAINT fk_ba_booking
  FOREIGN KEY (booking_id) REFERENCES bookings (id) ON DELETE CASCADE;

ALTER TABLE booking_assignments
  ADD CONSTRAINT fk_ba_animateur
  FOREIGN KEY (animateur_id) REFERENCES animateur_profiles (id);

ALTER TABLE payments
  ADD CONSTRAINT fk_pay_booking
  FOREIGN KEY (booking_id) REFERENCES bookings (id);

ALTER TABLE availability
  ADD CONSTRAINT fk_av_animateur
  FOREIGN KEY (animateur_id) REFERENCES animateur_profiles (id) ON DELETE CASCADE;

ALTER TABLE media_gallery
  ADD CONSTRAINT fk_mg_service
  FOREIGN KEY (service_id) REFERENCES services (id) ON DELETE SET NULL;
