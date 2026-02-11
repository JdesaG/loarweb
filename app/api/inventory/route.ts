
import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export async function GET() {
    try {
        const { data, error } = await (supabaseAdmin as any)
            .from('inventory')
            .select(`
        *,
        products (
          name,
          images
        )
      `)
            .order('created_at', { ascending: false })

        if (error) throw error

        return NextResponse.json(data)

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
