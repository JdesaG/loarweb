import { z } from 'zod'

export const updateInventorySchema = z.object({
    // Accept both camelCase and snake_case for backwards compatibility
    quantityAvailable: z.number().int().nonnegative('Must be >= 0').optional(),
    quantity_available: z.number().int().nonnegative('Must be >= 0').optional(),
    isVisible: z.boolean().optional(),
    is_visible: z.boolean().optional(),
})

export type UpdateInventoryInput = z.infer<typeof updateInventorySchema>
