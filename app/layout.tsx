import type { Metadata } from 'next'
import './globals.css'
import { ErrorToast } from '@/components/shared/ErrorToast'

export const metadata: Metadata = {
  title: 'LOAR — Personalización de Prendas',
  description: 'Plataforma de personalización de prendas LOAR. Diseña tu estilo único.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-neutral-50 antialiased">
        {children}
        <ErrorToast />
      </body>
    </html>
  )
}
