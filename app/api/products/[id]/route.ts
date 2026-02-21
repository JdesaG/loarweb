import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { productUpdateSchema } from '@/schemas/product'

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const json = await request.json()
        const input = productUpdateSchema.parse(json)

        // Only include defined fields
        const updatePayload: Record<string, unknown> = {}
        if (input.name !== undefined) updatePayload.name = input.name
        if (input.category !== undefined) updatePayload.category = input.category
        if (input.sku !== undefined) updatePayload.sku = input.sku
        if (input.is_active !== undefined) updatePayload.is_active = input.is_active

        if (Object.keys(updatePayload).length === 0) {
            return NextResponse.json(
                { error: 'No fields to update' },
                { status: 400 }
            )
        }

        const db = supabaseAdmin()

        // 1. Update basic product info
        let updatedData = null
        if (Object.keys(updatePayload).length > 0) {
            const { data, error } = await db
                .from('products')
                .update(updatePayload)
                .eq('id', id)
                .select()
                .single()

            if (error) throw error
            updatedData = data
        }

        // 2. Handle Price Update (Technical: sin_diseño, llano, min_qty=1)
        if (input.price !== undefined) {
            const { error: pricingError } = await db
                .from('product_pricing')
                .upsert({
                    product_id: id,
                    price: input.price,
                    design_type: 'sin_diseño',
                    material: 'llano',
                    min_qty: 1,
                    max_qty: 9999,
                    style_name: 'default'
                }, {
                    onConflict: 'product_id, style_name, material, design_type, min_qty'
                })

            if (pricingError) throw pricingError

            // If we didn't update the product but only the price, we need to fetch the product to return it
            if (!updatedData) {
                const { data } = await db.from('products').select().eq('id', id).single()
                updatedData = data
            }
        }

        return NextResponse.json(updatedData)
    } catch (error: unknown) {
        console.error('Product API Error Detailed:', error)

        let message = 'Internal server error'
        if (error instanceof Error) {
            message = error.message
        } else if (typeof error === 'object' && error !== null && 'message' in error) {
            message = (error as any).message
        } else if (typeof error === 'string') {
            message = error
        }

        return NextResponse.json({ error: message }, { status: 500 })
    }
}
