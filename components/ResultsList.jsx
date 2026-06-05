'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { CATEGORIES, categoryMeta, pinGlyph } from '@/lib/categories'

function SocialMini({ studio }) {
  const links = []
  if (studio.facebook_url)
    links.push({ key: 'fb', href: studio.facebook_url, label: 'Facebook', bg: '#1877F2', char: 'f' })
  if (studio.instagram_url)
    links.push({ key: 'ig', href: studio.instagram_url, label: 'Instagram', bg: 'linear-gradient(45deg,#f09433,#dc2743,#bc1888)', char: '◉' })
  if (studio.whatsapp) {
    const wa = String(studio.whatsapp).replace(/\D/g, '').replace(/^0/, '')
    links.push({ key: 'wa', href: `https://wa.me/972${wa}`, label: 'WhatsApp', bg: '#25D366', char: 'W' })
  }
  if (!links.length) return null
  return (
    <div className="flex items-center gap-1.5">
      {links.map(l => (
        <a key={l.key} href={l.href} target="_blank" rel="noopener noreferrer"
           aria-label={l.label}
           onClick={e => e.stopPropagation()}
           className="w-6 h-6 rounded-full flex items-center justify-center transition-transform hover:scale-110 active:scale-95"
           style={{ background: l.bg, boxShadow: '0 1px 4px rgba(0,0,0,0.18)' }}>
          <span className="text-white text-[10px] font-bold leading-none">{l.char}</span>
        </a>
      ))}
    </div>
  )
}

function ResultCard({ studio, onClick, index }) {
  const { color, soft, text } = categoryMeta(studio.type)
  const glyph = pinGlyph(studio)
  const hasYears = studio.years_experience != null && studio.years_experience !== ''
  const hasSpecialty = Boolean(studio.specialty?.trim())

  return (
    <motion.article
      onClick={() => onClick(studio)}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.055, type: 'spring', stiffness: 320, damping: 28 }}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.985 }}
      className="mx-4 mb-3 rounded-2xl cursor-pointer overflow-hidden"
      style={{
        background: 'rgba(255,255,255,0.94)',
        border: '1px solid rgba(0,0,0,0.055)',
        boxShadow: '0 2px 10px rgba(0,0,0,0.055)',
        borderRight: `3.5px solid ${color}`,
      }}
    >
      <div className="p-4 flex items-start gap-3">
        {/* Avatar */}
        <div className="shrink-0">
          {studio.logo_url ? (
            <img
              src={studio.logo_url}
              alt={studio.business_name}
              className="w-12 h-12 rounded-xl object-cover"
              style={{ border: `2px solid ${color}` }}
            />
          ) : (
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center text-xl"
              style={{ background: soft, border: `2px solid ${color}40` }}
            >
              {glyph}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5 flex-wrap">
            <h3 className="font-frank text-[16px] font-bold text-zinc-900 leading-tight">
              {studio.business_name}
            </h3>
            <span
              className="shrink-0 px-2 py-0.5 rounded-full text-[10px] font-heebo font-semibold"
              style={{ background: soft, color: text }}
            >
              {studio.type}
            </span>
          </div>

          <p className="font-heebo text-[13px] text-zinc-500 truncate mb-1.5">
            📍 {studio.address || studio.city}
            {studio.city && studio.address ? `, ${studio.city}` : ''}
          </p>

          {(hasYears || hasSpecialty) && (
            <p className="font-heebo text-[12px] text-zinc-400 mb-2">
              {hasYears && `${studio.years_experience} שנות ניסיון`}
              {hasYears && hasSpecialty && ' · '}
              {hasSpecialty && <span style={{ color }}>{studio.specialty}</span>}
            </p>
          )}

          <div className="flex items-center justify-between gap-2">
            <SocialMini studio={studio} />
            <span
              className="font-heebo text-[12px] font-semibold shrink-0"
              style={{ color }}
            >
              לחץ לפרטים ומפה ←
            </span>
          </div>
        </div>
      </div>
    </motion.article>
  )
}

