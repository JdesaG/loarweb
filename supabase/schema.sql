-- ============================================
-- TABLA: products
-- Catálogo de productos base
-- ============================================

CREATE TABLE products (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    sku VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL CHECK (category IN ('ropa_superior', 'ropa_interior', 'accesorios', 'hogar')),
    base_image TEXT,
    has_sizes BOOLEAN DEFAULT true,
    available_sizes TEXT[] DEFAULT '{}',
    available_colors TEXT[] DEFAULT '{}',
    available_materials TEXT[] DEFAULT '{}',
    has_styles BOOLEAN DEFAULT false,
    available_styles TEXT[] DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Trigger para updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    new.updated_at = now();
    RETURN new;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_products_updated_at 
BEFORE UPDATE ON products 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- TABLA: product_pricing
-- Precios por combinación de producto, estilo, material, tipo de diseño y rango de cantidad
-- ============================================

CREATE TABLE product_pricing (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    style_name VARCHAR(100) NOT NULL DEFAULT 'default',
    design_type VARCHAR(20) NOT NULL CHECK (design_type IN ('sin_diseño', 'normal', 'dual')),
    material VARCHAR(20) NOT NULL CHECK (material IN ('llano', 'dtf', 'bordado', 'sublimado')),
    min_qty INTEGER NOT NULL CHECK (min_qty > 0),
    max_qty INTEGER NOT NULL CHECK (max_qty >= min_qty),
    price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    
    UNIQUE(product_id, style_name, material, design_type, min_qty)
);

-- Función para evitar rangos solapados
CREATE OR REPLACE FUNCTION check_pricing_overlap()
RETURNS TRIGGER AS $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM product_pricing
        WHERE product_id = new.product_id
          AND style_name = new.style_name
          AND material = new.material
          AND design_type = new.design_type
          AND id != COALESCE(new.id, '00000000-0000-0000-0000-000000000000'::uuid)
          AND int4range(min_qty, max_qty, '[]') && int4range(new.min_qty, new.max_qty, '[]')
    ) THEN
        RAISE EXCEPTION 'Rango de cantidad solapado para esta combinación';
    END IF;
    RETURN new;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER prevent_pricing_overlap
    BEFORE INSERT OR UPDATE ON product_pricing
    FOR EACH ROW EXECUTE FUNCTION check_pricing_overlap();

-- ============================================
-- TABLA: inventory
-- Stock por combinación de producto, color y talla
-- ============================================

CREATE TABLE inventory (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    color VARCHAR(100) NOT NULL,
    size VARCHAR(10),
    quantity_available INTEGER DEFAULT 0,
    is_visible BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- ============================================
-- TABLA: orders
-- Órdenes de compra
-- ============================================

CREATE TABLE orders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    order_code VARCHAR(50) UNIQUE NOT NULL,
    customer_name VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(20) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    customer_id_card VARCHAR(20) NOT NULL,
    data_consent BOOLEAN DEFAULT false,
    subtotal DECIMAL(10,2) NOT NULL,
    tax DECIMAL(10,2) DEFAULT 0,
    total DECIMAL(10,2) NOT NULL,
    status VARCHAR(50) DEFAULT 'pendiente',
    payment_status VARCHAR(50) DEFAULT 'pendiente',
    delivery_method VARCHAR(50) DEFAULT 'retiro_tienda',
    location_url TEXT,
    payment_receipt_url TEXT,
    payment_method VARCHAR(50),
    notas TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TRIGGER update_orders_updated_at 
BEFORE UPDATE ON orders 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Función para generar código de orden
CREATE OR REPLACE FUNCTION generate_order_code()
RETURNS TRIGGER AS $$
DECLARE
    year TEXT;
    sequence_num INTEGER;
    new_code TEXT;
BEGIN
    year := to_char(now(), 'YYYY');
    SELECT count(*) + 1 INTO sequence_num 
    FROM orders 
    WHERE extract(year FROM created_at) = extract(year FROM now());
    new_code := 'ORD-' || year || '-' || lpad(sequence_num::text, 4, '0');
    new.order_code := new_code;
    RETURN new;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_order_code 
BEFORE INSERT ON orders 
FOR EACH ROW EXECUTE FUNCTION generate_order_code();

-- ============================================
-- TABLA: order_items
-- Items de cada orden
-- ============================================

CREATE TABLE order_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id),
    pricing_id UUID REFERENCES product_pricing(id),
    product_name VARCHAR(255) NOT NULL,
    selected_color VARCHAR(100) NOT NULL,
    selected_size VARCHAR(10),
    material VARCHAR(20) NOT NULL,
    design_type VARCHAR(20) NOT NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    unit_price DECIMAL(10,2) NOT NULL,
    design_main_url TEXT,
    design_secondary_url TEXT,
    placement_instructions TEXT,
    add_initial BOOLEAN DEFAULT false,
    initial_letter VARCHAR(5),
    initial_price DECIMAL(10,2) DEFAULT 0.50,
    item_total DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- ============================================
