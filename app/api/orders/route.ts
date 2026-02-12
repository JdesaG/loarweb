import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const status = searchParams.get('status')
        const dateFrom = searchParams.get('dateFrom')
        const dateTo = searchParams.get('dateTo')

        const db = supabaseAdmin()

        let query = db
            .from('orders')
            .select(`
        *,
        order_items (
          *,
          products ( name, images )
        )
      `)
            .order('created_at', { ascending: false })

        // ── Optional filters ───────────────────────────────────────────────
        if (status && status !== 'all') {
            query = query.eq('status', status)
        }

        if (dateFrom) {
            query = query.gte('created_at', dateFrom)
        }

        if (dateTo) {
            query = query.lte('created_at', dateTo)
        }

        const { data: orders, error } = await query

        if (error) throw error

        return NextResponse.json(orders)
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Internal server error'
        return NextResponse.json({ error: message }, { status: 500 })
    }
}
