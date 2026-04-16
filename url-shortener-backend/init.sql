CREATE TABLE IF NOT EXISTS urls (
  id            UUID PRIMARY KEY     DEFAULT gen_random_uuid(),
  code       VARCHAR(7) UNIQUE,
  long_url   TEXT        NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS clicks (
  id            UUID PRIMARY KEY     DEFAULT gen_random_uuid(),
  code       VARCHAR(7) NOT NULL,
  clicked_at TIMESTAMPTZ NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_urls_code ON urls(code);
