
import { useEffect, useState } from 'react'
import { createBrowserSupabaseClient } from '@/lib/supabase'
import { InventoryItem } from '@/types'

export function useInventory(productId: string | null) {
    const [inventory, setInventory] = useState<InventoryItem[]>([])
    const [loading, setLoading] = useState(false)

    const supabase = createBrowserSupabaseClient()

    useEffect(() => {
        if (!productId) return

        fetchInventory()

        const channel = supabase
            .channel(`inventory-${productId}`)
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'inventory',
                    filter: `product_id=eq.${productId}`
                },
                () => {
                    fetchInventory()
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [productId])

    async function fetchInventory() {
        if (!productId) return
        setLoading(true)
        const { data } = await supabase
            .from('inventory')
            .select('*')
            .eq('product_id', productId)
            .eq('is_visible', true) // Only show visible items to configurator
            .gt('quantity_available', 0) // Only show in-stock

        setInventory(data || [])
        setLoading(false)
    }

    return { inventory, loading }
}
