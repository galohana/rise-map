'use client'
import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CATEGORIES, categoryMeta } from '@/lib/categories'
import { ISRAELI_CITIES } from '@/lib/israeli-cities'

/* ── Desktop detection ───────────────────────────────────────────────── */
function useIsDesktop() {
  const [desktop, setDesktop] = useState(
    typeof window !== 'undefined' ? window.matchMedia('(min-width: 1024px)').matches : false
  )
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)')
    const fn = e => setDesktop(e.matches)
    mq.addEventListener('change', fn)
    return () => mq.removeEventListener('change', fn)
  }, [])
  return desktop
}

/* ── Autocomplete suggestions ────────────────────────────────────────── */
function buildSuggestions(studios, query) {
  if (!query || query.length < 2) return []
  const q = query.trim().toLowerCase()
  const seen = new Set()
  const results = []

  const push = (label, kind) => {
    const key = label + kind
    if (seen.has(key)) return
    seen.add(key)
    results.push({ label, kind })
  }

  studios.forEach(s => { if (s.business_name?.toLowerCase().includes(q)) push(s.business_name, 'business') })
  studios.forEach(s => { if (s.city?.toLowerCase().includes(q)) push(s.city, 'city') })
  ISRAELI_CITIES.forEach(c => { if (c.includes(q)) push(c, 'city') })

  results.sort((a, b) => {
    const aS = a.label.toLowerCase().startsWith(q) ? 0 : 1
    const bS = b.label.toLowerCase().startsWith(q) ? 0 : 1
    return aS - bS
  })
  return results.slice(0, 6)
}

/* ── Geo toast ───────────────────────────────────────────────────────── */
function GeoToast({ message, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 4500)
    return () => clearTimeout(t)
  }, [onClose])

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 6, scale: 0.96 }}
      transition={{ type: 'spring', stiffness: 380, damping: 28 }}
      className="flex items-center gap-2.5 font-heebo text-[13px] rounded-2xl px-4 py-2.5"
      style={{
        background: 'rgba(255,255,255,0.92)',
        border: '1px solid rgba(201,168,76,0.28)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.10)',
        color: '#6B5E4F',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
      }}
    >
      <span>📍</span>
      <span>{message}</span>
      <button onClick={onClose} className="text-zinc-400 hover:text-zinc-600 transition-colors ms-1">
        <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      </button>
    </motion.div>
  )
}

