/*
  RISE admin API — server-side only (Next.js Route Handler).

  Security:
  - Supabase service_role key lives ONLY here (SUPABASE_SERVICE_KEY), never in the browser.
  - Every request must carry the admin password in the `x-admin-password` header,
    compared in constant time against ADMIN_PASSWORD.
  - Only whitelisted columns can be written.
*/
import { createClient } from '@supabase/supabase-js'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD

const WRITABLE = [
  'business_name', 'slug', 'city', 'region', 'address',
  'lat', 'lng', 'type', 'url', 'logo_url', 'phone',
  'rating', 'active', 'emoji', 'owner_name', 'years_experience',
  'owner_age', 'specialty', 'custom_description',
  'facebook_url', 'instagram_url', 'google_url', 'whatsapp',
  'gallery_urls',
  'gallery_display_type',
  'is_accepting_clients',
  'opening_hours',
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
    .trim().toLowerCase()
    .replace(/[^a-z0-9֐-׿]+/g, '-')
    .replace(/[֐-׿]/g, '')
    .replace(/^-+|-+$/g, '')
  const rand = Math.random().toString(36).slice(2, 7)
  return (base ? `${base}-${rand}` : `studio-${rand}`).slice(0, 60)
}

function sanitize(body) {
  const out = {}
  for (const k of WRITABLE) {
    if (body[k] === undefined) continue
    let v = body[k]
    if (k === 'lat' || k === 'lng' || k === 'rating') {
      v = v === '' || v === null ? null : Number(v)
      if (v !== null && Number.isNaN(v)) v = null
    } else if (k === 'years_experience' || k === 'owner_age') {
      v = v === '' || v === null ? null : parseInt(v, 10)
      if (v !== null && Number.isNaN(v)) v = null
    } else if (k === 'active') {
      v = v === true || v === 'true' || v === 1 || v === '1'
    } else if (k === 'gallery_urls') {
      if (Array.isArray(v)) {
        v = v.filter(u => typeof u === 'string' && u.startsWith('http')).slice(0, 5)
      } else if (typeof v === 'string') {
        try { v = JSON.parse(v) } catch { v = [] }
        if (!Array.isArray(v)) v = []
      } else {
        v = []
      }
    } else if (k === 'gallery_display_type') {
      v = ['fanned', 'carousel'].includes(v) ? v : 'fanned'
    } else if (k === 'is_accepting_clients') {
      v = v === true || v === 'true' || v === 1 || v === '1'
    } else if (typeof v === 'string') {
      v = v.trim()
      if (v === '') v = null
    }
    out[k] = v
  }
  return out
}

function authed(request) {
  const pw = request.headers.get('x-admin-password')
  return ADMIN_PASSWORD && safeEqual(String(pw || ''), ADMIN_PASSWORD)
}

function admin() {
  return createClient(SUPABASE_URL, SERVICE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
}

async function readBody(request) {
  try { return await request.json() } catch { return {} }
}

export async function GET(request) {
  if (!authed(request)) return Response.json({ error: 'unauthorized' }, { status: 401 })
  if (!SUPABASE_URL || !SERVICE_KEY) return Response.json({ error: 'server not configured' }, { status: 500 })
  const { data, error } = await admin()
    .from('rise_directory').select('*').order('created_at', { ascending: true })
  if (error) return Response.json({ error: error.message }, { status: 500 })
  return Response.json({ data })
}

export async function POST(request) {
  if (!authed(request)) return Response.json({ error: 'unauthorized' }, { status: 401 })
  const body = await readBody(request)
  const payload = sanitize(body)
  if (!payload.business_name) return Response.json({ error: 'business_name required' }, { status: 400 })
  if (!payload.slug) payload.slug = toSlug(payload.business_name)
  if (payload.active === undefined) payload.active = true
  const { data, error } = await admin()
    .from('rise_directory').insert(payload).select().single()
  if (error) return Response.json({ error: error.message }, { status: 500 })
  return Response.json({ data })
}

export async function PUT(request) {
  if (!authed(request)) return Response.json({ error: 'unauthorized' }, { status: 401 })
  const body = await readBody(request)
  if (!body.id) return Response.json({ error: 'id required' }, { status: 400 })
  const payload = sanitize(body)
  delete payload.id
  const { data, error } = await admin()
    .from('rise_directory').update(payload).eq('id', body.id).select().single()
  if (error) return Response.json({ error: error.message }, { status: 500 })
  return Response.json({ data })
}

export async function DELETE(request) {
  if (!authed(request)) return Response.json({ error: 'unauthorized' }, { status: 401 })
  const body = await readBody(request)
  const id = body.id || new URL(request.url).searchParams.get('id')
  if (!id) return Response.json({ error: 'id required' }, { status: 400 })
  const { error } = await admin().from('rise_directory').delete().eq('id', id)
  if (error) return Response.json({ error: error.message }, { status: 500 })
  return Response.json({ ok: true })
}
