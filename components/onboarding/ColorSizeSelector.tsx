
import { useConfiguratorStore } from "@/stores/configuratorStore"
import { useInventory } from "@/hooks/useInventory"
import { Label } from "@/components/ui/label"
import { useEffect, useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// IMPORTANT: Need to scaffold Select component or just use native select for now to be safe.
// Using native select for speed and reliability without full shadcn install.

export function ColorSizeSelector() {
    const { productId, configuration, updateConfiguration } = useConfiguratorStore()
    const { inventory, loading } = useInventory(productId)

    const [availableColors, setAvailableColors] = useState<string[]>([])
    const [availableSizes, setAvailableSizes] = useState<string[]>([])

    useEffect(() => {
        if (inventory.length > 0) {
            // Get unique colors
            const colors = Array.from(new Set(inventory.map(i => i.color).filter(Boolean) as string[]))
            setAvailableColors(colors)
        }
    }, [inventory])

    useEffect(() => {
        if (configuration.color && inventory.length > 0) {
            // Filter sizes based on selected color
            const sizes = Array.from(new Set(
                inventory
                    .filter(i => i.color === configuration.color)
                    .map(i => i.size)
                    .filter(Boolean) as string[]
            ))
            setAvailableSizes(sizes)
        }
    }, [configuration.color, inventory])

    if (loading) return <div>Loading options...</div>

    return (
        <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
                <Label>Color</Label>
                <select
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
                    value={configuration.color || ''}
                    onChange={(e) => updateConfiguration({ color: e.target.value, size: undefined })}
                >
                    <option value="">Select Color</option>
                    {availableColors.map(color => (
                        <option key={color} value={color}>{color}</option>
                    ))}
                </select>
            </div>

            <div className="space-y-2">
                <Label>Talla</Label>
                <select
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
                    value={configuration.size || ''}
                    onChange={(e) => updateConfiguration({ size: e.target.value })}
                    disabled={!configuration.color}
                >
                    <option value="">Select Size</option>
                    {availableSizes.map(size => (
                        <option key={size} value={size}>{size}</option>
                    ))}
                </select>
            </div>
        </div>
    )
}
