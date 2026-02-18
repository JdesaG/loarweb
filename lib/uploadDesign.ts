'use client'

import { createBrowserSupabaseClient } from '@/lib/supabase'

const BUCKET = 'designs'

/**
 * Uploads a design image to Supabase Storage and returns the public URL.
 * Falls back to the base64 preview if upload fails.
 */
export async function uploadDesignImage(
    file: File,
    fallbackBase64: string | null
): Promise<string | null> {
    if (!file) return fallbackBase64

    try {
        const supabase = createBrowserSupabaseClient()

        // Generate a unique filename: timestamp_random.extension
        const ext = file.name.split('.').pop() || 'png'
        const fileName = `${Date.now()}_${Math.random().toString(36).slice(2, 8)}.${ext}`
        const filePath = `orders/${fileName}`

        const { error } = await supabase.storage
            .from(BUCKET)
            .upload(filePath, file, {
                cacheControl: '3600',
                upsert: false,
            })

        if (error) {
            console.error('[uploadDesign] Upload failed:', error.message)
            return fallbackBase64
        }

        // Get public URL
        const { data: urlData } = supabase.storage
            .from(BUCKET)
            .getPublicUrl(filePath)

        return urlData.publicUrl
    } catch (err) {
        console.error('[uploadDesign] Unexpected error:', err)
        return fallbackBase64
    }
}
