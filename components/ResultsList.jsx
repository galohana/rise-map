'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { CATEGORIES, categoryMeta, pinGlyph } from '@/lib/categories'
import { useFavorites } from '@/lib/useFavorites'

function SocialMini({ studio }) {
  const links = []
  if (studio.facebook_url)
    links.push({ key: 'fb', href: studio.facebook_url, label: 'Facebook', bg: '#1877F2',
      svg: <path fill="#fff" d="M13.5 21v-7h2.3l.4-2.8h-2.7V9.4c0-.8.2-1.4 1.4-1.4h1.4V5.6c-.7-.1-1.4-.1-2.1-.1-2.1 0-3.5 1.3-3.5 3.6v2.1H8.3V14h2.3v7h2.9z"/> })
  if (studio.instagram_url)
    links.push({ key: 'ig', href: studio.instagram_url, label: 'Instagram',
      bg: 'linear-gradient(45deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)',
      svg: <><rect x="6" y="6" width="12" height="12" rx="3.5" fill="none" stroke="#fff" strokeWidth="1.8"/><circle cx="12" cy="12" r="3" fill="none" stroke="#fff" strokeWidth="1.8"/><circle cx="15.6" cy="8.4" r="1" fill="#fff"/></> })
  if (studio.whatsapp) {
    const wa = String(studio.whatsapp).replace(/\D/g, '').replace(/^0/, '')
    links.push({ key: 'wa', href: `https://wa.me/972${wa}`, label: 'WhatsApp', bg: '#25D366',
      svg: <path fill="#fff" d="M12 4a8 8 0 00-6.9 12l-1 3.6 3.7-1A8 8 0 1012 4zm0 1.6a6.4 6.4 0 11-3.3 11.9l-.3-.2-2.2.6.6-2.1-.2-.3A6.4 6.4 0 0112 5.6zm3.6 8c-.2-.1-1.2-.6-1.3-.6-.2-.1-.3-.1-.4.1l-.6.7c-.1.1-.2.1-.4 0a5.2 5.2 0 01-2.6-2.3c-.2-.3.2-.3.5-1 0-.1 0-.2 0-.3l-.6-1.4c-.1-.3-.3-.3-.4-.3h-.4a.8.8 0 00-.6.3c-.2.2-.7.7-.7 1.7s.8 2 .9 2.1c.1.2 1.6 2.5 3.9 3.4 1.5.6 2 .6 2.7.5.4 0 1.2-.5 1.4-1 .2-.5.2-.9.1-1z"/> })
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
          <svg width="14" height="14" viewBox="0 0 24 24">{l.svg}</svg>
        </a>
      ))}
    </div>
  )
}

function ResultCard({ studio, onClick, index, isFav, onToggleFav }) {
  const { color, soft, text } = categoryMeta(studio.type)
  const glyph = pinGlyph(studio)
  const hasYears    = studio.years_experience != null && studio.years_experience !== ''
  const hasSpecialty = Boolean(studio.specialty?.trim())
  const isAccepting  = studio.is_accepting_clients !== false

  return (
    <motion.article
      onClick={() => onClick(studio)}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.045, type: 'spring', stiffness: 320, damping: 28 }}
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
            <img src={studio.logo_url} alt={studio.business_name}
                 className="w-12 h-12 rounded-xl object-cover"
                 style={{ border: `2px solid ${color}` }} />
          ) : (
            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl"
                 style={{ background: soft, border: `2px solid ${color}40` }}>
              {glyph}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-0.5 flex-wrap">
            <h3 className="font-frank text-[16px] font-bold text-zinc-900 leading-tight">
              {studio.business_name}
            </h3>
            <span className="shrink-0 px-2 py-0.5 rounded-full text-[10px] font-heebo font-semibold"
                  style={{ background: soft, color: text }}>
              {studio.type}
            </span>
            {/* Availability badge */}
            <span
              className="shrink-0 px-1.5 py-0.5 rounded-full text-[9px] font-heebo font-medium"
              style={isAccepting
                ? { background: 'rgba(16,185,129,0.10)', color: '#059669' }
                : { background: 'rgba(0,0,0,0.06)', color: '#999' }
              }
            >
              {isAccepting ? '✓ פנוי' : '✗ לא פנוי'}
            </span>
          </div>

          <p className="font-heebo text-[13px] text-zinc-500 truncate mb-1">
            📍 {studio.address || studio.city}
            {studio.city && studio.address ? `, ${studio.city}` : ''}
          </p>

          {/* Hours */}
          {studio.opening_hours && (
            <p className="font-heebo text-[11.5px] text-zinc-400 mb-1.5 truncate">
              🕐 {studio.opening_hours}
            </p>
          )}

          {(hasYears || hasSpecialty) && (
            <p className="font-heebo text-[12px] text-zinc-400 mb-2">
              {hasYears && `${studio.years_experience} שנות ניסיון`}
              {hasYears && hasSpecialty && ' · '}
              {hasSpecialty && <span style={{ color }}>{studio.specialty}</span>}
            </p>
          )}

          <div className="flex items-center justify-between gap-2">
            <SocialMini studio={studio} />
            <div className="flex items-center gap-2">
              {/* Favorite button */}
              <motion.button
                onClick={e => { e.stopPropagation(); onToggleFav(studio.id) }}
                whileTap={{ scale: 0.8 }}
                className="w-7 h-7 rounded-full flex items-center justify-center transition-all"
                style={{ background: isFav ? `${color}18` : 'rgba(0,0,0,0.04)' }}
                aria-label={isFav ? 'הסר ממועדפים' : 'הוסף למועדפים'}
              >
                <svg width="13" height="13" viewBox="0 0 24 24"
                  fill={isFav ? color : 'none'}
                  stroke={isFav ? color : '#bbb'}
                  strokeWidth={isFav ? 0 : 2}
                  strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
                </svg>
              </motion.button>
              <span className="font-heebo text-[12px] font-semibold shrink-0" style={{ color }}>
                ראי פרטים ←
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.article>
  )
}

