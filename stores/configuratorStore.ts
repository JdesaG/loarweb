
import { create } from 'zustand'
import { DesignDetails } from '@/types'

interface ConfiguratorState {
    step: number
    productId: string | null
    configuration: DesignDetails
    quantity: number
    setStep: (step: number) => void
    setProductId: (id: string) => void
    updateConfiguration: (updates: Partial<DesignDetails>) => void
    setQuantity: (q: number) => void
    reset: () => void
}

const initialState = {
    step: 1,
    productId: null,
    configuration: {},
    quantity: 1,
}

export const useConfiguratorStore = create<ConfiguratorState>((set) => ({
    ...initialState,
    setStep: (step) => set({ step }),
    setProductId: (productId) => set({ productId }),
    updateConfiguration: (updates) =>
        set((state) => ({ configuration: { ...state.configuration, ...updates } })),
    setQuantity: (quantity) => set({ quantity }),
    reset: () => set(initialState),
}))
