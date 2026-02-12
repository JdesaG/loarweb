import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { calculatePriceSchema } from '@/schemas/calculate'

export async function POST(request: Request) {
    try {
        const json = await request.json()
        const input = calculatePriceSchema.parse(json)

        const db = supabaseAdmin()

        // Query products_pricing table directly (more reliable than RPC)
        let query = db
            .from('products_pricing')
            .select('id, price')
            .eq('product_id', input.productId)

        if (input.styleName) {
            query = query.or(`style_name.eq.${input.styleName},style_name.is.null`)
        }
        if (input.material) {
            query = query.or(`material.eq.${input.material},material.is.null`)
        }
        if (input.designType) {
            query = query.or(`design_type.eq.${input.designType},design_type.is.null`)
        }

        // Handle quantity tiers
        const qty = input.quantity ?? 1
        query = query.or(`min_qty.is.null,min_qty.lte.${qty}`)
        query = query.or(`max_qty.is.null,max_qty.gte.${qty}`)
        query = query.order('price', { ascending: true })
        query = query.limit(1)

        const { data, error } = await query

        if (error) throw error

        if (data && data.length > 0) {
            return NextResponse.json({
                pricingId: data[0].id,
                unitPrice: data[0].price,
            })
        }

        // No pricing rule found — this is OK, frontend will use 0 or base fallback
        return NextResponse.json({
            pricingId: null,
            unitPrice: 0,
        })
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Bad request'
        return NextResponse.json({ error: message }, { status: 400 })
    }
}
