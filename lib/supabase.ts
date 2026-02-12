import { createBrowserClient } from '@supabase/ssr'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import type { Database } from './database.types'

// ─── Browser Client (anon key) ───────────────────────────────────────────────
// Safe for client components. Respects RLS policies.
export const createBrowserSupabaseClient = () =>
  createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

// ─── Server Admin Client (service role key) ─────────────────────────────────
// ⚠️  Bypasses RLS — use ONLY in API routes / server actions.
// Never import this in client components.
// Lazy-initialized to avoid build-time errors when env vars are placeholders.
let _supabaseAdmin: ReturnType<typeof createSupabaseClient<Database>> | null = null

export const getSupabaseAdmin = () => {
  if (!_supabaseAdmin) {
    _supabaseAdmin = createSupabaseClient<Database>(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    )
  }
  return _supabaseAdmin
}

// Convenience alias — call as supabaseAdmin() in API routes
export const supabaseAdmin = getSupabaseAdmin
