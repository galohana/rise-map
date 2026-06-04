/*
  RISE admin API — server-side only.

  Security model:
  - The Supabase service_role key lives ONLY here (process.env.SUPABASE_SERVICE_KEY),
    never shipped to the browser. It bypasses RLS, so all writes go through this gate.
  - Every request must carry the admin password in the `x-admin-password` header,
    compared in constant time against process.env.ADMIN_PASSWORD.
  - Only a whitelisted set of columns can be written — no arbitrary field injection.

  Methods:
    GET    → list all studios (incl. inactive)
    POST   → create a studio
    PUT    → update a studio (body.id required)
    DELETE → delete a studio (body.id or ?id= required)
*/
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
const SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD

const WRITABLE = [
  'business_name', 'slug', 'city', 'region', 'address',
  'lat', 'lng', 'type', 'url', 'logo_url', 'phone',
  'rating', 'active', 'emoji', 'owner_name', 'years_experience',
]

function safeEqual(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string') return false
  if (a.length !== b.length) return false
  let r = 0
  for (let i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i)
  return r === 0
}

function toSlug(name) {
  const base = String(name || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9֐-׿]+/g, '-') // keep latin, digits, Hebrew
    .replace(/^-+|-+$/g, '')
    .replace(/[֐-׿]/g, '')          // drop Hebrew from the URL slug
    .replace(/^-+|-+$/g, '')
  const rand = Math.random().toString(36).slice(2, 7)
  return (base ? `${base}-${rand}` : `studio-${rand}`).slice(0, 60)
}

/** Whitelist + coerce types from a raw body. */
function sanitize(body) {
  const out = {}
  for (const k of WRITABLE) {
    if (body[k] === undefined) continue
    let v = body[k]
    if (k === 'lat' || k === 'lng' || k === 'rating') {
      v = v === '' || v === null ? null : Number(v)
      if (v !== null && Number.isNaN(v)) v = null
    } else if (k === 'years_experience') {
      v = v === '' || v === null ? null : parseInt(v, 10)
      if (v !== null && Number.isNaN(v)) v = null
    } else if (k === 'active') {
      v = v === true || v === 'true' || v === 1 || v === '1'
    } else if (typeof v === 'string') {
      v = v.trim()
      if (v === '') v = null
    }
    out[k] = v
  }
  return out
}

export default async function handler(req, res) {
  // ── Auth gate ──
  const pw = req.headers['x-admin-password']
  if (!ADMIN_PASSWORD || !safeEqual(String(pw || ''), ADMIN_PASSWORD)) {
    return res.status(401).json({ error: 'unauthorized' })
  }
  if (!SUPABASE_URL || !SERVICE_KEY) {
    return res.status(500).json({ error: 'server not configured' })
  }

  const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  })

  const body = typeof req.body === 'string'
    ? (() => { try { return JSON.parse(req.body) } catch { return {} } })()
    : (req.body || {})

  try {
    if (req.method === 'GET') {
      const { data, error } = await supabase
        .from('rise_directory')
        .select('*')
        .order('created_at', { ascending: true })
      if (error) throw error
      return res.status(200).json({ data })
    }

    if (req.method === 'POST') {
      const payload = sanitize(body)
      if (!payload.business_name) return res.status(400).json({ error: 'business_name required' })
      if (!payload.slug) payload.slug = toSlug(payload.business_name)
      if (payload.active === undefined) payload.active = true
      const { data, error } = await supabase
        .from('rise_directory')
        .insert(payload)
        .select()
        .single()
      if (error) throw error
      return res.status(200).json({ data })
    }

    if (req.method === 'PUT') {
      const id = body.id
      if (!id) return res.status(400).json({ error: 'id required' })
      const payload = sanitize(body)
      delete payload.id
      const { data, error } = await supabase
        .from('rise_directory')
        .update(payload)
        .eq('id', id)
        .select()
        .single()
      if (error) throw error
      return res.status(200).json({ data })
    }

    if (req.method === 'DELETE') {
      const id = body.id || req.query.id
      if (!id) return res.status(400).json({ error: 'id required' })
      const { error } = await supabase.from('rise_directory').delete().eq('id', id)
      if (error) throw error
      return res.status(200).json({ ok: true })
    }

    res.setHeader('Allow', 'GET, POST, PUT, DELETE')
    return res.status(405).json({ error: 'method not allowed' })
  } catch (e) {
    return res.status(500).json({ error: e?.message || 'server error' })
  }
}
