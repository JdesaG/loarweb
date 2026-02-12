'use client'

import { useCartStore } from '@/stores/cartStore'

// Thin wrapper around the Zustand store for consistency
export function useCart() {
    const items = useCartStore((s) => s.items)
    const addItem = useCartStore((s) => s.addItem)
    const removeItem = useCartStore((s) => s.removeItem)
    const updateQuantity = useCartStore((s) => s.updateQuantity)
    const clearCart = useCartStore((s) => s.clearCart)
    const getTotal = useCartStore((s) => s.getTotal)
    const getItemCount = useCartStore((s) => s.getItemCount)

    return {
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        total: getTotal(),
        itemCount: getItemCount(),
    }
}
