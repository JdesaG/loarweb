'use client'

import { useState, useCallback } from 'react'
import type { PriceResponse } from '@/types'

export function usePriceCalculation() {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const calculatePrice = useCallback(
        async (params: {
            productId: string
            styleName?: string
            material?: string
            designType?: string
            quantity?: number
        }): Promise<PriceResponse | null> => {
            setLoading(true)
            setError(null)

            try {
                const res = await fetch('/api/calculate-price', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(params),
                })

                if (!res.ok) {
                    const data = await res.json()
                    throw new Error(data.error || 'Failed to calculate price')
                }

                const data: PriceResponse = await res.json()
                return data
            } catch (err: unknown) {
                const message = err instanceof Error ? err.message : 'Unknown error'
                setError(message)
                return null
            } finally {
                setLoading(false)
            }
        },
        []
    )

    return { calculatePrice, loading, error }
}
