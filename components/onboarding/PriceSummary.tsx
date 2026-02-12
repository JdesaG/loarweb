'use client'

import { formatCurrency } from '@/lib/utils'
import type { Product, DesignDetails } from '@/types'

interface PriceSummaryProps {
    product: Product
    unitPrice: number | null
    quantity: number
    designDetails: DesignDetails
}

export function PriceSummary({ product, unitPrice, quantity, designDetails }: PriceSummaryProps) {
    const price = unitPrice ?? product.base_price
    const subtotal = price * quantity

    return (
        <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-5 space-y-3">
            <h4 className="text-sm font-semibold text-neutral-700 uppercase tracking-wide">
                Resumen de precio
            </h4>

            <div className="space-y-2 text-sm">
                <div className="flex justify-between text-neutral-600">
                    <span>{product.name}</span>
                    <span>{formatCurrency(price)}</span>
                </div>

                {designDetails.style && (
                    <div className="flex justify-between text-neutral-500">
                        <span>Estilo: {designDetails.style}</span>
                    </div>
                )}
                {designDetails.material && (
                    <div className="flex justify-between text-neutral-500">
                        <span>Material: {designDetails.material}</span>
                    </div>
                )}
                {designDetails.color && (
                    <div className="flex justify-between text-neutral-500">
                        <span>Color: {designDetails.color}</span>
                    </div>
                )}
                {designDetails.size && (
                    <div className="flex justify-between text-neutral-500">
                        <span>Talla: {designDetails.size}</span>
                    </div>
                )}

                <div className="flex justify-between text-neutral-600">
                    <span>Cantidad</span>
                    <span>×{quantity}</span>
                </div>

                <div className="border-t border-neutral-200 pt-2 flex justify-between font-bold text-neutral-900 text-base">
                    <span>Total</span>
                    <span>{formatCurrency(subtotal)}</span>
                </div>
            </div>
        </div>
    )
}
