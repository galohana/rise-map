'use client'
import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { adminApi, getPw, setPw, clearPw } from '@/lib/adminApi'
import { categoryMeta, pinGlyph } from '@/lib/categories'
import StudioForm from '@/components/admin/StudioForm'

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
    } catch (e) {
      clearPw()
      setErr(e.code === 401 ? 'סיסמה שגויה' : 'שגיאת התחברות')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="h-[100dvh] overflow-y-auto flex items-center justify-center bg-[#FAF8F5] px-5 py-8" dir="rtl">
      <motion.form
        onSubmit={submit}
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 320, damping: 28 }}
        className="w-full max-w-sm bg-white rounded-3xl border border-[#E8E2DC] shadow-[0_8px_40px_rgba(28,25,22,0.1)] p-7"
      >
        <div className="flex items-center gap-2.5 mb-1">
          <div className="w-8 h-8 rounded-full bg-[#1C1916] flex items-center justify-center">
            <span className="font-frank text-[11px] font-black text-[#C9A070]">R</span>
          </div>
          <span className="font-frank text-[20px] font-bold text-[#1C1916]">RISE Admin</span>
        </div>
        <p className="text-[13px] font-heebo text-[#A09A96] mb-6">ניהול ספריית הסטודיואים</p>

        <label className="block text-[12px] font-heebo font-medium text-[#6B6460] mb-1.5">סיסמה</label>
        <input
          type="password" value={pw} onChange={e => setPwInput(e.target.value)} autoFocus
          className="w-full rounded-xl border border-[#E3DCD2] bg-[#FAF8F5] px-3.5 py-2.5 text-[14px]
                     text-[#1C1916] font-heebo outline-none focus:border-[#C9A070]
                     focus:ring-2 focus:ring-[#C9A070]/20 transition"
          placeholder="••••••••" dir="ltr"
        />
        {err && <p className="text-[13px] font-heebo text-[#D14343] mt-2">{err}</p>}

        <button type="submit" disabled={busy}
          className="w-full mt-5 bg-[#1C1916] text-white font-heebo font-semibold text-[14px] py-3 rounded-full
                     hover:bg-[#C9A070] transition-colors duration-300 disabled:opacity-60">
          {busy ? 'בודק…' : 'כניסה'}
        </button>

        <Link href="/" className="block text-center mt-4 text-[12px] font-heebo text-[#A09A96] hover:text-[#1C1916] transition">
          ← חזרה למפה
        </Link>
      </motion.form>
    </div>
  )
}

/* ── Studio row ── */
function Row({ studio, onEdit, onDelete }) {
  const m = categoryMeta(studio.type)
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.97 }}
      className="flex items-center gap-3 bg-white rounded-2xl border border-[#E8E2DC] px-3.5 py-3"
    >
      <span className="w-10 h-10 rounded-xl shrink-0 flex items-center justify-center text-lg overflow-hidden"
            style={{ background: m.soft }}>
        {studio.logo_url
          ? <img src={studio.logo_url} alt="" className="w-full h-full object-cover" />
          : pinGlyph(studio)}
      </span>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="font-frank font-semibold text-[14px] text-[#1C1916] truncate">{studio.business_name}</p>
          {!studio.active && (
            <span className="text-[10px] font-heebo text-[#A09A96] bg-[#F0EBE4] px-1.5 py-0.5 rounded-full shrink-0">מוסתר</span>
          )}
        </div>
        <p className="text-[12px] font-heebo text-[#A09A96] truncate">
          <span style={{ color: m.text }}>{studio.type}</span> · {studio.city}
        </p>
      </div>

      <button onClick={() => onEdit(studio)} aria-label="עריכה"
        className="w-9 h-9 rounded-xl hover:bg-[#F0EBE4] flex items-center justify-center text-[#6B6460] transition shrink-0">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round"
            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      </button>
      <button onClick={() => onDelete(studio)} aria-label="מחיקה"
        className="w-9 h-9 rounded-xl hover:bg-[#FBE9E9] flex items-center justify-center text-[#C97A7A] transition shrink-0">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
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

  if (!authed) return <Gate onUnlock={() => { setAuthed(true); load() }} />

  return (
    <div className="h-[100dvh] overflow-y-auto bg-[#FAF8F5]" dir="rtl">
      <header className="sticky top-0 z-40 bg-[#FAF8F5]/95 backdrop-blur border-b border-[#E8E2DC]">
        <div className="max-w-2xl mx-auto px-5 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-[#1C1916] flex items-center justify-center">
              <span className="font-frank text-[10px] font-black text-[#C9A070]">R</span>
            </div>
            <span className="font-frank text-[18px] font-bold text-[#1C1916]">Admin</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/" className="text-[12px] font-heebo text-[#A09A96] hover:text-[#1C1916] transition">מפה</Link>
            <button onClick={() => { clearPw(); setAuthed(false) }}
              className="text-[12px] font-heebo text-[#A09A96] hover:text-[#1C1916] transition">יציאה</button>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-5 py-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h1 className="font-frank text-[24px] font-bold text-[#1C1916] leading-tight">סטודיואות</h1>
            <p className="text-[12px] font-heebo text-[#A09A96]">{studios.length} רשומות בספרייה</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            onClick={() => setEditing({})}
            className="flex items-center gap-2 bg-[#C9A070] text-white font-heebo font-semibold text-[13px]
                       px-4 py-2.5 rounded-full shadow-[0_4px_14px_rgba(201,160,112,0.4)] hover:bg-[#1C1916] transition-colors duration-300">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            הוסף סטודיו
          </motion.button>
        </div>

        {error && (
          <div className="mb-4 rounded-xl bg-[#FBE9E9] border border-[#F2C9C9] px-4 py-2.5 text-[13px] font-heebo text-[#B84444]">
            {error}
          </div>
        )}

        {loading && studios.length === 0 ? (
          <div className="space-y-2.5">
            {[1,2,3].map(i => <div key={i} className="h-16 bg-white rounded-2xl border border-[#E8E2DC] animate-pulse" />)}
          </div>
        ) : studios.length === 0 ? (
          <div className="text-center py-20">
            <p className="font-frank text-[18px] text-[#1C1916] mb-1">אין סטודיואות עדיין</p>
            <p className="text-[13px] font-heebo text-[#A09A96]">לחצי "הוסף סטודיו" כדי להתחיל</p>
          </div>
        ) : (
          <div className="space-y-2.5">
            <AnimatePresence mode="popLayout">
              {studios.map(s => (
                <Row key={s.id} studio={s} onEdit={setEditing} onDelete={handleDelete} />
              ))}
            </AnimatePresence>
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
