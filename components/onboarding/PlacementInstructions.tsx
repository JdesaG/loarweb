'use client'

import { Label } from '@/components/ui/label'

interface PlacementInstructionsProps {
    value: string
    onChange: (value: string) => void
}

export function PlacementInstructions({ value, onChange }: PlacementInstructionsProps) {
    return (
        <div className="space-y-2">
            <Label>Instrucciones de ubicación (opcional)</Label>
            <textarea
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="Ej: Centrado en el pecho, tamaño 15cm, lado izquierdo..."
                rows={3}
                className="flex w-full rounded-lg border border-neutral-300 bg-white px-4 py-3 text-sm text-neutral-900 shadow-sm transition-colors placeholder:text-neutral-400 focus:border-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-200 resize-none"
            />
        </div>
    )
}
