'use client'
import { useState, useEffect, useCallback, useMemo } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { adminApi, getPw, setPw, clearPw } from '@/lib/adminApi'
import { categoryMeta, CATEGORIES } from '@/lib/categories'
import StudioForm from '@/components/admin/StudioForm'
import { TEAL } from '@/lib/theme'

/* ── Password gate ── */
function Gate({ onUnlock }) {
  const [pw, setPwInput] = useState('')
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setBusy(true); setErr('')
    setPw(pw)
    try {
      await adminApi.list()
      onUnlock()
    } catch {
      clearPw()
      setErr('סיסמה שגויה')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="h-[100dvh] flex items-center justify-center bg-white px-5" dir="rtl">
      <motion.form
        onSubmit={submit}
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 26 }}
        className="w-full max-w-sm bg-white rounded-3xl border border-zinc-100 shadow-[0_12px_48px_rgba(0,0,0,0.10)] p-8"
      >
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0"
               style={{ background: TEAL }}>
            <span className="font-frank font-bold text-[15px] text-white">R</span>
          </div>
          <div>
            <p className="font-frank font-bold text-[20px] text-zinc-900 leading-tight" style={{ letterSpacing: '0.06em' }}>RISE</p>
            <p className="font-heebo text-[12px] text-zinc-400 leading-none">Admin Panel</p>
          </div>
        </div>
        <p className="font-heebo text-[13px] text-zinc-400 mt-4 mb-6">ניהול ספריית הסטודיואים</p>

        <label className="block text-[12px] font-heebo font-semibold text-zinc-500 mb-1.5">סיסמה</label>
        <input
          type="password" value={pw} onChange={e => setPwInput(e.target.value)} autoFocus
          className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-[14px]
                     text-zinc-900 font-heebo outline-none transition"
          style={{ ':focus': {} }}
          onFocus={e => { e.target.style.borderColor = TEAL; e.target.style.boxShadow = `0 0 0 3px rgba(26,107,122,0.12)` }}
          onBlur={e => { e.target.style.borderColor = ''; e.target.style.boxShadow = '' }}
          placeholder="••••••••" dir="ltr"
        />
        {err && (
          <p className="text-[13px] font-heebo text-red-500 mt-2 flex items-center gap-1.5">
            <span>!</span> {err}
          </p>
        )}

        <button type="submit" disabled={busy}
          className="w-full mt-5 text-white font-heebo font-semibold text-[14px] py-3.5 rounded-2xl
                     transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ background: TEAL }}
          onMouseEnter={e => { e.currentTarget.style.background = '#155e6b' }}
          onMouseLeave={e => { e.currentTarget.style.background = TEAL }}>
          {busy ? 'בודק…' : 'כניסה לפאנל'}
        </button>

        <Link href="/" className="block text-center mt-4 text-[12px] font-heebo text-zinc-400 hover:text-zinc-700 transition">
          ← חזרה למפה
        </Link>
      </motion.form>
    </div>
  )
}

/* ── Stat chip ── */
function StatChip({ label, count, dot }) {
  return (
    <div className="flex items-center gap-1.5 shrink-0 bg-white border border-zinc-100 rounded-full px-3 py-1.5">
      {dot && <span className="w-2 h-2 rounded-full shrink-0" style={{ background: dot }} />}
      <span className="font-heebo text-[11px] text-zinc-500">{label}</span>
      <span className="font-frank font-bold text-[13px] text-zinc-900">{count}</span>
    </div>
  )
}

