
import { CartButton } from "@/components/onboarding/CartButton"

export default function OnboardingLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen bg-background font-sans antialiased">
            <nav className="border-b p-4">
                <div className="container mx-auto flex justify-between items-center">
                    <div className="font-bold text-xl">LOAR</div>
                    {/* Add standard nav items if needed */}
                </div>
            </nav>
            <main>
                {children}
            </main>
            <CartButton />
        </div>
    )
}
