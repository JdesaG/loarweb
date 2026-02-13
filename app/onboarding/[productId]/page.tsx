'use client'

import { Suspense, use, useEffect, useState } from 'react'
import { useSupabase } from '@/hooks/supabase'
import { useConfiguratorStore } from '@/stores/configuratorStore'
import { ConfiguratorWizard } from '@/components/onboarding/ConfiguratorWizard'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { EmptyState } from '@/components/shared/EmptyState'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import type { Product } from '@/types'

export default function ConfiguratorPage({ params }: { params: Promise<{ productId: string }> }) {
    return (
        <Suspense>
            <ConfiguratorContent params={params} />
        </Suspense>
    )
}

function ConfiguratorContent({ params }: { params: Promise<{ productId: string }> }) {
    const { productId } = use(params)
    const searchParams = useSearchParams()
    const executionId = searchParams.get('executionId')
    const supabase = useSupabase()
    const reset = useConfiguratorStore((s) => s.reset)
    const [product, setProduct] = useState<Product | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        reset()
        const fetchProduct = async () => {
            const { data } = await supabase
                .from('products')
                .select('*')
                .eq('id', productId)
                .single()
            setProduct(data as unknown as Product | null)
            setLoading(false)
        }
        fetchProduct()
    }, [productId, supabase, reset])

    if (loading) return <LoadingSpinner className="min-h-screen" text="Cargando producto..." />
    if (!product) return <EmptyState title="Producto no encontrado" className="min-h-screen" />

    return (
        <div className="min-h-screen bg-white">
            {/* Header */}
            <header className="sticky top-0 z-40 border-b border-neutral-100 bg-white/80 backdrop-blur-md">
                <div className="mx-auto flex max-w-4xl items-center gap-3 px-4 py-4">
                    <Link href={`/onboarding${executionId ? `?executionId=${executionId}` : ''}`}>
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                    </Link>
                    <h1 className="text-lg font-bold text-neutral-900 truncate">{product.name}</h1>
                </div>
            </header>

            <main className="mx-auto max-w-4xl px-4 py-6">
                <div className="grid gap-8 md:grid-cols-2">
                    {/* Product image */}
                    <div className="relative aspect-square overflow-hidden rounded-xl bg-neutral-100">
                        {product.base_image ? (
                            <Image
                                src={product.base_image}
                                alt={product.name}
                                fill
                                className="object-cover"
                                sizes="(max-width: 768px) 100vw, 50vw"
                                priority
                            />
                        ) : (
                            <div className="flex h-full items-center justify-center text-6xl text-neutral-300">
                                📦
                            </div>
                        )}
                    </div>

                    {/* Configurator wizard */}
                    <div>
                        <ConfiguratorWizard product={product} />
                    </div>
                </div>
            </main>
        </div>
    )
}