/* ── Autocomplete dropdown ───────────────────────────────────────────── */
function AutocompleteDropdown({ suggestions, onSelect }) {
  if (!suggestions.length) return null
  return (
    <motion.div
      initial={{ opacity: 0, y: -6, scaleY: 0.94 }}
      animate={{ opacity: 1, y: 0, scaleY: 1 }}
      exit={{ opacity: 0, y: -4, scaleY: 0.96 }}
      transition={{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
      style={{
        position: 'absolute',
        top: 'calc(100% + 8px)',
        right: 0, left: 0,
        background: 'rgba(255,255,255,0.97)',
        border: '1px solid rgba(160,124,48,0.18)',
        borderRadius: '14px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.12), 0 2px 8px rgba(160,124,48,0.08)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        overflow: 'hidden',
        zIndex: 20,
        transformOrigin: 'top center',
      }}
    >
      {suggestions.map((s, i) => (
        <motion.button
          key={s.label + s.kind}
          onClick={() => onSelect(s.label)}
          className="w-full flex items-center gap-3 px-4 py-2.5 font-heebo text-[14px] text-right transition-colors"
          style={{ borderBottom: i < suggestions.length - 1 ? '1px solid rgba(0,0,0,0.05)' : 'none' }}
          whileHover={{ background: 'rgba(250,246,238,0.85)' }}
          initial={{ opacity: 0, x: 6 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.03 }}
        >
          <span className="text-[15px] shrink-0">{s.kind === 'business' ? '🏪' : '📍'}</span>
          <span className="flex-1 text-right text-zinc-800 truncate">{s.label}</span>
          <span
            className="shrink-0 text-[10px] rounded-full px-2 py-0.5"
            style={{
              background: s.kind === 'business' ? 'rgba(160,124,48,0.10)' : 'rgba(0,0,0,0.05)',
              color: s.kind === 'business' ? '#a07c30' : '#888',
            }}
          >
            {s.kind === 'business' ? 'עסק' : 'עיר'}
          </span>
        </motion.button>
      ))}
    </motion.div>
  )
}

/* ── Main component ──────────────────────────────────────────────────── */
export default function SearchHome({
  studios, filters,
  onSearch, onCategorySelect, onGeolocate,
  geoError, onClearGeoError,
  onOpenPromo,
}) {
  const [query, setQuery] = useState(filters.search || '')
  const [suggestions, setSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [localGeoErr, setLocalGeoErr] = useState('')
  const wrapperRef = useRef(null)
  const isDesktop = useIsDesktop()

  useEffect(() => { if (geoError) setLocalGeoErr(geoError) }, [geoError])

  useEffect(() => {
    if (query.length >= 2) {
      setSuggestions(buildSuggestions(studios, query))
      setShowSuggestions(true)
    } else {
      setSuggestions([])
      setShowSuggestions(false)
    }
  }, [query, studios])

  useEffect(() => {
    const fn = e => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target))
        setShowSuggestions(false)
    }
    document.addEventListener('mousedown', fn)
    return () => document.removeEventListener('mousedown', fn)
  }, [])

  const handleSubmit = e => {
    e.preventDefault()
    setShowSuggestions(false)
    if (query.trim()) onSearch(query.trim())
  }

  const handleSelect = useCallback(label => {
    setQuery(label)
    setShowSuggestions(false)
    onSearch(label)
  }, [onSearch])

  const handleKey = e => { if (e.key === 'Escape') setShowSuggestions(false) }

  const handleGeoClick = () => onGeolocate(msg => setLocalGeoErr(msg))

  const clearGeoErr = useCallback(() => {
    setLocalGeoErr('')
    onClearGeoError?.()
  }, [onClearGeoError])

  return (
    <motion.div
      className="fixed inset-0 z-[1000] flex flex-col items-center justify-center overflow-hidden"
      style={{
        background: isDesktop
          ? 'rgba(250,247,240,0.55)'
          : 'linear-gradient(170deg, #fffef9 0%, #faf6ee 40%, #f5f0e8 100%)',
        backdropFilter: isDesktop ? 'blur(10px)' : 'none',
        WebkitBackdropFilter: isDesktop ? 'blur(10px)' : 'none',
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -20, filter: 'blur(4px)', transition: { duration: 0.25 } }}
      transition={{ duration: 0.3 }}
      dir="rtl"
    >
      {/* Mobile-only: warm glows */}
      {!isDesktop && (
        <>
          <div className="absolute pointer-events-none" style={{
            top: '-10%', left: '50%', transform: 'translateX(-50%)',
            width: '100vw', height: '65vh',
            background: 'radial-gradient(ellipse at center top, rgba(201,168,76,0.17) 0%, transparent 60%)',
            filter: 'blur(55px)',
          }} />
          <div className="absolute pointer-events-none" style={{
            bottom: '8%', left: '-5%',
            width: '50vw', height: '35vh',
            background: 'radial-gradient(ellipse, rgba(232,114,154,0.06) 0%, transparent 70%)',
            filter: 'blur(60px)',
          }} />
        </>
      )}

      {/* Content card — glass on desktop, plain on mobile */}
      <div
        className="relative z-10 w-full flex flex-col items-center"
        style={isDesktop ? {
          maxWidth: '580px',
          background: 'rgba(255,254,250,0.88)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          borderRadius: '28px',
          border: '1px solid rgba(255,255,255,0.7)',
          boxShadow: '0 24px 80px rgba(0,0,0,0.12), 0 2px 12px rgba(160,124,48,0.08)',
          padding: '40px 44px 36px',
        } : {
          paddingLeft: '24px',
          paddingRight: '24px',
          paddingBottom: '56px',
        }}
      >
        {/* RISE wordmark */}
        <motion.button
          onClick={onOpenPromo}
          initial={{ opacity: 0, y: -24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.04, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          whileHover={{ opacity: 0.72 }}
          whileTap={{ scale: 0.97 }}
          className="flex flex-col items-center mb-2"
        >
          <span
            className="font-frank font-bold leading-none"
            style={{
              fontSize: isDesktop ? '64px' : 'clamp(46px, 14vw, 78px)',
              color: '#a07c30',
              letterSpacing: '0.3em',
              paddingInlineStart: '0.3em',
            }}
          >
            RISE
          </span>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.28, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            style={{
              width: '36px', height: '1.5px', marginTop: '8px',
              background: 'linear-gradient(90deg, transparent, #a07c30bb, transparent)',
              borderRadius: '1px',
            }}
          />
        </motion.button>

        {/* Studio count */}
        {studios.length > 0 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="font-heebo text-center mb-7"
            style={{ fontSize: '12px', color: '#b0a090', letterSpacing: '0.12em' }}
          >
            {studios.length} סטודיואות ברחבי הארץ
          </motion.p>
        )}

        {/* Search + autocomplete */}
        <motion.div
          ref={wrapperRef}
          className="w-full relative mb-4"
          style={{ maxWidth: isDesktop ? '100%' : '440px' }}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <form onSubmit={handleSubmit} className="w-full">
            <div className="relative">
              <input
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={handleKey}
                onFocus={() => query.length >= 2 && setShowSuggestions(true)}
                placeholder="עיר, שם עסק..."
                autoComplete="off"
                autoCorrect="off"
                className="w-full font-heebo text-base"
                style={{
                  height: '56px',
                  paddingRight: '20px',
                  paddingLeft: '52px',
                  borderRadius: '16px',
                  background: 'rgba(255,255,255,0.88)',
                  border: '1.5px solid rgba(160,124,48,0.22)',
                  boxShadow: '0 2px 20px rgba(160,124,48,0.10), 0 1px 4px rgba(0,0,0,0.06)',
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  color: '#1a1714',
                  outline: 'none',
                  transition: 'border-color 0.2s, box-shadow 0.2s',
                }}
                onFocusCapture={e => {
                  e.target.style.borderColor = 'rgba(160,124,48,0.55)'
                  e.target.style.boxShadow = '0 2px 24px rgba(160,124,48,0.18), 0 1px 4px rgba(0,0,0,0.06)'
                }}
                onBlur={e => {
                  e.target.style.borderColor = 'rgba(160,124,48,0.22)'
                  e.target.style.boxShadow = '0 2px 20px rgba(160,124,48,0.10), 0 1px 4px rgba(0,0,0,0.06)'
                }}
              />
              <button
                type="submit"
                className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center justify-center rounded-xl transition-all hover:scale-110 active:scale-95"
                style={{ width: '36px', height: '36px', background: 'rgba(160,124,48,0.12)' }}
                aria-label="חיפוש"
              >
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none"
                  stroke="#a07c30" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" />
                </svg>
              </button>
            </div>
          </form>

          <AnimatePresence>
            {showSuggestions && suggestions.length > 0 && (
              <AutocompleteDropdown suggestions={suggestions} onSelect={handleSelect} />
            )}
          </AnimatePresence>
        </motion.div>

        {/* Category chips */}
        <motion.div
          className="flex items-center gap-2 flex-wrap justify-center mb-6"
          style={{ maxWidth: isDesktop ? '100%' : '440px' }}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          {CATEGORIES.map((cat, i) => {
            const meta = categoryMeta(cat)
            return (
              <motion.button
                key={cat}
                onClick={() => onCategorySelect(cat)}
                whileHover={{ scale: 1.07, y: -2, boxShadow: `0 4px 16px ${meta.color}28` }}
                whileTap={{ scale: 0.93 }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.07, duration: 0.4 }}
                className="flex items-center gap-2 font-heebo text-sm"
                style={{
                  padding: '8px 16px',
                  borderRadius: '100px',
                  background: 'rgba(255,255,255,0.78)',
                  border: `1.5px solid ${meta.color}48`,
                  color: meta.text,
                  boxShadow: `0 2px 10px ${meta.color}16`,
                  transition: 'box-shadow 0.2s',
                }}
              >
                <span style={{ fontSize: '15px' }}>{meta.emoji}</span>
                <span>{meta.label}</span>
              </motion.button>
            )
          })}
        </motion.div>

        {/* Geo button + toast */}
        <div className="flex flex-col items-center gap-3">
          <motion.button
            onClick={handleGeoClick}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.48 }}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.94 }}
            className="flex items-center gap-2 font-heebo text-sm"
            style={{
              padding: '9px 20px',
              borderRadius: '100px',
              border: '1px solid rgba(160,124,48,0.28)',
              color: '#9a8c7a',
              background: 'rgba(255,255,255,0.52)',
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3"/>
              <path d="M12 2v3M12 19v3M2 12h3M19 12h3"/>
              <circle cx="12" cy="12" r="8" strokeDasharray="4 2" opacity="0.4"/>
            </svg>
            <span>קרוב אליי</span>
          </motion.button>

          <AnimatePresence>
            {localGeoErr && (
              <GeoToast message={localGeoErr} onClose={clearGeoErr} />
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* SEO */}
      <div className="sr-only" aria-hidden="true">
        {studios.map(s => (
          <span key={s.id}>{s.business_name} {s.city} {s.type} {s.owner_name} </span>
        ))}
        <span>סטודיו גבות לק מספרה קוסמטיקה ישראל</span>
      </div>
    </motion.div>
  )
}
