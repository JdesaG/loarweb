
'use client'

import { createBrowserSupabaseClient } from "@/lib/supabase"
import { Product } from "@/types"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { LoadingSpinner } from "@/components/shared/LoadingSpinner"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table" // Assuming table exists or I use HTML table
import Image from "next/image"

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)
    const supabase = createBrowserSupabaseClient()

    useEffect(() => {
        fetchProducts()
    }, [])

    async function fetchProducts() {
        setLoading(true)
        const { data } = await supabase
            .from('products')
            .select('*')
            .order('created_at', { ascending: false })

        if (data) setProducts(data)
        setLoading(false)
    }

    if (loading) return <LoadingSpinner />

    return (
        <div className="container mx-auto py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Products</h1>
                <Button>Add Product</Button>
            </div>

            <div className="rounded-md border">
                <div className="w-full overflow-auto">
                    <table className="w-full caption-bottom text-sm text-left">
                        <thead className="[&_tr]:border-b">
                            <tr className="border-b transition-colors hover:bg-muted/50">
                                <th className="h-12 px-4 align-middle font-medium">Image</th>
                                <th className="h-12 px-4 align-middle font-medium">Name</th>
                                <th className="h-12 px-4 align-middle font-medium">Base Price</th>
                                <th className="h-12 px-4 align-middle font-medium">Status</th>
                                <th className="h-12 px-4 align-middle font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="[&_tr:last-child]:border-0">
                            {products.map((product) => (
                                <tr key={product.id} className="border-b transition-colors hover:bg-muted/50">
                                    <td className="p-4 align-middle">
                                        {product.images?.[0] && (
                                            <div className="relative h-10 w-10">
                                                <Image src={product.images[0]} alt={product.name} fill className="object-cover rounded" />
                                            </div>
                                        )}
                                    </td>
                                    <td className="p-4 align-middle font-medium">{product.name}</td>
                                    <td className="p-4 align-middle">${product.base_price}</td>
                                    <td className="p-4 align-middle">
                                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${product.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                            {product.is_active ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="p-4 align-middle">
                                        <Button variant="ghost" size="sm">Edit</Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
