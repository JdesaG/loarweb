'use client'

import { useEffect } from 'react'
import { useConfiguratorStore } from '@/stores/configuratorStore'
import { useInventory } from '@/hooks/useInventory'
import { usePriceCalculation } from '@/hooks/usePriceCalculation'
import { StyleSelector } from './StyleSelector'
import { MaterialSelector } from './MaterialSelector'
import { DesignTypeSelector } from './DesignTypeSelector'
import { ColorSizeSelector } from './ColorSizeSelector'
import { ImageUploader } from './ImageUploader'
import { PlacementInstructions } from './PlacementInstructions'
import { InitialAddon } from './InitialAddon'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import type { Product } from '@/types'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface ConfiguratorWizardProps {
    product: Product
}

export function ConfiguratorWizard({ product }: ConfiguratorWizardProps) {
    const store = useConfiguratorStore()
    const { inventory, loading: invLoading } = useInventory(product.id)
    const { calculatePrice, loading: priceLoading } = usePriceCalculation()

    // Options come from the PRODUCT, not inventory
    const styles = product.available_styles ?? []
    const materials = product.available_materials ?? []
    // For design types, we can derive from products_pricing or just show a free field
    // For now we use what the product exposes

    // Initialize store with product
    useEffect(() => {
        store.setProduct(product)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [product.id])

    // Recalculate price when relevant fields change
    useEffect(() => {
        const timer = setTimeout(async () => {
            const result = await calculatePrice({
                productId: product.id,
                styleName: store.styleName || undefined,
                material: store.material || undefined,
                designType: store.designType || undefined,
                quantity: store.quantity,
            })
            if (result) {
                store.setPrice(result.unitPrice, result.pricingId)
            }
        }, 300)
        return () => clearTimeout(timer)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [store.styleName, store.material, store.designType, store.quantity, product.id])

    if (invLoading) {
        return <LoadingSpinner className="py-12" text="Cargando opciones..." />
    }

    // Determine which steps to show based on product config
    const hasStep1 = (product.has_styles && styles.length > 0) || materials.length > 0

    const canProceed = () => {
        switch (store.step) {
            case 1:
                return true // Style/material/design optional
            case 2:
                return store.color !== '' && store.size !== ''
            case 3:
                return true // Image/placement/initial optional
            default:
                return true
        }
    }

    return (
        <div className="space-y-6">
            {/* Step indicator */}
            <div className="flex items-center gap-2">
                {[1, 2, 3].map((s) => (
                    <div
                        key={s}
                        className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold transition-all duration-300 ${s === store.step
                            ? 'bg-neutral-900 text-white scale-110'
                            : s < store.step
                                ? 'bg-emerald-500 text-white'
                                : 'bg-neutral-200 text-neutral-500'
                            }`}
                    >
                        {s < store.step ? '✓' : s}
                    </div>
                ))}
                <div className="ml-3 text-sm text-neutral-500">
                    Paso {store.step} de 3
                </div>
            </div>

            {/* Step 1: Style / Material / Design Type */}
            {store.step === 1 && (
                <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                    <h3 className="text-lg font-semibold text-neutral-900">Personalización</h3>

                    {product.has_styles && styles.length > 0 && (
                        <StyleSelector
                            styles={styles}
                            value={store.styleName}
                            onChange={(v) => store.setField('styleName', v)}
                        />
                    )}

                    {materials.length > 0 && (
                        <MaterialSelector
                            materials={materials}
                            value={store.material}
                            onChange={(v) => store.setField('material', v)}
                        />
                    )}

                    <DesignTypeSelector
                        designTypes={['Estampado', 'Bordado', 'Sublimación', 'Vinilo']}
                        value={store.designType}
                        onChange={(v) => store.setField('designType', v)}
                    />

                    {!hasStep1 && (
                        <p className="text-sm text-neutral-500">
                            Este producto no tiene opciones de estilo o material. Presiona Siguiente.
                        </p>
                    )}
                </div>
            )}

            {/* Step 2: Color / Size / Quantity */}
            {store.step === 2 && (
                <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                    <h3 className="text-lg font-semibold text-neutral-900">Color, talla y cantidad</h3>
                    <ColorSizeSelector
                        inventory={inventory}
                        availableColors={product.available_colors ?? []}
                        availableSizes={product.available_sizes ?? []}
                        selectedColor={store.color}
                        selectedSize={store.size}
                        onColorChange={(v) => store.setField('color', v)}
                        onSizeChange={(v) => store.setField('size', v)}
                    />
                    <div className="space-y-2">
                        <Label>Cantidad</Label>
                        <Input
                            type="number"
                            min={1}
                            max={99}
                            value={store.quantity}
                            onChange={(e) => store.setField('quantity', Math.max(1, parseInt(e.target.value) || 1))}
                            className="max-w-24"
                        />
                    </div>
                </div>
            )}

            {/* Step 3: Image / Placement / Initial */}
            {store.step === 3 && (
                <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                    <h3 className="text-lg font-semibold text-neutral-900">Diseño personalizado</h3>
                    <ImageUploader
                        imagePreview={store.imagePreview}
                        onFileChange={(file, preview) => {
                            store.setField('imageFile', file)
                            store.setField('imagePreview', preview)
                        }}
                    />
                    <PlacementInstructions
                        value={store.placement}
                        onChange={(v) => store.setField('placement', v)}
                    />
                    <InitialAddon
                        hasInitial={store.hasInitial}
                        initialLetter={store.initialLetter}
                        onToggle={(v) => store.setField('hasInitial', v)}
                        onLetterChange={(v) => store.setField('initialLetter', v)}
                    />
                </div>
            )}

            {/* Price loading indicator */}
            {priceLoading && (
                <p className="text-xs text-neutral-400 animate-pulse">Calculando precio...</p>
            )}

            {/* Navigation buttons */}
            <div className="flex justify-between pt-4">
                <Button
                    variant="ghost"
                    onClick={() => store.setStep(store.step - 1)}
                    disabled={store.step <= 1}
                >
                    <ChevronLeft className="h-4 w-4" /> Atrás
                </Button>
                <Button
                    onClick={() => store.setStep(store.step + 1)}
                    disabled={!canProceed() || store.step >= 3}
                >
                    Siguiente <ChevronRight className="h-4 w-4" />
                </Button>
            </div>
        </div>
    )
}
