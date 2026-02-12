'use client'

import { use } from 'react'
import { useRouter } from 'next/navigation'
import { useConfiguratorStore } from '@/stores/configuratorStore'
import { useCartStore } from '@/stores/cartStore'
import { PriceSummary } from '@/components/onboarding/PriceSummary'
import { CartButton } from '@/components/onboarding/CartButton'
import { EmptyState } from '@/components/shared/EmptyState'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import type { DesignDetails } from '@/types'
import { toast } from 'sonner'

export default function ResumenPage({ params }: { params: Promise<{ productId: string }> }) {
    use(params) // consume the promise
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

    const designDetails: DesignDetails = {
        style: store.style || undefined,
        material: store.material || undefined,
        design_type: store.designType || undefined,
        color: store.color || undefined,
        size: store.size || undefined,
        placement: store.placement || undefined,
        initial_letter: store.initialLetter || undefined,
        image_url: store.imagePreview || undefined,
    }

    const unitPrice = store.unitPrice ?? product.base_price

    const handleAddToCart = () => {
        addItem(product, store.quantity, unitPrice, designDetails)
        toast.success('Agregado al carrito')
        store.reset()
        router.push('/onboarding')
    }

    const handleBuyNow = () => {
        addItem(product, store.quantity, unitPrice, designDetails)
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
                    designDetails={designDetails}
                />

                <CartButton
                    onAddToCart={handleAddToCart}
                    onBuyNow={handleBuyNow}
                />
            </main>
        </div>
    )
}
