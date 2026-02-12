'use client'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { cn, getStockColor } from '@/lib/utils'
import type { InventoryItem } from '@/types'

interface ColorSizeSelectorProps {
    inventory: InventoryItem[]
    selectedColor: string
    selectedSize: string
    onColorChange: (value: string) => void
    onSizeChange: (value: string) => void
    selectedStyle?: string
    selectedMaterial?: string
    selectedDesignType?: string
}

export function ColorSizeSelector({
    inventory,
    selectedColor,
    selectedSize,
    onColorChange,
    onSizeChange,
    selectedStyle,
    selectedMaterial,
    selectedDesignType,
}: ColorSizeSelectorProps) {
    // Filter inventory based on current selections
    const filtered = inventory.filter((item) => {
        if (selectedStyle && item.style && item.style !== selectedStyle) return false
        if (selectedMaterial && item.material && item.material !== selectedMaterial) return false
        if (selectedDesignType && item.design_type && item.design_type !== selectedDesignType) return false
        return true
    })

    const availableColors = [...new Set(filtered.map((i) => i.color).filter(Boolean))] as string[]

    // Further filter by selected color for sizes
    const filteredByColor = selectedColor
        ? filtered.filter((i) => i.color === selectedColor)
        : filtered
    const availableSizes = [...new Set(filteredByColor.map((i) => i.size).filter(Boolean))] as string[]

    // Get stock for selected combination
    const getStock = (color: string) => {
        const items = filtered.filter((i) => i.color === color)
        return items.reduce((sum, i) => sum + i.quantity_available, 0)
    }

    return (
        <div className="grid grid-cols-2 gap-4">
            {/* Color */}
            <div className="space-y-2">
                <Label>Color</Label>
                <Select value={selectedColor} onValueChange={onColorChange}>
                    <SelectTrigger>
                        <SelectValue placeholder="Color" />
                    </SelectTrigger>
                    <SelectContent>
                        {availableColors.map((color) => {
                            const stock = getStock(color)
                            return (
                                <SelectItem key={color} value={color}>
                                    <span className="flex items-center gap-2">
                                        {color}
                                        <span className={cn('text-xs', getStockColor(stock))}>
                                            ({stock})
                                        </span>
                                    </span>
                                </SelectItem>
                            )
                        })}
                    </SelectContent>
                </Select>
            </div>

            {/* Size */}
            <div className="space-y-2">
                <Label>Talla</Label>
                <Select value={selectedSize} onValueChange={onSizeChange} disabled={!selectedColor}>
                    <SelectTrigger>
                        <SelectValue placeholder="Talla" />
                    </SelectTrigger>
                    <SelectContent>
                        {availableSizes.map((size) => (
                            <SelectItem key={size} value={size}>
                                {size}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        </div>
    )
}