-- TABLA: activity_logs
-- Historial de acciones
-- ============================================

CREATE TABLE activity_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT now(),
    action_type VARCHAR(50) NOT NULL,
    severity VARCHAR(20) DEFAULT 'info' CHECK (severity IN ('info', 'warning', 'error', 'critical')),
    actor_type VARCHAR(20) NOT NULL CHECK (actor_type IN ('customer', 'admin', 'system')),
    actor_identifier VARCHAR(255) NOT NULL,
    ip_address INET,
    resource_type VARCHAR(50) NOT NULL,
    resource_id UUID,
    details JSONB DEFAULT '{}',
    metadata JSONB DEFAULT '{}',
    related_entities JSONB DEFAULT '[]'
);

-- Índices para logs
CREATE INDEX idx_activity_logs_timestamp ON activity_logs(timestamp DESC);
CREATE INDEX idx_activity_logs_action_type ON activity_logs(action_type, timestamp DESC);
CREATE INDEX idx_activity_logs_actor ON activity_logs(actor_identifier);
CREATE INDEX idx_activity_logs_resource ON activity_logs(resource_type, resource_id);

-- ============================================
-- FUNCIONES RPC
-- ============================================

-- Función para obtener precio según cantidad
CREATE OR REPLACE FUNCTION get_product_price(
    p_product_id UUID,
    p_style_name VARCHAR,
    p_material VARCHAR,
    p_design_type VARCHAR,
    p_quantity INTEGER
)
RETURNS TABLE (
    pricing_id UUID,
    price DECIMAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        pp.id,
        pp.price
    FROM product_pricing pp
    WHERE pp.product_id = p_product_id
      AND pp.style_name = p_style_name
      AND pp.material = p_material
      AND pp.design_type = p_design_type
      AND p_quantity BETWEEN pp.min_qty AND pp.max_qty
    LIMIT 1;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Habilitar RLS en todas las tablas
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_pricing ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

-- Forzar RLS en todas las tablas
ALTER TABLE products FORCE ROW LEVEL SECURITY;
ALTER TABLE product_pricing FORCE ROW LEVEL SECURITY;
ALTER TABLE inventory FORCE ROW LEVEL SECURITY;
ALTER TABLE orders FORCE ROW LEVEL SECURITY;
ALTER TABLE order_items FORCE ROW LEVEL SECURITY;
ALTER TABLE activity_logs FORCE ROW LEVEL SECURITY;

-- ============================================
-- POLÍTICAS RLS - PRODUCTS
-- ============================================

CREATE POLICY "Public read active products" 
ON products FOR SELECT 
USING (is_active = true);

-- ============================================
-- POLÍTICAS RLS - PRODUCT_PRICING
-- ============================================

CREATE POLICY "No direct access" 
ON product_pricing FOR SELECT 
USING (false);

CREATE POLICY "Admin full access pricing" 
ON product_pricing FOR ALL 
USING (auth.role() = 'admin');

-- ============================================
-- POLÍTICAS RLS - INVENTORY
-- ============================================

CREATE POLICY "Public visible inventory" 
ON inventory FOR SELECT 
USING (is_visible = true);

-- ============================================
-- POLÍTICAS RLS - ORDERS
-- ============================================

-- Clientes ven sus propias órdenes (por email o teléfono)
CREATE POLICY "Users own orders"
ON orders FOR ALL 
USING (customer_email = auth.jwt() ->> 'email' OR customer_phone = auth.jwt() ->> 'phone');

-- Admin tiene acceso total
CREATE POLICY "Admin full access orders"
ON orders FOR ALL 
USING (auth.role() = 'admin');

-- ============================================
-- POLÍTICAS RLS - ORDER_ITEMS
-- ============================================

-- Acceso mediante la orden relacionada
CREATE POLICY "Items accessible by order"
ON order_items FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM orders 
        WHERE orders.id = order_items.order_id 
        AND (orders.customer_email = auth.jwt() ->> 'email' 
             OR orders.customer_phone = auth.jwt() ->> 'phone')
    )
);

-- Admin tiene acceso total
CREATE POLICY "Admin full access order_items"
ON order_items FOR ALL 
USING (auth.role() = 'admin');

-- ============================================
-- POLÍTICAS RLS - ACTIVITY_LOGS
-- ============================================

CREATE POLICY "Admin only logs" 
ON activity_logs FOR ALL 
USING (auth.role() = 'admin');
