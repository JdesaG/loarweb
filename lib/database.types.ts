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
                    name: string
                    description: string | null
                    base_price: number
                    is_active: boolean
                    images: string[]
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    name: string
                    description?: string | null
                    base_price: number
                    is_active?: boolean
                    images?: string[]
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    name?: string
                    description?: string | null
                    base_price?: number
                    is_active?: boolean
                    images?: string[]
                    created_at?: string
                    updated_at?: string
                }
                Relationships: []
            }

            inventory: {
                Row: {
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
                }
                Insert: {
                    id?: string
                    product_id: string
                    style?: string | null
                    material?: string | null
                    design_type?: string | null
                    color?: string | null
                    size?: string | null
                    quantity_available?: number
                    is_visible?: boolean
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    product_id?: string
                    style?: string | null
                    material?: string | null
                    design_type?: string | null
                    color?: string | null
                    size?: string | null
                    quantity_available?: number
                    is_visible?: boolean
                    created_at?: string
                    updated_at?: string
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

            pricing: {
                Row: {
                    id: string
                    product_id: string
                    style: string | null
                    material: string | null
                    design_type: string | null
                    price: number
                    created_at: string
                }
                Insert: {
                    id?: string
                    product_id: string
                    style?: string | null
                    material?: string | null
                    design_type?: string | null
                    price: number
                    created_at?: string
                }
                Update: {
                    id?: string
                    product_id?: string
                    style?: string | null
                    material?: string | null
                    design_type?: string | null
                    price?: number
                    created_at?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "pricing_product_id_fkey"
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
                    customer_info: Json
                    status: string
                    total_amount: number
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    order_code?: string
                    customer_info: Json
                    status?: string
                    total_amount: number
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    order_code?: string
                    customer_info?: Json
                    status?: string
                    total_amount?: number
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
                    quantity: number
                    unit_price: number
                    subtotal: number
                    design_details: Json | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    order_id: string
                    product_id: string
                    quantity: number
                    unit_price: number
                    subtotal: number
                    design_details?: Json | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    order_id?: string
                    product_id?: string
                    quantity?: number
                    unit_price?: number
                    subtotal?: number
                    design_details?: Json | null
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
