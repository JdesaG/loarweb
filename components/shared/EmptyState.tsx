import { PackageOpen } from 'lucide-react'
import { cn } from '@/lib/utils'

interface EmptyStateProps {
    title: string
    description?: string
    icon?: React.ReactNode
    className?: string
    children?: React.ReactNode
}

export function EmptyState({ title, description, icon, className, children }: EmptyStateProps) {
    return (
        <div className={cn('flex flex-col items-center justify-center py-16 px-4 text-center', className)}>
            <div className="mb-4 rounded-full bg-neutral-100 p-4">
                {icon ?? <PackageOpen className="h-8 w-8 text-neutral-400" />}
            </div>
            <h3 className="text-lg font-semibold text-neutral-700">{title}</h3>
            {description && (
                <p className="mt-1 max-w-sm text-sm text-neutral-500">{description}</p>
            )}
            {children && <div className="mt-4">{children}</div>}
        </div>
    )
}
