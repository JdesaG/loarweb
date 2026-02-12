'use client'

import { ShoppingCart, CreditCard } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface CartButtonProps {
    onAddToCart: () => void
    onBuyNow: () => void
    disabled?: boolean
}

export function CartButton({ onAddToCart, onBuyNow, disabled }: CartButtonProps) {
    return (
        <div className="flex flex-col gap-3 sm:flex-row">
            <Button
                variant="outline"
                size="lg"
                onClick={onAddToCart}
                disabled={disabled}
                className="flex-1"
            >
                <ShoppingCart className="h-4 w-4" />
                Seguir comprando
            </Button>
            <Button
                variant="brand"
                size="lg"
                onClick={onBuyNow}
                disabled={disabled}
                className="flex-1"
            >
                <CreditCard className="h-4 w-4" />
                Comprar ahora
            </Button>
        </div>
    )
}
