'use client'

import type { Order } from '@/types'
import { formatCurrency, formatDate, statusLabel, statusColor } from '@/lib/utils'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Download, ExternalLink, MapPin, Receipt, Image as ImageIcon } from 'lucide-react'

interface OrderDetailProps {
    order: Order
    open: boolean
    onOpenChange: (open: boolean) => void
}

/** Download or open a design image — supports both URLs and base64 */
function downloadDesignImage(value: string, fileName: string) {
    // If it's a URL (from Supabase Storage), open in new tab
    if (value.startsWith('http://') || value.startsWith('https://')) {
        window.open(value, '_blank')
        return
    }

    // Legacy: base64 data → convert to blob and download
    const dataUri = value.startsWith('data:') ? value : `data:image/png;base64,${value}`
    const byteString = atob(dataUri.split(',')[1])
    const mimeString = dataUri.split(',')[0].split(':')[1].split(';')[0]

    const ab = new ArrayBuffer(byteString.length)
    const ia = new Uint8Array(ab)
    for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i)
    }

    const blob = new Blob([ab], { type: mimeString })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = fileName
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
}

export function OrderDetail({ order, open, onOpenChange }: OrderDetailProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-3">
                        <span className="font-mono">{order.order_code}</span>
                        <Badge className={statusColor(order.status)}>
                            {statusLabel(order.status)}
                        </Badge>
                    </DialogTitle>
                    <DialogDescription>
                        Detalles completos de la orden y estado actual.
                    </DialogDescription>
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

                        {/* Location button */}
                        {order.location_url && (
                            <a
                                href={order.location_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 mt-3 text-xs font-medium text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 rounded-md px-3 py-1.5 transition-colors"
                            >
                                <MapPin className="h-3.5 w-3.5" />
                                Ver ubicación en mapa
                            </a>
                        )}
                    </div>

                    {/* Items */}
                    {order.order_items && order.order_items.length > 0 && (
                        <div>
                            <h4 className="text-sm font-semibold text-neutral-500 mb-2">Productos</h4>
                            <div className="space-y-2">
                                {order.order_items.map((item, idx) => (
                                    <div key={item.id} className="rounded-md bg-neutral-50 p-3 text-sm">
                                        <div className="flex items-center justify-between">
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

                                        {/* Design download buttons */}
                                        {(item.design_main_url || item.design_secondary_url) && (
                                            <div className="flex flex-wrap gap-2 mt-2 pt-2 border-t border-neutral-200">
                                                {item.design_main_url && (
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            downloadDesignImage(
                                                                item.design_main_url!,
                                                                `${order.order_code}_item${idx + 1}_diseño_frontal.png`
                                                            )
                                                        }
                                                        className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700 hover:text-emerald-900 bg-emerald-50 hover:bg-emerald-100 rounded-md px-2.5 py-1.5 transition-colors"
                                                    >
                                                        <Download className="h-3.5 w-3.5" />
                                                        Diseño frontal
                                                    </button>
                                                )}
                                                {item.design_secondary_url && (
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            downloadDesignImage(
                                                                item.design_secondary_url!,
                                                                `${order.order_code}_item${idx + 1}_diseño_trasero.png`
                                                            )
                                                        }
                                                        className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700 hover:text-emerald-900 bg-emerald-50 hover:bg-emerald-100 rounded-md px-2.5 py-1.5 transition-colors"
                                                    >
                                                        <Download className="h-3.5 w-3.5" />
                                                        Diseño trasero
                                                    </button>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Payment receipt */}
                    {order.payment_receipt_url && (
                        <div>
                            <h4 className="text-sm font-semibold text-neutral-500 mb-2">Comprobante de pago</h4>
                            <a
                                href={order.payment_receipt_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-700 hover:text-amber-900 bg-amber-50 hover:bg-amber-100 rounded-md px-3 py-1.5 transition-colors"
                            >
                                <Receipt className="h-3.5 w-3.5" />
                                Ver comprobante
                                <ExternalLink className="h-3 w-3" />
                            </a>
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
