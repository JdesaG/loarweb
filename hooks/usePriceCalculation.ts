
import { useState } from 'react'
import { CalculatePriceInput } from '@/schemas/calculate'

export function usePriceCalculation() {
    const [loading, setLoading] = useState(false)

    async function calculate(input: CalculatePriceInput) {
        setLoading(true)
        try {
            const res = await fetch('/api/calculate-price', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(input)
            })
            const data = await res.json()
            if (!res.ok) throw new Error(data.error)
            return data.unitPrice
        } catch (error) {
            console.error(error)
            return null
        } finally {
            setLoading(false)
        }
    }

    return { calculate, loading }
}
