
import { NextResponse } from 'next/server'
import { createBrowserSupabaseClient } from '@/lib/supabase' // Use public client for read-only RPC if RLS allows
import { calculatePriceSchema } from '@/schemas/calculate'

export async function POST(request: Request) {
    try {
        const json = await request.json()
        const input = calculatePriceSchema.parse(json)

        // We can use the public client because get_product_price RPC is likely accessible to public
        // or RLS allows access. For improved security, use service role if logic is sensitive.
        // However, pricing is usually public.
        const supabase = createBrowserSupabaseClient()

        const { data, error } = await supabase.rpc('get_product_price', {
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
            const { data: product } = await supabase
                .from('products')
                .select('base_price')
                .eq('id', input.productId)
                .single()

            if (product) {
                return NextResponse.json({
                    pricingId: null, // No specific rule matched
                    unitPrice: product.base_price
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
