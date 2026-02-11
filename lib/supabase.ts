
import { createBrowserClient } from '@supabase/ssr'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { Database } from './database.types'

// Client for Browser Integration (Client Components)
export const createBrowserSupabaseClient = () =>
    createBrowserClient<Database>(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

// Client for Server-Side Admin Operations (API Routes, Service Role)
// WARNING: Bypasses RLS policies. Use with caution.
export const supabaseAdmin = createSupabaseClient<Database>(
    process.env.SUPABASE_URL!, // Use non-public env var
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
        },
    }
)
