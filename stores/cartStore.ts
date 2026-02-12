import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CartItem, Product, DesignDetails } from '@/types'
import { generateId } from '@/lib/utils'

interface CartState {
    items: CartItem[]
    addItem: (product: Product, quantity: number, unitPrice: number, designDetails: DesignDetails) => void
    removeItem: (id: string) => void
    updateQuantity: (id: string, quantity: number) => void
    clearCart: () => void
    getTotal: () => number
    getItemCount: () => number
}

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            items: [],

            addItem: (product, quantity, unitPrice, designDetails) => {
                const newItem: CartItem = {
                    id: generateId(),
                    product,
                    quantity,
                    unitPrice,
                    designDetails,
                }
                set((state) => ({ items: [...state.items, newItem] }))
            },

            removeItem: (id) => {
                set((state) => ({ items: state.items.filter((item) => item.id !== id) }))
            },

            updateQuantity: (id, quantity) => {
                set((state) => ({
                    items: state.items.map((item) =>
                        item.id === id ? { ...item, quantity } : item
                    ),
                }))
            },

            clearCart: () => set({ items: [] }),

            getTotal: () => {
                return get().items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0)
            },

            getItemCount: () => {
                return get().items.reduce((sum, item) => sum + item.quantity, 0)
            },
        }),
        {
            name: 'loar-cart',
        }
    )
)
