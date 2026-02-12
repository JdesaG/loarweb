'use client'

import { useOrders } from '@/hooks/useOrders'
import { useProducts } from '@/hooks/useProducts'
import { StatCard } from '@/components/dashboard/StatCard'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { formatCurrency } from '@/lib/utils'
import { DollarSign, Package, ShoppingCart, TrendingUp } from 'lucide-react'

export default function DashboardPage() {
    const { orders, loading: ordersLoading } = useOrders()
    const { products, loading: productsLoading } = useProducts()

    const loading = ordersLoading || productsLoading

    if (loading) return <LoadingSpinner className="py-20" text="Cargando dashboard..." />

    const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0)
    const pendingOrders = orders.filter((o) => o.status === 'pending').length

    return (
        <div className="space-y-8">
            <h1 className="text-2xl font-bold text-neutral-900">Dashboard</h1>

            {/* Stat cards */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    title="Ingresos"
                    value={formatCurrency(totalRevenue)}
                    icon={<DollarSign className="h-5 w-5" />}
                />
                <StatCard
                    title="Órdenes"
                    value={orders.length.toString()}
                    icon={<ShoppingCart className="h-5 w-5" />}
                />
                <StatCard
                    title="Productos"
                    value={products.length.toString()}
                    icon={<Package className="h-5 w-5" />}
                />
                <StatCard
                    title="Pendientes"
                    value={pendingOrders.toString()}
                    icon={<TrendingUp className="h-5 w-5" />}
                />
            </div>

            {/* Recent orders */}
            <div>
                <h2 className="mb-4 text-lg font-semibold text-neutral-900">Últimas órdenes</h2>
                <div className="overflow-hidden rounded-lg border border-neutral-200">
                    <table className="w-full text-sm">
                        <thead className="bg-neutral-50">
                            <tr>
                                <th className="px-4 py-3 text-left font-medium text-neutral-500">Código</th>
                                <th className="px-4 py-3 text-left font-medium text-neutral-500">Cliente</th>
                                <th className="px-4 py-3 text-left font-medium text-neutral-500">Total</th>
                                <th className="px-4 py-3 text-left font-medium text-neutral-500">Estado</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.slice(0, 5).map((order) => (
                                <tr key={order.id} className="border-t border-neutral-100 hover:bg-neutral-50">
                                    <td className="px-4 py-3 font-mono">{order.order_code}</td>
                                    <td className="px-4 py-3 text-neutral-700">{order.customer_name}</td>
                                    <td className="px-4 py-3 font-semibold">{formatCurrency(order.total)}</td>
                                    <td className="px-4 py-3">
                                        <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-neutral-100 text-neutral-700">
                                            {order.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                            {orders.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="px-4 py-8 text-center text-neutral-400">
                                        No hay órdenes aún
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
