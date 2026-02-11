
import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const status = searchParams.get('status')
        const dateFrom = searchParams.get('dateFrom')
        const dateTo = searchParams.get('dateTo')

        let query = supabaseAdmin
            .from('orders')
            .select(`
        *,
        order_items (
          *,
          products (name, images)
        )
      `)
            .order('created_at', { ascending: false })

        if (status && status !== 'all') {
            query = query.eq('status', status)
        }

        if (dateFrom) {
            query = query.gte('created_at', dateFrom)
        }

        if (dateTo) {
            // Add time to end of day? Assuming dateTo includes time or just date part.
            // If passing just date 2024-02-11, we probably want <= 2024-02-11 23:59:59
            // Simplest is lte provided value.
            query = query.lte('created_at', dateTo)
        }

        const { data: orders, error } = await query

        if (error) throw error

        return NextResponse.json(orders)

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
