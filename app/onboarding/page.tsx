'use client'

import { useProducts } from '@/hooks/useProducts'
import { ProductCard } from '@/components/onboarding/ProductCard'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { EmptyState } from '@/components/shared/EmptyState'
import { ShoppingBag } from 'lucide-react'
import Link from 'next/link'
import { useCart } from '@/hooks/useCart'
import { Badge } from '@/components/ui/badge'
import { useSearchParams } from 'next/navigation'

export default function OnboardingPage() {
    const { products, loading, error } = useProducts()
    const { itemCount } = useCart()
    const searchParams = useSearchParams()
    const executionId = searchParams.get('executionId')

    return (
        <div className="min-h-screen bg-white">
            {/* Header */}
            <header className="sticky top-0 z-40 border-b border-neutral-100 bg-white/80 backdrop-blur-md">
                <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
                    <Link href="/" className="text-2xl font-extrabold tracking-tight text-neutral-900">
                        LOAR
                    </Link>
                    <Link href={`/onboarding/checkout${executionId ? `?executionId=${executionId}` : ''}`} className="relative">
                        <ShoppingBag className="h-6 w-6 text-neutral-700" />
                        {itemCount > 0 && (
                            <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-[10px]">
                                {itemCount}
                            </Badge>
                        )}
                    </Link>
                </div>
            </header>

            {/* Content */}
            <main className="mx-auto max-w-6xl px-4 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-neutral-900">Catálogo</h1>
                    <p className="mt-1 text-neutral-500">Selecciona un producto para personalizar</p>
                </div>

                {loading ? (
                    <LoadingSpinner className="py-20" text="Cargando productos..." />
                ) : error ? (
                    <EmptyState title="Error" description={error} />
                ) : products.length === 0 ? (
                    <EmptyState
                        title="Sin productos"
                        description="No hay productos disponibles en este momento."
                    />
                ) : (
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                        {products.map((product) => (
                            <ProductCard key={product.id} product={product} executionId={executionId} />
                        ))}
                    </div>
                )}
            </main>
        </div>
    )
}
