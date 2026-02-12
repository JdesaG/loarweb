import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
    'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer',
    {
        variants: {
            variant: {
                default: 'bg-neutral-900 text-white hover:bg-neutral-800 shadow-md hover:shadow-lg',
                destructive: 'bg-red-600 text-white hover:bg-red-700 shadow-md',
                outline: 'border-2 border-neutral-300 bg-white text-neutral-900 hover:bg-neutral-50 hover:border-neutral-400',
                secondary: 'bg-neutral-100 text-neutral-900 hover:bg-neutral-200',
                ghost: 'hover:bg-neutral-100 text-neutral-700',
                link: 'text-neutral-900 underline-offset-4 hover:underline',
                brand: 'bg-gradient-to-r from-neutral-900 to-neutral-700 text-white hover:from-neutral-800 hover:to-neutral-600 shadow-lg hover:shadow-xl',
            },
            size: {
                default: 'h-11 px-5 py-2',
                sm: 'h-9 rounded-md px-3 text-xs',
                lg: 'h-12 rounded-lg px-8 text-base',
                xl: 'h-14 rounded-xl px-10 text-lg',
                icon: 'h-10 w-10',
            },
        },
        defaultVariants: {
            variant: 'default',
            size: 'default',
        },
    }
)

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
    asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, asChild = false, ...props }, ref) => {
        const Comp = asChild ? Slot : 'button'
        return (
            <Comp
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                {...props}
            />
        )
    }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
