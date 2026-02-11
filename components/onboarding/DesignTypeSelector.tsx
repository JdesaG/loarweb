
import { useConfiguratorStore } from "@/stores/configuratorStore"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const designTypes = [
    { id: 'print', name: 'Impresión Digital' },
    { id: 'embroidery', name: 'Bordado' },
    { id: 'sublimation', name: 'Sublimación' },
]

export function DesignTypeSelector() {
    const { configuration, updateConfiguration } = useConfiguratorStore()

    return (
        <div className="space-y-3">
            <Label>Técnica de Diseño</Label>
            <div className="flex gap-4">
                {designTypes.map((type) => (
                    <button
                        key={type.id}
                        type="button"
                        className={`rounded-md border px-4 py-2 text-sm ${configuration.designType === type.id
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-background hover:bg-accent'
                            }`}
                        onClick={() => updateConfiguration({ designType: type.id })}
                    >
                        {type.name}
                    </button>
                ))}
            </div>
        </div>
    )
}
