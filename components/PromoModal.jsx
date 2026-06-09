'use client'
import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { TEAL } from '@/lib/theme'

export default function PromoModal({ onClose }) {
  useEffect(() => {
    const onKey = e => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const points = [
    'עסקי יופי ישראלים על מפה אחת',
    'גבות, לק, מספרה וקוסמטיקה',
    'חיפוש לפי מיקום, עיר או שם',
    'קביעת תור ישירה מהאתר',
  ]

  return (
    <motion.div
      className="fixed inset-0 z-[1200] flex items-center justify-center p-5"
      style={{
        background: 'rgba(8,38,44,0.55)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      dir="rtl"
    >
      <motion.div
        onClick={e => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.9, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92 }}
        transition={{ type: 'spring', stiffness: 320, damping: 26 }}
        className="relative w-full max-w-sm rounded-[26px] overflow-hidden text-center"
        style={{
          background: 'linear-gradient(160deg, #eff8fa 0%, #f8fdfe 100%)',
          boxShadow: '0 28px 60px rgba(26,107,122,0.18)',
          border: '1px solid rgba(26,107,122,0.10)',
        }}
      >
        {/* Close */}
        <button
          onClick={onClose}
          aria-label="סגור"
          className="absolute top-3.5 left-3.5 w-8 h-8 rounded-full flex items-center
                     justify-center transition"
          style={{ background: 'rgba(26,107,122,0.12)', color: '#1a6b7a' }}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Logo — multiply blend makes the white background fade with teal */}
        <div style={{ padding: '44px 28px 20px' }}>
          <div className="flex justify-center mb-5">
            <img
              src="/rise-logo-mini.webp"
              alt="RISE"
              style={{
                height: 72,
                width: 'auto',
                display: 'block',
                mixBlendMode: 'multiply',
                opacity: 0.92,
              }}
            />
          </div>

          <p className="font-heebo text-[13px]" style={{ color: '#2a7a8a' }}>
            גלי עסקים קרובים אליך וקבעי תור בקלות
          </p>
        </div>

        {/* Body */}
        <div style={{ padding: '4px 28px 28px' }}>
          <ul className="space-y-2.5 mb-6">
            {points.map(p => (
              <li key={p} className="flex items-center gap-3 text-[13.5px] font-heebo text-right"
                style={{ color: '#0d4a56' }}>
                <span
                  className="w-5 h-5 rounded-full shrink-0 flex items-center justify-center"
                  style={{ background: 'rgba(26,107,122,0.15)', color: '#1a6b7a', fontSize: 11, fontWeight: 700 }}
                >
                  ✓
                </span>
                {p}
              </li>
            ))}
          </ul>

          {/* Primary CTA */}
          <a
            href="https://rise-builder.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full h-12 rounded-2xl mb-3
                       font-heebo font-bold text-[15px] transition-transform active:scale-[0.98]"
            style={{
              background: TEAL,
              color: '#fff',
              boxShadow: '0 6px 22px rgba(26,107,122,0.30)',
            }}
          >
            בניית אתר לעסק שלך
            <span className="w-5 h-5 rounded-full flex items-center justify-center text-[11px]"
              style={{ background: 'rgba(255,255,255,0.20)' }}>←</span>
          </a>

          {/* WhatsApp CTA */}
          <a
            href="https://wa.me/972505450408"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full h-12 rounded-2xl
                       font-heebo font-bold text-[15px] text-white transition-transform active:scale-[0.98]"
            style={{ background: '#25D366', boxShadow: '0 6px 20px rgba(37,211,102,0.28)' }}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 4a8 8 0 00-6.9 12l-1 3.6 3.7-1A8 8 0 1012 4zm0 1.6a6.4 6.4 0 11-3.3 11.9l-.3-.2-2.2.6.6-2.1-.2-.3A6.4 6.4 0 0112 5.6zm3.6 8c-.2-.1-1.2-.6-1.3-.6-.2-.1-.3-.1-.4.1l-.6.7c-.1.1-.2.1-.4 0a5.2 5.2 0 01-2.6-2.3c-.2-.3.2-.3.5-1 0-.1 0-.2 0-.3l-.6-1.4c-.1-.3-.3-.3-.4-.3h-.4a.8.8 0 00-.6.3c-.2.2-.7.7-.7 1.7s.8 2 .9 2.1c.1.2 1.6 2.5 3.9 3.4 1.5.6 2 .6 2.7.5.4 0 1.2-.5 1.4-1 .2-.5.2-.9.1-1z"/>
            </svg>
            דברו איתנו
          </a>
        </div>
      </motion.div>
    </motion.div>
  )
}
