'use client'
import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CATEGORIES, categoryMeta } from '@/lib/categories'
import { ISRAELI_CITIES } from '@/lib/israeli-cities'
import { useFavorites } from '@/lib/useFavorites'
import { useHistory } from '@/lib/useHistory'
import { RiseLogo } from '@/components/Header'

/* ── Desktop detection ───────────────────────────────────────────────── */
function useIsDesktop() {
  const [d, setD] = useState(
    typeof window !== 'undefined' ? window.matchMedia('(min-width: 1024px)').matches : false
  )
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)')
    const fn = e => setD(e.matches)
    mq.addEventListener('change', fn)
    return () => mq.removeEventListener('change', fn)
  }, [])
  return d
}

/* ── Haversine distance (km) ─────────────────────────────────────────── */
function haversine(lat1, lon1, lat2, lon2) {
  const R = 6371
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
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

/* ── Category SVG icons ──────────────────────────────────────────────── */
function EyeIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  )
}
function NailIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2L9.5 7h5L12 2z"/>
      <rect x="9" y="7" width="6" height="13" rx="2"/>
      <line x1="9" y1="11" x2="15" y2="11"/>
    </svg>
  )
}
function ScissorsIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="6" cy="6" r="3"/>
      <circle cx="6" cy="18" r="3"/>
      <line x1="20" y1="4" x2="8.12" y2="15.88"/>
      <line x1="14.47" y1="14.48" x2="20" y2="20"/>
      <line x1="8.12" y1="8.12" x2="12" y2="12"/>
    </svg>
  )
}
function HeartIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
    </svg>
  )
}
function ClockIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9"/>
      <path d="M12 7v5l3.5 2"/>
    </svg>
  )
}

const CATEGORY_ICONS = {
  'גבות': EyeIcon,
  'לק': NailIcon,
  'מספרה': ScissorsIcon,
}

/* ── Geo toast ───────────────────────────────────────────────────────── */
function GeoToast({ message, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 4500)
    return () => clearTimeout(t)
  }, [onClose])

  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 4, scale: 0.96 }}
      transition={{ type: 'spring', stiffness: 380, damping: 28 }}
      className="flex items-center gap-2.5 font-heebo text-[13px] rounded-2xl px-4 py-2.5"
      style={{
        background: 'rgba(255,255,255,0.95)',
        border: '1px solid rgba(26,107,122,0.22)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.10)',
        color: '#374151',
      }}
    >
      <span style={{ color: '#1a6b7a' }}>📍</span>
      <span>{message}</span>
      <button onClick={onClose} className="text-zinc-400 hover:text-zinc-600 ms-1">
        <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
          <path d="M18 6L6 18M6 6l12 12"/>
        </svg>
      </button>
    </motion.div>
  )
}

/* ── Small studio mini-card (for nearby / favorites / history) ───────── */
function StudioMiniCard({ studio, dist, onClick, index = 0 }) {
  const { color, emoji } = categoryMeta(studio.type)
  return (
    <motion.button
      onClick={() => onClick(studio)}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, type: 'spring', stiffness: 320, damping: 28 }}
      whileHover={{ y: -3, boxShadow: '0 8px 24px rgba(26,107,122,0.14)' }}
      whileTap={{ scale: 0.95 }}
      className="flex-shrink-0 flex flex-col items-center text-center font-heebo"
      style={{
        width: '108px',
        background: '#ffffff',
        border: '1.5px solid #e5e7eb',
        borderRadius: '16px',
        padding: '14px 10px 12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
        cursor: 'pointer',
      }}
    >
      {studio.logo_url ? (
        <img
          src={studio.logo_url}
          alt={studio.business_name}
          style={{
            width: 48, height: 48, borderRadius: '50%', objectFit: 'cover',
            border: `2px solid ${color}40`, marginBottom: 8, flexShrink: 0,
          }}
        />
      ) : (
        <div style={{
          width: 48, height: 48, borderRadius: '50%', background: `${color}18`,
          border: `2px solid ${color}40`, marginBottom: 8, flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 22,
        }}>
          {emoji}
        </div>
      )}
      <span style={{
        fontSize: '12px', fontWeight: 600, color: '#1a1a1a',
        lineHeight: 1.3, display: '-webkit-box', WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical', overflow: 'hidden',
        marginBottom: dist != null ? 4 : 0,
      }}>
        {studio.business_name}
      </span>
      {dist != null && (
        <span style={{ fontSize: '11px', color: '#1a6b7a', fontWeight: 500 }}>
          {dist < 1 ? `${Math.round(dist * 1000)} מ'` : `${dist.toFixed(1)} ק"מ`}
        </span>
      )}
      {dist == null && studio.city && (
        <span style={{ fontSize: '11px', color: '#9ca3af' }}>{studio.city}</span>
      )}
    </motion.button>
  )
}

