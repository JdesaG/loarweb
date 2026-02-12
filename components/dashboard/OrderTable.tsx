'use client'

import { useState } from 'react'
import type { Order, OrderStatus } from '@/types'
import { formatCurrency, formatDate, getStatusConfig } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { OrderDetail } from './OrderDetail'
import { EmptyState } from '@/components/shared/EmptyState'
import { ChevronDown, ChevronUp, Filter, Package } from 'lucide-react'
import { toast } from 'sonner'

interface OrderTableProps {
    orders: Order[]
    loading: boolean
    onStatusChange: (orderId: string, status: OrderStatus) => Promise<void>
    onFilter: (filters: { status?: string; dateFrom?: string; dateTo?: string }) => void
}

const STATUSES: { value: string; label: string }[] = [
    { value: 'all', label: 'Todos' },
    { value: 'pending', label: 'Pendiente' },
    { value: 'processing', label: 'En Proceso' },
    { value: 'shipped', label: 'Enviado' },
    { value: 'completed', label: 'Completado' },
    { value: 'cancelled', label: 'Cancelado' },
]

export function OrderTable({ orders, loading, onStatusChange, onFilter }: OrderTableProps) {
    const [expandedId, setExpandedId] = useState<string | null>(null)
    const [filterStatus, setFilterStatus] = useState('all')
    const [updatingId, setUpdatingId] = useState<string | null>(null)

    const handleStatusFilter = (val: string) => {
        setFilterStatus(val)
        onFilter({ status: val })
    }

    const handleStatusUpdate = async (orderId: string, newStatus: OrderStatus) => {
        setUpdatingId(orderId)
        try {
            await onStatusChange(orderId, newStatus)
            toast.success('Estado actualizado')
        } catch {
            toast.error('Error al actualizar')
        }
        setUpdatingId(null)
    }

    if (!loading && orders.length === 0) {
        return (
            <EmptyState
                title="Sin pedidos"
                description="Los pedidos aparecerán aquí cuando los clientes ordenen."
                icon={<Package className="h-8 w-8 text-neutral-400" />}
            />
        )
    }

    return (
        <div className="space-y-4">
            {/* Filters */}
            <div className="flex items-center gap-3">
                <Filter className="h-4 w-4 text-neutral-500" />
                <Select value={filterStatus} onValueChange={handleStatusFilter}>
                    <SelectTrigger className="w-44">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        {STATUSES.map((s) => (
                            <SelectItem key={s.value} value={s.value}>
                                {s.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Table */}
            <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-neutral-100 bg-neutral-50 text-left">
                            <th className="px-4 py-3 font-medium text-neutral-600">Código</th>
                            <th className="px-4 py-3 font-medium text-neutral-600 hidden sm:table-cell">Cliente</th>
                            <th className="px-4 py-3 font-medium text-neutral-600">Total</th>
                            <th className="px-4 py-3 font-medium text-neutral-600">Estado</th>
                            <th className="px-4 py-3 font-medium text-neutral-600 hidden md:table-cell">Fecha</th>
                            <th className="px-4 py-3 font-medium text-neutral-600 w-12"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order) => {
                            const statusCfg = getStatusConfig(order.status)
                            const isExpanded = expandedId === order.id
                            return (
                                <tr key={order.id} className="group">
                                    <td colSpan={6} className="p-0">
                                        <div>
                                            <div className="flex items-center border-b border-neutral-50 group-hover:bg-neutral-50/50 transition-colors">
                                                <div className="px-4 py-3 font-mono text-xs font-semibold text-neutral-900 w-[140px]">
                                                    {order.order_code}
                                                </div>
                                                <div className="px-4 py-3 text-neutral-700 hidden sm:block flex-1">
                                                    {(order.customer_info as unknown as Record<string, string>)?.fullName ?? '—'}
                                                </div>
                                                <div className="px-4 py-3 font-semibold text-neutral-900 w-[100px]">
                                                    {formatCurrency(order.total_amount)}
                                                </div>
                                                <div className="px-4 py-3 w-[160px]">
                                                    <Select
                                                        value={order.status}
                                                        onValueChange={(val) => handleStatusUpdate(order.id, val as OrderStatus)}
                                                        disabled={updatingId === order.id}
                                                    >
                                                        <SelectTrigger className="h-8 text-xs">
                                                            <span className={`${statusCfg.color}`}>{statusCfg.label}</span>
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {STATUSES.filter((s) => s.value !== 'all').map((s) => (
                                                                <SelectItem key={s.value} value={s.value}>
                                                                    {s.label}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div className="px-4 py-3 text-xs text-neutral-500 hidden md:block w-[150px]">
                                                    {formatDate(order.created_at)}
                                                </div>
                                                <div className="px-4 py-3 w-12">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => setExpandedId(isExpanded ? null : order.id)}
                                                    >
                                                        {isExpanded ? (
                                                            <ChevronUp className="h-4 w-4" />
                                                        ) : (
                                                            <ChevronDown className="h-4 w-4" />
                                                        )}
                                                    </Button>
                                                </div>
                                            </div>
                                            {isExpanded && (
                                                <div className="animate-in slide-in-from-top-2 fade-in duration-200">
                                                    <OrderDetail order={order} />
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