/* ── Studio row ── */
function Row({ studio, onEdit, onDelete, onToggleActive }) {
  const m = categoryMeta(studio.type)
  const [toggling, setToggling] = useState(false)

  const handleToggle = async (e) => {
    e.stopPropagation()
    setToggling(true)
    await onToggleActive(studio)
    setToggling(false)
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.97 }}
      className="flex items-center gap-3 bg-white rounded-2xl px-3.5 py-3
                 hover:shadow-[0_2px_12px_rgba(0,0,0,0.07)] transition-all"
      style={{ border: '1px solid rgba(0,0,0,0.06)' }}
    >
      {/* Avatar */}
      <span className="w-10 h-10 rounded-xl shrink-0 flex items-center justify-center overflow-hidden"
            style={{ background: m.soft }}>
        {studio.logo_url
          ? <img src={studio.logo_url} alt="" className="w-full h-full object-cover" />
          : <span className="font-frank font-bold text-[15px]" style={{ color: m.color }}>
              {(studio.business_name || '?').charAt(0)}
            </span>
        }
      </span>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="font-frank font-semibold text-[14px] text-zinc-900 truncate">{studio.business_name}</p>
          <span className="text-[10px] font-heebo font-semibold px-2 py-0.5 rounded-full shrink-0"
                style={{ background: m.soft, color: m.text }}>
            {studio.type}
          </span>
        </div>
        <p className="text-[12px] font-heebo text-zinc-400 truncate mt-0.5">
          {studio.city}{studio.address ? ` · ${studio.address}` : ''}
        </p>
      </div>

      {/* Quick active toggle */}
      <button
        onClick={handleToggle}
        disabled={toggling}
        aria-label={studio.active ? 'הסתר' : 'הצג'}
        title={studio.active ? 'מוצג — לחץ להסתיר' : 'מוסתר — לחץ להציג'}
        className="relative w-11 h-6 rounded-full transition-all duration-300 shrink-0 disabled:opacity-60"
        style={{ background: studio.active ? '#4CAF7D' : '#d1d5db' }}
      >
        <motion.span layout
          className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm"
          style={{ [studio.active ? 'right' : 'left']: 4 }}
        />
      </button>

      {/* Edit */}
      <button onClick={() => onEdit(studio)} aria-label="עריכה"
        className="w-8 h-8 rounded-xl hover:bg-zinc-100 flex items-center justify-center text-zinc-400 hover:text-zinc-700 transition shrink-0">
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round"
            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      </button>

      {/* Delete */}
      <button onClick={() => onDelete(studio)} aria-label="מחיקה"
        className="w-8 h-8 rounded-xl hover:bg-red-50 flex items-center justify-center text-red-300 hover:text-red-500 transition shrink-0">
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round"
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    </motion.div>
  )
}

