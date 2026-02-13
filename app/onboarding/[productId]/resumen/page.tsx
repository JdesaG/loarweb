'use client'

import { use } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useConfiguratorStore } from '@/stores/configuratorStore'
import { useCartStore } from '@/stores/cartStore'
import { PriceSummary } from '@/components/onboarding/PriceSummary'
import { CartButton } from '@/components/onboarding/CartButton'
import { EmptyState } from '@/components/shared/EmptyState'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'

export default function ResumenPage({ params }: { params: Promise<{ productId: string }> }) {
    use(params)
    const router = useRouter()
    const searchParams = useSearchParams()
    const executionId = searchParams.get('executionId')
    const store = useConfiguratorStore()
    const addItem = useCartStore((s) => s.addItem)

    const product = store.product

    if (!product) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center">
                <EmptyState title="No hay producto seleccionado" description="Vuelve al catálogo para elegir un producto." />
                <Link href={`/onboarding${executionId ? `?executionId=${executionId}` : ''}`} className="mt-4">
                    <Button>Ir al catálogo</Button>
                </Link>
            </div>
        )
    }

    const handleAddToCart = () => {
        addItem(product, store.quantity, store.unitPrice ?? 0, {
            styleName: store.styleName || undefined,
            selectedColor: store.color || undefined,
            selectedSize: store.size || undefined,
            material: store.material || undefined,
            designType: store.designType || undefined,
            designMainUrl: store.imagePreview || undefined,
            designSecondaryUrl: store.imagePreview2 || undefined,
            placementInstructions: store.placement || undefined,
            addInitial: store.hasInitial || undefined,
            initialLetter: store.initialLetter || undefined,
        })
        toast.success('Agregado al carrito')
        store.reset()
        router.push(`/onboarding${executionId ? `?executionId=${executionId}` : ''}`)
    }

    const handleBuyNow = () => {
        addItem(product, store.quantity, store.unitPrice ?? 0, {
            styleName: store.styleName || undefined,
            selectedColor: store.color || undefined,
            selectedSize: store.size || undefined,
            material: store.material || undefined,
            designType: store.designType || undefined,
            designMainUrl: store.imagePreview || undefined,
            designSecondaryUrl: store.imagePreview2 || undefined,
            placementInstructions: store.placement || undefined,
            addInitial: store.hasInitial || undefined,
            initialLetter: store.initialLetter || undefined,
        })
        store.reset()
        router.push(`/onboarding/checkout${executionId ? `?executionId=${executionId}` : ''}`)
    }

    return (
        <div className="min-h-screen bg-white">
            <header className="sticky top-0 z-40 border-b border-neutral-100 bg-white/80 backdrop-blur-md">
                <div className="mx-auto flex max-w-lg items-center gap-3 px-4 py-4">
                    <Link href={`/onboarding/${product.id}${executionId ? `?executionId=${executionId}` : ''}`}>
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
                    styleName={store.styleName || undefined}
                    material={store.material || undefined}
                    designType={store.designType || undefined}
                    selectedColor={store.color || undefined}
                    selectedSize={store.size || undefined}
                    addInitial={store.hasInitial}
                />

                <CartButton
                    onAddToCart={handleAddToCart}
                    onBuyNow={handleBuyNow}
                />
            </main>
        </div>
    )
}
