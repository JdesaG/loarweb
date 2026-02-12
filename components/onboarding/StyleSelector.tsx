'use client'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'

interface StyleSelectorProps {
    styles: string[]
    value: string
    onChange: (value: string) => void
    disabled?: boolean
}

export function StyleSelector({ styles, value, onChange, disabled }: StyleSelectorProps) {
    if (styles.length === 0) return null

    return (
        <div className="space-y-2">
            <Label>Estilo</Label>
            <Select value={value} onValueChange={onChange} disabled={disabled}>
                <SelectTrigger>
                    <SelectValue placeholder="Selecciona un estilo" />
                </SelectTrigger>
                <SelectContent>
                    {styles.map((style) => (
                        <SelectItem key={style} value={style}>
                            {style}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    )
}
