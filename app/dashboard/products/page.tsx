'use client'

import { useState } from 'react'
import { useProducts } from '@/hooks/useProducts'
import { ProductEditor } from '@/components/dashboard/ProductEditor'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { EmptyState } from '@/components/shared/EmptyState'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatCurrency } from '@/lib/utils'
import { Package, Pencil } from 'lucide-react'
import Image from 'next/image'
import type { Product } from '@/types'

export default function ProductsPage() {
    const { products, loading } = useProducts()
    const [editingProduct, setEditingProduct] = useState<Product | null>(null)
    const [editorOpen, setEditorOpen] = useState(false)

    const handleSave = async (id: string, data: Partial<Product>) => {
        // Direct Supabase call via service role through API would be better
        // For now, a simple approach
        const { createBrowserSupabaseClient } = await import('@/lib/supabase')
        const supabase = createBrowserSupabaseClient()
        const { error } = await supabase
            .from('products')
            .update({
                name: data.name,
                description: data.description,
                base_price: data.base_price,
            })
            .eq('id', id)
        if (error) throw error
    }

    const handleEdit = (product: Product) => {
        setEditingProduct(product)
        setEditorOpen(true)
    }

    if (loading) {
        return <LoadingSpinner className="py-20" text="Cargando productos..." />
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-neutral-900">Productos</h1>
                <p className="text-neutral-500 text-sm">Lista de productos activos</p>
            </div>

            {products.length === 0 ? (
                <EmptyState
                    title="Sin productos"
                    description="Agrega productos desde Supabase."
                    icon={<Package className="h-8 w-8 text-neutral-400" />}
                />
            ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {products.map((product) => (
                        <Card key={product.id} className="overflow-hidden">
                            <div className="relative aspect-video bg-neutral-100">
                                {product.images?.[0] ? (
                                    <Image
                                        src={product.images[0]}
                                        alt={product.name}
                                        fill
                                        className="object-cover"
                                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                    />
                                ) : (
                                    <div className="flex h-full items-center justify-center">
                                        <Package className="h-10 w-10 text-neutral-300" />
                                    </div>
                                )}
                            </div>
                            <CardContent className="p-4">
                                <div className="flex items-start justify-between gap-2">
                                    <div>
                                        <h3 className="font-semibold text-neutral-900">{product.name}</h3>
                                        <p className="text-sm text-neutral-500 line-clamp-1">{product.description}</p>
                                        <p className="mt-1 text-lg font-bold text-neutral-900">
                                            {formatCurrency(product.base_price)}
                                        </p>
                                    </div>
                                    <Button variant="ghost" size="icon" onClick={() => handleEdit(product)}>
                                        <Pencil className="h-4 w-4" />
                                    </Button>
                                </div>
                                <Badge variant="secondary" className="mt-2">
                                    {product.is_active ? 'Activo' : 'Inactivo'}
                                </Badge>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            <ProductEditor
                product={editingProduct}
                open={editorOpen}
                onOpenChange={setEditorOpen}
                onSave={handleSave}
            />
        </div>
    )
}
