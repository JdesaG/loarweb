'use client'

import { useEffect, useState, useCallback } from 'react'
import { useSupabase } from './supabase'
import type { InventoryItem } from '@/types'

export function useInventory(productId?: string) {
    const supabase = useSupabase()
    const [inventory, setInventory] = useState<InventoryItem[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchInventory = useCallback(async () => {
        setLoading(true)
        let query = supabase
            .from('inventory')
            .select('*, products(name, images)')
            .eq('is_visible', true)
            .order('created_at', { ascending: false })

        if (productId) {
            query = query.eq('product_id', productId)
        }

        const { data, error: err } = await query

        if (err) {
            setError(err.message)
        } else {
            setInventory((data as unknown as InventoryItem[]) ?? [])
            setError(null)
        }
        setLoading(false)
    }, [supabase, productId])

    useEffect(() => {
        fetchInventory()

        const channel = supabase
            .channel(`inventory-realtime-${productId ?? 'all'}`)
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'inventory' },
                () => {
                    fetchInventory()
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [supabase, productId, fetchInventory])

    // Derived data: unique values for selects
    const styles = [...new Set(inventory.map((i) => i.style).filter(Boolean))] as string[]
    const materials = [...new Set(inventory.map((i) => i.material).filter(Boolean))] as string[]
    const designTypes = [...new Set(inventory.map((i) => i.design_type).filter(Boolean))] as string[]
    const colors = [...new Set(inventory.map((i) => i.color).filter(Boolean))] as string[]
    const sizes = [...new Set(inventory.map((i) => i.size).filter(Boolean))] as string[]

    return {
        inventory,
        loading,
        error,
        refetch: fetchInventory,
        styles,
        materials,
        designTypes,
        colors,
        sizes,
    }
}
