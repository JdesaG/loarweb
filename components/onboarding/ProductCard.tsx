'use client'

import Link from 'next/link'
import Image from 'next/image'
import type { Product } from '@/types'

interface ProductCardProps {
    product: Product
    executionId?: string | null
}

export function ProductCard({ product, executionId }: ProductCardProps) {
    return (
        <Link href={`/onboarding/${product.id}${executionId ? `?executionId=${executionId}` : ''}`} className="group block">
            <div className="relative aspect-square overflow-hidden rounded-xl bg-neutral-100 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-neutral-200/50">
                {product.base_image ? (
                    <Image
                        src={product.base_image}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    />
                ) : (
                    <div className="flex h-full items-center justify-center">
                        <span className="text-5xl">📦</span>
                    </div>
                )}
                {/* Gradient overlay */}
                <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            <div className="mt-2 px-1">
                <h3 className="text-sm font-semibold text-neutral-900 truncate">
                    {product.name}
                </h3>
                {product.category && (
                    <p className="text-xs text-neutral-500">{product.category}</p>
                )}
            </div>
        </Link>
    )
}
