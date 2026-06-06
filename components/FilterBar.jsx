'use client'
import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CATEGORIES, categoryMeta } from '@/lib/categories'
import { ISRAELI_CITIES } from '@/lib/israeli-cities'

const TYPES = ['הכל', ...CATEGORIES]

/* ── Reusable suggestion builder (same logic as SearchHome) ─────────── */
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

export default function FilterBar({ filters, onChange, studios = [] }) {
  const [focused, setFocused]             = useState(false)
  const [suggestions, setSuggestions]     = useState([])
  const [showDropdown, setShowDropdown]   = useState(false)
  const wrapperRef                        = useRef(null)
  const activeTypeColor = filters.type === 'הכל' ? '#18181B' : categoryMeta(filters.type).color

  /* Rebuild suggestions whenever search changes */
  useEffect(() => {
    if (filters.search.length >= 2) {
      setSuggestions(buildSuggestions(studios, filters.search))
      setShowDropdown(true)
    } else {
      setSuggestions([])
      setShowDropdown(false)
    }
  }, [filters.search, studios])

  /* Close on outside click */
  useEffect(() => {
    const fn = e => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target))
        setShowDropdown(false)
    }
    document.addEventListener('mousedown', fn)
    return () => document.removeEventListener('mousedown', fn)
  }, [])

  const handleSelect = useCallback(label => {
    onChange({ ...filters, search: label })
    setShowDropdown(false)
  }, [filters, onChange])

  const handleKey = e => {
    if (e.key === 'Escape') setShowDropdown(false)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.12, duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
      className="flex-shrink-0 bg-white/90 backdrop-blur-sm border-b border-zinc-100
                 px-4 pt-3 pb-2.5 flex flex-col gap-2"
    >
      {/* Row 1 — Search + autocomplete */}
      <div ref={wrapperRef} className="relative">
        <div
          className={`relative flex items-center gap-2 border rounded-full px-3.5 py-2
                      w-full transition-all duration-300
                      ${focused
                        ? 'border-[#1a6b7a] shadow-[0_0_0_3px_rgba(26,107,122,0.12)] bg-white'
                        : 'border-zinc-200 bg-zinc-50 hover:border-zinc-300'}`}
        >
          <svg className="w-3.5 h-3.5 text-zinc-400 shrink-0" fill="none" viewBox="0 0 24 24"
               stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="עיר, שם או בעלת עסק..."
            value={filters.search}
            onChange={e => onChange({ ...filters, search: e.target.value })}
            onFocus={() => { setFocused(true); if (filters.search.length >= 2) setShowDropdown(true) }}
            onBlur={() => setFocused(false)}
            onKeyDown={handleKey}
            className="flex-1 text-[13px] bg-transparent outline-none text-zinc-800
                       placeholder-zinc-400 font-heebo min-w-0"
            dir="rtl"
            autoComplete="off"
            autoCorrect="off"
          />
          {filters.search && (
            <motion.button
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              onClick={() => { onChange({ ...filters, search: '' }); setShowDropdown(false) }}
              className="text-zinc-400 hover:text-zinc-700 transition-colors shrink-0"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24"
                   stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </motion.button>
          )}
        </div>

        {/* Autocomplete dropdown */}
        <AnimatePresence>
          {showDropdown && suggestions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -6, scaleY: 0.94 }}
              animate={{ opacity: 1, y: 0, scaleY: 1 }}
              exit={{ opacity: 0, y: -4, scaleY: 0.96 }}
              transition={{ duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
              style={{
                position: 'absolute',
                top: 'calc(100% + 6px)',
                right: 0, left: 0,
                background: 'rgba(255,255,255,0.98)',
                border: '1px solid rgba(160,124,48,0.18)',
                borderRadius: '14px',
                boxShadow: '0 8px 28px rgba(0,0,0,0.12)',
                overflow: 'hidden',
                zIndex: 200,
                transformOrigin: 'top center',
              }}
            >
              {suggestions.map((s, i) => (
                <motion.button
                  key={s.label + s.kind}
                  onMouseDown={e => { e.preventDefault(); handleSelect(s.label) }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 font-heebo text-[13px] text-right transition-colors"
                  style={{ borderBottom: i < suggestions.length - 1 ? '1px solid rgba(0,0,0,0.05)' : 'none' }}
                  whileHover={{ background: 'rgba(250,246,238,0.9)' }}
                >
                  <span className="text-[14px] shrink-0">{s.kind === 'business' ? '🏪' : '📍'}</span>
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
          )}
        </AnimatePresence>
      </div>

      {/* Row 2 — Category chips */}
      <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
        {TYPES.map(t => (
          <button
            key={t}
            onClick={() => onChange({ ...filters, type: t })}
            className="relative shrink-0 px-3.5 py-1.5 rounded-full text-[12px] font-heebo font-medium"
          >
            {filters.type === t && (
              <motion.div
                layoutId="type-chip"
                className="absolute inset-0 rounded-full"
                style={{ background: t === 'הכל' ? '#18181B' : activeTypeColor }}
                transition={{ type: 'spring', stiffness: 420, damping: 30 }}
              />
            )}
            <span className={`relative z-10 transition-colors duration-200
              ${filters.type === t ? 'text-white' : 'text-zinc-500 hover:text-zinc-900'}`}>
              {t}
            </span>
          </button>
        ))}
      </div>
    </motion.div>
  )
}
