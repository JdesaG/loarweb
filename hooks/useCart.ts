'use client'

import { useCartStore } from '@/stores/cartStore'

export function useCart() {
    const items = useCartStore((s) => s.items)
    const addItem = useCartStore((s) => s.addItem)
    const removeItem = useCartStore((s) => s.removeItem)
    const clearCart = useCartStore((s) => s.clearCart)

    const itemCount = items.length
    const total = items.reduce((sum, item) => {
        const initialCost = item.addInitial && item.initialPrice ? item.initialPrice * item.quantity : 0
        return sum + item.unitPrice * item.quantity + initialCost
    }, 0)

    return { items, addItem, removeItem, clearCart, itemCount, total }
}
