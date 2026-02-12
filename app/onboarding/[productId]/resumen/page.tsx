'use client'

import { use } from 'react'
import { useRouter } from 'next/navigation'
import { useConfiguratorStore } from '@/stores/configuratorStore'
import { useCartStore } from '@/stores/cartStore'
import { PriceSummary } from '@/components/onboarding/PriceSummary'
import { EmptyState } from '@/components/shared/EmptyState'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowLeft, ShoppingCart, CreditCard } from 'lucide-react'
import { toast } from 'sonner'

export default function ResumenPage({ params }: { params: Promise<{ productId: string }> }) {
    use(params)
    const router = useRouter()
    const store = useConfiguratorStore()
    const addItem = useCartStore((s) => s.addItem)

    const product = store.product

    if (!product) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center">
                <EmptyState title="No hay producto seleccionado" description="Vuelve al catálogo para elegir un producto." />
                <Link href="/onboarding" className="mt-4">
                    <Button>Ir al catálogo</Button>
                </Link>
            </div>
        )
    }

    const addToCart = () => {
        addItem(product, store.quantity, store.unitPrice ?? 0, {
            selectedColor: store.color || undefined,
            selectedSize: store.size || undefined,
            designType: store.designType || undefined,
            designMainUrl: store.designMainUrl || undefined,
            designSecondaryUrl: store.designSecondaryUrl || undefined,
            placementInstructions: store.placement || undefined,
            addInitial: store.hasInitial || undefined,
            initialLetter: store.initialLetter || undefined,
        })
    }

    const handleBuyAnother = () => {
        addToCart()
        toast.success('Agregado al carrito')
        store.reset()
        router.push('/onboarding')
    }

    const handleFinishPurchase = () => {
        addToCart()
        store.reset()
        router.push('/onboarding/checkout')
    }

    return (
        <div className="min-h-screen bg-white">
            <header className="sticky top-0 z-40 border-b border-neutral-100 bg-white/80 backdrop-blur-md">
                <div className="mx-auto flex max-w-lg items-center gap-3 px-4 py-4">
                    <Link href={`/onboarding/${product.id}`}>
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                    </Link>
                    <h1 className="text-lg font-bold text-neutral-900">Resumen</h1>
                </div>
            </header>

            <main className="mx-auto max-w-lg px-4 py-8 space-y-6">
                <PriceSummary
                    product={product}
                    unitPrice={store.unitPrice}
                    quantity={store.quantity}
                    designType={store.designType || undefined}
                    selectedColor={store.color || undefined}
                    selectedSize={store.size || undefined}
                    addInitial={store.hasInitial}
                />

                <div className="flex flex-col gap-3 sm:flex-row">
                    <Button
                        variant="outline"
                        size="lg"
                        onClick={handleBuyAnother}
                        className="flex-1"
                    >
                        <ShoppingCart className="h-4 w-4" />
                        Comprar otra prenda
                    </Button>
                    <Button
                        variant="brand"
                        size="lg"
                        onClick={handleFinishPurchase}
                        className="flex-1"
                    >
                        <CreditCard className="h-4 w-4" />
                        Terminar compra
                    </Button>
                </div>
            </main>
        </div>
    )
}
