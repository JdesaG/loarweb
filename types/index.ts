// ─── Database Row Types ──────────────────────────────────────────────────────

export interface Product {
    id: string
    name: string
    description: string | null
    base_price: number
    is_active: boolean
    images: string[]
    created_at: string
    updated_at: string
}

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
    products?: Pick<Product, 'name' | 'images'>
}

export interface Order {
    id: string
    order_code: string
    customer_info: CustomerInfo
    status: OrderStatus
    total_amount: number
    created_at: string
    updated_at: string
    order_items?: OrderItem[]
}

export interface OrderItem {
    id: string
    order_id: string
    product_id: string
    quantity: number
    unit_price: number
    subtotal: number
    design_details: DesignDetails | null
    created_at: string
    products?: Pick<Product, 'name' | 'images'>
}

// ─── Business Types ──────────────────────────────────────────────────────────

export interface CustomerInfo {
    fullName: string
    email: string
    phone: string
    address: string
    notes?: string
}

export interface DesignDetails {
    style?: string
    material?: string
    design_type?: string
    color?: string
    size?: string
    custom_text?: string
    placement?: string
    image_url?: string
    initial_letter?: string
    [key: string]: unknown
}

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'completed' | 'cancelled'

// ─── Cart Types ──────────────────────────────────────────────────────────────

export interface CartItem {
    id: string // unique cart-item id
    product: Product
    quantity: number
    unitPrice: number
    designDetails: DesignDetails
}

// ─── Configurator Types ──────────────────────────────────────────────────────

export interface ConfiguratorState {
    step: number
    productId: string | null
    product: Product | null
    style: string
    material: string
    designType: string
    color: string
    size: string
    customText: string
    placement: string
    imageFile: File | null
    imagePreview: string | null
    initialLetter: string
    hasInitial: boolean
    unitPrice: number | null
    pricingId: string | null
    quantity: number
}

// ─── API Response Types ──────────────────────────────────────────────────────

export interface PriceResponse {
    pricingId: string | null
    unitPrice: number
}

export interface CreateOrderResponse {
    orderCode: string
}

export interface ApiError {
    error: string
}
