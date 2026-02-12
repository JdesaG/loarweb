'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useCart } from '@/hooks/useCart'
import { customerInfoSchema } from '@/schemas/order'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { EmptyState } from '@/components/shared/EmptyState'
import { formatCurrency } from '@/lib/utils'
import { ArrowLeft, CheckCircle, Loader2, ShoppingCart, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'
import type { CustomerInfoInput } from '@/schemas/order'

export default function CheckoutPage() {
    const router = useRouter()
    const { items, total, clearCart, removeItem } = useCart()
    const [submitting, setSubmitting] = useState(false)
    const [orderCode, setOrderCode] = useState<string | null>(null)
    const [acceptTerms, setAcceptTerms] = useState(false)

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<CustomerInfoInput>({
        resolver: zodResolver(customerInfoSchema),
    })

    const onSubmit = async (customer: CustomerInfoInput) => {
        if (!acceptTerms) {
            toast.error('Debes aceptar los términos y condiciones')
            return
        }

        setSubmitting(true)
        try {
            const subtotal = total
            const tax = 0
            const grandTotal = subtotal + tax

            const res = await fetch('/api/create-order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    customer,
                    items: items.map((item) => ({
                        product_id: item.product.id,
                        product_name: item.product.name,
                        style_name: item.styleName || null,
                        selected_color: item.selectedColor || null,
                        selected_size: item.selectedSize || null,
                        material: item.material || null,
                        design_type: item.designType || null,
                        quantity: item.quantity,
                        unit_price: item.unitPrice,
                        design_main_url: item.designMainUrl || null,
                        design_secondary_url: item.designSecondaryUrl || null,
                        placement_instructions: item.placementInstructions || null,
                        add_initial: item.addInitial ?? false,
                        initial_letter: item.initialLetter || null,
                        initial_price: item.initialPrice ?? 0,
                        item_total: item.unitPrice * item.quantity + (item.addInitial && item.initialPrice ? item.initialPrice * item.quantity : 0),
                    })),
                    subtotal,
                    tax,
                    total: grandTotal,
                }),
            })

            if (!res.ok) {
                const data = await res.json()
                throw new Error(data.error || 'Error al crear orden')
            }

            const data = await res.json()
            clearCart()
            setOrderCode(data.orderCode)
            toast.success('¡Pedido creado!')
        } catch (err: unknown) {
            toast.error(err instanceof Error ? err.message : 'Error inesperado')
        }
        setSubmitting(false)
    }

    // ── Success screen ───────────────────────────────────────────────────────
    if (orderCode) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center px-4">
                <div className="text-center space-y-4 max-w-sm">
                    <CheckCircle className="h-16 w-16 text-emerald-500 mx-auto" />
                    <h1 className="text-2xl font-bold text-neutral-900">¡Pedido creado!</h1>
                    <p className="text-neutral-500">Tu código de pedido es:</p>
                    <p className="text-3xl font-mono font-bold text-neutral-900">{orderCode}</p>
                    <p className="text-sm text-neutral-500">
                        Te contactaremos para coordinar el pago y envío.
                    </p>
                    <Link href="/onboarding">
                        <Button variant="brand" size="lg" className="mt-4">
                            Volver al catálogo
                        </Button>
                    </Link>
                </div>
            </div>
        )
    }

    // ── Empty cart ────────────────────────────────────────────────────────────
    if (items.length === 0) {
        return (
            <div className="min-h-screen">
                <header className="border-b border-neutral-100 bg-white">
                    <div className="mx-auto flex max-w-lg items-center gap-3 px-4 py-4">
                        <Link href="/onboarding">
                            <Button variant="ghost" size="icon"><ArrowLeft className="h-5 w-5" /></Button>
                        </Link>
                        <h1 className="text-lg font-bold text-neutral-900">Checkout</h1>
                    </div>
                </header>
                <EmptyState
                    className="py-20"
                    title="Carrito vacío"
                    description="Agrega productos desde el catálogo."
                    icon={<ShoppingCart className="h-8 w-8 text-neutral-400" />}
                >
                    <Link href="/onboarding">
                        <Button>Ver catálogo</Button>
                    </Link>
                </EmptyState>
            </div>
        )
    }

    // ── Checkout form ────────────────────────────────────────────────────────
    return (
        <div className="min-h-screen bg-white">
            <header className="sticky top-0 z-40 border-b border-neutral-100 bg-white/80 backdrop-blur-md">
                <div className="mx-auto flex max-w-lg items-center gap-3 px-4 py-4">
                    <Link href="/onboarding">
                        <Button variant="ghost" size="icon"><ArrowLeft className="h-5 w-5" /></Button>
                    </Link>
                    <h1 className="text-lg font-bold text-neutral-900">Checkout</h1>
                </div>
            </header>

            <main className="mx-auto max-w-lg px-4 py-6 space-y-6">
                {/* Cart items */}
                <div>
                    <h2 className="text-sm font-semibold text-neutral-500 uppercase tracking-wide mb-3">
                        Tu carrito ({items.length})
                    </h2>
                    <div className="space-y-2">
                        {items.map((item) => (
                            <Card key={item.id}>
                                <CardContent className="p-4 flex items-center gap-3">
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-neutral-900 truncate">{item.product.name}</p>
                                        <p className="text-xs text-neutral-500">
                                            ×{item.quantity} · {formatCurrency(item.unitPrice)}
                                            {item.selectedColor && ` · ${item.selectedColor}`}
                                            {item.selectedSize && ` · ${item.selectedSize}`}
                                            {item.designType && ` · ${item.designType}`}
                                        </p>
                                    </div>
                                    <p className="font-semibold text-neutral-900 text-sm">
                                        {formatCurrency(item.unitPrice * item.quantity)}
                                    </p>
                                    <Button variant="ghost" size="icon" onClick={() => removeItem(item.id)} className="h-8 w-8">
                                        <Trash2 className="h-3.5 w-3.5 text-red-500" />
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                    <div className="flex justify-between mt-3 px-1 text-base font-bold text-neutral-900">
                        <span>Total</span>
                        <span>{formatCurrency(total)}</span>
                    </div>
                </div>

                {/* Customer form */}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <h2 className="text-sm font-semibold text-neutral-500 uppercase tracking-wide">
                        Datos personales
                    </h2>

                    <div className="space-y-2">
                        <Label>Nombre completo</Label>
                        <Input {...register('customer_name')} placeholder="Juan Pérez" />
                        {errors.customer_name && <p className="text-xs text-red-500">{errors.customer_name.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label>Teléfono</Label>
                        <Input {...register('customer_phone')} placeholder="+593 9XX XXX XXXX" />
                        {errors.customer_phone && <p className="text-xs text-red-500">{errors.customer_phone.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label>Email</Label>
                        <Input {...register('customer_email')} type="email" placeholder="correo@ejemplo.com" />
                        {errors.customer_email && <p className="text-xs text-red-500">{errors.customer_email.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label>Cédula</Label>
                        <Input {...register('customer_id_card')} placeholder="1234567890" />
                    </div>

                    {/* Terms & Conditions */}
                    <div className="flex items-start gap-3 rounded-lg border border-neutral-200 p-4 bg-neutral-50">
                        <input
                            type="checkbox"
                            id="accept-terms"
                            checked={acceptTerms}
                            onChange={(e) => setAcceptTerms(e.target.checked)}
                            className="mt-0.5 h-4 w-4 rounded border-neutral-300 text-neutral-900 focus:ring-neutral-500"
                        />
                        <label htmlFor="accept-terms" className="text-sm text-neutral-600 cursor-pointer">
                            Acepto los{' '}
                            <span className="font-medium text-neutral-900 underline">
                                Términos y Condiciones
                            </span>{' '}
                            y autorizo el uso de mis datos personales para el procesamiento de este pedido.
                        </label>
                    </div>

                    <Button
                        type="submit"
                        variant="brand"
                        size="lg"
                        className="w-full"
                        disabled={submitting || !acceptTerms}
                    >
                        {submitting ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Procesando...
                            </>
                        ) : (
                            `Enviar pedido · ${formatCurrency(total)}`
                        )}
                    </Button>
                </form>
            </main>
        </div>
    )
}
