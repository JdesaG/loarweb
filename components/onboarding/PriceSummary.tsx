
import { useConfiguratorStore } from "@/stores/configuratorStore"
import { usePriceCalculation } from "@/hooks/usePriceCalculation"
import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"

export function PriceSummary({ basePrice = 0 }: { basePrice?: number }) {
    const { configuration, productId, quantity } = useConfiguratorStore()
    const { calculate, loading } = usePriceCalculation()
    const [price, setPrice] = useState(basePrice)

    useEffect(() => {
        if (productId) {
            calculate({
                productId,
                styleName: configuration.style,
                material: configuration.material,
                designType: configuration.designType,
                quantity
            }).then((unitPrice) => {
                if (unitPrice !== null) setPrice(unitPrice)
            })
        }
    }, [configuration, productId, quantity])

    const total = price * quantity

    return (
        <Card>
            <CardContent className="pt-6">
                <h3 className="text-lg font-semibold">Resumen de Precio</h3>
                <div className="mt-4 space-y-2">
                    <div className="flex justify-between">
                        <span>Precio Unitario:</span>
                        <span>{loading ? '...' : `$${price.toFixed(2)}`}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Cantidad:</span>
                        <span>{quantity}</span>
                    </div>
                    <div className="border-t pt-2 flex justify-between font-bold text-lg">
                        <span>Total Estimates:</span>
                        <span>{loading ? '...' : `$${total.toFixed(2)}`}</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
