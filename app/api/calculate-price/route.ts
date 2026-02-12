import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { calculatePriceSchema } from '@/schemas/calculate'

export async function POST(request: Request) {
    try {
        const json = await request.json()
        const input = calculatePriceSchema.parse(json)

        const db = supabaseAdmin()

        const { data, error } = await db.rpc('get_product_price', {
            p_product_id: input.productId,
            p_style_name: input.styleName || 'default',
            p_material: input.material || '',
            p_design_type: input.designType || '',
            p_quantity: input.quantity ?? 1,
        })

        if (error) throw error

        // RPC returns a single row or null/empty if no match
        // get_product_price returns TABLE(pricing_id UUID, price DECIMAL)
        // supabase-js might return it as an array if returns table, or object if returns record?
        // Checking the definition: RETURNS TABLE. So it returns an array of rows.
        // We used LIMIT 1, so it should be an array of length 0 or 1.

        const rows = data as unknown as { pricing_id: string; price: number }[]

        if (rows && rows.length > 0) {
            return NextResponse.json({
                pricingId: rows[0].pricing_id,
                unitPrice: rows[0].price,
            })
        }

        // No pricing rule found
        return NextResponse.json({
            pricingId: null,
            unitPrice: 0,
        })
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Bad request'
        return NextResponse.json({ error: message }, { status: 400 })
    }
}