/* ── Section title ───────────────────────────────────────────────────── */
function SectionTitle({ icon, title, subtitle }) {
  return (
    <div className="mb-3">
      <div className="flex items-center gap-2 mb-0.5">
        <span style={{ fontSize: 16 }}>{icon}</span>
        <h3 className="font-frank font-bold text-[15px]" style={{ color: '#1a1a1a' }}>{title}</h3>
      </div>
      {subtitle && (
        <p className="font-heebo text-[12px]" style={{ color: '#9ca3af', paddingInlineStart: '24px' }}>
          {subtitle}
        </p>
      )}
    </div>
  )
}

/* ── Main component ──────────────────────────────────────────────────── */
export default function SearchHome({
  studios, filters,
  onSearch, onCategorySelect, onGeolocate,
  geoError, onClearGeoError,
  onOpenPromo,
  onStudioClick,
}) {
  const [query, setQuery]               = useState(filters.search || '')
  const [suggestions, setSuggestions]   = useState([])
  const [showSuggestions, setShowSugs]  = useState(false)
  const [localGeoErr, setLocalGeoErr]   = useState('')
  const [userLocation, setUserLocation] = useState(null)
  const [geoLoading, setGeoLoading]     = useState(false)
  const wrapperRef                      = useRef(null)
  const isDesktop                       = useIsDesktop()

  const [showFavorites, setShowFavorites] = useState(false)
  const [showHistory, setShowHistory]     = useState(false)

  const { isFav, toggle: toggleFav }    = useFavorites()
  const { history, refresh: refreshHistory } = useHistory()

  /* Refresh history when panel becomes visible */
  useEffect(() => { refreshHistory() }, [refreshHistory])

  useEffect(() => { if (geoError) setLocalGeoErr(geoError) }, [geoError])

  useEffect(() => {
    if (query.length >= 2) {
      setSuggestions(buildSuggestions(studios, query))
      setShowSugs(true)
    } else {
      setSuggestions([])
      setShowSugs(false)
    }
  }, [query, studios])

  useEffect(() => {
    const fn = e => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target))
        setShowSugs(false)
    }
    document.addEventListener('mousedown', fn)
    return () => document.removeEventListener('mousedown', fn)
  }, [])

  const handleSubmit = e => {
    e.preventDefault()
    setShowSugs(false)
    if (query.trim()) onSearch(query.trim())
  }

  const handleSelect = useCallback(label => {
    setQuery(label)
    setShowSugs(false)
    onSearch(label)
  }, [onSearch])

  const handleGeoClick = () => {
    setGeoLoading(true)
    // Single call from user gesture — triggers native iOS location dialog
    onGeolocate(msg => {
      setLocalGeoErr(msg)
      setGeoLoading(false)
    })
  }

  const clearGeoErr = useCallback(() => {
    setLocalGeoErr('')
    onClearGeoError?.()
  }, [onClearGeoError])

  /* Nearby studios — sorted by distance if location known, else first 3 as preview */
  const nearbyStudios = userLocation
    ? studios
        .filter(s => !isNaN(Number(s.lat)) && !isNaN(Number(s.lng)))
        .map(s => ({
          ...s,
          dist: haversine(userLocation.lat, userLocation.lng, Number(s.lat), Number(s.lng)),
        }))
        .sort((a, b) => a.dist - b.dist)
        .slice(0, 8)
    : studios.slice(0, 3)

  /* Favorite studios */
  const favStudios = studios.filter(s => isFav(s.id))

  /* History studios — look up by id for live data, fallback to history item */
  const historyStudios = history
    .map(h => studios.find(s => s.id === h.id) || h)
    .filter(Boolean)

  /* Studio click handler — passed from HomeClient via prop, or fallback to onSearch */
  const handleStudioClick = useCallback(studio => {
    if (onStudioClick) onStudioClick(studio)
  }, [onStudioClick])

  const contentMaxW = isDesktop ? '540px' : '440px'

  return (
    <motion.div
      className="fixed inset-0 z-[1000] overflow-y-auto"
      style={{ background: '#ffffff', WebkitOverflowScrolling: 'touch' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -16, filter: 'blur(4px)', transition: { duration: 0.22 } }}
      transition={{ duration: 0.25 }}
      dir="rtl"
    >
      {/* Desktop blurred map overlay */}
      {isDesktop && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: -1,
          background: 'rgba(232,244,246,0.55)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
        }} />
      )}

      {/* Main content */}
      <div
        className="min-h-full flex flex-col items-center"
        style={{
          padding: isDesktop ? '8px 24px 80px' : '0px 20px 80px',
        }}
      >
        {/* ── RISE Logo ── */}
        <motion.button
          onClick={onOpenPromo}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.04, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          whileHover={{ opacity: 0.78 }}
          whileTap={{ scale: 0.97 }}
          className="mb-2 flex items-center justify-center"
          style={{ maxWidth: contentMaxW, width: '100%' }}
          aria-label="אודות RISE"
        >
          <RiseLogo height={isDesktop ? 190 : 163} />
        </motion.button>

        {/* ── Studio count ── */}
        {studios.length > 0 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.14 }}
            className="font-heebo text-center mb-5"
            style={{ fontSize: '12px', color: '#9ca3af', letterSpacing: '0.08em' }}
          >
            {studios.length} עסקים ברחבי הארץ
          </motion.p>
        )}

        {/* ── Search field ── */}
        <motion.div
          ref={wrapperRef}
          className="w-full relative mb-4"
          style={{ maxWidth: contentMaxW }}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.16, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <form onSubmit={handleSubmit}>
            <div className="relative">
              <input
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                onFocus={() => query.length >= 2 && setShowSugs(true)}
                placeholder="עיר, שם עסק, בעלת עסק..."
                autoComplete="off"
                autoCorrect="off"
                className="w-full font-heebo text-[15px] outline-none transition-all duration-200"
                style={{
                  height: '52px',
                  paddingRight: '18px',
                  paddingLeft: '52px',
                  borderRadius: '14px',
                  background: '#ffffff',
                  border: '1.5px solid #e5e7eb',
                  boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
                  color: '#1a1a1a',
                }}
                onFocus={e => {
                  e.target.style.borderColor = '#1a6b7a'
                  e.target.style.boxShadow = '0 0 0 3px rgba(26,107,122,0.12), 0 2px 12px rgba(0,0,0,0.06)'
                }}
                onBlur={e => {
                  e.target.style.borderColor = '#e5e7eb'
                  e.target.style.boxShadow = '0 2px 12px rgba(0,0,0,0.06)'
                }}
              />
              <button
                type="submit"
                aria-label="חיפוש"
                className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center justify-center rounded-xl transition-all hover:scale-110 active:scale-95"
                style={{ width: '36px', height: '36px', background: 'rgba(26,107,122,0.10)' }}
              >
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none"
                  stroke="#1a6b7a" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"/>
                  <path d="m21 21-4.35-4.35"/>
                </svg>
              </button>
            </div>
          </form>

          <AnimatePresence>
            {showSuggestions && suggestions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -6, scaleY: 0.94 }}
                animate={{ opacity: 1, y: 0, scaleY: 1 }}
                exit={{ opacity: 0, y: -4, scaleY: 0.96 }}
                transition={{ duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 8px)', right: 0, left: 0,
                  background: 'rgba(255,255,255,0.98)',
                  border: '1px solid rgba(26,107,122,0.18)',
                  borderRadius: '14px',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                  overflow: 'hidden', zIndex: 20,
                  transformOrigin: 'top center',
                }}
              >
                {suggestions.map((s, i) => (
                  <motion.button
                    key={s.label + s.kind}
                    onClick={() => handleSelect(s.label)}
                    className="w-full flex items-center gap-3 px-4 py-2.5 font-heebo text-[14px] text-right transition-colors"
                    style={{ borderBottom: i < suggestions.length - 1 ? '1px solid rgba(0,0,0,0.05)' : 'none' }}
                    whileHover={{ background: 'rgba(232,244,246,0.8)' }}
                    initial={{ opacity: 0, x: 6 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.03 }}
                  >
                    <span className="text-[15px] shrink-0">{s.kind === 'business' ? '🏪' : '📍'}</span>
                    <span className="flex-1 text-right text-zinc-800 truncate">{s.label}</span>
                    <span
                      className="shrink-0 text-[10px] rounded-full px-2 py-0.5"
                      style={{
                        background: s.kind === 'business' ? 'rgba(26,107,122,0.10)' : 'rgba(0,0,0,0.05)',
                        color: s.kind === 'business' ? '#1a6b7a' : '#888',
                      }}
                    >
                      {s.kind === 'business' ? 'עסק' : 'עיר'}
                    </span>
                  </motion.button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* ── 4 Category cards ── */}
        <motion.div
          className="w-full mb-4"
          style={{ maxWidth: contentMaxW }}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.22, duration: 0.45 }}
        >
          <div className="flex gap-2.5">
            {CATEGORIES.map((cat, i) => {
              const meta = categoryMeta(cat)
              const Icon = CATEGORY_ICONS[cat]
              return (
                <motion.button
                  key={cat}
                  onClick={() => onCategorySelect(cat)}
                  whileHover={{ y: -3, boxShadow: '0 8px 24px rgba(26,107,122,0.14)' }}
                  whileTap={{ scale: 0.93 }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.24 + i * 0.05, duration: 0.38 }}
                  className="flex-1 flex flex-col items-center justify-center font-heebo"
                  style={{
                    padding: '14px 8px 12px',
                    borderRadius: '14px',
                    background: '#ffffff',
                    border: '1.5px solid #e5e7eb',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                    color: '#1a6b7a',
                    gap: '8px',
                    transition: 'box-shadow 0.2s, transform 0.2s',
                    cursor: 'pointer',
                    minWidth: 0,
                  }}
                >
                  {Icon && <Icon />}
                  <span style={{ fontSize: '12px', fontWeight: 600, color: '#374151' }}>{meta.label}</span>
                </motion.button>
              )
            })}
          </div>
        </motion.div>

        {/* ── קרוב אליי button ── */}
        <motion.div
          className="w-full mb-3"
          style={{ maxWidth: contentMaxW }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.32, duration: 0.4 }}
        >
          <motion.button
            onClick={handleGeoClick}
            disabled={geoLoading}
            whileHover={{ scale: 1.01, boxShadow: '0 4px 16px rgba(26,107,122,0.20)' }}
            whileTap={{ scale: 0.98 }}
            className="w-full flex items-center justify-center gap-2.5 font-heebo font-medium text-[14px] transition-all"
            style={{
              height: '48px',
              borderRadius: '14px',
              background: '#ffffff',
              border: '1.5px solid #1a6b7a',
              color: '#1a6b7a',
              boxShadow: '0 2px 8px rgba(26,107,122,0.08)',
            }}
          >
            {geoLoading ? (
              <span className="w-4 h-4 border-2 border-[#1a6b7a] border-t-transparent rounded-full animate-spin" />
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="3"/>
                <path d="M12 2v3M12 19v3M2 12h3M19 12h3"/>
                <circle cx="12" cy="12" r="8" strokeDasharray="3 2" opacity="0.35"/>
              </svg>
            )}
            <span>קרוב אליי</span>
          </motion.button>
        </motion.div>

        {/* Geo error toast */}
        <AnimatePresence>
          {localGeoErr && (
            <motion.div className="w-full mb-3" style={{ maxWidth: contentMaxW }}>
              <GeoToast message={localGeoErr} onClose={clearGeoErr} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Favorites + History buttons — styled like category cards ── */}
        <motion.div
          className="w-full flex gap-2.5 mb-4"
          style={{ maxWidth: contentMaxW }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.38, duration: 0.4 }}
        >
          {[
            {
              key: 'fav',
              active: showFavorites,
              onToggle: () => setShowFavorites(f => !f),
              Icon: HeartIcon,
              label: 'שאהבתי',
              count: favStudios.length,
            },
            {
              key: 'history',
              active: showHistory,
              onToggle: () => setShowHistory(h => !h),
              Icon: ClockIcon,
              label: 'היסטוריה',
              count: historyStudios.length,
            },
          ].map(({ key, active, onToggle, Icon, label, count }) => (
            <motion.button
              key={key}
              onClick={onToggle}
              whileHover={{ y: -3, boxShadow: '0 8px 24px rgba(26,107,122,0.14)' }}
              whileTap={{ scale: 0.93 }}
              className="flex-1 flex flex-col items-center justify-center font-heebo"
              style={{
                padding: '14px 8px 12px',
                borderRadius: '14px',
                background: active ? 'rgba(26,107,122,0.07)' : '#ffffff',
                border: active ? '1.5px solid #1a6b7a' : '1.5px solid #e5e7eb',
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                color: '#1a6b7a',
                gap: '8px',
                cursor: 'pointer',
              }}
            >
              <Icon />
              <span style={{ fontSize: '12px', fontWeight: 600, color: '#374151' }}>
                {label}{count > 0 ? ` (${count})` : ''}
              </span>
            </motion.button>
          ))}
        </motion.div>

        {/* ── Favorites section (collapsible) ── */}
        <AnimatePresence>
          {showFavorites && (
            <motion.div
              className="w-full mb-5"
              style={{ maxWidth: contentMaxW, overflow: 'hidden' }}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              {favStudios.length > 0 ? (
                <>
                  <SectionTitle icon="❤️" title="שאהבתי" />
                  <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
                    {favStudios.map((s, i) => (
                      <StudioMiniCard key={s.id} studio={s} index={i} onClick={handleStudioClick} />
                    ))}
                  </div>
                </>
              ) : (
                <p className="font-heebo text-[13px] text-center py-4" style={{ color: '#9ca3af' }}>
                  עדיין לא סימנת אהובים ❤️
                </p>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── History section (collapsible) ── */}
        <AnimatePresence>
          {showHistory && (
            <motion.div
              className="w-full mb-5"
              style={{ maxWidth: contentMaxW, overflow: 'hidden' }}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              {historyStudios.length > 0 ? (
                <>
                  <SectionTitle icon="🕐" title="ביקרתי לאחרונה" />
                  <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
                    {historyStudios.map((s, i) => (
                      <StudioMiniCard key={s.id ?? i} studio={s} index={i} onClick={handleStudioClick} />
                    ))}
                  </div>
                </>
              ) : (
                <p className="font-heebo text-[13px] text-center py-4" style={{ color: '#9ca3af' }}>
                  עדיין לא ביקרת בעסקים 🕐
                </p>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Nearby section — always shown when studios exist ── */}
        {nearbyStudios.length > 0 && (
          <motion.div
            className="w-full mb-5"
            style={{ maxWidth: contentMaxW }}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.42, duration: 0.35 }}
          >
            <SectionTitle
              icon="📍"
              title="עסקים קרובים אליך"
              subtitle={userLocation
                ? "ממוינים לפי מרחק מהמיקום הנוכחי שלך"
                : "אפשר גישה למיקום לסידור לפי מרחק"}
            />
            <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
              {nearbyStudios.map(s => (
                <StudioMiniCard
                  key={s.id}
                  studio={s}
                  dist={s.dist}
                  onClick={handleStudioClick}
                />
              ))}
            </div>
          </motion.div>
        )}

        {/* SEO hidden */}
        <div className="sr-only" aria-hidden="true">
          {studios.map(s => (
            <span key={s.id}>{s.business_name} {s.city} {s.type} </span>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
