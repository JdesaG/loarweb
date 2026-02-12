'use client'

import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'

interface InitialAddonProps {
    hasInitial: boolean
    initialLetter: string
    onToggle: (checked: boolean) => void
    onLetterChange: (value: string) => void
}

export function InitialAddon({ hasInitial, initialLetter, onToggle, onLetterChange }: InitialAddonProps) {
    return (
        <div className="space-y-3">
            <div className="flex items-center gap-3">
                <input
                    type="checkbox"
                    id="initial-addon"
                    checked={hasInitial}
                    onChange={(e) => onToggle(e.target.checked)}
                    className="h-4 w-4 rounded border-neutral-300 text-neutral-900 focus:ring-neutral-500"
                />
                <Label htmlFor="initial-addon" className="cursor-pointer">
                    Agregar inicial personalizada
                </Label>
            </div>
            {hasInitial && (
                <Input
                    type="text"
                    maxLength={3}
                    value={initialLetter}
                    onChange={(e) => onLetterChange(e.target.value.toUpperCase())}
                    placeholder="Ej: A, JD"
                    className="max-w-24"
                />
            )}
        </div>
    )
}
