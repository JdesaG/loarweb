
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { DesignDetails } from '@/types'

export interface CartItem {
    id: string // temporary uuid for cart
    productId: string
    productName: string
    productImage: string
    quantity: number
    unitPrice: number
    designDetails: DesignDetails
}

interface CartState {
    items: CartItem[]
    addItem: (item: CartItem) => void
    removeItem: (id: string) => void
    clearCart: () => void
    total: () => number
}

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            items: [],
            addItem: (item) => set((state) => ({ items: [...state.items, item] })),
            removeItem: (id) => set((state) => ({ items: state.items.filter((i) => i.id !== id) })),
            clearCart: () => set({ items: [] }),
            total: () => get().items.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0),
        }),
        {
            name: 'cart-storage',
        }
    )
)
