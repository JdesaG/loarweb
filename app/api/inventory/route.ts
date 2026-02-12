import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export async function GET() {
    try {
        const db = supabaseAdmin()

        // 1. Fetch inventory items
        const { data: items, error: invError } = await db
            .from('inventory')
            .select('*')
            .order('updated_at', { ascending: false })

        if (invError) throw invError

        if (!items || items.length === 0) {
            return NextResponse.json([])
        }

        // 2. Fetch related products manually to avoid FK issues
        const productIds = [...new Set(items.map((i) => i.product_id))]

        // Handle case where productIds might be empty or contain nulls
        const validIds = productIds.filter(Boolean)

        let productMap: Record<string, any> = {}

        if (validIds.length > 0) {
            const { data: products, error: prodError } = await db
                .from('products')
                .select('id, name, base_image')
                .in('id', validIds)

            if (prodError) throw prodError

            productMap = (products || []).reduce((acc, p) => {
                acc[p.id] = p
                return acc
            }, {} as Record<string, any>)
        }

        // 3. Combine
        const combined = items.map((item) => ({
            ...item,
            products: productMap[item.product_id] || null
        }))

        return NextResponse.json(combined)
    } catch (error: unknown) {
        console.error('Inventory API Error:', error)
        const message = error instanceof Error ? error.message : 'Internal server error'
        return NextResponse.json({ error: message }, { status: 500 })
    }
}
