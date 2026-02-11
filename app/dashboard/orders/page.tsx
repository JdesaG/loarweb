
'use client'

import { useOrders } from "@/hooks/useOrders"
import { OrderTable } from "@/components/dashboard/OrderTable"
import { OrderDetail } from "@/components/dashboard/OrderDetail"
import { LoadingSpinner } from "@/components/shared/LoadingSpinner"
import { useState } from "react"
import { Order } from "@/types"

export default function OrdersPage() {
    const { orders, loading } = useOrders()
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

    const handleUpdateStatus = async (status: string) => {
        if (!selectedOrder) return

        try {
            const res = await fetch(`/api/orders/${selectedOrder.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status })
            })
            if (res.ok) {
                const updated = await res.json()
                setSelectedOrder(updated)
                // Optimistically update list or refetch? useOrders subscription handles insert but maybe not update?
                // usage of useOrders implies it handles fetch. 
                // We might need to manually update local state or rely on realtime if enabled for update.
                // Schema enabled realtime for orders.
                // But useOrders hook only listened for INSERT.
                // Let's assume a page refresh or basic realtime for now.
                window.location.reload()
            }
        } catch (e) {
            console.error(e)
        }
    }

    if (loading) return <LoadingSpinner />

    return (
        <div className="container mx-auto py-8">
            <h1 className="mb-8 text-3xl font-bold">Orders</h1>
            <OrderTable orders={orders} onView={setSelectedOrder} />

            {selectedOrder && (
                <OrderDetail
                    order={selectedOrder}
                    onClose={() => setSelectedOrder(null)}
                    onUpdateStatus={handleUpdateStatus}
                />
            )}
        </div>
    )
}
