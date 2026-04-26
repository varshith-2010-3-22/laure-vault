import { createClient } from '@supabase/supabase-js'

// Check for placeholder strings so creating the client doesn't fatally crash
const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_URL.startsWith('http')
        ? process.env.NEXT_PUBLIC_SUPABASE_URL
        : 'https://placeholder.supabase.co'

const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? 'no-key-provided'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
