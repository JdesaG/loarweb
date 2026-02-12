'use client'

import { useEffect, useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useSupabase } from '@/hooks/supabase'
import { useConfiguratorStore } from '@/stores/configuratorStore'
import { useInventory } from '@/hooks/useInventory'
import { ColorSizeSelector } from './ColorSizeSelector'
import { ImageUploader } from './ImageUploader'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
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
    const [pricingRules, setPricingRules] = useState<ProductPricing[]>([])
    const [pricingLoading, setPricingLoading] = useState(true)

    // ── Set product on mount ─────────────────────────────────────────────────
    useEffect(() => {
        store.setProduct(product)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [product.id])

    // ── Fetch pricing rules ──────────────────────────────────────────────────
    useEffect(() => {
        async function fetchData() {
            setPricingLoading(true)
            const { data: pricing } = await supabase
                .from('product_pricing')
                .select('*')
                .eq('product_id', product.id)
            setPricingRules((pricing as unknown as ProductPricing[]) ?? [])
            setPricingLoading(false)
        }
        fetchData()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [product.id])

    // ══════════════════════════════════════════════════════════════════════════
    //  DERIVED STATE — Cascading Dropdowns
    // ══════════════════════════════════════════════════════════════════════════

    // 1) Unique Design Types available for this product (from product_pricing)
    const availableDesignTypes = useMemo(() =>
        Array.from(new Set(pricingRules.map((p) => p.design_type).filter(Boolean))) as string[],
        [pricingRules]
    )

    // 2) When a Design Type is selected, show only the Materials (Techniques)
    //    that exist in product_pricing for that Design Type
    const availableMaterials = useMemo(() => {
        if (!store.designType) return []
        const filtered = pricingRules.filter((p) => p.design_type === store.designType)
        return Array.from(new Set(filtered.map((p) => p.material).filter(Boolean))) as string[]
    }, [store.designType, pricingRules])

    // 3) Determine if "Sublimado" is selected — restricts color to "Blanca"
    const isSublimado = store.material?.toLowerCase() === 'sublimado'

    // 4) Colors from inventory, filtered by the Sublimado rule
    const availableColors = useMemo(() => {
        const allColors = Array.from(
            new Set(inventory.map((i) => i.color).filter(Boolean))
        ) as string[]

        if (isSublimado) {
            // Only show white variants
            const whites = allColors.filter(
                (c) => c.toLowerCase().includes('blanc')
            )
            return whites.length > 0 ? whites : ['Blanca']
        }
        return allColors
    }, [inventory, isSublimado])

    // 5) Sizes from inventory filtered by selected color
    const availableSizes = useMemo(() => {
        const filtered = inventory.filter((i) => {
            if (!store.color) return true
            return i.color === store.color
        })
        return Array.from(new Set(filtered.map((i) => i.size).filter(Boolean))) as string[]
    }, [inventory, store.color])

    // 6) Design slots logic
    const isDesignDual = store.designType?.toLowerCase().includes('dual')
    const designSlots = isDesignDual ? 2 : 1
    const isPlainMaterial = store.material?.toLowerCase().includes('llano') || store.material?.toLowerCase().includes('llan')
    const needsDesign = !isPlainMaterial && store.material !== ''

    // ── Calculate price locally ──────────────────────────────────────────────
    useEffect(() => {
        // If critical fields are missing, reset price
        if (!store.designType || !store.material) {
            store.setPrice(0, null)
            return
        }

        const qty = store.quantity || 1

        // Find matching rule based on Design Type + Material + Quantity Range
        const matchingRule = pricingRules.find((rule) => {
            // 1. Match Design Type & Material
            if (rule.design_type !== store.designType) return false
            if (rule.material !== store.material) return false

            // 2. Match Style (optional, use 'default' or match store if needed)
            // For now, assume we take the first match or specific style if implemented
            // if (rule.style_name !== (store.styleName || 'default')) return false

            // 3. Match Quantity Range
            const min = rule.min_qty
            const max = rule.max_qty

            // Check if qty is within [min, max]
            return qty >= min && qty <= max
        })

        if (matchingRule) {
            store.setPrice(matchingRule.price, matchingRule.id)
        } else {
            // Fallback: No specific rule for this quantity? 
            // Maybe find rule with lowest min_qty or just reset
            console.warn('No pricing rule found for:', { dt: store.designType, mat: store.material, qty })
            store.setPrice(0, null)
        }
    }, [store.designType, store.material, store.quantity, pricingRules])

    // ── Reset dependent fields when parent changes ───────────────────────────
    const handleDesignTypeChange = (v: string) => {
        store.setField('designType', v)
        store.setField('material', '')
        store.setField('color', '')
        store.setField('size', '')
    }

    const handleMaterialChange = (v: string) => {
        store.setField('material', v)
        store.setField('color', '')
        store.setField('size', '')
    }

    // ── Loading ──────────────────────────────────────────────────────────────
    if (invLoading || pricingLoading) {
        return <LoadingSpinner className="py-12" text="Cargando opciones..." />
    }

    const canProceed = () => {
        switch (store.step) {
            case 1:
                return (
                    store.designType !== '' &&
                    store.material !== '' &&
                    store.color !== '' &&
                    store.size !== ''
                )
            case 2:
                if (needsDesign) {
                    if (designSlots === 2)
                        return store.imagePreview !== null && store.imagePreview2 !== null
                    return store.imagePreview !== null
                }
                return true // Llano = no images needed
            default:
                return true
        }
    }

    const handleFinish = () => {
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
                Step 1: Configuración
              ══════════════════════════════════════════════════════════════════ */}
            {store.step === 1 && (
                <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                    <h3 className="text-lg font-semibold text-neutral-900">Configuración</h3>

                    {/* ─── Dropdown 1: Tipo de Diseño (Normal / Dual / Sin Diseño) ── */}
                    <div className="space-y-2">
                        <Label>Tipo de Diseño</Label>
                        <Select value={store.designType} onValueChange={handleDesignTypeChange}>
                            <SelectTrigger>
                                <SelectValue placeholder="Selecciona tipo de diseño" />
                            </SelectTrigger>
                            <SelectContent>
                                {availableDesignTypes.map((dt) => (
                                    <SelectItem key={dt} value={dt}>{dt}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* ─── Dropdown 2: Técnica / Material (DTF / Sublimado / Llano) ── */}
                    {store.designType && (
                        <div className="space-y-2 animate-in fade-in duration-200">
                            <Label>Técnica</Label>
                            {availableMaterials.length > 0 ? (
                                <Select value={store.material} onValueChange={handleMaterialChange}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecciona técnica" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {availableMaterials.map((m) => (
                                            <SelectItem key={m} value={m}>{m}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            ) : (
                                <p className="text-sm text-amber-600">
                                    No hay técnicas configuradas para este tipo de diseño.
                                </p>
                            )}
                        </div>
                    )}

                    {/* ─── Color & Talla ──────────────────────────────────────────── */}
                    {store.material && (
                        <div className="animate-in fade-in duration-200">
                            <ColorSizeSelector
                                inventory={inventory}
                                availableColors={availableColors}
                                availableSizes={availableSizes}
                                selectedColor={store.color}
                                selectedSize={store.size}
                                onColorChange={(v) => {
                                    store.setField('color', v)
                                    store.setField('size', '')
                                }}
                                onSizeChange={(v) => store.setField('size', v)}
                            />
                            {isSublimado && (
                                <p className="text-xs text-neutral-500 mt-1 italic">
                                    ⚠ Sublimado solo disponible en color blanco.
                                </p>
                            )}
                        </div>
                    )}

                    {/* ─── Cantidad ────────────────────────────────────────────────── */}
                    <div className="space-y-2">
                        <Label>Cantidad</Label>
                        <Input
                            type="number"
                            min={1}
                            max={999}
                            value={store.quantity}
                            onChange={(e) =>
                                store.setField('quantity', Math.max(1, parseInt(e.target.value) || 1))
                            }
                            className="max-w-24"
                        />
                    </div>

                    {/* ─── Precio unitario (calculado en vivo) ─────────────────────── */}
                    {store.unitPrice !== null && store.unitPrice > 0 && (
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
