
'use client'

import { useConfiguratorStore } from "@/stores/configuratorStore"
import { useCartStore } from "@/stores/cartStore"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PriceSummary } from "@/components/onboarding/PriceSummary"

export default function SummaryPage() {
    const { configuration, quantity, productId, reset } = useConfiguratorStore()
    const { addItem } = useCartStore()
    const router = useRouter()

    const handleAddToCart = () => {
        if (!productId) return

        addItem({
            id: crypto.randomUUID(),
            productId,
            productName: "Producto Personalizado", // Should fetch name
            productImage: configuration.imageUrl || "",
            quantity,
            unitPrice: 0, // Should use calculated price
            designDetails: configuration,
        })

        reset()
        router.push('/onboarding') // Back to catalog or cart
    }

    const handleBuyNow = () => {
        // Ideally add to cart then redirect to checkout
        handleAddToCart()
        router.push('/onboarding/checkout')
    }

    if (!productId) {
        return <div className="p-8">No hay configuración activa. <Button onClick={() => router.push('/onboarding')}>Volver al catálogo</Button></div>
    }

    return (
        <div className="container mx-auto py-8 max-w-4xl">
            <h1 className="mb-8 text-3xl font-bold">Resumen de tu Diseño</h1>

            <div className="grid gap-8 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Detalles</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <span className="font-semibold">Estilo:</span> {configuration.style}
                        </div>
                        <div>
                            <span className="font-semibold">Material:</span> {configuration.material}
                        </div>
                        <div>
                            <span className="font-semibold">Color:</span> {configuration.color}
                        </div>
                        <div>
                            <span className="font-semibold">Talla:</span> {configuration.size}
                        </div>
                        <div>
                            <span className="font-semibold">Técnica:</span> {configuration.designType}
                        </div>
                        {configuration.imageUrl && (
                            <div>
                                <p className="font-semibold mb-2">Diseño:</p>
                                <img src={configuration.imageUrl} alt="Design" className="max-h-40 rounded border" />
                            </div>
                        )}
                    </CardContent>
                </Card>

                <div className="space-y-6">
                    <PriceSummary />
                    <div className="flex flex-col gap-4">
                        <Button onClick={handleAddToCart} variant="outline" size="lg">Adding to Cart & Continue Shopping</Button>
                        <Button onClick={handleBuyNow} size="lg">Buy Now</Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
