'use client'

import { useState } from 'react'
import type { InventoryItem } from '@/types'
import { getStockColor } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { TableCell, TableRow } from '@/components/ui/table'
import { Check, Loader2, X } from 'lucide-react'

interface InventoryRowProps {
    item: InventoryItem
    onUpdate: (id: string, data: Partial<InventoryItem>) => Promise<void>
}

export function InventoryRow({ item, onUpdate }: InventoryRowProps) {
    const [editing, setEditing] = useState(false)
    const [quantity, setQuantity] = useState(item.quantity_available)
    const [saving, setSaving] = useState(false)

    const handleSave = async () => {
        setSaving(true)
        await onUpdate(item.id, { quantity_available: quantity })
        setSaving(false)
        setEditing(false)
    }

    const handleCancel = () => {
        setQuantity(item.quantity_available)
        setEditing(false)
    }

    const handleToggleVisible = async () => {
        setSaving(true)
        await onUpdate(item.id, { is_visible: !item.is_visible })
        setSaving(false)
    }

    const productName = item.products?.name ?? '—'

    return (
        <TableRow className={!item.is_visible ? 'opacity-50' : ''}>
            <TableCell className="font-medium text-sm">{productName}</TableCell>
            <TableCell className="text-sm">{item.color ?? '—'}</TableCell>
            <TableCell className="text-sm">{item.size ?? '—'}</TableCell>
            <TableCell>
                {editing ? (
                    <div className="flex items-center gap-1">
                        <Input
                            type="number"
                            min={0}
                            value={quantity}
                            onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
                            className="h-7 w-16 text-sm"
                        />
                        <Button size="icon" variant="ghost" className="h-7 w-7" onClick={handleSave} disabled={saving}>
                            {saving ? <Loader2 className="h-3 w-3 animate-spin" /> : <Check className="h-3 w-3 text-emerald-600" />}
                        </Button>
                        <Button size="icon" variant="ghost" className="h-7 w-7" onClick={handleCancel}>
                            <X className="h-3 w-3 text-red-500" />
                        </Button>
                    </div>
                ) : (
                    <button
                        onClick={() => setEditing(true)}
                        className={`text-sm font-semibold ${getStockColor(item.quantity_available)} hover:underline`}
                    >
                        {item.quantity_available}
                    </button>
                )}
            </TableCell>
            <TableCell>
                <Switch
                    checked={item.is_visible}
                    onCheckedChange={handleToggleVisible}
                    disabled={saving}
                />
            </TableCell>
        </TableRow>
    )
}
