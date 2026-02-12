'use client'

import { create } from 'zustand'
import type { Product, ConfiguratorState } from '@/types'

interface ConfiguratorActions {
    setProduct: (product: Product) => void
    setStep: (step: number) => void
    setField: <K extends keyof ConfiguratorState>(key: K, value: ConfiguratorState[K]) => void
    setPrice: (unitPrice: number, pricingId: string | null) => void
    reset: () => void
}

const initialState: ConfiguratorState = {
    product: null,
    step: 1,
    designType: '',
    color: '',
    size: '',
    quantity: 1,
    imageFile: null,
    imagePreview: null,
    imageFile2: null,
    imagePreview2: null,
    placement: '',
    hasInitial: false,
    initialLetter: '',
    designMainUrl: null,
    designSecondaryUrl: null,
    unitPrice: null,
    pricingId: null,
}

export const useConfiguratorStore = create<ConfiguratorState & ConfiguratorActions>((set) => ({
    ...initialState,

    setProduct: (product) =>
        set({ ...initialState, product }),

    setStep: (step) =>
        set({ step }),

    setField: (key, value) =>
        set({ [key]: value } as Partial<ConfiguratorState>),

    setPrice: (unitPrice, pricingId) =>
        set({ unitPrice, pricingId }),

    reset: () =>
        set(initialState),
}))
