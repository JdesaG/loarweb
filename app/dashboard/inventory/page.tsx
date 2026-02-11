
'use client'

import { useInventory } from "@/hooks/useInventory" // Use general hook? No, inventory page needs all items. 
// Wait, useInventory in hooks takes a productId. 
// I need a hook for ALL inventory for the admin page.
// The prompted `useInventory.ts` was specific to "Subscribe a inventory de producto específico".
// I should probably update `useInventory` to handle "all" or create a new hook, 
// OR just keep the fetch logic in the page as I did, but use the `InventoryRow` component.
// I'll stick to the fetch logic in page for "all inventory" or create a `useAllInventory` hook if I want to be cleaner, 
// but strictly following "hooks/" list: `useInventory.ts` (Fetch y realtime de inventory). 
// The description said "Subscribe a inventory de producto específico". 
// But `app/dashboard/inventory/page.tsx` needs all. 
// I'll keep the logic in the page for now but use the component.

import { createBrowserSupabaseClient } from "@/lib/supabase"
import { InventoryItem } from "@/types"
import { useEffect, useState } from "react"
import { InventoryRow } from "@/components/dashboard/InventoryRow"
import { LoadingSpinner } from "@/components/shared/LoadingSpinner"

export default function InventoryPage() {
    const [inventory, setInventory] = useState<InventoryItem[]>([])
    const [loading, setLoading] = useState(true)
    const supabase = createBrowserSupabaseClient()

    useEffect(() => {
        fetchInventory()
    }, [])

    async function fetchInventory() {
        setLoading(true)
        const { data } = await supabase
            .from('inventory')
            .select('*, products(name)')
            .order('created_at', { ascending: false })

        if (data) setInventory(data)
        setLoading(false)
    }

    const updateQuantity = async (id: string, newQty: number) => {
        try {
            const res = await fetch(`/api/inventory/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ quantityAvailable: newQty })
            })

            if (res.ok) {
                setInventory(current =>
                    current.map(item => item.id === id ? { ...item, quantity_available: newQty } : item)
                )
            }
        } catch (e) {
            console.error(e)
        }
    }

    if (loading) return <LoadingSpinner />

    return (
        <div className="container mx-auto py-8">
            <h1 className="mb-8 text-3xl font-bold">Inventory</h1>

            <div className="rounded-md border">
                <div className="w-full overflow-auto">
                    <table className="w-full caption-bottom text-sm text-left">
                        <thead className="[&_tr]:border-b">
                            <tr className="border-b transition-colors hover:bg-muted/50">
                                <th className="h-12 px-4 align-middle font-medium">Product</th>
                                <th className="h-12 px-4 align-middle font-medium">Style</th>
                                <th className="h-12 px-4 align-middle font-medium">Color</th>
                                <th className="h-12 px-4 align-middle font-medium">Size</th>
                                <th className="h-12 px-4 align-middle font-medium">Qty</th>
                                <th className="h-12 px-4 align-middle font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="[&_tr:last-child]:border-0">
                            {inventory.map((item) => (
                                <InventoryRow
                                    key={item.id}
                                    item={item}
                                    onUpdateQuantity={updateQuantity}
                                />
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
