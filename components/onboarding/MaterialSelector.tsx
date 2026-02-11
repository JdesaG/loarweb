
import { useConfiguratorStore } from "@/stores/configuratorStore"
import { Label } from "@/components/ui/label"

const materials = [
    { id: 'cotton', name: '100% Cotton' },
    { id: 'polyester', name: 'Polyester Blend' },
    { id: 'tri-blend', name: 'Tri-Blend' },
]

export function MaterialSelector() {
    const { configuration, updateConfiguration } = useConfiguratorStore()

    return (
        <div className="space-y-3">
            <Label>Material</Label>
            <div className="flex gap-4">
                {materials.map((mat) => (
                    <button
                        key={mat.id}
                        type="button"
                        className={`rounded-md border px-4 py-2 text-sm ${configuration.material === mat.id
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-background hover:bg-accent'
                            }`}
                        onClick={() => updateConfiguration({ material: mat.id })}
                    >
                        {mat.name}
                    </button>
                ))}
            </div>
        </div>
    )
}