/* ── Main admin page ── */
export default function AdminPage() {
  const [authed, setAuthed] = useState(false)
  const [studios, setStudios] = useState([])
  const [loading, setLoading] = useState(false)
  const [editing, setEditing] = useState(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [catFilter, setCatFilter] = useState('הכל')

  const load = useCallback(async () => {
    setLoading(true); setError('')
    try {
      const { data } = await adminApi.list()
      setStudios(data || [])
    } catch (e) {
      if (e.code === 401) { clearPw(); setAuthed(false) }
      else setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (getPw()) {
      adminApi.list()
        .then(({ data }) => { setStudios(data || []); setAuthed(true) })
        .catch(() => clearPw())
    }
  }, [])

  const filtered = useMemo(() => {
    let list = studios
    if (catFilter !== 'הכל') list = list.filter(s => s.type === catFilter)
    if (search.trim()) {
      const q = search.trim().toLowerCase()
      list = list.filter(s =>
        s.business_name?.toLowerCase().includes(q) ||
        s.city?.toLowerCase().includes(q) ||
        s.owner_name?.toLowerCase().includes(q)
      )
    }
    return list
  }, [studios, catFilter, search])

  const handleSave = async (form) => {
    setSaving(true); setError('')
    try {
      if (form.id) await adminApi.update(form)
      else await adminApi.create(form)
      setEditing(null)
      await load()
    } catch (e) {
      setError(e.message)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (studio) => {
    if (!window.confirm(`למחוק את "${studio.business_name}"? פעולה בלתי הפיכה.`)) return
    setError('')
    try {
      await adminApi.remove(studio.id)
      await load()
    } catch (e) {
      setError(e.message)
    }
  }

  const handleToggleActive = async (studio) => {
    try {
      await adminApi.update({ ...studio, active: !studio.active })
      setStudios(prev => prev.map(s => s.id === studio.id ? { ...s, active: !s.active } : s))
    } catch (e) {
      setError(e.message)
    }
  }

  if (!authed) return <Gate onUnlock={() => { setAuthed(true); load() }} />

  const activeCount = studios.filter(s => s.active).length

  return (
    <div className="h-[100dvh] overflow-y-auto bg-white" dir="rtl">

      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-zinc-100"
              style={{ background: 'rgba(255,255,255,0.96)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }}>
        <div className="max-w-2xl mx-auto px-5 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-xl flex items-center justify-center shrink-0"
                 style={{ background: TEAL }}>
              <span className="font-frank font-bold text-[11px] text-white">R</span>
            </div>
            <span className="font-frank font-bold text-zinc-900"
                  style={{ fontSize: '16px', letterSpacing: '0.06em' }}>RISE</span>
            <span className="font-heebo text-[11px] text-zinc-500 bg-zinc-100 px-2 py-0.5 rounded-full">Admin</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/" className="text-[12px] font-heebo text-zinc-400 hover:text-zinc-700 transition flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
              מפה
            </Link>
            <button onClick={() => { clearPw(); setAuthed(false) }}
              className="text-[12px] font-heebo text-zinc-400 hover:text-red-500 transition">
              יציאה
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-5 py-5 space-y-4">

        {/* Title row */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="font-frank text-[22px] font-bold text-zinc-900 leading-tight">סטודיואות</h1>
            <p className="text-[12px] font-heebo text-zinc-400 mt-0.5">
              {activeCount} פעילות מתוך {studios.length}
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            onClick={() => setEditing({})}
            className="flex items-center gap-2 text-white font-heebo font-semibold text-[13px]
                       px-4 py-2.5 rounded-2xl transition-all duration-200"
            style={{ background: TEAL, boxShadow: '0 4px 14px rgba(26,107,122,0.28)' }}
            onMouseEnter={e => { e.currentTarget.style.background = '#155e6b' }}
            onMouseLeave={e => { e.currentTarget.style.background = TEAL }}
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            הוסף
          </motion.button>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-2 overflow-x-auto pb-0.5 scrollbar-none -mx-1 px-1">
          <StatChip label="סה״כ" count={studios.length} />
          <StatChip label="פעילות" count={activeCount} dot="#4CAF7D" />
          <StatChip label="מוסתרות" count={studios.length - activeCount} dot="#d1d5db" />
          {CATEGORIES.map(c => {
            const cnt = studios.filter(s => s.type === c).length
            if (!cnt) return null
            return <StatChip key={c} label={c} count={cnt} dot={categoryMeta(c).color} />
          })}
        </div>

        {/* Search + filter */}
        <div className="space-y-2.5">
          <div className="relative">
            <svg className="absolute top-1/2 -translate-y-1/2 end-3.5 w-4 h-4 text-zinc-400 pointer-events-none"
                 fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
            </svg>
            <input
              value={search} onChange={e => setSearch(e.target.value)}
              placeholder="חיפוש לפי שם, עיר או בעלים…"
              className="w-full rounded-xl border border-zinc-200 bg-zinc-50 pe-10 ps-4 py-2.5 text-[13px]
                         text-zinc-900 font-heebo placeholder-zinc-400 outline-none transition"
              onFocus={e => { e.target.style.borderColor = TEAL; e.target.style.boxShadow = `0 0 0 3px rgba(26,107,122,0.10)` }}
              onBlur={e => { e.target.style.borderColor = ''; e.target.style.boxShadow = '' }}
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
            {['הכל', ...CATEGORIES].map(c => (
              <button key={c} onClick={() => setCatFilter(c)}
                className="shrink-0 px-3 py-1.5 rounded-full font-heebo text-[12px] font-medium transition-all duration-200"
                style={catFilter === c
                  ? { background: TEAL, color: '#fff' }
                  : { background: 'white', color: '#6b7280', border: '1px solid #e5e7eb' }
                }>
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="rounded-xl bg-red-50 border border-red-100 px-4 py-3 flex items-center gap-2.5 text-[13px] font-heebo text-red-500">
            <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
            </svg>
            {error}
          </div>
        )}

        {/* List */}
        {loading && studios.length === 0 ? (
          <div className="space-y-2">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-16 bg-zinc-50 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            {studios.length === 0 ? (
              <>
                <p className="font-frank text-[18px] text-zinc-900 mb-1">אין סטודיואות עדיין</p>
                <p className="text-[13px] font-heebo text-zinc-400">לחצ/י "הוסף" כדי להתחיל</p>
              </>
            ) : (
              <>
                <p className="font-frank text-[16px] text-zinc-900 mb-1">לא נמצאו תוצאות</p>
                <p className="text-[13px] font-heebo text-zinc-400">נסה/י חיפוש אחר</p>
              </>
            )}
          </div>
        ) : (
          <div className="space-y-2">
            <AnimatePresence mode="popLayout">
              {filtered.map(s => (
                <Row key={s.id} studio={s}
                     onEdit={setEditing}
                     onDelete={handleDelete}
                     onToggleActive={handleToggleActive} />
              ))}
            </AnimatePresence>
            {filtered.length < studios.length && (
              <p className="text-center text-[12px] font-heebo text-zinc-400 pt-1">
                מציג {filtered.length} מתוך {studios.length}
              </p>
            )}
          </div>
        )}
      </main>

      <AnimatePresence>
        {editing && (
          <StudioForm
            initial={editing.id ? editing : null}
            onSave={handleSave}
            onCancel={() => setEditing(null)}
            saving={saving}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
