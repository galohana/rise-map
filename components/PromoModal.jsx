'use client'
import { useEffect } from 'react'
import { motion } from 'framer-motion'

const GOLD = '#C9A070'

export default function PromoModal({ onClose }) {
  useEffect(() => {
    const onKey = e => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const points = [
    'עיצוב אישי ב-100%',
    'מהאיכותיים בארץ',
    'האתר שלך מוכן תוך יומיים עסקים',
    'כמעט תמיד יש מבצע',
  ]

  return (
    <motion.div
      className="fixed inset-0 z-[1200] flex items-center justify-center p-5"
      style={{ background: 'rgba(28,25,22,0.45)', backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)' }}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={onClose}
      dir="rtl"
    >
      <motion.div
        onClick={e => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.9, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92 }}
        transition={{ type: 'spring', stiffness: 320, damping: 26 }}
        className="relative w-full max-w-sm rounded-[24px] overflow-hidden p-7 text-center"
        style={{
          background: 'rgba(250,248,245,0.92)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          border: `1.5px solid ${GOLD}`,
          boxShadow: `0 20px 60px rgba(28,25,22,0.28), 0 0 0 1px ${GOLD}22`,
        }}
      >
        {/* Close */}
        <button onClick={onClose} aria-label="סגור"
          className="absolute top-3.5 left-3.5 w-8 h-8 rounded-full bg-white/70 hover:bg-white
                     flex items-center justify-center text-zinc-600 shadow-sm transition">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Logo */}
        <div className="mx-auto w-16 h-16 rounded-full bg-[#1C1916] flex items-center justify-center mb-4
                        shadow-[0_6px_20px_rgba(28,25,22,0.3)]">
          <span className="font-frank text-[22px] font-black tracking-wide" style={{ color: GOLD }}>R</span>
        </div>

        <h2 className="font-frank text-[24px] font-bold text-[#1C1916] leading-tight mb-3">
          אתר קביעת תורים שנראה כמוך
        </h2>

        {/* Points */}
        <ul className="space-y-1.5 mb-6">
          {points.map(p => (
            <li key={p} className="flex items-center justify-center gap-2 text-[13.5px] font-heebo text-[#6B6460]">
              <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: GOLD }} />
              {p}
            </li>
          ))}
        </ul>

        {/* Primary CTA — build a site */}
        <a href="https://rise-builder.vercel.app" target="_blank" rel="noopener noreferrer"
           className="flex items-center justify-center gap-2 w-full h-12 rounded-2xl mb-3
                      font-heebo font-bold text-[15px] text-white transition-transform active:scale-[0.98]"
           style={{ background: GOLD, boxShadow: `0 6px 20px ${GOLD}66` }}>
          בניית אתר
          <span className="w-5 h-5 rounded-full bg-white/25 flex items-center justify-center text-[11px]">←</span>
        </a>

        {/* WhatsApp CTA */}
        <a href="https://wa.me/972505450408" target="_blank" rel="noopener noreferrer"
           className="flex items-center justify-center gap-2 w-full h-12 rounded-2xl
                      font-heebo font-bold text-[15px] text-white transition-transform active:scale-[0.98]"
           style={{ background: '#25D366', boxShadow: '0 6px 20px rgba(37,211,102,0.4)' }}>
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 4a8 8 0 00-6.9 12l-1 3.6 3.7-1A8 8 0 1012 4zm0 1.6a6.4 6.4 0 11-3.3 11.9l-.3-.2-2.2.6.6-2.1-.2-.3A6.4 6.4 0 0112 5.6zm3.6 8c-.2-.1-1.2-.6-1.3-.6-.2-.1-.3-.1-.4.1l-.6.7c-.1.1-.2.1-.4 0a5.2 5.2 0 01-2.6-2.3c-.2-.3.2-.3.5-1 0-.1 0-.2 0-.3l-.6-1.4c-.1-.3-.3-.3-.4-.3h-.4a.8.8 0 00-.6.3c-.2.2-.7.7-.7 1.7s.8 2 .9 2.1c.1.2 1.6 2.5 3.9 3.4 1.5.6 2 .6 2.7.5.4 0 1.2-.5 1.4-1 .2-.5.2-.9.1-1z"/>
          </svg>
          דברו איתנו
        </a>
      </motion.div>
    </motion.div>
  )
}
