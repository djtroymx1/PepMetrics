import { createBrowserClient } from '@supabase/ssr'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'

// Reuse a single browser client instance to avoid recreating it on every render.
let supabase: SupabaseClient<Database> | null = null

export function createClient() {
  if (!supabase) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Missing Supabase environment variables')
    }

    supabase = createBrowserClient<Database>(
      supabaseUrl,
      supabaseAnonKey
    )
  }

  return supabase
}
