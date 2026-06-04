import { createClient } from '@supabase/supabase-js'

/*
  Server-side data access for public reads.
  Uses the anon key (public SELECT is allowed by RLS only where active = true).
  Never imports the service key — writes go through /api/admin.
*/
const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
const anonKey = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

function client() {
  return createClient(url, anonKey, { auth: { persistSession: false } })
}

/** All active studios, ordered by name. Returns [] on error. */
export async function getStudios() {
  try {
    const { data, error } = await client()
      .from('rise_directory')
      .select('*')
      .eq('active', true)
      .order('business_name')
    if (error) throw error
    return data ?? []
  } catch {
    return []
  }
}

/** One active studio by slug, or null. */
export async function getStudioBySlug(slug) {
  try {
    const { data, error } = await client()
      .from('rise_directory')
      .select('*')
      .eq('slug', slug)
      .eq('active', true)
      .single()
    if (error) throw error
    return data
  } catch {
    return null
  }
}
