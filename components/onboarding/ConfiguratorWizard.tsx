'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSupabase } from '@/hooks/supabase'
import { useConfiguratorStore } from '@/stores/configuratorStore'
import { useInventory } from '@/hooks/useInventory'
import { usePriceCalculation } from '@/hooks/usePriceCalculation'
import { DesignTypeSelector } from './DesignTypeSelector'
import { ColorSizeSelector } from './ColorSizeSelector'
import { ImageUploader } from './ImageUploader'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import type { Product, ProductPricing } from '@/types'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

interface ConfiguratorWizardProps {
    product: Product
}

const TOTAL_STEPS = 2

export function ConfiguratorWizard({ product }: ConfiguratorWizardProps) {
    const router = useRouter()
    const supabase = useSupabase()
    const store = useConfiguratorStore()
    const { inventory, loading: invLoading } = useInventory(product.id)
    const { calculatePrice, loading: priceLoading } = usePriceCalculation()
    const [pricingRules, setPricingRules] = useState<ProductPricing[]>([])

    // ── Set product on mount ─────────────────────────────────────────────────
    useEffect(() => {
        store.setProduct(product)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [product.id])

    // ── Fetch pricing rules ──────────────────────────────────────────────────
    useEffect(() => {
        async function fetchData() {
            const { data: pricing } = await supabase
                .from('product_pricing')
                .select('*')
                .eq('product_id', product.id)
            setPricingRules((pricing as unknown as ProductPricing[]) ?? [])
        }
        fetchData()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [product.id])

    // ── Recalculate price when relevant fields change ────────────────────────
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

    // ── Derived state ────────────────────────────────────────────────────────
    const designSlots = store.designType?.toLowerCase().includes('dual') ? 2 : 0
    const isPlain = store.designType?.toLowerCase().includes('llan') // "Llano" = 0 designs
    const needsDesign = !isPlain && store.designType !== ''
    const availableDesignTypes = Array.from(
        new Set(pricingRules.map((p) => p.design_type).filter(Boolean))
    ) as string[]

    const canProceed = () => {
        switch (store.step) {
            case 1:
                // Require design type, color, size
                return store.designType !== '' && store.color !== '' && store.size !== ''
            case 2:
                // If design needed, require at least the main image
                if (needsDesign) {
                    if (designSlots === 2) return store.imagePreview !== null && store.imagePreview2 !== null
                    return store.imagePreview !== null
                }
                return true // Plain = no images needed
            default:
                return true
        }
    }

    const handleFinish = () => {
        // Navigate to the summary page
        router.push(`/onboarding/${product.id}/resumen`)
    }

    return (
        <div className="space-y-6">
            {/* Step indicator */}
            <div className="flex items-center gap-2">
                {Array.from({ length: TOTAL_STEPS }, (_, i) => i + 1).map((s) => (
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
                    Paso {store.step} de {TOTAL_STEPS}
                </div>
            </div>

            {/* ══════════════════════════════════════════════════════════════════
                Step 1: Configuración (Técnica, Color, Talla, Cantidad)
              ══════════════════════════════════════════════════════════════════ */}
            {store.step === 1 && (
                <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                    <h3 className="text-lg font-semibold text-neutral-900">Configuración</h3>

                    {/* Design type / Technique */}
                    <DesignTypeSelector
                        designTypes={
                            availableDesignTypes.length > 0
                                ? availableDesignTypes
                                : ['DTF Normal', 'DTF Dual', 'Sublimado', 'Llano']
                        }
                        value={store.designType}
                        onChange={(v) => store.setField('designType', v)}
                    />

                    {/* Color & Size */}
                    <ColorSizeSelector
                        inventory={inventory}
                        availableColors={product.available_colors ?? []}
                        availableSizes={product.available_sizes ?? []}
                        selectedColor={store.color}
                        selectedSize={store.size}
                        onColorChange={(v) => store.setField('color', v)}
                        onSizeChange={(v) => store.setField('size', v)}
                    />

                    {/* Quantity */}
                    <div className="space-y-2">
                        <Label>Cantidad</Label>
                        <Input
                            type="number"
                            min={1}
                            max={99}
                            value={store.quantity}
                            onChange={(e) =>
                                store.setField('quantity', Math.max(1, parseInt(e.target.value) || 1))
                            }
                            className="max-w-24"
                        />
                    </div>

                    {/* Live price preview */}
                    {store.unitPrice !== null && (
                        <div className="rounded-lg bg-neutral-50 border border-neutral-200 p-4 text-center">
                            <p className="text-sm text-neutral-500">Precio unitario</p>
                            <p className="text-2xl font-bold text-neutral-900">
                                {formatCurrency(store.unitPrice)}
                            </p>
                            {store.quantity > 1 && (
                                <p className="text-xs text-neutral-400 mt-1">
                                    Total: {formatCurrency(store.unitPrice * store.quantity)}
                                </p>
                            )}
                        </div>
                    )}
                    {priceLoading && (
                        <p className="text-xs text-neutral-400 animate-pulse text-center">
                            Calculando precio...
                        </p>
                    )}
                </div>
            )}

            {/* ══════════════════════════════════════════════════════════════════
                Step 2: Imágenes de Diseño
              ══════════════════════════════════════════════════════════════════ */}
            {store.step === 2 && (
                <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                    {needsDesign ? (
                        <>
                            <h3 className="text-lg font-semibold text-neutral-900">
                                {designSlots === 2 ? 'Sube tus 2 diseños' : 'Sube tu diseño'}
                            </h3>

                            {/* Design 1 */}
                            <ImageUploader
                                imagePreview={store.imagePreview}
                                onFileChange={(file, preview) => {
                                    store.setField('imageFile', file)
                                    store.setField('imagePreview', preview)
                                }}
                            />

                            {/* Design 2 (Dual only) */}
                            {designSlots === 2 && (
                                <>
                                    <p className="text-sm font-medium text-neutral-700 mt-4">
                                        Diseño 2 (Espalda)
                                    </p>
                                    <ImageUploader
                                        imagePreview={store.imagePreview2}
                                        onFileChange={(file, preview) => {
                                            store.setField('imageFile2', file)
                                            store.setField('imagePreview2', preview)
                                        }}
                                    />
                                </>
                            )}

                            {/* Placement instructions */}
                            <div className="space-y-2">
                                <Label>Instrucciones de ubicación (opcional)</Label>
                                <textarea
                                    value={store.placement}
                                    onChange={(e) => store.setField('placement', e.target.value)}
                                    rows={3}
                                    placeholder="Ej: Centrado en el pecho, tamaño 20cm..."
                                    className="flex w-full rounded-lg border border-neutral-300 bg-white px-4 py-3 text-sm shadow-sm transition-colors focus:border-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-200 resize-none"
                                />
                            </div>
                        </>
                    ) : (
                        <div className="text-center py-8 space-y-2">
                            <p className="text-lg font-semibold text-neutral-900">Producto llano</p>
                            <p className="text-sm text-neutral-500">
                                Este producto no requiere diseño personalizado. Presiona
                                &quot;Finalizar&quot; para continuar.
                            </p>
                        </div>
                    )}
                </div>
            )}

            {/* ══════════════════════════════════════════════════════════════════
                Navigation buttons
              ══════════════════════════════════════════════════════════════════ */}
            <div className="flex justify-between pt-4">
                <Button
                    variant="ghost"
                    onClick={() => store.setStep(store.step - 1)}
                    disabled={store.step <= 1}
                >
                    <ChevronLeft className="h-4 w-4" /> Atrás
                </Button>

                {store.step < TOTAL_STEPS ? (
                    <Button
                        onClick={() => store.setStep(store.step + 1)}
                        disabled={!canProceed()}
                    >
                        Siguiente <ChevronRight className="h-4 w-4" />
                    </Button>
                ) : (
                    <Button
                        onClick={handleFinish}
                        disabled={!canProceed()}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white"
                    >
                        Finalizar ✓
                    </Button>
                )}
            </div>
        </div>
    )
}
