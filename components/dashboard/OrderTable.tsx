'use client'

import { useState } from 'react'
import type { Order, OrderStatus } from '@/types'
import { formatCurrency, formatDate, statusLabel, statusColor } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { OrderDetail } from './OrderDetail'

interface OrderTableProps {
    orders: Order[]
    onStatusChange?: (orderId: string, status: OrderStatus) => void
}

const statuses: OrderStatus[] = ['pending', 'processing', 'shipped', 'completed', 'cancelled']

export function OrderTable({ orders, onStatusChange }: OrderTableProps) {
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
    const [filter, setFilter] = useState<string>('all')

    const filteredOrders = filter === 'all'
        ? orders
        : orders.filter((o) => o.status === filter)

    return (
        <div className="space-y-4">
            {/* Filter */}
            <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-neutral-500 uppercase tracking-wide">
                    {filteredOrders.length} órdenes
                </h2>
                <Select value={filter} onValueChange={setFilter}>
                    <SelectTrigger className="w-40">
                        <SelectValue placeholder="Filtrar" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Todas</SelectItem>
                        {statuses.map((s) => (
                            <SelectItem key={s} value={s}>{statusLabel(s)}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Table */}
            <div className="overflow-x-auto rounded-lg border border-neutral-200">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-neutral-50">
                            <TableHead>Código</TableHead>
                            <TableHead>Cliente</TableHead>
                            <TableHead>Total</TableHead>
                            <TableHead>Estado</TableHead>
                            <TableHead>Fecha</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredOrders.map((order) => (
                            <TableRow
                                key={order.id}
                                onClick={() => setSelectedOrder(order)}
                                className="cursor-pointer hover:bg-neutral-50"
                            >
                                <TableCell className="font-mono text-sm">{order.order_code}</TableCell>
                                <TableCell className="text-sm text-neutral-700">{order.customer_name}</TableCell>
                                <TableCell className="text-sm font-semibold">{formatCurrency(order.total)}</TableCell>
                                <TableCell>
                                    {onStatusChange ? (
                                        <Select
                                            value={order.status}
                                            onValueChange={(v) => {
                                                onStatusChange(order.id, v as OrderStatus)
                                            }}
                                        >
                                            <SelectTrigger className="h-7 w-32 text-xs" onClick={(e) => e.stopPropagation()}>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {statuses.map((s) => (
                                                    <SelectItem key={s} value={s}>{statusLabel(s)}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    ) : (
                                        <Badge className={statusColor(order.status)}>
                                            {statusLabel(order.status)}
                                        </Badge>
                                    )}
                                </TableCell>
                                <TableCell className="text-sm text-neutral-500">{formatDate(order.created_at)}</TableCell>
                            </TableRow>
                        ))}
                        {filteredOrders.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-8 text-neutral-400">
                                    No hay órdenes
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Detail dialog */}
            {selectedOrder && (
                <OrderDetail
                    order={selectedOrder}
                    open={!!selectedOrder}
                    onOpenChange={(open) => !open && setSelectedOrder(null)}
                />
            )}
        </div>
    )
}
