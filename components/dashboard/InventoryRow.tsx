
import { InventoryItem } from "@/types"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { ProductEditor } from "./ProductEditor"
import { Dialog, DialogTrigger } from "@/components/ui/dialog" // Need Dialog

export function InventoryRow({
    item,
    onUpdateQuantity
}: {
    item: InventoryItem,
    onUpdateQuantity: (id: string, qty: number) => void
}) {
    const [qty, setQty] = useState(item.quantity_available.toString())

    const handleBlur = () => {
        const val = parseInt(qty)
        if (!isNaN(val) && val !== item.quantity_available) {
            onUpdateQuantity(item.id, val)
        }
    }

    return (
        <tr className="border-b transition-colors hover:bg-muted/50">
            <td className="p-4 align-middle font-medium">{item.products?.name}</td>
            <td className="p-4 align-middle">{item.style || '-'}</td>
            <td className="p-4 align-middle">{item.color || '-'}</td>
            <td className="p-4 align-middle">{item.size || '-'}</td>
            <td className="p-4 align-middle">
                <Input
                    type="number"
                    className="w-24 h-8"
                    value={qty}
                    onChange={(e) => setQty(e.target.value)}
                    onBlur={handleBlur}
                />
            </td>
            <td className="p-4 align-middle">
                {/* Product Editor Trigger would go here */}
                <Dialog>
                    <DialogTrigger asChild>
                        <Button variant="ghost" size="sm">Edit Settings</Button>
                    </DialogTrigger>
                    <ProductEditor item={item} />
                </Dialog>
            </td>
        </tr>
    )
}