export default function ResultsList({ studios, filters, onBack, onCardClick, onFiltersChange }) {
  const activeCategory = filters.type !== 'הכל' ? filters.type : null

  return (
    <motion.div
      className="fixed inset-0 z-[1000] flex flex-col"
      style={{ background: '#FAF8F5' }}
      initial={{ opacity: 0, y: 22 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 22, transition: { duration: 0.22 } }}
      transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
      dir="rtl"
    >
      {/* Sticky header */}
      <div
        className="sticky top-0 z-10 px-4 pt-4 pb-3 flex-shrink-0"
        style={{
          background: 'rgba(250,248,245,0.93)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(0,0,0,0.06)',
        }}
      >
        {/* Back + count row */}
        <div className="flex items-center gap-3 mb-3">
          <button
            onClick={onBack}
            className="w-8 h-8 rounded-full flex items-center justify-center transition-colors hover:bg-zinc-200"
            style={{ background: 'rgba(0,0,0,0.06)' }}
            aria-label="חזרה"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
              stroke="#374151" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
          <span className="font-heebo text-[13px] text-zinc-500">
            {studios.length === 0 ? 'לא נמצאו תוצאות' :
              `${studios.length} ${studios.length === 1 ? 'סטודיו' : 'סטודיואות'}`}
            {activeCategory ? ` · ${activeCategory}` : ''}
            {filters.search ? ` · "${filters.search}"` : ''}
          </span>
        </div>

        {/* Mini search bar */}
        <div className="relative mb-2.5">
          <input
            type="text"
            value={filters.search}
            onChange={e => onFiltersChange(prev => ({ ...prev, search: e.target.value }))}
            placeholder="עיר או שם עסק..."
            className="w-full font-heebo text-sm text-zinc-800"
            style={{
              height: '42px',
              paddingRight: '16px',
              paddingLeft: '44px',
              borderRadius: '12px',
              background: 'white',
              border: '1px solid rgba(0,0,0,0.09)',
              outline: 'none',
              transition: 'border-color 0.2s',
            }}
            onFocus={e => (e.target.style.borderColor = 'rgba(0,0,0,0.2)')}
            onBlur={e => (e.target.style.borderColor = 'rgba(0,0,0,0.09)')}
          />
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2"
            width="15" height="15" viewBox="0 0 24 24" fill="none"
            stroke="#9ca3af" strokeWidth="2.2" strokeLinecap="round">
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
          </svg>
          {filters.search && (
            <button
              onClick={() => onFiltersChange(prev => ({ ...prev, search: '' }))}
              className="absolute left-10 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full flex items-center justify-center text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 transition-colors text-sm leading-none"
            >
              ×
            </button>
          )}
        </div>

        {/* Category chips */}
        <div className="flex gap-1.5 overflow-x-auto no-scrollbar">
          <button
            onClick={() => onFiltersChange(prev => ({ ...prev, type: 'הכל' }))}
            className="shrink-0 px-3 py-1.5 rounded-full font-heebo text-[12px] transition-all"
            style={{
              background: !activeCategory ? '#1a1a1a' : 'transparent',
              color: !activeCategory ? 'white' : '#555',
              border: `1px solid ${!activeCategory ? '#1a1a1a' : 'rgba(0,0,0,0.12)'}`,
            }}
          >
            הכל
          </button>
          {CATEGORIES.map(cat => {
            const meta = categoryMeta(cat)
            const active = activeCategory === cat
            return (
              <button
                key={cat}
                onClick={() => onFiltersChange(prev => ({ ...prev, type: active ? 'הכל' : cat }))}
                className="shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-full font-heebo text-[12px] transition-all"
                style={{
                  background: active ? meta.color : 'transparent',
                  color: active ? 'white' : meta.text,
                  border: `1px solid ${active ? meta.color : meta.color + '50'}`,
                }}
              >
                {meta.emoji} {meta.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Cards */}
      <div className="flex-1 overflow-y-auto py-3">
        <AnimatePresence mode="popLayout">
          {studios.length > 0 ? (
            studios.map((s, i) => (
              <ResultCard key={s.id} studio={s} onClick={onCardClick} index={i} />
            ))
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center h-52 text-center px-8"
            >
              <span className="text-4xl mb-3">🔍</span>
              <p className="font-heebo text-zinc-500 text-sm">לא נמצאו תוצאות</p>
              <p className="font-heebo text-zinc-400 text-xs mt-1">נסי חיפוש אחר</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
