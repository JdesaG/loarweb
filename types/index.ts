
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
    products?: Product // for joins
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
    design_details: DesignDetails
    created_at: string
    products?: Product
}

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
    designType?: string
    color?: string
    size?: string
    customText?: string
    placement?: string
    imageUrl?: string
    [key: string]: any
}

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'completed' | 'cancelled'
