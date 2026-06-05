'use client'
import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { CATEGORIES, categoryMeta } from '@/lib/categories'
import { uploadLogo, uploadGallery } from '@/lib/adminApi'

const EMPTY = {
  business_name: '', owner_name: '', type: 'גבות', city: '', address: '',
  lat: '', lng: '', phone: '', url: '', years_experience: '',
  owner_age: '', specialty: '', custom_description: '',
  facebook_url: '', instagram_url: '', google_url: '', whatsapp: '',
  logo_url: '', gallery_urls: [], gallery_display_type: 'fanned', active: true,
}

const FIELD = 'w-full rounded-xl border border-[#E3DCD2] bg-white px-3.5 py-2.5 text-[14px] ' +
  'text-[#1C1916] placeholder-[#B5ADA3] font-heebo outline-none ' +
  'focus:border-[#C9A070] focus:ring-2 focus:ring-[#C9A070]/20 transition'
const LABEL = 'block text-[12px] font-heebo font-medium text-[#6B6460] mb-1.5'

export default function StudioForm({ initial, onSave, onCancel, saving }) {
  const [form, setForm] = useState({
    ...EMPTY,
    ...(initial || {}),
    // Normalize: existing DB rows have null (column just added); treat as 'fanned'
    gallery_display_type: initial?.gallery_display_type || 'fanned',
  })
  const [err, setErr] = useState('')
  const [uploading, setUploading] = useState(false)
  const [galleryProgress, setGalleryProgress] = useState(null) // null | '1/3'
  const fileRef = useRef(null)
  const galleryRef = useRef(null)

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
        // Continue with next files, don't abort
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
  const glyph = categoryMeta(form.type).emoji

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
        <div className="sticky top-0 bg-[#FAF8F5]/95 backdrop-blur border-b border-[#E8E2DC] px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            {form.logo_url ? (
              <img src={form.logo_url} alt=""
                   onError={e => { e.currentTarget.style.display = 'none' }}
                   className="w-8 h-8 rounded-full object-cover shrink-0 border border-[#E3DCD2]" />
            ) : (
              <span className="w-8 h-8 rounded-full shrink-0 flex items-center justify-center font-frank font-bold text-[13px]"
                    style={{ background: categoryMeta(form.type).soft, color: categoryMeta(form.type).color }}>
                {(form.business_name || (isEdit ? '✏' : '+')).charAt(0)}
              </span>
            )}
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

          <div>
            <label className={LABEL}>כתובת מלאה</label>
            <input className={FIELD} value={form.address || ''}
                   onChange={e => set('address', e.target.value)} placeholder="מעלות אשר 7, אשקלון" />
          </div>

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

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={LABEL}>גיל בעלת הסטודיו</label>
              <input type="number" className={FIELD} value={form.owner_age || ''}
                     onChange={e => set('owner_age', e.target.value)} placeholder="32" dir="ltr" />
            </div>
            <div>
              <label className={LABEL}>התמחות</label>
              <input className={FIELD} value={form.specialty || ''}
                     onChange={e => set('specialty', e.target.value)} placeholder="גבות שעווה, הסרת שיער" />
            </div>
          </div>

          <div>
            <label className={LABEL}>תיאור חופשי</label>
            <textarea rows={3} className={FIELD + ' resize-none'} value={form.custom_description || ''}
                      onChange={e => set('custom_description', e.target.value)}
                      placeholder="מלל שיופיע בכרטיס הסטודיו..." />
          </div>

          <div>
            <label className={LABEL}>אתר *</label>
            <input className={FIELD} value={form.url}
                   onChange={e => set('url', e.target.value)} placeholder="https://..." dir="ltr" />
          </div>

          {/* Social links */}
          <div className="pt-1">
            <p className="text-[13px] font-heebo font-semibold text-[#1C1916] mb-2.5">קישורים חברתיים</p>
            <div className="space-y-3">
              <div>
                <label className={LABEL}>Facebook URL</label>
                <input className={FIELD} value={form.facebook_url || ''}
                       onChange={e => set('facebook_url', e.target.value)} placeholder="https://facebook.com/..." dir="ltr" />
              </div>
              <div>
                <label className={LABEL}>Instagram URL</label>
                <input className={FIELD} value={form.instagram_url || ''}
                       onChange={e => set('instagram_url', e.target.value)} placeholder="https://instagram.com/..." dir="ltr" />
              </div>
              <div>
                <label className={LABEL}>Google Business URL</label>
                <input className={FIELD} value={form.google_url || ''}
                       onChange={e => set('google_url', e.target.value)} placeholder="https://g.page/..." dir="ltr" />
              </div>
              <div>
                <label className={LABEL}>WhatsApp (מספר בלבד)</label>
                <input className={FIELD} value={form.whatsapp || ''}
                       onChange={e => set('whatsapp', e.target.value)} placeholder="0501234567" dir="ltr" />
              </div>
            </div>
          </div>

          <div>
            <label className={LABEL}>לוגו (URL או העלאה)</label>
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
            <input ref={fileRef} type="file" accept="image/*" hidden onChange={handleFile} />
            <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading}
              className="mt-2 text-[12px] font-heebo font-medium text-[#C9A070] hover:text-[#1C1916] transition disabled:opacity-60">
              {uploading ? 'מעלה…' : '↑ העלאת קובץ לוגו'}
            </button>
          </div>

          {/* Gallery images */}
          <div>
            <label className={LABEL}>תמונות גלריה (עד 5 תמונות)</label>
            {(form.gallery_urls || []).length > 0 && (
              <div className="flex gap-2 flex-wrap mb-2">
                {(form.gallery_urls || []).map((url, i) => (
                  <div key={i} className="relative">
                    <img src={url} alt=""
                         className="w-16 h-16 rounded-xl object-cover border border-[#E3DCD2]"
                         onError={e => { e.currentTarget.style.opacity = '0.3' }} />
                    <button type="button" onClick={() => removeGallery(i)}
                      className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-[#C97A7A] text-white
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
              className="text-[12px] font-heebo font-medium text-[#C9A070] hover:text-[#1C1916] transition disabled:opacity-60">
              {galleryProgress !== null
                ? `מעלה ${galleryProgress}…`
                : `↑ הוספת תמונות לגלריה (${(form.gallery_urls || []).length}/5)`}
            </button>
          </div>

          {/* Gallery display type toggle */}
          <div className="rounded-xl border border-[#E3DCD2] bg-white overflow-hidden">
            <p className="text-[12px] font-heebo font-medium text-[#6B6460] px-3.5 pt-3 pb-2">
              סוג תצוגת תמונות
            </p>
            <div className="flex border-t border-[#F0EBE4]">
              {[
                { value: 'fanned', label: 'קלפים מאוורר', icon: '🃏' },
                { value: 'carousel', label: 'קרוסלה', icon: '🎠' },
              ].map(opt => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => set('gallery_display_type', opt.value)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-3 font-heebo text-[13px] transition-colors"
                  style={{
                    background: form.gallery_display_type === opt.value
                      ? 'rgba(201,160,112,0.12)' : 'transparent',
                    color: form.gallery_display_type === opt.value ? '#C9A070' : '#6B6460',
                    fontWeight: form.gallery_display_type === opt.value ? '600' : '400',
                    borderLeft: opt.value === 'carousel' ? '1px solid #F0EBE4' : 'none',
                  }}
                >
                  <span>{opt.icon}</span>
                  <span>{opt.label}</span>
                  {form.gallery_display_type === opt.value && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#C9A070] shrink-0" />
                  )}
                </button>
              ))}
            </div>
          </div>

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
