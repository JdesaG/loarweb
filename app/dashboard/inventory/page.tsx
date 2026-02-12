'use client'

import { useEffect, useState, useCallback } from 'react'
import { InventoryRow } from '@/components/dashboard/InventoryRow'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { EmptyState } from '@/components/shared/EmptyState'
import { Boxes } from 'lucide-react'
import type { InventoryItem } from '@/types'

export default function InventoryPage() {
    const [inventory, setInventory] = useState<InventoryItem[]>([])
    const [loading, setLoading] = useState(true)

    const fetchInventory = useCallback(async () => {
        setLoading(true)
        try {
            const res = await fetch('/api/inventory')
            if (!res.ok) throw new Error('Failed')
            const data = await res.json()
            setInventory(data)
        } catch {
            console.error('Error fetching inventory')
        }
        setLoading(false)
    }, [])

    useEffect(() => {
        fetchInventory()
    }, [fetchInventory])

    const handleUpdate = async (id: string, data: { quantityAvailable?: number; isVisible?: boolean }) => {
        const res = await fetch(`/api/inventory/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        })
        if (!res.ok) throw new Error('Failed')
        await fetchInventory()
    }

    if (loading) {
        return <LoadingSpinner className="py-20" text="Cargando inventario..." />
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-neutral-900">Inventario</h1>
                <p className="text-neutral-500 text-sm">Gestiona el stock y visibilidad de variantes</p>
            </div>

            {inventory.length === 0 ? (
                <EmptyState
                    title="Sin inventario"
                    description="Agrega variantes de productos desde Supabase."
                    icon={<Boxes className="h-8 w-8 text-neutral-400" />}
                />
            ) : (
                <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-neutral-100 bg-neutral-50 text-left">
                                <th className="px-4 py-3 font-medium text-neutral-600">Producto / Variante</th>
                                <th className="px-4 py-3 font-medium text-neutral-600 w-40">Stock</th>
                                <th className="px-4 py-3 font-medium text-neutral-600 w-20">Visible</th>
                            </tr>
                        </thead>
                        <tbody>
                            {inventory.map((item) => (
                                <InventoryRow key={item.id} item={item} onUpdate={handleUpdate} />
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}
