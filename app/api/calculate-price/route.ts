import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { calculatePriceSchema } from '@/schemas/calculate'

export async function POST(request: Request) {
    try {
        const json = await request.json()
        const input = calculatePriceSchema.parse(json)

        const db = supabaseAdmin()

        // Call the RPC function to find the best matching pricing rule
        const { data, error } = await db.rpc('get_product_price', {
            p_product_id: input.productId,
            p_style_name: input.styleName ?? '',
            p_material: input.material ?? '',
            p_design_type: input.designType ?? '',
            p_quantity: input.quantity,
        })

        if (error) throw error

        // The RPC returns an array — take the first (most specific) match
        const priceInfo = data && data[0] ? data[0] : null

        if (!priceInfo) {
            // Fallback: use the product's base_price
            const { data: product, error: productError } = await db
                .from('products')
                .select('base_price')
                .eq('id', input.productId)
                .single()

            if (productError || !product) {
                return NextResponse.json({ error: 'Product not found' }, { status: 404 })
            }

            return NextResponse.json({
                pricingId: null,
                unitPrice: product.base_price,
            })
        }

        return NextResponse.json({
            pricingId: priceInfo.pricing_id,
            unitPrice: priceInfo.unit_price,
        })
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Bad request'
        return NextResponse.json({ error: message }, { status: 400 })
    }
}
