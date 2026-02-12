import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { createOrderSchema } from '@/schemas/order'

export async function POST(request: Request) {
    try {
        const json = await request.json()
        const { customer, items, totalAmount } = createOrderSchema.parse(json)

        const db = supabaseAdmin()

        // ── 1. Insert the order ──────────────────────────────────────────────
        const { data: order, error: orderError } = await db
            .from('orders')
            .insert({
                customer_info: customer,
                total_amount: totalAmount,
                status: 'pending',
            })
            .select('id, order_code')
            .single()

        if (orderError) throw orderError
        if (!order) throw new Error('Failed to create order')

        // ── 2. Insert order items ────────────────────────────────────────────
        const orderItems = items.map((item) => ({
            order_id: order.id,
            product_id: item.product_id,
            quantity: item.quantity,
            unit_price: item.unit_price,
            subtotal: item.quantity * item.unit_price,
            design_details: item.design_details ?? null,
        }))

        const { error: itemsError } = await db
            .from('order_items')
            .insert(orderItems)

        if (itemsError) {
            // Rollback: delete the order if items insertion fails
            await db.from('orders').delete().eq('id', order.id)
            throw itemsError
        }

        return NextResponse.json({
            orderCode: order.order_code,
        })
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Internal server error'
        console.error('POST /api/create-order error:', message)
        return NextResponse.json({ error: message }, { status: 500 })
    }
}
