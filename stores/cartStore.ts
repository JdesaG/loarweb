'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Product, CartItem } from '@/types'
import { generateId } from '@/lib/utils'

interface CartState {
    items: CartItem[]
    addItem: (
        product: Product,
        quantity: number,
        unitPrice: number,
        opts: {
            styleName?: string
            selectedColor?: string
            selectedSize?: string
            material?: string
            designType?: string
            designMainUrl?: string
            designSecondaryUrl?: string
            placementInstructions?: string
            addInitial?: boolean
            initialLetter?: string
            initialPrice?: number
        }
    ) => void
    removeItem: (id: string) => void
    clearCart: () => void
}

export const useCartStore = create<CartState>()(
    persist(
        (set) => ({
            items: [],

            addItem: (product, quantity, unitPrice, opts) =>
                set((state) => ({
                    items: [
                        ...state.items,
                        {
                            id: generateId(),
                            product,
                            quantity,
                            unitPrice,
                            ...opts,
                        },
                    ],
                })),

            removeItem: (id) =>
                set((state) => ({
                    items: state.items.filter((item) => item.id !== id),
                })),

            clearCart: () => set({ items: [] }),
        }),
        {
            name: 'loar-cart',
        }
    )
)
