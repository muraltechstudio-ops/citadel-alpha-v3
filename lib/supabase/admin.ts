import { createClient as createSupabaseClient } from '@supabase/supabase-js'

export const supabaseAdmin = createSupabaseClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://missing.supabase.co",
  process.env.SUPABASE_SERVICE_ROLE_KEY || "missing",
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
)
