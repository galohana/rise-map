'use client'
import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { CATEGORIES, categoryMeta } from '@/lib/categories'
import { uploadLogo, uploadGallery } from '@/lib/adminApi'
import { TEAL } from '@/lib/theme'

const EMPTY = {
  business_name: '', owner_name: '', type: 'גבות', city: '', address: '',
  lat: '', lng: '', phone: '', url: '', years_experience: '',
  owner_age: '', specialty: '', custom_description: '',
  facebook_url: '', instagram_url: '', google_url: '', whatsapp: '',
  logo_url: '', gallery_urls: [], gallery_display_type: 'fanned',
  is_accepting_clients: true, opening_hours: '', active: true,
}

const F = 'w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3.5 py-2.5 text-[14px] ' +
  'text-zinc-900 placeholder-zinc-400 font-heebo outline-none transition'

const L = 'block text-[12px] font-heebo font-medium text-zinc-500 mb-1.5'

function focusTeal(e) {
  e.target.style.borderColor = TEAL
  e.target.style.boxShadow = 'inset 0 0 0 0px transparent, 0 0 0 3px rgba(26,107,122,0.10)'
  e.target.style.background = '#fff'
}
function blurTeal(e) {
  e.target.style.borderColor = ''
  e.target.style.boxShadow = ''
  e.target.style.background = ''
}

function Section({ icon, title, children }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <span className="text-[15px]">{icon}</span>
        <span className="font-heebo text-[13px] font-semibold text-zinc-700">{title}</span>
        <div className="flex-1 h-px bg-zinc-100" />
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  )
}

function Toggle({ checked, onChange, label, sub, color }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-zinc-200 bg-white px-3.5 py-3">
      <div>
        <p className="text-[14px] font-heebo font-medium text-zinc-800">{label}</p>
        {sub && <p className="text-[11px] font-heebo text-zinc-400">{sub}</p>}
      </div>
      <button type="button" onClick={() => onChange(!checked)}
              className="relative w-12 h-6 rounded-full transition-colors duration-300"
              style={{ background: checked ? (color || TEAL) : '#d1d5db' }}>
        <motion.span layout
          className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm"
          style={{ [checked ? 'right' : 'left']: 4 }} />
      </button>
    </div>
  )
}

