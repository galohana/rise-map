import { useState } from 'react'
import { motion } from 'framer-motion'
import { CATEGORIES, categoryMeta } from '../../lib/categories'

const EMPTY = {
  business_name: '', owner_name: '', type: 'גבות', city: '', address: '',
  lat: '', lng: '', phone: '', url: '', years_experience: '',
  emoji: '', logo_url: '', active: true,
}

const FIELD = 'w-full rounded-xl border border-[#E3DCD2] bg-white px-3.5 py-2.5 text-[14px] ' +
  'text-[#1C1916] placeholder-[#B5ADA3] font-heebo outline-none ' +
  'focus:border-[#C9A070] focus:ring-2 focus:ring-[#C9A070]/20 transition'
const LABEL = 'block text-[12px] font-heebo font-medium text-[#6B6460] mb-1.5'

export default function StudioForm({ initial, onSave, onCancel, saving }) {
  const [form, setForm] = useState({ ...EMPTY, ...(initial || {}) })
  const [err, setErr] = useState('')

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const submit = (e) => {
    e.preventDefault()
    if (!form.business_name.trim()) { setErr('שם העסק חובה'); return }
    if (!form.city.trim()) { setErr('עיר חובה'); return }
    if (form.lat === '' || form.lng === '') { setErr('lat ו-lng חובה'); return }
    if (!form.url.trim()) { setErr('כתובת אתר חובה'); return }
    setErr('')
    onSave(form)
  }

  const isEdit = Boolean(initial?.id)
  const glyph = form.emoji?.trim() || categoryMeta(form.type).emoji

  return (
    <motion.div
      className="fixed inset-0 z-[1000] flex items-end sm:items-center justify-center bg-[#1C1916]/45 backdrop-blur-sm p-0 sm:p-4"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={onCancel}
    >
      <motion.div
        className="w-full sm:max-w-lg bg-[#FAF8F5] rounded-t-3xl sm:rounded-3xl shadow-2xl max-h-[92dvh] overflow-y-auto"
        initial={{ y: 40, opacity: 0, scale: 0.98 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 40, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 360, damping: 30 }}
        onClick={e => e.stopPropagation()}
        dir="rtl"
      >
        {/* Header */}
        <div className="sticky top-0 bg-[#FAF8F5]/95 backdrop-blur border-b border-[#E8E2DC] px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-full flex items-center justify-center text-base"
                  style={{ background: categoryMeta(form.type).soft }}>{glyph}</span>
            <h2 className="font-frank text-[18px] font-bold text-[#1C1916]">
              {isEdit ? 'עריכת סטודיו' : 'הוספת סטודיו'}
            </h2>
          </div>
          <button onClick={onCancel} aria-label="סגור"
                  className="w-8 h-8 rounded-full hover:bg-[#EDE8E2] flex items-center justify-center text-[#6B6460]">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={submit} className="px-5 py-5 space-y-4">
          {/* business + owner */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className={LABEL}>שם עסק *</label>
              <input className={FIELD} value={form.business_name}
                     onChange={e => set('business_name', e.target.value)} placeholder="למשל: עדי ניילס" />
            </div>
            <div>
              <label className={LABEL}>שם בעלת העסק</label>
              <input className={FIELD} value={form.owner_name || ''}
                     onChange={e => set('owner_name', e.target.value)} placeholder="עדי" />
            </div>
          </div>

          {/* category + city */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className={LABEL}>קטגוריה</label>
              <select className={FIELD} value={form.type} onChange={e => set('type', e.target.value)}>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className={LABEL}>עיר *</label>
              <input className={FIELD} value={form.city}
                     onChange={e => set('city', e.target.value)} placeholder="אשקלון" />
            </div>
          </div>

          {/* address */}
          <div>
            <label className={LABEL}>כתובת מלאה</label>
            <input className={FIELD} value={form.address || ''}
                   onChange={e => set('address', e.target.value)} placeholder="מעלות אשר 7, אשקלון" />
          </div>

          {/* lat + lng */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={LABEL}>קו רוחב (lat) *</label>
              <input type="number" step="any" className={FIELD} value={form.lat}
                     onChange={e => set('lat', e.target.value)} placeholder="31.6777" dir="ltr" />
            </div>
            <div>
              <label className={LABEL}>קו אורך (lng) *</label>
              <input type="number" step="any" className={FIELD} value={form.lng}
                     onChange={e => set('lng', e.target.value)} placeholder="34.5772" dir="ltr" />
            </div>
          </div>

          {/* phone + years */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={LABEL}>טלפון</label>
              <input className={FIELD} value={form.phone || ''}
                     onChange={e => set('phone', e.target.value)} placeholder="050-0000000" dir="ltr" />
            </div>
            <div>
              <label className={LABEL}>שנות ניסיון</label>
              <input type="number" className={FIELD} value={form.years_experience || ''}
                     onChange={e => set('years_experience', e.target.value)} placeholder="5" dir="ltr" />
            </div>
          </div>

          {/* website */}
          <div>
            <label className={LABEL}>אתר *</label>
            <input className={FIELD} value={form.url}
                   onChange={e => set('url', e.target.value)} placeholder="https://..." dir="ltr" />
          </div>

          {/* emoji */}
          <div>
            <label className={LABEL}>אימוג׳י (מוצג בפין במפה)</label>
            <div className="flex items-center gap-3">
              <input className={FIELD + ' flex-1'} value={form.emoji || ''}
                     onChange={e => set('emoji', e.target.value)} placeholder="💆‍♀️" />
              <span className="w-11 h-11 rounded-full shrink-0 flex items-center justify-center text-xl"
                    style={{ background: categoryMeta(form.type).soft }}>{glyph}</span>
            </div>
          </div>

          {/* logo url + preview */}
          <div>
            <label className={LABEL}>לוגו (URL)</label>
            <div className="flex items-center gap-3">
              <input className={FIELD + ' flex-1'} value={form.logo_url || ''}
                     onChange={e => set('logo_url', e.target.value)} placeholder="https://.../logo.png" dir="ltr" />
              {form.logo_url
                ? <img src={form.logo_url} alt="לוגו"
                       className="w-11 h-11 rounded-xl object-cover border border-[#E3DCD2] shrink-0"
                       onError={e => { e.currentTarget.style.opacity = '0.25' }} />
                : <span className="w-11 h-11 rounded-xl border border-dashed border-[#D9D1C6] shrink-0" />
              }
            </div>
          </div>

          {/* active toggle */}
          <div className="flex items-center justify-between rounded-xl border border-[#E3DCD2] bg-white px-3.5 py-3">
            <div>
              <p className="text-[14px] font-heebo font-medium text-[#1C1916]">מוצג במפה</p>
              <p className="text-[11px] font-heebo text-[#A09A96]">כבוי = הסטודיו מוסתר מהציבור</p>
            </div>
            <button type="button" onClick={() => set('active', !form.active)}
                    className={`relative w-12 h-7 rounded-full transition-colors ${form.active ? 'bg-[#C9A070]' : 'bg-[#D9D1C6]'}`}>
              <motion.span layout
                className="absolute top-1 w-5 h-5 rounded-full bg-white shadow"
                style={{ [form.active ? 'right' : 'left']: 4 }} />
            </button>
          </div>

          {err && <p className="text-[13px] font-heebo text-[#D14343]">{err}</p>}

          {/* actions */}
          <div className="flex gap-3 pt-1">
            <button type="submit" disabled={saving}
              className="flex-1 bg-[#1C1916] text-white font-heebo font-semibold text-[14px] py-3 rounded-full
                         hover:bg-[#C9A070] transition-colors duration-300 disabled:opacity-60">
              {saving ? 'שומר…' : (isEdit ? 'שמירת שינויים' : 'הוספה')}
            </button>
            <button type="button" onClick={onCancel}
              className="px-5 font-heebo text-[14px] text-[#6B6460] hover:text-[#1C1916] transition">
              ביטול
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  )
}
