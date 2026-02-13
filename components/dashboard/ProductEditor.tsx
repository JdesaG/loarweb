'use client'

import { useState, useEffect } from 'react'
import type { Product } from '@/types'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Loader2 } from 'lucide-react'

interface ProductEditorProps {
    product: Product | null
    open: boolean
    onOpenChange: (open: boolean) => void
    onSave: (id: string, data: Partial<Product>) => Promise<void>
}

export function ProductEditor({ product, open, onOpenChange, onSave }: ProductEditorProps) {
    const [name, setName] = useState('')
    const [category, setCategory] = useState('')
    const [sku, setSku] = useState('')
    const [isActive, setIsActive] = useState(true)
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        if (product) {
            setName(product.name)
            setCategory(product.category ?? '')
            setSku(product.sku ?? '')
            setIsActive(product.is_active)
        }
    }, [product])

    const handleSave = async () => {
        if (!product) return
        setSaving(true)
        await onSave(product.id, {
            name,
            category: category || undefined,
            sku: sku || undefined,
            is_active: isActive,
        })
        setSaving(false)
        onOpenChange(false)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Editar producto</DialogTitle>
                    <DialogDescription>Modifique los detalles principales del producto.</DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label>Nombre</Label>
                        <Input value={name} onChange={(e) => setName(e.target.value)} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Categoría</Label>
                            <Input value={category} onChange={(e) => setCategory(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label>SKU</Label>
                            <Input value={sku} onChange={(e) => setSku(e.target.value)} />
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <Label>Activo en catálogo</Label>
                        <Switch checked={isActive} onCheckedChange={setIsActive} />
                    </div>

                    <Button onClick={handleSave} disabled={saving || !name.trim()} className="w-full">
                        {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Guardar'}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
