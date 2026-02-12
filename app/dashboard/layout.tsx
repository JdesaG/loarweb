'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useSupabase } from '@/hooks/supabase'
import { Button } from '@/components/ui/button'
import {
    LayoutDashboard,
    Package,
    ShoppingCart,
    Boxes,
    LogOut,
    Menu,
    X,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useState } from 'react'
import { toast } from 'sonner'

const NAV_ITEMS = [
    { href: '/dashboard', label: 'Resumen', icon: LayoutDashboard },
    { href: '/dashboard/orders', label: 'Pedidos', icon: ShoppingCart },
    { href: '/dashboard/inventory', label: 'Inventario', icon: Boxes },
    { href: '/dashboard/products', label: 'Productos', icon: Package },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()
    const router = useRouter()
    const supabase = useSupabase()
    const [sidebarOpen, setSidebarOpen] = useState(false)

    // Don't show layout on the login page
    if (pathname === '/dashboard/login') {
        return <>{children}</>
    }

    const handleLogout = async () => {
        await supabase.auth.signOut()
        toast.success('Sesión cerrada')
        router.push('/dashboard/login')
    }

    return (
        <div className="flex min-h-screen bg-neutral-50">
            {/* Sidebar overlay (mobile) */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/40 md:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={cn(
                    'fixed inset-y-0 left-0 z-50 w-60 bg-neutral-900 text-white transform transition-transform duration-200 md:relative md:translate-x-0',
                    sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                )}
            >
                <div className="flex h-full flex-col">
                    {/* Logo */}
                    <div className="flex items-center justify-between px-5 py-5">
                        <Link href="/dashboard" className="text-xl font-extrabold tracking-tight">
                            LOAR
                        </Link>
                        <button
                            className="md:hidden text-white/70 hover:text-white"
                            onClick={() => setSidebarOpen(false)}
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    {/* Nav */}
                    <nav className="flex-1 px-3 space-y-1">
                        {NAV_ITEMS.map((item) => {
                            const isActive = pathname === item.href
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setSidebarOpen(false)}
                                    className={cn(
                                        'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                                        isActive
                                            ? 'bg-white/15 text-white'
                                            : 'text-white/60 hover:bg-white/10 hover:text-white'
                                    )}
                                >
                                    <item.icon className="h-4 w-4" />
                                    {item.label}
                                </Link>
                            )
                        })}
                    </nav>

                    {/* Logout */}
                    <div className="p-3">
                        <button
                            onClick={handleLogout}
                            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white/60 hover:bg-white/10 hover:text-white transition-colors"
                        >
                            <LogOut className="h-4 w-4" />
                            Cerrar sesión
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Top bar */}
                <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-neutral-200 bg-white px-4 py-3 md:px-6">
                    <button
                        className="md:hidden text-neutral-700"
                        onClick={() => setSidebarOpen(true)}
                    >
                        <Menu className="h-5 w-5" />
                    </button>
                    <div className="flex-1" />
                    <Link href="/onboarding">
                        <Button variant="outline" size="sm">
                            Ver tienda
                        </Button>
                    </Link>
                </header>

                {/* Content */}
                <main className="flex-1 p-4 md:p-6">
                    {children}
                </main>
            </div>
        </div>
    )
}
