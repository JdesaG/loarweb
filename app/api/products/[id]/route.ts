import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { productUpdateSchema } from '@/schemas/product'

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const json = await request.json()
        const input = productUpdateSchema.parse(json)

        // Only include defined fields
        const updatePayload: Record<string, unknown> = {}
        if (input.name !== undefined) updatePayload.name = input.name
        if (input.category !== undefined) updatePayload.category = input.category
        if (input.sku !== undefined) updatePayload.sku = input.sku
        if (input.is_active !== undefined) updatePayload.is_active = input.is_active

        if (Object.keys(updatePayload).length === 0) {
            return NextResponse.json(
                { error: 'No fields to update' },
                { status: 400 }
            )
        }

        const db = supabaseAdmin()

        const { data, error } = await db
            .from('products')
            .update(updatePayload)
            .eq('id', id)
            .select()
            .single()

        if (error) throw error

        return NextResponse.json(data)
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Internal server error'
        console.error('Product API Error:', error)
        return NextResponse.json({ error: message }, { status: 500 })
    }
}
