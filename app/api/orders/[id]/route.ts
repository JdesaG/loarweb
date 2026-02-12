import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const json = await request.json()
        const { status } = json

        if (!status) {
            return NextResponse.json(
                { error: 'status is required' },
                { status: 400 }
            )
        }

        const db = supabaseAdmin()

        const { data, error } = await db
            .from('orders')
            .update({ status })
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
