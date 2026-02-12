'use client'

import { Toaster } from 'sonner'

export function ErrorToast() {
    return (
        <Toaster
            position="top-right"
            richColors
            closeButton
            toastOptions={{
                style: {
                    fontFamily: 'inherit',
                },
            }}
        />
    )
}
