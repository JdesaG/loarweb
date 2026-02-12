'use client'

import Image from 'next/image'
import Link from 'next/link'
import type { Product } from '@/types'
import { formatCurrency } from '@/lib/utils'
import { Card } from '@/components/ui/card'

interface ProductCardProps {
    product: Product
}

export function ProductCard({ product }: ProductCardProps) {
    const imageUrl = product.images?.[0]

    return (
        <Link href={`/onboarding/${product.id}`}>
            <Card className="group overflow-hidden cursor-pointer border-neutral-200 hover:border-neutral-400 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                {/* Image */}
                <div className="relative aspect-square overflow-hidden bg-neutral-100">
                    {imageUrl ? (
                        <Image
                            src={imageUrl}
                            alt={product.name}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        />
                    ) : (
                        <div className="flex h-full items-center justify-center">
                            <span className="text-4xl text-neutral-300">📦</span>
                        </div>
                    )}
                    {/* Overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <span className="inline-block rounded-full bg-white/90 backdrop-blur-sm px-3 py-1 text-xs font-medium text-neutral-900">
                            Personalizar →
                        </span>
                    </div>
                </div>

                {/* Info */}
                <div className="p-4">
                    <h3 className="font-semibold text-neutral-900 text-sm line-clamp-2 group-hover:text-neutral-700 transition-colors">
                        {product.name}
                    </h3>
                    {product.description && (
                        <p className="mt-1 text-xs text-neutral-500 line-clamp-1">{product.description}</p>
                    )}
                    <p className="mt-2 text-base font-bold text-neutral-900">
                        {formatCurrency(product.base_price)}
                    </p>
                </div>
            </Card>
        </Link>
    )
}
