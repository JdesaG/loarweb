
import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { updateInventorySchema } from '@/schemas/inventory'

export async function PATCH(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const json = await request.json()
        const input = updateInventorySchema.parse(json)

        const { data, error } = await supabaseAdmin
            .from('inventory')
            .update(input)
            .eq('id', params.id)
            .select()
            .single()

        if (error) throw error

        return NextResponse.json(data)

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
