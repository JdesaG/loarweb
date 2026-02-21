'use client'

import { useEffect, useState, useCallback } from 'react'
import { useSupabase } from './supabase'
import type { Product } from '@/types'

export function useProducts() {
    const supabase = useSupabase()
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchProducts = useCallback(async () => {
        setLoading(true)
        const { data, error: err } = await supabase
            .from('products')
            .select('*, product_pricing(price, design_type, material, min_qty)')
            .eq('is_active', true)
            .order('name')

        if (err) {
            setError(err.message)
        } else {
            const formattedProducts = (data as any[]).map(p => ({
                ...p,
                price: p.product_pricing?.find((pp: any) =>
                    pp.design_type === 'sin_diseño' &&
                    pp.material === 'llano' &&
                    pp.min_qty === 1
                )?.price
            }))
            setProducts(formattedProducts as Product[])
            setError(null)
        }
        setLoading(false)
    }, [supabase])

    useEffect(() => {
        fetchProducts()

        // Realtime subscription
        const channel = supabase
            .channel('products-realtime')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'products' },
                () => {
                    fetchProducts()
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [supabase, fetchProducts])

    return { products, loading, error, refetch: fetchProducts }
}
