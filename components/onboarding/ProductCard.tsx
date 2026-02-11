
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Product } from '@/types'
import Link from 'next/link'
import Image from 'next/image'

interface ProductCardProps {
    product: Product
}

export function ProductCard({ product }: ProductCardProps) {
    return (
        <Card className="overflow-hidden">
            <div className="relative aspect-square w-full">
                {product.images && product.images[0] ? (
                    <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform hover:scale-105"
                    />
                ) : (
                    <div className="bg-muted flex h-full w-full items-center justify-center text-muted-foreground">
                        No Image
                    </div>
                )}
            </div>
            <CardHeader>
                <CardTitle>{product.name}</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="line-clamp-2 text-sm text-muted-foreground">
                    {product.description}
                </p>
                <p className="mt-2 font-bold text-lg">
                    From {new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(product.base_price)}
                </p>
            </CardContent>
            <CardFooter>
                <Button asChild className="w-full">
                    <Link href={`/onboarding/${product.id}`}>Personalizar</Link>
                </Button>
            </CardFooter>
        </Card>
    )
}
