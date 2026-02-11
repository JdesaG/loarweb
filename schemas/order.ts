
import { z } from 'zod'

export const orderItemSchema = z.object({
    product_id: z.string().uuid(),
    quantity: z.number().int().positive(),
    unit_price: z.number().nonnegative(),
    design_details: z.object({
        style: z.string().optional(),
        material: z.string().optional(),
        design_type: z.string().optional(),
        color: z.string().optional(),
        size: z.string().optional(),
        custom_text: z.string().optional(),
        placement: z.string().optional(),
        image_url: z.string().url().optional(),
    }),
})

export const customerInfoSchema = z.object({
    fullName: z.string().min(2, "Name is required"),
    email: z.string().email("Invalid email"),
    phone: z.string().min(10, "Phone number is required"),
    address: z.string().min(5, "Address is required"),
    notes: z.string().optional(),
})

export const createOrderSchema = z.object({
    customer: customerInfoSchema,
    items: z.array(orderItemSchema).min(1, "Order must have at least one item"),
    totalAmount: z.number().nonnegative(),
})

export type CreateOrderInput = z.infer<typeof createOrderSchema>
