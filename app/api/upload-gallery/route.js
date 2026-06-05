/*
  Gallery image upload — same auth pattern as upload-logo.
  Stores files in the 'logos' bucket under a 'gallery/' prefix.
  Returns the public URL.
*/
import { createClient } from '@supabase/supabase-js'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD
const BUCKET = 'logos'

function safeEqual(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string') return false
  if (a.length !== b.length) return false
  let r = 0
  for (let i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i)
  return r === 0
}

export async function POST(request) {
  const pw = request.headers.get('x-admin-password')
  if (!ADMIN_PASSWORD || !safeEqual(String(pw || ''), ADMIN_PASSWORD)) {
    return Response.json({ error: 'unauthorized' }, { status: 401 })
  }
  if (!SUPABASE_URL || !SERVICE_KEY) {
    return Response.json({ error: 'server not configured' }, { status: 500 })
  }

  let form
  try { form = await request.formData() } catch { return Response.json({ error: 'bad form' }, { status: 400 }) }
  const file = form.get('file')
  if (!file || typeof file === 'string') return Response.json({ error: 'no file' }, { status: 400 })
  if (file.size > 5 * 1024 * 1024) return Response.json({ error: 'הקובץ גדול מדי (מקסימום 5MB)' }, { status: 400 })
  if (!String(file.type).startsWith('image/')) return Response.json({ error: 'יש להעלות תמונה' }, { status: 400 })

  const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  })

  const ext = (file.name?.split('.').pop() || 'jpg').toLowerCase().replace(/[^a-z0-9]/g, '')
  const path = `gallery/${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}.${ext}`
  const buffer = Buffer.from(await file.arrayBuffer())

  const { error } = await supabase.storage.from(BUCKET).upload(path, buffer, {
    contentType: file.type,
    upsert: false,
  })
  if (error) return Response.json({ error: error.message }, { status: 500 })

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path)
  return Response.json({ url: data.publicUrl })
}