export default function ResultsList({ studios, filters, listMode, onBack, onCardClick, onFiltersChange }) {
  const activeCategory = filters.type !== 'הכל' ? filters.type : null
  const { isFav, toggle: toggleFav } = useFavorites()

  const listTitle = listMode === 'favorites' ? '❤️ שאהבתי'
    : listMode === 'history' ? '🕐 ביקרתי לאחרונה'
    : null

  return (
    <motion.div
      className="fixed inset-0 z-[1000] flex flex-col"
      style={{ background: '#ffffff' }}
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
          background: 'rgba(255,255,255,0.96)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(0,0,0,0.06)',
        }}
      >
        {/* Back + count */}
        <div className="flex items-center gap-3 mb-3">
          <button onClick={onBack}
            className="w-8 h-8 rounded-full flex items-center justify-center transition-colors hover:bg-zinc-200"
            style={{ background: 'rgba(0,0,0,0.06)' }} aria-label="חזרה">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
              stroke="#374151" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
          <span className="font-heebo text-[13px] text-zinc-500">
            {listTitle ? listTitle : (
              <>
                {studios.length === 0 ? 'לא נמצאו תוצאות' :
                  `${studios.length} ${studios.length === 1 ? 'סטודיו' : 'סטודיואות'}`}
                {activeCategory ? ` · ${activeCategory}` : ''}
                {filters.search ? ` · "${filters.search}"` : ''}
              </>
            )}
          </span>
        </div>

        {/* Mini search — hidden in favorites/history mode */}
        {!listMode && <div className="relative mb-2.5">
          <input
            type="text"
            value={filters.search}
            onChange={e => onFiltersChange?.(prev => ({ ...prev, search: e.target.value }))}
            placeholder="עיר או שם עסק..."
            className="w-full font-heebo text-sm text-zinc-800"
            style={{
              height: '42px', paddingRight: '16px', paddingLeft: '44px',
              borderRadius: '12px', background: 'white',
              border: '1px solid rgba(0,0,0,0.09)', outline: 'none',
              transition: 'border-color 0.2s',
            }}
            onFocus={e => (e.target.style.borderColor = 'rgba(0,0,0,0.2)')}
            onBlur={e => (e.target.style.borderColor = 'rgba(0,0,0,0.09)')}
          />
          <svg className="absolute left-3 top-1/2 -translate-y-1/2"
            width="15" height="15" viewBox="0 0 24 24" fill="none"
            stroke="#9ca3af" strokeWidth="2.2" strokeLinecap="round">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          {filters.search && (
            <button
              onClick={() => onFiltersChange?.(prev => ({ ...prev, search: '' }))}
              className="absolute left-10 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full flex items-center justify-center text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 transition-colors text-sm leading-none">
              ×
            </button>
          )}
        </div>}

        {/* Category chips — hidden in listMode */}
        {!listMode && (
          <div className="flex gap-1.5 overflow-x-auto no-scrollbar">
            <button
              onClick={() => onFiltersChange?.(prev => ({ ...prev, type: 'הכל' }))}
              className="shrink-0 px-3 py-1.5 rounded-full font-heebo text-[12px] transition-all"
              style={{
                background: !activeCategory ? '#1a6b7a' : 'transparent',
                color: !activeCategory ? 'white' : '#555',
                border: `1px solid ${!activeCategory ? '#1a6b7a' : 'rgba(0,0,0,0.12)'}`,
              }}>
              הכל
            </button>
            {CATEGORIES.map(cat => {
              const meta = categoryMeta(cat)
              const active = activeCategory === cat
              return (
                <button key={cat}
                  onClick={() => onFiltersChange?.(prev => ({ ...prev, type: active ? 'הכל' : cat }))}
                  className="shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-full font-heebo text-[12px] transition-all"
                  style={{
                    background: active ? meta.color : 'transparent',
                    color: active ? 'white' : meta.text,
                    border: `1px solid ${active ? meta.color : meta.color + '50'}`,
                  }}>
                  {meta.emoji} {meta.label}
                </button>
              )
            })}
          </div>
        )}
      </div>

      {/* Cards — max-width on desktop */}
      <div className="flex-1 overflow-y-auto py-3">
        <div className="max-w-2xl mx-auto">
          <AnimatePresence mode="popLayout">
            {studios.length > 0 ? (
              studios.map((s, i) => (
                <ResultCard
                  key={s.id}
                  studio={s}
                  onClick={onCardClick}
                  index={i}
                  isFav={isFav(s.id)}
                  onToggleFav={toggleFav}
                />
              ))
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center h-52 text-center px-8">
                <span className="text-4xl mb-3">🔍</span>
                <p className="font-heebo text-zinc-500 text-sm">לא נמצאו תוצאות</p>
                <p className="font-heebo text-zinc-400 text-xs mt-1">נסי חיפוש אחר</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  )
}
