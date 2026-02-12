'use client'

import { useCallback, useState } from 'react'
import { Upload, X } from 'lucide-react'
import Image from 'next/image'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

interface ImageUploaderProps {
    imagePreview: string | null
    onFileChange: (file: File | null, preview: string | null) => void
}

export function ImageUploader({ imagePreview, onFileChange }: ImageUploaderProps) {
    const [dragActive, setDragActive] = useState(false)

    const handleFile = useCallback(
        (file: File) => {
            if (!file.type.startsWith('image/')) return
            const reader = new FileReader()
            reader.onload = (e) => {
                onFileChange(file, e.target?.result as string)
            }
            reader.readAsDataURL(file)
        },
        [onFileChange]
    )

    const handleDrop = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault()
            setDragActive(false)
            const file = e.dataTransfer.files[0]
            if (file) handleFile(file)
        },
        [handleFile]
    )

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) handleFile(file)
    }

    const handleRemove = () => {
        onFileChange(null, null)
    }

    return (
        <div className="space-y-2">
            <Label>Imagen de diseño (opcional)</Label>
            {imagePreview ? (
                <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-neutral-200">
                    <Image src={imagePreview} alt="Preview" fill className="object-contain" />
                    <button
                        type="button"
                        onClick={handleRemove}
                        className="absolute top-2 right-2 rounded-full bg-red-500 p-1.5 text-white shadow-md hover:bg-red-600 transition-colors"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>
            ) : (
                <div
                    onDragOver={(e) => { e.preventDefault(); setDragActive(true) }}
                    onDragLeave={() => setDragActive(false)}
                    onDrop={handleDrop}
                    className={cn(
                        'relative flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-8 transition-colors cursor-pointer',
                        dragActive
                            ? 'border-neutral-500 bg-neutral-50'
                            : 'border-neutral-300 hover:border-neutral-400 hover:bg-neutral-50'
                    )}
                >
                    <Upload className="h-8 w-8 text-neutral-400" />
                    <p className="text-sm text-neutral-500">
                        Arrastra tu imagen o <span className="font-medium text-neutral-700">haz clic</span>
                    </p>
                    <p className="text-xs text-neutral-400">PNG, JPG, WEBP hasta 10MB</p>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleInputChange}
                        className="absolute inset-0 cursor-pointer opacity-0"
                    />
                </div>
            )}
        </div>
    )
}
