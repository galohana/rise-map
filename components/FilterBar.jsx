'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { CATEGORIES, categoryMeta } from '@/lib/categories'

const TYPES = ['הכל', ...CATEGORIES]

export default function FilterBar({ filters, onChange }) {
  const [focused, setFocused] = useState(false)
  const activeTypeColor = filters.type === 'הכל' ? '#18181B' : categoryMeta(filters.type).color

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.12, duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
      className="flex-shrink-0 bg-white/90 backdrop-blur-sm border-b border-zinc-100
                 px-4 pt-3 pb-2.5 flex flex-col gap-2"
    >
      {/* Row 1 — Search */}
      <div
        className={`relative flex items-center gap-2 border rounded-full px-3.5 py-2
                    w-full transition-all duration-300
                    ${focused
                      ? 'border-amber-400 shadow-[0_0_0_3px_rgba(245,158,11,0.12)] bg-white'
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
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="flex-1 text-[13px] bg-transparent outline-none text-zinc-800
                     placeholder-zinc-400 font-heebo min-w-0"
          dir="rtl"
        />
        {filters.search && (
          <motion.button
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={() => onChange({ ...filters, search: '' })}
            className="text-zinc-400 hover:text-zinc-700 transition-colors shrink-0"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24"
                 stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </motion.button>
        )}
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
