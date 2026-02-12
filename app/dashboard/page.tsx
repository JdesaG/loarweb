'use client'

import { useOrders } from '@/hooks/useOrders'
import { useProducts } from '@/hooks/useProducts'
import { StatCard } from '@/components/dashboard/StatCard'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { formatCurrency } from '@/lib/utils'
import { ShoppingCart, Package, DollarSign, Clock } from 'lucide-react'

export default function DashboardPage() {
    const { orders, loading: ordersLoading } = useOrders()
    const { products, loading: productsLoading } = useProducts()

    const loading = ordersLoading || productsLoading

    if (loading) {
        return <LoadingSpinner className="py-20" text="Cargando métricas..." />
    }

    // Calculate metrics
    const totalOrders = orders.length
    const pendingOrders = orders.filter((o) => o.status === 'pending').length
    const totalRevenue = orders
        .filter((o) => o.status !== 'cancelled')
        .reduce((sum, o) => sum + o.total_amount, 0)
    const totalProducts = products.length

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-neutral-900">Dashboard</h1>
                <p className="text-neutral-500 text-sm">Resumen general de tu negocio</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    title="Total Pedidos"
                    value={totalOrders}
                    icon={<ShoppingCart className="h-5 w-5" />}
                />
                <StatCard
                    title="Pendientes"
                    value={pendingOrders}
                    icon={<Clock className="h-5 w-5" />}
                />
                <StatCard
                    title="Ingresos"
                    value={formatCurrency(totalRevenue)}
                    icon={<DollarSign className="h-5 w-5" />}
                />
                <StatCard
                    title="Productos"
                    value={totalProducts}
                    icon={<Package className="h-5 w-5" />}
                />
            </div>

            {/* Recent orders preview */}
            <div>
                <h2 className="text-lg font-semibold text-neutral-900 mb-3">Últimos pedidos</h2>
                {orders.length === 0 ? (
                    <p className="text-sm text-neutral-500">No hay pedidos aún.</p>
                ) : (
                    <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-neutral-100 bg-neutral-50 text-left">
                                    <th className="px-4 py-3 font-medium text-neutral-600">Código</th>
                                    <th className="px-4 py-3 font-medium text-neutral-600">Total</th>
                                    <th className="px-4 py-3 font-medium text-neutral-600">Estado</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.slice(0, 5).map((order) => (
                                    <tr key={order.id} className="border-b border-neutral-50">
                                        <td className="px-4 py-3 font-mono text-xs">{order.order_code}</td>
                                        <td className="px-4 py-3 font-semibold">{formatCurrency(order.total_amount)}</td>
                                        <td className="px-4 py-3">
                                            <span className="capitalize text-neutral-600">{order.status}</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    )
}
