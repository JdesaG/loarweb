'use client'

import { useCartStore } from '@/stores/cartStore'
import { calculateComboDiscount } from '@/lib/combos'

export function useCart() {
    const items = useCartStore((s) => s.items)
    const addItem = useCartStore((s) => s.addItem)
    const removeItem = useCartStore((s) => s.removeItem)
    const clearCart = useCartStore((s) => s.clearCart)

    const itemCount = items.length

    const grossTotal = items.reduce((sum, item) => {
        const initialCost = item.addInitial && item.initialPrice ? item.initialPrice * item.quantity : 0
        return sum + item.unitPrice * item.quantity + initialCost
    }, 0)

    const { discount: comboDiscount, appliedCombos } = calculateComboDiscount(items)
    const total = Math.max(0, grossTotal - comboDiscount)

    return { items, addItem, removeItem, clearCart, itemCount, grossTotal, comboDiscount, appliedCombos, total }
}
