import { create } from 'zustand'
import type { Product } from '@/types'

interface ConfiguratorState {
    step: number
    productId: string | null
    product: Product | null
    style: string
    material: string
    designType: string
    color: string
    size: string
    customText: string
    placement: string
    imageFile: File | null
    imagePreview: string | null
    initialLetter: string
    hasInitial: boolean
    unitPrice: number | null
    pricingId: string | null
    quantity: number

    // Actions
    setStep: (step: number) => void
    setProduct: (product: Product) => void
    setField: <K extends keyof ConfiguratorState>(key: K, value: ConfiguratorState[K]) => void
    setPrice: (unitPrice: number, pricingId: string | null) => void
    reset: () => void
}

const initialState = {
    step: 1,
    productId: null as string | null,
    product: null as Product | null,
    style: '',
    material: '',
    designType: '',
    color: '',
    size: '',
    customText: '',
    placement: '',
    imageFile: null as File | null,
    imagePreview: null as string | null,
    initialLetter: '',
    hasInitial: false,
    unitPrice: null as number | null,
    pricingId: null as string | null,
    quantity: 1,
}

export const useConfiguratorStore = create<ConfiguratorState>()((set) => ({
    ...initialState,

    setStep: (step) => set({ step }),

    setProduct: (product) => set({ product, productId: product.id }),

    setField: (key, value) => set({ [key]: value }),

    setPrice: (unitPrice, pricingId) => set({ unitPrice, pricingId }),

    reset: () => set(initialState),
}))
