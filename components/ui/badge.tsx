import * as React from 'react'
import { cn } from '@/lib/utils'

const Badge = React.forwardRef<
    HTMLSpanElement,
    React.HTMLAttributes<HTMLSpanElement> & {
        variant?: 'default' | 'secondary' | 'destructive' | 'outline'
    }
>(({ className, variant = 'default', ...props }, ref) => {
    const variants = {
        default: 'bg-neutral-900 text-white',
        secondary: 'bg-neutral-100 text-neutral-800',
        destructive: 'bg-red-100 text-red-700',
        outline: 'border border-neutral-300 text-neutral-700',
    }

    return (
        <span
            ref={ref}
            className={cn(
                'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors',
                variants[variant],
                className
            )}
            {...props}
        />
    )
})
Badge.displayName = 'Badge'

export { Badge }
