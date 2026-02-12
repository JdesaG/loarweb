import { z } from 'zod'

// ─── Order Item Schema ───────────────────────────────────────────────────────
export const orderItemSchema = z.object({
    product_id: z.string().uuid(),
    quantity: z.number().int().positive(),
    unit_price: z.number().nonnegative(),
    design_details: z
        .object({
            style: z.string().optional(),
            material: z.string().optional(),
            design_type: z.string().optional(),
            color: z.string().optional(),
            size: z.string().optional(),
            custom_text: z.string().optional(),
            placement: z.string().optional(),
            image_url: z.string().optional(),
            initial_letter: z.string().optional(),
        })
        .optional(),
})

// ─── Customer Info Schema (used by checkout form) ────────────────────────────
export const customerInfoSchema = z.object({
    fullName: z.string().min(2, 'Nombre requerido'),
    email: z.string().email('Email inválido'),
    phone: z.string().min(7, 'Teléfono requerido'),
    address: z.string().min(5, 'Dirección requerida'),
    notes: z.string().optional(),
})

// ─── Create Order Schema (API body) ──────────────────────────────────────────
export const createOrderSchema = z.object({
    customer: customerInfoSchema,
    items: z.array(orderItemSchema).min(1, 'Al menos un producto'),
    totalAmount: z.number().nonnegative(),
})

export type OrderItemInput = z.infer<typeof orderItemSchema>
export type CustomerInfoInput = z.infer<typeof customerInfoSchema>
export type CreateOrderInput = z.infer<typeof createOrderSchema>
