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
        // Conditional query:
        // If we have productId (Detail/Configurator view), we DON'T need the join
        // If we are listing all (Dashboard), we NEED the join to know product names
        let query = supabase.from('inventory').select('*')

        if (productId) {
            query = query.eq('product_id', productId)
        } else {
            // Dashboard view: join products
            query = supabase
                .from('inventory')
                .select('*, products(name, base_image)')
        }

        // Apply common filters and sort
        query = query
            .eq('is_visible', true)
            // User confirmed table has updated_at, not created_at
            .order('updated_at', { ascending: false })

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

    // Derived data: unique values for selects (only color and size from inventory)
    const colors = [...new Set(inventory.map((i) => i.color).filter(Boolean))] as string[]
    const sizes = [...new Set(inventory.map((i) => i.size).filter(Boolean))] as string[]

    return {
        inventory,
        loading,
        error,
        refetch: fetchInventory,
        colors,
        sizes,
    }
}
