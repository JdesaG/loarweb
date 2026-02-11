
import { FolderOpen } from "lucide-react"

interface EmptyStateProps {
    title?: string
    description?: string
    children?: React.ReactNode
}

export function EmptyState({
    title = "No hay datos",
    description = "No se encontró información para mostrar aquí.",
    children
}: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center animate-in fade-in-50">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                <FolderOpen className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="mt-4 text-lg font-semibold">{title}</h3>
            <p className="mb-4 mt-2 text-sm text-muted-foreground max-w-sm">{description}</p>
            {children}
        </div>
    )
}
