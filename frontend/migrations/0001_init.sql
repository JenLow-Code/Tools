-- JenLow Tools — D1 schema (metadata + catalogue + editorial + marketplace).
-- Media (product photos, category art) is NOT stored here; only its path/URL is.
-- Apply with:  wrangler d1 migrations apply jenlow-tools

-- Generic key/value metadata table (catalogue version, flags, counters, …).
CREATE TABLE IF NOT EXISTS metadata (
  key        TEXT PRIMARY KEY,
  value      TEXT,
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- ---- Identity ----
-- Authentication lives in Supabase (one account across JenLow Network + Tools).
-- We never store passwords here; `account_id` is the Supabase auth user id (uuid).
-- A profile is this app's view of that account — the "Tools profile" of the user.
CREATE TABLE IF NOT EXISTS profiles (
  account_id   TEXT PRIMARY KEY,         -- = Supabase auth.users.id
  display_name TEXT,
  locale       TEXT NOT NULL DEFAULT 'fr',
  created_at   TEXT NOT NULL DEFAULT (datetime('now'))
);

-- ---- Content translations (DE / PT / EN added later; FR is the source) ----
-- Translatable fields of catalogue/editorial rows, one row per locale.
CREATE TABLE IF NOT EXISTS translations (
  entity    TEXT NOT NULL,               -- 'product' | 'category' | 'news' | 'release' | 'event' | 'tool'
  entity_id TEXT NOT NULL,
  field     TEXT NOT NULL,               -- e.g. 'description', 'summary', 'name'
  locale    TEXT NOT NULL,               -- 'de' | 'pt' | 'en'
  value     TEXT NOT NULL,
  PRIMARY KEY (entity, entity_id, field, locale)
);

-- ---- Catalogue (shared, seeded) ----
CREATE TABLE IF NOT EXISTS categories (
  id       TEXT PRIMARY KEY,
  name     TEXT NOT NULL,
  subs     TEXT NOT NULL DEFAULT '[]',   -- JSON array
  fields   TEXT NOT NULL DEFAULT '[]',   -- JSON array
  icon     TEXT,                         -- media path, e.g. /assets/cat/interfaces.svg
  position INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS products (
  id               TEXT PRIMARY KEY,
  brand            TEXT NOT NULL,
  model            TEXT NOT NULL,
  category         TEXT NOT NULL REFERENCES categories(id),
  sub              TEXT,
  description      TEXT,
  usage            TEXT,
  strengths        TEXT NOT NULL DEFAULT '[]',  -- JSON array
  limitations      TEXT NOT NULL DEFAULT '[]',  -- JSON array
  specs            TEXT NOT NULL DEFAULT '{}',  -- JSON object
  manufacturer_url TEXT,
  sources          TEXT NOT NULL DEFAULT '[]',  -- JSON array [{label,url}]
  image            TEXT,                        -- media path
  image_credit     TEXT,
  checked_at       TEXT,
  editorial_refs   TEXT NOT NULL DEFAULT '[]'   -- JSON array
);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);

CREATE TABLE IF NOT EXISTS guides (
  id       TEXT PRIMARY KEY,
  title    TEXT NOT NULL,
  intro    TEXT,
  sections TEXT NOT NULL DEFAULT '[]'  -- JSON
);

CREATE TABLE IF NOT EXISTS configurations (
  id    TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  intro TEXT,
  items TEXT NOT NULL DEFAULT '[]'  -- JSON
);

-- ---- Editorial (News tab) ----
CREATE TABLE IF NOT EXISTS news (
  id          TEXT PRIMARY KEY,
  title       TEXT NOT NULL,
  category    TEXT,
  date        TEXT,
  summary     TEXT,
  source      TEXT,
  source_name TEXT,
  image       TEXT,
  image_credit TEXT,
  image_alt   TEXT,
  tags        TEXT NOT NULL DEFAULT '[]',
  product_ids TEXT NOT NULL DEFAULT '[]',
  section     TEXT
);

CREATE TABLE IF NOT EXISTS releases (
  id          TEXT PRIMARY KEY,
  title       TEXT NOT NULL,
  family      TEXT,
  date        TEXT,
  summary     TEXT,
  source      TEXT,
  source_name TEXT,
  image       TEXT,
  product_ids TEXT NOT NULL DEFAULT '[]'
);

CREATE TABLE IF NOT EXISTS events (
  id          TEXT PRIMARY KEY,
  title       TEXT NOT NULL,
  kind        TEXT,
  start       TEXT,
  end         TEXT,
  region      TEXT,
  format      TEXT,
  location    TEXT,
  venue       TEXT,
  summary     TEXT,
  practical   TEXT,
  source      TEXT,
  source_name TEXT,
  image       TEXT
);

-- ---- Gear Exchange (shared marketplace) ----
-- direction: 'offer' | 'request'
CREATE TABLE IF NOT EXISTS listings (
  id           TEXT PRIMARY KEY,
  account_id   TEXT,                     -- Supabase user id of the poster (null for seeded samples)
  person_name  TEXT,                     -- display name shown on the card ("Anna")
  direction    TEXT NOT NULL DEFAULT 'offer',
  title        TEXT NOT NULL,
  category     TEXT,
  product_id   TEXT,
  type         TEXT,                     -- sell | rent | lend | borrow
  price        REAL,
  location     TEXT,
  availability TEXT,
  note         TEXT,
  source       TEXT NOT NULL DEFAULT 'tools',   -- tools | network
  is_sample    INTEGER NOT NULL DEFAULT 0,
  created_at   TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_listings_direction ON listings(direction);

-- ---- Tools tab (planned tools) ----
CREATE TABLE IF NOT EXISTS tools (
  id       TEXT PRIMARY KEY,
  name     TEXT NOT NULL,
  status   TEXT,
  text     TEXT,
  steps    TEXT NOT NULL DEFAULT '[]',
  note     TEXT,
  icon     TEXT,
  position INTEGER NOT NULL DEFAULT 0
);

-- ---- Personal studios (optional; unused until auth is added) ----
-- Kept here so the structured data can move off the browser once there are users.
CREATE TABLE IF NOT EXISTS studios (
  id         TEXT PRIMARY KEY,
  account_id TEXT,                       -- = Supabase auth user id (null until auth is wired)
  name       TEXT NOT NULL,
  locations  TEXT NOT NULL DEFAULT '[]',
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS items (
  id         TEXT PRIMARY KEY,
  studio_id  TEXT NOT NULL REFERENCES studios(id),
  name       TEXT NOT NULL,
  brand      TEXT,
  category   TEXT,
  location   TEXT,
  condition  TEXT,
  serial     TEXT,
  status     TEXT NOT NULL DEFAULT 'Available',
  added_at   TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_items_studio ON items(studio_id);
