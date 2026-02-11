
import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { updateInventorySchema } from '@/schemas/inventory'

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params
    try {
        const json = await request.json()
        const input = updateInventorySchema.parse(json)

        const { data, error } = await supabaseAdmin
            .from('inventory')
            .update(input)
            .eq('id', id)
            .select()
            .single()

        if (error) throw error

        return NextResponse.json(data)

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
