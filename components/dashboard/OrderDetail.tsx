'use client'

import type { Order } from '@/types'
import { formatCurrency, formatDate, statusLabel, statusColor } from '@/lib/utils'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'

interface OrderDetailProps {
    order: Order
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function OrderDetail({ order, open, onOpenChange }: OrderDetailProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-3">
                        <span className="font-mono">{order.order_code}</span>
                        <Badge className={statusColor(order.status)}>
                            {statusLabel(order.status)}
                        </Badge>
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    {/* Customer info */}
                    <div>
                        <h4 className="text-sm font-semibold text-neutral-500 mb-2">Cliente</h4>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>
                                <span className="text-neutral-500">Nombre: </span>
                                <span>{order.customer_name}</span>
                            </div>
                            {order.customer_email && (
                                <div>
                                    <span className="text-neutral-500">Email: </span>
                                    <span>{order.customer_email}</span>
                                </div>
                            )}
                            {order.customer_phone && (
                                <div>
                                    <span className="text-neutral-500">Teléfono: </span>
                                    <span>{order.customer_phone}</span>
                                </div>
                            )}
                            {order.customer_id_card && (
                                <div>
                                    <span className="text-neutral-500">Cédula: </span>
                                    <span>{order.customer_id_card}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Items */}
                    {order.order_items && order.order_items.length > 0 && (
                        <div>
                            <h4 className="text-sm font-semibold text-neutral-500 mb-2">Productos</h4>
                            <div className="space-y-2">
                                {order.order_items.map((item) => (
                                    <div key={item.id} className="flex items-center justify-between rounded-md bg-neutral-50 p-3 text-sm">
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium truncate">{item.product_name || 'Producto'}</p>
                                            <p className="text-xs text-neutral-500 flex flex-wrap gap-1">
                                                {item.style_name && <span>Estilo: {item.style_name}</span>}
                                                {item.selected_color && <span>· {item.selected_color}</span>}
                                                {item.selected_size && <span>· {item.selected_size}</span>}
                                                {item.material && <span>· {item.material}</span>}
                                            </p>
                                        </div>
                                        <div className="text-right ml-3">
                                            <p className="font-semibold">{formatCurrency(item.item_total)}</p>
                                            <p className="text-xs text-neutral-500">×{item.quantity}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Notes */}
                    {order.notas && (
                        <div>
                            <h4 className="text-sm font-semibold text-neutral-500 mb-1">Notas</h4>
                            <p className="text-sm text-neutral-700">{order.notas}</p>
                        </div>
                    )}

                    {/* Totals */}
                    <div className="border-t border-neutral-200 pt-3 space-y-1">
                        <div className="flex justify-between text-sm">
                            <span className="text-neutral-500">Subtotal</span>
                            <span>{formatCurrency(order.subtotal)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-neutral-500">Impuesto</span>
                            <span>{formatCurrency(order.tax)}</span>
                        </div>
                        <div className="flex justify-between text-base font-bold">
                            <span>Total</span>
                            <span>{formatCurrency(order.total)}</span>
                        </div>
                    </div>

                    <p className="text-xs text-neutral-400">{formatDate(order.created_at)}</p>
                </div>
            </DialogContent>
        </Dialog>
    )
}
