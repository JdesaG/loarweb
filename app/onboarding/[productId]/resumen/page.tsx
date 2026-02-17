'use client'

import { Suspense, use, useState } from 'react'
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
import { uploadDesignImage } from '@/lib/uploadDesign'

const INITIAL_PRICE = 0.50

export default function ResumenPage({ params }: { params: Promise<{ productId: string }> }) {
    return (
        <Suspense>
            <ResumenContent params={params} />
        </Suspense>
    )
}

function ResumenContent({ params }: { params: Promise<{ productId: string }> }) {
    use(params)
    const router = useRouter()
    const searchParams = useSearchParams()
    const executionId = searchParams.get('executionId')
    const store = useConfiguratorStore()
    const addItem = useCartStore((s) => s.addItem)
    const [uploading, setUploading] = useState(false)

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

    /** Upload images to Storage and return URLs */
    async function uploadImages() {
        const [mainUrl, secondaryUrl] = await Promise.all([
            store.imageFile
                ? uploadDesignImage(store.imageFile, store.imagePreview)
                : Promise.resolve(store.imagePreview || undefined),
            store.imageFile2
                ? uploadDesignImage(store.imageFile2, store.imagePreview2)
                : Promise.resolve(store.imagePreview2 || undefined),
        ])
        return { mainUrl: mainUrl || undefined, secondaryUrl: secondaryUrl || undefined }
    }

    const handleAddToCart = async () => {
        setUploading(true)
        try {
            const { mainUrl, secondaryUrl } = await uploadImages()
            addItem(product, store.quantity, store.unitPrice ?? 0, {
                styleName: store.styleName || undefined,
                selectedColor: store.color || undefined,
                selectedSize: store.size || undefined,
                material: store.material || undefined,
                designType: store.designType || undefined,
                designMainUrl: mainUrl,
                designSecondaryUrl: secondaryUrl,
                placementInstructions: store.placement || undefined,
                addInitial: store.hasInitial || undefined,
                initialLetter: store.initialLetter || undefined,
                initialPrice: store.hasInitial ? INITIAL_PRICE : undefined,
            })
            toast.success('Agregado al carrito')
            store.reset()
            router.push(`/onboarding${executionId ? `?executionId=${executionId}` : ''}`)
        } catch (err) {
            console.error('[handleAddToCart]', err)
            toast.error('Error al subir las imágenes. Intenta de nuevo.')
        } finally {
            setUploading(false)
        }
    }

    const handleBuyNow = async () => {
        setUploading(true)
        try {
            const { mainUrl, secondaryUrl } = await uploadImages()
            addItem(product, store.quantity, store.unitPrice ?? 0, {
                styleName: store.styleName || undefined,
                selectedColor: store.color || undefined,
                selectedSize: store.size || undefined,
                material: store.material || undefined,
                designType: store.designType || undefined,
                designMainUrl: mainUrl,
                designSecondaryUrl: secondaryUrl,
                placementInstructions: store.placement || undefined,
                addInitial: store.hasInitial || undefined,
                initialLetter: store.initialLetter || undefined,
                initialPrice: store.hasInitial ? INITIAL_PRICE : undefined,
            })
            store.reset()
            router.push(`/onboarding/checkout${executionId ? `?executionId=${executionId}` : ''}`)
        } catch (err) {
            console.error('[handleBuyNow]', err)
            toast.error('Error al subir las imágenes. Intenta de nuevo.')
        } finally {
            setUploading(false)
        }
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
                    initialPrice={store.hasInitial ? INITIAL_PRICE : undefined}
                />

                <CartButton
                    onAddToCart={handleAddToCart}
                    onBuyNow={handleBuyNow}
                    disabled={uploading}
                />
            </main>
        </div>
    )
}
