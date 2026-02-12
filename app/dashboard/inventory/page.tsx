'use client'

import { useEffect, useState } from 'react'
import { useInventory } from '@/hooks/useInventory'
import { InventoryRow } from '@/components/dashboard/InventoryRow'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { EmptyState } from '@/components/shared/EmptyState'
import {
    Table,
    TableBody,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { Package } from 'lucide-react'
import { toast } from 'sonner'
import type { InventoryItem } from '@/types'

export default function InventoryPage() {
    const [items, setItems] = useState<InventoryItem[]>([])
    const [loading, setLoading] = useState(true)

    const fetchInventory = async () => {
        setLoading(true)
        try {
            const res = await fetch('/api/inventory')
            if (!res.ok) throw new Error('Failed to fetch inventory')
            const data = await res.json()
            setItems(data)
        } catch {
            toast.error('Error al cargar inventario')
        }
        setLoading(false)
    }

    useEffect(() => {
        fetchInventory()
    }, [])

    const handleUpdate = async (id: string, data: Partial<InventoryItem>) => {
        try {
            const res = await fetch(`/api/inventory/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            })
            if (!res.ok) throw new Error('Failed to update')
            toast.success('Inventario actualizado')
            fetchInventory()
        } catch {
            toast.error('Error al actualizar')
        }
    }

    if (loading) return <LoadingSpinner className="py-20" text="Cargando inventario..." />

    if (items.length === 0) {
        return <EmptyState title="Sin inventario" description="Agrega variantes de stock desde Supabase." icon={<Package className="h-8 w-8 text-neutral-400" />} />
    }

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-neutral-900">Inventario</h1>

            <div className="overflow-x-auto rounded-lg border border-neutral-200">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-neutral-50">
                            <TableHead>Producto</TableHead>
                            <TableHead>Color</TableHead>
                            <TableHead>Talla</TableHead>
                            <TableHead>Stock</TableHead>
                            <TableHead>Visible</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {items.map((item) => (
                            <InventoryRow key={item.id} item={item} onUpdate={handleUpdate} />
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
