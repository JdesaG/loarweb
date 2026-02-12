export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            products: {
                Row: {
                    id: string
                    sku: string | null
                    name: string
                    category: string | null
                    base_image: string | null
                    has_sizes: boolean
                    available_sizes: string[] | null
                    available_colors: string[] | null
                    available_materials: string[] | null
                    has_styles: boolean
                    available_styles: string[] | null
                    is_active: boolean
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    sku?: string | null
                    name: string
                    category?: string | null
                    base_image?: string | null
                    has_sizes?: boolean
                    available_sizes?: string[] | null
                    available_colors?: string[] | null
                    available_materials?: string[] | null
                    has_styles?: boolean
                    available_styles?: string[] | null
                    is_active?: boolean
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    sku?: string | null
                    name?: string
                    category?: string | null
                    base_image?: string | null
                    has_sizes?: boolean
                    available_sizes?: string[] | null
                    available_colors?: string[] | null
                    available_materials?: string[] | null
                    has_styles?: boolean
                    available_styles?: string[] | null
                    is_active?: boolean
                    created_at?: string
                    updated_at?: string
                }
                Relationships: []
            }

            products_pricing: {
                Row: {
                    id: string
                    product_id: string
                    style_name: string | null
                    design_type: string | null
                    material: string | null
                    min_qty: number | null
                    max_qty: number | null
                    price: number
                    created_at: string
                }
                Insert: {
                    id?: string
                    product_id: string
                    style_name?: string | null
                    design_type?: string | null
                    material?: string | null
                    min_qty?: number | null
                    max_qty?: number | null
                    price: number
                    created_at?: string
                }
                Update: {
                    id?: string
                    product_id?: string
                    style_name?: string | null
                    design_type?: string | null
                    material?: string | null
                    min_qty?: number | null
                    max_qty?: number | null
                    price?: number
                    created_at?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "products_pricing_product_id_fkey"
                        columns: ["product_id"]
                        isOneToOne: false
                        referencedRelation: "products"
                        referencedColumns: ["id"]
                    }
                ]
            }

            inventory: {
                Row: {
                    id: string
                    product_id: string
                    color: string | null
                    size: string | null
                    quantity_available: number
                    is_visible: boolean
                    created_at: string
                }
                Insert: {
                    id?: string
                    product_id: string
                    color?: string | null
                    size?: string | null
                    quantity_available?: number
                    is_visible?: boolean
                    created_at?: string
                }
                Update: {
                    id?: string
                    product_id?: string
                    color?: string | null
                    size?: string | null
                    quantity_available?: number
                    is_visible?: boolean
                    created_at?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "inventory_product_id_fkey"
                        columns: ["product_id"]
                        isOneToOne: false
                        referencedRelation: "products"
                        referencedColumns: ["id"]
                    }
                ]
            }

            orders: {
                Row: {
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
                    status: string
                    payment_status: string | null
                    delivery_method: string | null
                    notas: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    order_code?: string
                    customer_name: string
                    customer_phone?: string | null
                    customer_email?: string | null
                    customer_id_card?: string | null
                    data_consent?: boolean | null
                    consent_timestamp?: string | null
                    subtotal: number
                    tax: number
                    total: number
                    status?: string
                    payment_status?: string | null
                    delivery_method?: string | null
                    notas?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    order_code?: string
                    customer_name?: string
                    customer_phone?: string | null
                    customer_email?: string | null
                    customer_id_card?: string | null
                    data_consent?: boolean | null
                    consent_timestamp?: string | null
                    subtotal?: number
                    tax?: number
                    total?: number
                    status?: string
                    payment_status?: string | null
                    delivery_method?: string | null
                    notas?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Relationships: []
            }

            order_items: {
                Row: {
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
                Insert: {
                    id?: string
                    order_id: string
                    product_id: string
                    pricing_id?: string | null
                    product_name?: string | null
                    style_name?: string | null
                    selected_color?: string | null
                    selected_size?: string | null
                    material?: string | null
                    design_type?: string | null
                    quantity: number
                    unit_price: number
                    design_main_url?: string | null
                    design_secondary_url?: string | null
                    placement_instructions?: string | null
                    add_initial?: boolean | null
                    initial_letter?: string | null
                    initial_price?: number | null
                    item_total: number
                    created_at?: string
                }
                Update: {
                    id?: string
                    order_id?: string
                    product_id?: string
                    pricing_id?: string | null
                    product_name?: string | null
                    style_name?: string | null
                    selected_color?: string | null
                    selected_size?: string | null
                    material?: string | null
                    design_type?: string | null
                    quantity?: number
                    unit_price?: number
                    design_main_url?: string | null
                    design_secondary_url?: string | null
                    placement_instructions?: string | null
                    add_initial?: boolean | null
                    initial_letter?: string | null
                    initial_price?: number | null
                    item_total?: number
                    created_at?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "order_items_order_id_fkey"
                        columns: ["order_id"]
                        isOneToOne: false
                        referencedRelation: "orders"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "order_items_product_id_fkey"
                        columns: ["product_id"]
                        isOneToOne: false
                        referencedRelation: "products"
                        referencedColumns: ["id"]
                    }
                ]
            }

            designs: {
                Row: {
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
                Insert: {
                    id?: string
                    customer_email?: string | null
                    customer_id_card?: string | null
                    design_name?: string | null
                    design_image_url?: string | null
                    thumbnail_url?: string | null
                    design_role?: string | null
                    usage_count?: number
                    last_used?: string | null
                    is_active?: boolean
                    uploaded_at?: string
                }
                Update: {
                    id?: string
                    customer_email?: string | null
                    customer_id_card?: string | null
                    design_name?: string | null
                    design_image_url?: string | null
                    thumbnail_url?: string | null
                    design_role?: string | null
                    usage_count?: number
                    last_used?: string | null
                    is_active?: boolean
                    uploaded_at?: string
                }
                Relationships: []
            }

            activity_logs: {
                Row: {
                    id: string
                    timestamp: string
                    action_type: string | null
                    severity: string | null
                    actor_type: string | null
                    actor_identifier: string | null
                    ip_address: string | null
                    resource_type: string | null
                    resource_id: string | null
                    details: string | null
                    metadata: Json | null
                    related_entities: Json | null
                }
                Insert: {
                    id?: string
                    timestamp?: string
                    action_type?: string | null
                    severity?: string | null
                    actor_type?: string | null
                    actor_identifier?: string | null
                    ip_address?: string | null
                    resource_type?: string | null
                    resource_id?: string | null
                    details?: string | null
                    metadata?: Json | null
                    related_entities?: Json | null
                }
                Update: {
                    id?: string
                    timestamp?: string
                    action_type?: string | null
                    severity?: string | null
                    actor_type?: string | null
                    actor_identifier?: string | null
                    ip_address?: string | null
                    resource_type?: string | null
                    resource_id?: string | null
                    details?: string | null
                    metadata?: Json | null
                    related_entities?: Json | null
                }
                Relationships: []
            }
        }

        Views: {
            [_ in never]: never
        }

        Functions: {
            get_product_price: {
                Args: {
                    p_product_id: string
                    p_style_name: string
                    p_material: string
                    p_design_type: string
                    p_quantity: number
                }
                Returns: {
                    pricing_id: string
                    unit_price: number
                }[]
            }
        }

        Enums: {
            [_ in never]: never
        }

        CompositeTypes: {
            [_ in never]: never
        }
    }
}
