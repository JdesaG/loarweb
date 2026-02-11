
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table: Products
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  base_price NUMERIC(10, 2) NOT NULL DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  images TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table: Inventory (Variants)
CREATE TABLE inventory (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  style TEXT,
  material TEXT,
  design_type TEXT,
  color TEXT,
  size TEXT,
  quantity_available INT DEFAULT 0,
  is_visible BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table: Pricing Rules
CREATE TABLE pricing (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  style TEXT,
  material TEXT,
  design_type TEXT,
  price NUMERIC(10, 2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table: Orders
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_code TEXT UNIQUE,
  customer_info JSONB NOT NULL,
  status TEXT DEFAULT 'pending', -- pending, processing, shipped, completed, cancelled
  total_amount NUMERIC(10, 2) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table: Order Items
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id),
  quantity INT NOT NULL,
  unit_price NUMERIC(10, 2) NOT NULL,
  subtotal NUMERIC(10, 2) NOT NULL,
  design_details JSONB, -- Stores specific choices like color, size, text, custom images
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Function: update_updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for products
CREATE TRIGGER update_products_updated_at
BEFORE UPDATE ON products
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

-- Trigger for inventory
CREATE TRIGGER update_inventory_updated_at
BEFORE UPDATE ON inventory
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

-- Trigger for orders
CREATE TRIGGER update_orders_updated_at
BEFORE UPDATE ON orders
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

-- Function: generate_order_code (ORD-AAAA-NNNN)
CREATE OR REPLACE FUNCTION generate_order_code()
RETURNS TRIGGER AS $$
DECLARE
  year_str TEXT;
  seq_num INT;
  new_code TEXT;
BEGIN
  -- Format: ORD-YYYY-SEQUENCE
  year_str := to_char(NOW(), 'YYYY');
  
  -- Get the count of orders for this year to generate sequence
  -- Using a sequence object would be better for concurrency, but this is simple per requirements
  -- A better approach for high volume: CREATE SEQUENCE order_seq;
  
  -- Simple approach: Count orders in current year + 1
  SELECT COUNT(*) + 1 INTO seq_num
  FROM orders
  WHERE to_char(created_at, 'YYYY') = year_str;
  
  -- Format: ORD-2024-0001
  new_code := 'ORD-' || year_str || '-' || lpad(seq_num::text, 4, '0');
  
  -- Ensure uniqueness (simple retry logic could be added, but minimal collision risk for low volume)
  NEW.order_code := new_code;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for order code
CREATE TRIGGER set_order_code
BEFORE INSERT ON orders
FOR EACH ROW
EXECUTE FUNCTION generate_order_code();

-- Function: get_product_price RPC
-- Returns table with pricing_id and unit_price
CREATE OR REPLACE FUNCTION get_product_price(
  p_product_id UUID,
  p_style_name TEXT,
  p_material TEXT,
  p_design_type TEXT,
  p_quantity INT
)
RETURNS TABLE (pricing_id UUID, unit_price NUMERIC)
AS $$
BEGIN
  -- Try to find exact match in pricing table
  -- This logic can be customized. Here we assume specific pricing rules exist.
  -- If not found, fallback to product base price
  
  RETURN QUERY
  SELECT p.id, p.price
  FROM pricing p
  WHERE p.product_id = p_product_id
    AND (p.style IS NULL OR p.style = p_style_name)
    AND (p.material IS NULL OR p.material = p_material)
    AND (p.design_type IS NULL OR p.design_type = p_design_type)
  ORDER BY 
    -- Prioritize more specific matches
    (CASE WHEN p.style IS NOT NULL THEN 1 ELSE 0 END +
     CASE WHEN p.material IS NOT NULL THEN 1 ELSE 0 END +
     CASE WHEN p.design_type IS NOT NULL THEN 1 ELSE 0 END) DESC
  LIMIT 1;
  
  -- If no pricing rule found, we could return base price from products table
  -- But the interface asks for pricing_id.
  -- You might want to handle 'no match' in the application or return a default row.
END;
$$ LANGUAGE plpgsql;

-- RLS Policies
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE pricing ENABLE ROW LEVEL SECURITY;

-- Products: Public Read, Admin Write
CREATE POLICY "Public Read Products" ON products FOR SELECT USING (true);
CREATE POLICY "Admin Write Products" ON products FOR ALL USING (auth.role() = 'service_role');

-- Inventory: Public Read, Admin Write
CREATE POLICY "Public Read Inventory" ON inventory FOR SELECT USING (true);
CREATE POLICY "Admin Write Inventory" ON inventory FOR ALL USING (auth.role() = 'service_role');

-- Pricing: Public Read, Admin Write
CREATE POLICY "Public Read Pricing" ON pricing FOR SELECT USING (true);
CREATE POLICY "Admin Write Pricing" ON pricing FOR ALL USING (auth.role() = 'service_role');

-- Orders: Authenticated Read (Admin), Public Insert (for Checkout)
-- Assuming 'service_role' for Admin Dashboard.
-- Public users need to insert orders at checkout.
CREATE POLICY "Admin All Orders" ON orders FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Public Insert Orders" ON orders FOR INSERT WITH CHECK (true);
-- Allow public to read their own order? No user ID. Maybe by order ID + match?
-- For now, read is restricted to Admin.

-- Order Items: Same as Orders
CREATE POLICY "Admin All Order Items" ON order_items FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Public Insert Order Items" ON order_items FOR INSERT WITH CHECK (true);

-- Storage Bucket: designs
-- Need to create bucket via SQL or Dashboard. SQL:
INSERT INTO storage.buckets (id, name, public) VALUES ('designs', 'designs', true)
ON CONFLICT (id) DO NOTHING;

-- Storage Policy: Public Read
CREATE POLICY "Public Read Designs" ON storage.objects FOR SELECT
USING (bucket_id = 'designs');

-- Storage Policy: Authenticated Write (or via Signed URL which bypasses RLS if token is valid)
-- If using Service Role to upload, it bypasses RLS.
-- If allowing client-side upload with signed URL created by server, that works.
-- If allowing direct client upload (authenticated user), we need a policy.
-- Assuming Admin uploads or System uploads:
CREATE POLICY "Admin Write Designs" ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'designs' AND auth.role() = 'service_role');

-- Enable Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE products;
ALTER PUBLICATION supabase_realtime ADD TABLE inventory;
ALTER PUBLICATION supabase_realtime ADD TABLE orders;
