'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { CATEGORIES, categoryMeta } from '@/lib/categories'

export default function SearchHome({ studios, filters, onSearch, onCategorySelect, onGeolocate, onOpenPromo }) {
  const [query, setQuery] = useState(filters.search || '')

  const handleSubmit = e => {
    e.preventDefault()
    if (query.trim()) onSearch(query.trim())
  }

  return (
    <motion.div
      className="fixed inset-0 z-[1000] flex flex-col overflow-hidden"
      style={{ background: 'linear-gradient(170deg, #fffef9 0%, #faf6ee 40%, #f5f0e8 100%)' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -20, filter: 'blur(4px)', transition: { duration: 0.25 } }}
      transition={{ duration: 0.3 }}
      dir="rtl"
    >
      {/* Gold radial glow — top center */}
      <div className="absolute pointer-events-none" style={{
        top: '-10%', left: '50%', transform: 'translateX(-50%)',
        width: '100vw', height: '65vh',
        background: 'radial-gradient(ellipse at center top, rgba(201,168,76,0.17) 0%, transparent 60%)',
        filter: 'blur(55px)',
      }} />
      {/* Warm pink accent — bottom left */}
      <div className="absolute pointer-events-none" style={{
        bottom: '8%', left: '-5%',
        width: '50vw', height: '35vh',
        background: 'radial-gradient(ellipse, rgba(232,114,154,0.06) 0%, transparent 70%)',
        filter: 'blur(60px)',
      }} />

      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 pb-14 overflow-hidden">

        {/* RISE — hero wordmark */}
        <motion.button
          onClick={onOpenPromo}
          initial={{ opacity: 0, y: -24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.04, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          whileHover={{ opacity: 0.72 }}
          whileTap={{ scale: 0.97 }}
          className="font-frank font-bold leading-none mb-3 transition-opacity"
          style={{
            fontSize: 'clamp(54px, 18vw, 96px)',
            color: '#a07c30',
            letterSpacing: '0.22em',
          }}
        >
          RISE
        </motion.button>

        {/* Subtitle — professional tagline */}
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.5 }}
          className="font-heebo text-center mb-8"
          style={{ fontSize: '13px', color: '#b8a485', letterSpacing: '0.18em' }}
        >
          ספריית סטודיואות יופי
        </motion.p>

        {/* Search bar */}
        <motion.form
          onSubmit={handleSubmit}
          className="w-full mb-4"
          style={{ maxWidth: '440px' }}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="relative">
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="עיר או שם עסק..."
              autoComplete="off"
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
              onFocus={e => {
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
        </motion.form>

        {/* Category chips */}
        <motion.div
          className="flex items-center gap-2 flex-wrap justify-center mb-6"
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

        {/* Geo button */}
        <motion.button
          onClick={onGeolocate}
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
          <span>📍</span>
          <span>קרוב אליי</span>
        </motion.button>
      </main>

      {/* SEO — visually hidden, crawlable in SSR HTML */}
      <div className="sr-only" aria-hidden="true">
        {studios.map(s => (
          <span key={s.id}>{s.business_name} {s.city} {s.type} {s.owner_name} </span>
        ))}
        <span>סטודיו גבות לק מספרה קוסמטיקה ישראל</span>
      </div>
    </motion.div>
  )
}
