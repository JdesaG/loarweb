'use client'

import type { InventoryItem } from '@/types'
import { Label } from '@/components/ui/label'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { getStockColor } from '@/lib/utils'

interface ColorSizeSelectorProps {
    inventory: InventoryItem[]
    availableColors: string[]
    availableSizes: string[]
    selectedColor: string
    selectedSize: string
    onColorChange: (color: string) => void
    onSizeChange: (size: string) => void
}

export function ColorSizeSelector({
    inventory,
    availableColors,
    availableSizes,
    selectedColor,
    selectedSize,
    onColorChange,
    onSizeChange,
}: ColorSizeSelectorProps) {
    // Get stock count for a specific color+size combination
    const getStock = (color: string, size: string): number => {
        const item = inventory.find(
            (i) => i.color === color && i.size === size
        )
        return item?.quantity_available ?? 0
    }

    // Get total stock for a color across all sizes
    const getColorStock = (color: string): number => {
        return inventory
            .filter((i) => i.color === color)
            .reduce((sum, i) => sum + i.quantity_available, 0)
    }

    // Filter sizes that have stock for the selected color
    const sizesForColor = selectedColor
        ? availableSizes.filter((size) => {
            const item = inventory.find((i) => i.color === selectedColor && i.size === size)
            return item ? item.quantity_available > 0 : true // Show size even without inventory record
        })
        : availableSizes

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
                            const stock = getColorStock(color)
                            return (
                                <SelectItem key={color} value={color}>
                                    <span className="flex items-center gap-2">
                                        {color}
                                        <span className={`text-[10px] ${getStockColor(stock)}`}>
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
                <Select
                    value={selectedSize}
                    onValueChange={onSizeChange}
                    disabled={!selectedColor && availableColors.length > 0}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Talla" />
                    </SelectTrigger>
                    <SelectContent>
                        {sizesForColor.map((size) => {
                            const stock = selectedColor ? getStock(selectedColor, size) : 0
                            return (
                                <SelectItem key={size} value={size}>
                                    <span className="flex items-center gap-2">
                                        {size}
                                        {selectedColor && (
                                            <span className={`text-[10px] ${getStockColor(stock)}`}>
                                                ({stock})
                                            </span>
                                        )}
                                    </span>
                                </SelectItem>
                            )
                        })}
                    </SelectContent>
                </Select>
            </div>
        </div>
    )
}
