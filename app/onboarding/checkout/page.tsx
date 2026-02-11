
'use client'

import { useCart } from "@/hooks/useCart"
import { CustomerForm } from "@/components/onboarding/CustomerForm"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function CheckoutPage() {
    const { items, total, clearCart } = useCart()
    const router = useRouter()
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleOrderSubmit = async (customerData: any) => {
        setIsSubmitting(true)
        try {
            const orderData = {
                customer: customerData,
                items: items.map(item => ({
                    product_id: item.productId,
                    quantity: item.quantity,
                    unit_price: item.unitPrice,
                    design_details: item.designDetails
                })),
                totalAmount: total()
            }

            const res = await fetch('/api/create-order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(orderData)
            })

            if (!res.ok) throw new Error('Failed to create order')

            const { orderCode } = await res.json()

            clearCart()
            // Redirect to success page (not implemented yet, showing alert)
            alert(`Order Created! Code: ${orderCode}`)
            router.push('/onboarding')

        } catch (error) {
            console.error(error)
            alert('Error creating order')
        } finally {
            setIsSubmitting(false)
        }
    }

    if (items.length === 0) {
        return <div className="p-8 text-center">Your cart is empty.</div>
    }

    return (
        <div className="container mx-auto py-8">
            <h1 className="mb-8 text-3xl font-bold">Finalizar Compra</h1>

            <div className="grid gap-8 md:grid-cols-2">
                <Card>
                    <CardHeader><CardTitle>Tu Pedido</CardTitle></CardHeader>
                    <CardContent>
                        {items.map((item, idx) => (
                            <div key={idx} className="mb-4 border-b pb-4 last:border-0">
                                <p className="font-semibold">{item.productName}</p>
                                <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                                <p className="text-sm">Price: ${item.unitPrice}</p>
                            </div>
                        ))}
                        <div className="mt-4 text-xl font-bold">Total: ${total().toFixed(2)}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader><CardTitle>Datos de Envío</CardTitle></CardHeader>
                    <CardContent>
                        <CustomerForm onSubmit={handleOrderSubmit} isSubmitting={isSubmitting} />
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
