
import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params
    try {
        const json = await request.json()
        const { status } = json

        if (!status) {
            return NextResponse.json({ error: 'Status is required' }, { status: 400 })
        }

        const { data, error } = await supabaseAdmin
            .from('orders')
            .update({ status })
            .eq('id', id)
            .select()
            .single()

        if (error) throw error

        return NextResponse.json(data)

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
