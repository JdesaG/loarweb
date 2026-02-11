
import { Button } from "@/components/ui/button"
import {
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { InventoryItem } from "@/types"
import { useState } from "react"
import { Checkbox } from "@/components/ui/checkbox"

export function ProductEditor({ item }: { item: InventoryItem }) {
    const [loading, setLoading] = useState(false)
    const [isVisible, setIsVisible] = useState(item.is_visible)

    const handleSave = async () => {
        setLoading(true)
        try {
            await fetch(`/api/inventory/${item.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isVisible })
            })
            // In real app, trigger refresh or optimistically update context/store
            window.location.reload() // Simple refresh
        } catch (e) {
            console.error(e)
        } finally {
            setLoading(false)
        }
    }

    return (
        <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
                <DialogTitle>Edit Inventory Item</DialogTitle>
                <DialogDescription>
                    Make changes to the inventory settings here. Click save when you're done.
                </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="product" className="text-right">Product</Label>
                    <Input id="product" value={item.products?.name} disabled className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right">Visible</Label>
                    <div className="flex items-center space-x-2 col-span-3">
                        <Checkbox
                            id="visible"
                            checked={isVisible}
                            onChange={(e) => setIsVisible(e.target.checked)}
                        />
                        <label htmlFor="visible" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            Show in Configurator
                        </label>
                    </div>
                </div>
            </div>
            <DialogFooter>
                <Button type="submit" onClick={handleSave} disabled={loading}>
                    {loading ? 'Saving...' : 'Save changes'}
                </Button>
            </DialogFooter>
        </DialogContent>
    )
}
