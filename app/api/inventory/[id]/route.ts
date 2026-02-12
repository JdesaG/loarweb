import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { updateInventorySchema } from '@/schemas/inventory'

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const json = await request.json()
        const input = updateInventorySchema.parse(json)

        // Map camelCase input → snake_case columns
        const updatePayload: Record<string, unknown> = {}
        if (input.quantityAvailable !== undefined) {
            updatePayload.quantity_available = input.quantityAvailable
        }
        if (input.isVisible !== undefined) {
            updatePayload.is_visible = input.isVisible
        }

        if (Object.keys(updatePayload).length === 0) {
            return NextResponse.json(
                { error: 'No fields to update' },
                { status: 400 }
            )
        }

        const db = supabaseAdmin()

        const { data, error } = await db
            .from('inventory')
            .update(updatePayload)
            .eq('id', id)
            .select()
            .single()

        if (error) throw error

        return NextResponse.json(data)
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Internal server error'
        return NextResponse.json({ error: message }, { status: 500 })
    }
}
