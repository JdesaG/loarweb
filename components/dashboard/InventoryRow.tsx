'use client'

import { useState } from 'react'
import type { InventoryItem } from '@/types'
import { cn, getStockColor, getStockBg } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Check, Eye, EyeOff, Pencil, X } from 'lucide-react'
import { toast } from 'sonner'

interface InventoryRowProps {
    item: InventoryItem
    onUpdate: (id: string, data: { quantityAvailable?: number; isVisible?: boolean }) => Promise<void>
}

export function InventoryRow({ item, onUpdate }: InventoryRowProps) {
    const [editing, setEditing] = useState(false)
    const [qty, setQty] = useState(item.quantity_available)
    const [saving, setSaving] = useState(false)

    const handleSave = async () => {
        setSaving(true)
        try {
            await onUpdate(item.id, { quantityAvailable: qty })
            setEditing(false)
            toast.success('Stock actualizado')
        } catch {
            toast.error('Error al guardar')
        }
        setSaving(false)
    }

    const handleToggleVisibility = async () => {
        setSaving(true)
        try {
            await onUpdate(item.id, { isVisible: !item.is_visible })
            toast.success(item.is_visible ? 'Oculto' : 'Visible')
        } catch {
            toast.error('Error al cambiar visibilidad')
        }
        setSaving(false)
    }

    return (
        <tr className="border-b border-neutral-100 hover:bg-neutral-50/50 transition-colors">
            <td className="px-4 py-3">
                <div>
                    <p className="font-medium text-neutral-900 text-sm">
                        {item.products?.name ?? '—'}
                    </p>
                    <div className="flex flex-wrap gap-1 mt-1">
                        {item.style && <Badge variant="outline" className="text-[10px]">{item.style}</Badge>}
                        {item.material && <Badge variant="outline" className="text-[10px]">{item.material}</Badge>}
                        {item.color && <Badge variant="secondary" className="text-[10px]">{item.color}</Badge>}
                        {item.size && <Badge variant="secondary" className="text-[10px]">{item.size}</Badge>}
                    </div>
                </div>
            </td>
            <td className="px-4 py-3">
                {editing ? (
                    <div className="flex items-center gap-1">
                        <Input
                            type="number"
                            min={0}
                            value={qty}
                            onChange={(e) => setQty(parseInt(e.target.value) || 0)}
                            className="h-8 w-20 text-sm"
                        />
                        <Button variant="ghost" size="icon" onClick={handleSave} disabled={saving} className="h-8 w-8">
                            <Check className="h-3 w-3 text-emerald-600" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => { setEditing(false); setQty(item.quantity_available) }} className="h-8 w-8">
                            <X className="h-3 w-3 text-red-500" />
                        </Button>
                    </div>
                ) : (
                    <div className="flex items-center gap-2">
                        <span className={cn('inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold', getStockBg(item.quantity_available), getStockColor(item.quantity_available))}>
                            {item.quantity_available}
                        </span>
                        <Button variant="ghost" size="icon" onClick={() => setEditing(true)} className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Pencil className="h-3 w-3" />
                        </Button>
                    </div>
                )}
            </td>
            <td className="px-4 py-3">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleToggleVisibility}
                    disabled={saving}
                    className="h-8 w-8"
                >
                    {item.is_visible ? (
                        <Eye className="h-4 w-4 text-emerald-600" />
                    ) : (
                        <EyeOff className="h-4 w-4 text-neutral-400" />
                    )}
                </Button>
            </td>
        </tr>
    )
}
