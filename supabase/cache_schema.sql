CREATE TABLE stock_prices (
  ticker TEXT PRIMARY KEY,
  price NUMERIC,
  change_pct NUMERIC,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
