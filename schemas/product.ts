import { z } from 'zod'

export const productUpdateSchema = z.object({
    name: z.string().min(1, 'El nombre es requerido').optional(),
    category: z.string().nullable().optional(),
    sku: z.string().nullable().optional(),
    is_active: z.boolean().optional(),
})

export type ProductUpdateInput = z.infer<typeof productUpdateSchema>