export default function StudioForm({ initial, onSave, onCancel, saving }) {
  const [form, setForm] = useState({
    ...EMPTY,
    ...(initial || {}),
    gallery_display_type: initial?.gallery_display_type || 'fanned',
    is_accepting_clients: initial?.is_accepting_clients ?? true,
    opening_hours: initial?.opening_hours || '',
  })
  const [err, setErr] = useState('')
  const [uploading, setUploading] = useState(false)
  const [galleryProgress, setGalleryProgress] = useState(null)
  const fileRef = useRef(null)
  const galleryRef = useRef(null)

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const submit = (e) => {
    e.preventDefault()
    if (!form.business_name.trim()) { setErr('שם העסק חובה'); return }
    if (!form.city.trim()) { setErr('עיר חובה'); return }
    if (form.lat === '' || form.lng === '') { setErr('קו רוחב וקו אורך חובה'); return }
    if (!form.url.trim()) { setErr('כתובת אתר חובה'); return }
    setErr('')
    onSave(form)
  }

  const handleFile = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true); setErr('')
    try {
      const url = await uploadLogo(file)
      set('logo_url', url)
    } catch (e) {
      setErr(e.message || 'העלאת הלוגו נכשלה')
    } finally {
      setUploading(false)
    }
  }

  const handleGalleryFiles = async (e) => {
    const files = Array.from(e.target.files || [])
    if (!files.length) return
    const current = form.gallery_urls || []
    const allowed = Math.max(0, 5 - current.length)
    const batch = files.slice(0, allowed)
    if (!batch.length) { setErr('הגעת למקסימום 5 תמונות'); return }
    setGalleryProgress(`0/${batch.length}`)
    setErr('')
    const uploaded = []
    for (let i = 0; i < batch.length; i++) {
      try {
        const url = await uploadGallery(batch[i])
        uploaded.push(url)
        setGalleryProgress(`${i + 1}/${batch.length}`)
      } catch (ex) {
        setErr(`תמונה ${i + 1} נכשלה: ${ex.message || 'שגיאת שרת'}`)
      }
    }
    if (uploaded.length) set('gallery_urls', [...current, ...uploaded])
    setGalleryProgress(null)
    e.target.value = ''
  }

  const removeGallery = (idx) => {
    set('gallery_urls', (form.gallery_urls || []).filter((_, i) => i !== idx))
  }

  const isEdit = Boolean(initial?.id)

  return (
    <motion.div
      className="fixed inset-0 z-[1000] flex items-end sm:items-center justify-center sm:p-4"
      style={{ background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)' }}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={onCancel}
    >
      <motion.div
        className="w-full sm:max-w-lg bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl max-h-[93dvh] overflow-y-auto"
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 40, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 340, damping: 30 }}
        onClick={e => e.stopPropagation()}
        dir="rtl"
      >
        {/* Modal header */}
        <div className="sticky top-0 bg-white/96 border-b border-zinc-100 px-5 py-4 flex items-center justify-between"
             style={{ backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}>
          <div className="flex items-center gap-2.5">
            {form.logo_url ? (
              <img src={form.logo_url} alt=""
                   onError={e => { e.currentTarget.style.display = 'none' }}
                   className="w-8 h-8 rounded-full object-cover shrink-0 border border-zinc-200" />
            ) : (
              <span className="w-8 h-8 rounded-xl shrink-0 flex items-center justify-center font-frank font-bold text-[13px]"
                    style={{ background: categoryMeta(form.type).soft, color: categoryMeta(form.type).color }}>
                {(form.business_name || (isEdit ? '✏' : '+')).charAt(0)}
              </span>
            )}
            <div>
              <h2 className="font-frank text-[17px] font-bold text-zinc-900 leading-tight">
                {isEdit ? 'עריכת סטודיו' : 'סטודיו חדש'}
              </h2>
              {isEdit && form.business_name && (
                <p className="text-[11px] font-heebo text-zinc-400">{form.business_name}</p>
              )}
            </div>
          </div>
          <button onClick={onCancel} aria-label="סגור"
                  className="w-8 h-8 rounded-xl hover:bg-zinc-100 flex items-center justify-center text-zinc-400 transition">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={submit} className="px-5 py-5 space-y-6">

          {/* Section 1 — בסיסי */}
          <Section icon="🏪" title="פרטים בסיסיים">
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className={L}>שם העסק *</label>
                <input className={F} value={form.business_name}
                       onChange={e => set('business_name', e.target.value)}
                       onFocus={focusTeal} onBlur={blurTeal}
                       placeholder="למשל: עדי ניילס" />
              </div>
              <div>
                <label className={L}>שם בעלת העסק</label>
                <input className={F} value={form.owner_name || ''}
                       onChange={e => set('owner_name', e.target.value)}
                       onFocus={focusTeal} onBlur={blurTeal}
                       placeholder="עדי" />
              </div>
              <div>
                <label className={L}>גיל</label>
                <input type="number" className={F} value={form.owner_age || ''}
                       onChange={e => set('owner_age', e.target.value)}
                       onFocus={focusTeal} onBlur={blurTeal}
                       placeholder="32" dir="ltr" />
              </div>
              <div>
                <label className={L}>קטגוריה</label>
                <select className={F} value={form.type} onChange={e => set('type', e.target.value)}
                        onFocus={focusTeal} onBlur={blurTeal}>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className={L}>שנות ניסיון</label>
                <input type="number" className={F} value={form.years_experience || ''}
                       onChange={e => set('years_experience', e.target.value)}
                       onFocus={focusTeal} onBlur={blurTeal}
                       placeholder="5" dir="ltr" />
              </div>
              <div className="col-span-2">
                <label className={L}>התמחות</label>
                <input className={F} value={form.specialty || ''}
                       onChange={e => set('specialty', e.target.value)}
                       onFocus={focusTeal} onBlur={blurTeal}
                       placeholder="גבות שעווה, הסרת שיער" />
              </div>
              <div className="col-span-2">
                <label className={L}>תיאור חופשי</label>
                <textarea rows={3} className={F + ' resize-none'} value={form.custom_description || ''}
                          onChange={e => set('custom_description', e.target.value)}
                          onFocus={focusTeal} onBlur={blurTeal}
                          placeholder="מלל שיופיע בכרטיס הסטודיו…" />
              </div>
            </div>
          </Section>

          {/* Section 2 — מיקום */}
          <Section icon="📍" title="מיקום">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={L}>עיר *</label>
                <input className={F} value={form.city}
                       onChange={e => set('city', e.target.value)}
                       onFocus={focusTeal} onBlur={blurTeal}
                       placeholder="אשקלון" />
              </div>
              <div className="col-span-2">
                <label className={L}>כתובת מלאה</label>
                <input className={F} value={form.address || ''}
                       onChange={e => set('address', e.target.value)}
                       onFocus={focusTeal} onBlur={blurTeal}
                       placeholder="מעלות אשר 7, אשקלון" />
              </div>
              <div>
                <label className={L}>קו רוחב (lat) *</label>
                <input type="number" step="any" className={F} value={form.lat}
                       onChange={e => set('lat', e.target.value)}
                       onFocus={focusTeal} onBlur={blurTeal}
                       placeholder="31.6777" dir="ltr" />
              </div>
              <div>
                <label className={L}>קו אורך (lng) *</label>
                <input type="number" step="any" className={F} value={form.lng}
                       onChange={e => set('lng', e.target.value)}
                       onFocus={focusTeal} onBlur={blurTeal}
                       placeholder="34.5772" dir="ltr" />
              </div>
            </div>
            <p className="text-[11px] font-heebo text-zinc-400">
              Google Maps: לחץ ימני על נקודה ← העתק קואורדינטות
            </p>
          </Section>

          {/* Section 3 — קשר */}
          <Section icon="📞" title="קשר ואתר">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={L}>טלפון</label>
                <input className={F} value={form.phone || ''}
                       onChange={e => set('phone', e.target.value)}
                       onFocus={focusTeal} onBlur={blurTeal}
                       placeholder="050-0000000" dir="ltr" />
              </div>
              <div>
                <label className={L}>WhatsApp</label>
                <input className={F} value={form.whatsapp || ''}
                       onChange={e => set('whatsapp', e.target.value)}
                       onFocus={focusTeal} onBlur={blurTeal}
                       placeholder="0501234567" dir="ltr" />
              </div>
              <div className="col-span-2">
                <label className={L}>אתר *</label>
                <input className={F} value={form.url}
                       onChange={e => set('url', e.target.value)}
                       onFocus={focusTeal} onBlur={blurTeal}
                       placeholder="https://…" dir="ltr" />
              </div>
              <div className="col-span-2">
                <label className={L}>שעות פעילות</label>
                <input className={F} value={form.opening_hours || ''}
                       onChange={e => set('opening_hours', e.target.value)}
                       onFocus={focusTeal} onBlur={blurTeal}
                       placeholder="א׳-ה׳ 09:00-18:00 | שישי 09:00-14:00" />
              </div>
            </div>
          </Section>

          {/* Section 4 — רשתות */}
          <Section icon="🌐" title="רשתות חברתיות">
            <div className="space-y-3">
              {[
                { key: 'facebook_url', label: 'Facebook', ph: 'https://facebook.com/…' },
                { key: 'instagram_url', label: 'Instagram', ph: 'https://instagram.com/…' },
                { key: 'google_url', label: 'Google Business', ph: 'https://g.page/…' },
              ].map(({ key, label, ph }) => (
                <div key={key}>
                  <label className={L}>{label}</label>
                  <input className={F} value={form[key] || ''}
                         onChange={e => set(key, e.target.value)}
                         onFocus={focusTeal} onBlur={blurTeal}
                         placeholder={ph} dir="ltr" />
                </div>
              ))}
            </div>
          </Section>

          {/* Section 5 — מדיה */}
          <Section icon="📸" title="מדיה">
            <div>
              <label className={L}>לוגו</label>
              <div className="flex items-center gap-3">
                <input className={F + ' flex-1'} value={form.logo_url || ''}
                       onChange={e => set('logo_url', e.target.value)}
                       onFocus={focusTeal} onBlur={blurTeal}
                       placeholder="https://…/logo.png" dir="ltr" />
                {form.logo_url
                  ? <img src={form.logo_url} alt="לוגו"
                         className="w-11 h-11 rounded-xl object-cover border border-zinc-200 shrink-0"
                         onError={e => { e.currentTarget.style.opacity = '0.25' }} />
                  : <span className="w-11 h-11 rounded-xl border border-dashed border-zinc-300 shrink-0 bg-zinc-50" />
                }
              </div>
              <input ref={fileRef} type="file" accept="image/*" hidden onChange={handleFile} />
              <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading}
                className="mt-1.5 text-[12px] font-heebo font-medium transition disabled:opacity-60 flex items-center gap-1"
                style={{ color: TEAL }}>
                <span>↑</span>
                {uploading ? 'מעלה…' : 'העלאת קובץ לוגו'}
              </button>
            </div>

            <div>
              <label className={L}>גלריה (עד 5 תמונות)</label>
              {(form.gallery_urls || []).length > 0 && (
                <div className="flex gap-2 flex-wrap mb-2">
                  {(form.gallery_urls || []).map((url, i) => (
                    <div key={i} className="relative">
                      <img src={url} alt=""
                           className="w-16 h-16 rounded-xl object-cover border border-zinc-200"
                           onError={e => { e.currentTarget.style.opacity = '0.3' }} />
                      <button type="button" onClick={() => removeGallery(i)}
                        className="absolute -top-1.5 -end-1.5 w-5 h-5 rounded-full bg-red-400 text-white
                                   flex items-center justify-center text-[11px] leading-none shadow">
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <input ref={galleryRef} type="file" accept="image/*" multiple hidden onChange={handleGalleryFiles} />
              <button type="button"
                onClick={() => galleryRef.current?.click()}
                disabled={galleryProgress !== null || (form.gallery_urls || []).length >= 5}
                className="text-[12px] font-heebo font-medium transition disabled:opacity-60 flex items-center gap-1"
                style={{ color: TEAL }}>
                <span>↑</span>
                {galleryProgress !== null
                  ? `מעלה ${galleryProgress}…`
                  : `הוספת תמונות (${(form.gallery_urls || []).length}/5)`}
              </button>
            </div>

            <div className="rounded-xl border border-zinc-200 bg-white overflow-hidden">
              <p className="text-[12px] font-heebo font-medium text-zinc-500 px-3.5 pt-3 pb-2">סוג תצוגה</p>
              <div className="flex border-t border-zinc-100">
                {[
                  { value: 'fanned', label: 'קלפים מאוורר', icon: '🃏' },
                  { value: 'carousel', label: 'קרוסלה', icon: '🎠' },
                ].map(opt => (
                  <button key={opt.value} type="button"
                    onClick={() => set('gallery_display_type', opt.value)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-3 font-heebo text-[13px] transition-colors"
                    style={{
                      background: form.gallery_display_type === opt.value ? 'rgba(26,107,122,0.08)' : 'transparent',
                      color: form.gallery_display_type === opt.value ? TEAL : '#6b7280',
                      fontWeight: form.gallery_display_type === opt.value ? '600' : '400',
                      borderLeft: opt.value === 'carousel' ? '1px solid #f3f4f6' : 'none',
                    }}>
                    <span>{opt.icon}</span>
                    <span>{opt.label}</span>
                    {form.gallery_display_type === opt.value && (
                      <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: TEAL }} />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </Section>

          {/* Section 6 — הגדרות */}
          <Section icon="⚙️" title="הגדרות">
            <Toggle
              checked={form.is_accepting_clients}
              onChange={v => set('is_accepting_clients', v)}
              label="פנוי/ה ללקוחות חדשים"
              sub='כבוי = יוצג "לא פנוי" בכרטיס'
              color="#4CAF7D"
            />
            <Toggle
              checked={form.active}
              onChange={v => set('active', v)}
              label="מוצג במפה"
              sub="כבוי = הסטודיו מוסתר מהציבור"
            />
          </Section>

          {err && (
            <p className="text-[13px] font-heebo text-red-500 flex items-center gap-1.5">
              <span>!</span> {err}
            </p>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-1 pb-2">
            <button type="submit" disabled={saving}
              className="flex-1 text-white font-heebo font-semibold text-[14px] py-3.5 rounded-2xl
                         transition-all duration-200 disabled:opacity-50"
              style={{ background: TEAL }}
              onMouseEnter={e => { if (!saving) e.currentTarget.style.background = '#155e6b' }}
              onMouseLeave={e => { e.currentTarget.style.background = TEAL }}>
              {saving ? 'שומר…' : (isEdit ? 'שמירת שינויים' : 'הוספה')}
            </button>
            <button type="button" onClick={onCancel}
              className="px-6 font-heebo text-[14px] text-zinc-500 hover:text-zinc-800 transition rounded-2xl border border-zinc-200 bg-white">
              ביטול
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  )
}
