'use client'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'

interface DesignTypeSelectorProps {
    designTypes: string[]
    value: string
    onChange: (value: string) => void
    disabled?: boolean
}

export function DesignTypeSelector({ designTypes, value, onChange, disabled }: DesignTypeSelectorProps) {
    if (designTypes.length === 0) return null

    return (
        <div className="space-y-2">
            <Label>Tipo de Diseño</Label>
            <Select value={value} onValueChange={onChange} disabled={disabled}>
                <SelectTrigger>
                    <SelectValue placeholder="Tipo de diseño" />
                </SelectTrigger>
                <SelectContent>
                    {designTypes.map((dt) => (
                        <SelectItem key={dt} value={dt}>
                            {dt}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    )
}
