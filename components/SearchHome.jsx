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
      className="fixed inset-0 z-[1000] flex flex-col"
      style={{
        background: 'linear-gradient(170deg, #fffef9 0%, #faf6ee 40%, #f5f0e8 100%)',
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -20, filter: 'blur(4px)', transition: { duration: 0.25 } }}
      transition={{ duration: 0.3 }}
      dir="rtl"
    >
      {/* Soft gold radial glow — top center */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: '-5%', left: '50%', transform: 'translateX(-50%)',
          width: '90vw', height: '60vh',
          background: 'radial-gradient(ellipse at center top, rgba(201,168,76,0.18) 0%, transparent 62%)',
          filter: 'blur(50px)',
        }}
      />
      {/* Warm pink accent — bottom left */}
      <div
        className="absolute pointer-events-none"
        style={{
          bottom: '5%', left: '5%',
          width: '40vw', height: '35vh',
          background: 'radial-gradient(ellipse, rgba(232,114,154,0.07) 0%, transparent 70%)',
          filter: 'blur(55px)',
        }}
      />

      {/* Header */}
      <header className="relative z-10 flex items-center justify-center pt-7 pb-2 flex-shrink-0">
        <motion.button
          onClick={onOpenPromo}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05, duration: 0.4 }}
          whileHover={{ opacity: 0.7 }}
          className="font-frank font-bold transition-opacity"
          style={{ fontSize: '20px', color: '#a07c30', letterSpacing: '0.3em' }}
        >
          RISE
        </motion.button>
      </header>

      {/* Main hero */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 pb-16">

        {/* Title */}
        <motion.div
          className="text-center mb-9"
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08, duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        >
          <h1
            className="font-frank text-center leading-[1.12]"
            style={{ fontSize: 'clamp(34px, 8.5vw, 66px)', color: '#1a1714' }}
          >
            כל מה שיפה
            <br />
            <span style={{ color: '#a07c30' }}>קרוב אליך</span>
          </h1>
          <p
            className="font-heebo text-[13px] mt-4"
            style={{ color: '#9a8c7a' }}
          >
            מצאי סטודיו יופי מושלם בקרבתך
          </p>
        </motion.div>

        {/* Search bar */}
        <motion.form
          onSubmit={handleSubmit}
          className="w-full mb-4"
          style={{ maxWidth: '440px' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
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
                background: 'rgba(255,255,255,0.85)',
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
                stroke="#a07c30" strokeWidth="2.2"
                strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
            </button>
          </div>
        </motion.form>

        {/* Category chips */}
        <motion.div
          className="flex items-center gap-2 flex-wrap justify-center mb-6"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.28, duration: 0.55 }}
        >
          {CATEGORIES.map(cat => {
            const meta = categoryMeta(cat)
            return (
              <motion.button
                key={cat}
                onClick={() => onCategorySelect(cat)}
                whileHover={{ scale: 1.07, y: -2 }}
                whileTap={{ scale: 0.93 }}
                className="flex items-center gap-2 font-heebo text-sm"
                style={{
                  padding: '8px 16px',
                  borderRadius: '100px',
                  background: 'rgba(255,255,255,0.75)',
                  border: `1.5px solid ${meta.color}45`,
                  color: meta.text,
                  boxShadow: `0 2px 10px ${meta.color}18`,
                  transition: 'transform 0.15s, box-shadow 0.15s',
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
          transition={{ delay: 0.4 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 font-heebo text-sm transition-all"
          style={{
            padding: '8px 18px',
            borderRadius: '100px',
            border: '1px solid rgba(160,124,48,0.25)',
            color: '#9a8c7a',
            background: 'rgba(255,255,255,0.5)',
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
