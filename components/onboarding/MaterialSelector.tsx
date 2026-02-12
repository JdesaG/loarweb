'use client'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'

interface MaterialSelectorProps {
    materials: string[]
    value: string
    onChange: (value: string) => void
    disabled?: boolean
}

export function MaterialSelector({ materials, value, onChange, disabled }: MaterialSelectorProps) {
    if (materials.length === 0) return null

    return (
        <div className="space-y-2">
            <Label>Material</Label>
            <Select value={value} onValueChange={onChange} disabled={disabled}>
                <SelectTrigger>
                    <SelectValue placeholder="Selecciona material" />
                </SelectTrigger>
                <SelectContent>
                    {materials.map((mat) => (
                        <SelectItem key={mat} value={mat}>
                            {mat}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    )
}
