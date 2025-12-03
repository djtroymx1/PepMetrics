import { createBrowserClient } from '@supabase/ssr'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'

// Provide sane defaults so builds don't fail if env vars are missing at build time.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'https://hcxmxzxprltllxglesdy.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhjeG14enhwcmx0bGx4Z2xlc2R5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ3NDU2MTgsImV4cCI6MjA4MDMyMTYxOH0.-QNWO46PP5dw4INIHycmA-s6n1f4oy-apD0xeggBOho'

// Reuse a single browser client instance to avoid recreating it on every render.
let supabase: SupabaseClient<Database> | null = null

export function createClient() {
  if (!supabase) {
    supabase = createBrowserClient<Database>(
      supabaseUrl,
      supabaseAnonKey
    )
  }

  return supabase
}
