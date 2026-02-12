// ─── Products ────────────────────────────────────────────────────────────────
export interface Product {
    id: string
    sku: string
    name: string
    category: string
    base_image: string | null
    has_sizes: boolean
    available_sizes: string[]
    available_colors: string[]
    available_materials: string[]
    has_styles: boolean
    available_styles: string[]
    is_active: boolean
    created_at: string
    updated_at: string
}

// ─── Products Pricing ────────────────────────────────────────────────────────
export interface ProductPricing {
    id: string
    product_id: string
    style_name: string
    design_type: string
    material: string
    min_qty: number
    max_qty: number
    price: number
    created_at: string
}

// ─── Inventory ───────────────────────────────────────────────────────────────
export interface InventoryItem {
    id: string
    product_id: string
    style: string | null
    material: string | null
    design_type: string | null
    color: string | null
    size: string | null
    quantity_available: number
    is_visible: boolean
    created_at: string
    updated_at: string
    // Joined data (optional)
    products?: {
        name: string
        base_image: string | null
    }
}

// ─── Orders ──────────────────────────────────────────────────────────────────
export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'completed' | 'cancelled'
export type PaymentStatus = 'pending' | 'paid' | 'refunded'

export interface Order {
    id: string
    order_code: string
    customer_name: string
    customer_phone: string | null
    customer_email: string | null
    customer_id_card: string | null
    data_consent: boolean | null
    consent_timestamp: string | null
    subtotal: number
    tax: number
    total: number
    status: OrderStatus
    payment_status: string | null
    delivery_method: string | null
    notas: string | null
    created_at: string
    updated_at: string
    // Joined data (optional)
    order_items?: OrderItem[]
}

// ─── Order Items ─────────────────────────────────────────────────────────────
export interface OrderItem {
    id: string
    order_id: string
    product_id: string
    pricing_id: string | null
    product_name: string | null
    style_name: string | null
    selected_color: string | null
    selected_size: string | null
    material: string | null
    design_type: string | null
    quantity: number
    unit_price: number
    design_main_url: string | null
    design_secondary_url: string | null
    placement_instructions: string | null
    add_initial: boolean | null
    initial_letter: string | null
    initial_price: number | null
    item_total: number
    created_at: string
}

// ─── Designs ─────────────────────────────────────────────────────────────────
export interface Design {
    id: string
    customer_email: string | null
    customer_id_card: string | null
    design_name: string | null
    design_image_url: string | null
    thumbnail_url: string | null
    design_role: string | null
    usage_count: number
    last_used: string | null
    is_active: boolean
    uploaded_at: string
}

// ─── Cart (client-side) ──────────────────────────────────────────────────────
export interface CartItem {
    id: string
    product: Product
    quantity: number
    unitPrice: number
    styleName?: string
    selectedColor?: string
    selectedSize?: string
    material?: string
    designType?: string
    designMainUrl?: string
    designSecondaryUrl?: string
    placementInstructions?: string
    addInitial?: boolean
    initialLetter?: string
    initialPrice?: number
}

// ─── Configurator Store ──────────────────────────────────────────────────────
export interface ConfiguratorState {
    product: Product | null
    step: number
    // Step 1
    styleName: string
    material: string
    designType: string
    // Step 2
    color: string
    size: string
    quantity: number
    // Step 2 – Images
    imageFile: File | null
    imagePreview: string | null
    imageFile2: File | null
    imagePreview2: string | null
    placement: string
    hasInitial: boolean
    initialLetter: string
    // Computed
    unitPrice: number | null
    pricingId: string | null
}

// ─── API Responses ───────────────────────────────────────────────────────────
export interface PriceResponse {
    pricingId: string | null
    unitPrice: number
}
