
import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase' // Use admin client to write orders securely
import { createOrderSchema } from '@/schemas/order'

export async function POST(request: Request) {
    try {
        const json = await request.json()
        const { customer, items, totalAmount } = createOrderSchema.parse(json)

        // Using explicit type definition and casting client to any to bypass
        // persistent "No overload matches" error due to schema inference issues.
        type OrdersInsert = {
            customer_info: any
            total_amount: number
            status: string
        }

        // 1. Create Order
        const { data: order, error: orderError } = await (supabaseAdmin as any)
            .from('orders')
            .insert({
                customer_info: customer,
                total_amount: totalAmount,
                status: 'pending'
            } as OrdersInsert)
            .select('id, order_code')
            .single()

        if (orderError) throw orderError
        if (!order) throw new Error('Failed to create order')

        // 2. Create Order Items
        const orderItems = items.map(item => ({
            order_id: order.id,
            product_id: item.product_id,
            quantity: item.quantity,
            unit_price: item.unit_price,
            subtotal: item.quantity * item.unit_price,
            design_details: item.design_details
        }))

        const { error: itemsError } = await (supabaseAdmin as any)
            .from('order_items')
            .insert(orderItems)

        if (itemsError) {
            // In a real app, we might want to rollback the order creation here
            // Supabase doesn't support multi-table transactions via JS client easily perfectly without RPC
            // But for this scope, we assume success or handle cleanup manually if needed.
            console.error('Error creating items:', itemsError)
            // Attempt to delete the order to keep consistency
            await supabaseAdmin.from('orders').delete().eq('id', order.id)
            throw itemsError
        }

        return NextResponse.json({
            success: true,
            orderCode: order.order_code,
            orderId: order.id
        })

    } catch (error: any) {
        console.error('Create order error:', error)
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 })
    }
}
