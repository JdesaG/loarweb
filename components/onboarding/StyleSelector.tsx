
import { Label } from "@/components/ui/label"
import { useConfiguratorStore } from "@/stores/configuratorStore"

// Mock styles - replace with actual logic/data if needed or passed as props
const styles = [
    { id: 'standard', name: 'Standard Fit' },
    { id: 'slim', name: 'Slim Fit' },
    { id: 'oversized', name: 'Oversized' },
]

export function StyleSelector() {
    const { configuration, updateConfiguration } = useConfiguratorStore()

    return (
        <div className="space-y-3">
            <Label>Estilo</Label>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                {styles.map((style) => (
                    <div
                        key={style.id}
                        onClick={() => updateConfiguration({ style: style.id })}
                        className={`cursor-pointer rounded-lg border p-4 text-center hover:bg-accent ${configuration.style === style.id ? 'border-primary ring-2 ring-primary' : ''
                            }`}
                    >
                        {style.name}
                    </div>
                ))}
            </div>
        </div>
    )
}
