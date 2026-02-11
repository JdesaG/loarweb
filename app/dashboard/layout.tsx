
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex min-h-screen flex-col md:flex-row">
            <aside className="w-full md:w-64 border-r bg-muted/40">
                <div className="p-6 border-b">
                    <h2 className="text-xl font-bold">LOAR Admin</h2>
                </div>
                <nav className="flex flex-col gap-2 p-4">
                    <Button asChild variant="ghost" className="justify-start">
                        <Link href="/dashboard">Overview</Link>
                    </Button>
                    <Button asChild variant="ghost" className="justify-start">
                        <Link href="/dashboard/orders">Orders</Link>
                    </Button>
                    <Button asChild variant="ghost" className="justify-start">
                        <Link href="/dashboard/inventory">Inventory</Link>
                    </Button>
                    <Button asChild variant="ghost" className="justify-start">
                        <Link href="/dashboard/products">Products</Link>
                    </Button>
                </nav>
            </aside>
            <main className="flex-1 overflow-y-auto bg-background">
                {children}
            </main>
        </div>
    )
}
