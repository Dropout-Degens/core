import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL
if (!supabaseUrl) throw new Error('SUPABASE_URL is not defined in the environment variables.')
const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY
if (!supabaseSecretKey) throw new Error('SUPABASE_SECRET_KEY is not defined in the environment variables.')

export const supabase = createClient(
    supabaseUrl,
    supabaseSecretKey,
    {

    }
)
