'use client'

import { useOrders } from '@/hooks/useOrders'
import { OrderTable } from '@/components/dashboard/OrderTable'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import type { OrderStatus } from '@/types'

export default function OrdersPage() {
    const { orders, loading, refetch } = useOrders()

    const handleStatusChange = async (orderId: string, status: OrderStatus) => {
        const res = await fetch(`/api/orders/${orderId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status }),
        })
        if (!res.ok) throw new Error('Failed')
        await refetch()
    }

    const handleFilter = (filters: { status?: string; dateFrom?: string; dateTo?: string }) => {
        refetch(filters)
    }

    if (loading) {
        return <LoadingSpinner className="py-20" text="Cargando pedidos..." />
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-neutral-900">Pedidos</h1>
                <p className="text-neutral-500 text-sm">Gestiona los pedidos de tus clientes</p>
            </div>

            <OrderTable
                orders={orders}
                loading={loading}
                onStatusChange={handleStatusChange}
                onFilter={handleFilter}
            />
        </div>
    )
}
