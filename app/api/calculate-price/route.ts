
import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { calculatePriceSchema } from '@/schemas/calculate'

export async function POST(request: Request) {
    try {
        const json = await request.json()
        const input = calculatePriceSchema.parse(json)

        // Using admin client for price calculation is safe as it's a read operation
        // and inputs are validated. This avoids client-side type issues.
        // Cast to any to avoid "is not assignable to parameter of type 'undefined'" error 
        // which suggests a type inference issue with the generated Database types.
        const { data, error } = await (supabaseAdmin as any).rpc('get_product_price', {
            p_product_id: input.productId,
            p_style_name: input.styleName || '',
            p_material: input.material || '',
            p_design_type: input.designType || '',
            p_quantity: input.quantity
        })

        if (error) throw error

        // RPC returns a table/array. We expect 1 result or none.
        const priceInfo = data && data[0] ? data[0] : null

        if (!priceInfo) {
            // Fallback: Fetch base price from products table
            const { data: product } = await supabaseAdmin
                .from('products')
                .select('base_price')
                .eq('id', input.productId)
                .single()

            if (product) {
                return NextResponse.json({
                    pricingId: null, // No specific rule matched
                    unitPrice: (product as any).base_price
                })
            }
            return NextResponse.json({ error: 'Product not found' }, { status: 404 })
        }

        return NextResponse.json({
            pricingId: priceInfo.pricing_id,
            unitPrice: priceInfo.unit_price
        })

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 })
    }
}
