
import { Button } from "@/components/ui/button"
import { useCartStore } from "@/stores/cartStore"
import { ShoppingCart } from "lucide-react"
import Link from "next/link"

export function CartButton() {
    const { items } = useCartStore()
    const count = items.reduce((acc, item) => acc + item.quantity, 0)

    if (count === 0) return null

    return (
        <Button asChild className="fixed bottom-4 right-4 z-50 rounded-full h-14 w-14 shadow-lg" size="icon">
            <Link href="/onboarding/checkout">
                <ShoppingCart className="h-6 w-6" />
                <span className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                    {count}
                </span>
            </Link>
        </Button>
    )
}
