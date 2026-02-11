
import { z } from 'zod'

export const updateInventorySchema = z.object({
    quantityAvailable: z.number().int().nonnegative().optional(),
    isVisible: z.boolean().optional(),
})

export type UpdateInventoryInput = z.infer<typeof updateInventorySchema>
