import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
    try {
        const db = supabaseAdmin()
        const { searchParams } = new URL(request.url)

        let query = db
            .from('orders')
            .select('*, order_items(*)')
            .order('created_at', { ascending: false })

        const status = searchParams.get('status')
        if (status) {
            query = query.eq('status', status)
        }

        const dateFrom = searchParams.get('dateFrom')
        if (dateFrom) {
            query = query.gte('created_at', dateFrom)
        }

        const dateTo = searchParams.get('dateTo')
        if (dateTo) {
            query = query.lte('created_at', dateTo)
        }

        const { data, error } = await query

        if (error) throw error

        return NextResponse.json(data)
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Internal server error'
        return NextResponse.json({ error: message }, { status: 500 })
    }
}
