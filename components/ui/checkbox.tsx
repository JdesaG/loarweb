'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { Check } from 'lucide-react'

interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange'> {
    checked?: boolean
    onCheckedChange?: (checked: boolean) => void
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
    ({ className, checked, onCheckedChange, id, ...props }, ref) => {
        return (
            <button
                type="button"
                role="checkbox"
                aria-checked={checked}
                id={id}
                onClick={() => onCheckedChange?.(!checked)}
                className={cn(
                    'peer h-5 w-5 shrink-0 rounded border border-neutral-300 ring-offset-white transition-all',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-2',
                    'disabled:cursor-not-allowed disabled:opacity-50',
                    checked
                        ? 'bg-neutral-900 border-neutral-900 text-white'
                        : 'bg-white',
                    className
                )}
            >
                {checked && <Check className="h-3.5 w-3.5 mx-auto" />}
                <input
                    type="checkbox"
                    ref={ref}
                    checked={checked}
                    onChange={() => onCheckedChange?.(!checked)}
                    className="sr-only"
                    {...props}
                />
            </button>
        )
    }
)
Checkbox.displayName = 'Checkbox'

export { Checkbox }
