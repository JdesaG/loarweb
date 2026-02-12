import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, Sparkles } from 'lucide-react'

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="text-center max-w-2xl mx-auto space-y-8">
        {/* Logo / Brand */}
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full bg-neutral-100 px-4 py-1.5 text-sm text-neutral-600">
            <Sparkles className="h-4 w-4" />
            Personalización única
          </div>
          <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight text-neutral-900">
            LOAR
          </h1>
          <p className="text-lg text-neutral-500 max-w-md mx-auto">
            Diseña tus prendas personalizadas. Calidad premium con tu estilo.
          </p>
        </div>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/onboarding">
            <Button variant="brand" size="xl">
              Ver catálogo
              <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
          <Link href="/dashboard/login">
            <Button variant="outline" size="lg">
              Panel de administración
            </Button>
          </Link>
        </div>
      </div>
    </main>
  )
}
