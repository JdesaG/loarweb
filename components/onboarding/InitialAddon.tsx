
import { useConfiguratorStore } from "@/stores/configuratorStore"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { useState } from "react"

export function InitialAddon() {
    const { configuration, updateConfiguration } = useConfiguratorStore()
    const [enabled, setEnabled] = useState(!!configuration.customText)

    const handleToggle = (checked: boolean) => {
        setEnabled(checked)
        if (!checked) {
            updateConfiguration({ customText: undefined })
        }
    }

    return (
        <div className="space-y-4 rounded-md border p-4">
            <div className="flex items-center space-x-2">
                <Checkbox
                    id="initials"
                    checked={enabled}
                    onChange={(e) => handleToggle(e.target.checked)} // Native checkbox uses onChange
                />
                <Label htmlFor="initials">Agregar Iniciales (+$50)</Label>
            </div>

            {enabled && (
                <div className="pl-6">
                    <Label htmlFor="customText">Texto / Iniciales</Label>
                    <Input
                        id="customText"
                        maxLength={5}
                        placeholder="ABC"
                        className="mt-1"
                        value={configuration.customText || ''}
                        onChange={(e) => updateConfiguration({ customText: e.target.value })}
                    />
                </div>
            )}
        </div>
    )
}
