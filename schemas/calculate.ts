
import { z } from 'zod'

export const calculatePriceSchema = z.object({
    productId: z.string().uuid(),
    styleName: z.string().optional(),
    material: z.string().optional(),
    designType: z.string().optional(),
    quantity: z.number().int().positive().default(1),
})

export type CalculatePriceInput = z.infer<typeof calculatePriceSchema>
