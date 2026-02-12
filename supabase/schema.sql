-- ============================================================================
-- LOAR Backend — Full Database Schema
-- Run this in Supabase Dashboard → SQL Editor
-- ============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";


-- ════════════════════════════════════════════════════════════════════════════
-- TABLES
-- ════════════════════════════════════════════════════════════════════════════

-- Products (base catalog)
CREATE TABLE products (
  id             UUID           PRIMARY KEY DEFAULT uuid_generate_v4(),
  name           TEXT           NOT NULL,
  description    TEXT,
  base_price     NUMERIC(10,2) NOT NULL DEFAULT 0,
  is_active      BOOLEAN        DEFAULT true,
  images         TEXT[]         DEFAULT '{}',
  created_at     TIMESTAMPTZ    DEFAULT now(),
  updated_at     TIMESTAMPTZ    DEFAULT now()
);

-- Inventory (variant-level stock)
CREATE TABLE inventory (
  id                 UUID           PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id         UUID           REFERENCES products(id) ON DELETE CASCADE,
  style              TEXT,
  material           TEXT,
  design_type        TEXT,
  color              TEXT,
  size               TEXT,
  quantity_available  INT            DEFAULT 0,
  is_visible         BOOLEAN        DEFAULT true,
  created_at         TIMESTAMPTZ    DEFAULT now(),
  updated_at         TIMESTAMPTZ    DEFAULT now()
);

-- Pricing rules (combination-based pricing)
CREATE TABLE pricing (
  id           UUID           PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id   UUID           REFERENCES products(id) ON DELETE CASCADE,
  style        TEXT,
  material     TEXT,
  design_type  TEXT,
  price        NUMERIC(10,2) NOT NULL,
  created_at   TIMESTAMPTZ    DEFAULT now()
);

-- Orders
CREATE TABLE orders (
  id            UUID           PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_code    TEXT           UNIQUE,
  customer_info JSONB          NOT NULL,
  status        TEXT           DEFAULT 'pending',  -- pending | processing | shipped | completed | cancelled
  total_amount  NUMERIC(10,2) NOT NULL DEFAULT 0,
  created_at    TIMESTAMPTZ    DEFAULT now(),
  updated_at    TIMESTAMPTZ    DEFAULT now()
);

-- Order items
CREATE TABLE order_items (
  id              UUID           PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id        UUID           REFERENCES orders(id) ON DELETE CASCADE,
  product_id      UUID           REFERENCES products(id),
  quantity        INT            NOT NULL,
  unit_price      NUMERIC(10,2) NOT NULL,
  subtotal        NUMERIC(10,2) NOT NULL,
  design_details  JSONB,
  created_at      TIMESTAMPTZ    DEFAULT now()
);


-- ════════════════════════════════════════════════════════════════════════════
-- FUNCTIONS & TRIGGERS
-- ════════════════════════════════════════════════════════════════════════════

-- ── update_updated_at() ────────────────────────────────────────────────────
-- Generic trigger function to auto-set updated_at on UPDATE
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_inventory_updated_at
  BEFORE UPDATE ON inventory
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();


-- ── generate_order_code() ──────────────────────────────────────────────────
-- Produces ORD-YYYY-NNNN before INSERT on orders
CREATE OR REPLACE FUNCTION generate_order_code()
RETURNS TRIGGER AS $$
DECLARE
  year_str TEXT;
  seq_num  INT;
BEGIN
  year_str := to_char(now(), 'YYYY');

  SELECT count(*) + 1 INTO seq_num
    FROM orders
   WHERE to_char(created_at, 'YYYY') = year_str;

  NEW.order_code := 'ORD-' || year_str || '-' || lpad(seq_num::text, 4, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_set_order_code
  BEFORE INSERT ON orders
  FOR EACH ROW EXECUTE FUNCTION generate_order_code();


-- ── get_product_price() RPC ────────────────────────────────────────────────
-- Returns the most specific matching pricing rule for a given combination.
-- Falls back to nothing if no rule matches (app handles fallback to base_price).
CREATE OR REPLACE FUNCTION get_product_price(
  p_product_id  UUID,
  p_style_name  TEXT,
  p_material    TEXT,
  p_design_type TEXT,
  p_quantity    INT
)
RETURNS TABLE (pricing_id UUID, unit_price NUMERIC) AS $$
BEGIN
  RETURN QUERY
  SELECT p.id, p.price
    FROM pricing p
   WHERE p.product_id = p_product_id
     AND (p.style       IS NULL OR p.style       = p_style_name)
     AND (p.material    IS NULL OR p.material    = p_material)
     AND (p.design_type IS NULL OR p.design_type = p_design_type)
   ORDER BY
     -- More specific matches first
     (CASE WHEN p.style       IS NOT NULL THEN 1 ELSE 0 END +
      CASE WHEN p.material    IS NOT NULL THEN 1 ELSE 0 END +
      CASE WHEN p.design_type IS NOT NULL THEN 1 ELSE 0 END) DESC
   LIMIT 1;
END;
$$ LANGUAGE plpgsql;


-- ════════════════════════════════════════════════════════════════════════════
-- ROW LEVEL SECURITY (RLS)
-- ════════════════════════════════════════════════════════════════════════════

ALTER TABLE products    ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory   ENABLE ROW LEVEL SECURITY;
ALTER TABLE pricing     ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders      ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Products: public read, admin write
CREATE POLICY "Public read products"  ON products  FOR SELECT USING (true);
CREATE POLICY "Admin write products"  ON products  FOR ALL    USING (auth.role() = 'service_role');

-- Inventory: public read, admin write
CREATE POLICY "Public read inventory" ON inventory FOR SELECT USING (true);
CREATE POLICY "Admin write inventory" ON inventory FOR ALL    USING (auth.role() = 'service_role');

-- Pricing: public read, admin write
CREATE POLICY "Public read pricing"   ON pricing   FOR SELECT USING (true);
CREATE POLICY "Admin write pricing"   ON pricing   FOR ALL    USING (auth.role() = 'service_role');

-- Orders: admin full access + public insert (checkout)
CREATE POLICY "Admin all orders"      ON orders      FOR ALL    USING (auth.role() = 'service_role');
CREATE POLICY "Public insert orders"  ON orders      FOR INSERT WITH CHECK (true);

-- Order items: admin full access + public insert
CREATE POLICY "Admin all order_items"     ON order_items FOR ALL    USING (auth.role() = 'service_role');
CREATE POLICY "Public insert order_items" ON order_items FOR INSERT WITH CHECK (true);


-- ════════════════════════════════════════════════════════════════════════════
-- STORAGE BUCKET: designs
-- ════════════════════════════════════════════════════════════════════════════

INSERT INTO storage.buckets (id, name, public)
VALUES ('designs', 'designs', true)
ON CONFLICT (id) DO NOTHING;

-- Public read on the designs bucket
CREATE POLICY "Public read designs" ON storage.objects
  FOR SELECT USING (bucket_id = 'designs');

-- Write restricted to service_role (API routes use signed URLs)
CREATE POLICY "Admin write designs" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'designs' AND auth.role() = 'service_role');


-- ════════════════════════════════════════════════════════════════════════════
-- REALTIME
-- ════════════════════════════════════════════════════════════════════════════

ALTER PUBLICATION supabase_realtime ADD TABLE products;
ALTER PUBLICATION supabase_realtime ADD TABLE inventory;
ALTER PUBLICATION supabase_realtime ADD TABLE orders;
