'use client'

import type { Product } from '@/types'
import { formatCurrency } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface PriceSummaryProps {
    product: Product
    unitPrice: number | null
    quantity: number
    styleName?: string
    material?: string
    designType?: string
    selectedColor?: string
    selectedSize?: string
    addInitial?: boolean
    initialPrice?: number
}

export function PriceSummary({
    product,
    unitPrice,
    quantity,
    styleName,
    material,
    designType,
    selectedColor,
    selectedSize,
    addInitial,
    initialPrice,
}: PriceSummaryProps) {
    const price = unitPrice ?? 0
    const initialTotal = addInitial && initialPrice ? initialPrice * quantity : 0
    const subtotal = price * quantity + initialTotal

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-lg">Resumen del pedido</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                    <span className="text-neutral-600">Producto</span>
                    <span className="font-medium">{product.name}</span>
                </div>

                {styleName && (
                    <div className="flex justify-between text-sm">
                        <span className="text-neutral-600">Estilo</span>
                        <span>{styleName}</span>
                    </div>
                )}

                {material && (
                    <div className="flex justify-between text-sm">
                        <span className="text-neutral-600">Material</span>
                        <span>{material}</span>
                    </div>
                )}

                {designType && (
                    <div className="flex justify-between text-sm">
                        <span className="text-neutral-600">Tipo diseño</span>
                        <span>{designType}</span>
                    </div>
                )}

                {selectedColor && (
                    <div className="flex justify-between text-sm">
                        <span className="text-neutral-600">Color</span>
                        <span>{selectedColor}</span>
                    </div>
                )}

                {selectedSize && (
                    <div className="flex justify-between text-sm">
                        <span className="text-neutral-600">Talla</span>
                        <span>{selectedSize}</span>
                    </div>
                )}

                <div className="flex justify-between text-sm">
                    <span className="text-neutral-600">Precio unitario</span>
                    <span>{formatCurrency(price)}</span>
                </div>

                <div className="flex justify-between text-sm">
                    <span className="text-neutral-600">Cantidad</span>
                    <span>×{quantity}</span>
                </div>

                {addInitial && initialPrice && (
                    <div className="flex justify-between text-sm">
                        <span className="text-neutral-600">Iniciales (×{quantity})</span>
                        <span>{formatCurrency(initialTotal)}</span>
                    </div>
                )}

                <div className="border-t border-neutral-200 pt-2 flex justify-between text-base font-bold">
                    <span>Total</span>
                    <span>{formatCurrency(subtotal)}</span>
                </div>
            </CardContent>
        </Card>
    )
}
