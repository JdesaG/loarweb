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

        // Map input → snake_case columns (accept both camelCase and snake_case)
        const updatePayload: Record<string, unknown> = {}

        const qty = input.quantityAvailable ?? input.quantity_available
        if (qty !== undefined) {
            updatePayload.quantity_available = qty
        }

        const visible = input.isVisible ?? input.is_visible
        if (visible !== undefined) {
            updatePayload.is_visible = visible
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
        console.error('Inventory API Error:', error)
        return NextResponse.json({ error: message }, { status: 500 })
    }
}
