
import { useConfiguratorStore } from "@/stores/configuratorStore"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export function PlacementInstructions() {
    const { configuration, updateConfiguration } = useConfiguratorStore()

    return (
        <div className="space-y-2">
            <Label htmlFor="placement">Instrucciones de Colocación</Label>
            <Textarea
                id="placement"
                placeholder="Describe dónde quieres tu diseño (ej. Pecho izquierdo, Espalda centrada...)"
                value={configuration.placement || ''}
                onChange={(e) => updateConfiguration({ placement: e.target.value })}
            />
        </div>
    )
}
