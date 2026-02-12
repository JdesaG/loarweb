'use client'

import { useState } from 'react'
import type { Product } from '@/types'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'

interface ProductEditorProps {
    product: Product | null
    open: boolean
    onOpenChange: (open: boolean) => void
    onSave: (id: string, data: Partial<Product>) => Promise<void>
}

export function ProductEditor({ product, open, onOpenChange, onSave }: ProductEditorProps) {
    const [name, setName] = useState(product?.name ?? '')
    const [description, setDescription] = useState(product?.description ?? '')
    const [basePrice, setBasePrice] = useState(product?.base_price ?? 0)
    const [saving, setSaving] = useState(false)

    // Update fields when product changes
    const handleOpen = (val: boolean) => {
        if (val && product) {
            setName(product.name)
            setDescription(product.description ?? '')
            setBasePrice(product.base_price)
        }
        onOpenChange(val)
    }

    const handleSave = async () => {
        if (!product) return
        setSaving(true)
        try {
            await onSave(product.id, { name, description, base_price: basePrice })
            toast.success('Producto actualizado')
            onOpenChange(false)
        } catch {
            toast.error('Error al guardar')
        }
        setSaving(false)
    }

    return (
        <Dialog open={open} onOpenChange={handleOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Editar producto</DialogTitle>
                    <DialogDescription>Modifica los datos del producto.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-2">
                    <div className="space-y-2">
                        <Label>Nombre</Label>
                        <Input value={name} onChange={(e) => setName(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label>Descripción</Label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={3}
                            className="flex w-full rounded-lg border border-neutral-300 bg-white px-4 py-3 text-sm shadow-sm transition-colors focus:border-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-200 resize-none"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Precio base (USD)</Label>
                        <Input
                            type="number"
                            step="0.01"
                            min={0}
                            value={basePrice}
                            onChange={(e) => setBasePrice(parseFloat(e.target.value) || 0)}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Cancelar
                    </Button>
                    <Button onClick={handleSave} disabled={saving}>
                        {saving ? 'Guardando...' : 'Guardar'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
