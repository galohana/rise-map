'use client'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { categoryMeta, pinGlyph } from '@/lib/categories'

/* Detect desktop (>=1024px) vs mobile to switch panel behaviour. */
function useIsDesktop() {
  const [desktop, setDesktop] = useState(
    typeof window !== 'undefined' ? window.matchMedia('(min-width: 1024px)').matches : true
  )
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)')
    const fn = e => setDesktop(e.matches)
    mq.addEventListener('change', fn)
    return () => mq.removeEventListener('change', fn)
  }, [])
  return desktop
}

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05, delayChildren: 0.12 } },
}
const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 380, damping: 30 } },
}

function SectionDivider() {
  return <div className="h-px bg-zinc-200/70 mx-1" />
}

export default function StudioPanel({ studio, onClose }) {
  const isDesktop = useIsDesktop()
  const { color, soft } = categoryMeta(studio.type)
  const glyph = pinGlyph(studio)

  useEffect(() => {
    const onKey = e => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const lat = Number(studio.lat)
  const lng = Number(studio.lng)
  const wazeUrl = `https://waze.com/ul?ll=${lat},${lng}&navigate=yes`

  const hasAge = studio.owner_age !== null && studio.owner_age !== undefined && studio.owner_age !== ''
  const hasYears = studio.years_experience !== null && studio.years_experience !== undefined && studio.years_experience !== ''
  const hasSpecialty = Boolean(studio.specialty && String(studio.specialty).trim())
  const hasDescription = Boolean(studio.custom_description && String(studio.custom_description).trim())
  const hasUrl = Boolean(studio.url && String(studio.url).trim())

  const panelMotion = isDesktop
    ? {
        initial: { x: 400, opacity: 0 },
        animate: { x: 0, opacity: 1 },
        exit: { x: 400, opacity: 0 },
        transition: { type: 'spring', stiffness: 300, damping: 30 },
      }
    : {
        initial: { y: '100%' },
        animate: { y: 0 },
        exit: { y: '100%' },
        transition: { type: 'spring', stiffness: 350, damping: 35 },
      }

  const glass = {
    background: 'rgba(255,255,255,0.72)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    border: `1.5px solid ${color}`,
    boxShadow: `0 8px 40px ${color}33, 0 2px 12px rgba(0,0,0,0.08)`,
  }

  const positionClass = isDesktop
    ? 'top-3 bottom-3 right-3 w-[380px] rounded-[20px]'
    : 'inset-x-0 bottom-0 h-[75vh] rounded-t-[24px]'

  return (
    <>
      {/* Overlay */}
      <motion.div
        className="fixed inset-0 z-[1100] bg-black"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.15 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        onClick={onClose}
      />

      {/* Panel */}
      <motion.aside
        dir="rtl"
        className={`fixed z-[1101] overflow-hidden flex flex-col ${positionClass}`}
        style={glass}
        {...panelMotion}
        drag={isDesktop ? false : 'y'}
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={{ top: 0, bottom: 0.6 }}
        onDragEnd={(e, info) => { if (!isDesktop && info.offset.y > 110) onClose() }}
      >
        {!isDesktop && (
          <div className="pt-2.5 pb-1 flex justify-center shrink-0 cursor-grab active:cursor-grabbing">
            <div className="w-10 h-1.5 rounded-full bg-zinc-300" />
          </div>
        )}

        <button
          onClick={onClose}
          aria-label="סגור"
          className="absolute top-3 left-3 z-10 w-8 h-8 rounded-full bg-white/70 hover:bg-white
                     flex items-center justify-center text-zinc-600 shadow-sm transition"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="flex-1 overflow-y-auto px-6 pt-6 pb-7 space-y-5"
        >
          {/* 1. HERO */}
          <motion.div variants={item} className="flex flex-col items-center text-center pt-1 relative">
            <span className="absolute top-0 right-0 px-2.5 py-0.5 rounded-full text-[11px] font-heebo font-semibold"
                  style={{ background: soft, color }}>
              {studio.type}
            </span>

            {studio.logo_url ? (
              <img src={studio.logo_url} alt={studio.business_name}
                   className="w-20 h-20 rounded-full object-cover shadow-md"
                   style={{ border: `2px solid ${color}` }} />
            ) : (
              <div className="w-20 h-20 rounded-full flex items-center justify-center text-4xl shadow-md"
                   style={{ background: soft, border: `2px solid ${color}` }}>
                {glyph}
              </div>
            )}

            <h2 className="mt-3 font-frank text-[22px] font-bold text-zinc-900 leading-tight">
              {studio.business_name}
            </h2>
          </motion.div>

          {/* 2. OWNER */}
          {studio.owner_name && (
            <motion.div variants={item} className="text-center">
              <p className="font-heebo text-[15px] text-zinc-700">
                {studio.owner_name}{hasAge ? `, ${studio.owner_age}` : ''}
              </p>
            </motion.div>
          )}

          <motion.div variants={item}><SectionDivider /></motion.div>

          {/* 3. LOCATION + Waze */}
          <motion.div variants={item} className="space-y-3">
            <div className="flex items-center justify-center gap-1.5 text-zinc-600">
              <svg className="w-4 h-4 shrink-0" style={{ color }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round"
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="font-heebo text-[14px] font-medium text-zinc-800">
                {studio.address || studio.city}
              </span>
            </div>

            <a href={wazeUrl} target="_blank" rel="noopener noreferrer"
               className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl
                          font-heebo font-semibold text-[14px] text-white
                          transition-transform active:scale-[0.98]"
               style={{ background: 'linear-gradient(135deg, #2D9CDB 0%, #5B5BD6 100%)',
                        boxShadow: '0 3px 14px rgba(91,91,214,0.35)' }}>
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C7.03 2 3 5.6 3 10c0 1.7.6 3.27 1.62 4.57-.13.9-.5 1.9-1.3 2.6-.3.27-.2.78.18.9 1.6.5 3.3.1 4.5-.7C9.1 17.78 10.5 18 12 18c4.97 0 9-3.6 9-8s-4.03-8-9-8zm-3 8a1.2 1.2 0 110-2.4A1.2 1.2 0 019 10zm6 0a1.2 1.2 0 110-2.4A1.2 1.2 0 0115 10z"/>
              </svg>
              נווט ב-Waze
            </a>
          </motion.div>

          {/* 4. EXPERTISE */}
          {(hasYears || hasSpecialty) && (
            <>
              <motion.div variants={item}><SectionDivider /></motion.div>
              <motion.div variants={item} className="text-center">
                <p className="font-heebo text-[13.5px] text-zinc-600">
                  {hasYears && `${studio.years_experience} שנות ניסיון`}
                  {hasYears && hasSpecialty && ' · '}
                  {hasSpecialty && <span style={{ color }} className="font-medium">{studio.specialty}</span>}
                </p>
              </motion.div>
            </>
          )}

          {/* 5. DESCRIPTION */}
          {hasDescription && (
            <motion.div variants={item}>
              <p className="font-heebo text-[13.5px] leading-relaxed italic text-[#6B5E4F] text-center px-1"
                 style={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {studio.custom_description}
              </p>
            </motion.div>
          )}

          {/* 6. CTA */}
          {hasUrl && (
            <motion.div variants={item} className="pt-1">
              <a href={studio.url} target="_blank" rel="noopener noreferrer"
                 className="flex items-center justify-center gap-2 w-full py-3 rounded-xl
                            font-heebo font-semibold text-[14.5px] text-white
                            transition-transform active:scale-[0.98]"
                 style={{ background: color, boxShadow: `0 4px 16px ${color}55` }}>
                כניסה לאתר
                <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-[11px]">↗</span>
              </a>
            </motion.div>
          )}
        </motion.div>
      </motion.aside>
    </>
  )
}
