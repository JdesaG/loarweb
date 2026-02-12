'use client'

import { useEffect, useState } from 'react'
import { useProducts } from '@/hooks/useProducts'
import { ProductEditor } from '@/components/dashboard/ProductEditor'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { EmptyState } from '@/components/shared/EmptyState'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Image from 'next/image'
import { Edit3, Package } from 'lucide-react'
import { toast } from 'sonner'
import type { Product } from '@/types'

export default function ProductsPage() {
    const { products, loading, refetch } = useProducts()
    const [editingProduct, setEditingProduct] = useState<Product | null>(null)
    const [editorOpen, setEditorOpen] = useState(false)

    const handleSave = async (id: string, data: Partial<Product>) => {
        try {
            const res = await fetch(`/api/products/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            })
            if (!res.ok) throw new Error('Failed to update')
            toast.success('Producto actualizado')
            refetch()
        } catch {
            toast.error('Error al actualizar')
        }
    }

    if (loading) return <LoadingSpinner className="py-20" text="Cargando productos..." />

    if (products.length === 0) {
        return <EmptyState title="Sin productos" description="Agrega productos desde Supabase." icon={<Package className="h-8 w-8 text-neutral-400" />} />
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-neutral-900">Productos</h1>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {products.map((product) => (
                    <div key={product.id} className="group relative rounded-xl border border-neutral-200 bg-white p-4 transition-all hover:shadow-md">
                        <div className="relative mb-3 aspect-square overflow-hidden rounded-lg bg-neutral-100">
                            {product.base_image ? (
                                <Image
                                    src={product.base_image}
                                    alt={product.name}
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                />
                            ) : (
                                <div className="flex h-full items-center justify-center text-4xl text-neutral-300">📦</div>
                            )}
                        </div>

                        <div className="space-y-1">
                            <div className="flex items-center justify-between">
                                <h3 className="font-semibold text-neutral-900 truncate">{product.name}</h3>
                                {!product.is_active && (
                                    <Badge variant="secondary" className="text-[10px]">Inactivo</Badge>
                                )}
                            </div>
                            {product.category && (
                                <p className="text-xs text-neutral-500">{product.category}</p>
                            )}
                            {product.sku && (
                                <p className="text-xs text-neutral-400 font-mono">SKU: {product.sku}</p>
                            )}

                            <div className="flex flex-wrap gap-1 pt-1">
                                {product.available_colors && product.available_colors.length > 0 && (
                                    <span className="text-[10px] text-neutral-500 bg-neutral-100 rounded-full px-2 py-0.5">
                                        {product.available_colors.length} colores
                                    </span>
                                )}
                                {product.available_sizes && product.available_sizes.length > 0 && (
                                    <span className="text-[10px] text-neutral-500 bg-neutral-100 rounded-full px-2 py-0.5">
                                        {product.available_sizes.length} tallas
                                    </span>
                                )}
                                {product.available_materials && product.available_materials.length > 0 && (
                                    <span className="text-[10px] text-neutral-500 bg-neutral-100 rounded-full px-2 py-0.5">
                                        {product.available_materials.length} materiales
                                    </span>
                                )}
                            </div>
                        </div>

                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 backdrop-blur-sm"
                            onClick={() => {
                                setEditingProduct(product)
                                setEditorOpen(true)
                            }}
                        >
                            <Edit3 className="h-4 w-4" />
                        </Button>
                    </div>
                ))}
            </div>

            <ProductEditor
                product={editingProduct}
                open={editorOpen}
                onOpenChange={setEditorOpen}
                onSave={handleSave}
            />
        </div>
    )
}
