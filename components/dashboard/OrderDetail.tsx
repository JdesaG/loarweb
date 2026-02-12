'use client'

import type { Order } from '@/types'
import { formatCurrency } from '@/lib/utils'
import Image from 'next/image'

interface OrderDetailProps {
    order: Order
}

export function OrderDetail({ order }: OrderDetailProps) {
    const customer = order.customer_info as unknown as Record<string, string>

    return (
        <div className="border-t border-neutral-100 bg-neutral-50/50 px-6 py-4 space-y-4">
            {/* Customer info */}
            <div>
                <h4 className="text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-2">
                    Información del cliente
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                    <div>
                        <span className="text-neutral-400 block text-xs">Nombre</span>
                        <span className="text-neutral-800">{customer?.fullName ?? '—'}</span>
                    </div>
                    <div>
                        <span className="text-neutral-400 block text-xs">Email</span>
                        <span className="text-neutral-800">{customer?.email ?? '—'}</span>
                    </div>
                    <div>
                        <span className="text-neutral-400 block text-xs">Teléfono</span>
                        <span className="text-neutral-800">{customer?.phone ?? '—'}</span>
                    </div>
                    <div>
                        <span className="text-neutral-400 block text-xs">Dirección</span>
                        <span className="text-neutral-800">{customer?.address ?? '—'}</span>
                    </div>
                </div>
                {customer?.notes && (
                    <div className="mt-2 text-sm">
                        <span className="text-neutral-400 text-xs">Notas: </span>
                        <span className="text-neutral-600">{customer.notes}</span>
                    </div>
                )}
            </div>

            {/* Items */}
            <div>
                <h4 className="text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-2">
                    Productos ({order.order_items?.length ?? 0})
                </h4>
                <div className="space-y-2">
                    {order.order_items?.map((item) => {
                        const details = item.design_details as Record<string, string> | null
                        const imgUrl = item.products?.images?.[0]
                        return (
                            <div key={item.id} className="flex gap-3 rounded-lg border border-neutral-200 bg-white p-3">
                                {imgUrl && (
                                    <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-md bg-neutral-100">
                                        <Image src={imgUrl} alt="" fill className="object-cover" sizes="56px" />
                                    </div>
                                )}
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-neutral-900">
                                        {item.products?.name ?? 'Producto'}
                                    </p>
                                    <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-neutral-500 mt-0.5">
                                        {details?.color && <span>Color: {details.color}</span>}
                                        {details?.size && <span>Talla: {details.size}</span>}
                                        {details?.style && <span>Estilo: {details.style}</span>}
                                        {details?.material && <span>Material: {details.material}</span>}
                                    </div>
                                </div>
                                <div className="text-right flex-shrink-0">
                                    <p className="text-sm font-semibold text-neutral-900">{formatCurrency(item.subtotal)}</p>
                                    <p className="text-xs text-neutral-500">×{item.quantity}</p>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
