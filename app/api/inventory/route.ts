import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export async function GET() {
    try {
        const db = supabaseAdmin()

        const { data, error } = await db
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
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Internal server error'
        return NextResponse.json({ error: message }, { status: 500 })
    }
}
