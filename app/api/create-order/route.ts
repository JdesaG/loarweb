import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { createOrderSchema } from '@/schemas/order'

export async function POST(request: Request) {
    try {
        const json = await request.json()
        const input = createOrderSchema.parse(json)

        const db = supabaseAdmin()

        // 1. Create order with individual customer fields
        const { data: order, error: orderError } = await db
            .from('orders')
            .insert({
                customer_name: input.customer.customer_name,
                customer_phone: input.customer.customer_phone || null,
                customer_email: input.customer.customer_email || null,
                customer_id_card: input.customer.customer_id_card || null,
                data_consent: input.customer.data_consent ?? false,
                delivery_method: input.customer.delivery_method || null,
                notas: input.customer.notas || null,
                subtotal: input.subtotal,
                tax: input.tax,
                total: input.total,
                status: 'pending',
                payment_status: 'pending',
            })
            .select('id, order_code')
            .single()

        if (orderError || !order) throw orderError ?? new Error('Order creation failed')

        // 2. Insert order items with individual columns
        const itemsPayload = input.items.map((item) => ({
            order_id: order.id,
            product_id: item.product_id,
            pricing_id: item.pricing_id || null,
            product_name: item.product_name || null,
            style_name: item.style_name || null,
            selected_color: item.selected_color || null,
            selected_size: item.selected_size || null,
            material: item.material || null,
            design_type: item.design_type || null,
            quantity: item.quantity,
            unit_price: item.unit_price,
            design_main_url: item.design_main_url || null,
            design_secondary_url: item.design_secondary_url || null,
            placement_instructions: item.placement_instructions || null,
            add_initial: item.add_initial ?? false,
            initial_letter: item.initial_letter || null,
            initial_price: item.initial_price ?? 0,
            item_total: item.item_total,
        }))

        const { error: itemsError } = await db
            .from('order_items')
            .insert(itemsPayload)

        if (itemsError) throw itemsError

        return NextResponse.json({
            orderId: order.id,
            orderCode: order.order_code,
        })
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Bad request'
        return NextResponse.json({ error: message }, { status: 400 })
    }
}
