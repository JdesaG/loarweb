'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useConfiguratorStore } from '@/stores/configuratorStore'
import { useSupabase } from '@/hooks/supabase'
import { usePriceCalculation } from '@/hooks/usePriceCalculation'
import { ColorSizeSelector } from './ColorSizeSelector'
import { ImageUploader } from './ImageUploader'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { ArrowLeft, ArrowRight, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import type { Product, InventoryItem, ProductPricing } from '@/types'

interface ConfiguratorWizardProps {
    product: Product
}

// ── Helpers ──────────────────────────────────────────────────────────────────

/** Determine how many design image slots are needed based on the design_type string */
function getDesignSlots(designType: string): number {
    const lower = designType.toLowerCase()
    if (lower === 'llano' || lower === 'liso' || lower === 'sin diseño') return 0
    if (lower.includes('dual') || lower.includes('doble') || lower.includes(' 2')) return 2
    return 1
}

/** Upload a file to Supabase Storage and return the public URL */
async function uploadDesignFile(
    supabase: ReturnType<typeof useSupabase>,
    file: File,
    productId: string,
    slot: number
): Promise<string> {
    const ext = file.name.split('.').pop() || 'png'
    const timestamp = Date.now()
    const path = `${productId}/${timestamp}_design${slot}.${ext}`

    const { error } = await supabase.storage
        .from('designs')
        .upload(path, file, { upsert: true })

    if (error) throw new Error(`Error al subir imagen: ${error.message}`)

    const { data: urlData } = supabase.storage
        .from('designs')
        .getPublicUrl(path)

    return urlData.publicUrl
}

// ── Main Component ───────────────────────────────────────────────────────────

export function ConfiguratorWizard({ product }: ConfiguratorWizardProps) {
    const router = useRouter()
    const supabase = useSupabase()
    const store = useConfiguratorStore()
    const { calculatePrice, loading: priceLoading } = usePriceCalculation()

    const [inventory, setInventory] = useState<InventoryItem[]>([])
    const [pricingRules, setPricingRules] = useState<ProductPricing[]>([])
    const [uploading, setUploading] = useState(false)

    // ── Set product on mount ─────────────────────────────────────────────────
    useEffect(() => {
        store.setProduct(product)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [product.id])

    // ── Fetch inventory + pricing rules ──────────────────────────────────────
    useEffect(() => {
        const fetchData = async () => {
            // Fetch inventory for this product
            const { data: inv } = await supabase
                .from('inventory')
                .select('*')
                .eq('product_id', product.id)
                .eq('is_visible', true)

            setInventory((inv as unknown as InventoryItem[]) ?? [])

            // Fetch pricing rules for this product
            const { data: pricing } = await supabase
                .from('products_pricing')
                .select('*')
                .eq('product_id', product.id)

            setPricingRules((pricing as unknown as ProductPricing[]) ?? [])
        }
        fetchData()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [product.id])

    // ── Derive available options from pricing rules ──────────────────────────
    const availableDesignTypes = useMemo(() => {
        const types = new Set<string>()
        pricingRules.forEach((r) => {
            if (r.design_type) types.add(r.design_type)
        })
        return Array.from(types)
    }, [pricingRules])

    // Derive colors and sizes from inventory
    const availableColors = useMemo(() => {
        const colors = new Set<string>()
        inventory.forEach((i) => { if (i.color) colors.add(i.color) })
        return Array.from(colors)
    }, [inventory])

    const availableSizes = useMemo(() => {
        const sizes = new Set<string>()
        inventory.forEach((i) => { if (i.size) sizes.add(i.size) })
        return Array.from(sizes)
    }, [inventory])

    // ── Design slots based on selected design type ───────────────────────────
    const designSlots = store.designType ? getDesignSlots(store.designType) : 1

    // ── Calculate price when config changes ──────────────────────────────────
    useEffect(() => {
        if (!store.designType || !store.quantity) return

        const timer = setTimeout(async () => {
            const result = await calculatePrice({
                productId: product.id,
                designType: store.designType || undefined,
                quantity: store.quantity,
            })
            if (result) {
                store.setPrice(result.unitPrice, result.pricingId)
            }
        }, 300)

        return () => clearTimeout(timer)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [store.designType, store.quantity, product.id])

    // ── Total steps ──────────────────────────────────────────────────────────
    // If design type is "Llano" (0 slots), skip step 2 and go directly to resumen
    const totalSteps = designSlots === 0 ? 1 : 2

    // ── Step validation ──────────────────────────────────────────────────────
    const canProceedStep1 = () => {
        if (!store.designType) return false
        if (availableColors.length > 0 && !store.color) return false
        if (availableSizes.length > 0 && !store.size) return false
        if (store.quantity < 1) return false
        return true
    }

    const canProceedStep2 = () => {
        if (designSlots >= 1 && !store.imageFile) return false
        if (designSlots >= 2 && !store.imageFile2) return false
        return true
    }

    const canProceed = () => {
        if (store.step === 1) return canProceedStep1()
        if (store.step === 2) return canProceedStep2()
        return false
    }

    // ── Handle "Finish" — Upload images then navigate ────────────────────────
    const handleFinalize = async () => {
        setUploading(true)
        try {
            let mainUrl: string | null = null
            let secondaryUrl: string | null = null

            // Upload image 1
            if (store.imageFile) {
                mainUrl = await uploadDesignFile(supabase, store.imageFile, product.id, 1)
                store.setField('designMainUrl', mainUrl)
            }

            // Upload image 2
            if (store.imageFile2) {
                secondaryUrl = await uploadDesignFile(supabase, store.imageFile2, product.id, 2)
                store.setField('designSecondaryUrl', secondaryUrl)
            }

            // Navigate to resumen
            router.push(`/onboarding/${product.id}/resumen`)
        } catch (err) {
            toast.error(err instanceof Error ? err.message : 'Error subiendo imagen')
        } finally {
            setUploading(false)
        }
    }

    // ── Handle Next ──────────────────────────────────────────────────────────
    const handleNext = () => {
        if (store.step === 1 && designSlots === 0) {
            // No designs needed — go directly to resumen
            router.push(`/onboarding/${product.id}/resumen`)
            return
        }

        if (store.step === 1) {
            store.setStep(2)
            return
        }

        if (store.step === 2) {
            handleFinalize()
            return
        }
    }

    const handleBack = () => {
        if (store.step > 1) {
            store.setStep(store.step - 1)
        }
    }

    // ── Render ────────────────────────────────────────────────────────────────
    return (
        <div className="space-y-6">
            {/* Step indicator */}
            <div className="flex items-center gap-2">
                {Array.from({ length: totalSteps }, (_, i) => i + 1).map((s) => (
                    <div
                        key={s}
                        className={`h-2 flex-1 rounded-full transition-colors ${s <= store.step ? 'bg-neutral-900' : 'bg-neutral-200'
                            }`}
                    />
                ))}
            </div>

            {/* ── Step 1: Configuration ───────────────────────────────────── */}
            {store.step === 1 && (
                <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                    <h3 className="text-lg font-semibold text-neutral-900">Configuración</h3>

                    {/* Design Type (Technique) */}
                    {availableDesignTypes.length > 0 && (
                        <div className="space-y-2">
                            <Label>Tipo de Diseño</Label>
                            <Select
                                value={store.designType}
                                onValueChange={(v) => store.setField('designType', v)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecciona tipo de diseño" />
                                </SelectTrigger>
                                <SelectContent>
                                    {availableDesignTypes.map((dt) => (
                                        <SelectItem key={dt} value={dt}>
                                            {dt}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    )}

                    {/* Color & Size */}
                    {(availableColors.length > 0 || availableSizes.length > 0) && (
                        <ColorSizeSelector
                            inventory={inventory}
                            availableColors={availableColors}
                            availableSizes={availableSizes}
                            selectedColor={store.color}
                            selectedSize={store.size}
                            onColorChange={(v) => store.setField('color', v)}
                            onSizeChange={(v) => store.setField('size', v)}
                        />
                    )}

                    {/* Quantity */}
                    <div className="space-y-2">
                        <Label>Cantidad</Label>
                        <Input
                            type="number"
                            min={1}
                            value={store.quantity}
                            onChange={(e) =>
                                store.setField('quantity', Math.max(1, Number(e.target.value)))
                            }
                        />
                    </div>

                    {/* Live price display */}
                    {store.unitPrice !== null && (
                        <div className="rounded-lg bg-neutral-50 border border-neutral-200 p-4">
                            <div className="flex justify-between text-sm">
                                <span className="text-neutral-600">Precio unitario</span>
                                <span className="font-semibold">
                                    ${store.unitPrice.toFixed(2)}
                                </span>
                            </div>
                            <div className="flex justify-between text-base font-bold mt-1">
                                <span>Total estimado</span>
                                <span>
                                    ${(store.unitPrice * store.quantity).toFixed(2)}
                                </span>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* ── Step 2: Design Images ───────────────────────────────────── */}
            {store.step === 2 && (
                <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                    <h3 className="text-lg font-semibold text-neutral-900">
                        {designSlots === 2 ? 'Sube tus 2 diseños' : 'Sube tu diseño'}
                    </h3>

                    {/* Design 1 */}
                    <ImageUploader
                        label={designSlots === 2 ? 'Diseño 1 (Frente)' : 'Imagen de diseño'}
                        imagePreview={store.imagePreview}
                        onFileChange={(file, preview) => {
                            store.setField('imageFile', file)
                            store.setField('imagePreview', preview)
                        }}
                    />

                    {/* Design 2 (Dual only) */}
                    {designSlots === 2 && (
                        <ImageUploader
                            label="Diseño 2 (Espalda)"
                            imagePreview={store.imagePreview2}
                            onFileChange={(file, preview) => {
                                store.setField('imageFile2', file)
                                store.setField('imagePreview2', preview)
                            }}
                        />
                    )}

                    {/* Placement instructions */}
                    <div className="space-y-2">
                        <Label>Instrucciones de ubicación</Label>
                        <textarea
                            value={store.placement}
                            onChange={(e) => store.setField('placement', e.target.value)}
                            rows={3}
                            placeholder="Ej: Centrado en el pecho, tamaño 20cm..."
                            className="flex w-full rounded-lg border border-neutral-300 bg-white px-4 py-3 text-sm shadow-sm transition-colors focus:border-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-200 resize-none"
                        />
                    </div>
                </div>
            )}

            {/* ── Navigation ──────────────────────────────────────────────── */}
            <div className="flex gap-3 pt-2">
                {store.step > 1 && (
                    <Button
                        variant="outline"
                        onClick={handleBack}
                        disabled={uploading}
                        className="flex-1"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Atrás
                    </Button>
                )}
                <Button
                    variant="brand"
                    onClick={handleNext}
                    disabled={!canProceed() || uploading || priceLoading}
                    className="flex-1"
                >
                    {uploading ? (
                        <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Subiendo...
                        </>
                    ) : store.step >= totalSteps ? (
                        designSlots === 0 ? 'Ver Resumen' : 'Finalizar'
                    ) : (
                        <>
                            Siguiente
                            <ArrowRight className="h-4 w-4" />
                        </>
                    )}
                </Button>
            </div>
        </div>
    )
}
