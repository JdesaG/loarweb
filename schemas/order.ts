import { z } from 'zod'

// ─── Order Item Schema ───────────────────────────────────────────────────────
export const orderItemSchema = z.object({
    product_id: z.string().uuid(),
    pricing_id: z.string().uuid().optional().nullable(),
    product_name: z.string().optional(),
    style_name: z.string().optional(),
    selected_color: z.string().optional(),
    selected_size: z.string().optional(),
    material: z.string().optional(),
    design_type: z.string().optional(),
    quantity: z.number().int().positive(),
    unit_price: z.number().nonnegative(),
    design_main_url: z.string().optional(),
    design_secondary_url: z.string().optional(),
    placement_instructions: z.string().optional(),
    add_initial: z.boolean().optional(),
    initial_letter: z.string().optional(),
    initial_price: z.number().optional(),
    item_total: z.number().nonnegative(),
})

// ─── Customer Info Schema (used by checkout form) ────────────────────────────
export const customerInfoSchema = z.object({
    customer_name: z.string().min(2, 'Nombre requerido'),
    customer_email: z.string().email('Email inválido'),
    customer_phone: z.string().min(7, 'Teléfono requerido'),
    customer_id_card: z.string().optional(),
    delivery_method: z.string().optional(),
    notas: z.string().optional(),
    data_consent: z.boolean().optional(),
})

// ─── Create Order Schema (API body) ──────────────────────────────────────────
export const createOrderSchema = z.object({
    customer: customerInfoSchema,
    items: z.array(orderItemSchema).min(1, 'Al menos un producto'),
    subtotal: z.number().nonnegative(),
    tax: z.number().nonnegative(),
    total: z.number().nonnegative(),
})

export type OrderItemInput = z.infer<typeof orderItemSchema>
export type CustomerInfoInput = z.infer<typeof customerInfoSchema>
export type CreateOrderInput = z.infer<typeof createOrderSchema>
