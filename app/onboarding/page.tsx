
'use client'

import { useProducts } from "@/hooks/useProducts"
import { ProductCard } from "@/components/onboarding/ProductCard"
import { LoadingSpinner } from "@/components/shared/LoadingSpinner" // Need to create shared
import { Input } from "@/components/ui/input"
import { useState } from "react"

export default function CatalogPage() {
    const { products, loading, error } = useProducts()
    const [search, setSearch] = useState('')

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase())
    )

    if (loading) return <div className="p-8 text-center">Cargando catálogo...</div> // Placeholder for spinner
    if (error) return <div className="p-8 text-center text-red-500">Error: {error}</div>

    return (
        <div className="container mx-auto py-8">
            <h1 className="mb-6 text-3xl font-bold">Catálogo de Productos</h1>

            <div className="mb-8 max-w-md">
                <Input
                    placeholder="Buscar productos..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </div>
    )
}
