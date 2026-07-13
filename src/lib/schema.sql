-- Lightweight SQLite schema for the VEST member portal.
-- This works with a local file (e.g. file:./vest.db) or with Turso/libsql in production.

CREATE TABLE IF NOT EXISTS members (
  id TEXT PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('active', 'alumni')),
  vest_title TEXT,
  class_year TEXT,
  joined_year TEXT,
  one_liner TEXT,
  bio TEXT,
  image_src TEXT,
  email TEXT,
  phone TEXT,
  linkedin TEXT,
  twitter TEXT,
  github TEXT,
  website TEXT,
  interests TEXT,     -- JSON array
  experiences TEXT,   -- JSON array
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_members_status ON members(status);
CREATE INDEX IF NOT EXISTS idx_members_last_name ON members(last_name);
